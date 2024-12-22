const express = require('express');
const { searchConnections} = require('./api');
const app = express();
const port = 3000;

app.use(express.json())

app.post('/search', async (req, res) => {
    const {from, to, date} = req.body;
    try {
        const trains = await searchConnections(from, to, date);
        res.json(trains);
    } catch (error) {
        console.error('Błąd:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
