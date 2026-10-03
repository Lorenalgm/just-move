import { Landmark } from '../types/exercise';
import { LandmarkSmoother } from '../utils/geometry';

export interface PoseResults {
  landmarks: Landmark[];
  raw?: unknown;
}

export type PoseCallback = (results: PoseResults) => void;
export type StatusCallback = (status: 'loading' | 'ready' | 'simulating' | 'error', message?: string) => void;

declare global {
  interface Window {
    Pose?: any;
    Camera?: any;
  }
}

export class PoseDetectorService {
  private pose: any = null;
  private camera: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private callback: PoseCallback | null = null;
  private statusCallback: StatusCallback | null = null;
  private isSimulating: boolean = false;
  private simAnimationFrameId: number | null = null;
  private simStartTime: number = 0;
  private smoother = new LandmarkSmoother(0.65);
  private isProcessingFrame: boolean = false;

  public setStatusCallback(cb: StatusCallback) {
    this.statusCallback = cb;
  }

  private emitStatus(status: 'loading' | 'ready' | 'simulating' | 'error', message?: string) {
    if (this.statusCallback) {
      this.statusCallback(status, message);
    }
  }

  /**
   * Waits for MediaPipe script to be available on window
   */
  private async waitForMediaPipe(timeoutMs: number = 10000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (typeof window !== 'undefined' && window.Pose) {
        return true;
      }
      await new Promise((r) => setTimeout(r, 120));
    }
    return typeof window !== 'undefined' && !!window.Pose;
  }

  public async initialize(video: HTMLVideoElement, onResults: PoseCallback): Promise<boolean> {
    this.videoElement = video;
    this.callback = onResults;
    this.emitStatus('loading', 'Carregando modelo de IA (MediaPipe Pose)...');

    const hasMediaPipe = await this.waitForMediaPipe(12000);

    if (hasMediaPipe && window.Pose) {
      try {
        this.pose = new window.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        this.pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.45,
          minTrackingConfidence: 0.45,
        });

        this.pose.onResults((results: any) => {
          this.isProcessingFrame = false;
          if (!this.callback) return;
          if (results && results.poseLandmarks && results.poseLandmarks.length > 0) {
            this.emitStatus('ready', 'Rastreando postura em tempo real');
            this.callback({ landmarks: results.poseLandmarks, raw: results });
          } else {
            this.callback({ landmarks: [], raw: results });
          }
        });

        return true;
      } catch (err) {
        console.warn('MediaPipe Pose initialization error:', err);
        this.emitStatus('error', 'Falha ao inicializar MediaPipe Pose.');
        return false;
      }
    }

    console.warn('MediaPipe Pose script not loaded after timeout.');
    this.emitStatus('error', 'Biblioteca de IA indisponível. Usando modo simulação.');
    return false;
  }

  public async startCamera(): Promise<boolean> {
    if (!this.videoElement) return false;
    this.emitStatus('loading', 'Iniciando câmera...');

    try {
      // 1. Get user media stream directly for maximum browser compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.videoElement.srcObject = stream;
      await this.videoElement.play();

      // 2. If MediaPipe Camera helper exists, use it
      if (typeof window !== 'undefined' && window.Camera && this.pose) {
        try {
          this.camera = new window.Camera(this.videoElement, {
            onFrame: async () => {
              if (this.pose && this.videoElement && !this.isSimulating) {
                try {
                  await this.pose.send({ image: this.videoElement });
                } catch (e) {
                  // ignore frame drop
                }
              }
            },
            width: 640,
            height: 480,
          });
          await this.camera.start();
          this.emitStatus('ready', 'Câmera e IA conectados');
          return true;
        } catch (camErr) {
          console.warn('Camera helper failed, falling back to manual loop', camErr);
        }
      }

      // 3. Fallback requestAnimationFrame loop
      const frameLoop = async () => {
        if (!this.isSimulating && this.videoElement && !this.videoElement.paused && !this.videoElement.ended) {
          if (this.pose && !this.isProcessingFrame) {
            this.isProcessingFrame = true;
            try {
              await this.pose.send({ image: this.videoElement });
            } catch (err) {
              this.isProcessingFrame = false;
            }
          }
          requestAnimationFrame(frameLoop);
        }
      };
      requestAnimationFrame(frameLoop);

      this.emitStatus('ready', 'Câmera e IA conectados');
      return true;
    } catch (err) {
      console.warn('Could not access camera', err);
      this.emitStatus('error', 'Permissão de câmera não concedida ou dispositivo ocupado.');
      return false;
    }
  }

  public startSimulation(exerciseId: string) {
    this.isSimulating = true;
    this.simStartTime = Date.now();
    this.smoother.reset();
    this.emitStatus('simulating', 'Modo Demonstração com Atleta Virtual');

    const loop = () => {
      if (!this.isSimulating) return;

      const elapsed = (Date.now() - this.simStartTime) / 1000;
      const landmarks = this.generateSimulatedLandmarks(exerciseId, elapsed);

      if (this.callback) {
        this.callback({ landmarks });
      }

      this.simAnimationFrameId = requestAnimationFrame(loop);
    };

    this.simAnimationFrameId = requestAnimationFrame(loop);
  }

  public stopSimulation() {
    this.isSimulating = false;
    if (this.simAnimationFrameId !== null) {
      cancelAnimationFrame(this.simAnimationFrameId);
      this.simAnimationFrameId = null;
    }
  }

  public stop() {
    this.stopSimulation();
    if (this.camera && typeof this.camera.stop === 'function') {
      try {
        this.camera.stop();
      } catch {}
    }
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Generates procedurally animated human landmarks matching the exercise cadence
   */
  private generateSimulatedLandmarks(exerciseId: string, t: number): Landmark[] {
    const cycleTime = exerciseId === 'squat' ? 3.5 : 3.0;
    const phase = (Math.sin((t * 2 * Math.PI) / cycleTime - Math.PI / 2) + 1) / 2;

    const cx = 0.5;
    const cy = 0.45;

    const nose: Landmark = { x: cx, y: cy - 0.22, visibility: 0.99 };
    const leftEye: Landmark = { x: cx - 0.02, y: cy - 0.24, visibility: 0.99 };
    const rightEye: Landmark = { x: cx + 0.02, y: cy - 0.24, visibility: 0.99 };

    const shoulderWidth = 0.14;
    const lSh: Landmark = { x: cx - shoulderWidth, y: cy - 0.12, visibility: 0.99 };
    const rSh: Landmark = { x: cx + shoulderWidth, y: cy - 0.12, visibility: 0.99 };

    const hipWidth = 0.09;
    let hipY = cy + 0.14;
    let kneeY = cy + 0.32;
    let ankleY = cy + 0.50;

    let lElb: Landmark;
    let rElb: Landmark;
    let lWri: Landmark;
    let rWri: Landmark;

    if (exerciseId === 'shoulder_abduction') {
      const armAngleRad = (15 + phase * 75) * (Math.PI / 180);
      const armLen = 0.12;
      const foreLen = 0.12;

      lElb = {
        x: lSh.x - Math.sin(armAngleRad) * armLen,
        y: lSh.y + Math.cos(armAngleRad) * armLen,
        visibility: 0.99,
      };
      lWri = {
        x: lElb.x - Math.sin(armAngleRad) * foreLen,
        y: lElb.y + Math.cos(armAngleRad) * foreLen,
        visibility: 0.99,
      };

      rElb = {
        x: rSh.x + Math.sin(armAngleRad) * armLen,
        y: rSh.y + Math.cos(armAngleRad) * armLen,
        visibility: 0.99,
      };
      rWri = {
        x: rElb.x + Math.sin(armAngleRad) * foreLen,
        y: rElb.y + Math.cos(armAngleRad) * foreLen,
        visibility: 0.99,
      };
    } else if (exerciseId === 'squat') {
      hipY += phase * 0.11;
      kneeY += phase * 0.05;

      lElb = { x: lSh.x - 0.04, y: lSh.y + 0.09, visibility: 0.99 };
      rElb = { x: rSh.x + 0.04, y: rSh.y + 0.09, visibility: 0.99 };
      lWri = { x: cx - 0.02, y: cy - 0.02, visibility: 0.99 };
      rWri = { x: cx + 0.02, y: cy - 0.02, visibility: 0.99 };
    } else {
      const armAngleRad = (20 + phase * 70) * (Math.PI / 180);
      lElb = { x: lSh.x - Math.sin(armAngleRad) * 0.11, y: lSh.y + Math.cos(armAngleRad) * 0.11, visibility: 0.99 };
      rElb = { x: rSh.x + Math.sin(armAngleRad) * 0.11, y: rSh.y + Math.cos(armAngleRad) * 0.11, visibility: 0.99 };
      lWri = { x: lElb.x - 0.05, y: lElb.y + 0.05, visibility: 0.99 };
      rWri = { x: rElb.x + 0.05, y: rElb.y + 0.05, visibility: 0.99 };
    }

    const lHip: Landmark = { x: cx - hipWidth, y: hipY, visibility: 0.99 };
    const rHip: Landmark = { x: cx + hipWidth, y: hipY, visibility: 0.99 };

    const lKnee: Landmark = { x: cx - hipWidth - (exerciseId === 'squat' ? phase * 0.04 : 0), y: kneeY, visibility: 0.99 };
    const rKnee: Landmark = { x: cx + hipWidth + (exerciseId === 'squat' ? phase * 0.04 : 0), y: kneeY, visibility: 0.99 };

    const lAnkle: Landmark = { x: cx - hipWidth, y: ankleY, visibility: 0.99 };
    const rAnkle: Landmark = { x: cx + hipWidth, y: ankleY, visibility: 0.99 };

    const lm: Landmark[] = new Array(33).fill({ x: 0, y: 0, visibility: 0 });
    lm[0] = nose;
    lm[2] = leftEye;
    lm[5] = rightEye;
    lm[11] = lSh;
    lm[12] = rSh;
    lm[13] = lElb;
    lm[14] = rElb;
    lm[15] = lWri;
    lm[16] = rWri;
    lm[23] = lHip;
    lm[24] = rHip;
    lm[25] = lKnee;
    lm[26] = rKnee;
    lm[27] = lAnkle;
    lm[28] = rAnkle;

    return lm;
  }
}
