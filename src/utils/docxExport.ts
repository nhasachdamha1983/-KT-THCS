import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Packer,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { GeneratedExamPackage, QuestionItem } from '../types/exam';

const FONT_FAMILY = 'Times New Roman';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Xuất Đề thi cho học sinh
export async function exportStudentExamDocx(exam: GeneratedExamPackage, variantCode?: string) {
  const meta = exam.metadata;
  const activeVariant = exam.variants.find(v => v.code === (variantCode || exam.currentVariantCode)) || exam.variants[0];
  const questions = activeVariant?.questions || [];

  // Tạo header bảng thông tin trường & đề thi
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: meta.schoolName.toUpperCase(), bold: true, font: FONT_FAMILY, size: 24 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: meta.departmentName.toUpperCase(), bold: true, font: FONT_FAMILY, size: 22 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '-----------------------', font: FONT_FAMILY, size: 20 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `MÃ ĐỀ THI: ${activeVariant.code}`, bold: true, font: FONT_FAMILY, size: 24 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: exam.examTitle.toUpperCase(), bold: true, font: FONT_FAMILY, size: 26 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `MÔN: ${meta.subject.toUpperCase()} - LỚP ${meta.grade}`, bold: true, font: FONT_FAMILY, size: 24 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Năm học: ${meta.schoolYear}`, italics: true, font: FONT_FAMILY, size: 22 }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Thời gian làm bài: ${exam.timeLimit} phút (không kể thời gian phát đề)`, italics: true, font: FONT_FAMILY, size: 22 }),
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Bảng thông tin học sinh & điểm số
  const studentInfoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Họ và tên học sinh: ..............................................................................', font: FONT_FAMILY, size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Lớp: ......................... Số báo danh (SBD): ............................................', font: FONT_FAMILY, size: 24 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'ĐIỂM SỐ', bold: true, font: FONT_FAMILY, size: 22 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'LỜI PHÊ CỦA THẦY / CÔ', bold: true, font: FONT_FAMILY, size: 20 }),
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Phân chia các phần câu hỏi
  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  const tfQuestions = questions.filter(q => q.type === 'true_false');
  const saQuestions = questions.filter(q => q.type === 'short_answer');
  const essayQuestions = questions.filter(q => q.type === 'essay' || q.type === 'practical_task');

  const contentParagraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: '' })] }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: `* Hướng dẫn làm bài: ${exam.instructions}`, italics: true, font: FONT_FAMILY, size: 22 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: `* Chuẩn MathType: Nhấn Ctrl + A rồi bấm phím tắt Alt + \\ trong Microsoft Word để chuyển đổi toàn bộ công thức $...$ thành đối tượng MathType chuẩn.`, italics: true, color: '555555', font: FONT_FAMILY, size: 18 }),
      ]
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] })
  ];

  // Phần I: Trắc nghiệm nhiều lựa chọn
  if (mcQuestions.length > 0) {
    const totalMCScore = mcQuestions.reduce((acc, cur) => acc + cur.points, 0);
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN (${totalMCScore.toFixed(2).replace('.00', '')} điểm)`,
            bold: true,
            font: FONT_FAMILY,
            size: 24,
          }),
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trả lời từ câu 1 đến câu ' + mcQuestions.length + '. Mỗi câu hỏi chỉ chọn một phương án trả lời đúng nhất.',
            italics: true,
            font: FONT_FAMILY,
            size: 22
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: '' })] })
    );

    mcQuestions.forEach((q) => {
      contentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.stem, font: FONT_FAMILY, size: 24 })
          ]
        })
      );

      if (q.contextData) {
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: q.contextData, italics: true, font: FONT_FAMILY, size: 22 })
            ]
          })
        );
      }

      if (q.options && q.options.length > 0) {
        // Trình bày 4 phương án
        q.options.forEach(opt => {
          contentParagraphs.push(
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${opt.key}. `, bold: true, font: FONT_FAMILY, size: 24 }),
                new TextRun({ text: opt.content, font: FONT_FAMILY, size: 24 })
              ]
            })
          );
        });
      }
      contentParagraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  // Phần II: Trắc nghiệm Đúng / Sai
  if (tfQuestions.length > 0) {
    const totalTFScore = tfQuestions.reduce((acc, cur) => acc + cur.points, 0);
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI (${totalTFScore.toFixed(2).replace('.00', '')} điểm)`,
            bold: true,
            font: FONT_FAMILY,
            size: 24
          }),
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trả lời từng ý a, b, c, d của mỗi câu. Ghi Đúng (Đ) hoặc Sai (S).',
            italics: true,
            font: FONT_FAMILY,
            size: 22
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: '' })] })
    );

    tfQuestions.forEach((q) => {
      contentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.stem, font: FONT_FAMILY, size: 24 })
          ]
        })
      );

      if (q.subItems && q.subItems.length > 0) {
        q.subItems.forEach(sub => {
          contentParagraphs.push(
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${sub.key}) `, bold: true, font: FONT_FAMILY, size: 24 }),
                new TextRun({ text: sub.statement, font: FONT_FAMILY, size: 24 })
              ]
            })
          );
        });
      }
      contentParagraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  // Phần III: Trả lời ngắn
  if (saQuestions.length > 0) {
    const totalSAScore = saQuestions.reduce((acc, cur) => acc + cur.points, 0);
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN (${totalSAScore.toFixed(2).replace('.00', '')} điểm)`,
            bold: true,
            font: FONT_FAMILY,
            size: 24
          }),
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh điền kết quả hoặc đáp số trực tiếp vào phần trả lời.',
            italics: true,
            font: FONT_FAMILY,
            size: 22
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: '' })] })
    );

    saQuestions.forEach((q) => {
      contentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.stem, font: FONT_FAMILY, size: 24 })
          ]
        }),
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({ text: 'Đáp số: .................................................................................', font: FONT_FAMILY, size: 24, italics: true })
          ]
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] })
      );
    });
  }

  // Phần IV: Tự luận / Thực hành
  if (essayQuestions.length > 0) {
    const totalEssayScore = essayQuestions.reduce((acc, cur) => acc + cur.points, 0);
    contentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `PHẦN IV. TỰ LUẬN (${totalEssayScore.toFixed(2).replace('.00', '')} điểm)`,
            bold: true,
            font: FONT_FAMILY,
            size: 24
          }),
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Thí sinh trình bày bài làm chi tiết trên giấy thi.',
            italics: true,
            font: FONT_FAMILY,
            size: 22
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: '' })] })
    );

    essayQuestions.forEach((q) => {
      contentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.stem, font: FONT_FAMILY, size: 24 })
          ]
        })
      );
      if (q.contextData) {
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: q.contextData, italics: true, font: FONT_FAMILY, size: 22 })
            ]
          })
        );
      }
      contentParagraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  // Footer kết thúc đề
  contentParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '----------------------- HẾT -----------------------', bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '(Cán bộ coi thi không giải thích gì thêm)', italics: true, font: FONT_FAMILY, size: 20 }),
      ]
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134,
              left: 1701, // ~3cm
              right: 1134, // ~2cm
            }
          }
        },
        children: [
          headerTable,
          new Paragraph({ children: [new TextRun({ text: '' })] }),
          studentInfoTable,
          ...contentParagraphs
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = meta.subject.replace(/[^a-zA-Z0-9]/g, '_');
  saveBlob(blob, `De_kiem_tra_${cleanName}_Lop${meta.grade}_Ma${activeVariant.code}.docx`);
}

// 2. Xuất Đáp án và Hướng dẫn chấm
export async function exportAnswerKeyDocx(exam: GeneratedExamPackage, variantCode?: string) {
  const meta = exam.metadata;
  const activeVariant = exam.variants.find(v => v.code === (variantCode || exam.currentVariantCode)) || exam.variants[0];
  const questions = activeVariant?.questions || [];

  const paragraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: meta.schoolName.toUpperCase(), bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT`, bold: true, font: FONT_FAMILY, size: 28 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `${exam.examTitle.toUpperCase()} - MÔN: ${meta.subject.toUpperCase()} LỚP ${meta.grade} (MÃ ĐỀ: ${activeVariant.code})`, bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `* Công thức toán học định dạng chuẩn MathType / TeX ($...). Bấm Alt + \\ trong Word để chuyển thành MathType.`, italics: true, color: '666666', font: FONT_FAMILY, size: 20 }),
      ]
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] })
  ];

  // Bảng đáp án trắc nghiệm nhiều lựa chọn
  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  if (mcQuestions.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PHẦN I. ĐÁP ÁN TRẮC NGHIỆM NHIỀU LỰA CHỌN', bold: true, font: FONT_FAMILY, size: 24 }),
        ]
      })
    );

    // Xây dựng bảng đáp án: Câu | Đáp án | Điểm
    const mcRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Đáp án đúng', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Điểm', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ghi chú / Giải thích vắn tắt', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
        ]
      })
    ];

    mcQuestions.forEach(q => {
      mcRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.number}`, font: FONT_FAMILY, size: 22 })] })] }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.correctAnswer || ''}`, bold: true, font: FONT_FAMILY, size: 24 })] })] }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${q.points}`, font: FONT_FAMILY, size: 22 })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${q.notes || ''}`, font: FONT_FAMILY, size: 20 })] })] }),
          ]
        })
      );
    });

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: mcRows
      }),
      new Paragraph({ children: [new TextRun({ text: '' })] })
    );
  }

  // Phần II: Đúng Sai
  const tfQuestions = questions.filter(q => q.type === 'true_false');
  if (tfQuestions.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PHẦN II. ĐÁP ÁN TRẮC NGHIỆM ĐÚNG / SAI', bold: true, font: FONT_FAMILY, size: 24 }),
        ]
      })
    );

    tfQuestions.forEach(q => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.stem, font: FONT_FAMILY, size: 22 })
          ]
        })
      );

      if (q.subItems) {
        q.subItems.forEach(sub => {
          paragraphs.push(
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${sub.key}) `, bold: true, font: FONT_FAMILY, size: 22 }),
                new TextRun({ text: `${sub.statement} => `, font: FONT_FAMILY, size: 22 }),
                new TextRun({ text: sub.isCorrect ? 'ĐÚNG' : 'SAI', bold: true, color: sub.isCorrect ? '008000' : 'C00000', font: FONT_FAMILY, size: 22 }),
                new TextRun({ text: sub.explanation ? ` (${sub.explanation})` : '', italics: true, font: FONT_FAMILY, size: 20 })
              ]
            })
          );
        });
      }
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  // Phần III: Trả lời ngắn
  const saQuestions = questions.filter(q => q.type === 'short_answer');
  if (saQuestions.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PHẦN III. ĐÁP ÁN TRẮC NGHIỆM TRẢ LỜI NGẮN', bold: true, font: FONT_FAMILY, size: 24 }),
        ]
      })
    );

    saQuestions.forEach(q => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: `Đáp án: `, font: FONT_FAMILY, size: 22 }),
            new TextRun({ text: `${q.correctAnswer || ''}`, bold: true, font: FONT_FAMILY, size: 24 }),
            new TextRun({ text: q.essaySolution ? ` - Hướng dẫn: ${q.essaySolution}` : '', font: FONT_FAMILY, size: 20 })
          ]
        })
      );
    });
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
  }

  // Phần IV: Hướng dẫn chấm tự luận
  const essayQuestions = questions.filter(q => q.type === 'essay' || q.type === 'practical_task');
  if (essayQuestions.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'PHẦN IV. HƯỚNG DẪN CHẤM TỰ LUẬN VÀ BIỂU ĐIỂM CHI TIẾT', bold: true, font: FONT_FAMILY, size: 24 }),
        ]
      })
    );

    essayQuestions.forEach(q => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${q.number} (${q.points} điểm):`, bold: true, font: FONT_FAMILY, size: 24 }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Đề bài: ${q.stem}`, italics: true, font: FONT_FAMILY, size: 22 })
          ]
        })
      );

      if (q.essaySolution) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Lời giải chi tiết / Hướng dẫn giải:', bold: true, font: FONT_FAMILY, size: 22 })
            ]
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: q.essaySolution, font: FONT_FAMILY, size: 22 })
            ]
          })
        );
      }

      if (q.scoringCriteria && q.scoringCriteria.length > 0) {
        const criteriaRows: TableRow[] = [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nội dung / Các bước yêu cầu', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Điểm', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Phương án tương đương chấp nhận', bold: true, font: FONT_FAMILY, size: 22 })] })] }),
            ]
          })
        ];

        q.scoringCriteria.forEach(c => {
          criteriaRows.push(
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c.step, font: FONT_FAMILY, size: 22 })] })] }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${c.score}`, font: FONT_FAMILY, size: 22 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (c.acceptableEquivalents || []).join('; ') || 'Cách làm hợp lý khác được tính trọn điểm', font: FONT_FAMILY, size: 20 })] })] }),
              ]
            })
          );
        });

        paragraphs.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: criteriaRows
          })
        );
      }
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  // Rubric nếu có
  if (exam.rubric && exam.rubric.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRIC THỰC HÀNH / NĂNG LỰC)', bold: true, font: FONT_FAMILY, size: 24 }),
        ]
      })
    );

    exam.rubric.forEach(r => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Tiêu chí: ${r.name} (Tối đa ${r.maxScore} điểm)`, bold: true, font: FONT_FAMILY, size: 22 })
          ]
        })
      );
      r.levels.forEach(lvl => {
        paragraphs.push(
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: `• ${lvl.level} (${lvl.scoreRange}): `, bold: true, font: FONT_FAMILY, size: 20 }),
              new TextRun({ text: lvl.description, font: FONT_FAMILY, size: 20 })
            ]
          })
        );
      });
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 }
          }
        },
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = meta.subject.replace(/[^a-zA-Z0-9]/g, '_');
  saveBlob(blob, `Dap_an_Huong_dan_cham_${cleanName}_Lop${meta.grade}_Ma${activeVariant.code}.docx`);
}

// 3. Xuất Ma trận và Bản đặc tả đề kiểm tra
export async function exportMatrixAndSpecDocx(exam: GeneratedExamPackage) {
  const meta = exam.metadata;

  const paragraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: meta.schoolName.toUpperCase(), bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `MA TRẬN VÀ BẢN ĐẶC TẢ ĐỀ KIỂM TRA`, bold: true, font: FONT_FAMILY, size: 28 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `MÔN: ${meta.subject.toUpperCase()} - LỚP ${meta.grade} (GDPT 2018)`, bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Bộ sách: ${meta.textbook} | Thời gian làm bài: ${exam.timeLimit} phút`, italics: true, font: FONT_FAMILY, size: 22 }),
      ]
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] }),
    new Paragraph({
      children: [
        new TextRun({ text: 'A. MA TRẬN ĐỀ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ', bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    })
  ];

  // Bảng Ma trận
  const matrixRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề / Mạch kiến thức', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Đơn vị kiến thức', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Nhận biết\n(TN/TL)', bold: true, font: FONT_FAMILY, size: 18 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Thông hiểu\n(TN/TL)', bold: true, font: FONT_FAMILY, size: 18 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vận dụng\n(TN/TL)', bold: true, font: FONT_FAMILY, size: 18 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Vận dụng cao\n(TN/TL)', bold: true, font: FONT_FAMILY, size: 18 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng số câu', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng điểm', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tỉ lệ %', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
      ]
    })
  ];

  exam.matrix.rows.forEach(r => {
    matrixRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: r.topic, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: r.knowledgeUnit, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.nhanBietTN}/${r.nhanBietTL}`, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.thongHieuTN}/${r.thongHieuTL}`, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.vanDungTN}/${r.vanDungTL}`, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.vanDungCaoTN}/${r.vanDungCaoTL}`, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.totalQuestions}`, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.totalScore}`, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${r.percentageScore}%`, font: FONT_FAMILY, size: 20 })] })] }),
        ]
      })
    );
  });

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: matrixRows
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] }),
    new Paragraph({
      children: [
        new TextRun({ text: 'B. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ', bold: true, font: FONT_FAMILY, size: 24 }),
      ]
    })
  );

  // Bảng Bản đặc tả
  const specRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Chủ đề', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Yêu cầu cần đạt chuẩn GDPT 2018', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mức độ nhận thức chi tiết', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Câu hỏi trong đề', bold: true, font: FONT_FAMILY, size: 20 })] })] }),
      ]
    })
  ];

  exam.specification.forEach(s => {
    const descContent = `• Nhận biết: ${s.nhanBietDesc}\n• Thông hiểu: ${s.thongHieuDesc}\n• Vận dụng: ${s.vanDungDesc}\n• Vận dụng cao: ${s.vanDungCaoDesc}`;
    specRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${s.topic}\n(${s.knowledgeUnit})`, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.requiredCompetency, font: FONT_FAMILY, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: descContent, font: FONT_FAMILY, size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.questionNumbers, bold: true, font: FONT_FAMILY, size: 20 })] })] }),
        ]
      })
    );
  });

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: specRows
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 }
          }
        },
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = meta.subject.replace(/[^a-zA-Z0-9]/g, '_');
  saveBlob(blob, `Ma_tran_Ban_dac_ta_${cleanName}_Lop${meta.grade}.docx`);
}
