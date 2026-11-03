import React, { useState } from 'react';
import { Check, User, X } from 'lucide-react';
import { PlayerColor, UserProfile } from '../models/gameModels';
import { COLOR_PALETTE } from '../engine/boardGeometry';
import { getTranslation } from '../i18n/translations';
import { AppLanguage } from '../models/gameModels';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: UserProfile;
  language: AppLanguage;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}

export const AVATAR_OPTIONS = [
  { emoji: '👑', label: 'Crown' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🦅', label: 'Falcon' },
  { emoji: '⚔️', label: 'Warrior' },
  { emoji: '🎲', label: 'Dice' },
  { emoji: '👸', label: 'Queen' },
  { emoji: '⚡', label: 'Thunder' },
  { emoji: '🦚', label: 'Peacock' },
  { emoji: '🛡️', label: 'Shield' },
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  profile,
  language,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [favColor, setFavColor] = useState<PlayerColor>(profile.favoriteColor);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      avatar,
      favoriteColor: favColor,
    });
    onClose();
  };

  const t = (k: string) => getTranslation(language, k);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1E0F05]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm wood-card rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border-2 border-[#7C4E23]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#7C5227]/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatar}</span>
            <span className="font-display font-bold text-lg text-[#3B2313]">
              {t('edit_profile')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('cancel')}
            className="gold-circle-btn w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Player Name Field */}
          <div>
            <label className="block text-xs font-bold text-[#5C381C] mb-1.5">
              {t('player_name')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={18}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#A88458] text-[#2C1A0E] font-bold text-sm focus:outline-none focus:border-[#C58A18] shadow-inner"
                required
              />
              <User className="w-4 h-4 text-[#8C6239] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Avatar Grid */}
          <div>
            <label className="block text-xs font-bold text-[#5C381C] mb-1.5">
              {t('choose_avatar')}
            </label>
            <div className="grid grid-cols-5 gap-2 p-2 bg-[#EAD8B8]/70 rounded-2xl border border-[#A88458]/60">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = avatar === opt.emoji;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAvatar(opt.emoji)}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFFDF8] border-2 border-[#8C581E] shadow-md scale-105'
                        : 'hover:bg-[#FAF2DF] opacity-80 hover:opacity-100'
                    }`}
                  >
                    {opt.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Color */}
          <div>
            <label className="block text-xs font-bold text-[#5C381C] mb-1.5">
              Favorite Color
            </label>
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-[#EAD8B8]/70 rounded-2xl border border-[#A88458]/60">
              {(Object.keys(COLOR_PALETTE) as PlayerColor[]).map((c) => {
                const pal = COLOR_PALETTE[c];
                const isSelected = favColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFavColor(c)}
                    className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer relative shadow-sm ${
                      isSelected ? 'ring-2 ring-offset-2 ring-[#3B2313] scale-105' : 'opacity-85'
                    }`}
                    style={{ backgroundColor: pal.primary }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl wood-banner text-xs font-bold text-center hover:brightness-110 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl gold-cta-btn text-xs font-extrabold text-center cursor-pointer disabled:opacity-50"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

