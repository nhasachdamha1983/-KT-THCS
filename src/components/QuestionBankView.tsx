import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Plus, 
  Check, 
  BookOpen, 
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { QuestionItem, CognitiveLevel, QuestionType } from '../types/exam';
import { getQuestionBank, deleteQuestionFromBank, saveQuestionToBank } from '../utils/storage';

interface QuestionBankViewProps {
  onAddQuestionToExam: (question: QuestionItem) => void;
  currentSubject: string;
  currentGrade: number;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onAddQuestionToExam,
  currentSubject,
  currentGrade
}) => {
  const [bank, setBank] = useState<(QuestionItem & { subject: string; grade: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New question state
  const [newStem, setNewStem] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newType, setNewType] = useState<QuestionType>('multiple_choice');
  const [newLevel, setNewLevel] = useState<CognitiveLevel>('nhan_biet');
  const [newPoints, setNewPoints] = useState(0.25);
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrect, setNewCorrect] = useState('A');

  const loadBank = () => {
    setBank(getQuestionBank());
  };

  useEffect(() => {
    loadBank();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng?')) {
      deleteQuestionFromBank(id);
      loadBank();
    }
  };

  const handleAddNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStem.trim()) return;

    const questionItem: QuestionItem = {
      id: `custom-bank-${Date.now()}`,
      number: 1,
      type: newType,
      topic: newTopic || 'Chủ đề chung',
      cognitiveLevel: newLevel,
      points: newPoints,
      stem: newStem.trim(),
      options: newType === 'multiple_choice' ? [
        { key: 'A', content: newOptA },
        { key: 'B', content: newOptB },
        { key: 'C', content: newOptC },
        { key: 'D', content: newOptD }
      ] : undefined,
      correctAnswer: newCorrect
    };

    saveQuestionToBank(questionItem, currentSubject, currentGrade);
    loadBank();
    setIsAddingNew(false);
    // Reset form
    setNewStem('');
    setNewTopic('');
    setNewOptA('');
    setNewOptB('');
    setNewOptC('');
    setNewOptD('');
  };

  const filteredQuestions = bank.filter(q => {
    const matchSearch = q.stem.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = filterSubject === 'all' || q.subject === filterSubject;
    const matchGrade = filterGrade === 'all' || q.grade.toString() === filterGrade;
    const matchLevel = filterLevel === 'all' || q.cognitiveLevel === filterLevel;
    const matchType = filterType === 'all' || q.type === filterType;
    return matchSearch && matchSubject && matchGrade && matchLevel && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Ngân hàng câu hỏi THCS chuẩn GDPT 2018
            </h3>
            <p className="text-xs text-slate-500">
              Tổng số {bank.length} câu hỏi được phân loại theo môn học, khối lớp và mức độ nhận thức
            </p>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm câu hỏi mới vào ngân hàng</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nội dung, chủ đề..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lọc Mức độ */}
          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="nhan_biet">Nhận biết</option>
              <option value="thong_hieu">Thông hiểu</option>
              <option value="van_dung">Vận dụng</option>
              <option value="van_dung_cao">Vận dụng cao</option>
            </select>
          </div>

          {/* Lọc Dạng câu hỏi */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Tất cả dạng câu</option>
              <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
              <option value="true_false">Trắc nghiệm Đúng/Sai</option>
              <option value="short_answer">Trả lời ngắn</option>
              <option value="essay">Tự luận</option>
            </select>
          </div>

          {/* Lọc Khối lớp */}
          <div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            >
              <option value="all">Tất cả các lớp</option>
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal / Form thêm câu hỏi mới */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl border-2 border-blue-400 p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Soạn thảo câu hỏi mới đưa vào Ngân hàng
            </h4>
            <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600 text-xs">
              ✕ Đóng
            </button>
          </div>

          <form onSubmit={handleAddNewQuestion} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dạng câu hỏi:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 border rounded-lg bg-slate-50"
                >
                  <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                  <option value="true_false">Trắc nghiệm Đúng/Sai</option>
                  <option value="short_answer">Trả lời ngắn</option>
                  <option value="essay">Tự luận</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as any)}
                  className="w-full p-2 border rounded-lg bg-slate-50"
                >
                  <option value="nhan_biet">Nhận biết</option>
                  <option value="thong_hieu">Thông hiểu</option>
                  <option value="van_dung">Vận dụng</option>
                  <option value="van_dung_cao">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chủ đề:</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Ví dụ: Hằng đẳng thức..."
                  className="w-full p-2 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điểm:</label>
                <input
                  type="number"
                  step="0.25"
                  value={newPoints}
                  onChange={(e) => setNewPoints(parseFloat(e.target.value) || 0.25)}
                  className="w-full p-2 border rounded-lg bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nội dung câu hỏi:</label>
              <textarea
                rows={2}
                required
                value={newStem}
                onChange={(e) => setNewStem(e.target.value)}
                placeholder="Nhập nội dung câu hỏi..."
                className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-800"
              />
            </div>

            {newType === 'multiple_choice' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phương án A:</label>
                  <input
                    type="text"
                    value={newOptA}
                    onChange={(e) => setNewOptA(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phương án B:</label>
                  <input
                    type="text"
                    value={newOptB}
                    onChange={(e) => setNewOptB(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phương án C:</label>
                  <input
                    type="text"
                    value={newOptC}
                    onChange={(e) => setNewOptC(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phương án D:</label>
                  <input
                    type="text"
                    value={newOptD}
                    onChange={(e) => setNewOptD(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 mr-2">Đáp án đúng:</label>
                  <select
                    value={newCorrect}
                    onChange={(e) => setNewCorrect(e.target.value)}
                    className="p-1.5 border rounded-md font-bold text-blue-700"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
              >
                Lưu vào Ngân hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách câu hỏi trong ngân hàng */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <Database className="w-10 h-10 mx-auto text-slate-300" />
            <div className="font-semibold text-sm">Chưa có câu hỏi nào phù hợp bộ lọc</div>
            <p className="text-xs">
              Bạn có thể tạo đề thi bằng AI và nhấn nút <strong>"Lưu vào Ngân hàng"</strong> tại tab Đề kiểm tra để tự động gom câu hỏi!
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                    {q.subject} - Lớp {q.grade}
                  </span>
                  <span className="font-medium text-slate-500">Chủ đề: {q.topic}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {q.cognitiveLevel === 'nhan_biet' ? 'Nhận biết' :
                     q.cognitiveLevel === 'thong_hieu' ? 'Thông hiểu' :
                     q.cognitiveLevel === 'van_dung' ? 'Vận dụng' : 'Vận dụng cao'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddQuestionToExam(q)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Đưa vào đề thi hiện tại
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                    title="Xóa khỏi ngân hàng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-slate-800 leading-relaxed font-medium">
                {q.stem}
              </div>

              {q.options && (
                <div className="grid grid-cols-2 gap-2 pl-3 text-slate-700">
                  {q.options.map((opt) => (
                    <div key={opt.key} className={opt.key === q.correctAnswer ? 'font-bold text-emerald-700' : ''}>
                      <span>{opt.key}. </span>
                      <span>{opt.content}</span>
                      {opt.key === q.correctAnswer && <span className="ml-1 text-[10px] text-emerald-600">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
