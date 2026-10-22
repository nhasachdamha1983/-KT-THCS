import React from 'react';
import { FileCheck2, Download } from 'lucide-react';
import { GeneratedExamPackage, SpecificationItem } from '../types/exam';
import { exportMatrixAndSpecDocx } from '../utils/docxExport';

interface SpecificationViewProps {
  exam: GeneratedExamPackage;
}

export const SpecificationView: React.FC<SpecificationViewProps> = ({ exam }) => {
  const specs = exam.specification || [];

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            Bản đặc tả Đề kiểm tra định kỳ (Chuẩn Yêu cầu cần đạt GDPT 2018)
          </h3>
          <p className="text-xs text-slate-500">
            Môn {exam.metadata.subject} Lớp {exam.metadata.grade} - Bộ sách {exam.metadata.textbook}
          </p>
        </div>

        <button
          onClick={() => exportMatrixAndSpecDocx(exam)}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Tải Bản đặc tả Word (.docx)</span>
        </button>
      </div>

      {/* Bảng Bản đặc tả */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3 border-r border-slate-200 w-12 text-center">TT</th>
                <th className="p-3 border-r border-slate-200 min-w-[150px]">Chủ đề / Đơn vị kiến thức</th>
                <th className="p-3 border-r border-slate-200 min-w-[240px]">Yêu cầu cần đạt (chuẩn GDPT 2018)</th>
                <th className="p-3 border-r border-slate-200 min-w-[280px]">Mức độ đánh giá chi tiết</th>
                <th className="p-3 min-w-[120px] text-center">Câu hỏi trong đề</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {specs.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors align-top">
                  <td className="p-3 border-r border-slate-200 text-center font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">
                    <div>{item.topic}</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-1">({item.knowledgeUnit})</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 text-slate-700 leading-relaxed">
                    {item.requiredCompetency}
                  </td>
                  <td className="p-3 border-r border-slate-200 space-y-1.5 text-xs">
                    {item.nhanBietDesc && (
                      <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-900">Nhận biết: </span>
                        <span className="text-blue-950">{item.nhanBietDesc}</span>
                      </div>
                    )}
                    {item.thongHieuDesc && (
                      <div className="bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                        <span className="font-bold text-indigo-900">Thông hiểu: </span>
                        <span className="text-indigo-950">{item.thongHieuDesc}</span>
                      </div>
                    )}
                    {item.vanDungDesc && (
                      <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-900">Vận dụng: </span>
                        <span className="text-amber-950">{item.vanDungDesc}</span>
                      </div>
                    )}
                    {item.vanDungCaoDesc && (
                      <div className="bg-red-50/60 p-2 rounded-lg border border-red-100">
                        <span className="font-bold text-red-900">Vận dụng cao: </span>
                        <span className="text-red-950">{item.vanDungCaoDesc}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center font-bold text-blue-700">
                    <span className="inline-block bg-blue-50 border border-blue-200 px-2 py-1 rounded-md text-xs">
                      {item.questionNumbers}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
