import express from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import 'dotenv/config';
import { getCountry, getCountries, getCountriesWithGdp, getCountriesWithFilter, getCountriesWithPagination, getCountriesWithPrivate } from './api/retrieve.js';
import init from './init-db.js';
const app = express();
const port = 3000;
const secret = process.env.SECRET;
const timeout = Number.parseInt(process.env.TIMEOUT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressjwt({
    secret: secret,
    algorithms: ["HS256"]
}).unless({ path: ['/', '/api/login', '/api/v1/countries', '/api/v2/countries', '/api/v3/countries', '/api/v4/countries', '/api/v5/countries', /api\/v1\/countries\/.+/] }));

app.get('/api/v1/countries', getCountries);
app.get('/api/v1/countries/:code', getCountry);
app.get('/api/v2/countries', getCountriesWithGdp);
app.get('/api/v3/countries', getCountriesWithFilter);
app.get('/api/v4/countries', getCountriesWithPagination);
app.get('/api/v5/countries', getCountriesWithPrivate);

app.post('/api/login', (req, res) => {
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
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    init();
    console.log(`Server is running on port ${port}`);
});