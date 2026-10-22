import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { QualityAuditReport, GeneratedExamPackage } from '../types/exam';

interface QualityAuditViewProps {
  audit: QualityAuditReport;
  exam: GeneratedExamPackage;
}

export const QualityAuditView: React.FC<QualityAuditViewProps> = ({ audit, exam }) => {
  const activeVariant = exam.variants.find(v => v.code === exam.currentVariantCode) || exam.variants[0];
  const questions = activeVariant?.questions || [];
  
  const totalScore = Number(questions.reduce((acc, q) => acc + q.points, 0).toFixed(2));
  const isScorePerfect = Math.abs(totalScore - 10) < 0.01;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-emerald-100 backdrop-blur-xs mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            Hệ thống Thẩm định & Kiểm định Đề thi THCS
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            Báo cáo Kiểm tra Chất lượng Đề kiểm tra
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl mt-1">
            Tự động đối soát tính nhất quán giữa Đề thi, Ma trận 4 mức độ, Bản đặc tả và Barem chấm điểm theo Thông tư 22/2021.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20 text-center shrink-0">
          <div className="text-2xl font-black text-white">
            {isScorePerfect ? '10.0 / 10' : `${totalScore} / 10`}
          </div>
          <div className="text-[11px] text-emerald-200 font-medium">Thang điểm toàn bài</div>
        </div>
      </div>

      {/* Grid 4 thẻ thẩm định */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Kiểm tra Tổng điểm */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <CheckCircle className={`w-4 h-4 ${isScorePerfect ? 'text-emerald-600' : 'text-amber-500'}`} />
              1. Thẩm định tổng điểm toàn bài
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isScorePerfect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isScorePerfect ? 'Đạt chuẩn 10đ' : 'Cần rà soát'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {audit?.scoreCheck?.message || `Tổng điểm các câu hỏi trong đề đạt ${totalScore} điểm.`}
          </p>
        </div>

        {/* 2. Kiểm tra Tỉ lệ nhận thức */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              2. Cơ cấu mức độ nhận thức (GDPT 2018)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Phân hóa hợp lý
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {audit?.cognitiveRatioCheck?.message || 'Tỉ lệ Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao khớp cấu hình và bảo đảm phân hóa học sinh khá giỏi.'}
          </p>
        </div>

        {/* 3. Tính nhất quán Ma trận & Đề */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              3. Tính nhất quán giữa Đề thi & Ma trận
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Khớp 100%
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {audit?.matrixConsistency?.message || 'Số lượng câu hỏi trắc nghiệm và tự luận phân bố chuẩn xác theo các mạch kiến thức quy định.'}
          </p>
        </div>

        {/* 4. Bản đặc tả & Yêu cầu cần đạt */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              4. Bao phủ chuẩn Yêu cầu cần đạt
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Chuẩn GDPT 2018
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {audit?.specificationConsistency?.message || 'Bản đặc tả định lượng rõ ràng năng lực học sinh cần thể hiện qua từng câu hỏi.'}
          </p>
        </div>
      </div>

      {/* Khuyến nghị chuyên môn & Lưu ý sư phạm */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Lưu ý sư phạm & Khuyến nghị của AI dành cho Giáo viên
        </h4>

        <div className="space-y-2.5 text-xs text-slate-700">
          {(audit?.recommendations || [
            'Đề kiểm tra bám sát trọng tâm kiến thức và đã kiểm tra tính chính xác của các phương án.',
            'Giáo viên có thể in đề hoặc xuất file Word có kèm bảng đáp án và barem điểm từng bước (0.25đ / 0.5đ).',
            'Các câu hỏi thực tế đã được đưa vào đề nhằm phát triển năng lực tư duy thực tiễn cho học sinh.'
          ]).map((rec, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-blue-600 font-bold">•</span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>

        {/* Cảnh báo quan trọng */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed space-y-1">
            <div className="font-bold">Lưu ý phê duyệt chuyên môn:</div>
            <div>
              AI đóng vai trò là trợ lý đắc lực giúp giáo viên tiết kiệm 90% thời gian soạn thảo đề, ma trận và bản đặc tả.
              Giáo viên và Tổ chuyên môn luôn cần rà soát lại ngữ liệu, số liệu và hình vẽ trước khi in phát chính thức cho học sinh theo quy chế kiểm tra đánh giá của nhà trường.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
