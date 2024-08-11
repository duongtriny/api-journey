import express from 'express';
const app = express();
const port = 3000;

import { getCountries } from './api/retrieve.js';

app.get('/api/countries', getCountries);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});