import React, { useState } from 'react';
import { Group, Student, MatchRecord } from '../types';
import { ResultCard } from './ResultCard';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Copy,
  Printer,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  UserX,
  Share2,
  BookmarkPlus,
  ArrowRightLeft
} from 'lucide-react';

interface ResultDisplayProps {
  groups: Group[];
  excludedStudents: Student[];
  isPair: boolean;
  onReshuffle: () => void;
  onSaveToHistory: () => void;
  onOpenExportShare: () => void;
  onUpdateGroups: (groups: Group[]) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  groups,
  excludedStudents,
  isPair,
  onReshuffle,
  onSaveToHistory,
  onOpenExportShare,
  onUpdateGroups,
}) => {
  const [revealedGroupIds, setRevealedGroupIds] = useState<Set<string>>(
    new Set(groups.map((g) => g.id))
  );
  const [copiedText, setCopiedText] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual Member Swap State
  const [swapSelection, setSwapSelection] = useState<{
    student: Student;
    groupId: string;
  } | null>(null);

  const allRevealed = revealedGroupIds.size === groups.length;

  const handleToggleRevealAll = () => {
    if (allRevealed) {
      setRevealedGroupIds(new Set());
    } else {
      setRevealedGroupIds(new Set(groups.map((g) => g.id)));
      // Trigger confetti!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRevealGroup = (groupId: string) => {
    const next = new Set(revealedGroupIds);
    next.add(groupId);
    setRevealedGroupIds(next);
  };

  const handleRenameGroup = (groupId: string, newName: string) => {
    const updated = groups.map((g) => (g.id === groupId ? { ...g, name: newName } : g));
    onUpdateGroups(updated);
  };

  // Student Swap Logic
  const handleSelectStudentForSwap = (student: Student, groupId: string) => {
    if (!swapSelection) {
      setSwapSelection({ student, groupId });
      return;
    }

    if (swapSelection.student.id === student.id) {
      // Deselect
      setSwapSelection(null);
      return;
    }

    // Perform swap between swapSelection and current student
    const updated = groups.map((g) => {
      let members = [...g.members];

      if (g.id === swapSelection.groupId) {
        members = members.map((m) => (m.id === swapSelection.student.id ? student : m));
      }
      if (g.id === groupId) {
        members = members.map((m) => (m.id === student.id ? swapSelection.student : m));
      }

      return { ...g, members };
    });

    onUpdateGroups(updated);
    setSwapSelection(null);
  };

  // Copy Result Text
  const handleCopyText = () => {
    let text = `[모두의 짝꿍] ${isPair ? '짝' : '소그룹'} 매칭 결과 ✨\n\n`;

    groups.forEach((g, idx) => {
      const memberNames = g.members.map((m) => m.name).join(isPair ? ' - ' : ', ');
      text += `${idx + 1}. ${g.name}: ${memberNames}\n`;
    });

    if (excludedStudents.length > 0) {
      text += `\n* 오늘 제외된 학생: ${excludedStudents.map((s) => s.name).join(', ')}`;
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSaveHistoryClick = () => {
    onSaveToHistory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (groups.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-spin-slow" />
            매칭 결과
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              총 {groups.length}개 {isPair ? '짝' : '모둠'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            학생 조작이나 교체를 원하시면 학생 이름을 클릭하세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Reveal All */}
          <button
            onClick={handleToggleRevealAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            {allRevealed ? (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>카드 숨기기</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>전체 공개</span>
              </>
            )}
          </button>

          {/* Reshuffle */}
          <button
            onClick={onReshuffle}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 섞기</span>
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>결과 복사</span>
              </>
            )}
          </button>

          {/* Print / Export */}
          <button
            onClick={onOpenExportShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄 / 공유</span>
          </button>

          {/* Save to History */}
          <button
            onClick={handleSaveHistoryClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>저장됨</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>기록 저장</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Student Swap Notice Bar */}
      {swapSelection && (
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-semibold animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            <span>
              선택된 학생: <strong>{swapSelection.student.name}</strong> - 교체할 다른 학생을 선택하세요.
            </span>
          </div>
          <button
            onClick={() => setSwapSelection(null)}
            className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold"
          >
            선택 취소
          </button>
        </div>
      )}

      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, idx) => (
          <ResultCard
            key={group.id}
            group={group}
            index={idx}
            isPair={isPair}
            isRevealed={revealedGroupIds.has(group.id)}
            onRevealGroup={handleRevealGroup}
            onRenameGroup={handleRenameGroup}
            onSelectStudentForSwap={handleSelectStudentForSwap}
            selectedSwapStudentId={swapSelection?.student.id}
          />
        ))}
      </div>

      {/* Excluded Students Drawer */}
      {excludedStudents.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
            <UserX className="w-4 h-4 text-amber-600" />
            <span>오늘 매칭에서 제외된 학생 ({excludedStudents.length}명)</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {excludedStudents.map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 bg-slate-200/80 text-slate-600 font-semibold rounded-lg"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
