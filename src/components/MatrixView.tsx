import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { GeneratedExamPackage, MatrixRow } from '../types/exam';
import { exportMatrixAndSpecDocx } from '../utils/docxExport';

interface MatrixViewProps {
  exam: GeneratedExamPackage;
  onUpdateMatrix: (rows: MatrixRow[]) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ exam, onUpdateMatrix }) => {
  const [rows, setRows] = useState<MatrixRow[]>(exam.matrix.rows || []);
  const [isEditing, setIsEditing] = useState(false);

  // Tính tổng các cột
  const totalNB_TN = rows.reduce((acc, r) => acc + (r.nhanBietTN || 0), 0);
  const totalNB_TL = rows.reduce((acc, r) => acc + (r.nhanBietTL || 0), 0);
  const totalTH_TN = rows.reduce((acc, r) => acc + (r.thongHieuTN || 0), 0);
  const totalTH_TL = rows.reduce((acc, r) => acc + (r.thongHieuTL || 0), 0);
  const totalVD_TN = rows.reduce((acc, r) => acc + (r.vanDungTN || 0), 0);
  const totalVD_TL = rows.reduce((acc, r) => acc + (r.vanDungTL || 0), 0);
  const totalVDC_TN = rows.reduce((acc, r) => acc + (r.vanDungCaoTN || 0), 0);
  const totalVDC_TL = rows.reduce((acc, r) => acc + (r.vanDungCaoTL || 0), 0);

  const totalQuestions = rows.reduce((acc, r) => acc + (r.totalQuestions || 0), 0);
  const totalPoints = Number(rows.reduce((acc, r) => acc + (r.totalScore || 0), 0).toFixed(2));
  const totalPercent = Math.round(rows.reduce((acc, r) => acc + (r.percentageScore || 0), 0));

  const handleCellChange = (index: number, field: keyof MatrixRow, value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    
    // Tự động tính lại tổng số câu của dòng
    const row = updated[index];
    const totalQ = (row.nhanBietTN || 0) + (row.nhanBietTL || 0) + 
                   (row.thongHieuTN || 0) + (row.thongHieuTL || 0) + 
                   (row.vanDungTN || 0) + (row.vanDungTL || 0) + 
                   (row.vanDungCaoTN || 0) + (row.vanDungCaoTL || 0);
    row.totalQuestions = totalQ;
    setRows(updated);
  };

  const handleSaveMatrix = () => {
    onUpdateMatrix(rows);
    setIsEditing(false);
  };

  const handleAddRow = () => {
    const newRow: MatrixRow = {
      topic: 'Chủ đề mới',
      knowledgeUnit: 'Đơn vị kiến thức mới',
      nhanBietTN: 1,
      nhanBietTL: 0,
      thongHieuTN: 1,
      thongHieuTL: 0,
      vanDungTN: 0,
      vanDungTL: 0,
      vanDungCaoTN: 0,
      vanDungCaoTL: 0,
      totalQuestions: 2,
      totalScore: 1.0,
      percentageScore: 10
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-blue-600" />
            Ma trận Đề kiểm tra định kỳ (Chuẩn GDPT 2018 - Thông tư 22/2021)
          </h3>
          <p className="text-xs text-slate-500">
            Môn {exam.metadata.subject} Lớp {exam.metadata.grade} - Thời gian {exam.timeLimit} phút
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveMatrix}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Lưu thay đổi ma trận
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Chỉnh sửa ma trận
            </button>
          )}

          <button
            onClick={() => exportMatrixAndSpecDocx(exam)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Ma trận Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Bảng Ma trận */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-center">
                <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[140px] text-left">
                  Chủ đề / Mạch kiến thức
                </th>
                <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[180px] text-left">
                  Đơn vị kiến thức / Yêu cầu
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-200 bg-blue-50/70 text-blue-900">
                  1. Nhận biết
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-200 bg-indigo-50/70 text-indigo-900">
                  2. Thông hiểu
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-200 bg-amber-50/70 text-amber-900">
                  3. Vận dụng
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-200 bg-red-50/70 text-red-900">
                  4. Vận dụng cao
                </th>
                <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[70px]">
                  Tổng số câu
                </th>
                <th rowSpan={2} className="p-3 border-r border-slate-200 min-w-[70px]">
                  Tổng điểm
                </th>
                <th rowSpan={2} className="p-3 min-w-[70px]">
                  Tỉ lệ %
                </th>
                {isEditing && <th rowSpan={2} className="p-2">Xóa</th>}
              </tr>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-700 border-b border-slate-200 text-center">
                <th className="p-1.5 border-r border-slate-200 bg-blue-50/40">TN</th>
                <th className="p-1.5 border-r border-slate-200 bg-blue-50/40">TL</th>
                <th className="p-1.5 border-r border-slate-200 bg-indigo-50/40">TN</th>
                <th className="p-1.5 border-r border-slate-200 bg-indigo-50/40">TL</th>
                <th className="p-1.5 border-r border-slate-200 bg-amber-50/40">TN</th>
                <th className="p-1.5 border-r border-slate-200 bg-amber-50/40">TL</th>
                <th className="p-1.5 border-r border-slate-200 bg-red-50/40">TN</th>
                <th className="p-1.5 border-r border-slate-200 bg-red-50/40">TL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.topic}
                        onChange={(e) => handleCellChange(index, 'topic', e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      />
                    ) : (
                      row.topic
                    )}
                  </td>
                  <td className="p-3 border-r border-slate-200 text-slate-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.knowledgeUnit}
                        onChange={(e) => handleCellChange(index, 'knowledgeUnit', e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      />
                    ) : (
                      row.knowledgeUnit
                    )}
                  </td>
                  
                  {/* Nhận biết */}
                  <td className="p-2 border-r border-slate-200 text-center bg-blue-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.nhanBietTN}
                        onChange={(e) => handleCellChange(index, 'nhanBietTN', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.nhanBietTN || '-'
                    )}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center bg-blue-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.nhanBietTL}
                        onChange={(e) => handleCellChange(index, 'nhanBietTL', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.nhanBietTL || '-'
                    )}
                  </td>

                  {/* Thông hiểu */}
                  <td className="p-2 border-r border-slate-200 text-center bg-indigo-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.thongHieuTN}
                        onChange={(e) => handleCellChange(index, 'thongHieuTN', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.thongHieuTN || '-'
                    )}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center bg-indigo-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.thongHieuTL}
                        onChange={(e) => handleCellChange(index, 'thongHieuTL', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.thongHieuTL || '-'
                    )}
                  </td>

                  {/* Vận dụng */}
                  <td className="p-2 border-r border-slate-200 text-center bg-amber-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.vanDungTN}
                        onChange={(e) => handleCellChange(index, 'vanDungTN', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.vanDungTN || '-'
                    )}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center bg-amber-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.vanDungTL}
                        onChange={(e) => handleCellChange(index, 'vanDungTL', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.vanDungTL || '-'
                    )}
                  </td>

                  {/* Vận dụng cao */}
                  <td className="p-2 border-r border-slate-200 text-center bg-red-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.vanDungCaoTN}
                        onChange={(e) => handleCellChange(index, 'vanDungCaoTN', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.vanDungCaoTN || '-'
                    )}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center bg-red-50/20">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={row.vanDungCaoTL}
                        onChange={(e) => handleCellChange(index, 'vanDungCaoTL', parseInt(e.target.value) || 0)}
                        className="w-12 text-center p-1 border rounded"
                      />
                    ) : (
                      row.vanDungCaoTL || '-'
                    )}
                  </td>

                  {/* Tổng kết dòng */}
                  <td className="p-3 border-r border-slate-200 text-center font-bold text-slate-900">
                    {row.totalQuestions}
                  </td>
                  <td className="p-3 border-r border-slate-200 text-center font-bold text-blue-700">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.25"
                        value={row.totalScore}
                        onChange={(e) => handleCellChange(index, 'totalScore', parseFloat(e.target.value) || 0)}
                        className="w-14 text-center p-1 border rounded"
                      />
                    ) : (
                      `${row.totalScore} đ`
                    )}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-700">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.percentageScore}
                        onChange={(e) => handleCellChange(index, 'percentageScore', parseInt(e.target.value) || 0)}
                        className="w-14 text-center p-1 border rounded"
                      />
                    ) : (
                      `${row.percentageScore}%`
                    )}
                  </td>
                  {isEditing && (
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

            {/* Hàng tổng kết toàn bài */}
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 text-center">
                <td colSpan={2} className="p-3 text-left border-r border-slate-200 uppercase">
                  Tổng hợp chung toàn bài
                </td>
                <td className="p-2 border-r border-slate-200 bg-blue-100/60">{totalNB_TN}</td>
                <td className="p-2 border-r border-slate-200 bg-blue-100/60">{totalNB_TL}</td>
                <td className="p-2 border-r border-slate-200 bg-indigo-100/60">{totalTH_TN}</td>
                <td className="p-2 border-r border-slate-200 bg-indigo-100/60">{totalTH_TL}</td>
                <td className="p-2 border-r border-slate-200 bg-amber-100/60">{totalVD_TN}</td>
                <td className="p-2 border-r border-slate-200 bg-amber-100/60">{totalVD_TL}</td>
                <td className="p-2 border-r border-slate-200 bg-red-100/60">{totalVDC_TN}</td>
                <td className="p-2 border-r border-slate-200 bg-red-100/60">{totalVDC_TL}</td>
                <td className="p-3 border-r border-slate-200 text-blue-700">{totalQuestions} câu</td>
                <td className="p-3 border-r border-slate-200 text-emerald-700">{totalPoints} điểm</td>
                <td className="p-3 text-slate-800">{totalPercent}%</td>
                {isEditing && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>

        {isEditing && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm dòng chủ đề mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
