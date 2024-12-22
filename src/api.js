const axios = require('axios');
const { apiConfig } = require('./config');

const searchConnections = async(from, to, date) =>{
    const { stationCodes } = require('./config');

    const stationFromCode = stationCodes[from];
    const stationToCode = stationCodes[to];

    if (!stationFromCode|| !stationToCode) {
        return res.status(400).json({ error: 'Invalid beginning or destination point.' });
    }

    const requestBody = {
        urzadzenieNr: apiConfig.urzadzenieNr,
        metoda: "wyszukajPolaczenia",
        dataWyjazdu: `${date} 00:00:00`,
        dataPrzyjazdu: `${date} 23:59:59`,
        stacjaWyjazdu: stationFromCode,
        stacjaPrzyjazdu: stationToCode,
        stacjePrzez: [],
        polaczeniaNajszybsze: 0,
        liczbaPolaczen: 0,
        czasNaPrzesiadkeMax: 1440,
        liczbaPrzesiadekMax: 2,
        polaczeniaBezposrednie: 0,
        kategoriePociagow: [],
        kodyPrzewoznikow: [],
        rodzajeMiejsc: [],
        typyMiejsc: [],
        braille: 0,
        czasNaPrzesiadkeMin: 3,
    };

    try{
        const response = await axios.post(
            `${apiConfig.url}/Pociagi`,
            requestBody,
            {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible)',
            },        });
        return response.data;
    } catch (error) {
        throw new Error('Error sending connection request' + error.message)
    }
}


module.exports = {searchConnections}

