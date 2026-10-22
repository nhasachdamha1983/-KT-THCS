export type GradeLevel = 6 | 7 | 8 | 9;

export type Textbook = 
  | 'Kết nối tri thức với cuộc sống'
  | 'Chân trời sáng tạo'
  | 'Cánh Diều'
  | 'Khác';

export type ExamType = 
  | 'Thường xuyên (15 phút/miệng)'
  | 'Giữa học kì I'
  | 'Cuối học kì I'
  | 'Giữa học kì II'
  | 'Cuối học kì II'
  | 'Kiểm tra theo chủ đề'
  | 'Kiểm tra cuối năm';

export type ExamFormat = 
  | 'combined' // Kết hợp Trắc nghiệm & Tự luận
  | 'multiple_choice_only' // 100% Trắc nghiệm
  | 'essay_only' // 100% Tự luận
  | 'practical_rubric'; // Thực hành / Bảng kiểm / Rubric (Nghệ thuật, Thể chất, HĐTN)

export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export interface SubjectConfig {
  id: string;
  name: string;
  category: 'natural_sciences' | 'social_sciences' | 'languages' | 'technology' | 'arts_physical' | 'experiential';
  defaultTime: number; // minutes
  typicalFormat: ExamFormat;
  defaultTopics: Record<number, string[]>; // Grade -> default topics
  hasRubricMode?: boolean;
}

export interface CognitiveRatio {
  nhanBiet: number; // e.g. 40%
  thongHieu: number; // e.g. 30%
  vanDung: number; // e.g. 20%
  vanDungCao: number; // e.g. 10%
}

export interface QuestionStructureConfig {
  multipleChoiceCount: number; // TN 4 lựa chọn (Phần I)
  multipleChoicePoints: number; // Tổng điểm Phần I
  trueFalseCount: number; // Câu đúng/sai (Phần II)
  trueFalsePoints: number; // Tổng điểm Phần II
  shortAnswerCount: number; // Câu trả lời ngắn (Phần III)
  shortAnswerPoints: number; // Tổng điểm Phần III
  essayCount: number; // Câu tự luận (Phần IV)
  essayPoints: number; // Tổng điểm Phần IV
  cognitiveRatio: CognitiveRatio;
  variantCount: number; // 1, 2, 4 mã đề
  includePracticalContext: boolean; // Tình huống thực tiễn
  includeDataOrCharts: boolean; // Biểu đồ / bảng số liệu
  includeDigitalCompetence: boolean; // Năng lực số
}

export interface ExamRequestData {
  schoolName: string;
  departmentName: string;
  teacherName: string;
  schoolYear: string;
  subject: string;
  grade: GradeLevel;
  textbook: Textbook;
  examType: ExamType;
  durationMinutes: number;
  knowledgeScope: string;
  examFormat: ExamFormat;
  totalPoints: number;
  structure: QuestionStructureConfig;
  customRequirements?: string;
  referenceMaterial?: string;
}

// Question types
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'practical_task';

export interface MultipleChoiceOption {
  key: 'A' | 'B' | 'C' | 'D';
  content: string;
}

export interface TrueFalseSubItem {
  key: 'a' | 'b' | 'c' | 'd';
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuestionItem {
  id: string;
  number: number;
  type: QuestionType;
  topic: string;
  cognitiveLevel: CognitiveLevel;
  points: number;
  stem: string; // Nội dung câu hỏi / tình huống dẫn
  contextData?: string; // Bảng biểu, đoạn trích, hình vẽ mô tả
  options?: MultipleChoiceOption[]; // Cho multiple_choice
  correctAnswer?: string; // e.g. 'A' hoặc giá trị trả lời ngắn
  subItems?: TrueFalseSubItem[]; // Cho true_false
  essaySolution?: string; // Lời giải chi tiết
  scoringCriteria?: {
    step: string;
    score: number;
    acceptableEquivalents?: string[];
  }[];
  notes?: string;
}

export interface MatrixRow {
  topic: string; // Chủ đề / Chương
  knowledgeUnit: string; // Đơn vị kiến thức
  nhanBietTN: number;
  nhanBietTL: number;
  thongHieuTN: number;
  thongHieuTL: number;
  vanDungTN: number;
  vanDungTL: number;
  vanDungCaoTN: number;
  vanDungCaoTL: number;
  totalQuestions: number;
  totalScore: number;
  percentageScore: number;
}

export interface SpecificationItem {
  topic: string;
  knowledgeUnit: string;
  requiredCompetency: string; // Yêu cầu cần đạt chuẩn GDPT 2018
  nhanBietDesc: string;
  thongHieuDesc: string;
  vanDungDesc: string;
  vanDungCaoDesc: string;
  questionNumbers: string; // Ví dụ: "C1, C2 (TN), C13 (TL)"
}

export interface RubricCriterion {
  name: string;
  maxScore: number;
  levels: {
    level: 'Chưa đạt' | 'Đạt' | 'Tốt' | 'Xuất sắc';
    description: string;
    scoreRange: string;
  }[];
}

export interface QualityAuditReport {
  scoreCheck: {
    isValid: boolean;
    totalCalculated: number;
    expected: number;
    message: string;
  };
  cognitiveRatioCheck: {
    isValid: boolean;
    actualRatio: CognitiveRatio;
    targetRatio: CognitiveRatio;
    message: string;
  };
  matrixConsistency: {
    isValid: boolean;
    message: string;
  };
  specificationConsistency: {
    isValid: boolean;
    message: string;
  };
  pedagogicalWarnings: string[];
  recommendations: string[];
}

export interface ExamVariant {
  code: string; // e.g. "101", "102"
  title: string;
  questions: QuestionItem[];
  answerSheet: Record<string, string>; // { "1": "A", "2": "C", ... }
}

export interface GeneratedExamPackage {
  id: string;
  createdAt: string;
  metadata: ExamRequestData;
  examTitle: string;
  timeLimit: number;
  instructions: string;
  variants: ExamVariant[];
  currentVariantCode: string;
  matrix: {
    rows: MatrixRow[];
    totalTN: number;
    totalTL: number;
    totalQuestions: number;
    totalScore: number;
  };
  specification: SpecificationItem[];
  rubric?: RubricCriterion[];
  qualityAudit: QualityAuditReport;
}
