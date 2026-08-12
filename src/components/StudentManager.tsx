import React, { useState } from 'react';
import { Student, StudentTrait } from '../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  FileText,
  Search,
  UserCheck,
  UserX,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Plus,
  Sliders,
  AlertCircle
} from 'lucide-react';

export const TRAIT_CONFIG: Record<
  StudentTrait,
  { label: string; icon: string; bg: string; text: string; border: string; desc: string }
> = {
  learning_support: {
    label: '학습부진/지원이 필요한 학생',
    icon: '📘',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    desc: '학습 및 수업 활동 시 또래 지원이 필요한 학생',
  },
  special_support: {
    label: '도움반/배려 필요한 학생',
    icon: '💙',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    desc: '특별히 따뜻한 배려와 챙김이 필요한 학생',
  },
  quiet_isolated: {
    label: '소극적/소외되는 학생',
    icon: '🍃',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    desc: '수줍음이 많거나 혼자 조용히 지내는 학생',
  },
  popular: {
    label: '인기있는/친화력 높은 학생',
    icon: '⭐',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    desc: '친화력이 우수하고 활발하여 친구들을 잘 이끄는 학생',
  },
  leader_helper: {
    label: '리더/또래도우미',
    icon: '👑',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    desc: '책임감이 강하고 또래를 잘 도와줄 수 있는 학생',
  },
  none: {
    label: '일반',
    icon: '😊',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    desc: '특별한 특성 지정 없음',
  },
};

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (name: string, trait?: StudentTrait) => void;
  onBulkAdd: (names: string[]) => void;
  onUpdateStudent: (id: string, name: string, trait?: StudentTrait, avoidWithIds?: string[]) => void;
  onDeleteStudent: (id: string) => void;
  onToggleExclude: (id: string) => void;
  onSetAllExcluded: (excluded: boolean) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onBulkAdd,
  onUpdateStudent,
  onDeleteStudent,
  onToggleExclude,
  onSetAllExcluded,
}) => {
  const [newName, setNewName] = useState('');
  const [newTrait, setNewTrait] = useState<StudentTrait>('none');
  const [searchTerm, setSearchTerm] = useState('');

  // Trait Filter State
  const [traitFilter, setTraitFilter] = useState<string>('all');

  // Detail Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [editTraitInput, setEditTraitInput] = useState<StudentTrait>('none');
  const [editAvoidIds, setEditAvoidIds] = useState<string[]>([]);

  // Bulk Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const activeCount = students.filter((s) => !s.isExcluded).length;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddStudent(newName.trim(), newTrait);
    setNewName('');
    setNewTrait('none');
  };

  const handleQuickTraitChange = (s: Student, nextTrait: StudentTrait) => {
    onUpdateStudent(s.id, s.name, nextTrait, s.avoidWithIds);
  };

  const handleOpenEditModal = (s: Student) => {
    setEditingStudent(s);
    setEditNameInput(s.name);
    setEditTraitInput(s.trait || 'none');
    setEditAvoidIds(s.avoidWithIds || []);
  };

  const handleSaveEditModal = () => {
    if (!editingStudent) return;
    if (editNameInput.trim()) {
      onUpdateStudent(editingStudent.id, editNameInput.trim(), editTraitInput, editAvoidIds);
    }
    setEditingStudent(null);
  };

  const toggleAvoidStudent = (targetId: string) => {
    setEditAvoidIds((prev) =>
      prev.includes(targetId) ? prev.filter((id) => id !== targetId) : [...prev, targetId]
    );
  };

  const handleBulkSubmit = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (lines.length > 0) {
      onBulkAdd(lines);
      setBulkText('');
      setShowBulkModal(false);
    }
  };

  const handlePresetNumbering = (count: number) => {
    const names = Array.from({ length: count }, (_, i) => `${i + 1}번 학생`);
    onBulkAdd(names);
    setShowBulkModal(false);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const traitFilteredStudents = filteredStudents.filter((s) => {
    if (traitFilter === 'all') return true;
    if (traitFilter === 'set') return (s.trait || 'none') !== 'none';
    return (s.trait || 'none') === traitFilter;
  });

  const traitCount = students.filter((s) => (s.trait || 'none') !== 'none').length;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-5">
      {/* Top Title & Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            학생 특성 및 명단 관리
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              총 {students.length}명
            </span>
            {traitCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center gap-1">
                ✨ 특성 설정 {traitCount}명
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            학생별 성향(학습부진/도움반/인기/소외/도우미)을 지정하여 최적의 자리를 맞춤 배치합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs transition-colors border border-emerald-200 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>일괄 등록 / 명단 붙여넣기</span>
          </button>
        </div>
      </div>

      {/* New Student Input with Trait Select */}
      <form onSubmit={handleSingleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="학생 이름 입력 (예: 김철수, 1번...)"
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
        <select
          value={newTrait}
          onChange={(e) => setNewTrait(e.target.value as StudentTrait)}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-500"
        >
          {(Object.keys(TRAIT_CONFIG) as StudentTrait[]).map((tKey) => (
            <option key={tKey} value={tKey}>
              {TRAIT_CONFIG[tKey].icon} {TRAIT_CONFIG[tKey].label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!newName.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>등록</span>
        </button>
      </form>

      {/* Teacher Guide & Quick Filter Tabs Banner */}
      <div className="p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-indigo-950 font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>카드의 특성 버튼을 누르면 <strong>학습부진, 도움반, 인기학생, 소외학생, 또래도우미</strong>를 즉시 지정할 수 있습니다.</span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setTraitFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              traitFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            전체 ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setTraitFilter('set')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              traitFilter === 'set'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            특성 지정됨 ({traitCount})
          </button>
        </div>
      </div>

      {/* Quick Action Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
        {/* Attendance Toggles */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 shrink-0">출석 체크:</span>
          <button
            onClick={() => onSetAllExcluded(false)}
            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            모두 참여 ({activeCount})
          </button>
          <button
            onClick={() => onSetAllExcluded(true)}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <UserX className="w-3.5 h-3.5 text-amber-600" />
            모두 결석
          </button>
        </div>

        {/* Filter Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="학생 이름 검색..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Student List Grid */}
      {students.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">등록된 학생이 없습니다</p>
          <p className="text-xs text-slate-400">
            위 입력창에 이름을 적거나 [일괄 등록] 버튼을 눌러 전체 명단을 입력하세요.
          </p>
        </div>
      ) : traitFilteredStudents.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          조건에 부합하는 학생 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1 pr-2 scrollbar-thin">
          {traitFilteredStudents.map((s) => {
            const trait = s.trait || 'none';
            const traitConf = TRAIT_CONFIG[trait];

            return (
              <div
                key={s.id}
                className={`group relative flex flex-col justify-between p-3 rounded-2xl border transition-all ${
                  s.isExcluded
                    ? 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-70'
                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs'
                }`}
              >
                {/* Top Row: Attendance, Name & Actions */}
                <div className="flex items-center justify-between gap-2 min-w-0 w-full mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleExclude(s.id)}
                      className="shrink-0 focus:outline-none"
                      title={s.isExcluded ? '오늘 매칭 참여로 변경' : '오늘 제외(결석)하기'}
                    >
                      {s.isExcluded ? (
                        <XCircle className="w-5 h-5 text-amber-500 hover:scale-110 transition-transform" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 hover:scale-110 transition-transform" />
                      )}
                    </button>

                    <span
                      onClick={() => handleOpenEditModal(s)}
                      className={`text-sm font-extrabold truncate cursor-pointer select-none ${
                        s.isExcluded ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {s.name}
                    </span>

                    {s.avoidWithIds && s.avoidWithIds.length > 0 && (
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 shrink-0"
                        title="피할 짝 설정됨"
                      >
                        🚫 피할짝 지정
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      title="학생 성향 및 피할 짝 상세 설정"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>설정</span>
                    </button>

                    <button
                      onClick={() => onDeleteStudent(s.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Direct Instant Trait Selection Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto pt-1.5 border-t border-slate-100 scrollbar-none">
                  {(Object.keys(TRAIT_CONFIG) as StudentTrait[]).map((tKey) => {
                    const conf = TRAIT_CONFIG[tKey];
                    const isSelected = trait === tKey;

                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => handleQuickTraitChange(s, tKey)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all shrink-0 ${
                          isSelected
                            ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-indigo-400 shadow-2xs font-black scale-102`
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={conf.desc}
                      >
                        <span>{conf.icon}</span>
                        <span>{conf.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Privacy Notice Badge */}
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100/80 text-[11px] text-indigo-900/80">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          <strong>안심 저장:</strong> 등록된 명단 및 학생 특성 정보는 개인정보 보호를 위해 서버 전송 없이 교사의 온디바이스에만 안전하게 저장됩니다.
        </span>
      </div>

      {/* Detailed Student Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                [{editingStudent.name}] 학생 옵션 설정
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Name Change */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">학생 이름:</label>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Trait Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">학생 성향/특성 지정:</label>
              <div className="grid grid-cols-1 gap-1.5">
                {(Object.keys(TRAIT_CONFIG) as StudentTrait[]).map((tKey) => {
                  const conf = TRAIT_CONFIG[tKey];
                  const isSelected = editTraitInput === tKey;

                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setEditTraitInput(tKey)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-indigo-500 font-bold`
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{conf.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold">{conf.label}</div>
                        <div className="text-[10px] text-slate-500">{conf.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avoid With Selection */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>🚫 같은 조 피할 학생 선택 (기피 관계):</span>
                <span className="text-[10px] text-rose-600 font-normal">선택된 학생과는 가능하면 같은 조 배정을 피합니다.</span>
              </label>
              <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 scrollbar-thin">
                {students
                  .filter((s) => s.id !== editingStudent.id)
                  .map((other) => {
                    const isAvoided = editAvoidIds.includes(other.id);
                    return (
                      <button
                        key={other.id}
                        type="button"
                        onClick={() => toggleAvoidStudent(other.id)}
                        className={`w-full p-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          isAvoided
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        <span>{other.name}</span>
                        {isAvoided ? (
                          <span className="text-[10px] font-bold text-rose-600">피하기 지정됨</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">선택</span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleSaveEditModal}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                학생 명단 일괄 입력 / 붙여넣기
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              줄바꿈(Enter)이나 쉼표(,)로 구분하여 학생 이름을 여러 명 한 번에 붙여넣을 수 있습니다.
            </p>

            <textarea
              rows={6}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`예시:\n꿈꾸는사자\n지혜로운여우\n날아라독수리\n호기심돌고래`}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">빠른 생성 예시:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePresetNumbering(15)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl"
                >
                  1번~15번 생성
                </button>
                <button
                  onClick={() => handlePresetNumbering(24)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl"
                >
                  1번~24번 생성
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleBulkSubmit}
                disabled={!bulkText.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-sm font-bold rounded-xl shadow-md transition-all"
              >
                명단 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
