import React, { useState } from 'react';
import { 
  GraduationCap, 
  School, 
  UserCheck, 
  Calendar, 
  Edit3, 
  BookOpen, 
  Check, 
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  schoolName: string;
  departmentName: string;
  teacherName: string;
  schoolYear: string;
  onUpdateSchoolInfo: (info: {
    schoolName: string;
    departmentName: string;
    teacherName: string;
    schoolYear: string;
  }) => void;
  activeSubject?: string;
  activeGrade?: number;
}

export const Header: React.FC<HeaderProps> = ({
  schoolName,
  departmentName,
  teacherName,
  schoolYear,
  onUpdateSchoolInfo,
  activeSubject,
  activeGrade
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSchool, setTempSchool] = useState(schoolName);
  const [tempDept, setTempDept] = useState(departmentName);
  const [tempTeacher, setTempTeacher] = useState(teacherName);
  const [tempYear, setTempYear] = useState(schoolYear);

  const handleSave = () => {
    onUpdateSchoolInfo({
      schoolName: tempSchool.trim() || 'TRƯỜNG THCS NGUYỄN DU',
      departmentName: tempDept.trim() || 'TỔ KHOA HỌC TỰ NHIÊN',
      teacherName: tempTeacher.trim() || 'Thầy/Cô Giáo viên',
      schoolYear: tempYear.trim() || '2024 - 2025'
    });
    setIsEditing(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white/15 p-2 rounded-xl backdrop-blur-xs flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                  Trợ lý AI Ra Đề Kiểm Tra THCS
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                    GDPT 2018
                  </span>
                </h1>
              </div>
              <p className="text-xs text-blue-100 font-medium hidden sm:block">
                Hệ thống biên soạn đề kiểm tra, ma trận, bản đặc tả & hướng dẫn chấm chuẩn Thông tư 22/2021 & CV 5512
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI Chuyên sâu Khảo thí</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subheader: Editable School, Department, Teacher, Year */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>{schoolName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-normal">{departmentName}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Giáo viên:</span>
              <span className="font-semibold text-slate-800">{teacherName}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Năm học:</span>
              <span className="font-semibold text-slate-800">{schoolYear}</span>
            </div>

            {activeSubject && (
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200 font-medium">
                <BookOpen className="w-3 h-3" />
                <span>Môn: {activeSubject} {activeGrade ? `- Lớp ${activeGrade}` : ''}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setTempSchool(schoolName);
              setTempDept(departmentName);
              setTempTeacher(teacherName);
              setTempYear(schoolYear);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            title="Chỉnh sửa thông tin trường, giáo viên, năm học"
          >
            <Edit3 className="w-3 h-3" />
            <span>Sửa thông tin</span>
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin trường & giáo viên */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                Chỉnh sửa thông tin trường & giáo viên
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên trường học:
                </label>
                <input
                  type="text"
                  value={tempSchool}
                  onChange={(e) => setTempSchool(e.target.value)}
                  placeholder="Ví dụ: TRƯỜNG THCS NGUYỄN DU"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tổ chuyên môn:
                </label>
                <input
                  type="text"
                  value={tempDept}
                  onChange={(e) => setTempDept(e.target.value)}
                  placeholder="Ví dụ: TỔ TOÁN - TIN HỌC"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên giáo viên ra đề:
                </label>
                <input
                  type="text"
                  value={tempTeacher}
                  onChange={(e) => setTempTeacher(e.target.value)}
                  placeholder="Ví dụ: Thầy Nguyễn Văn An"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Năm học:
                </label>
                <input
                  type="text"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  placeholder="Ví dụ: 2024 - 2025"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
