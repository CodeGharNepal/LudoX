import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronUp,
  Dices,
  Play,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import {
  AiDifficulty,
  AppLanguage,
  GameModePreset,
  GameRulesConfig,
  PlayerColor,
  PlayerSetupSlot,
  PlayerType,
  UserProfile,
} from '../models/gameModels';
import { COLOR_PALETTE } from '../engine/boardGeometry';
import { getTranslation } from '../i18n/translations';
import { soundManager } from '../audio/soundManager';

interface PlayerSetupScreenProps {
  initialMode: GameModePreset;
  defaultDifficulty: AiDifficulty;
  initialRules: GameRulesConfig;
  profile: UserProfile;
  language: AppLanguage;
  onBack: () => void;
  onStartMatch: (
    slots: PlayerSetupSlot[],
    mode: GameModePreset,
    rules: GameRulesConfig
  ) => void;
}

const ALL_COLORS: PlayerColor[] = [
  PlayerColor.BLUE,
  PlayerColor.YELLOW,
  PlayerColor.RED,
  PlayerColor.GREEN,
];

function buildPresetSlots(
  mode: GameModePreset,
  defaultDiff: AiDifficulty,
  userName: string = 'Player 1',
  favColor: PlayerColor = PlayerColor.BLUE
): PlayerSetupSlot[] {
  const p1Name = userName || 'Player 1';
  if (mode === GameModePreset.TWO_PLAYER) {
    const p2Color =
      favColor === PlayerColor.BLUE ? PlayerColor.GREEN : PlayerColor.BLUE;
    return [
      {
        enabled: true,
        name: p1Name,
        color: favColor,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 2',
        color: p2Color,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: false,
        name: 'Player 3',
        color: PlayerColor.YELLOW,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: false,
        name: 'Player 4',
        color: PlayerColor.RED,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
    ];
  }

  if (mode === GameModePreset.THREE_PLAYER) {
    return [
      {
        enabled: true,
        name: p1Name,
        color: favColor,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 2',
        color: PlayerColor.YELLOW,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 3',
        color: PlayerColor.GREEN,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: false,
        name: 'Player 4',
        color: PlayerColor.RED,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
    ];
  }

  if (mode === GameModePreset.FOUR_PLAYER) {
    return [
      {
        enabled: true,
        name: p1Name,
        color: favColor,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 2',
        color: PlayerColor.YELLOW,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 3',
        color: PlayerColor.RED,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
      {
        enabled: true,
        name: 'Player 4',
        color: PlayerColor.GREEN,
        type: PlayerType.HUMAN,
        aiDifficulty: defaultDiff,
      },
    ];
  }

  // VS_AI default
  return [
    {
      enabled: true,
      name: p1Name,
      color: favColor,
      type: PlayerType.HUMAN,
      aiDifficulty: defaultDiff,
    },
    {
      enabled: true,
      name: 'Bot Yellow',
      color: PlayerColor.YELLOW,
      type: PlayerType.AI,
      aiDifficulty: defaultDiff,
    },
    {
      enabled: true,
      name: 'Bot Red',
      color: PlayerColor.RED,
      type: PlayerType.AI,
      aiDifficulty: defaultDiff,
    },
    {
      enabled: true,
      name: 'Bot Green',
      color: PlayerColor.GREEN,
      type: PlayerType.AI,
      aiDifficulty: defaultDiff,
    },
  ];
}

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  initialMode,
  defaultDifficulty,
  initialRules,
  profile,
  language,
  onBack,
  onStartMatch,
}) => {
  const [mode, setMode] = useState<GameModePreset>(initialMode);
  const [rules, setRules] = useState<GameRulesConfig>(initialRules);
  const [slots, setSlots] = useState<PlayerSetupSlot[]>(() =>
    buildPresetSlots(
      initialMode,
      defaultDifficulty,
      profile.name,
      profile.favoriteColor
    )
  );

  // Accordion Dropdown States for Each Component
  const [openSections, setOpenSections] = useState({
    mode: true,
    rules: false, // Collapsed by default for a clean layout
    players: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    soundManager.playClick();
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const t = (k: string) => getTranslation(language, k);

  const activeCount = slots.filter((s) => s.enabled).length;

  const handleModeSwitch = (nextMode: GameModePreset) => {
    soundManager.playClick();
    setMode(nextMode);
    setSlots(
      buildPresetSlots(
        nextMode,
        defaultDifficulty,
        profile.name,
        profile.favoriteColor
      )
    );
  };

  const handlePlayerCountChange = (count: 2 | 3 | 4) => {
    soundManager.playClick();
    setSlots((prev) =>
      prev.map((s, idx) => ({
        ...s,
        enabled: idx < count,
      }))
    );
  };

  const handleColorSelect = (slotIdx: number, newColor: PlayerColor) => {
    soundManager.playClick();
    setSlots((prev) => {
      const currentSlot = prev[slotIdx];
      const oldColor = currentSlot.color;
      if (oldColor === newColor) return prev;

      // Swap color if another slot currently holds it
      return prev.map((s, idx) => {
        if (idx === slotIdx) return { ...s, color: newColor };
        if (s.color === newColor) return { ...s, color: oldColor };
        return s;
      });
    });
  };

  const entryPresetValue =
    rules.entryRolls.length === 2
      ? '1_6'
      : rules.entryRolls[0] === 6
        ? '6'
        : '1';

  return (
    <div className="h-full w-full text-[#2C1A0E] flex flex-col justify-between overflow-hidden relative">
      {/* Top Mobile App Header */}
      <header className="w-full px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 flex items-center justify-between shrink-0 border-b border-[#7C4E23]/20">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          aria-label="Back"
          className="gold-circle-btn w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-display text-base sm:text-lg font-bold text-[#2C1A0E] leading-tight">
            {t('match_setup')}
          </h1>
          <span className="text-[10px] text-[#7C4E23] font-semibold">
            {activeCount} Players · {rules.tokensPerPlayer} Tokens
          </span>
        </div>

        {/* Start CTA in Header for Quick Access */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onStartMatch(slots, mode, rules);
          }}
          className="gold-cta-btn min-h-[34px] px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play</span>
        </button>
      </header>

      {/* Main Scrollable Content Area: Accordion Dropdowns for Each Component */}
      <main className="w-full px-3.5 py-2.5 flex-1 overflow-y-auto flex flex-col gap-3">
        {/* =========================================================================
           COMPONENT 1: GAME MODE & SPEED (COLLAPSIBLE DROPDOWN)
           ========================================================================= */}
        <div className="rounded-2xl wood-card overflow-hidden shadow-sm border border-[#7C4E23]/40">
          <button
            type="button"
            onClick={() => toggleSection('mode')}
            className="w-full p-3.5 flex items-center justify-between bg-[#F8EED9]/90 hover:bg-[#F8EED9] active:bg-[#EFE2C6] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#EAD8B8] border border-[#8C581E] flex items-center justify-center text-sm shrink-0">
                🎮
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#2C1A0E] leading-tight">
                  1. Game Mode &amp; Format
                </div>
                <div className="text-[10px] text-[#7C4E23] truncate">
                  {mode === GameModePreset.VS_AI
                    ? 'Vs AI Bot'
                    : mode === GameModePreset.TWO_PLAYER
                      ? '2-Player Offline'
                      : mode === GameModePreset.THREE_PLAYER
                        ? '3-Player Offline'
                        : '4-Player Offline'}{' '}
                  · {activeCount}P · {rules.tokensPerPlayer} Tokens
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAD8B8] text-[#5C381C] border border-[#8C581E]/40">
                {activeCount}P
              </span>
              {openSections.mode ? (
                <ChevronUp className="w-4 h-4 text-[#7C4E23]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7C4E23]" />
              )}
            </div>
          </button>

          {openSections.mode && (
            <div className="p-3.5 pt-2 flex flex-col gap-3 border-t border-[#7C4E23]/20 animate-fade-in">
              {/* Game Mode 4-Grid */}
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: GameModePreset.VS_AI, label: 'Vs Computer (AI)', icon: '🤖' },
                    { id: GameModePreset.TWO_PLAYER, label: '2-Player', icon: '👥' },
                    { id: GameModePreset.THREE_PLAYER, label: '3-Player', icon: '👑' },
                    { id: GameModePreset.FOUR_PLAYER, label: '4-Player', icon: '🛡️' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleModeSwitch(item.id)}
                    className={`min-h-[42px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      mode === item.id
                        ? 'gold-cta-btn'
                        : 'bg-[#EFE3C8] hover:bg-[#E5D4B3] border border-[#9E784B] text-[#3B2313]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Number of Players & Tokens Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#7C4E23]/20">
                {/* Active Players Count */}
                <div>
                  <div className="text-[10px] font-bold text-[#6B4A2B] mb-1">
                    Active Players
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#E8D8B9] rounded-lg border border-[#A88458]">
                    {([2, 3, 4] as const).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => handlePlayerCountChange(cnt)}
                        className={`min-h-[30px] rounded text-[11px] font-bold transition-all cursor-pointer ${
                          activeCount === cnt
                            ? 'gold-cta-btn'
                            : 'text-[#4A2C14]'
                        }`}
                      >
                        {cnt}P
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tokens per Player */}
                <div>
                  <div className="text-[10px] font-bold text-[#6B4A2B] mb-1">
                    Tokens Each
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#E8D8B9] rounded-lg border border-[#A88458]">
                    {([2, 3, 4] as const).map((tCount) => (
                      <button
                        key={tCount}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setRules((r) => ({ ...r, tokensPerPlayer: tCount }));
                        }}
                        className={`min-h-[30px] rounded text-[11px] font-bold transition-all cursor-pointer ${
                          rules.tokensPerPlayer === tCount
                            ? 'gold-cta-btn'
                            : 'text-[#4A2C14]'
                        }`}
                      >
                        {tCount}T
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
           COMPONENT 2: BOARD RULES & SKILLS (COLLAPSIBLE DROPDOWN)
           ========================================================================= */}
        <div className="rounded-2xl wood-card overflow-hidden shadow-sm border border-[#7C4E23]/40">
          <button
            type="button"
            onClick={() => toggleSection('rules')}
            className="w-full p-3.5 flex items-center justify-between bg-[#F8EED9]/90 hover:bg-[#F8EED9] active:bg-[#EFE2C6] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#EAD8B8] border border-[#8C581E] flex items-center justify-center text-sm shrink-0">
                🛡️
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#2C1A0E] leading-tight">
                  2. Board Rules &amp; Skills
                </div>
                <div className="text-[10px] text-[#7C4E23] truncate">
                  Entry: Roll {entryPresetValue === '1_6' ? '1 or 6' : entryPresetValue} · Skills {rules.enableSkills ? 'ON' : 'OFF'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAD8B8] text-[#5C381C] border border-[#8C581E]/40">
                {rules.enableSkills ? 'Skills ON' : 'Skills OFF'}
              </span>
              {openSections.rules ? (
                <ChevronUp className="w-4 h-4 text-[#7C4E23]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7C4E23]" />
              )}
            </div>
          </button>

          {openSections.rules && (
            <div className="p-3.5 pt-2 flex flex-col gap-3 border-t border-[#7C4E23]/20 animate-fade-in">
              {/* Home Deployment Entry Roll Dropdown/Segmented Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B4A2B] mb-1.5">
                  Starting Home Deployment Roll
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E8D8B9] rounded-xl border border-[#A88458]">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setRules((r) => ({
                        ...r,
                        entryRolls: [1],
                        extraTurnRolls: [1, 6],
                      }));
                    }}
                    className={`min-h-[36px] px-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                      entryPresetValue === '1'
                        ? 'gold-cta-btn'
                        : 'text-[#4A2C14]'
                    }`}
                  >
                    Roll 1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setRules((r) => ({
                        ...r,
                        entryRolls: [6],
                        extraTurnRolls: [1, 6],
                      }));
                    }}
                    className={`min-h-[36px] px-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                      entryPresetValue === '6'
                        ? 'gold-cta-btn'
                        : 'text-[#4A2C14]'
                    }`}
                  >
                    Roll 6
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setRules((r) => ({
                        ...r,
                        entryRolls: [1, 6],
                        extraTurnRolls: [1, 6],
                      }));
                    }}
                    className={`min-h-[36px] px-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                      entryPresetValue === '1_6'
                        ? 'gold-cta-btn'
                        : 'text-[#4A2C14]'
                    }`}
                  >
                    Roll 1 or 6
                  </button>
                </div>
              </div>

              {/* Special Skills Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EFE3C8] border border-[#9E784B]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#1E5AA8] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#2C1A0E]">
                      Special Skills (Shield &amp; Double Dice)
                    </div>
                    <div className="text-[10px] text-[#6B4A2B]">
                      2 charges per player · 3-turn cooldown
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setRules((r) => ({ ...r, enableSkills: !r.enableSkills }));
                  }}
                  className={`min-h-[34px] px-3.5 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap ${
                    rules.enableSkills
                      ? 'gold-cta-btn'
                      : 'bg-[#E8D8B9] border-[#A88458] text-[#5C3D1E]'
                  }`}
                >
                  {rules.enableSkills ? 'Enabled' : 'Off'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
           COMPONENT 3: PLAYER NAMES, COLORS & AI (COLLAPSIBLE DROPDOWN)
           ========================================================================= */}
        <div className="rounded-2xl wood-card overflow-hidden shadow-sm border border-[#7C4E23]/40">
          <button
            type="button"
            onClick={() => toggleSection('players')}
            className="w-full p-3.5 flex items-center justify-between bg-[#F8EED9]/90 hover:bg-[#F8EED9] active:bg-[#EFE2C6] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#EAD8B8] border border-[#8C581E] flex items-center justify-center text-sm shrink-0">
                👤
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#2C1A0E] leading-tight">
                  3. Player Roster &amp; AI Tiers
                </div>
                <div className="text-[10px] text-[#7C4E23] truncate">
                  {activeCount} Active Racers · Colors &amp; Controls
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAD8B8] text-[#5C381C] border border-[#8C581E]/40">
                {slots.filter((s) => s.enabled && s.type === PlayerType.HUMAN).length} Human /{' '}
                {slots.filter((s) => s.enabled && s.type === PlayerType.AI).length} AI
              </span>
              {openSections.players ? (
                <ChevronUp className="w-4 h-4 text-[#7C4E23]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#7C4E23]" />
              )}
            </div>
          </button>

          {openSections.players && (
            <div className="p-3 pt-2 flex flex-col gap-2.5 border-t border-[#7C4E23]/20 animate-fade-in">
              {slots.map((slot, idx) => {
                if (!slot.enabled) return null;
                const pal = COLOR_PALETTE[slot.color];

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FAF2DF] border border-[#A88458] shadow-sm flex flex-col gap-2"
                  >
                    {/* Top Row: Token Badge + Name Input + Type Pill */}
                    <div className="flex items-center gap-2 min-w-0">
                      {/* 3D Color Badge */}
                      <div
                        className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-mono-num font-bold text-xs text-white shrink-0 shadow-sm"
                        style={{
                          background: `radial-gradient(circle at 32% 28%, ${pal.highlight}, ${pal.primary} 55%, ${pal.dark})`,
                        }}
                      >
                        P{idx + 1}
                      </div>

                      {/* Name Input */}
                      <input
                        type="text"
                        maxLength={16}
                        value={slot.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlots((prev) =>
                            prev.map((s, i) =>
                              i === idx ? { ...s, name: val } : s
                            )
                          );
                        }}
                        placeholder={`Player ${idx + 1}`}
                        className="flex-1 min-w-0 bg-[#FFFDF8] border border-[#A88458] focus:border-[#5C381C] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#2C1A0E] outline-none"
                      />

                      {/* Human vs AI Compact Toggle */}
                      <div className="flex p-0.5 bg-[#E8D8B9] rounded-lg border border-[#A88458] shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setSlots((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, type: PlayerType.HUMAN } : s
                              )
                            );
                          }}
                          className={`min-h-[28px] px-2 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                            slot.type === PlayerType.HUMAN
                              ? 'gold-cta-btn'
                              : 'text-[#4A2C14]'
                          }`}
                        >
                          <User className="w-3 h-3" />
                          <span>Human</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setSlots((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, type: PlayerType.AI } : s
                              )
                            );
                          }}
                          className={`min-h-[28px] px-2 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                            slot.type === PlayerType.AI
                              ? 'gold-cta-btn'
                              : 'text-[#4A2C14]'
                          }`}
                        >
                          <Bot className="w-3 h-3" />
                          <span>AI</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Color Picker Circles + AI Difficulty Selector (if AI) */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#A88458]/30">
                      {/* Color Palette Selector */}
                      <div className="flex items-center gap-1.5">
                        {ALL_COLORS.map((c) => {
                          const active = slot.color === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handleColorSelect(idx, c)}
                              aria-label={`Select ${COLOR_PALETTE[c].name} color`}
                              className={`w-5 h-5 rounded-full transition-transform cursor-pointer border border-[#2C1A0E]/50 ${
                                active
                                  ? 'scale-125 ring-2 ring-[#5C381C] ring-offset-1 ring-offset-[#F9F1DF]'
                                  : 'opacity-50 hover:opacity-85'
                              }`}
                              style={{ backgroundColor: COLOR_PALETTE[c].primary }}
                            />
                          );
                        })}
                        <span className="text-[10px] font-bold text-[#5C3D1E] ml-1">
                          {pal.name}
                        </span>
                      </div>

                      {/* If AI: Compact Bot Tier Selector */}
                      {slot.type === PlayerType.AI && (
                        <div className="flex p-0.5 bg-[#E8D8B9] rounded-lg border border-[#A88458] shrink-0">
                          {(
                            [
                              { id: AiDifficulty.EASY, label: 'Easy' },
                              { id: AiDifficulty.MEDIUM, label: 'Med' },
                              { id: AiDifficulty.HARD, label: 'Hard' },
                            ] as const
                          ).map((diff) => (
                            <button
                              key={diff.id}
                              type="button"
                              onClick={() => {
                                soundManager.playClick();
                                setSlots((prev) =>
                                  prev.map((s, i) =>
                                    i === idx
                                      ? { ...s, aiDifficulty: diff.id }
                                      : s
                                  )
                                );
                              }}
                              className={`min-h-[22px] px-1.5 rounded text-[9px] font-bold cursor-pointer ${
                                slot.aiDifficulty === diff.id
                                  ? 'bg-[#5C381C] text-[#FFFDF7]'
                                  : 'text-[#4A2C14]'
                              }`}
                            >
                              {diff.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Match Action Bar */}
      <footer className="w-full px-3.5 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#F8EED9]/95 border-t border-[#7C4E23]/30 shrink-0 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#4A2C14] min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D14] shrink-0" />
          <span className="truncate">Offline · 3D Physics Dice</span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onStartMatch(slots, mode, rules);
          }}
          className="gold-cta-btn min-h-[46px] px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{t('start_match')}</span>
        </button>
      </footer>
    </div>
  );
};