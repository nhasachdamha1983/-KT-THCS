import React, { useState } from 'react';
import { PlusCircle, X, Check } from 'lucide-react';
import { SubjectConfig } from '../types/exam';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (subject: SubjectConfig) => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ isOpen, onClose, onAddSubject }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubjectConfig['category']>('natural_sciences');
  const [defaultTime, setDefaultTime] = useState(45);
  const [topicsText, setTopicsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const topics = topicsText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newSub: SubjectConfig = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      defaultTime,
      typicalFormat: category === 'arts_physical' || category === 'experiential' ? 'practical_rubric' : 'combined',
      defaultTopics: {
        6: topics.length > 0 ? topics : ['Chủ đề 1', 'Chủ đề 2'],
        7: topics.length > 0 ? topics : ['Chủ đề 1', 'Chủ đề 2'],
        8: topics.length > 0 ? topics : ['Chủ đề 1', 'Chủ đề 2'],
        9: topics.length > 0 ? topics : ['Chủ đề 1', 'Chủ đề 2']
      }
    };

    onAddSubject(newSub);
    setName('');
    setTopicsText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Bổ sung môn học / phân môn mới
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên môn học hoặc phân môn: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Tiếng Nhật THCS, STEM & Robot học..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lĩnh vực giáo dục:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="natural_sciences">Khoa học tự nhiên / Toán</option>
                <option value="social_sciences">Khoa học xã hội</option>
                <option value="languages">Ngoại ngữ / Ngôn ngữ</option>
                <option value="technology">Công nghệ / Tin học</option>
                <option value="arts_physical">Nghệ thuật / Thể chất</option>
                <option value="experiential">Hoạt động trải nghiệm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời gian làm bài chuẩn (phút):
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={defaultTime}
                onChange={(e) => setDefaultTime(parseInt(e.target.value) || 45)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gợi ý các chủ đề / mạch kiến thức (mỗi dòng một chủ đề):
            </label>
            <textarea
              rows={3}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              placeholder="Chủ đề 1: Nhập môn&#10;Chủ đề 2: Kĩ năng cơ bản&#10;Chủ đề 3: Vận dụng thực tế"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Thêm môn học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
