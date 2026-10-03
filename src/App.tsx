import React, { useState } from 'react';
import { UserProfile, ExerciseConfig } from './types/exercise';
import { EXERCISES } from './services/exerciseData';
import { loadUserProfile } from './utils/storage';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { WebDashboard } from './components/WebDashboard';
import { MobileDashboard } from './components/MobileDashboard';
import { WorkoutView } from './components/WorkoutView';
import { InteractiveTutorialModal } from './components/InteractiveTutorialModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile());
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard'>('home');
  const [deviceMode, setDeviceMode] = useState<'web' | 'mobile'>('web');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseConfig>(EXERCISES[0]);
  const [activeWorkout, setActiveWorkout] = useState<ExerciseConfig | null>(null);
  const [isExpandedFullscreen, setIsExpandedFullscreen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [detailExercise, setDetailExercise] = useState<ExerciseConfig | null>(null);

  const refreshProfile = () => {
    setProfile(loadUserProfile());
  };

  const handleStartExercise = (exercise: ExerciseConfig) => {
    setSelectedExercise(exercise);
    setActiveWorkout(exercise);
  };

  const handleToggleFullscreen = () => {
    const next = !isExpandedFullscreen;
    setIsExpandedFullscreen(next);
    if (next) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // True Fullscreen Mode (Takes 100% of the display)
  if (activeWorkout && isExpandedFullscreen) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#081310] flex flex-col">
        <WorkoutView
          config={activeWorkout}
          isFullScreen={true}
          onToggleFullScreen={handleToggleFullscreen}
          onExit={() => {
            setIsExpandedFullscreen(false);
            setActiveWorkout(null);
          }}
          onSessionComplete={refreshProfile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#081310] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#112922] via-[#091512] to-[#050C0A] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveWorkout(null);
          setActiveTab(tab);
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        deviceMode={deviceMode}
        onToggleDeviceMode={(mode) => setDeviceMode(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5">
        {activeWorkout ? (
          /* Active Workout Screen */
          deviceMode === 'web' ? (
            /* Widescreen Desktop Studio Mode */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
              <div className="w-full max-w-5xl h-[78vh] min-h-[580px] rounded-3xl overflow-hidden border border-[#1E4337] shadow-2xl relative">
                <WorkoutView
                  config={activeWorkout}
                  isFullScreen={false}
                  onToggleFullScreen={handleToggleFullscreen}
                  onExit={() => setActiveWorkout(null)}
                  onSessionComplete={refreshProfile}
                />
              </div>
            </div>
          ) : (
            /* Mobile Device Frame Mode */
            <div className="w-full max-w-[420px] mx-auto animate-in fade-in duration-300">
              <div className="relative w-full rounded-[44px] bg-[#0A1613] p-3 sm:p-3.5 shadow-2xl border-4 border-[#1B362F] overflow-hidden">
                <div className="relative w-full h-[720px] bg-[#0B1814] rounded-[36px] overflow-hidden">
                  <WorkoutView
                    config={activeWorkout}
                    isFullScreen={false}
                    onToggleFullScreen={handleToggleFullscreen}
                    onExit={() => setActiveWorkout(null)}
                    onSessionComplete={refreshProfile}
                  />
                </div>
              </div>
            </div>
          )
        ) : activeTab === 'home' ? (
          /* Landing Page with Hero Character */
          <LandingPage
            profile={profile}
            onStartExercise={handleStartExercise}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        ) : deviceMode === 'web' ? (
          /* Full Native Web Dashboard */
          <WebDashboard
            profile={profile}
            selectedExercise={selectedExercise}
            onSelectExercise={(ex) => setSelectedExercise(ex)}
            onStartExercise={handleStartExercise}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        ) : (
          /* Mobile Frame Dashboard */
          <MobileDashboard
            profile={profile}
            selectedExercise={selectedExercise}
            onSelectExercise={(ex) => setSelectedExercise(ex)}
            onStartExercise={handleStartExercise}
            onOpenDetails={(ex) => setDetailExercise(ex)}
          />
        )}
      </main>

      {/* Interactive Step-by-Step Tutorial Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onStartWorkout={() => {
          setIsTutorialOpen(false);
          handleStartExercise(selectedExercise);
        }}
      />

      {/* Exercise Detail Modal */}
      {detailExercise && (
        <ExerciseDetailModal
          exercise={detailExercise}
          isOpen={!!detailExercise}
          onClose={() => setDetailExercise(null)}
          onStart={(ex) => {
            setDetailExercise(null);
            handleStartExercise(ex);
          }}
        />
      )}
    </div>
  );
};
