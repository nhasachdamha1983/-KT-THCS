import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Edit3, 
  Check, 
  X, 
  BookmarkPlus, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Binary,
  Code
} from 'lucide-react';
import { GeneratedExamPackage, QuestionItem } from '../types/exam';
import { exportStudentExamDocx } from '../utils/docxExport';
import { saveExamQuestionsToBank } from '../utils/storage';
import { MathRenderer } from './MathRenderer';

interface ExamPreviewProps {
  exam: GeneratedExamPackage;
  onUpdateQuestion: (updatedQuestion: QuestionItem) => void;
  onRegenerateQuestion: (question: QuestionItem, prompt: string) => Promise<void>;
  onSaveExam: () => void;
}

export const ExamPreview: React.FC<ExamPreviewProps> = ({
  exam,
  onUpdateQuestion,
  onRegenerateQuestion,
  onSaveExam
}) => {
  const [selectedVariantCode, setSelectedVariantCode] = useState<string>(exam.currentVariantCode || '101');
  const [showAnswersInExam, setShowAnswersInExam] = useState(false);
  const [renderMathMode, setRenderMathMode] = useState(true); // true: KaTeX visual, false: raw MathType $...$
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editStem, setEditStem] = useState('');
  const [editPoints, setEditPoints] = useState(0.25);
  const [editNotes, setEditNotes] = useState('');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regenPrompt, setRegenPrompt] = useState('');
  const [activeRegenModalId, setActiveRegenModalId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMathTypeGuide, setShowMathTypeGuide] = useState(false);

  const activeVariant = exam.variants.find(v => v.code === selectedVariantCode) || exam.variants[0];
  const questions = activeVariant?.questions || [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartEdit = (q: QuestionItem) => {
    setEditingQuestionId(q.id);
    setEditStem(q.stem);
    setEditPoints(q.points);
    setEditNotes(q.notes || '');
  };

  const handleSaveEdit = (q: QuestionItem) => {
    onUpdateQuestion({
      ...q,
      stem: editStem,
      points: editPoints,
      notes: editNotes
    });
    setEditingQuestionId(null);
    showToast('Đã lưu thay đổi nội dung câu hỏi!');
  };

  const handleTriggerRegen = async (q: QuestionItem) => {
    setRegeneratingId(q.id);
    setActiveRegenModalId(null);
    try {
      await onRegenerateQuestion(q, regenPrompt);
      showToast(`AI đã tạo lại câu ${q.number} thành công!`);
    } catch (e: any) {
      alert('Không thể tạo lại câu hỏi: ' + (e.message || 'Lỗi mạng'));
    } finally {
      setRegeneratingId(null);
      setRegenPrompt('');
    }
  };

  const handleCopyExamText = () => {
    let fullText = `${exam.metadata.schoolName.toUpperCase()}\n${exam.metadata.departmentName.toUpperCase()}\n\n`;
    fullText += `${exam.examTitle.toUpperCase()}\nMôn: ${exam.metadata.subject} - Lớp ${exam.metadata.grade}\n`;
    fullText += `Thời gian làm bài: ${exam.timeLimit} phút - Mã đề: ${selectedVariantCode}\n`;
    fullText += `-----------------------------------------\n\n`;

    questions.forEach(q => {
      fullText += `Câu ${q.number} (${q.points} điểm): ${q.stem}\n`;
      if (q.options) {
        q.options.forEach(opt => {
          fullText += `  ${opt.key}. ${opt.content}\n`;
        });
      }
      if (q.subItems) {
        q.subItems.forEach(s => {
          fullText += `  ${s.key}) ${s.statement}\n`;
        });
      }
      if (showAnswersInExam) {
        if (q.correctAnswer) fullText += `  -> Đáp án: ${q.correctAnswer}\n`;
        if (q.essaySolution) fullText += `  -> Hướng dẫn: ${q.essaySolution}\n`;
      }
      fullText += '\n';
    });

    navigator.clipboard.writeText(fullText);
    showToast('Đã sao chép toàn bộ nội dung đề thi (kèm mã MathType $...) vào bộ nhớ tạm!');
  };

  const handleSaveQuestionsToBank = () => {
    const count = saveExamQuestionsToBank(exam);
    showToast(`Đã lưu ${count} câu hỏi từ đề vào Ngân hàng câu hỏi!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper render text hoặc KaTeX
  const renderTextOrMath = (text: string | undefined, asBlock = false) => {
    if (!text) return null;
    if (!renderMathMode) {
      return <span className="font-mono text-xs text-blue-900 whitespace-pre-wrap">{text}</span>;
    }
    return <MathRenderer content={text} asBlock={asBlock} />;
  };

  // Phân nhóm câu hỏi
  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  const tfQuestions = questions.filter(q => q.type === 'true_false');
  const saQuestions = questions.filter(q => q.type === 'short_answer');
  const essayQuestions = questions.filter(q => q.type === 'essay' || q.type === 'practical_task');

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner hướng dẫn MathType cho giáo viên */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-100 p-1.5 rounded-lg text-amber-800 font-bold text-xs shrink-0 flex items-center gap-1">
            <Binary className="w-4 h-4 text-amber-700" />
            MathType
          </div>
          <div>
            <span className="font-bold">Đề kiểm tra chuẩn công thức MathType / TeX: </span>
            <span className="text-amber-800">
              Các công thức toán học được bảo toàn định dạng <strong>$...$</strong>. Khi mở file Word, nhấn tổ hợp phím tắt <strong>Alt + \</strong> để tự động chuyển thành công thức MathType tương thích 100%!
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowMathTypeGuide(!showMathTypeGuide)}
          className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline shrink-0"
        >
          {showMathTypeGuide ? 'Ẩn hướng dẫn' : 'Xem cách dùng MathType'}
        </button>
      </div>

      {showMathTypeGuide && (
        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm text-xs text-slate-700 space-y-2 animate-in fade-in print:hidden">
          <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Cách chuyển đổi công thức sang MathType trong Microsoft Word:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 leading-relaxed text-slate-700">
            <li>Tải đề thi về máy bằng nút <strong>"Tải đề Word (.docx)"</strong>.</li>
            <li>Mở file Word trên máy tính đã cài đặt tiện ích MathType.</li>
            <li>Nhấn tổ hợp phím <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono">Ctrl + A</kbd> để bôi đen toàn bộ văn bản.</li>
            <li>Nhấn tổ hợp phím tắt <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono">Alt + \</kbd> (phím Toggle TeX của MathType).</li>
            <li>Toàn bộ các biểu thức dạng <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">$x^2 - 4xy...$</code> sẽ lập tức biến thành các đối tượng MathType sắc nét, có thể double-click để chỉnh sửa trực tiếp.</li>
          </ol>
        </div>
      )}

      {/* Toolbar điều khiển phía trên */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Chọn mã đề */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Mã đề:</span>
          <div className="flex gap-1.5">
            {exam.variants.map((v) => (
              <button
                key={v.code}
                onClick={() => setSelectedVariantCode(v.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedVariantCode === v.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mã {v.code}
              </button>
            ))}
          </div>
        </div>

        {/* Các nút tính năng */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle chế độ xem Công thức KaTeX / MathType code */}
          <button
            onClick={() => setRenderMathMode(!renderMathMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              renderMathMode
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                : 'bg-slate-100 text-slate-800 border-slate-300 font-mono'
            }`}
            title="Chuyển đổi giữa xem công thức đồ họa KaTeX và xem mã MathType gốc ($...$)"
          >
            {renderMathMode ? <Binary className="w-3.5 h-3.5 text-blue-600" /> : <Code className="w-3.5 h-3.5 text-slate-600" />}
            <span>{renderMathMode ? 'Công thức trực quan' : 'Mã MathType ($...$)'}</span>
          </button>

          {/* Hiện / Ẩn đáp án */}
          <button
            onClick={() => setShowAnswersInExam(!showAnswersInExam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              showAnswersInExam
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Bật/Tắt hiển thị đáp án và hướng dẫn giải ngay trong đề"
          >
            {showAnswersInExam ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAnswersInExam ? 'Ẩn đáp án trong đề' : 'Hiện đáp án trong đề'}</span>
          </button>

          {/* Lưu đề vào lịch sử */}
          <button
            onClick={onSaveExam}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Lưu đề</span>
          </button>

          {/* Lưu vào ngân hàng câu hỏi */}
          <button
            onClick={handleSaveQuestionsToBank}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vào Ngân hàng</span>
          </button>

          {/* Sao chép văn bản */}
          <button
            onClick={handleCopyExamText}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>Sao chép</span>
          </button>

          {/* In đề thi */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>In / PDF</span>
          </button>

          {/* Xuất file Word */}
          <button
            onClick={() => exportStudentExamDocx(exam, selectedVariantCode)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải đề Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Khung tờ giấy thi (Giả lập trang in A4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto font-serif print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Header Quốc hiệu / Trường học */}
        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 text-center">
          <div>
            <div className="font-bold text-sm tracking-wide text-slate-900 uppercase">
              {exam.metadata.schoolName}
            </div>
            <div className="font-semibold text-xs text-slate-700 uppercase">
              {exam.metadata.departmentName}
            </div>
            <div className="text-xs text-slate-400">-----------------------</div>
            <div className="mt-1 font-bold text-xs bg-slate-100 inline-block px-3 py-1 rounded-sm border border-slate-300">
              MÃ ĐỀ THI: {selectedVariantCode}
            </div>
          </div>

          <div>
            <div className="font-bold text-base text-slate-900 tracking-wide uppercase">
              {exam.examTitle}
            </div>
            <div className="font-bold text-xs text-slate-800 uppercase">
              MÔN: {exam.metadata.subject.toUpperCase()} - LỚP {exam.metadata.grade}
            </div>
            <div className="italic text-xs text-slate-600">
              Năm học: {exam.metadata.schoolYear}
            </div>
            <div className="italic text-xs text-slate-600">
              Thời gian làm bài: {exam.timeLimit} phút (không kể thời gian phát đề)
            </div>
          </div>
        </div>

        {/* Khung thông tin học sinh & Điểm số */}
        <div className="grid grid-cols-12 border border-slate-300 text-xs mb-6 rounded-xs overflow-hidden">
          <div className="col-span-8 p-3 border-r border-slate-300 space-y-2">
            <div>
              <span className="font-medium text-slate-600">Họ và tên thí sinh: </span>
              <span className="font-serif">...........................................................................................</span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="font-medium text-slate-600">Lớp: </span>
                <span>............................</span>
              </div>
              <div>
                <span className="font-medium text-slate-600">Số báo danh (SBD): </span>
                <span>............................</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-2 border-r border-slate-300 text-center flex flex-col justify-between">
            <span className="font-bold text-[11px] text-slate-700">ĐIỂM SỐ</span>
            <div className="h-8"></div>
          </div>
          <div className="col-span-2 p-2 text-center flex flex-col justify-between">
            <span className="font-bold text-[11px] text-slate-700">LỜI PHÊ</span>
            <div className="h-8"></div>
          </div>
        </div>

        {/* Hướng dẫn làm bài */}
        <div className="italic text-xs text-slate-600 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          * Hướng dẫn: {exam.instructions}
        </div>

        {/* PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN */}
        {mcQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>
                PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN ({mcQuestions.reduce((a, b) => a + b.points, 0).toFixed(2).replace('.00', '')} điểm)
              </span>
              <span className="text-xs font-normal text-slate-500 italic">
                (Thí sinh chọn 01 phương án đúng nhất)
              </span>
            </div>

            <div className="space-y-4">
              {mcQuestions.map((q) => (
                <div key={q.id} className="relative group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  {/* Action buttons khi hover (Sửa câu, Tạo lại AI) */}
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1.5 print:hidden bg-white/95 shadow-xs border border-slate-200 rounded-lg p-1 z-10">
                    <button
                      onClick={() => handleStartEdit(q)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-blue-600"
                      title="Chỉnh sửa nội dung câu hỏi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveRegenModalId(q.id)}
                      disabled={regeneratingId === q.id}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
                      title="AI tạo lại câu hỏi tương đương"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${regeneratingId === q.id ? 'animate-spin text-indigo-600' : ''}`} />
                    </button>
                  </div>

                  {editingQuestionId === q.id ? (
                    <div className="space-y-3 bg-blue-50/50 p-3 rounded-xl border border-blue-200 print:hidden font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-800">Chỉnh sửa Câu {q.number}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(q)}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Lưu
                          </button>
                          <button
                            onClick={() => setEditingQuestionId(null)}
                            className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Hủy
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        value={editStem}
                        onChange={(e) => setEditStem(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                        placeholder="Nội dung câu hỏi (chèn công thức MathType dạng $...$)..."
                      />
                      <div className="flex items-center gap-2 text-xs">
                        <label>Điểm số:</label>
                        <input
                          type="number"
                          step="0.25"
                          value={editPoints}
                          onChange={(e) => setEditPoints(parseFloat(e.target.value) || 0.25)}
                          className="w-20 p-1 border rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-slate-800 leading-relaxed font-normal">
                        <span className="font-bold text-slate-900">Câu {q.number} ({q.points} điểm): </span>
                        <span>{renderTextOrMath(q.stem)}</span>
                      </div>

                      {q.contextData && (
                        <div className="text-xs italic text-slate-600 my-1 pl-4">
                          {renderTextOrMath(q.contextData)}
                        </div>
                      )}

                      {/* 4 Lựa chọn A, B, C, D */}
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-2 pl-4 text-xs text-slate-800">
                          {q.options.map((opt) => {
                            const isCorrect = opt.key === q.correctAnswer;
                            return (
                              <div
                                key={opt.key}
                                className={`flex items-start gap-1.5 ${
                                  showAnswersInExam && isCorrect
                                    ? 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'
                                    : ''
                                }`}
                              >
                                <span className="font-bold">{opt.key}.</span>
                                <span className="flex-1">{renderTextOrMath(opt.content)}</span>
                                {showAnswersInExam && isCorrect && <span className="text-[10px] ml-1 shrink-0">✓ (Đúng)</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {showAnswersInExam && q.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-1.5 pl-4">
                          * Giải thích: {renderTextOrMath(q.notes)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Modal AI tạo lại câu hỏi này */}
                  {activeRegenModalId === q.id && (
                    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 print:hidden animate-in fade-in font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Yêu cầu AI tạo lại Câu {q.number} (chuẩn công thức MathType):
                        </span>
                        <button onClick={() => setActiveRegenModalId(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        value={regenPrompt}
                        onChange={(e) => setRegenPrompt(e.target.value)}
                        placeholder="Ví dụ: Đổi sang bài toán thực tế, thay hằng đẳng thức khác..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg text-slate-800"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveRegenModalId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTriggerRegen(q)}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                          Tạo lại ngay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI */}
        {tfQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>
                PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI ({tfQuestions.reduce((a, b) => a + b.points, 0).toFixed(2).replace('.00', '')} điểm)
              </span>
              <span className="text-xs font-normal text-slate-500 italic">
                (Thí sinh ghi Đúng hoặc Sai cho mỗi ý a, b, c, d)
              </span>
            </div>

            <div className="space-y-5">
              {tfQuestions.map((q) => (
                <div key={q.id} className="relative group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold text-slate-900">Câu {q.number} ({q.points} điểm): </span>
                    <span>{renderTextOrMath(q.stem)}</span>
                  </div>

                  {q.subItems && (
                    <div className="space-y-1.5 mt-2 pl-4 text-xs text-slate-800">
                      {q.subItems.map((s) => (
                        <div
                          key={s.key}
                          className={`flex items-start justify-between py-1 px-2 rounded ${
                            showAnswersInExam
                              ? s.isCorrect
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-red-50 text-red-800'
                              : 'border-b border-slate-100'
                          }`}
                        >
                          <div className="flex items-start gap-1.5 flex-1">
                            <span className="font-bold">{s.key})</span>
                            <span>{renderTextOrMath(s.statement)}</span>
                          </div>
                          <div className="ml-3 shrink-0">
                            {showAnswersInExam ? (
                              <span className="font-bold">
                                [{s.isCorrect ? 'ĐÚNG' : 'SAI'}]
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">[Đ / S]</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN III: TRẢ LỜI NGẮN */}
        {saQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>
                PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN ({saQuestions.reduce((a, b) => a + b.points, 0).toFixed(2).replace('.00', '')} điểm)
              </span>
              <span className="text-xs font-normal text-slate-500 italic">
                (Thí sinh điền kết quả / đáp số vào phần trả lời)
              </span>
            </div>

            <div className="space-y-4">
              {saQuestions.map((q) => (
                <div key={q.id} className="p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-800">
                  <div>
                    <span className="font-bold text-slate-900">Câu {q.number} ({q.points} điểm): </span>
                    <span>{renderTextOrMath(q.stem)}</span>
                  </div>
                  <div className="mt-2 pl-4 flex items-center gap-2">
                    <span className="font-semibold text-slate-600">Đáp số:</span>
                    {showAnswersInExam ? (
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {renderTextOrMath(q.correctAnswer)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-serif">...........................................................................</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN IV: TỰ LUẬN / THỰC HÀNH */}
        {essayQuestions.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>
                PHẦN IV. TỰ LUẬN ({essayQuestions.reduce((a, b) => a + b.points, 0).toFixed(2).replace('.00', '')} điểm)
              </span>
              <span className="text-xs font-normal text-slate-500 italic">
                (Thí sinh trình bày chi tiết các bước giải)
              </span>
            </div>

            <div className="space-y-6">
              {essayQuestions.map((q) => (
                <div key={q.id} className="p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-800 space-y-2">
                  <div>
                    <span className="font-bold text-slate-900">Câu {q.number} ({q.points} điểm): </span>
                    <div className="mt-1">{renderTextOrMath(q.stem, true)}</div>
                  </div>

                  {q.contextData && (
                    <div className="italic text-slate-600 pl-4 border-l-2 border-slate-300">
                      {renderTextOrMath(q.contextData)}
                    </div>
                  )}

                  {showAnswersInExam && q.essaySolution && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900">Hướng dẫn giải tóm tắt:</div>
                      <div className="text-slate-800 text-[11px] leading-relaxed">
                        {renderTextOrMath(q.essaySolution, true)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer kết thúc đề */}
        <div className="text-center pt-6 border-t border-slate-200 space-y-1 text-xs">
          <div className="font-bold tracking-widest text-slate-900">
            ----------------------- HẾT -----------------------
          </div>
          <div className="italic text-slate-500">
            (Cán bộ coi thi không giải thích gì thêm)
          </div>
        </div>
      </div>
    </div>
  );
};
