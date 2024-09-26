import express from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import 'dotenv/config';
import { getCountry, getCountries, getCountriesWithGdp, getCountriesWithFilter, getCountriesWithPagination, getCountriesWithPrivate } from './api/retrieve.js';
import { createCard, createCustomer, deleteCustomer, getCustomer, updateCustomer } from './api/customer.js';
import init from './init-db.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
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

app.post('/api/user', createCustomer);
app.put('/api/user/:id', updateCustomer);
app.get('/api/user/:id', getCustomer);
app.delete('/api/user/:id', deleteCustomer);
app.post('/api/card', createCard);
app.post('/api/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const sampleFile = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', sampleFile.name);

    sampleFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        fs.readFile(uploadPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading file');
            }
            res.send(data);
        });
    });
});
// Endpoint to return a file
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            return res.status(500).send('Error downloading file');
        }
    });
});
app.listen(port, () => {
    init();
    console.log(`Server is running on port ${port}`);
});