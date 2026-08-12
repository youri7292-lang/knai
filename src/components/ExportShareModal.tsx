import React, { useState } from 'react';
import { Group, Student } from '../types';
import {
  Printer,
  Copy,
  Check,
  X,
  ShieldAlert,
  FileText,
  Share2,
  Lock
} from 'lucide-react';

interface ExportShareModalProps {
  groups: Group[];
  excludedStudents: Student[];
  isPair: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  groups,
  excludedStudents,
  isPair,
  onClose,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  const getFormattedText = () => {
    let text = `[모두의 짝꿍] ${isPair ? '짝' : '소그룹'} 매칭 결과 📋\n`;
    text += `일시: ${new Date().toLocaleDateString('ko-KR')} ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}\n\n`;

    groups.forEach((g, idx) => {
      const names = g.members.map((m) => m.name).join(isPair ? ' - ' : ', ');
      text += `${idx + 1}. ${g.name}: ${names}\n`;
    });

    if (excludedStudents.length > 0) {
      text += `\n* 결석/제외 학생: ${excludedStudents.map((s) => s.name).join(', ')}`;
    }

    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            매칭 결과 공유 및 인쇄
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REQUIRED PRIVACY NOTICE BANNER */}
        <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 space-y-2 text-xs text-indigo-950">
          <div className="flex items-center gap-2 font-black text-indigo-900">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>🔒 데이터 내보내기 정보 안내</span>
          </div>
          <p className="leading-relaxed">
            공유되거나 인쇄되는 정보에는 <strong>사용자가 직접 입력하신 학생 닉네임과 그룹 구성 결과</strong>만 포함됩니다.
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-indigo-900/80 font-medium">
            <li>외부 서버로 어떠한 데이터도 자동 수집되거나 전달되지 않습니다.</li>
            <li>실명이 아닌 닉네임 사용으로 학생의 개인정보를 더욱 안전하게 보호하세요.</li>
          </ul>
        </div>

        {/* Text Preview Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>미리보기 텍스트:</span>
            <span className="text-[11px] text-slate-400">카카오톡, 클래스팅, 밴드 등에 붙여넣기</span>
          </label>
          <textarea
            readOnly
            rows={7}
            value={getFormattedText()}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopyText}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>클립보드 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>텍스트 복사하기</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onPrint();
              onClose();
            }}
            className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>A4 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};
