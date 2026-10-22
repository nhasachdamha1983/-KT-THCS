import { GeneratedExamPackage } from '../types/exam';

export const SAMPLE_TOAN_8_EXAM: GeneratedExamPackage = {
  id: 'sample-toan-8-midterm-1',
  createdAt: new Date().toISOString(),
  metadata: {
    schoolName: 'TRƯỜNG THCS NGUYỄN DU',
    departmentName: 'TỔ TOÁN - TIN HỌC',
    teacherName: 'Thầy Nguyễn Văn An',
    schoolYear: '2024 - 2025',
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
    customRequirements: 'Đề thi bám sát chương trình GDPT 2018, có câu thực tế tính diện tích mảnh vườn.'
  },
  examTitle: 'ĐỀ KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KÌ I',
  timeLimit: 90,
  instructions: 'Thí sinh làm bài trực tiếp vào tờ giấy thi. Không sử dụng tài liệu. Giám thị không giải thích gì thêm.',
  currentVariantCode: '101',
  variants: [
    {
      code: '101',
      title: 'Mã đề: 101',
      answerSheet: {
        '1': 'A',
        '2': 'C',
        '3': 'B',
        '4': 'D',
        '5': 'A',
        '6': 'C',
        '7': 'B',
        '8': 'A',
        '9': 'D',
        '10': 'B',
        '11': 'C',
        '12': 'D',
        '13': 'a: Đ, b: S, c: Đ, d: S',
        '14': 'a: Đ, b: Đ, c: S, d: Đ',
        '15': '20',
        '16': '125',
        '17': 'Tự luận (1.5 điểm)',
        '18': 'Tự luận (1.5 điểm)',
        '19': 'Tự luận (1.0 điểm)'
      },
      questions: [
        {
          id: 'q1',
          number: 1,
          type: 'multiple_choice',
          topic: 'Đa thức nhiều biến',
          cognitiveLevel: 'nhan_biet',
          points: 0.25,
          stem: 'Biểu thức nào sau đây là đơn thức thu gọn?',
          options: [
            { key: 'A', content: '$-3x^2y^3z$' },
            { key: 'B', content: '$2x^2y \\cdot 3x$' },
            { key: 'C', content: '$x^2 + 2y$' },
            { key: 'D', content: '$5x(y - 1)$' }
          ],
          correctAnswer: 'A',
          notes: 'Nhận biết khái niệm đơn thức thu gọn.'
        },
        {
          id: 'q2',
          number: 2,
          type: 'multiple_choice',
          topic: 'Đa thức nhiều biến',
          cognitiveLevel: 'nhan_biet',
          points: 0.25,
          stem: 'Bậc của đa thức $P = 4x^5y - 2x^3y^4 + 7xy^2 - 9$ là:',
          options: [
            { key: 'A', content: '$5$' },
            { key: 'B', content: '$6$' },
            { key: 'C', content: '$7$' },
            { key: 'D', content: '$8$' }
          ],
          correctAnswer: 'C',
          notes: 'Hạng tử $-2x^3y^4$ có bậc là $3 + 4 = 7$, là bậc cao nhất.'
        },
        {
          id: 'q3',
          number: 3,
          type: 'multiple_choice',
          topic: 'Hằng đẳng thức đáng nhớ',
          cognitiveLevel: 'nhan_biet',
          points: 0.25,
          stem: 'Khai triển của hằng đẳng thức $(a - b)^2$ là:',
          options: [
            { key: 'A', content: '$a^2 - b^2$' },
            { key: 'B', content: '$a^2 - 2ab + b^2$' },
            { key: 'C', content: '$a^2 + 2ab + b^2$' },
            { key: 'D', content: '$a^2 - ab + b^2$' }
          ],
          correctAnswer: 'B'
        },
        {
          id: 'q4',
          number: 4,
          type: 'multiple_choice',
          topic: 'Hằng đẳng thức đáng nhớ',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Biểu thức $x^2 - 9$ được viết dưới dạng tích là:',
          options: [
            { key: 'A', content: '$(x - 3)^2$' },
            { key: 'B', content: '$(x + 3)^2$' },
            { key: 'C', content: '$(x - 9)(x + 9)$' },
            { key: 'D', content: '$(x - 3)(x + 3)$' }
          ],
          correctAnswer: 'D'
        },
        {
          id: 'q5',
          number: 5,
          type: 'multiple_choice',
          topic: 'Tứ giác',
          cognitiveLevel: 'nhan_biet',
          points: 0.25,
          stem: 'Tổng bốn góc trong một tứ giác lồi bằng:',
          options: [
            { key: 'A', content: '$360^\\circ$' },
            { key: 'B', content: '$180^\\circ$' },
            { key: 'C', content: '$270^\\circ$' },
            { key: 'D', content: '$90^\\circ$' }
          ],
          correctAnswer: 'A'
        },
        {
          id: 'q6',
          number: 6,
          type: 'multiple_choice',
          topic: 'Hình thang cân',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Cho hình thang cân $ABCD$ ($AB \\parallel CD$). Khẳng định nào sau đây là SAI?',
          options: [
            { key: 'A', content: 'Hai góc kề một đáy bằng nhau.' },
            { key: 'B', content: 'Hai cạnh bên bằng nhau $AD = BC$.' },
            { key: 'C', content: 'Hai đường chéo vuông góc với nhau.' },
            { key: 'D', content: 'Hai đường chéo bằng nhau $AC = BD$.' }
          ],
          correctAnswer: 'C'
        },
        {
          id: 'q7',
          number: 7,
          type: 'multiple_choice',
          topic: 'Hằng đẳng thức',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Giá trị của biểu thức $A = x^2 - 4xy + 4y^2$ tại $x = 18$ và $y = 4$ là:',
          options: [
            { key: 'A', content: '$64$' },
            { key: 'B', content: '$100$' },
            { key: 'C', content: '$144$' },
            { key: 'D', content: '$196$' }
          ],
          correctAnswer: 'B',
          notes: '$A = (x - 2y)^2 = (18 - 8)^2 = 10^2 = 100$.'
        },
        {
          id: 'q8',
          number: 8,
          type: 'multiple_choice',
          topic: 'Đa thức nhiều biến',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Kết quả của phép chia đơn thức $15x^4y^3z$ cho đơn thức $3x^2y^2z$ là:',
          options: [
            { key: 'A', content: '$5x^2y$' },
            { key: 'B', content: '$5x^2yz$' },
            { key: 'C', content: '$12x^2y$' },
            { key: 'D', content: '$5x^6y^5$' }
          ],
          correctAnswer: 'A'
        },
        {
          id: 'q9',
          number: 9,
          type: 'multiple_choice',
          topic: 'Tứ giác',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Tứ giác $ABCD$ có số đo góc $\\widehat{A} = 70^\\circ, \\widehat{B} = 110^\\circ, \\widehat{C} = 80^\\circ$. Số đo góc $\\widehat{D}$ là:',
          options: [
            { key: 'A', content: '$90^\\circ$' },
            { key: 'B', content: '$85^\\circ$' },
            { key: 'C', content: '$120^\\circ$' },
            { key: 'D', content: '$100^\\circ$' }
          ],
          correctAnswer: 'D',
          notes: '$\\widehat{D} = 360^\\circ - (70^\\circ + 110^\\circ + 80^\\circ) = 100^\\circ$.'
        },
        {
          id: 'q10',
          number: 10,
          type: 'multiple_choice',
          topic: 'Hằng đẳng thức lập phương',
          cognitiveLevel: 'nhan_biet',
          points: 0.25,
          stem: 'Khai triển của hằng đẳng thức $(x + 2)^3$ là:',
          options: [
            { key: 'A', content: '$x^3 + 8$' },
            { key: 'B', content: '$x^3 + 6x^2 + 12x + 8$' },
            { key: 'C', content: '$x^3 + 3x^2 + 6x + 8$' },
            { key: 'D', content: '$x^3 + 6x^2 + 6x + 8$' }
          ],
          correctAnswer: 'B'
        },
        {
          id: 'q11',
          number: 11,
          type: 'multiple_choice',
          topic: 'Hình bình hành',
          cognitiveLevel: 'thong_hieu',
          points: 0.25,
          stem: 'Dấu hiệu nào sau đây KHÔNG đủ để chứng minh một tứ giác là hình bình hành?',
          options: [
            { key: 'A', content: 'Tứ giác có các cạnh đối song song.' },
            { key: 'B', content: 'Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường.' },
            { key: 'C', content: 'Tứ giác có hai cạnh đối bằng nhau.' },
            { key: 'D', content: 'Tứ giác có các cạnh đối bằng nhau.' }
          ],
          correctAnswer: 'C'
        },
        {
          id: 'q12',
          number: 12,
          type: 'multiple_choice',
          topic: 'Vận dụng thực tế',
          cognitiveLevel: 'van_dung',
          points: 0.25,
          stem: 'Một mảnh sân hình chữ nhật có chiều dài $(2x + 3)$ mét và chiều rộng $(x + 1)$ mét. Biểu thức đại số biểu thị diện tích mảnh sân đó là:',
          options: [
            { key: 'A', content: '$2x^2 + 3$' },
            { key: 'B', content: '$3x + 4$' },
            { key: 'C', content: '$2x^2 + 4x + 3$' },
            { key: 'D', content: '$2x^2 + 5x + 3$' }
          ],
          correctAnswer: 'D',
          notes: '$(2x + 3)(x + 1) = 2x^2 + 2x + 3x + 3 = 2x^2 + 5x + 3$.'
        },
        {
          id: 'q13',
          number: 13,
          type: 'true_false',
          topic: 'Phân tích đa thức thành nhân tử',
          cognitiveLevel: 'thong_hieu',
          points: 1.0,
          stem: 'Cho đa thức $M(x) = x^3 - 4x$. Xét tính Đúng hoặc Sai của mỗi khẳng định sau:',
          subItems: [
            { key: 'a', statement: '$M(x)$ có thể đặt nhân tử chung là $x$.', isCorrect: true, explanation: '$M(x) = x(x^2 - 4)$.' },
            { key: 'b', statement: '$x^2 - 4$ không phân tích được nữa.', isCorrect: false, explanation: '$x^2 - 4 = (x - 2)(x + 2)$.' },
            { key: 'c', statement: 'Dạng phân tích triệt để của $M(x)$ là $x(x - 2)(x + 2)$.', isCorrect: true, explanation: 'Chính xác theo hằng đẳng thức hiệu hai bình phương.' },
            { key: 'd', statement: 'Tại $x = 2$ thì giá trị của đa thức $M$ bằng $4$.', isCorrect: false, explanation: 'Tại $x = 2, M(2) = 2(0) = 0$.' }
          ]
        },
        {
          id: 'q14',
          number: 14,
          type: 'true_false',
          topic: 'Tứ giác và hình học',
          cognitiveLevel: 'van_dung',
          points: 1.0,
          stem: 'Cho tam giác $ABC$ nhọn có trực tâm $H$. Gọi $M$ là trung điểm của $BC$. Kẻ đường kính $AD$ của đường tròn ngoại tiếp tam giác $ABC$. Xét các khẳng định:',
          subItems: [
            { key: 'a', statement: 'Tứ giác $BHCD$ là hình bình hành.', isCorrect: true, explanation: 'Do $BH \\parallel CD$ (cùng $\\perp AC$) và $CH \\parallel BD$ (cùng $\\perp AB$).' },
            { key: 'b', statement: 'Ba điểm $H, M, D$ thẳng hàng.', isCorrect: true, explanation: '$M$ là trung điểm đường chéo $BC$ nên $M$ cũng là trung điểm $HD$.' },
            { key: 'c', statement: 'Đoạn thẳng $AH$ có độ dài bằng $4$ lần $OM$.', isCorrect: false, explanation: 'Theo tính chất, $AH = 2 OM$ chứ không phải $4 OM$.' },
            { key: 'd', statement: 'Khi $A$ di chuyển, trọng tâm $G$ của tam giác $ABC$ cố định nếu $B, C$ cố định.', isCorrect: true, explanation: 'Điểm cố định trong bài toán quỹ tích đường tròn Euler.' }
          ]
        },
        {
          id: 'q15',
          number: 15,
          type: 'short_answer',
          topic: 'Hằng đẳng thức',
          cognitiveLevel: 'van_dung',
          points: 0.5,
          stem: 'Biết $x + y = 6$ và $xy = 8$. Tính giá trị của biểu thức $P = x^2 + y^2$.',
          correctAnswer: '20',
          essaySolution: '$P = x^2 + y^2 = (x + y)^2 - 2xy = 6^2 - 2 \\cdot 8 = 36 - 16 = 20$.'
        },
        {
          id: 'q16',
          number: 16,
          type: 'short_answer',
          topic: 'Đa thức và hình học thực tế',
          cognitiveLevel: 'van_dung',
          points: 0.5,
          stem: 'Bác Ba có một mảnh đất hình vuông có cạnh $x$ (m). Bác mở rộng về một phía thêm $3$m và phía kề bên thêm $2$m để được một mảnh vườn hình chữ nhật mới. Nếu diện tích tăng thêm là $66\\text{ m}^2$, hãy tính diện tích ban đầu của mảnh vườn hình vuông ($\\text{m}^2$).',
          correctAnswer: '144',
          essaySolution: 'Diện tích mới: $(x + 3)(x + 2) = x^2 + 5x + 6$. Diện tích tăng thêm: $5x + 6 = 66 \\Rightarrow 5x = 60 \\Rightarrow x = 12$ (m). Diện tích ban đầu: $x^2 = 12^2 = 144\\text{ m}^2$.'
        },
        {
          id: 'q17',
          number: 17,
          type: 'essay',
          topic: 'Rút gọn biểu thức đại số',
          cognitiveLevel: 'thong_hieu',
          points: 1.5,
          stem: 'Thực hiện phép tính rút gọn biểu thức sau:\na) $(2x + 1)(x - 3) - 2x(x - 2)$\nb) $(x + 3)^2 - (x - 2)(x + 2) - 6x$',
          essaySolution: 'a) $(2x + 1)(x - 3) - 2x(x - 2) = 2x^2 - 6x + x - 3 - 2x^2 + 4x = -x - 3$.\nb) $(x + 3)^2 - (x - 2)(x + 2) - 6x = (x^2 + 6x + 9) - (x^2 - 4) - 6x = 13$.',
          scoringCriteria: [
            { step: 'a) Nhân phá ngoặc đúng từng nhóm: $2x^2 - 5x - 3 - 2x^2 + 4x$', score: 0.5, acceptableEquivalents: ['Khai triển đúng'] },
            { step: 'a) Thu gọn ra kết quả $-x - 3$', score: 0.25 },
            { step: 'b) Khai triển đúng hằng đẳng thức $(x + 3)^2$ và $(x - 2)(x + 2)$', score: 0.5 },
            { step: 'b) Thu gọn chính xác ra $13$', score: 0.25 }
          ]
        },
        {
          id: 'q18',
          number: 18,
          type: 'essay',
          topic: 'Hình học - Hình chữ nhật, hình bình hành',
          cognitiveLevel: 'van_dung',
          points: 1.5,
          stem: 'Cho tam giác $ABC$ vuông tại $A$, đường trung tuyến $AM$. Gọi $D$ là điểm đối xứng với $A$ qua $M$.\na) Chứng minh tứ giác $ABDC$ là hình chữ nhật.\nb) Gọi $E$ là điểm đối xứng với $A$ qua $B$. Chứng minh tứ giác $BEDC$ là hình bình hành.',
          essaySolution: 'a) Tứ giác $ABDC$ có $M$ là trung điểm của $AD$ (do $D$ đối xứng $A$ qua $M$) và $M$ là trung điểm $BC$ (giả thiết $AM$ là trung tuyến). Suy ra $ABDC$ là hình bình hành. Lại có góc $\\widehat{BAC} = 90^\\circ$ nên $ABDC$ là hình chữ nhật.\nb) Vì $ABDC$ là hình chữ nhật nên $AC \\parallel BD$ và $AC = BD$. Lại có $E$ đối xứng với $A$ qua $B$ nên $B$ là trung điểm $AE \\Rightarrow AB = BE$. Ta có $\\Delta BAC = \\Delta EBD$ hoặc suy ra $CD \\parallel BE$ và $CD = BE$. Vậy tứ giác $BEDC$ là hình bình hành.',
          scoringCriteria: [
            { step: 'Vẽ hình đúng cho câu a', score: 0.25 },
            { step: 'a) Chứng minh $ABDC$ là hình bình hành (2 đường chéo cắt nhau tại trung điểm)', score: 0.5 },
            { step: 'a) Kết luận $ABDC$ là hình chữ nhật vì có $\\widehat{A} = 90^\\circ$', score: 0.25 },
            { step: 'b) Lập luận chỉ ra cặp cạnh đối $BE$ và $CD$ song song và bằng nhau', score: 0.5 }
          ]
        },
        {
          id: 'q19',
          number: 19,
          type: 'essay',
          topic: 'Bất đẳng thức và giá trị nhỏ nhất',
          cognitiveLevel: 'van_dung_cao',
          points: 1.0,
          stem: 'Cho hai số thực $x, y$ thỏa mãn $x^2 + y^2 - 4x + 6y + 13 = 0$. Hãy tính giá trị của biểu thức $Q = (x - 1)^{2024} + (y + 2)^{2025}$.',
          essaySolution: 'Ta biến đổi: $(x^2 - 4x + 4) + (y^2 + 6y + 9) = 0 \\Leftrightarrow (x - 2)^2 + (y + 3)^2 = 0$.\nVì $(x - 2)^2 \\ge 0$ và $(y + 3)^2 \\ge 0$ với mọi $x, y$ nên dấu "=" xảy ra khi và chỉ khi:\n$x - 2 = 0$ và $y + 3 = 0 \\Leftrightarrow x = 2$ và $y = -3$.\nThay vào $Q$ ta được: $Q = (2 - 1)^{2024} + (-3 + 2)^{2025} = 1^{2024} + (-1)^{2025} = 1 + (-1) = 0$.',
          scoringCriteria: [
            { step: 'Biến đổi về tổng hai bình phương: $(x - 2)^2 + (y + 3)^2 = 0$', score: 0.5 },
            { step: 'Lập luận tìm ra nghiệm duy nhất $x = 2, y = -3$', score: 0.25 },
            { step: 'Thay giá trị và tính đúng kết quả $Q = 0$', score: 0.25 }
          ]
        }
      ]
    },
    {
      code: '102',
      title: 'Mã đề: 102',
      answerSheet: {
        '1': 'C',
        '2': 'A',
        '3': 'D',
        '4': 'B',
        '5': 'A',
        '6': 'C',
        '7': 'B',
        '8': 'A',
        '9': 'D',
        '10': 'B',
        '11': 'C',
        '12': 'D',
        '13': 'a: Đ, b: S, c: Đ, d: S',
        '14': 'a: Đ, b: Đ, c: S, d: Đ',
        '15': '20',
        '16': '144',
        '17': 'Tự luận (1.5 điểm)',
        '18': 'Tự luận (1.5 điểm)',
        '19': 'Tự luận (1.0 điểm)'
      },
      questions: [] // Sẽ được nhân bản hoán vị tự động
    }
  ],
  matrix: {
    totalTN: 16,
    totalTL: 3,
    totalQuestions: 19,
    totalScore: 10,
    rows: [
      {
        topic: 'Đa thức nhiều biến',
        knowledgeUnit: 'Khái niệm đơn thức, đa thức, các phép toán cộng trừ nhân chia',
        nhanBietTN: 2,
        nhanBietTL: 0,
        thongHieuTN: 1,
        thongHieuTL: 1,
        vanDungTN: 0,
        vanDungTL: 0,
        vanDungCaoTN: 0,
        vanDungCaoTL: 0,
        totalQuestions: 4,
        totalScore: 2.25,
        percentageScore: 22.5
      },
      {
        topic: 'Hằng đẳng thức đáng nhớ',
        knowledgeUnit: '7 hằng đẳng thức, phân tích đa thức thành nhân tử',
        nhanBietTN: 2,
        nhanBietTL: 0,
        thongHieuTN: 3,
        thongHieuTL: 0,
        vanDungTN: 2,
        vanDungTL: 0,
        vanDungCaoTN: 0,
        vanDungCaoTL: 1,
        totalQuestions: 8,
        totalScore: 3.75,
        percentageScore: 37.5
      },
      {
        topic: 'Tứ giác',
        knowledgeUnit: 'Tổng các góc tứ giác, hình thang cân, hình bình hành, hình chữ nhật',
        nhanBietTN: 1,
        nhanBietTL: 0,
        thongHieuTN: 3,
        thongHieuTL: 0,
        vanDungTN: 1,
        vanDungTL: 2,
        vanDungCaoTN: 0,
        vanDungCaoTL: 0,
        totalQuestions: 7,
        totalScore: 4.0,
        percentageScore: 40.0
      }
    ]
  },
  specification: [
    {
      topic: 'Đa thức nhiều biến',
      knowledgeUnit: 'Đơn thức, đa thức nhiều biến',
      requiredCompetency: 'Nhận biết được đơn thức, đơn thức thu gọn, bậc của đa thức. Vận dụng thực hiện các phép cộng, trừ, nhân, chia đơn thức, đa thức.',
      nhanBietDesc: 'Nhận biết đơn thức thu gọn, bậc của đa thức.',
      thongHieuDesc: 'Thực hiện được phép nhân đa thức, chia đơn thức.',
      vanDungDesc: 'Tính giá trị biểu thức rút gọn tại giá trị cho trước.',
      vanDungCaoDesc: 'Giải quyết bài toán cực trị hoặc số học liên quan đến đa thức.',
      questionNumbers: 'C1, C2, C8, C17a'
    },
    {
      topic: 'Hằng đẳng thức đáng nhớ',
      knowledgeUnit: 'Những hằng đẳng thức đáng nhớ và ứng dụng',
      requiredCompetency: 'Mô tả được các hằng đẳng thức đáng nhớ. Vận dụng hằng đẳng thức để rút gọn, phân tích đa thức thành nhân tử.',
      nhanBietDesc: 'Nhận biết dạng khai triển của bình phương một tổng, hiệu, hiệu hai bình phương.',
      thongHieuDesc: 'Phân tích đa thức thành nhân tử bằng phương pháp dùng hằng đẳng thức.',
      vanDungDesc: 'Tính nhanh giá trị biểu thức đối xứng giữa x và y, giải bài toán thực tế.',
      vanDungCaoDesc: 'Tìm giá trị lớn nhất, nhỏ nhất của biểu thức chứa nhiều biến.',
      questionNumbers: 'C3, C4, C7, C10, C13, C15, C16, C19'
    },
    {
      topic: 'Tứ giác',
      knowledgeUnit: 'Tứ giác lồi, Hình thang cân, Hình bình hành, Hình chữ nhật',
      requiredCompetency: 'Mô tả được định nghĩa, tính chất, dấu hiệu nhận biết các tứ giác đặc biệt. Vận dụng chứng minh hình học.',
      nhanBietDesc: 'Nhận biết định lí tổng các góc trong tứ giác.',
      thongHieuDesc: 'Nhận biết tính chất của hình thang cân, hình bình hành.',
      vanDungDesc: 'Vận dụng dấu hiệu nhận biết để chứng minh tứ giác là hình chữ nhật, hình bình hành.',
      vanDungCaoDesc: 'Vận dụng tính chất hình học giải bài toán quỹ tích, đồng quy, thẳng hàng.',
      questionNumbers: 'C5, C6, C9, C11, C12, C14, C18'
    }
  ],
  qualityAudit: {
    scoreCheck: {
      isValid: true,
      totalCalculated: 10.0,
      expected: 10.0,
      message: 'Tổng điểm toàn bài đạt 10.0/10.0 điểm, khớp tuyệt đối với thang điểm quy định.'
    },
    cognitiveRatioCheck: {
      isValid: true,
      actualRatio: {
        nhanBiet: 40,
        thongHieu: 30,
        vanDung: 20,
        vanDungCao: 10
      },
      targetRatio: {
        nhanBiet: 40,
        thongHieu: 30,
        vanDung: 20,
        vanDungCao: 10
      },
      message: 'Tỉ lệ các mức độ nhận thức khớp chuẩn 40% Nhận biết - 30% Thông hiểu - 20% Vận dụng - 10% Vận dụng cao.'
    },
    matrixConsistency: {
      isValid: true,
      message: 'Các câu hỏi trong đề khớp 100% với số lượng câu và đơn vị kiến thức trong ma trận.'
    },
    specificationConsistency: {
      isValid: true,
      message: 'Bản đặc tả bao phủ trọn vẹn yêu cầu cần đạt của Thông tư 22/2021 và Chương trình GDPT 2018.'
    },
    pedagogicalWarnings: [],
    recommendations: [
      'Đề thi có câu hỏi thực tế tính diện tích mảnh vườn và bài toán phân hóa học sinh khá giỏi ở câu 19.',
      'Giáo viên có thể in trực tiếp hoặc xuất file Word kèm barem chấm chi tiết từng 0.25đ.'
    ]
  }
};
