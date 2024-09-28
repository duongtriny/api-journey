import express from 'express';
import { expressjwt } from 'express-jwt';
import 'dotenv/config';
import { getCountry, getCountries, getCountriesWithGdp, getCountriesWithFilter, getCountriesWithPagination, getCountriesWithPrivate } from './api/retrieve.js';
import { createCard, createCustomer, deleteCustomer, getCustomer, updateCustomer } from './api/customer.js';
import init from './init-db.js';
import fileUpload from 'express-fileupload';
import { mkdir } from 'fs';
import { downloadFile, uploadFile, folderPath } from './api/upload.js';
import { login } from './api/login.js';

const app = express();
const port = 3000;
const secret = process.env.SECRET;

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

app.post('/api/login', login);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/api/user', createCustomer);
app.put('/api/user/:id', updateCustomer);
app.get('/api/user/:id', getCustomer);
app.delete('/api/user/:id', deleteCustomer);
app.post('/api/card', createCard);
app.post('/api/upload', uploadFile);
app.get('/api/download/:filename', downloadFile);

app.listen(port, () => {
    init();
    mkdir(folderPath, (err) => {
        if (err) {
            if (err.code === 'EEXIST') {
                console.log('Folder already exists:', folderPath);
            } else {
                console.error('Error creating folder:', err);
            }
        } else {
            console.log('Folder created successfully:', folderPath);
        }
    })
    console.log(`Server is running on port ${port}`);
});