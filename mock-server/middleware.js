const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // In a real app, this would be in environment variables

module.exports = (req, res, next) => {
  // Handle root path
  if (req.path === '/') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  if (req.path === '/health') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  if (req.method === 'POST' && req.path === '/auth/register') {
    const userData = req.body;
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      res.status(400).json({ message: 'Usuário já existe' });
      return;
    }

    const newUser = {
      id: db.users.length + 1,
      ...userData,
      role: 'student',
      enrolledCourses: []
    };
    
    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    const { password, ...userWithoutPassword } = newUser;

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      token,
      user: userWithoutPassword
    };

    res.status(201).json(response);
    return;
  }

  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body;
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: userWithoutPassword
    });
    return;
  }

  next();
};