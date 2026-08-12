import React, { useState } from 'react';
import { MatchRecord } from '../types';
import {
  History,
  Trash2,
  X,
  Calendar,
  Users,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HistoryModalProps {
  history: MatchRecord[];
  onDeleteRecord: (id: string) => void;
  onRestoreRecord: (record: MatchRecord) => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onDeleteRecord,
  onRestoreRecord,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(
    history.length > 0 ? history[0].id : null
  );

  const filteredHistory = history.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.groups.some((g) => g.members.some((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 border border-slate-100 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-indigo-600">
            <History className="w-6 h-6" />
            <h3 className="text-xl font-black text-slate-800">지난 매칭 기록</h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              총 {history.length}건
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="기록 날짜 또는 학생 이름 검색..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {history.length === 0
                ? '아직 저장된 매칭 기록이 없습니다. 매칭 후 [기록 저장] 버튼을 누르면 여기에 보관됩니다.'
                : '검색 조건과 일치하는 매칭 기록이 없습니다.'}
            </div>
          ) : (
            filteredHistory.map((record) => {
              const isExpanded = expandedRecordId === record.id;
              const dateObj = new Date(record.timestamp);
              const formattedDate = `${dateObj.toLocaleDateString('ko-KR')} ${dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <div
                  key={record.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 hover:border-indigo-300 transition-colors"
                >
                  {/* Record Row Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                      className="cursor-pointer flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {record.type === 'pair' ? '짝' : '모둠'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">
                          {record.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </span>
                          <span>•</span>
                          <span>{record.groups.length}개 조</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onRestoreRecord(record);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs transition-colors"
                        title="이 매칭 결과를 현재 화면에 불러오기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>불러오기</span>
                      </button>

                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="이 기록 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Group Members */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {record.groups.map((g, idx) => (
                        <div
                          key={g.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1"
                        >
                          <span className="font-extrabold text-indigo-900 block">
                            {idx + 1}. {g.name}
                          </span>
                          <p className="text-slate-700 font-medium">
                            {g.members.map((m) => m.name).join(record.type === 'pair' ? ' - ' : ', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
