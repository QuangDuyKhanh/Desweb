const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const fs = require('fs');

// Phục vụ các tệp tĩnh thông minh: Ưu tiên thư mục 'dist' (React build), nếu không có thì dùng thư mục gốc
const hasDist = fs.existsSync(path.join(__dirname, 'dist'));
const staticPath = hasDist ? path.join(__dirname, 'dist') : __dirname;
app.use(express.static(staticPath));

// Dữ liệu mock-data từ lịch học Chalkboard ban đầu
const scheduleData = [
    { id: 1, time: "08:00 - 09:30", class: "Xã hội hóa Cún con", trainer: "Hà Phương", status: "Còn 2 chỗ" },
    { id: 2, time: "10:00 - 11:30", class: "Kỷ luật Phân cấp", trainer: "Quốc Anh", status: "Hết chỗ" },
    { id: 3, time: "14:00 - 15:30", class: "Sửa hành vi (1-1)", trainer: "Minh Tuấn", status: "Còn 1 chỗ" }
];

// Dữ liệu mock-data danh sách báo chí đưa tin
const pressData = [
    { 
        id: 1, 
        name: "VnExpress", 
        logoText: "Vn", 
        color: "#730024", 
        quote: "Happy Paws dẫn đầu xu hướng huấn luyện cún cưng kết hợp công nghệ hiện đại 2026." 
    },
    { 
        id: 2, 
        name: "Dân Trí", 
        logoText: "DT", 
        color: "#007F5C", 
        quote: "Môi trường nội trú và dạy kèm 1-1 chuẩn 5 sao dành cho thú cưng tại Việt Nam." 
    },
    { 
        id: 3, 
        name: "Tuổi Trẻ", 
        logoText: "TT", 
        color: "#D32F2F", 
        quote: "Phương pháp giáo dục nhân văn, giúp cún xóa bỏ các hành vi tiêu cực tự nhiên." 
    },
    { 
        id: 4, 
        name: "Kenh14", 
        logoText: "K14", 
        color: "#F57C00", 
        quote: "Cộng đồng mạng phát sốt với Trợ lý ảo AI Pawsie thông minh của trung tâm." 
    }
];



// API lấy lịch học
app.get('/api/schedule', (req, res) => {
    res.json(scheduleData);
});



// API xử lý Đăng nhập / Đăng ký (Emulation)
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    res.json({ success: true, message: `Chào mừng quay trở lại! Đăng nhập thành công với ${email}.` });
});

// Route mặc định cho index.html để hỗ trợ SPA routing hoặc tải trang trực tiếp
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Cấu hình API Route danh sách báo chí đưa tin
app.get('/api/press', (req, res) => {
    res.json(pressData);
});

app.listen(PORT, () => {
    console.log(`Server Happy Paws đang chạy tại http://localhost:${PORT}`);
});
