import { SubjectConfig } from '../types/exam';

export const INITIAL_SUBJECTS: SubjectConfig[] = [
  {
    id: 'toan',
    name: 'Toán',
    category: 'natural_sciences',
    defaultTime: 90,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Số tự nhiên và các phép tính (Tập hợp, ước và bội, số nguyên tố)',
        'Số nguyên (Số nguyên âm, cộng trừ nhân chia số nguyên)',
        'Hình học trực quan (Hình tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi)',
        'Tính chia hết và dấu hiệu chia hết',
        'Phân số và số thập phân',
        'Một số yếu tố xác suất và thống kê (Thu thập dữ liệu, biểu đồ tranh, biểu đồ cột)'
      ],
      7: [
        'Số hữu tỉ và các phép toán',
        'Số thực (Căn bậc hai số học, số vô tỉ)',
        'Góc và đường thẳng song song',
        'Tam giác bằng nhau (c-c-c, c-g-c, g-c-g)',
        'Thu thập và phân loại dữ liệu, biểu đồ đoạn thẳng, hình quạt tròn',
        'Biểu thức đại số và đa thức một biến'
      ],
      8: [
        'Đa thức nhiều biến và hằng đẳng thức đáng nhớ',
        'Phân thức đại số và các phép tính',
        'Tứ giác (Hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông)',
        'Định lí Thalès trong tam giác',
        'Thu thập, tổ chức và phân tích dữ liệu',
        'Hàm số bậc nhất và đồ thị y = ax + b'
      ],
      9: [
        'Phương trình và hệ phương trình bậc nhất hai ẩn',
        'Phương trình bậc hai một ẩn và định lí Viète',
        'Hệ thức lượng trong tam giác vuông và tỉ số lượng giác',
        'Đường tròn (Vị trí tương đối, tiếp tuyến, góc nội tiếp, tứ giác nội tiếp)',
        'Một số yếu tố xác suất cổ điển',
        'Hình học không gian (Hình trụ, hình nón, hình cầu)'
      ]
    }
  },
  {
    id: 'van',
    name: 'Ngữ văn',
    category: 'languages',
    defaultTime: 90,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Thơ lục bát và bài thơ có yếu tố tự sự, miêu tả',
        'Truyện đồng thoại, truyện cổ tích, truyền thuyết',
        'Văn bản nghị luận (nghị luận xã hội, nghị luận văn học)',
        'Văn bản thông tin (thuật lại một sự kiện)',
        'Thực hành tiếng Việt: Từ đơn, từ phức, biện pháp tu từ so sánh, nhân hóa, ẩn dụ'
      ],
      7: [
        'Thơ bốn chữ, năm chữ; Thơ lục bát',
        'Truyện ngắn, tiểu thuyết hiện đại (nhân vật, ngôi kể, cốt truyện)',
        'Văn bản nghị luận và cách trình bày luận điểm, dẫn chứng',
        'Văn bản thông tin (giới thiệu một quy tắc hoặc luật lệ trong hoạt động)',
        'Thực hành tiếng Việt: Mở rộng vị ngữ, từ Hán Việt, dấu câu, liên kết câu'
      ],
      8: [
        'Thơ sáu chữ, bảy chữ; Thơ Đường luật',
        'Truyện lịch sử, truyện cười, truyện ngắn hiện thực',
        'Văn nghị luận xã hội và văn nghị luận văn học',
        'Văn bản thông tin thuyết minh giải thích một hiện tượng tự nhiên',
        'Thực hành tiếng Việt: Đoạn văn diễn dịch, quy nạp; từ ngữ toàn dân và từ ngữ địa phương'
      ],
      9: [
        'Thơ tự do, thơ tám chữ hiện đại',
        'Truyện thơ Nôm, truyện truyền kì, kịch bản văn học',
        'Nghị luận về một vấn đề đời sống và nghị luận về một tác phẩm văn học',
        'Văn bản thông tin thuyết minh về một danh lam thắng cảnh / di tích lịch sử',
        'Thực hành tiếng Việt: Khởi ngữ, thành phần biệt lập, các phép liên kết, biến đổi câu'
      ]
    }
  },
  {
    id: 'tieng-anh',
    name: 'Tiếng Anh',
    category: 'languages',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Unit 1-3: My New School, My Home, My Friends (Present Simple, Present Continuous)',
        'Unit 4-6: My Neighbourhood, Natural Wonders of Viet Nam, Our Tet Holiday (Comparatives, Modal verbs)',
        'Reading comprehension & Everyday English conversation',
        'Sentence transformation & Guided paragraph writing'
      ],
      7: [
        'Unit 1-3: Hobbies, Healthy Living, Community Service (Past Simple, Imperatives)',
        'Unit 4-6: Music and Arts, Food and Drink, A Visit to a School (Comparisons: like/different from, countable/uncountable)',
        'Listening & Reading skills with contextual vocabulary',
        'Writing informal letters / short email messages'
      ],
      8: [
        'Unit 1-3: Life in the countryside, Our habits, Community & Teens (Verbs of liking/disliking, Comparative adverbs)',
        'Unit 4-6: Ethnic groups of Viet Nam, Our customs and traditions, Lifestyles (Articles, Simple and Compound sentences)',
        'Reading: Skimming & Scanning informational passages',
        'Writing: Describing graphs or lifestyle reflections'
      ],
      9: [
        'Unit 1-3: Local environment, City life, Teen stress and cognitive skills (Complex sentences with adverb clauses, phrasal verbs)',
        'Unit 4-6: Life in the past, Wonders of Viet Nam, Viet Nam: Then and now (Used to, Reported speech, Passive voice)',
        'Reading: Multiple choice comprehension & Cloze test (gap fill)',
        'Writing: Opinion essay & Formal letter of enquiry'
      ]
    }
  },
  {
    id: 'khtn',
    name: 'Khoa học tự nhiên',
    category: 'natural_sciences',
    defaultTime: 60,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Mở đầu: Giới thiệu về KHTN, dụng cụ đo lường và an toàn phòng thí nghiệm',
        'Chất và sự biến đổi của chất (Các thể của chất, oxygen và không khí, một số vật liệu, nhiên liệu, nguyên liệu)',
        'Tế bào - Đơn vị cơ bản của sự sống (Cấu tạo và chức năng tế bào, phân chia tế bào)',
        'Từ tế bào đến cơ thể (Tế bào, mô, cơ quan, hệ cơ quan, cơ thể)',
        'Đa dạng thế giới sống (Phân loại sinh vật, vi khuẩn, virus, nấm, thực vật, động vật)',
        'Lực và chuyển động (Lực tiếp xúc, lực không tiếp xúc, lực ma sát, khối lượng và trọng lượng)',
        'Năng lượng và sự truyền nhiệt'
      ],
      7: [
        'Nguyên tử, nguyên tố hóa học và bảng tuần hoàn các nguyên tố hóa học',
        'Phân tử, liên kết hóa học (liên kết ion, liên kết cộng hóa trị)',
        'Tốc độ chuyển động và đồ thị quãng đường - thời gian',
        'Âm thanh: Nguồn âm, độ cao, độ to của âm, phản xạ âm',
        'Ánh sáng: Sự truyền ánh sáng, định luật phản xạ ánh sáng, ảnh tạo bởi gương phẳng',
        'Trao đổi chất và chuyển hóa năng lượng ở sinh vật (Quang hợp, hô hấp tế bào, trao đổi nước và dinh dưỡng)'
      ],
      8: [
        'Phản ứng hóa học, định luật bảo toàn khối lượng và mol',
        'Dung dịch và nồng độ dung dịch (nồng độ phần trăm, nồng độ mol)',
        'Acid - Base - Oxide - Muối và thang pH',
        'Khối lượng riêng và áp suất (áp suất chất lỏng, áp suất khí quyển, lực đẩy Archimedes)',
        'Tác dụng làm quay của lực (đòn bẩy, mômen lực)',
        'Điện: Sự nhiễm điện, mạch điện đơn giản, tác dụng của dòng điện',
        'Cơ thể người: Hệ vận động, hệ tiêu hóa, hệ tuần hoàn, hệ hô hấp'
      ],
      9: [
        'Kim loại và phi kim (Dãy hoạt động hóa học, tính chất hóa học)',
        'Hợp chất hữu cơ: Alkane, Alkene, Alcohol, Acetic acid, Lipid, Carbohydrate',
        'Năng lượng cơ học (Cơ năng, động năng, thế năng, bảo toàn cơ năng)',
        'Ánh sáng: Khúc xạ ánh sáng, thấu kính hội tụ, thấu kính phân kì, mắt và kính lúp',
        'Di truyền học: Menđen và di truyền học, NST, ADN, ARN và đột biến',
        'Tiến hóa và sinh thái học (Quần thể, quần xã, hệ sinh thái, sinh quyển)'
      ]
    }
  },
  {
    id: 'su-dia',
    name: 'Lịch sử và Địa lí',
    category: 'social_sciences',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Phần Lịch sử: Xã hội nguyên thủy, Các quốc gia cổ đại phương Đông và phương Tây, Đất nước thời Văn Lang - Âu Lạc',
        'Phần Địa lí: Bản đồ và cách sử dụng bản đồ, Trái Đất trong hệ Mặt Trời, Các thành phần tự nhiên (Khí quyển, thủy quyển, thạch quyển)'
      ],
      7: [
        'Phần Lịch sử: Tây Âu thời kì Trung đại, Lịch sử Việt Nam thời Đinh - Tiền Lê - Lý - Trần',
        'Phần Địa lí: Đặc điểm tự nhiên, dân cư và kinh tế các châu lục (Châu Âu, Châu Á, Châu Phi)'
      ],
      8: [
        'Phần Lịch sử: Các cuộc cách mạng tư sản thời cận đại, Phong trào công nhân quốc tế, Khởi nghĩa Tây Sơn và phong trào Cần Vương',
        'Phần Địa lí: Địa lí tự nhiên Việt Nam (Địa hình, khoáng sản, khí hậu, sông ngòi, thổ nhưỡng, sinh vật)'
      ],
      9: [
        'Phần Lịch sử: Thế giới từ sau CTTG II đến nay, Lịch sử Việt Nam từ 1919 đến nay (Cách mạng Tháng Tám, các cuộc kháng chiến vệ quốc)',
        'Phần Địa lí: Địa lí kinh tế - xã hội Việt Nam (Dân cư, nông nghiệp, công nghiệp, dịch vụ và các vùng kinh tế trọng điểm)'
      ]
    }
  },
  {
    id: 'gdcd',
    name: 'Giáo dục công dân',
    category: 'social_sciences',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Tự hào về truyền thống gia đình, dòng họ',
        'Yêu thương con người, Siêng năng kiên trì, Tiết kiệm',
        'Tự nhận thức bản thân, Ứng phó với các tình huống nguy hiểm',
        'Công dân nước CHXHCN Việt Nam, Quyền và nghĩa vụ cơ bản của công dân'
      ],
      7: [
        'Tự hào về di sản văn hóa Việt Nam',
        'Quan tâm, cảm thông và chia sẻ; Học tập tự giác, tích cực',
        'Giữ chữ tín, Quản lí tiền bạc',
        'Phòng chống bạo lực học đường, Phòng chống tệ nạn xã hội'
      ],
      8: [
        'Tự hào về truyền thống dân tộc Việt Nam',
        'Tôn trọng sự đa dạng của các dân tộc; Lao động cần cù, sáng tạo',
        'Bảo vệ môi trường và tài nguyên thiên nhiên',
        'Xác định mục tiêu cá nhân, Phòng chống bạo lực gia đình',
        'Quyền và nghĩa vụ của công dân về sở hữu tài sản và nghĩa vụ tôn trọng tài sản của người khác'
      ],
      9: [
        'Sống có lí tưởng, Tự chủ trong cuộc sống',
        'Bảo vệ hòa bình, Hữu nghị giữa các dân tộc trên thế giới',
        'Kế thừa và phát huy truyền thống tốt đẹp của dân tộc',
        'Dân chủ và kỉ luật; Pháp luật và kỉ luật trong xã hội',
        'Quyền và nghĩa vụ của công dân trong hôn nhân và gia đình; Quyền tự do kinh doanh'
      ]
    }
  },
  {
    id: 'tin-hoc',
    name: 'Tin học',
    category: 'technology',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Chủ đề A: Máy tính và cộng đồng (Thông tin và dữ liệu, biểu diễn thông tin trong máy tính)',
        'Chủ đề B: Mạng máy tính và Internet (Khái niệm mạng, tìm kiếm và chia sẻ thông tin)',
        'Chủ đề C: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin (Thư điện tử, quản lí tệp và thư mục)',
        'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số (Bản quyền, an toàn số)',
        'Chủ đề E: Ứng dụng tin học (Soạn thảo văn bản và sơ đồ tư duy cơ bản)',
        'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính (Thuật toán và sơ đồ khối)'
      ],
      7: [
        'Chủ đề A: Thiết bị vào - ra và phần mềm ứng dụng',
        'Chủ đề C: Phần mềm bảng tính (Nhập dữ liệu, công thức, hàm tính toán SUM, AVERAGE, MAX, MIN, IF)',
        'Chủ đề D: Ứng xử có văn hóa và an toàn trên mạng xã hội',
        'Chủ đề E: Tạo bài trình chiếu với hiệu ứng và đa phương tiện',
        'Chủ đề F: Thuật toán tìm kiếm tuần tự và thuật toán tìm kiếm nhị phân, sắp xếp'
      ],
      8: [
        'Chủ đề A: Lịch sử phát triển máy tính và các thế hệ máy tính',
        'Chủ đề C: Xử lý và lọc dữ liệu trong bảng tính, biểu đồ cột/tròn',
        'Chủ đề D: Bản quyền nội dung số, mặt trái của Internet và bảo vệ thông tin cá nhân',
        'Chủ đề F: Lập trình trực quan hoặc ngôn ngữ lập trình Python/Scratch (Biến, câu lệnh điều kiện if-else, vòng lặp)'
      ],
      9: [
        'Chủ đề A: Máy tính và dịch vụ số trong xã hội hiện đại (Điện toán đám mây, dữ liệu lớn, AI sơ lược)',
        'Chủ đề B: Mạng xã hội và truyền thông số có trách nhiệm',
        'Chủ đề E: Xây dựng trang web cơ bản (HTML/CSS) hoặc phần mềm thiết kế đồ họa / video',
        'Chủ đề F: Giải thuật và giải quyết bài toán với ngôn ngữ lập trình (Hàm, danh sách/mảng, bài toán thực tiễn)'
      ]
    }
  },
  {
    id: 'cong-nghe',
    name: 'Công nghệ',
    category: 'technology',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: [
        'Chương 1: Nhà ở và đời sống gia đình (Cấu trúc nhà ở, xây dựng nhà, ngôi nhà thông minh)',
        'Chương 2: Bảo quản và chế biến thực phẩm (Giá trị dinh dưỡng, vệ sinh an toàn thực phẩm)',
        'Chương 3: Trang phục và thời trang (Các loại vải, phong cách thời trang, sử dụng và bảo quản)',
        'Chương 4: Đồ dùng điện trong gia đình (Bàn là, nồi cơm điện, bếp hồng ngoại, an toàn điện)'
      ],
      7: [
        'Phần 1: Trồng trọt (Đất trồng, phân bón, kĩ thuật nhân giống, chăm sóc và phòng trừ sâu bệnh, công nghệ cao trong trồng trọt)',
        'Phần 2: Lâm nghiệp (Vai trò của rừng, trồng và chăm sóc rừng, bảo vệ rừng)',
        'Phần 3: Chăn nuôi (Giống vật nuôi, thức ăn, chuồng nuôi và biện pháp vệ sinh an toàn phòng dịch)',
        'Phần 4: Thủy sản (Môi trường nuôi thủy sản, kĩ thuật nuôi một số loài cá phổ biến)'
      ],
      8: [
        'Chương 1: Vẽ kĩ thuật (Tiêu chuẩn bản vẽ, hình chiếu vuông góc, bản vẽ chi tiết, bản vẽ lắp)',
        'Chương 2: Cơ khí (Vật liệu cơ khí, dụng cụ gia công cơ khí cầm tay, truyền và biến đổi chuyển động)',
        'Chương 3: Kĩ thuật điện (An toàn điện, sơ đồ mạch điện, thiết bị đóng cắt và bảo vệ mạch điện)'
      ],
      9: [
        'Định hướng nghề nghiệp kĩ thuật - công nghệ',
        'Lắp đặt mạng điện trong nhà (Dây dẫn, thiết bị đo lường, khí cụ điện, bảng điện nhánh)',
        'Nông nghiệp công nghệ cao và công nghệ sinh học nông nghiệp',
        'Lắp ráp mô hình robot hoặc thiết bị điều khiển tự động thông minh'
      ]
    }
  },
  {
    id: 'am-nhac',
    name: 'Âm nhạc',
    category: 'arts_physical',
    defaultTime: 45,
    typicalFormat: 'practical_rubric',
    hasRubricMode: true,
    defaultTopics: {
      6: ['Hát các bài hát tuổi học trò', 'Nhạc cụ tiết tấu và giai điệu', 'Lí thuyết âm nhạc (Kí hiệu nốt, khóa Sol, nhịp 2/4)', 'Thường thức âm nhạc (Dân ca các vùng miền, nhạc sĩ Việt Nam)'],
      7: ['Hát thể hiện đúng sắc thái và hơi thở', 'Đọc nhạc nhịp 3/4, 4/4', 'Nhạc cụ gõ và sáo Recorder / kèn Phím', 'Âm nhạc cổ điển phương Tây và âm nhạc truyền thống'],
      8: ['Hát đơn ca, song ca và bè', 'Lí thuyết âm nhạc: Dấu hóa, cung và nửa cung, giọng Đô trưởng và La thứ', 'Thường thức âm nhạc: Di sản văn hóa phi vật thể UNESCO'],
      9: ['Biểu diễn tác phẩm âm nhạc đa dạng', 'Lí thuyết: Gam, điệu thức, dịch giọng cơ bản', 'Cảm thụ âm nhạc và sáng tạo giai điệu ngắn']
    }
  },
  {
    id: 'mi-thuat',
    name: 'Mĩ thuật',
    category: 'arts_physical',
    defaultTime: 45,
    typicalFormat: 'practical_rubric',
    hasRubricMode: true,
    defaultTopics: {
      6: ['Mĩ thuật tạo hình: Vẽ tranh đề tài sinh hoạt, chân dung, phong cảnh', 'Mĩ thuật ứng dụng: Thiết kế thiệp chúc mừng, tạo họa tiết trang trí'],
      7: ['Mĩ thuật tạo hình: Vẽ tĩnh vật màu, luật xa gần, hình khối', 'Mĩ thuật ứng dụng: Thiết kế thời trang học đường, tạo hình từ vật liệu tái chế'],
      8: ['Mĩ thuật tạo hình: Điêu khắc tượng tròn hoặc phù điêu, tranh cổ động', 'Mĩ thuật ứng dụng: Thiết kế bao bì sản phẩm, tạo dáng công nghiệp'],
      9: ['Tác phẩm mĩ thuật tổng hợp thể hiện thông điệp xã hội', 'Thiết kế không gian trưng bày và truyền thông thị giác']
    }
  },
  {
    id: 'gdtc',
    name: 'Giáo dục thể chất',
    category: 'arts_physical',
    defaultTime: 45,
    typicalFormat: 'practical_rubric',
    hasRubricMode: true,
    defaultTopics: {
      6: ['Đội hình đội ngũ, bài tập thể dục phát triển chung', 'Chạy cự li ngắn (60m) và chạy cự li trung bình', 'Môn thể thao tự chọn (Bóng đá, Bóng rổ, Cầu lông hoặc Bơi lội)'],
      7: ['Kĩ thuật chạy tiếp sức, nhảy cao kiểu bước qua', 'Bài tập rèn luyện thể lực và sức bền', 'Kĩ thuật cơ bản môn thể thao tự chọn'],
      8: ['Kĩ thuật nhảy xa kiểu ngồi, chạy bền', 'Các bài tập phối hợp phát triển sức mạnh và sự khéo léo', 'Luật thi đấu và chiến thuật cơ bản môn thể thao'],
      9: ['Hoàn thiện kĩ thuật các môn điền kinh', 'Thi đấu giao hữu thể thao và đánh giá thể lực theo tiêu chuẩn của Bộ GD&ĐT']
    }
  },
  {
    id: 'hdtn',
    name: 'Hoạt động trải nghiệm, hướng nghiệp',
    category: 'experiential',
    defaultTime: 45,
    typicalFormat: 'practical_rubric',
    hasRubricMode: true,
    defaultTopics: {
      6: ['Khám phá bản thân và xây dựng tình bạn, tình thầy trò', 'Chăm sóc gia đình và rèn luyện thói quen ngăn nắp', 'Tham gia hoạt động thiện nguyện vì cộng đồng'],
      7: ['Quản lí cảm xúc bản thân và giải quyết bất đồng', 'Ứng phó với áp lực và quản lí thời gian', 'Tìm hiểu nghề truyền thống ở địa phương'],
      8: ['Xây dựng hình ảnh cá nhân và lòng tự trọng', 'Thực hiện kế hoạch chi tiêu hợp lí trong gia đình', 'Khảo sát nhu cầu thị trường lao động và nghề nghiệp tương lai'],
      9: ['Lập kế hoạch rèn luyện bản thân theo định hướng nghề nghiệp', 'Kĩ năng thích ứng với môi trường mới và chọn trường THPT phù hợp', 'Trách nhiệm với gia đình, nhà trường và xã hội']
    }
  },
  {
    id: 'dia-phuong',
    name: 'Nội dung giáo dục địa phương',
    category: 'experiential',
    defaultTime: 45,
    typicalFormat: 'combined',
    defaultTopics: {
      6: ['Địa lí tự nhiên địa phương và cảnh quan tiêu biểu', 'Lịch sử truyền thống đấu tranh kiên cường của quê hương', 'Phong tục tập quán và di sản văn hóa của tỉnh/thành phố'],
      7: ['Dân cư và sự phân bố dân cư tại địa phương', 'Các danh nhân văn hóa, lịch sử tiêu biểu của quê hương', 'Các làng nghề truyền thống và bảo tồn sản phẩm đặc trưng địa phương'],
      8: ['Kinh tế địa phương: Ngành kinh tế chủ lực và cơ hội việc làm', 'Công tác bảo vệ môi trường và ứng phó biến đổi khí hậu tại địa phương', 'Chính sách an sinh xã hội và nét đẹp văn hóa đời sống'],
      9: ['Quy hoạch phát triển kinh tế - xã hội địa phương giai đoạn mới', 'Đóng góp của tuổi trẻ vào công cuộc xây dựng và đổi mới quê hương', 'Bảo tồn và phát huy giá trị di sản trong thời kì chuyển đổi số']
    }
  }
];

export const TEXTBOOKS = [
  'Kết nối tri thức với cuộc sống',
  'Chân trời sáng tạo',
  'Cánh Diều',
  'Khác'
] as const;

export const EXAM_TYPES = [
  'Thường xuyên (15 phút/miệng)',
  'Giữa học kì I',
  'Cuối học kì I',
  'Giữa học kì II',
  'Cuối học kì II',
  'Kiểm tra theo chủ đề',
  'Kiểm tra cuối năm'
] as const;
