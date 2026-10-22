import { GeneratedExamPackage, QuestionItem } from '../types/exam';

const SAVED_EXAMS_KEY = 'ai_exam_saved_packages_v1';
const QUESTION_BANK_KEY = 'ai_exam_question_bank_v1';

// Lấy danh sách đề đã lưu
export function getSavedExams(): GeneratedExamPackage[] {
  try {
    const raw = localStorage.getItem(SAVED_EXAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Lỗi khi đọc danh sách đề đã lưu:', e);
    return [];
  }
}

// Lưu một đề kiểm tra
export function saveExamPackage(exam: GeneratedExamPackage): void {
  try {
    const list = getSavedExams();
    const index = list.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      list[index] = exam;
    } else {
      list.unshift(exam);
    }
    localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Lỗi khi lưu đề kiểm tra:', e);
  }
}

// Xóa đề kiểm tra
export function deleteExamPackage(id: string): void {
  try {
    const list = getSavedExams().filter(e => e.id !== id);
    localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Lỗi khi xóa đề kiểm tra:', e);
  }
}

// Lấy ngân hàng câu hỏi
export function getQuestionBank(): (QuestionItem & { subject: string; grade: number })[] {
  try {
    const raw = localStorage.getItem(QUESTION_BANK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Lỗi khi đọc ngân hàng câu hỏi:', e);
    return [];
  }
}

// Lưu câu hỏi vào ngân hàng
export function saveQuestionToBank(question: QuestionItem, subject: string, grade: number): void {
  try {
    const bank = getQuestionBank();
    const exists = bank.find(q => q.id === question.id);
    if (!exists) {
      bank.unshift({ ...question, subject, grade });
      localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank));
    }
  } catch (e) {
    console.error('Lỗi khi lưu câu hỏi vào ngân hàng:', e);
  }
}

// Lưu hàng loạt câu hỏi từ đề vào ngân hàng
export function saveExamQuestionsToBank(exam: GeneratedExamPackage): number {
  try {
    const bank = getQuestionBank();
    const activeVariant = exam.variants[0];
    if (!activeVariant || !activeVariant.questions) return 0;
    
    let addedCount = 0;
    activeVariant.questions.forEach(q => {
      if (!bank.some(item => item.id === q.id || item.stem.trim() === q.stem.trim())) {
        bank.unshift({
          ...q,
          subject: exam.metadata.subject,
          grade: exam.metadata.grade
        });
        addedCount++;
      }
    });

    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank));
    return addedCount;
  } catch (e) {
    console.error('Lỗi khi lưu câu hỏi từ đề vào ngân hàng:', e);
    return 0;
  }
}

// Xóa câu hỏi khỏi ngân hàng
export function deleteQuestionFromBank(id: string): void {
  try {
    const bank = getQuestionBank().filter(q => q.id !== id);
    localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank));
  } catch (e) {
    console.error('Lỗi khi xóa câu hỏi khỏi ngân hàng:', e);
  }
}
