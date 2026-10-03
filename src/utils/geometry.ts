import { Landmark } from '../types/exercise';

/**
 * Calculates the angle in degrees between three points A -> B -> C, with B as the vertex.
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle);
}

/**
 * Calculates the angle of a limb relative to vertical axis (0 = pointing straight down, 90 = horizontal, 180 = straight up)
 */
export function calculateVerticalAngle(origin: Landmark, endPoint: Landmark): number {
  const dx = endPoint.x - origin.x;
  const dy = endPoint.y - origin.y; // In screen coords, positive y is downward
  
  // Angle with downward vertical vector (0, 1)
  const angleRad = Math.atan2(Math.abs(dx), dy);
  let degrees = (angleRad * 180) / Math.PI;
  // If endPoint is above origin (dy < 0), invert
  if (dy < 0) {
    degrees = 180 - Math.abs((Math.atan2(Math.abs(dx), -dy) * 180) / Math.PI);
  }
  return Math.round(degrees);
}

/**
 * Calculates Euclidean distance between two landmarks
 */
export function calculateDistance(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Exponential moving average filter to smooth jittery landmark positions
 */
export class LandmarkSmoother {
  private smoothedLandmarks: Map<number, Landmark> = new Map();
  private alpha: number;

  constructor(alpha: number = 0.6) {
    this.alpha = alpha;
  }

  smooth(landmarks: Landmark[]): Landmark[] {
    return landmarks.map((lm, idx) => {
      const prev = this.smoothedLandmarks.get(idx);
      if (!prev) {
        this.smoothedLandmarks.set(idx, { ...lm });
        return lm;
      }

      const smoothed: Landmark = {
        x: prev.x * (1 - this.alpha) + lm.x * this.alpha,
        y: prev.y * (1 - this.alpha) + lm.y * this.alpha,
        z: (prev.z ?? 0) * (1 - this.alpha) + (lm.z ?? 0) * this.alpha,
        visibility: lm.visibility,
      };

      this.smoothedLandmarks.set(idx, smoothed);
      return smoothed;
    });
  }

  reset() {
    this.smoothedLandmarks.clear();
  }
}
