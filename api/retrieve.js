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