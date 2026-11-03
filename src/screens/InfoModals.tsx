import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Dices,
  Edit3,
  FolderTree,
  Globe,
  Music,
  RotateCcw,
  Shield,
  Star,
  Trash2,
  Trophy,
  User,
  Volume2,
} from 'lucide-react';
import {
  AiDifficulty,
  AppSettings,
  PlayerStatistics,
  UserProfile,
} from '../models/gameModels';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { ProfileEditModal } from '../components/ProfileEditModal';

interface SubScreenHeaderProps {
  title: string;
  onBack: () => void;
}

const SubScreenHeader: React.FC<SubScreenHeaderProps> = ({ title, onBack }) => (
  <header className="w-full px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between shrink-0">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className="gold-circle-btn w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shrink-0"
    >
      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
    </button>
    <div className="wood-banner px-6 py-2 rounded-2xl">
      <h1 className="font-display text-lg font-bold text-[#FFFDF7] truncate">
        {title}
      </h1>
    </div>
    <div className="w-11" />
  </header>
);

export const HowToPlayScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <div className="h-full w-full text-[#2C1A0E] flex flex-col overflow-y-auto">
      <SubScreenHeader title="How to Play" onBack={onBack} />

      <main className="w-full px-4 py-4 flex flex-col gap-4 flex-1">
        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold text-[#2C1A0E]">
            01. Traditional Rules &amp; Physical Dice
          </h2>
          <ul className="space-y-2.5 text-sm text-[#4A2C14] leading-relaxed">
            <li>
              <strong className="text-[#2C1A0E]">Physical 3D Dice:</strong> Tap the central dice on the board or the golden dice button to throw a physical 3D cube onto the wooden board.
            </li>
            <li>
              <strong className="text-[#2C1A0E]">Starting Deployment:</strong> Roll a{' '}
              <span className="font-mono-num font-bold text-[#2C1A0E]">1</span> (configurable to 6 or 1/6) to deploy a piece from your corner home onto your starting cell.
            </li>
            <li>
              <strong className="text-[#2C1A0E]">Bonus Turns:</strong> Rolling a{' '}
              <span className="font-mono-num font-bold text-[#2C1A0E]">6</span> or{' '}
              <span className="font-mono-num font-bold text-[#2C1A0E]">1</span>, capturing an opponent piece, or reaching the center grants another roll.
            </li>
            <li>
              <strong className="text-[#2C1A0E]">Exact Finish:</strong> Roll the exact remaining steps to enter the four-color central finishing triangle.
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#B87D14]" />
            <h2 className="font-display text-lg font-bold text-[#2C1A0E]">
              02. Corner Zones &amp; Safe Stars
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-[#4A2C14] leading-relaxed">
            <li>
              <strong className="text-[#2C1A0E]">Corner Home Layout:</strong> Blue sits top-left, Yellow top-right, Red bottom-left, and Green bottom-right, each tracking live player progress percentage.
            </li>
            <li>
              <strong className="text-[#2C1A0E]">8 Safe Squares:</strong> The 4 colored starting squares and 4 star-marked squares protect pieces from capture.
            </li>
            <li>
              <strong className="text-[#2C1A0E]">Captures:</strong> Landing on an unprotected opponent piece sends it back to its corner home.
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1E5AA8]" />
            <h2 className="font-display text-lg font-bold text-[#2C1A0E]">
              03. Skill: Aegis Shield
            </h2>
          </div>
          <p className="text-sm text-[#4A2C14] leading-relaxed">
            Protects one of your active pieces on the shared track from capture for{' '}
            <span className="font-mono-num font-bold text-[#2C1A0E]">3 full rounds</span>. Limited to 2 charges per match with a 3-turn cooldown.
          </p>
        </section>

        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Dices className="w-5 h-5 text-[#B87D14]" />
            <h2 className="font-display text-lg font-bold text-[#2C1A0E]">
              04. Skill: Double Dice
            </h2>
          </div>
          <p className="text-sm text-[#4A2C14] leading-relaxed">
            Activate before rolling to throw{' '}
            <span className="font-mono-num font-bold text-[#2C1A0E]">two 3D golden dice</span> onto the board simultaneously for combined movement distance or base deployment plus bonus steps.
          </p>
        </section>
      </main>
    </div>
  );
};

export const StatisticsScreen: React.FC<{
  stats: PlayerStatistics;
  onResetStats: () => void;
  onBack: () => void;
}> = ({ stats, onResetStats, onBack }) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const winPct =
    stats.totalGamesPlayed > 0
      ? ((stats.gamesWon / stats.totalGamesPlayed) * 100).toFixed(1)
      : '0.0';

  const statItems = [
    { label: 'Total Games Played', value: `${stats.totalGamesPlayed}` },
    { label: 'Games Won', value: `${stats.gamesWon}` },
    { label: 'Games Lost', value: `${stats.gamesLost}` },
    { label: 'Win Percentage', value: `${winPct}%` },
    { label: 'Tokens Captured', value: `${stats.tokensCaptured}` },
    { label: 'Best Winning Streak', value: `${stats.bestWinStreak}` },
  ];

  return (
    <div className="h-full w-full text-[#2C1A0E] flex flex-col overflow-y-auto">
      <SubScreenHeader title="Career Statistics" onBack={onBack} />

      <main className="w-full px-4 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-2xl wood-card flex flex-col justify-between gap-2"
            >
              <span className="text-xs font-semibold text-[#6B4A2B]">
                {item.label}
              </span>
              <span className="font-display font-mono-num text-3xl font-extrabold text-[#2C1A0E]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl wood-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#B87D14] shrink-0" />
            <div className="text-sm font-medium text-[#4A2C14]">
              Active Streak:{' '}
              <span className="font-mono-num font-bold text-[#2C1A0E]">
                {stats.currentWinStreak}
              </span>{' '}
              · Skills Used:{' '}
              <span className="font-mono-num font-bold text-[#2C1A0E]">
                {stats.skillsActivated}
              </span>
            </div>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[42px] px-4 rounded-xl bg-[#E8D8B9] hover:bg-[#DFCBA6] border border-[#9E784B] text-xs font-bold text-[#3B2313] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Statistics</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetStats();
                  setConfirmReset(false);
                }}
                className="min-h-[42px] px-4 rounded-xl bg-[#C82E29] text-xs font-bold text-white cursor-pointer whitespace-nowrap"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[42px] px-3 rounded-xl bg-[#E8D8B9] border border-[#9E784B] text-xs font-bold text-[#3B2313] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export const SettingsScreen: React.FC<{
  settings: AppSettings;
  profile: UserProfile;
  onUpdateSettings: (next: AppSettings) => void;
  onUpdateProfile: (next: UserProfile) => void;
  onResetStats: () => void;
  onBack: () => void;
}> = ({
  settings,
  profile,
  onUpdateSettings,
  onUpdateProfile,
  onResetStats,
  onBack,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showAdvancedRules, setShowAdvancedRules] = useState(false);
  const [showDevArchitecture, setShowDevArchitecture] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetDoneMsg, setResetDoneMsg] = useState(false);

  const t = (k: string) => getTranslation(settings.language, k);

  const handleResetConfirm = () => {
    onResetStats();
    setResetConfirmOpen(false);
    setResetDoneMsg(true);
    window.setTimeout(() => setResetDoneMsg(false), 2400);
  };

  return (
    <div className="h-full w-full text-[#2C1A0E] flex flex-col overflow-y-auto">
      <SubScreenHeader title={t('settings')} onBack={onBack} />

      <main className="w-full px-4 py-3 flex flex-col gap-3.5 pb-8">
        {/* Profile Card */}
        <section className="p-4 rounded-2xl wood-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#EAD8B8] border-2 border-[#8C581E] flex items-center justify-center text-2xl shadow-inner">
              {profile.avatar}
            </span>
            <div>
              <div className="text-xs text-[#6B4A2B] font-semibold">{t('player_name')}</div>
              <div className="font-display text-base font-extrabold text-[#2C1A0E]">{profile.name}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="gold-circle-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
            aria-label={t('edit_profile')}
          >
            <Edit3 className="w-4 h-4 stroke-[2.5]" />
          </button>
        </section>

        {/* Language Selection */}
        <section className="p-4 rounded-2xl wood-card flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#2C1A0E]">
            <Globe className="w-4 h-4 text-[#8C581E]" />
            <span>{t('language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, language: lang.code })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${
                    isSelected
                      ? 'gold-cta-btn border-[#5C3906]'
                      : 'bg-[#FAF2DF] border-[#D6C29F] text-[#4A2C14] hover:bg-[#F4E8CD]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Audio & Sound */}
        <section className="p-4 rounded-2xl wood-card flex flex-col gap-3">
          <h2 className="font-display text-sm font-bold text-[#2C1A0E]">
            {t('audio_sound')}
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#4A2C14]" />
              <span className="text-xs font-bold text-[#2C1A0E]">{t('sound_effects')}</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })}
              className={`min-h-[34px] px-3.5 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap ${
                settings.sfxEnabled
                  ? 'gold-cta-btn'
                  : 'bg-[#E8D8B9] border-[#A88458] text-[#5C3D1E]'
              }`}
            >
              {settings.sfxEnabled ? 'On' : 'Muted'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-[#D6C29F]">
            <div className="flex items-center gap-2.5">
              <Music className="w-4 h-4 text-[#4A2C14]" />
              <span className="text-xs font-bold text-[#2C1A0E]">{t('music')}</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
              className={`min-h-[34px] px-3.5 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap ${
                settings.musicEnabled
                  ? 'gold-cta-btn'
                  : 'bg-[#E8D8B9] border-[#A88458] text-[#5C3D1E]'
              }`}
            >
              {settings.musicEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </section>

        {/* AI Skill Tier */}
        <section className="p-4 rounded-2xl wood-card flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#2C1A0E]">{t('ai_difficulty')}</span>
          <div className="flex p-0.5 bg-[#E8D8B9] rounded-xl border border-[#A88458]">
            {([AiDifficulty.EASY, AiDifficulty.MEDIUM, AiDifficulty.HARD] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, defaultDifficulty: diff })}
                className={`min-h-[32px] px-2.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  settings.defaultDifficulty === diff ? 'gold-cta-btn' : 'text-[#4A2C14]'
                }`}
              >
                {diff === 'EASY' ? t('easy') : diff === 'MEDIUM' ? t('medium') : t('hard')}
              </button>
            ))}
          </div>
        </section>

        {/* Hidden/Collapsible Advanced Board Rules */}
        <section className="rounded-2xl wood-card overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvancedRules((prev) => !prev)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF2DF]/50"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8C581E]" />
              <span className="text-xs font-bold text-[#2C1A0E]">
                {showAdvancedRules ? t('hide_advanced') : t('show_advanced')}
              </span>
            </div>
            {showAdvancedRules ? (
              <ChevronUp className="w-4 h-4 text-[#6B4A2B]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6B4A2B]" />
            )}
          </button>

          {showAdvancedRules && (
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-[#D6C29F]/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A2C14]">Bonus Turn on Capture</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      rules: {
                        ...settings.rules,
                        bonusTurnOnCapture: !settings.rules.bonusTurnOnCapture,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.rules.bonusTurnOnCapture ? 'gold-cta-btn' : 'bg-[#E8D8B9] text-[#6B4A2B]'
                  }`}
                >
                  {settings.rules.bonusTurnOnCapture ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D6C29F]/40">
                <span className="font-semibold text-[#4A2C14]">Bonus Turn on Reaching Home</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      rules: {
                        ...settings.rules,
                        bonusTurnOnHome: !settings.rules.bonusTurnOnHome,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.rules.bonusTurnOnHome ? 'gold-cta-btn' : 'bg-[#E8D8B9] text-[#6B4A2B]'
                  }`}
                >
                  {settings.rules.bonusTurnOnHome ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D6C29F]/40">
                <span className="font-semibold text-[#4A2C14]">Exact Home Entry Roll</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      rules: {
                        ...settings.rules,
                        exactHomeRoll: !settings.rules.exactHomeRoll,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.rules.exactHomeRoll ? 'gold-cta-btn' : 'bg-[#E8D8B9] text-[#6B4A2B]'
                  }`}
                >
                  {settings.rules.exactHomeRoll ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D6C29F]/40">
                <span className="font-semibold text-[#4A2C14]">Skills (Shield &amp; Twin Dice)</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      rules: {
                        ...settings.rules,
                        enableSkills: !settings.rules.enableSkills,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.rules.enableSkills ? 'gold-cta-btn' : 'bg-[#E8D8B9] text-[#6B4A2B]'
                  }`}
                >
                  {settings.rules.enableSkills ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Hidden/Collapsible Developer Architecture info */}
        <section className="rounded-2xl wood-card overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDevArchitecture((prev) => !prev)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF2DF]/50"
          >
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#8C581E]" />
              <div>
                <span className="text-xs font-bold text-[#2C1A0E] block">{t('developer_info')}</span>
                <span className="text-[10px] text-[#6B4A2B]">{t('developer_info_desc')}</span>
              </div>
            </div>
            {showDevArchitecture ? (
              <ChevronUp className="w-4 h-4 text-[#6B4A2B]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6B4A2B]" />
            )}
          </button>

          {showDevArchitecture && (
            <div className="px-4 pb-4 pt-2 border-t border-[#D6C29F]/60 flex flex-col gap-2 text-xs">
              <p className="text-[#4A2C14] text-[11px] leading-relaxed">
                Native Android project exists in <code className="bg-[#E8D8B9] px-1 rounded">android/</code> using Jetpack Compose, Kotlin 2.0, ViewModel StateFlow, and DataStore.
              </p>
              <div className="p-2.5 rounded-xl bg-[#2C1A0E] text-[#FFF9EB] font-mono text-[10px] space-y-1">
                <div>cd android</div>
                <div>./gradlew assembleDebug</div>
              </div>
            </div>
          )}
        </section>

        {/* Reset Data */}
        <section className="p-4 rounded-2xl wood-card flex flex-col gap-2">
          {resetDoneMsg && (
            <div className="text-xs text-green-800 font-bold bg-green-100 p-2 rounded-xl text-center">
              {t('reset_stats_done')}
            </div>
          )}

          {!resetConfirmOpen ? (
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#E8D8B9] border border-[#A88458] text-xs font-bold text-[#8C2E29] flex items-center justify-center gap-2 hover:bg-[#DFC8A4] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('reset_stats')}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 p-2 rounded-xl bg-[#F8E7E5] border border-[#E0A8A4]">
              <div className="text-xs font-bold text-[#7A1F1B] text-center">
                {t('reset_stats_confirm')}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="flex-1 py-1.5 rounded-lg bg-[#FAF2DF] text-xs font-bold text-[#4A2C14]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className="flex-1 py-1.5 rounded-lg bg-[#C82E29] text-xs font-bold text-white hover:bg-[#A82420]"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        profile={profile}
        language={settings.language}
        onSave={onUpdateProfile}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

const ANDROID_MODULES = [
  {
    path: 'android/app/build.gradle.kts',
    role: 'Gradle module setup targeting Android 8.0+ (API 26), Kotlin 2.0, Jetpack Compose BOM, Navigation, ViewModel, and DataStore Preferences.',
  },
  {
    path: 'android/app/src/main/java/com/royalludo/game/model/GameModels.kt',
    role: 'Immutable data classes & Neo Classic pigments for Blue, Yellow, Red, and Green players.',
  },
  {
    path: 'android/app/src/main/java/com/royalludo/game/rules/LudoRulesEngine.kt',
    role: '15x15 BoardGeometry mapping Blue (TL), Yellow (TR), Red (BL), Green (BR), 52 shared track cells, 8 safe zones, and exact finish validation.',
  },
  {
    path: 'android/app/src/main/java/com/royalludo/game/ui/components/LudoBoardCanvas.kt',
    role: 'Neo Classic Wooden Jetpack Compose Canvas rendering carved wooden bevels, cream interiors, 3D shaded tokens, and physical center dice bounce.',
  },
  {
    path: 'android/app/src/main/java/com/royalludo/game/viewmodel/LudoViewModel.kt',
    role: 'MVVM StateFlow ViewModel coordinating single-source dice roll generation, physical roll duration lock, AI turns, and DataStore stats.',
  },
];

const APK_BUILD_COMMANDS = `cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.royalludo.game/.MainActivity`;

export const AboutAndroidScreen: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCommands = () => {
    navigator.clipboard?.writeText(APK_BUILD_COMMANDS).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="h-full w-full text-[#2C1A0E] flex flex-col overflow-y-auto">
      <SubScreenHeader title="Android Kotlin Architecture" onBack={onBack} />

      <main className="w-full px-4 py-4 flex flex-col gap-4">
        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold text-[#2C1A0E]">
            Neo Classic Wooden Ludo · Interactive &amp; Android Jetpack Compose
          </h2>
          <p className="text-sm text-[#4A2C14] leading-relaxed">
            Both the interactive web experience and the native Android{' '}
            <strong className="text-[#2C1A0E]">Kotlin + Jetpack Compose + MVVM</strong>{' '}
            source files in <span className="font-mono-num font-bold">/android</span> implement the Neo Classic Wooden Board, Blue/Yellow/Red/Green corner homes, 3D raised tokens, and single-source physical dice rolling.
          </p>
        </section>

        <section className="p-6 rounded-2xl wood-card flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-base font-bold text-[#2C1A0E]">
              Building &amp; Running the Android APK
            </h2>
            <button
              type="button"
              onClick={handleCopyCommands}
              className="gold-cta-btn min-h-[38px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#38210E] border border-[#6E441E] text-xs font-mono-num text-[#FDF5E2] overflow-x-auto leading-relaxed">
            {APK_BUILD_COMMANDS}
          </pre>
        </section>

        <section className="p-6 rounded-2xl wood-card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#8C5B08]" />
            <h2 className="font-display text-base font-bold text-[#2C1A0E]">
              Core Android Modules (/android)
            </h2>
          </div>

          <div className="divide-y divide-[#D6C29F]">
            {ANDROID_MODULES.map((mod) => (
              <div key={mod.path} className="py-3 first:pt-0 last:pb-0">
                <div className="font-mono-num text-xs font-bold text-[#1E5AA8] break-all">
                  {mod.path}
                </div>
                <p className="text-xs text-[#4A2C14] mt-1 leading-relaxed">
                  {mod.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
