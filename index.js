const PORT = '8080';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the homepage ahaaaaaaaaaaaaa!');
});

app.use(
  cors({
    origin: 'https://plannerf.aiprojectt.com',
    credentials: true,
  })
);

// 수정할때
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

app.use(cookieParser());

// 'uploads' 폴더를 정적 파일로 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 설정: 파일 저장 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일을 uploads 폴더에 저장
  },
  filename: function (req, file, cb) {
    const fullName =
      req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    cb(null, fullName + '_' + file.filename); // 파일 이름 설정 (중복 방지를 위해 타임스탬프 추가)
  },
});

const upload = multer({ storage: storage });

// 라우트 사용
app.post('/upload', upload.single('planner_img'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      filename:
        req.protocol +
        '://' +
        req.get('host') +
        '/uploads/' +
        req.file.filename,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'File upload failed', error: error.message });
  }
});

app.use(require('./routes/getRoutes'));
app.use(require('./routes/postRoutes'));
app.use(require('./routes/updateRoutes'));
app.use(require('./routes/deleteRoutes'));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
