const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'happy_paws_secret_key_2026';
const usersFilePath = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for reading/writing database file
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Lỗi đọc cơ sở dữ liệu users.json:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Lỗi ghi cơ sở dữ liệu users.json:', error);
  }
};

// API: Đăng ký tài khoản (Register)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' });
  }

  const users = readUsers();

  // Kiểm tra email trùng lặp
  const userExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ message: 'Email này đã được đăng ký!' });
  }

  try {
    // Băm mật khẩu (Hash password)
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra trên máy chủ!' });
  }
});

// API: Đăng nhập tài khoản (Login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ email và mật khẩu!' });
  }

  const users = readUsers();

  // Tìm người dùng bằng email
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
  }

  // So khớp mật khẩu
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
  }

  try {
    // Ký JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra trên máy chủ!' });
  }
});

// API: Lấy thông tin tài khoản hiện tại từ Token
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server Happy Paws đang chạy tại http://localhost:${PORT}`);
});
