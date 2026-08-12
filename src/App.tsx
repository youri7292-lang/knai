import React, { useState, useEffect } from 'react';
import { Student, StudentTrait, GroupConfig, Group, MatchRecord } from './types';
import {
  getStoredStudents,
  saveStudents,
  getStoredHistory,
  saveHistory,
  addMatchRecord,
  deleteMatchRecord,
  clearAllData,
  DEFAULT_STUDENTS,
} from './utils/storage';
import { generateGroups } from './utils/matching';
import { Header } from './components/Header';
import { StudentManager } from './components/StudentManager';
import { MatchingControls } from './components/MatchingControls';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryModal } from './components/HistoryModal';
import { PairMatrixModal } from './components/PairMatrixModal';
import { ExportShareModal } from './components/ExportShareModal';
import { PrintView } from './components/PrintView';
import confetti from 'canvas-confetti';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [currentGroups, setCurrentGroups] = useState<Group[]>([]);
  const [currentExcluded, setCurrentExcluded] = useState<Student[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Configuration State
  const [config, setConfig] = useState<GroupConfig>({
    type: 'pair',
    groupSize: 2,
    mode: 'by_size',
    targetCount: 3,
    leftoverOption: 'merge',
    minimizeOverlap: true,
    considerTraits: true,
  });

  // Modals & Navigation Views
  const [showHistory, setShowHistory] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showExportShare, setShowExportShare] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const loadedStudents = getStoredStudents();
    const loadedHistory = getStoredHistory();
    setStudents(loadedStudents);
    setHistory(loadedHistory);
  }, []);

  // Save Students when state changes
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  // Student Actions
  const handleAddStudent = (name: string, trait?: StudentTrait) => {
    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      trait: trait || 'none',
      isExcluded: false,
      createdAt: Date.now(),
    };
    updateStudents([...students, newStudent]);
  };

  const handleBulkAdd = (names: string[]) => {
    const newStudents: Student[] = names.map((name, idx) => ({
      id: `std-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      trait: 'none',
      isExcluded: false,
      createdAt: Date.now() + idx,
    }));
    updateStudents([...students, ...newStudents]);
  };

  const handleUpdateStudent = (
    id: string,
    name: string,
    trait?: StudentTrait,
    avoidWithIds?: string[]
  ) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, name, trait: trait || s.trait || 'none', avoidWithIds } : s
    );
    updateStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    updateStudents(updated);
  };

  const handleToggleExclude = (id: string) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, isExcluded: !s.isExcluded } : s
    );
    updateStudents(updated);
  };

  const handleSetAllExcluded = (excluded: boolean) => {
    const updated = students.map((s) => ({ ...s, isExcluded: excluded }));
    updateStudents(updated);
  };

  // Matching Generation
  const handleGenerate = () => {
    const activeStudents = students.filter((s) => !s.isExcluded);
    if (activeStudents.length < 2) return;

    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateGroups(activeStudents, config, history);
      const excluded = students.filter((s) => s.isExcluded);

      setCurrentGroups(generated);
      setCurrentExcluded(excluded);
      setIsGenerating(false);

      // Auto record match to history
      const dateStr = new Date().toLocaleDateString('ko-KR');
      const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const recordTitle = `${dateStr} ${timeStr} ${config.type === 'pair' ? '짝 매칭' : '모둠 매칭'}`;

      const newRecord: MatchRecord = {
        id: `rec-${Date.now()}`,
        title: recordTitle,
        timestamp: Date.now(),
        type: config.type,
        groupSize: config.groupSize,
        groups: generated,
        excludedStudents: excluded,
      };

      const updatedHistory = addMatchRecord(newRecord);
      setHistory(updatedHistory);

      // Trigger celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 300);
  };

  // History & Reset Actions
  const handleDeleteHistoryRecord = (id: string) => {
    const updated = deleteMatchRecord(id);
    setHistory(updated);
  };

  const handleRestoreRecord = (record: MatchRecord) => {
    setCurrentGroups(record.groups);
    setCurrentExcluded(record.excludedStudents || []);
    setConfig((prev) => ({ ...prev, type: record.type }));
  };

  const handleResetAll = () => {
    clearAllData();
    saveStudents(DEFAULT_STUDENTS);
    setStudents(DEFAULT_STUDENTS);
    setHistory([]);
    setCurrentGroups([]);
    setCurrentExcluded([]);
  };

  const activeCount = students.filter((s) => !s.isExcluded).length;

  if (isPrintMode) {
    return (
      <PrintView
        groups={currentGroups}
        excludedStudents={currentExcluded}
        isPair={config.type === 'pair'}
        onBack={() => setIsPrintMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        studentCount={students.length}
        activeCount={activeCount}
        historyCount={history.length}
        onOpenHistory={() => setShowHistory(true)}
        onOpenMatrix={() => setShowMatrix(true)}
        onResetAll={handleResetAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Top Split: Student Management & Matching Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-6">
            <StudentManager
              students={students}
              onAddStudent={handleAddStudent}
              onBulkAdd={handleBulkAdd}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onToggleExclude={handleToggleExclude}
              onSetAllExcluded={handleSetAllExcluded}
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <MatchingControls
              config={config}
              onChangeConfig={setConfig}
              activeStudentCount={activeCount}
              totalStudentCount={students.length}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Results Section */}
        {currentGroups.length > 0 && (
          <ResultDisplay
            groups={currentGroups}
            excludedStudents={currentExcluded}
            isPair={config.type === 'pair'}
            onReshuffle={handleGenerate}
            onSaveToHistory={() => {
              // Re-save or acknowledge
            }}
            onOpenExportShare={() => setShowExportShare(true)}
            onUpdateGroups={setCurrentGroups}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>모두의 짝꿍 - 학생 짝 &amp; 소그룹 스마트 매처</span>
          <span className="text-slate-400">
            🔒 학생 개인정보는 이 브라우저 기기에만 보관됩니다.
          </span>
        </div>
      </footer>

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          history={history}
          onDeleteRecord={handleDeleteHistoryRecord}
          onRestoreRecord={handleRestoreRecord}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Pair Matrix Modal */}
      {showMatrix && (
        <PairMatrixModal
          students={students}
          history={history}
          onClose={() => setShowMatrix(false)}
        />
      )}

      {/* Export & Share Modal */}
      {showExportShare && (
        <ExportShareModal
          groups={currentGroups}
          excludedStudents={currentExcluded}
          isPair={config.type === 'pair'}
          onClose={() => setShowExportShare(false)}
          onPrint={() => setIsPrintMode(true)}
        />
      )}
    </div>
  );
}
