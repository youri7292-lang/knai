import React from 'react';
import { Student, MatchRecord } from '../types';
import { buildPairFrequencyMap, getPairCount } from '../utils/matching';
import { Grid3X3, X, Users, Sparkles } from 'lucide-react';

interface PairMatrixModalProps {
  students: Student[];
  history: MatchRecord[];
  onClose: () => void;
}

export const PairMatrixModal: React.FC<PairMatrixModalProps> = ({
  students,
  history,
  onClose,
}) => {
  const freqMap = buildPairFrequencyMap(history);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-purple-600">
            <Grid3X3 className="w-6 h-6" />
            <h3 className="text-xl font-black text-slate-800">친구별 매칭 횟수 통계</h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
              총 {history.length}회 기록 분석
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 shrink-0">
          숫자는 지금까지 함께 짝이나 같은 모둠에 지정된 횟수입니다. 숫자가 0인 조합은 아직 한 번도 같은 팀이 되지 않은 친구들입니다.
        </p>

        {/* Matrix Scrollable Container */}
        <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl p-2 bg-slate-50 scrollbar-thin">
          {students.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              등록된 학생이 없습니다.
            </div>
          ) : (
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 sticky left-0 top-0 bg-slate-200 font-bold text-slate-700 rounded-tl-xl z-20 min-w-[70px]">
                    학생
                  </th>
                  {students.map((s) => (
                    <th
                      key={s.id}
                      className="p-2 sticky top-0 bg-slate-100 font-extrabold text-slate-700 min-w-[50px] z-10 border-b border-slate-200 truncate"
                      title={s.name}
                    >
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((sRow, rIdx) => (
                  <tr key={sRow.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="p-2 sticky left-0 bg-slate-100 font-extrabold text-slate-800 border-r border-slate-200 z-10 text-left truncate">
                      {sRow.name}
                    </td>

                    {students.map((sCol, cIdx) => {
                      if (rIdx === cIdx) {
                        return (
                          <td
                            key={sCol.id}
                            className="p-2 bg-slate-200/50 text-slate-400 font-bold"
                          >
                            -
                          </td>
                        );
                      }

                      const count = getPairCount(freqMap, sRow.id, sCol.id);

                      let bgClass = 'bg-white text-slate-400';
                      if (count === 1) bgClass = 'bg-purple-100 text-purple-900 font-bold';
                      else if (count === 2) bgClass = 'bg-purple-300 text-purple-950 font-black';
                      else if (count >= 3) bgClass = 'bg-purple-600 text-white font-black';

                      return (
                        <td
                          key={sCol.id}
                          className={`p-2 border border-slate-200/60 font-semibold transition-colors ${bgClass}`}
                          title={`${sRow.name} & ${sCol.name}: ${count}회 매칭`}
                        >
                          {count}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 shrink-0 border-t border-slate-100">
          <span className="font-bold">범례:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-white border border-slate-300 rounded-sm" /> 0회 (미매칭)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-100 rounded-sm" /> 1회
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-300 rounded-sm" /> 2회
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-600 rounded-sm" /> 3회 이상
          </span>
        </div>
      </div>
    </div>
  );
};
