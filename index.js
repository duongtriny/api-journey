import express from 'express';
const app = express();
const port = 3000;

import { getCountry, getCountries, getCountriesWithGdp, getCountriesWithFilter, getCountriesWithPagination, getCountriesWithPrivate } from './api/retrieve.js';

app.get('/api/v1/countries', getCountries);
app.get('/api/v1/countries/:code', getCountry);
app.get('/api/v2/countries', getCountriesWithGdp);
app.get('/api/v3/countries', getCountriesWithFilter);
app.get('/api/v4/countries', getCountriesWithPagination);
app.get('/api/v5/countries', getCountriesWithPrivate);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});