const countries = [
    { name: 'Viet Nam', code: 'VN' },
    { name: 'USA', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'UK', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'India', code: 'IN' },
    { name: 'China', code: 'CN' },
    { name: 'Brazil', code: 'BR' }
];

const countriesWithGdp = [
    { name: 'Viet Nam', code: 'VN', gdp: 223.9 },
    { name: 'USA', code: 'US', gdp: 21427.5 },
    { name: 'Canada', code: 'CA', gdp: 1930.0 },
    { name: 'UK', code: 'GB', gdp: 2827.0 },
    { name: 'France', code: 'FR', gdp: 2718.0 },
    { name: 'Japan', code: 'JP', gdp: 5081.0 },
    { name: 'India', code: 'IN', gdp: 2875.0 },
    { name: 'China', code: 'CN', gdp: 14342.9 },
    { name: 'Brazil', code: 'BR', gdp: 1868.0 }
];

const countriesWithPrivate = [
    { name: 'Viet Nam', code: 'VN', gdp: 223.9, private: 60.0 },
    { name: 'USA', code: 'US', gdp: 21427.5, private: 80.0 },
    { name: 'Canada', code: 'CA', gdp: 1930.0, private: 70.0 },
    { name: 'UK', code: 'GB', gdp: 2827.0, private: 75.0 },
    { name: 'France', code: 'FR', gdp: 2718.0, private: 65.0 },
    { name: 'Japan', code: 'JP', gdp: 5081.0, private: 85.0 },
    { name: 'India', code: 'IN', gdp: 2875.0, private: 55.0 },
    { name: 'China', code: 'CN', gdp: 14342.9, private: 90.0 },
    { name: 'Brazil', code: 'BR', gdp: 1868.0, private: 50.0 }
];

export const getCountries = (req, res) => {
    res.json([
        { name: 'Viet Nam', code: 'VN' },
        { name: 'USA', code: 'US' },
        { name: 'Canada', code: 'CA' },
        { name: 'UK', code: 'GB' },
        { name: 'France', code: 'FR' },
        { name: 'Japan', code: 'JP' },
        { name: 'India', code: 'IN' },
        { name: 'China', code: 'CN' },
        { name: 'Brazil', code: 'BR' }
    ]);
};

export const getCountry = (req, res) => {
    const { code } = req.params;
    const country = countries.find(country => country.code === code);
    res.json(country);
};

export const getCountriesWithGdp = (req, res) => {
    res.json(countriesWithGdp);
}

export const getCountriesWithFilter = (req, res) => {
    const { gdp, operator } = req.query;
    if (!gdp || !operator) {
        getCountriesWithGdp(req, res);
    } else {
        try {
            const result = countriesWithGdp.filter(country => eval(`${country.gdp} ${operator} ${gdp}`));
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: 'Invalid query' });
        }
    }
};

export const getCountriesWithPagination = (req, res) => {
    const { page, size } = req.query;
    if (!page || !size) {
        res.status(400).json({ message: 'Invalid query' });
    } else {
        const start = (page - 1) * size;
        const end = page * size;
        res.json({
            page: Number.parseInt(page),
            size: Number.parseInt(size),
            total: countriesWithGdp.length,
            data: countriesWithGdp.slice(start, end)
        });
    }
};

export const getCountriesWithPrivate = (req, res) => {
    if (req.headers["api-key"] === 'private') {
        res.json(countriesWithPrivate);
    }else{
        res.json(countriesWithGdp)
    }
};