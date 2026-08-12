import React, { useState } from 'react';
import { Group, Student, StudentTrait } from '../types';
import { Sparkles, Eye, Edit3, Check, ArrowRightLeft } from 'lucide-react';

const TRAIT_BADGES: Record<StudentTrait, { icon: string; label: string; bg: string; text: string }> = {
  learning_support: { icon: '📘', label: '학습지원', bg: 'bg-blue-100', text: 'text-blue-800' },
  special_support: { icon: '💙', label: '도움반', bg: 'bg-sky-100', text: 'text-sky-800' },
  quiet_isolated: { icon: '🍃', label: '소극', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  popular: { icon: '⭐', label: '인기', bg: 'bg-purple-100', text: 'text-purple-800' },
  leader_helper: { icon: '👑', label: '리더', bg: 'bg-amber-100', text: 'text-amber-800' },
  none: { icon: '', label: '', bg: '', text: '' },
};

interface ResultCardProps {
  group: Group;
  index: number;
  isPair: boolean;
  isRevealed: boolean;
  onRevealGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onSelectStudentForSwap?: (student: Student, groupId: string) => void;
  selectedSwapStudentId?: string | null;
}

const COLOR_ACCENTS = [
  { bg: 'bg-indigo-50/80', border: 'border-indigo-200', text: 'text-indigo-900', badge: 'bg-indigo-600', ring: 'ring-indigo-300' },
  { bg: 'bg-purple-50/80', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600', ring: 'ring-purple-300' },
  { bg: 'bg-emerald-50/80', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600', ring: 'ring-emerald-300' },
  { bg: 'bg-amber-50/80', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-600', ring: 'ring-amber-300' },
  { bg: 'bg-pink-50/80', border: 'border-pink-200', text: 'text-pink-900', badge: 'bg-pink-600', ring: 'ring-pink-300' },
  { bg: 'bg-sky-50/80', border: 'border-sky-200', text: 'text-sky-900', badge: 'bg-sky-600', ring: 'ring-sky-300' },
];

export const ResultCard: React.FC<ResultCardProps> = ({
  group,
  index,
  isPair,
  isRevealed,
  onRevealGroup,
  onRenameGroup,
  onSelectStudentForSwap,
  selectedSwapStudentId,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(group.name);

  const style = COLOR_ACCENTS[index % COLOR_ACCENTS.length];

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onRenameGroup(group.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      className={`relative rounded-3xl border-2 p-5 transition-all duration-300 shadow-sm hover:shadow-md ${style.bg} ${style.border}`}
    >
      {/* Hidden / Reveal Overlay */}
      {!isRevealed ? (
        <div
          onClick={() => onRevealGroup(group.id)}
          className="cursor-pointer py-8 flex flex-col items-center justify-center text-center space-y-3 group"
        >
          <div className={`w-14 h-14 rounded-2xl ${style.badge} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
            <Eye className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-lg">
              {index + 1}. {group.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              클릭하여 친구 조합 공개하기! 🎁
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-xl ${style.badge} text-white text-xs font-black flex items-center justify-center shadow-xs`}>
                {index + 1}
              </span>

              {isEditingTitle ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-sm font-bold text-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 bg-emerald-600 text-white rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <h3 className={`font-black text-lg ${style.text} flex items-center gap-1.5`}>
                  {group.name}
                  <button
                    onClick={() => {
                      setTitleInput(group.name);
                      setIsEditingTitle(true);
                    }}
                    className="opacity-0 hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity"
                    title="이름 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </h3>
              )}
            </div>

            <span className="text-xs font-bold text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200/80">
              {group.members.length}명
            </span>
          </div>

          {/* Members Display */}
          {isPair ? (
            /* Pair Display: "A - B" style */
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              {group.members.map((member, mIdx) => {
                const isSelected = selectedSwapStudentId === member.id;
                const traitInfo = member.trait && member.trait !== 'none' ? TRAIT_BADGES[member.trait] : null;

                return (
                  <React.Fragment key={member.id}>
                    {mIdx > 0 && (
                      <span className="font-black text-slate-400 text-xl">🤝</span>
                    )}
                    <div
                      onClick={() => onSelectStudentForSwap && onSelectStudentForSwap(member, group.id)}
                      className={`group relative px-4 py-3 rounded-2xl bg-white border font-black text-base sm:text-lg text-slate-800 shadow-xs cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all flex items-center gap-2 ${
                        isSelected ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50' : 'border-slate-200'
                      }`}
                      title="클릭하여 다른 친구와 자리 교체"
                    >
                      <span>{member.name}</span>
                      {traitInfo && (
                        <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${traitInfo.bg} ${traitInfo.text}`}>
                          {traitInfo.icon} {traitInfo.label}
                        </span>
                      )}
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            /* Group Display: Grid of Pills */
            <div className="flex flex-wrap gap-2 py-1">
              {group.members.map((member) => {
                const isSelected = selectedSwapStudentId === member.id;
                const traitInfo = member.trait && member.trait !== 'none' ? TRAIT_BADGES[member.trait] : null;

                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectStudentForSwap && onSelectStudentForSwap(member, group.id)}
                    className={`group px-3.5 py-2 rounded-2xl bg-white border font-bold text-sm text-slate-800 shadow-xs cursor-pointer hover:border-purple-400 hover:shadow-md transition-all flex items-center gap-2 ${
                      isSelected ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' : 'border-slate-200'
                    }`}
                    title="클릭하여 다른 친구와 모둠 교체"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>{member.name}</span>
                    {traitInfo && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${traitInfo.bg} ${traitInfo.text}`}>
                        {traitInfo.icon} {traitInfo.label}
                      </span>
                    )}
                    <ArrowRightLeft className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
