import React, { useState } from 'react';
import { Users, History, HelpCircle, Sparkles, Grid3X3, Trash2, Info } from 'lucide-react';

interface HeaderProps {
  studentCount: number;
  activeCount: number;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenMatrix: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentCount,
  activeCount,
  historyCount,
  onOpenHistory,
  onOpenMatrix,
  onResetAll,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Title / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              모두의 짝꿍 <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">학급 매처</span>
            </h1>
            <p className="text-xs text-slate-500">
              매일 새로운 친구들과 어울리는 스마트 짝 &amp; 소그룹 매칭
            </p>
          </div>
        </div>

        {/* Header Actions & Stats */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>등록: <strong className="text-slate-900 font-bold">{studentCount}명</strong></span>
            <span className="text-slate-300">|</span>
            <span>참여: <strong className="text-indigo-600 font-bold">{activeCount}명</strong></span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-indigo-200"
            title="매칭 기록 보기"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span>기록</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-600 text-white text-[10px] rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Pair Matrix Button */}
          <button
            onClick={onOpenMatrix}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-purple-200"
            title="매칭 횟수 매트릭스 보기"
          >
            <Grid3X3 className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">매칭 통계</span>
          </button>

          {/* Guide / Info Button */}
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="이용 안내 및 개인정보 안내"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Reset All Button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
            title="모든 데이터 초기화"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info / Privacy Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center gap-3 text-indigo-600">
              <Info className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-800">이용 방법 및 안내</h3>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                <p className="font-semibold text-indigo-900 mb-1">🔒 학생 개인정보 보호 안내</p>
                <p>본 앱은 학생 성명이나 학번 등 민감한 정보를 서버에 전혀 저장하거나 전송하지 않습니다. <strong>입력한 모든 정보는 오직 현재 사용 중인 기기(로컬 저장소)에만 저장</strong>됩니다.</p>
                <p className="mt-1 text-indigo-700 font-medium">💡 팁: 실명 대신 별명이나 번호(예: 1번, 2번) 사용을 권장합니다.</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-800">✨ 주요 기능</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>스마트 중복 방지:</strong> 과거 매칭 기록을 분석하여 이전에 한 번도 안 만난 친구와 우선 매칭합니다.</li>
                  <li><strong>출석/제외 설정:</strong> 오늘 결석했거나 제외할 학생을 간편하게 온/오프할 수 있습니다.</li>
                  <li><strong>결과 공유/인쇄:</strong> 출력용 A4 인쇄 레이블 및 텍스트 카톡/밴드 공유를 지원합니다.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors"
              >
                확인했어요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-rose-100">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-800">모든 정보 및 기록 초기화</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              등록된 모든 학생 목록과 지금까지 축적된 매칭 기록이 삭제됩니다. 정말 초기화하시겠습니까?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onResetAll();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-md"
              >
                초기화 실행
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
