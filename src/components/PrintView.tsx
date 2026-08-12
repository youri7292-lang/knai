import React from 'react';
import { Group, Student } from '../types';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintViewProps {
  groups: Group[];
  excludedStudents: Student[];
  isPair: boolean;
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  groups,
  excludedStudents,
  isPair,
  onBack,
}) => {
  const dateStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      {/* Printable Area Wrapper */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>돌아가기</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>지금 인쇄하기 (Ctrl + P)</span>
          </button>
        </div>

        {/* Printable Paper Document */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0">
          {/* Paper Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              학급 친구 {isPair ? '짝지기' : '소모둠'} 매칭 표
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              날짜: {dateStr}
            </p>
          </div>

          {/* Groups Grid */}
          <div className="py-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {groups.map((g, idx) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl border-2 border-slate-800 space-y-2 text-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                  <span className="font-extrabold text-base">
                    {idx + 1}. {g.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    ({g.members.length}명)
                  </span>
                </div>

                <div className="text-sm font-bold pt-1 space-y-1">
                  {isPair ? (
                    <div className="text-center py-1 text-base font-extrabold">
                      {g.members.map((m) => m.name).join('  🤝  ')}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {g.members.map((m) => (
                        <span
                          key={m.id}
                          className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300 text-xs font-bold"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Excluded Students */}
          {excludedStudents.length > 0 && (
            <div className="pt-4 border-t border-slate-300 text-xs font-bold text-slate-600">
              * 오늘 결석/제외 학생 ({excludedStudents.length}명):{' '}
              {excludedStudents.map((s) => s.name).join(', ')}
            </div>
          )}

          {/* Footer Notice */}
          <div className="pt-8 text-center text-[10px] text-slate-400 border-t border-slate-200 mt-8">
            모두의 짝꿍 학급 매처 | 로컬 기기 안전 저장 시스템
          </div>
        </div>
      </div>
    </div>
  );
};
