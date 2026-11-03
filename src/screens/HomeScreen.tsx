import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  Crown,
  Edit3,
  HelpCircle,
  Play,
  RotateCcw,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  AppLanguage,
  GameModePreset,
  PlayerStatistics,
  ScreenRoute,
  UserProfile,
} from '../models/gameModels';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { ProfileEditModal } from '../components/ProfileEditModal';
import { soundManager } from '../audio/soundManager';

interface HomeScreenProps {
  stats: PlayerStatistics;
  profile: UserProfile;
  language: AppLanguage;
  sfxEnabled: boolean;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateLanguage: (lang: AppLanguage) => void;
  onToggleSfx: () => void;
  onStartMode: (mode: GameModePreset) => void;
  onNavigate: (route: ScreenRoute) => void;
}

/* =========================================================================
   ROYAL ORNATE SVG ASSETS (Victorian Filigree Frame, Crown, Sigils, Dice)
   ========================================================================= */

/** Ornate Victorian Gold Baroque Corner Flourish */
const VictorianCorner: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
}> = ({ position }) => {
  const transform =
    position === 'tr'
      ? 'scale(-1, 1)'
      : position === 'bl'
        ? 'scale(1, -1)'
        : position === 'br'
          ? 'scale(-1, -1)'
          : '';

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-16 h-16 sm:w-20 sm:h-20 pointer-events-none opacity-80"
      style={{ transform }}
    >
      <defs>
        <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#E2B755" />
          <stop offset="75%" stopColor="#9E6E16" />
          <stop offset="100%" stopColor="#5E3D06" />
        </linearGradient>
      </defs>
      {/* Outer corner scrolls */}
      <path
        d="M 6 6 L 6 42 Q 8 28 20 20 Q 28 8 42 6 L 6 6 Z"
        fill="none"
        stroke="url(#goldFiligree)"
        strokeWidth="1.5"
      />
      <path
        d="M 12 12 L 12 36 Q 14 24 24 14 L 36 12"
        fill="none"
        stroke="url(#goldFiligree)"
        strokeWidth="1"
      />
      {/* Intricate spiral acanthus flourish */}
      <path
        d="M 6 6 C 16 12 24 24 28 38 C 30 45 28 52 22 54 C 16 56 12 50 14 44 C 16 38 24 36 28 40"
        fill="none"
        stroke="url(#goldFiligree)"
        strokeWidth="1.5"
      />
      <path
        d="M 6 6 C 12 16 24 24 38 28 C 45 30 52 28 54 22 C 56 16 50 12 44 14 C 38 16 36 24 40 28"
        fill="none"
        stroke="url(#goldFiligree)"
        strokeWidth="1.5"
      />
      {/* Corner leaf tip */}
      <circle cx="10" cy="10" r="2.5" fill="url(#goldFiligree)" />
      <circle cx="28" cy="28" r="2" fill="url(#goldFiligree)" />
    </svg>
  );
};

/** Ornate Gold Corner Bracket / Cap for Sigil Plaques */
const PlaqueCornerCap: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
}> = ({ position }) => {
  const transform =
    position === 'tr'
      ? 'scale(-1, 1)'
      : position === 'bl'
        ? 'scale(1, -1)'
        : position === 'br'
          ? 'scale(-1, -1)'
          : '';

  return (
    <svg
      viewBox="0 0 40 40"
      className="absolute w-6 h-6 sm:w-7 sm:h-7 pointer-events-none z-10"
      style={{
        top: position.startsWith('t') ? 0 : undefined,
        bottom: position.startsWith('b') ? 0 : undefined,
        left: position.endsWith('l') ? 0 : undefined,
        right: position.endsWith('r') ? 0 : undefined,
        transform,
      }}
    >
      <defs>
        <linearGradient id="capGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFAD1" />
          <stop offset="35%" stopColor="#F5D06A" />
          <stop offset="70%" stopColor="#B37D1A" />
          <stop offset="100%" stopColor="#5E3C04" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 24 0 C 18 4 14 10 12 18 C 10 24 4 28 0 30 Z"
        fill="url(#capGold)"
        stroke="#422704"
        strokeWidth="0.8"
      />
      <circle cx="8" cy="8" r="2" fill="#FFFAD1" stroke="#5E3C04" strokeWidth="0.5" />
    </svg>
  );
};

/** Floating 3D Royal Golden Crown */
const RoyalCrown: React.FC = () => (
  <svg viewBox="0 0 120 70" className="w-12 h-7 sm:w-14 sm:h-8 drop-shadow-md">
    <defs>
      <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFCE6" />
        <stop offset="25%" stopColor="#F9DF7B" />
        <stop offset="60%" stopColor="#D99B22" />
        <stop offset="90%" stopColor="#8A5A0A" />
        <stop offset="100%" stopColor="#4A2F02" />
      </linearGradient>
      <radialGradient id="ruby" cx="40%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FF9EA8" />
        <stop offset="50%" stopColor="#D9162E" />
        <stop offset="100%" stopColor="#630410" />
      </radialGradient>
      <radialGradient id="emerald" cx="40%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#B8FCD2" />
        <stop offset="50%" stopColor="#1EAA55" />
        <stop offset="100%" stopColor="#084E22" />
      </radialGradient>
    </defs>
    {/* Crown Base Rim */}
    <rect x="18" y="52" width="84" height="10" rx="3" fill="url(#crownGold)" stroke="#4A2F02" strokeWidth="1" />
    <ellipse cx="60" cy="57" rx="3" ry="2.5" fill="url(#ruby)" />
    <circle cx="36" cy="57" r="2" fill="url(#emerald)" />
    <circle cx="84" cy="57" r="2" fill="url(#emerald)" />

    {/* 5 Crown Peaks with Fleur-de-lis Peaks */}
    <path
      d="M 22 52 L 18 26 L 38 42 L 60 14 L 82 42 L 102 26 L 98 52 Z"
      fill="url(#crownGold)"
      stroke="#4A2F02"
      strokeWidth="1.2"
    />

    {/* Jewel Orbs on Peak Tips */}
    <circle cx="18" cy="24" r="3.5" fill="url(#ruby)" stroke="#4A2F02" strokeWidth="0.8" />
    <circle cx="38" cy="40" r="2.8" fill="url(#crownGold)" stroke="#4A2F02" strokeWidth="0.8" />
    <circle cx="60" cy="12" r="4.5" fill="url(#ruby)" stroke="#4A2F02" strokeWidth="1" />
    <circle cx="82" cy="40" r="2.8" fill="url(#crownGold)" stroke="#4A2F02" strokeWidth="0.8" />
    <circle cx="102" cy="24" r="3.5" fill="url(#ruby)" stroke="#4A2F02" strokeWidth="0.8" />
  </svg>
);

/** Blue House Sigil: Knight Shield */
const BlueShieldSigil: React.FC = () => (
  <svg viewBox="0 0 100 120" className="w-14 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
    <defs>
      <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#CBD5E1" />
        <stop offset="70%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="35%" stopColor="#2563EB" />
        <stop offset="80%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Outer Silver Beveled Shield Rim */}
    <path
      d="M 50 8 C 76 8 88 16 88 44 C 88 80 50 110 50 110 C 50 110 12 80 12 44 C 12 16 24 8 50 8 Z"
      fill="url(#shieldRim)"
      stroke="#0F172A"
      strokeWidth="2"
    />
    {/* Inner Royal Sapphire Field */}
    <path
      d="M 50 14 C 72 14 82 21 82 46 C 82 76 50 102 50 102 C 50 102 18 76 18 46 C 18 21 28 14 50 14 Z"
      fill="url(#shieldBody)"
    />
    {/* Silver Cross Spine */}
    <line x1="50" y1="16" x2="50" y2="100" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.85" />
    <line x1="26" y1="46" x2="74" y2="46" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.85" />
    {/* Specular 3D Highlight */}
    <path
      d="M 50 14 C 64 14 74 19 76 38 C 74 44 60 22 50 20 Z"
      fill="#FFFFFF"
      opacity="0.45"
    />
  </svg>
);

/** Red House Sigil: Imperial Gold Dragon Medallion */
const RedDragonSigil: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg">
    <defs>
      <linearGradient id="goldSigil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9D2" />
        <stop offset="35%" stopColor="#F5CF63" />
        <stop offset="70%" stopColor="#B57F1B" />
        <stop offset="100%" stopColor="#543503" />
      </linearGradient>
    </defs>
    {/* Outer Sun / Medallion Rim */}
    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#goldSigil)" strokeWidth="3" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="url(#goldSigil)" strokeWidth="1" strokeDasharray="2,3" />

    {/* Stylized Triple Coiled Dragon / Wyvern Sigil */}
    <path
      d="M 50 20 C 58 20 64 26 64 34 C 64 42 56 46 50 48 C 42 46 36 40 36 32 C 36 24 44 20 50 20 Z"
      fill="url(#goldSigil)"
      opacity="0.9"
    />
    <path
      d="M 64 34 C 74 38 82 50 78 62 C 74 74 60 78 50 72 C 44 68 40 60 44 54 C 48 50 56 52 56 58 C 56 64 48 66 52 70"
      fill="none"
      stroke="url(#goldSigil)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M 36 32 C 26 38 18 50 22 62 C 26 74 40 78 50 72"
      fill="none"
      stroke="url(#goldSigil)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    {/* Dragon Eye & Flame Wings */}
    <circle cx="50" cy="30" r="2.2" fill="#540808" />
    <path d="M 62 26 L 72 20 L 68 30 Z" fill="url(#goldSigil)" />
    <path d="M 38 26 L 28 20 L 32 30 Z" fill="url(#goldSigil)" />
  </svg>
);

/** Green House Sigil: Golden Winged Griffin Shield */
const GreenGriffinSigil: React.FC = () => (
  <svg viewBox="0 0 100 115" className="w-14 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
    <defs>
      <linearGradient id="griffinGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9D2" />
        <stop offset="40%" stopColor="#F5CF63" />
        <stop offset="75%" stopColor="#B57F1B" />
        <stop offset="100%" stopColor="#543503" />
      </linearGradient>
    </defs>
    {/* Shield Base */}
    <path
      d="M 50 12 C 74 12 84 18 84 46 C 84 76 50 104 50 104 C 50 104 16 76 16 46 C 16 18 26 12 50 12 Z"
      fill="none"
      stroke="url(#griffinGold)"
      strokeWidth="2.5"
    />
    {/* Rampant Griffin Silhouette */}
    <path
      d="M 44 32 C 48 26 56 26 60 30 C 64 34 62 40 56 42 L 66 38 L 74 46 L 64 48 L 70 58 L 58 54 C 58 62 52 72 44 76 C 40 78 36 76 38 70 C 40 64 46 60 44 52 C 40 54 36 60 34 56 C 32 52 38 46 42 44 Z"
      fill="url(#griffinGold)"
    />
    {/* Griffin Wing Spread */}
    <path
      d="M 52 40 C 64 30 76 26 80 20 C 76 32 72 40 60 46"
      fill="none"
      stroke="url(#griffinGold)"
      strokeWidth="2.5"
    />
  </svg>
);

/** Gold House Sigil: Rampant Royal Lion Shield */
const GoldLionSigil: React.FC = () => (
  <svg viewBox="0 0 100 115" className="w-14 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
    <defs>
      <linearGradient id="lionGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#FDE68A" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    {/* Shield Base */}
    <path
      d="M 50 12 C 74 12 84 18 84 46 C 84 76 50 104 50 104 C 50 104 16 76 16 46 C 16 18 26 12 50 12 Z"
      fill="none"
      stroke="url(#lionGold)"
      strokeWidth="2.5"
    />
    {/* Royal Lion Silhouette */}
    <path
      d="M 48 30 C 52 24 60 26 62 32 C 64 38 58 42 54 44 C 60 46 68 44 72 50 C 68 54 62 52 56 54 L 64 64 L 56 68 L 52 60 C 50 68 46 76 38 78 C 34 80 30 74 34 68 C 38 62 42 58 40 50 C 36 52 32 50 34 44 C 36 38 42 36 44 32 Z"
      fill="url(#lionGold)"
    />
    {/* Lion Crown & Claws */}
    <path d="M 50 24 L 54 20 L 58 24 L 62 20 L 66 24 Z" fill="url(#lionGold)" />
    <path d="M 38 72 C 32 76 26 72 24 64" fill="none" stroke="url(#lionGold)" strokeWidth="2" />
  </svg>
);

/** Tiny Center Floating Golden 3D Dice */
const TinyGoldDice: React.FC<{ value: number }> = ({ value }) => {
  const pips: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [
      [30, 30],
      [70, 70],
    ],
    3: [
      [28, 28],
      [50, 50],
      [72, 72],
    ],
    4: [
      [30, 30],
      [70, 30],
      [30, 70],
      [70, 70],
    ],
    5: [
      [28, 28],
      [72, 28],
      [50, 50],
      [28, 72],
      [72, 72],
    ],
    6: [
      [30, 26],
      [70, 26],
      [30, 50],
      [70, 50],
      [30, 74],
      [70, 74],
    ],
  };

  return (
    <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md">
      <defs>
        <linearGradient id="tDiceGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFEE6" />
          <stop offset="40%" stopColor="#F9DF7B" />
          <stop offset="80%" stopColor="#C98C15" />
          <stop offset="100%" stopColor="#6E4405" />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="22"
        fill="url(#tDiceGold)"
        stroke="#422502"
        strokeWidth="3.5"
      />
      {pips[value]?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="7.5" fill="#3D1D03" />
      ))}
    </svg>
  );
};

/** Golden Laurel Leaf Sprig */
const LaurelSprig: React.FC<{ rotate?: number }> = ({ rotate = 0 }) => (
  <svg
    viewBox="0 0 40 40"
    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300/80 pointer-events-none"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path
      d="M 20 4 C 18 12 12 18 4 20 C 12 22 18 28 20 36 C 22 28 28 22 36 20 C 28 18 22 12 20 4 Z"
      fill="currentColor"
    />
  </svg>
);

/** Top & Bottom Ornate Scrollwork Flourish for the Start Button */
const ScrollworkFiligree: React.FC<{ invert?: boolean }> = ({ invert = false }) => (
  <svg
    viewBox="0 0 200 30"
    className="w-32 sm:w-36 h-4 pointer-events-none drop-shadow-sm"
    style={{ transform: invert ? 'scaleY(-1)' : undefined }}
  >
    <path
      d="M 10 24 C 40 24 60 8 100 8 C 140 8 160 24 190 24 C 160 22 140 14 100 14 C 60 14 40 22 10 24 Z"
      fill="url(#goldFiligree)"
    />
    <circle cx="100" cy="8" r="3" fill="#FFFAD1" stroke="#5E3C04" strokeWidth="0.8" />
    <circle cx="70" cy="14" r="1.8" fill="url(#goldFiligree)" />
    <circle cx="130" cy="14" r="1.8" fill="url(#goldFiligree)" />
  </svg>
);

/* =========================================================================
   MAIN OPENING SCREEN COMPONENT
   ========================================================================= */

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  profile,
  language,
  sfxEnabled,
  onUpdateProfile,
  onUpdateLanguage,
  onToggleSfx,
  onStartMode,
  onNavigate,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const t = (k: string) => getTranslation(language, k);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  const handleHouseClick = (houseIndex: number) => {
    soundManager.playClick();
    setSelectedHouse(houseIndex);
    window.setTimeout(() => setSelectedHouse(null), 600);
  };

  const handleStartGameClick = () => {
    soundManager.playClick();
    setIsModeModalOpen(true);
  };

  return (
    <div className="h-full w-full royal-bg text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Victorian Ornate Gold Baroque Corner Flourishes */}
      <div className="absolute top-1 left-1 z-10 pointer-events-none">
        <VictorianCorner position="tl" />
      </div>
      <div className="absolute top-1 right-1 z-10 pointer-events-none">
        <VictorianCorner position="tr" />
      </div>
      <div className="absolute bottom-1 left-1 z-10 pointer-events-none">
        <VictorianCorner position="bl" />
      </div>
      <div className="absolute bottom-1 right-1 z-10 pointer-events-none">
        <VictorianCorner position="br" />
      </div>

      {/* Ornate Gold Outer Filigree Frame Border */}
      <div className="absolute inset-2 sm:inset-3 border border-[#E2B755]/40 rounded-[28px] pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(226,183,85,0.08)]">
        <div className="absolute inset-1 border border-[#E2B755]/20 rounded-[24px]" />
      </div>

      {/* TOP STATUS BAR: Native Phone Notch / Cellular / Clock / Battery + Quick Toggles */}
      <header className="relative z-30 w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs text-amber-200/90 font-semibold tracking-wide">
        {/* Left: Clock */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-bold text-amber-100">9:41</span>
        </div>

        {/* Center / Right: Quick Controls & Battery */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              aria-label={t('language')}
              title={t('language')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0E204A]/90 border border-[#E2B755]/60 hover:border-[#E2B755] active:scale-95 transition-all cursor-pointer shadow-sm text-[11px] text-amber-200 font-bold"
            >
              <span>{currentLangObj.flag}</span>
              <span className="uppercase">{currentLangObj.code}</span>
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-50 w-36 py-1.5 rounded-2xl bg-[#091738] border-2 border-[#E2B755] shadow-2xl flex flex-col gap-0.5 animate-fade-in text-stone-200">
                  <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 border-b border-[#E2B755]/30">
                    {t('language')}
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onUpdateLanguage(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs font-bold flex items-center justify-between text-left hover:bg-[#152B64] cursor-pointer transition-colors ${
                        language === l.code ? 'text-amber-300 bg-[#122556]' : 'text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                      {language === l.code && <span className="text-amber-400 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSfx}
            aria-label={sfxEnabled ? 'Mute Sound' : 'Enable Sound'}
            title={sfxEnabled ? 'Sound On' : 'Sound Muted'}
            className="w-7 h-7 rounded-full bg-[#0E204A]/90 border border-[#E2B755]/60 flex items-center justify-center text-amber-200 active:scale-95 cursor-pointer hover:border-[#E2B755]"
          >
            {sfxEnabled ? (
              <Volume2 className="w-3.5 h-3.5 stroke-[2]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 stroke-[2] opacity-60" />
            )}
          </button>

          {/* Battery Status SVG */}
          <div className="flex items-center gap-1 text-[11px] text-amber-100 font-bold ml-1">
            <svg viewBox="0 0 24 14" className="w-5 h-3 fill-amber-200">
              <rect x="1" y="1" width="19" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="3" width="15" height="8" rx="1" fill="currentColor" />
              <path d="M 21 4 L 21 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[10px]">100%</span>
          </div>
        </div>
      </header>

      {/* MAIN CENTERPIECE: Crown + LUDŌX Title + 4 House Sigils */}
      <main className="relative z-20 w-full flex-1 flex flex-col items-center justify-center px-6 py-2 gap-3 sm:gap-4">
        {/* TITLE LOCKUP: Royal Crown & LUDŌX Serif Wordmark */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Floating Crown above the letter 'O' */}
          <div className="relative z-10 -mb-2 sm:-mb-3 animate-turn-bounce">
            <RoyalCrown />
          </div>

          {/* "LUDŌX" Gold Metallic Wordmark */}
          <h1
            className="font-serif text-5xl sm:text-6xl font-extrabold tracking-[0.16em] uppercase gold-metallic-text select-none text-center leading-none"
            style={{
              textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 24px rgba(245,200,80,0.45)',
            }}
          >
            LUDŌX
          </h1>
        </div>

        {/* THE FOUR HOUSES: 2x2 Grand Sigil Plaques with Center Gold Dice */}
        <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-square flex items-center justify-center">
          {/* 2x2 Grid of House Plaques */}
          <div className="w-full h-full grid grid-cols-2 gap-3.5 sm:gap-4 p-1">
            {/* 1. TOP-LEFT: House of Blue (Knight Shield) */}
            <div
              onClick={() => handleHouseClick(0)}
              role="button"
              tabIndex={0}
              aria-label="House of Blue"
              className={`relative rounded-2xl bg-gradient-to-br from-[#12387e] via-[#092254] to-[#041230] border-2 border-[#E2B755] shadow-[0_8px_20px_rgba(0,0,0,0.65),inset_0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center p-3 cursor-pointer transition-transform duration-200 ${
                selectedHouse === 0 ? 'scale-105 ring-4 ring-amber-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
            >
              <PlaqueCornerCap position="tl" />
              <PlaqueCornerCap position="tr" />
              <PlaqueCornerCap position="bl" />
              <PlaqueCornerCap position="br" />
              <BlueShieldSigil />
            </div>

            {/* 2. TOP-RIGHT: House of Red (Imperial Dragon) */}
            <div
              onClick={() => handleHouseClick(1)}
              role="button"
              tabIndex={0}
              aria-label="House of Red"
              className={`relative rounded-2xl bg-gradient-to-br from-[#7a1020] via-[#520914] to-[#2b040a] border-2 border-[#E2B755] shadow-[0_8px_20px_rgba(0,0,0,0.65),inset_0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center p-3 cursor-pointer transition-transform duration-200 ${
                selectedHouse === 1 ? 'scale-105 ring-4 ring-amber-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
            >
              <PlaqueCornerCap position="tl" />
              <PlaqueCornerCap position="tr" />
              <PlaqueCornerCap position="bl" />
              <PlaqueCornerCap position="br" />
              <RedDragonSigil />
            </div>

            {/* 3. BOTTOM-LEFT: House of Green (Winged Griffin) */}
            <div
              onClick={() => handleHouseClick(2)}
              role="button"
              tabIndex={0}
              aria-label="House of Green"
              className={`relative rounded-2xl bg-gradient-to-br from-[#10542a] via-[#0b381c] to-[#041c0d] border-2 border-[#E2B755] shadow-[0_8px_20px_rgba(0,0,0,0.65),inset_0_0_15px_rgba(22,163,74,0.4)] flex items-center justify-center p-3 cursor-pointer transition-transform duration-200 ${
                selectedHouse === 2 ? 'scale-105 ring-4 ring-amber-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
            >
              <PlaqueCornerCap position="tl" />
              <PlaqueCornerCap position="tr" />
              <PlaqueCornerCap position="bl" />
              <PlaqueCornerCap position="br" />
              <GreenGriffinSigil />
            </div>

            {/* 4. BOTTOM-RIGHT: House of Gold (Rampant Lion) */}
            <div
              onClick={() => handleHouseClick(3)}
              role="button"
              tabIndex={0}
              aria-label="House of Gold"
              className={`relative rounded-2xl bg-gradient-to-br from-[#8a5d0a] via-[#5e3e04] to-[#332101] border-2 border-[#E2B755] shadow-[0_8px_20px_rgba(0,0,0,0.65),inset_0_0_15px_rgba(217,119,6,0.4)] flex items-center justify-center p-3 cursor-pointer transition-transform duration-200 ${
                selectedHouse === 3 ? 'scale-105 ring-4 ring-amber-300' : 'hover:scale-[1.02] active:scale-95'
              }`}
            >
              <PlaqueCornerCap position="tl" />
              <PlaqueCornerCap position="tr" />
              <PlaqueCornerCap position="bl" />
              <PlaqueCornerCap position="br" />
              <GoldLionSigil />
            </div>
          </div>

          {/* Center Laurel Sprigs separating the quadrants */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 pointer-events-none">
            <LaurelSprig rotate={-90} />
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-none">
            <LaurelSprig rotate={90} />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <LaurelSprig rotate={0} />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <LaurelSprig rotate={180} />
          </div>

          {/* Center Diamond of 4 Tiny Golden Dice */}
          <div className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center pointer-events-none z-20">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute -top-1">
                <TinyGoldDice value={1} />
              </div>
              <div className="absolute -bottom-1">
                <TinyGoldDice value={6} />
              </div>
              <div className="absolute -left-1">
                <TinyGoldDice value={3} />
              </div>
              <div className="absolute -right-1">
                <TinyGoldDice value={5} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM CONTROLS: Settings Medallion + Grand START GAME Cartouche + Profile Medallion */}
      <footer className="relative z-30 w-full px-6 pb-6 pt-1 flex flex-col items-center gap-1.5">
        {/* Top Filigree Scrollwork */}
        <ScrollworkFiligree />

        {/* 3-Button Control Bar */}
        <div className="w-full flex items-center justify-between gap-3 sm:gap-4 max-w-[340px]">
          {/* Left: Settings Baroque Medallion */}
          <button
            type="button"
            onClick={() => onNavigate('SETTINGS')}
            aria-label={t('settings')}
            title={t('settings')}
            className="gold-medallion-btn w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer text-[#3D2303] shrink-0"
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Center: Grand Gold Beveled START GAME Button */}
          <button
            type="button"
            onClick={handleStartGameClick}
            aria-label="Start Game"
            className="gold-start-btn flex-1 min-h-[50px] sm:min-h-[54px] px-6 rounded-2xl flex items-center justify-center cursor-pointer text-[#3D2303] shrink-0"
          >
            <span
              className="font-serif text-lg sm:text-xl font-black tracking-[0.14em] uppercase text-[#341B03]"
              style={{
                textShadow: '0 1px 0 rgba(255,255,255,0.85), 0 -1px 0 rgba(70,35,4,0.4)',
              }}
            >
              START GAME
            </span>
          </button>

          {/* Right: User Profile Baroque Medallion */}
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            aria-label={t('edit_profile')}
            title={t('edit_profile')}
            className="gold-medallion-btn w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer text-[#3D2303] shrink-0 text-xl"
          >
            {profile.avatar ? (
              <span>{profile.avatar}</span>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <circle cx="12" cy="8" r="4" />
                <path d="M 4 20 C 4 16 8 14 12 14 C 16 14 20 16 20 20 Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Bottom Filigree Scrollwork */}
        <ScrollworkFiligree invert />
      </footer>

      {/* =========================================================================
         REGAL GAME MODE PICKER MODAL (When START GAME is tapped)
         ========================================================================= */}
      {isModeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-[28px] bg-gradient-to-b from-[#0D224E] via-[#091738] to-[#040C1F] border-2 border-[#E2B755] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(226,183,85,0.25)] flex flex-col gap-4 text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2B755]/30 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-300" />
                <h2 className="font-serif text-lg font-bold text-amber-200 tracking-wider">
                  SELECT GAME MODE
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#122858] border border-[#E2B755]/50 flex items-center justify-center text-amber-200 hover:bg-[#1A387C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Cards */}
            <div className="flex flex-col gap-2.5">
              {/* VS AI Bot */}
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onStartMode(GameModePreset.VS_AI);
                }}
                className="gold-start-btn p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group text-[#341B03]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/20 flex items-center justify-center text-xl">
                    ⚔️
                  </div>
                  <div className="text-left">
                    <div className="font-serif font-black text-sm tracking-wide text-[#341B03]">
                      BATTLE VS AI
                    </div>
                    <div className="text-[11px] font-bold text-[#5C3205]">
                      Solo Offline vs 3 Bot Opponents
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#341B03] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 2 Players */}
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onStartMode(GameModePreset.TWO_PLAYER);
                }}
                className="p-3.5 rounded-2xl bg-[#11244E] hover:bg-[#163066] border border-[#E2B755]/60 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#091738] border border-[#E2B755]/40 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <div className="text-left">
                    <div className="font-serif font-bold text-sm text-amber-200">
                      2 PLAYERS
                    </div>
                    <div className="text-[11px] text-amber-300/70">
                      Pass &amp; Play on this device
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>

              {/* 3 Players */}
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onStartMode(GameModePreset.THREE_PLAYER);
                }}
                className="p-3.5 rounded-2xl bg-[#11244E] hover:bg-[#163066] border border-[#E2B755]/60 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#091738] border border-[#E2B755]/40 flex items-center justify-center text-xl">
                    👑
                  </div>
                  <div className="text-left">
                    <div className="font-serif font-bold text-sm text-amber-200">
                      3 PLAYERS
                    </div>
                    <div className="text-[11px] text-amber-300/70">
                      Pass &amp; Play on this device
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>

              {/* 4 Players */}
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onStartMode(GameModePreset.FOUR_PLAYER);
                }}
                className="p-3.5 rounded-2xl bg-[#11244E] hover:bg-[#163066] border border-[#E2B755]/60 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#091738] border border-[#E2B755]/40 flex items-center justify-center text-xl">
                    🛡️
                  </div>
                  <div className="text-left">
                    <div className="font-serif font-bold text-sm text-amber-200">
                      4 PLAYERS
                    </div>
                    <div className="text-[11px] text-amber-300/70">
                      Classic 4-Way Kingdom Clash
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* Quick Stats & Rules Links */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2B755]/30 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onNavigate('HOW_TO_PLAY');
                }}
                className="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 font-semibold cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('how_to_play')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModeModalOpen(false);
                  onNavigate('STATISTICS');
                }}
                className="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 font-semibold cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t('statistics')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        profile={profile}
        language={language}
        onSave={onUpdateProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};