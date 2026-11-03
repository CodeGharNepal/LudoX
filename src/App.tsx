import { useCallback, useEffect, useState } from 'react';
import {
  AppSettings,
  GameModePreset,
  GameRulesConfig,
  GameState,
  PlayerSetupSlot,
  PlayerStatistics,
  ScreenRoute,
  UserProfile,
} from './models/gameModels';
import { createNewGameState } from './engine/gameEngine';
import { soundManager } from './audio/soundManager';
import {
  loadSettings,
  loadStatistics,
  loadUserProfile,
  recordMatchResult,
  resetStatistics,
  saveSettings,
  saveUserProfile,
} from './storage/localStore';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerSetupScreen } from './screens/PlayerSetupScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultScreen } from './screens/ResultScreen';
import {
  AboutAndroidScreen,
  HowToPlayScreen,
  SettingsScreen,
  StatisticsScreen,
} from './screens/InfoModals';

export default function App() {
  const [route, setRoute] = useState<ScreenRoute>('HOME');
  const [returnRouteAfterRules, setReturnRouteAfterRules] =
    useState<ScreenRoute>('HOME');

  const [selectedPreset, setSelectedPreset] = useState<GameModePreset>(
    GameModePreset.VS_AI
  );
  const [lastMatchSetup, setLastMatchSetup] = useState<{
    slots: PlayerSetupSlot[];
    mode: GameModePreset;
    rules: GameRulesConfig;
  } | null>(null);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<PlayerStatistics>(() => loadStatistics());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());

  useEffect(() => {
    soundManager.configure(settings.sfxEnabled, settings.musicEnabled);
  }, [settings.sfxEnabled, settings.musicEnabled]);

  const handleUpdateProfile = useCallback((next: UserProfile) => {
    setProfile(next);
    saveUserProfile(next);
  }, []);

  const handleUpdateSettings = useCallback((next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
    soundManager.configure(next.sfxEnabled, next.musicEnabled);
  }, []);

  const handleToggleSfx = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, sfxEnabled: !prev.sfxEnabled };
      saveSettings(next);
      soundManager.setSfxEnabled(next.sfxEnabled);
      if (next.sfxEnabled) soundManager.playClick();
      return next;
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, musicEnabled: !prev.musicEnabled };
      saveSettings(next);
      soundManager.setMusicEnabled(next.musicEnabled);
      return next;
    });
  }, []);

  const handleOpenModeSetup = useCallback((mode: GameModePreset) => {
    soundManager.playClick();
    setSelectedPreset(mode);
    setRoute('PLAYER_SETUP');
  }, []);

  const handleStartMatch = useCallback(
    (
      slots: PlayerSetupSlot[],
      mode: GameModePreset,
      rules: GameRulesConfig
    ) => {
      soundManager.playClick();
      setLastMatchSetup({ slots, mode, rules });
      const freshState = createNewGameState(slots, mode, rules);
      setGameState(freshState);
      setRoute('GAMEPLAY');
    },
    []
  );

  const handleRestartCurrentMatch = useCallback(() => {
    if (!lastMatchSetup) return;
    soundManager.playClick();
    const freshState = createNewGameState(
      lastMatchSetup.slots,
      lastMatchSetup.mode,
      lastMatchSetup.rules
    );
    setGameState(freshState);
    setRoute('GAMEPLAY');
  }, [lastMatchSetup]);

  const handleGameFinished = useCallback((finalState: GameState) => {
    setGameState(finalState);

    const humans = finalState.players.filter((p) => p.type === 'HUMAN');
    const humanParticipated = humans.length > 0;
    const humanWon = humans.some((h) => h.color === finalState.winnerColor);
    const totalHumanCaptures = humans.reduce(
      (sum, h) => sum + h.capturesMade,
      0
    );
    const totalHumanSkills = humans.reduce((sum, h) => sum + h.skillsUsed, 0);

    setStats((prev) =>
      recordMatchResult(
        prev,
        humanParticipated,
        humanWon,
        totalHumanCaptures,
        totalHumanSkills
      )
    );
    setRoute('RESULT');
  }, []);

  const handleNavigate = useCallback((target: ScreenRoute) => {
    soundManager.playClick();
    if (target === 'HOW_TO_PLAY') {
      setReturnRouteAfterRules('HOME');
    }
    setRoute(target);
  }, []);

  const renderCurrentScreen = () => {
    if (route === 'PLAYER_SETUP') {
      return (
        <PlayerSetupScreen
          initialMode={selectedPreset}
          defaultDifficulty={settings.defaultDifficulty}
          initialRules={settings.rules}
          profile={profile}
          language={settings.language}
          onBack={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
          onStartMatch={handleStartMatch}
        />
      );
    }

    if (route === 'GAMEPLAY' && gameState) {
      return (
        <GameplayScreen
          gameState={gameState}
          language={settings.language}
          sfxEnabled={settings.sfxEnabled}
          musicEnabled={settings.musicEnabled}
          onUpdateGameState={setGameState}
          onGameFinished={handleGameFinished}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
          onRestartMatch={handleRestartCurrentMatch}
          onOpenRules={() => {
            setReturnRouteAfterRules('GAMEPLAY');
            setRoute('HOW_TO_PLAY');
          }}
          onExitHome={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
        />
      );
    }

    if (route === 'RESULT' && gameState) {
      return (
        <ResultScreen
          gameState={gameState}
          language={settings.language}
          onPlayAgain={handleRestartCurrentMatch}
          onReturnHome={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
        />
      );
    }

    if (route === 'HOW_TO_PLAY') {
      return (
        <HowToPlayScreen
          onBack={() => {
            soundManager.playClick();
            setRoute(returnRouteAfterRules);
          }}
        />
      );
    }

    if (route === 'STATISTICS') {
      return (
        <StatisticsScreen
          stats={stats}
          onResetStats={() => setStats(resetStatistics())}
          onBack={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
        />
      );
    }

    if (route === 'SETTINGS') {
      return (
        <SettingsScreen
          settings={settings}
          profile={profile}
          onUpdateSettings={handleUpdateSettings}
          onUpdateProfile={handleUpdateProfile}
          onResetStats={() => setStats(resetStatistics())}
          onBack={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
        />
      );
    }

    if (route === 'ABOUT') {
      return (
        <AboutAndroidScreen
          onBack={() => {
            soundManager.playClick();
            setRoute('HOME');
          }}
        />
      );
    }

    return (
      <HomeScreen
        stats={stats}
        profile={profile}
        language={settings.language}
        sfxEnabled={settings.sfxEnabled}
        onUpdateProfile={handleUpdateProfile}
        onUpdateLanguage={(l) => handleUpdateSettings({ ...settings, language: l })}
        onToggleSfx={handleToggleSfx}
        onStartMode={handleOpenModeSetup}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <div className="min-h-dvh w-full bg-[#030917] flex items-center justify-center p-0 sm:p-3 md:p-5 select-none overflow-hidden">
      {/* Mobile Android App Frame: 100% full-screen on mobile phones, centered mobile shell on desktop */}
      <div
        className={`w-full max-w-[440px] h-dvh min-h-dvh sm:h-[95dvh] sm:min-h-[720px] sm:max-h-[920px] sm:rounded-[36px] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_0_4px_#C59E38,0_0_0_8px_#1B1208] relative overflow-hidden flex flex-col ${
          route === 'HOME' ? 'royal-bg text-white' : 'wood-tabletop text-[#2C1A0E]'
        }`}
      >
        {renderCurrentScreen()}
      </div>
    </div>
  );
}
