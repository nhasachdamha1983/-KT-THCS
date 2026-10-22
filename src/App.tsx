import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Table as TableIcon, 
  FileCheck2, 
  CheckSquare, 
  Database, 
  FolderKanban, 
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { ExamForm } from './components/ExamForm';
import { ExamPreview } from './components/ExamPreview';
import { MatrixView } from './components/MatrixView';
import { SpecificationView } from './components/SpecificationView';
import { AnswerKeyView } from './components/AnswerKeyView';
import { QuestionBankView } from './components/QuestionBankView';
import { QualityAuditView } from './components/QualityAuditView';
import { ManageExamsView } from './components/ManageExamsView';
import { SubjectModal } from './components/SubjectModal';

import { 
  GeneratedExamPackage, 
  ExamRequestData, 
  QuestionItem, 
  MatrixRow, 
  SubjectConfig 
} from './types/exam';
import { INITIAL_SUBJECTS } from './data/subjects';
import { SAMPLE_TOAN_8_EXAM } from './data/sampleExams';
import { saveExamPackage } from './utils/storage';

type TabType = 'form' | 'exam' | 'matrix' | 'spec' | 'answer' | 'bank' | 'audit' | 'manage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [subjects, setSubjects] = useState<SubjectConfig[]>(INITIAL_SUBJECTS);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Thông tin trường & giáo viên
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: 'TRƯỜNG THCS NGUYỄN DU',
    departmentName: 'TỔ TOÁN - TIN HỌC',
    teacherName: 'Thầy Nguyễn Văn An',
    schoolYear: '2024 - 2025'
  });

  // Đề kiểm tra đang hoạt động (Ban đầu có sẵn bộ đề mẫu hoàn chỉnh để giáo viên xem ngay)
  const [currentExam, setCurrentExam] = useState<GeneratedExamPackage>(SAMPLE_TOAN_8_EXAM);

  // Form data mặc định
  const [formData, setFormData] = useState<ExamRequestData>({
    schoolName: schoolInfo.schoolName,
    departmentName: schoolInfo.departmentName,
    teacherName: schoolInfo.teacherName,
    schoolYear: schoolInfo.schoolYear,
    subject: 'Toán',
    grade: 8,
    textbook: 'Kết nối tri thức với cuộc sống',
    examType: 'Giữa học kì I',
    durationMinutes: 90,
    knowledgeScope: 'Đa thức nhiều biến, Hằng đẳng thức đáng nhớ, Tứ giác và hình thang cân',
    examFormat: 'combined',
    totalPoints: 10,
    structure: {
      multipleChoiceCount: 12,
      multipleChoicePoints: 3.0,
      trueFalseCount: 2,
      trueFalsePoints: 2.0,
      shortAnswerCount: 2,
      shortAnswerPoints: 1.0,
      essayCount: 3,
      essayPoints: 4.0,
      cognitiveRatio: {
        nhanBiet: 40,
        thongHieu: 30,
        vanDung: 20,
        vanDungCao: 10
      },
      variantCount: 2,
      includePracticalContext: true,
      includeDataOrCharts: false,
      includeDigitalCompetence: false
    },
    customRequirements: 'Bám sát nội dung đã học, không ra ngoài phạm vi kiến thức, phân hóa học sinh.'
  });

  // State tạo đề bằng AI
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync school info into formData
  const handleUpdateSchoolInfo = (info: typeof schoolInfo) => {
    setSchoolInfo(info);
    setFormData(prev => ({
      ...prev,
      schoolName: info.schoolName,
      departmentName: info.departmentName,
      teacherName: info.teacherName,
      schoolYear: info.schoolYear
    }));
    if (currentExam) {
      setCurrentExam(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          schoolName: info.schoolName,
          departmentName: info.departmentName,
          teacherName: info.teacherName,
          schoolYear: info.schoolYear
        }
      }));
    }
  };

  // Tạo đề kiểm tra qua server API với Gemini
  const handleGenerateExam = async (data: ExamRequestData) => {
    setIsGenerating(true);
    setApiError(null);

    const steps = [
      'Phân tích chương trình GDPT 2018 & Thông tư 22...',
      'Xây dựng Ma trận 4 mức độ nhận thức...',
      'Biên soạn Bản đặc tả chuẩn yêu cầu cần đạt...',
      'Thiết kế câu hỏi trắc nghiệm & tự luận...',
      'Xây dựng đáp án & thang điểm barem chi tiết...',
      'Kiểm định chất lượng toàn bài...'
    ];

    let stepIndex = 0;
    setGenerationStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setGenerationStep(steps[stepIndex]);
    }, 2200);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi từ máy chủ khi tạo đề');
      }

      const newExamPackage: GeneratedExamPackage = await response.json();
      clearInterval(stepInterval);
      setCurrentExam(newExamPackage);
      saveExamPackage(newExamPackage);
      setActiveTab('exam');
    } catch (err: any) {
      clearInterval(stepInterval);
      console.warn('Lỗi gọi API Gemini:', err);
      setApiError(err.message || 'Không thể tạo đề qua AI. Vui lòng thử lại hoặc dùng đề mẫu.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // AI Tạo lại một câu hỏi
  const handleRegenerateQuestion = async (question: QuestionItem, prompt: string) => {
    try {
      const response = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          subject: currentExam.metadata.subject,
          grade: currentExam.metadata.grade,
          requirement: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi khi gọi API tạo lại câu hỏi');
      }

      const regeneratedQuestion = await response.json();
      handleUpdateQuestion(regeneratedQuestion);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  // Cập nhật câu hỏi trong đề
  const handleUpdateQuestion = (updatedQuestion: QuestionItem) => {
    setCurrentExam(prev => {
      const updatedVariants = prev.variants.map(v => {
        const updatedQuestions = v.questions.map(q => 
          q.id === updatedQuestion.id ? updatedQuestion : q
        );
        return { ...v, questions: updatedQuestions };
      });
      return { ...prev, variants: updatedVariants };
    });
  };

  // Cập nhật ma trận
  const handleUpdateMatrix = (newRows: MatrixRow[]) => {
    setCurrentExam(prev => ({
      ...prev,
      matrix: {
        ...prev.matrix,
        rows: newRows
      }
    }));
  };

  // Lưu đề thi vào storage
  const handleSaveExam = () => {
    if (currentExam) {
      saveExamPackage(currentExam);
      alert('Đã lưu đề kiểm tra thành công vào kho lưu trữ của bạn!');
    }
  };

  // Đưa câu hỏi từ ngân hàng vào đề thi
  const handleAddQuestionFromBank = (q: QuestionItem) => {
    setCurrentExam(prev => {
      const currentQuestions = prev.variants[0]?.questions || [];
      const newQuestion: QuestionItem = {
        ...q,
        id: `bank-added-${Date.now()}`,
        number: currentQuestions.length + 1
      };

      const updatedVariants = prev.variants.map((v, i) => {
        if (i === 0) {
          return {
            ...v,
            questions: [...v.questions, newQuestion]
          };
        }
        return v;
      });

      return {
        ...prev,
        variants: updatedVariants
      };
    });
    alert(`Đã thêm câu hỏi vào đề thi ở vị trí Câu ${currentExam.variants[0]?.questions.length + 1}!`);
  };

  // Sinh thêm mã đề tương đương mới
  const handleGenerateMoreVariants = () => {
    if (!currentExam) return;
    const currentVariants = currentExam.variants;
    const baseVariant = currentVariants[0];
    const newCode = (100 + currentVariants.length + 1).toString();

    // Đảo câu hỏi trắc nghiệm
    const mc = baseVariant.questions.filter(q => q.type === 'multiple_choice');
    const others = baseVariant.questions.filter(q => q.type !== 'multiple_choice');
    const shuffled = [...mc].sort(() => Math.random() - 0.5);
    const newQuestions = [...shuffled, ...others].map((q, idx) => ({
      ...q,
      number: idx + 1
    }));

    const varAnswerSheet: Record<string, string> = {};
    newQuestions.forEach(q => {
      if (q.type === 'multiple_choice') {
        varAnswerSheet[q.number] = q.correctAnswer || 'A';
      } else if (q.type === 'true_false') {
        varAnswerSheet[q.number] = (q.subItems || []).map(s => `${s.key}: ${s.isCorrect ? 'Đ' : 'S'}`).join(', ');
      } else if (q.type === 'short_answer') {
        varAnswerSheet[q.number] = q.correctAnswer || '';
      } else {
        varAnswerSheet[q.number] = `Tự luận (${q.points} điểm)`;
      }
    });

    const newVariant = {
      code: newCode,
      title: `Mã đề: ${newCode}`,
      questions: newQuestions,
      answerSheet: varAnswerSheet
    };

    setCurrentExam(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));

    alert(`Đã tạo thành công Mã đề ${newCode} tương đương kèm bảng đáp án đảo!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header component */}
      <Header
        schoolName={schoolInfo.schoolName}
        departmentName={schoolInfo.departmentName}
        teacherName={schoolInfo.teacherName}
        schoolYear={schoolInfo.schoolYear}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        activeSubject={currentExam?.metadata?.subject}
        activeGrade={currentExam?.metadata?.grade}
      />

      {/* Main navigation tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[92px] z-20 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'form'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>1. Tạo đề kiểm tra</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exam'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>2. Đề kiểm tra</span>
              {currentExam && (
                <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
                  Mã {currentExam.currentVariantCode || '101'}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4 text-blue-500" />
              <span>3. Ma trận đề</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'spec'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-indigo-500" />
              <span>4. Bản đặc tả</span>
            </button>

            <button
              onClick={() => setActiveTab('answer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'answer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <span>5. Đáp án & Barem</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>6. Kiểm định chất lượng</span>
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bank'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4 text-purple-500" />
              <span>7. Ngân hàng câu hỏi</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-slate-600" />
              <span>8. Quản lý & Xuất file</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {apiError && (
        <div className="max-w-7xl mx-auto px-4 mt-4 print:hidden">
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lưu ý kết nối: </span>
                <span>{apiError}</span>
                <div className="mt-1 font-medium text-amber-800">
                  Hệ thống đã tự động kích hoạt bộ đề chuẩn THCS để bạn có thể xem trước, chỉnh sửa và xuất file Word ngay lập tức.
                </div>
              </div>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-amber-600 hover:text-amber-800 font-bold p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {activeTab === 'form' && (
          <ExamForm
            subjects={subjects}
            initialData={formData}
            onSubmit={handleGenerateExam}
            onOpenAddSubject={() => setIsSubjectModalOpen(true)}
            onLoadSample={() => {
              setCurrentExam(SAMPLE_TOAN_8_EXAM);
              setActiveTab('exam');
            }}
            isGenerating={isGenerating}
            generationStep={generationStep}
          />
        )}

        {activeTab === 'exam' && currentExam && (
          <ExamPreview
            exam={currentExam}
            onUpdateQuestion={handleUpdateQuestion}
            onRegenerateQuestion={handleRegenerateQuestion}
            onSaveExam={handleSaveExam}
          />
        )}

        {activeTab === 'matrix' && currentExam && (
          <MatrixView
            exam={currentExam}
            onUpdateMatrix={handleUpdateMatrix}
          />
        )}

        {activeTab === 'spec' && currentExam && (
          <SpecificationView
            exam={currentExam}
          />
        )}

        {activeTab === 'answer' && currentExam && (
          <AnswerKeyView
            exam={currentExam}
          />
        )}

        {activeTab === 'audit' && currentExam && (
          <QualityAuditView
            audit={currentExam.qualityAudit}
            exam={currentExam}
          />
        )}

        {activeTab === 'bank' && (
          <QuestionBankView
            onAddQuestionToExam={handleAddQuestionFromBank}
            currentSubject={currentExam?.metadata?.subject || 'Toán'}
            currentGrade={currentExam?.metadata?.grade || 8}
          />
        )}

        {activeTab === 'manage' && (
          <ManageExamsView
            currentExam={currentExam}
            onLoadExam={(exam) => {
              setCurrentExam(exam);
              setActiveTab('exam');
            }}
            onGenerateMoreVariants={handleGenerateMoreVariants}
          />
        )}
      </main>

      {/* Modal bổ sung môn học mới */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onAddSubject={(newSub) => {
          setSubjects(prev => [...prev, newSub]);
          setFormData(prev => ({ ...prev, subject: newSub.name }));
        }}
      />
    </div>
  );
}
