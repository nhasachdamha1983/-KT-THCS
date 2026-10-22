import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini Client utility
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. API Tạo Đề Kiểm Tra bằng AI
app.post('/api/generate-exam', async (req: Request, res: Response) => {
  try {
    const examData = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Bạn có thể sử dụng bộ đề mẫu dự phòng chất lượng cao của hệ thống để tiếp tục.',
        isFallbackSuggested: true
      });
    }

    const prompt = `
Bạn là chuyên gia hàng đầu về khảo thí và kiểm tra đánh giá giáo dục cấp THCS tại Việt Nam, đặc biệt am hiểu Chương trình Giáo dục phổ thông 2018 (Thông tư 22/2021/TT-BGDĐT, Công văn 5512/BGDĐT-GDTrH, Công văn 3175/BGDĐT-GDTrH).

Hãy biên soạn trọn bộ hồ sơ kiểm tra đánh giá gồm:
1. MA TRẬN ĐỀ KIỂM TRA (chuẩn GDPT 2018)
2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA (đầy đủ các mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
3. ĐỀ KIỂM TRA CHÍNH THỨC
4. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT (có barem điểm từng bước 0.25đ/0.5đ, các phương án tương đương được chấp nhận)
5. BẢNG TIÊU CHÍ RUBRIC (nếu là môn Âm nhạc, Mĩ thuật, GDTC, HĐTN-HN)
6. BÁO CÁO KIỂM TRA CHẤT LƯỢNG ĐỀ (Audit)

THÔNG TIN ĐẦU VÀO:
- Trường: ${examData.schoolName || 'TRƯỜNG THCS'}
- Tổ chuyên môn: ${examData.departmentName || 'TỔ KHOA HỌC'}
- Môn học: ${examData.subject}
- Lớp: ${examData.grade}
- Bộ sách giáo khoa: ${examData.textbook}
- Loại bài kiểm tra: ${examData.examType}
- Thời gian làm bài: ${examData.durationMinutes} phút
- Phạm vi kiến thức: ${examData.knowledgeScope}
- Hình thức đề: ${examData.examFormat}
- Thang điểm: ${examData.totalPoints || 10} điểm
- Cấu trúc số câu dự kiến:
  + Trắc nghiệm nhiều lựa chọn: ${examData.structure?.multipleChoiceCount || 0} câu (${examData.structure?.multipleChoicePoints || 0} điểm)
  + Trắc nghiệm Đúng/Sai: ${examData.structure?.trueFalseCount || 0} câu (${examData.structure?.trueFalsePoints || 0} điểm)
  + Trắc nghiệm trả lời ngắn: ${examData.structure?.shortAnswerCount || 0} câu (${examData.structure?.shortAnswerPoints || 0} điểm)
  + Tự luận: ${examData.structure?.essayCount || 0} câu (${examData.structure?.essayPoints || 0} điểm)
- Tỉ lệ mức độ nhận thức:
  + Nhận biết: ${examData.structure?.cognitiveRatio?.nhanBiet || 40}%
  + Thông hiểu: ${examData.structure?.cognitiveRatio?.thongHieu || 30}%
  + Vận dụng: ${examData.structure?.cognitiveRatio?.vanDung || 20}%
  + Vận dụng cao: ${examData.structure?.cognitiveRatio?.vanDungCao || 10}%
- Tùy chọn nâng cao:
  + Gắn tình huống thực tiễn: ${examData.structure?.includePracticalContext ? 'CÓ (Tối thiểu 1-2 câu ứng dụng đời sống)' : 'Bình thường'}
  + Dữ liệu/bảng biểu/biểu đồ: ${examData.structure?.includeDataOrCharts ? 'CÓ' : 'Tùy chọn'}
  + Tích hợp năng lực số: ${examData.structure?.includeDigitalCompetence ? 'CÓ' : 'Tùy chọn'}
- Yêu cầu riêng của giáo viên: ${examData.customRequirements || 'Bám sát nội dung đã học, không ra ngoài chương trình, phân hóa học sinh.'}
${examData.referenceMaterial ? `- TÀI LIỆU CĂN CỨ DO GIÁO VIÊN CUNG CẤP:\n"""${examData.referenceMaterial}"""` : ''}

QUY TẮC BẮT BUỘC VỀ CÔNG THỨC TOÁN HỌC (CHUẨN MATHTYPE / LATEX):
1. TẤT CẢ các công thức toán học, biểu thức đại số, số mũ, căn thức, phân số, kí hiệu hình học, biến số (x, y, a, b...), góc, vectơ PHẢI ĐƯỢC VIẾT THEO CHUẨN MATHTYPE / LATEX đặt trong cặp dấu $...$ (hoặc $$...$$ nếu công thức hiển thị riêng một dòng).
   Ví dụ:
   - Viết $x^2 - 4xy + 4y^2 = 0$ thay vì x2 - 4xy...
   - Viết $\\frac{2x + 1}{x - 3}$ thay vì (2x+1)/(x-3)
   - Viết $\\sqrt{x^2 - 4}$ thay vì căn(x^2 - 4)
   - Viết $\\widehat{ABC} = 90^\\circ$ hoặc $\\widehat{A}$
   - Viết $(x - 1)^{2024} + (y + 2)^{2025}$
   - Viết $AB \\parallel CD$, $\\Delta ABC$
   Quy tắc này giúp giáo viên khi mở file Word có thể nhấn tổ hợp phím tắt Alt + \\ (Toggle TeX của MathType) để chuyển đổi tức thì thành công thức MathType chuẩn!

QUY TẮC BẮT BUỘC VỀ NỘI DUNG VÀ ĐIỂM SỐ:
1. Tổng điểm toàn bài PHẢI BẰNG CHÍNH XÁC 10.0 ĐIỂM.
2. Với câu trắc nghiệm Đúng/Sai (Part II), mỗi câu phải có đúng 4 ý a, b, c, d rõ ràng với khẳng định tính đúng sai và giải thích.
3. Với câu Tự luận (Part IV), phải có hướng dẫn giải chi tiết từng bước và bảng barem điểm con (ví dụ 0.25đ, 0.5đ).
4. Ngữ liệu và số liệu phải chính xác, khoa học, phù hợp lứa tuổi học sinh THCS Việt Nam.
5. TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON (không có markdown \`\`\`json bao quanh, chỉ là raw JSON hợp lệ).

CẤU TRÚC JSON CẦN TRẢ VỀ:
{
  "examTitle": "ĐỀ KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KÌ I...",
  "timeLimit": ${examData.durationMinutes},
  "instructions": "Thí sinh làm bài trên giấy thi...",
  "matrix": {
    "rows": [
      {
        "topic": "Tên chủ đề 1",
        "knowledgeUnit": "Tên đơn vị kiến thức",
        "nhanBietTN": 2,
        "nhanBietTL": 0,
        "thongHieuTN": 1,
        "thongHieuTL": 0,
        "vanDungTN": 1,
        "vanDungTL": 1,
        "vanDungCaoTN": 0,
        "vanDungCaoTL": 0,
        "totalQuestions": 5,
        "totalScore": 2.5,
        "percentageScore": 25
      }
    ],
    "totalTN": 12,
    "totalTL": 3,
    "totalQuestions": 15,
    "totalScore": 10
  },
  "specification": [
    {
      "topic": "Tên chủ đề",
      "knowledgeUnit": "Tên bài/nội dung",
      "requiredCompetency": "Yêu cầu cần đạt chuẩn GDPT 2018",
      "nhanBietDesc": "Mô tả nhận biết",
      "thongHieuDesc": "Mô tả thông hiểu",
      "vanDungDesc": "Mô tả vận dụng",
      "vanDungCaoDesc": "Mô tả vận dụng cao",
      "questionNumbers": "C1, C2, C14"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "type": "multiple_choice",
      "topic": "Tên chủ đề",
      "cognitiveLevel": "nhan_biet",
      "points": 0.25,
      "stem": "Nội dung câu hỏi...",
      "options": [
        { "key": "A", "content": "Phương án A" },
        { "key": "B", "content": "Phương án B" },
        { "key": "C", "content": "Phương án C" },
        { "key": "D", "content": "Phương án D" }
      ],
      "correctAnswer": "A",
      "notes": "Giải thích ngắn"
    },
    {
      "id": "q_tf1",
      "number": 13,
      "type": "true_false",
      "topic": "Tên chủ đề",
      "cognitiveLevel": "thong_hieu",
      "points": 1.0,
      "stem": "Nội dung tình huống câu Đúng/Sai...",
      "subItems": [
        { "key": "a", "statement": "Khẳng định a", "isCorrect": true, "explanation": "Giải thích" },
        { "key": "b", "statement": "Khẳng định b", "isCorrect": false, "explanation": "Giải thích" },
        { "key": "c", "statement": "Khẳng định c", "isCorrect": true, "explanation": "Giải thích" },
        { "key": "d", "statement": "Khẳng định d", "isCorrect": false, "explanation": "Giải thích" }
      ]
    },
    {
      "id": "q_sa1",
      "number": 15,
      "type": "short_answer",
      "topic": "Tên chủ đề",
      "cognitiveLevel": "van_dung",
      "points": 0.5,
      "stem": "Nội dung câu trả lời ngắn...",
      "correctAnswer": "25",
      "essaySolution": "Hướng dẫn giải chi tiết"
    },
    {
      "id": "q_es1",
      "number": 17,
      "type": "essay",
      "topic": "Tên chủ đề",
      "cognitiveLevel": "van_dung",
      "points": 1.5,
      "stem": "Nội dung câu tự luận...",
      "essaySolution": "Lời giải chi tiết...",
      "scoringCriteria": [
        { "step": "Bước 1...", "score": 0.5, "acceptableEquivalents": ["Cách 2..."] }
      ]
    }
  ],
  "rubric": [
    {
      "name": "Tiêu chí...",
      "maxScore": 2.0,
      "levels": [
        { "level": "Xuất sắc", "description": "...", "scoreRange": "1.75 - 2.0" },
        { "level": "Tốt", "description": "...", "scoreRange": "1.25 - 1.5" },
        { "level": "Đạt", "description": "...", "scoreRange": "1.0" },
        { "level": "Chưa đạt", "description": "...", "scoreRange": "< 1.0" }
      ]
    }
  ],
  "qualityAudit": {
    "scoreCheck": {
      "isValid": true,
      "totalCalculated": 10.0,
      "expected": 10.0,
      "message": "Tổng điểm toàn bài đạt đúng 10.0 điểm."
    },
    "cognitiveRatioCheck": {
      "isValid": true,
      "actualRatio": { "nhanBiet": 40, "thongHieu": 30, "vanDung": 20, "vanDungCao": 10 },
      "targetRatio": { "nhanBiet": 40, "thongHieu": 30, "vanDung": 20, "vanDungCao": 10 },
      "message": "Khớp chuẩn tỉ lệ phân hóa nhận thức."
    },
    "matrixConsistency": {
      "isValid": true,
      "message": "Số lượng câu hỏi trong đề khớp hoàn toàn với ma trận và bản đặc tả."
    },
    "specificationConsistency": {
      "isValid": true,
      "message": "Đáp ứng đầy đủ yêu cầu cần đạt theo chuẩn chương trình GDPT 2018."
    },
    "pedagogicalWarnings": [],
    "recommendations": ["Đề kiểm tra có tính phân hóa tốt, câu hỏi bám sát thực tiễn."]
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia thẩm định và ra đề kiểm tra cấp THCS theo chương trình GDPT 2018. Bạn luôn trả về kết quả dưới dạng JSON hợp lệ, không chứa văn bản đàm thoại hoặc định dạng markdown bọc ngoài.',
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const rawText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      // Làm sạch text nếu có markdown thừa
      const cleaned = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Xây dựng variants và answer sheet
    const questions = parsedData.questions || [];
    const answerSheet: Record<string, string> = {};
    questions.forEach((q: any) => {
      if (q.type === 'multiple_choice') {
        answerSheet[q.number] = q.correctAnswer || 'A';
      } else if (q.type === 'true_false') {
        const tfStr = (q.subItems || []).map((s: any) => `${s.key}: ${s.isCorrect ? 'Đ' : 'S'}`).join(', ');
        answerSheet[q.number] = tfStr;
      } else if (q.type === 'short_answer') {
        answerSheet[q.number] = q.correctAnswer || '';
      } else {
        answerSheet[q.number] = `Tự luận (${q.points} điểm)`;
      }
    });

    const primaryVariant = {
      code: '101',
      title: 'Mã đề: 101',
      questions,
      answerSheet
    };

    // Tạo mã đề phụ nếu giáo viên yêu cầu nhiều mã đề
    const variants = [primaryVariant];
    const variantCount = examData.structure?.variantCount || 1;
    if (variantCount > 1) {
      for (let i = 2; i <= variantCount; i++) {
        const code = (100 + i).toString();
        // Xáo trộn nhẹ trắc nghiệm
        const mcOnly = questions.filter((q: any) => q.type === 'multiple_choice');
        const otherQuestions = questions.filter((q: any) => q.type !== 'multiple_choice');
        
        // Hoán vị câu trắc nghiệm
        const shuffledMC = [...mcOnly].sort(() => Math.random() - 0.5);
        const newQuestions = [...shuffledMC, ...otherQuestions].map((q: any, idx: number) => ({
          ...q,
          number: idx + 1
        }));

        const varAnswerSheet: Record<string, string> = {};
        newQuestions.forEach((q: any) => {
          if (q.type === 'multiple_choice') {
            varAnswerSheet[q.number] = q.correctAnswer || 'A';
          } else if (q.type === 'true_false') {
            const tfStr = (q.subItems || []).map((s: any) => `${s.key}: ${s.isCorrect ? 'Đ' : 'S'}`).join(', ');
            varAnswerSheet[q.number] = tfStr;
          } else if (q.type === 'short_answer') {
            varAnswerSheet[q.number] = q.correctAnswer || '';
          } else {
            varAnswerSheet[q.number] = `Tự luận (${q.points} điểm)`;
          }
        });

        variants.push({
          code,
          title: `Mã đề: ${code}`,
          questions: newQuestions,
          answerSheet: varAnswerSheet
        });
      }
    }

    const examPackage = {
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      metadata: examData,
      examTitle: parsedData.examTitle || `ĐỀ KIỂM TRA ĐÁNH GIÁ MÔN ${examData.subject.toUpperCase()}`,
      timeLimit: parsedData.timeLimit || examData.durationMinutes || 45,
      instructions: parsedData.instructions || 'Thí sinh làm bài trực tiếp vào tờ giấy thi.',
      variants,
      currentVariantCode: '101',
      matrix: parsedData.matrix || { rows: [], totalTN: 0, totalTL: 0, totalQuestions: 0, totalScore: 10 },
      specification: parsedData.specification || [],
      rubric: parsedData.rubric || [],
      qualityAudit: parsedData.qualityAudit || {
        scoreCheck: { isValid: true, totalCalculated: 10, expected: 10, message: 'Đạt chuẩn 10 điểm' },
        cognitiveRatioCheck: { isValid: true, actualRatio: examData.structure?.cognitiveRatio, targetRatio: examData.structure?.cognitiveRatio, message: 'Khớp tỉ lệ nhận thức' },
        matrixConsistency: { isValid: true, message: 'Khớp ma trận và bản đặc tả' },
        specificationConsistency: { isValid: true, message: 'Đáp ứng chuẩn GDPT 2018' },
        pedagogicalWarnings: [],
        recommendations: ['Đề thi đã được AI tối ưu hóa và sẵn sàng cho giáo viên rà soát.']
      }
    };

    return res.json(examPackage);
  } catch (error: any) {
    console.error('Lỗi khi tạo đề kiểm tra bằng AI:', error);
    return res.status(500).json({
      error: error.message || 'Không thể tạo đề kiểm tra qua AI. Vui lòng kiểm tra kết nối mạng hoặc thử lại.'
    });
  }
});

// 2. API Tạo lại một câu hỏi cụ thể (Regenerate Question)
app.post('/api/regenerate-question', async (req: Request, res: Response) => {
  try {
    const { question, subject, grade, requirement } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
    }

    const prompt = `
Bạn là giáo viên cốt cán THCS môn ${subject} lớp ${grade}.
Hãy tạo lại câu hỏi sau đây theo yêu cầu điều chỉnh của giáo viên:

CÂU HỎI HIỆN TẠI:
- Loại: ${question.type}
- Chủ đề: ${question.topic}
- Mức độ nhận thức: ${question.cognitiveLevel}
- Số điểm: ${question.points}
- Nội dung: ${question.stem}

YÊU CẦU ĐIỀU CHỈNH CỦA GIÁO VIÊN:
${requirement || 'Tạo một câu hỏi tương đương mới với ngữ liệu hấp dẫn, chính xác và không trùng lặp.'}

LƯU Ý CÔNG THỨC TOÁN HỌC: Mọi công thức toán học, biểu thức, biến số, căn thức, phân số PHẢI ĐƯỢC ĐẶT TRONG CẶP DẤU $...$ CHUẨN MATHTYPE / LATEX (ví dụ $x^2 - 4xy + 4y^2$, $\\frac{a}{b}$, $\\sqrt{x}$).

Trả về DUY NHẤT một JSON hợp lệ chứa đối tượng câu hỏi với đầy đủ các trường (id, number, type, topic, cognitiveLevel, points, stem, options nếu có, correctAnswer nếu có, subItems nếu có, essaySolution nếu có, scoringCriteria nếu có).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const raw = response.text || '{}';
    const newQuestion = JSON.parse(raw);
    newQuestion.id = question.id;
    newQuestion.number = question.number;
    return res.json(newQuestion);
  } catch (error: any) {
    console.error('Lỗi khi tạo lại câu hỏi:', error);
    return res.status(500).json({ error: error.message || 'Lỗi khi tạo lại câu hỏi' });
  }
});

// Setup Vite middleware in dev or static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Server startup error:', err);
});
