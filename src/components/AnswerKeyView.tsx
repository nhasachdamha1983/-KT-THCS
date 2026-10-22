import React, { useState } from 'react';
import { 
  CheckSquare, 
  Download, 
  CheckCircle2, 
  ListOrdered,
  Award,
  Binary
} from 'lucide-react';
import { GeneratedExamPackage } from '../types/exam';
import { exportAnswerKeyDocx } from '../utils/docxExport';
import { MathRenderer } from './MathRenderer';

interface AnswerKeyViewProps {
  exam: GeneratedExamPackage;
}

export const AnswerKeyView: React.FC<AnswerKeyViewProps> = ({ exam }) => {
  const [activeVariantCode, setActiveVariantCode] = useState<string>(exam.currentVariantCode || '101');
  const activeVariant = exam.variants.find(v => v.code === activeVariantCode) || exam.variants[0];
  const questions = activeVariant?.questions || [];

  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  const tfQuestions = questions.filter(q => q.type === 'true_false');
  const saQuestions = questions.filter(q => q.type === 'short_answer');
  const essayQuestions = questions.filter(q => q.type === 'essay' || q.type === 'practical_task');

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            Đáp án, Hướng dẫn chấm & Biểu điểm chi tiết (Chuẩn MathType)
          </h3>
          <p className="text-xs text-slate-500">
            Có barem điểm bước 0.25đ/0.5đ, công thức chuẩn MathType và phương án tương đương được chấp nhận
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chọn mã đề */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Mã đề:</span>
            {exam.variants.map((v) => (
              <button
                key={v.code}
                onClick={() => setActiveVariantCode(v.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeVariantCode === v.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {v.code}
              </button>
            ))}
          </div>

          <button
            onClick={() => exportAnswerKeyDocx(exam, activeVariantCode)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Đáp án Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* 1. Bảng đáp án nhanh Trắc nghiệm nhiều lựa chọn */}
      {mcQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-blue-600" />
              1. Bảng đáp án Trắc nghiệm Nhiều phương án lựa chọn (Phần I)
            </h4>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {mcQuestions.length} câu
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {mcQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center hover:border-blue-400 transition-colors"
              >
                <div className="text-[11px] font-semibold text-slate-500 mb-1">
                  Câu {q.number}
                </div>
                <div className="text-base font-extrabold text-blue-700 bg-white rounded-lg py-1 shadow-2xs border border-slate-100">
                  {q.correctAnswer || 'A'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {q.points} điểm
                </div>
              </div>
            ))}
          </div>

          {/* Chi tiết giải thích ngắn nếu có */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700">Giải thích chi tiết phương án trắc nghiệm:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {mcQuestions.filter(q => q.notes).map(q => (
                <div key={q.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                  <span className="font-bold text-blue-700">Câu {q.number} ({q.correctAnswer}): </span>
                  <span><MathRenderer content={q.notes || ''} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Đáp án Trắc nghiệm Đúng / Sai */}
      {tfQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              2. Đáp án và giải thích Trắc nghiệm Đúng / Sai (Phần II)
            </h4>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {tfQuestions.length} câu (Mỗi câu 4 ý a, b, c, d)
            </span>
          </div>

          <div className="space-y-4">
            {tfQuestions.map((q) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  Câu {q.number} ({q.points} điểm): <span className="font-normal text-slate-700"><MathRenderer content={q.stem} /></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {q.subItems?.map((s) => (
                    <div
                      key={s.key}
                      className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                        s.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-red-50/70 border-red-200 text-red-950'
                      }`}
                    >
                      <span className="font-bold shrink-0">
                        {s.key})
                      </span>
                      <div className="flex-1">
                        <div><MathRenderer content={s.statement} /></div>
                        <div className="mt-1 font-bold flex items-center gap-1 text-[11px]">
                          {s.isCorrect ? (
                            <span className="text-emerald-700">✓ ĐÚNG</span>
                          ) : (
                            <span className="text-red-700">✕ SAI</span>
                          )}
                          {s.explanation && (
                            <span className="font-normal text-slate-600 italic">
                              — <MathRenderer content={s.explanation} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Đáp án Trả lời ngắn */}
      {saQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              3. Đáp án Trắc nghiệm Trả lời ngắn (Phần III)
            </h4>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              {saQuestions.length} câu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {saQuestions.map((q) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="font-bold text-slate-900">
                  Câu {q.number} ({q.points} điểm): <span className="font-normal text-slate-700"><MathRenderer content={q.stem} /></span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700">Đáp số chính xác:</span>
                  <span className="font-extrabold text-blue-700 text-sm"><MathRenderer content={q.correctAnswer || ''} /></span>
                </div>
                {q.essaySolution && (
                  <div className="text-[11px] text-slate-600 italic">
                    * Hướng dẫn giải: <MathRenderer content={q.essaySolution} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Hướng dẫn chấm Tự luận & Biểu điểm chi tiết */}
      {essayQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              4. Hướng dẫn chấm Tự luận & Biểu điểm chi tiết (Phần IV)
            </h4>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Thang điểm từng bước & Cách làm tương đương
            </span>
          </div>

          <div className="space-y-6">
            {essayQuestions.map((q) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="text-xs font-bold text-slate-900">
                  Câu {q.number} ({q.points} điểm):
                  <div className="font-normal text-slate-700 mt-1 bg-white p-3 rounded-lg border border-slate-200">
                    <MathRenderer content={q.stem} asBlock={true} />
                  </div>
                </div>

                {/* Lời giải chi tiết */}
                {q.essaySolution && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-blue-900">Lời giải chi tiết chuẩn (MathType):</span>
                    <div className="bg-white p-3.5 rounded-lg border border-blue-200 text-slate-800 leading-relaxed text-[11px]">
                      <MathRenderer content={q.essaySolution} asBlock={true} />
                    </div>
                  </div>
                )}

                {/* Bảng barem điểm từng bước */}
                {q.scoringCriteria && q.scoringCriteria.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-800">Biểu điểm thành phần (Barem chấm):</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2.5">Nội dung / Các bước yêu cầu</th>
                            <th className="p-2.5 w-24 text-center">Điểm</th>
                            <th className="p-2.5">Phương án trả lời tương đương được chấp nhận</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {q.scoringCriteria.map((c, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-2.5 text-slate-800">
                                <MathRenderer content={c.step} />
                              </td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{c.score} đ</td>
                              <td className="p-2.5 text-slate-600 text-[11px]">
                                {(c.acceptableEquivalents || []).map((eq, eqIdx) => (
                                  <span key={eqIdx} className="inline-block mr-2">
                                    <MathRenderer content={eq} />
                                  </span>
                                ))}
                                {(!c.acceptableEquivalents || c.acceptableEquivalents.length === 0) && (
                                  'Học sinh làm theo cách khác đúng bản chất vẫn cho điểm tối đa'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Bảng Rubric nếu có */}
      {exam.rubric && exam.rubric.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              5. Bảng tiêu chí đánh giá Rubric (Dành cho Thực hành, Năng khiếu, Trải nghiệm)
            </h4>
          </div>

          <div className="space-y-4">
            {exam.rubric.map((r, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between font-bold text-xs text-purple-900">
                  <span>Tiêu chí: {r.name}</span>
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    Tối đa {r.maxScore} điểm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {r.levels.map((lvl, lIdx) => (
                    <div key={lIdx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center justify-between">
                        <span>{lvl.level}</span>
                        <span className="text-[10px] text-blue-600 font-semibold">{lvl.scoreRange}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 leading-normal">
                        {lvl.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
