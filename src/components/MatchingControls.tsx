import React from 'react';
import { GroupConfig, MatchingType } from '../types';
import { Users, UserCheck, Shuffle, Sparkles, SlidersHorizontal, AlertCircle, Layers } from 'lucide-react';

interface MatchingControlsProps {
  config: GroupConfig;
  onChangeConfig: (newConfig: GroupConfig) => void;
  activeStudentCount: number;
  totalStudentCount: number;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const MatchingControls: React.FC<MatchingControlsProps> = ({
  config,
  onChangeConfig,
  activeStudentCount,
  totalStudentCount,
  onGenerate,
  isGenerating,
}) => {
  const isPair = config.type === 'pair';

  const handleTypeChange = (type: MatchingType) => {
    onChangeConfig({
      ...config,
      type,
      groupSize: type === 'pair' ? 2 : Math.max(3, config.groupSize),
    });
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          매칭 유형 및 옵션 선택
        </h2>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          매칭 대상: <strong className="text-indigo-900">{activeStudentCount}명</strong>
        </span>
      </div>

      {/* Matching Type Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pair Match Option */}
        <button
          type="button"
          onClick={() => handleTypeChange('pair')}
          className={`p-4 rounded-2xl border-2 text-left transition-all relative flex items-center gap-4 ${
            isPair
              ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-xl ${
              isPair ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
            }`}
          >
            👥
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-base">짝 매칭 (2인 1조)</span>
              {isPair && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              친구와 1:1로 짝을 이루어 활동합니다.
            </p>
          </div>
        </button>

        {/* Small Group Match Option */}
        <button
          type="button"
          onClick={() => handleTypeChange('group')}
          className={`p-4 rounded-2xl border-2 text-left transition-all relative flex items-center gap-4 ${
            !isPair
              ? 'border-purple-600 bg-purple-50/60 shadow-md shadow-purple-100'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-xl ${
              !isPair ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
            }`}
          >
            👨‍👩‍👧‍👦
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-base">소규모 그룹 매칭</span>
              {!isPair && (
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              3~5명 이상의 모둠이나 소그룹을 구성합니다.
            </p>
          </div>
        </button>
      </div>

      {/* Dynamic Detailed Controls */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
        {!isPair && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                그룹 설정 방식:
              </span>
              <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onChangeConfig({ ...config, mode: 'by_size' })}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    config.mode === 'by_size'
                      ? 'bg-white text-purple-700 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  그룹당 인원 지정
                </button>
                <button
                  type="button"
                  onClick={() => onChangeConfig({ ...config, mode: 'by_count' })}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    config.mode === 'by_count'
                      ? 'bg-white text-purple-700 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  총 그룹 개수 지정
                </button>
              </div>
            </div>

            {config.mode === 'by_size' ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-700">모둠당 목표 인원:</span>
                <div className="flex items-center gap-3">
                  {[3, 4, 5, 6].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onChangeConfig({ ...config, groupSize: size })}
                      className={`w-9 h-9 rounded-xl font-extrabold text-sm transition-all ${
                        config.groupSize === size
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {size}명
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-700">생성할 모둠 개수:</span>
                <div className="flex items-center gap-3">
                  {[2, 3, 4, 5, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => onChangeConfig({ ...config, targetCount: count })}
                      className={`w-9 h-9 rounded-xl font-extrabold text-sm transition-all ${
                        config.targetCount === count
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}개
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leftover Handling Option */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
          <span className="text-xs font-bold text-slate-700">
            남는 인원(잔여 인원) 처리:
          </span>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => onChangeConfig({ ...config, leftoverOption: 'merge' })}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                config.leftoverOption === 'merge'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              기존 모둠에 나눠 넣기 (예: 3인 짝)
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig({ ...config, leftoverOption: 'separate' })}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                config.leftoverOption === 'separate'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              독립된 소규모 모둠 구성
            </button>
          </div>
        </div>

        {/* History Collision Optimization Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <div>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              ✨ 이전 매칭 중복 최소화
            </span>
            <p className="text-[11px] text-slate-500">
              과거 매칭 기록을 참고하여 이전에 안 만난 친구와 우선 조합합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChangeConfig({ ...config, minimizeOverlap: !config.minimizeOverlap })
            }
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              config.minimizeOverlap ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                config.minimizeOverlap ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Student Trait Balance Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <div>
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
              🎯 학생 성향 &amp; 특성 균형 매칭
            </span>
            <p className="text-[11px] text-slate-500">
              학습부진/도움반 학생을 또래도우미 또는 인기 친구와 자동으로 우선 짝지어 줍니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChangeConfig({ ...config, considerTraits: !config.considerTraits })
            }
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              config.considerTraits ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                config.considerTraits ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Warning if insufficient active students */}
      {activeStudentCount < 2 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>매칭을 시작하려면 최소 2명 이상의 학생이 참여 목록에 있어야 합니다.</span>
        </div>
      )}

      {/* Big Action Button */}
      <button
        onClick={onGenerate}
        disabled={activeStudentCount < 2 || isGenerating}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-indigo-200 active:scale-98 transition-all flex items-center justify-center gap-3"
      >
        <Shuffle className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? '신나게 친구 조합 생성 중...' : '🎲 새로운 친구 매칭 시작하기!'}</span>
      </button>
    </section>
  );
};
