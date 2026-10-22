import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Sliders, 
  Layers, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Clock,
  Settings,
  Upload,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { 
  ExamRequestData, 
  GradeLevel, 
  Textbook, 
  ExamType, 
  ExamFormat, 
  SubjectConfig 
} from '../types/exam';
import { TEXTBOOKS, EXAM_TYPES } from '../data/subjects';

interface ExamFormProps {
  subjects: SubjectConfig[];
  initialData: ExamRequestData;
  onSubmit: (data: ExamRequestData) => void;
  onOpenAddSubject: () => void;
  onLoadSample: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const ExamForm: React.FC<ExamFormProps> = ({
  subjects,
  initialData,
  onSubmit,
  onOpenAddSubject,
  onLoadSample,
  isGenerating,
  generationStep
}) => {
  const [formData, setFormData] = useState<ExamRequestData>(initialData);

  // Sync state if initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const currentSubjectConfig = subjects.find(s => s.name === formData.subject) || subjects[0];
  const gradeTopics = currentSubjectConfig?.defaultTopics?.[formData.grade] || [];

  // Tính tổng điểm cấu trúc đề
  const totalCalculatedPoints = Number((
    (formData.structure.multipleChoicePoints || 0) +
    (formData.structure.trueFalsePoints || 0) +
    (formData.structure.shortAnswerPoints || 0) +
    (formData.structure.essayPoints || 0)
  ).toFixed(2));

  // Tính tổng tỉ lệ nhận thức
  const totalRatio = 
    (formData.structure.cognitiveRatio.nhanBiet || 0) +
    (formData.structure.cognitiveRatio.thongHieu || 0) +
    (formData.structure.cognitiveRatio.vanDung || 0) +
    (formData.structure.cognitiveRatio.vanDungCao || 0);

  const isPointsValid = Math.abs(totalCalculatedPoints - 10) < 0.01;
  const isRatioValid = totalRatio === 100;

  // Tự động cân bằng tỉ lệ điểm về 10
  const handleAutoBalancePoints = () => {
    const isCombined = formData.examFormat === 'combined';
    const isMC = formData.examFormat === 'multiple_choice_only';
    const isEssay = formData.examFormat === 'essay_only';

    if (isCombined) {
      setFormData(prev => ({
        ...prev,
        structure: {
          ...prev.structure,
          multipleChoiceCount: 12,
          multipleChoicePoints: 3.0,
          trueFalseCount: 2,
          trueFalsePoints: 2.0,
          shortAnswerCount: 2,
          shortAnswerPoints: 1.0,
          essayCount: 3,
          essayPoints: 4.0
        }
      }));
    } else if (isMC) {
      setFormData(prev => ({
        ...prev,
        structure: {
          ...prev.structure,
          multipleChoiceCount: 28,
          multipleChoicePoints: 7.0,
          trueFalseCount: 2,
          trueFalsePoints: 2.0,
          shortAnswerCount: 2,
          shortAnswerPoints: 1.0,
          essayCount: 0,
          essayPoints: 0.0
        }
      }));
    } else if (isEssay) {
      setFormData(prev => ({
        ...prev,
        structure: {
          ...prev.structure,
          multipleChoiceCount: 0,
          multipleChoicePoints: 0,
          trueFalseCount: 0,
          trueFalsePoints: 0,
          shortAnswerCount: 0,
          shortAnswerPoints: 0,
          essayCount: 5,
          essayPoints: 10.0
        }
      }));
    }
  };

  const handleSubjectChange = (subjectName: string) => {
    const sub = subjects.find(s => s.name === subjectName);
    if (!sub) return;
    const defaultTime = sub.defaultTime;
    const isRubric = sub.hasRubricMode;
    const topics = sub.defaultTopics?.[formData.grade] || [];

    setFormData(prev => ({
      ...prev,
      subject: subjectName,
      durationMinutes: defaultTime,
      examFormat: isRubric ? 'practical_rubric' : prev.examFormat,
      knowledgeScope: topics.slice(0, 2).join('; ')
    }));
  };

  const handleGradeChange = (grade: GradeLevel) => {
    const topics = currentSubjectConfig?.defaultTopics?.[grade] || [];
    setFormData(prev => ({
      ...prev,
      grade,
      knowledgeScope: topics.slice(0, 2).join('; ')
    }));
  };

  const addTopicChip = (topic: string) => {
    if (!formData.knowledgeScope.includes(topic)) {
      const updated = formData.knowledgeScope ? `${formData.knowledgeScope}; ${topic}` : topic;
      setFormData(prev => ({ ...prev, knowledgeScope: updated }));
    }
  };

  const addRequirementChip = (reqText: string) => {
    if (!formData.customRequirements?.includes(reqText)) {
      const updated = formData.customRequirements ? `${formData.customRequirements}. ${reqText}` : reqText;
      setFormData(prev => ({ ...prev, customRequirements: updated }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPointsValid) {
      alert('Tổng điểm của cấu trúc đề thi phải bằng đúng 10.0 điểm. Vui lòng nhấn "Cân bằng tự động 10đ" hoặc điều chỉnh lại các điểm thành phần.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Intro hero banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-yellow-300 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Trợ lý Trí tuệ Nhân tạo THCS
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Thiết lập & Biên soạn Hồ sơ Đề kiểm tra Chuẩn GDPT 2018
          </h2>
          <p className="text-xs md:text-sm text-blue-100 max-w-2xl">
            Tự động sinh Ma trận 4 mức độ, Bản đặc tả chi tiết, Đề thi học sinh, Đáp án kèm thang điểm barem và bảng kiểm rubric theo Thông tư 22/2021.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs"
          >
            <Lightbulb className="w-4 h-4 text-yellow-300" />
            Xem đề mẫu chuẩn nhanh
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phần 1: Thông tin chung */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              1. Thông tin chung về đề kiểm tra
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Bước 1 / 4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Môn học */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Môn học / Phân môn: <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenAddSubject}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  Thêm môn
                </button>
              </div>
              <select
                value={formData.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Khối lớp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Khối lớp THCS: <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([6, 7, 8, 9] as GradeLevel[]).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeChange(grade)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.grade === grade
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Lớp {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Bộ sách giáo khoa */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bộ sách giáo khoa: <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.textbook}
                onChange={(e) => setFormData(prev => ({ ...prev, textbook: e.target.value as Textbook }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {TEXTBOOKS.map((tb) => (
                  <option key={tb} value={tb}>{tb}</option>
                ))}
              </select>
            </div>

            {/* Loại kiểm tra */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Loại bài kiểm tra: <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value as ExamType }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {EXAM_TYPES.map((et) => (
                  <option key={et} value={et}>{et}</option>
                ))}
              </select>
            </div>

            {/* Thời gian làm bài */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Thời gian làm bài: <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[15, 45, 60, 90].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, durationMinutes: t }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.durationMinutes === t
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t}p
                  </button>
                ))}
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 45 }))}
                  className="w-16 px-2 py-2 text-center bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  title="Tự nhập số phút"
                />
              </div>
            </div>

            {/* Hình thức đề */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hình thức bài kiểm tra: <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.examFormat}
                onChange={(e) => setFormData(prev => ({ ...prev, examFormat: e.target.value as ExamFormat }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="combined">Kết hợp Trắc nghiệm & Tự luận</option>
                <option value="multiple_choice_only">100% Trắc nghiệm khách quan</option>
                <option value="essay_only">100% Tự luận</option>
                <option value="practical_rubric">Thực hành / Bảng kiểm / Rubric (Nghệ thuật, Thể chất, HĐTN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Phần 2: Phạm vi kiến thức & Ngữ liệu */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              2. Phạm vi kiến thức & Tài liệu làm căn cứ ra đề
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Bước 2 / 4
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Phạm vi kiến thức kiểm tra (Chương, chủ đề, bài học): <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500 italic">Nhấn vào gợi ý bên dưới để thêm nhanh</span>
            </div>
            
            <textarea
              rows={2}
              required
              value={formData.knowledgeScope}
              onChange={(e) => setFormData(prev => ({ ...prev, knowledgeScope: e.target.value }))}
              placeholder="Ví dụ: Đa thức nhiều biến, Hằng đẳng thức đáng nhớ, Hình học tứ giác..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />

            {/* Chủ đề gợi ý theo môn & lớp */}
            {gradeTopics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-xs text-slate-500 font-medium py-1">Gợi ý chủ đề {formData.subject} Lớp {formData.grade}:</span>
                {gradeTopics.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addTopicChip(topic)}
                    className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    + {topic.length > 40 ? topic.substring(0, 40) + '...' : topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tài liệu căn cứ / Ngữ liệu */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Văn bản ngữ liệu / Tài liệu tham khảo của giáo viên (tùy chọn):
              </label>
              <span className="text-xs text-slate-400">Rất hữu ích cho môn Ngữ văn, Lịch sử, Tiếng Anh</span>
            </div>
            <textarea
              rows={3}
              value={formData.referenceMaterial || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, referenceMaterial: e.target.value }))}
              placeholder="Dán đoạn trích thơ, văn bản văn học, bài đọc tiếng Anh, hoặc bảng số liệu giáo viên muốn AI sử dụng làm ngữ liệu ra đề..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Phần 3: Thiết lập cấu trúc đề & Tỉ lệ nhận thức */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              3. Thiết lập cấu trúc đề & Tỉ lệ mức độ nhận thức
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoBalancePoints}
                className="text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Cân bằng chuẩn 10 điểm
              </button>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Bước 3 / 4
              </span>
            </div>
          </div>

          {/* Khung cảnh báo điểm */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            isPointsValid 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              {isPointsValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  Tổng điểm cấu trúc: {totalCalculatedPoints}/10 điểm
                </span>
                <span className="ml-2 font-normal">
                  {isPointsValid 
                    ? '(Cấu trúc điểm số hoàn hảo, sẵn sàng tạo đề)' 
                    : `(Lệch ${Math.abs(10 - totalCalculatedPoints).toFixed(2)} điểm so với thang 10. Hãy điều chỉnh hoặc nhấn "Cân bằng chuẩn 10 điểm")`}
                </span>
              </div>
            </div>

            <div className="font-semibold px-2.5 py-1 rounded-lg bg-white/80 border">
              Tỉ lệ nhận thức: {totalRatio}% {isRatioValid ? '✓' : '⚠️'}
            </div>
          </div>

          {/* Grid cấu hình 4 phần câu hỏi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phần I: Trắc nghiệm 4 lựa chọn */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-blue-800 flex items-center justify-between">
                <span>Phần I: TN 4 Lựa chọn</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]">Part I</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-600 block">Số lượng câu:</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={formData.structure.multipleChoiceCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, multipleChoiceCount: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Tổng điểm (đ):</label>
                  <input
                    type="number"
                    step="0.25"
                    min={0}
                    max={10}
                    value={formData.structure.multipleChoicePoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, multipleChoicePoints: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Phần II: Trắc nghiệm Đúng/Sai */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-indigo-800 flex items-center justify-between">
                <span>Phần II: TN Đúng / Sai</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">Part II (a,b,c,d)</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-600 block">Số lượng câu:</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={formData.structure.trueFalseCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, trueFalseCount: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Tổng điểm (đ):</label>
                  <input
                    type="number"
                    step="0.25"
                    min={0}
                    max={10}
                    value={formData.structure.trueFalsePoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, trueFalsePoints: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Phần III: Trả lời ngắn */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-amber-800 flex items-center justify-between">
                <span>Phần III: Trả lời ngắn</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px]">Part III</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-600 block">Số lượng câu:</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={formData.structure.shortAnswerCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, shortAnswerCount: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Tổng điểm (đ):</label>
                  <input
                    type="number"
                    step="0.25"
                    min={0}
                    max={10}
                    value={formData.structure.shortAnswerPoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, shortAnswerPoints: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Phần IV: Tự luận / Thực hành */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-emerald-800 flex items-center justify-between">
                <span>Phần IV: Tự luận / Rubric</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px]">Part IV</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-600 block">Số lượng câu:</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={formData.structure.essayCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, essayCount: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Tổng điểm (đ):</label>
                  <input
                    type="number"
                    step="0.25"
                    min={0}
                    max={10}
                    value={formData.structure.essayPoints}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      structure: { ...prev.structure, essayPoints: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tỉ lệ 4 mức độ nhận thức */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Tỉ lệ % các mức độ nhận thức (chuẩn GDPT 2018):
              </label>
              <span className={`text-xs font-bold ${isRatioValid ? 'text-emerald-700' : 'text-red-600'}`}>
                Tổng: {totalRatio}% {isRatioValid ? '(Hợp lệ)' : '(Phải bằng 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  1. Nhận biết (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.structure.cognitiveRatio.nhanBiet}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    structure: {
                      ...prev.structure,
                      cognitiveRatio: {
                        ...prev.structure.cognitiveRatio,
                        nhanBiet: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  2. Thông hiểu (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.structure.cognitiveRatio.thongHieu}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    structure: {
                      ...prev.structure,
                      cognitiveRatio: {
                        ...prev.structure.cognitiveRatio,
                        thongHieu: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  3. Vận dụng (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.structure.cognitiveRatio.vanDung}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    structure: {
                      ...prev.structure,
                      cognitiveRatio: {
                        ...prev.structure.cognitiveRatio,
                        vanDung: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  4. Vận dụng cao (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.structure.cognitiveRatio.vanDungCao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    structure: {
                      ...prev.structure,
                      cognitiveRatio: {
                        ...prev.structure.cognitiveRatio,
                        vanDungCao: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-red-700"
                />
              </div>
            </div>
          </div>

          {/* Tùy chọn nâng cao */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Số mã đề cần tạo:
              </label>
              <select
                value={formData.structure.variantCount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  structure: { ...prev.structure, variantCount: parseInt(e.target.value) || 1 }
                }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value={1}>1 mã đề (Gốc)</option>
                <option value={2}>2 mã đề (Mã 101, 102)</option>
                <option value={4}>4 mã đề (Mã 101, 102, 103, 104)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.structure.includePracticalContext}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  structure: { ...prev.structure, includePracticalContext: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Gắn tình huống thực tiễn</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.structure.includeDataOrCharts}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  structure: { ...prev.structure, includeDataOrCharts: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Có bảng biểu / số liệu</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.structure.includeDigitalCompetence}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  structure: { ...prev.structure, includeDigitalCompetence: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">Tích hợp năng lực số</span>
            </label>
          </div>
        </div>

        {/* Phần 4: Yêu cầu riêng của giáo viên */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-700" />
              4. Yêu cầu riêng & Lưu ý sư phạm của giáo viên
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Bước 4 / 4
            </span>
          </div>

          <div>
            <textarea
              rows={2}
              value={formData.customRequirements || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, customRequirements: e.target.value }))}
              placeholder="Nhập yêu cầu bổ sung của bạn (ví dụ: bám sát nội dung đã học, không ra ngoài phạm vi, phân hóa học sinh khá giỏi, sử dụng ngữ liệu mới...)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />

            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                'Bám sát nội dung đã học',
                'Không ra ngoài phạm vi kiến thức',
                'Tăng cường câu hỏi vận dụng thực tiễn',
                'Phân hóa học sinh khá giỏi',
                'Tránh các câu hỏi mẹo hoặc bẫy ngôn từ',
                'Sử dụng ngữ liệu mới phù hợp lứa tuổi',
                'Tuân thủ cấu trúc ma trận nhà trường'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addRequirementChip(chip)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nút hành động Submit */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Hệ thống sẽ biên soạn đồng bộ: <strong>Đề kiểm tra, Ma trận, Bản đặc tả & Hướng dẫn chấm</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isGenerating || !isPointsValid}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isGenerating || !isPointsValid
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{generationStep || 'Đang biên soạn đề...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>TẠO ĐỀ KIỂM TRA BẰNG AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
