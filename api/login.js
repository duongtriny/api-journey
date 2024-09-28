import jwt from 'jsonwebtoken';
import 'dotenv/config';
const timeout = Number.parseInt(process.env.TIMEOUT);
const secret = process.env.SECRET;


export const login = (req, res) => {
    // Mock user
    const users = [{
        id: 1,
        username: 'admin',
        role: 'admin',
        password: '1234567890'
    },
    {
        id: 2,
        username: 'staff',
        role: 'staff',
        password: '1234567890'
    }
    ];
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, secret, { expiresIn: timeout });
    return res.json({ token, timeout });
}