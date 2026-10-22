import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Download, 
  Printer, 
  Trash2, 
  FileText, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Copy, 
  Sparkles, 
  CheckCircle,
  Shuffle
} from 'lucide-react';
import { GeneratedExamPackage } from '../types/exam';
import { getSavedExams, deleteExamPackage, saveExamPackage } from '../utils/storage';
import { exportStudentExamDocx, exportAnswerKeyDocx, exportMatrixAndSpecDocx } from '../utils/docxExport';

interface ManageExamsViewProps {
  currentExam: GeneratedExamPackage | null;
  onLoadExam: (exam: GeneratedExamPackage) => void;
  onGenerateMoreVariants: () => void;
}

export const ManageExamsView: React.FC<ManageExamsViewProps> = ({
  currentExam,
  onLoadExam,
  onGenerateMoreVariants
}) => {
  const [savedList, setSavedList] = useState<GeneratedExamPackage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadList = () => {
    setSavedList(getSavedExams());
  };

  useEffect(() => {
    loadList();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa đề thi này khỏi danh sách lưu trữ?')) {
      deleteExamPackage(id);
      loadList();
      showToast('Đã xóa đề thi khỏi danh sách lưu trữ.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              Trung tâm Quản lý & Xuất Hồ sơ Đề kiểm tra
            </h3>
            <p className="text-xs text-slate-500">
              Xuất tài liệu Word (.docx) chuẩn thể thức giáo dục Việt Nam (Times New Roman cỡ 13-14), In trực tiếp và quản lý các bộ đề
            </p>
          </div>

          {currentExam && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onGenerateMoreVariants}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Tự động đảo trắc nghiệm sinh thêm mã đề 102, 103, 104"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Sinh thêm mã đề tương đương</span>
              </button>
            </div>
          )}
        </div>

        {/* Khối xuất nhanh cho Đề hiện tại */}
        {currentExam && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  Đang mở đề hiện tại:
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {currentExam.examTitle} (Môn {currentExam.metadata.subject} Lớp {currentExam.metadata.grade})
                </span>
              </div>
              <span className="text-xs font-semibold bg-white text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                Có {currentExam.variants.length} mã đề
              </span>
            </div>

            {/* Các nút tải Word chuyên dụng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => exportStudentExamDocx(currentExam)}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1. Tải Đề thi học sinh (Word)</span>
              </button>

              <button
                onClick={() => exportAnswerKeyDocx(currentExam)}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>2. Tải Đáp án & Barem (Word)</span>
              </button>

              <button
                onClick={() => exportMatrixAndSpecDocx(currentExam)}
                className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>3. Tải Ma trận & Bản đặc tả</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In đề / Xuất file PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách các đề kiểm tra đã lưu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-600" />
          Lịch sử các Đề kiểm tra đã lưu trong hệ thống ({savedList.length} đề)
        </h4>

        {savedList.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            Chưa có đề nào được lưu. Bạn có thể nhấn <strong>"Lưu đề thi"</strong> tại thanh công cụ sau khi tạo đề.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedList.map((exam) => (
              <div
                key={exam.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-blue-700 block text-xs">
                      {exam.metadata.subject} - Lớp {exam.metadata.grade} ({exam.metadata.textbook})
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-0.5">
                      {exam.examTitle}
                    </h5>
                  </div>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Xóa đề này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {exam.timeLimit} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span>{exam.variants.length} mã đề</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    onClick={() => onLoadExam(exam)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở đề này</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportStudentExamDocx(exam)}
                      className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg"
                      title="Tải Word đề thi"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exportAnswerKeyDocx(exam)}
                      className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 rounded-lg"
                      title="Tải Word đáp án"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
