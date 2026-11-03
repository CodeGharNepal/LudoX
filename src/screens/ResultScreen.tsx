import React from 'react';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import { AppLanguage, GameState } from '../models/gameModels';
import { COLOR_PALETTE } from '../engine/boardGeometry';
import { getTranslation } from '../i18n/translations';

interface ResultScreenProps {
  gameState: GameState;
  language?: AppLanguage;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameState,
  language = 'en',
  onPlayAgain,
  onReturnHome,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const orderedPlayers = gameState.rankings
    .map((color) => gameState.players.find((p) => p.color === color)!)
    .filter(Boolean);

  const winner = orderedPlayers[0] ?? gameState.players[0];
  const winnerPalette = COLOR_PALETTE[winner.color];

  return (
    <div className="h-full w-full text-[#2C1A0E] flex items-center justify-center p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto">
      <div className="relative z-10 w-full max-w-sm rounded-3xl wood-card p-5 flex flex-col items-center text-center">
        {/* Golden & Winner Color Medallion */}
        <div
          className="w-16 h-16 rounded-full border-4 border-[#FFE484] flex items-center justify-center shadow-xl mb-3"
          style={{
            background: `radial-gradient(circle at 32% 28%, ${winnerPalette.highlight}, ${winnerPalette.primary} 58%, ${winnerPalette.dark})`,
          }}
        >
          <Trophy className="w-8 h-8 text-[#FFFDF7]" />
        </div>

        <div className="text-xs font-bold text-[#6B4A2B] mb-0.5">
          {t('match_complete')} · {gameState.turnNumber} Turns
        </div>

        <h1 className="font-display text-2xl font-extrabold text-[#2C1A0E] mb-2">
          {winner.name} {t('wins')}!
        </h1>

        {/* Rankings Table */}
        <div className="w-full rounded-2xl bg-[#F4E7CA] border-2 border-[#8C6239] overflow-hidden mb-5 text-left">
          <div className="grid grid-cols-12 px-3 py-2 border-b border-[#C5AB82] text-[11px] font-bold text-[#5C3D1E]">
            <div className="col-span-2">{t('rank')}</div>
            <div className="col-span-5">{t('player')}</div>
            <div className="col-span-3 text-right">{t('home')}</div>
            <div className="col-span-2 text-right">{t('captures')}</div>
          </div>

          {orderedPlayers.map((player, index) => {
            const pal = COLOR_PALETTE[player.color];
            const homeCount = player.tokens.filter(
              (t) => t.progress === 56
            ).length;

            return (
              <div
                key={player.id}
                className="grid grid-cols-12 items-center px-3 py-2.5 border-b border-[#DFCCA8] last:border-none text-xs"
              >
                <div className="col-span-2 font-mono-num font-extrabold text-[#3B2313]">
                  #{index + 1}
                </div>
                <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#2C1A0E]/40 shrink-0"
                    style={{ backgroundColor: pal.primary }}
                  />
                  <span className="font-bold text-[#2C1A0E] truncate">
                    {player.name}
                  </span>
                </div>
                <div className="col-span-3 text-right font-mono-num font-semibold text-[#4A2C14]">
                  {homeCount}/{player.tokens.length}
                </div>
                <div className="col-span-2 text-right font-mono-num font-semibold text-[#4A2C14]">
                  {player.capturesMade}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={onPlayAgain}
            className="gold-cta-btn w-full min-h-[46px] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('play_again')}</span>
          </button>

          <button
            type="button"
            onClick={onReturnHome}
            className="w-full min-h-[44px] px-5 py-2.5 rounded-xl wood-banner font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>{t('exit_home')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
