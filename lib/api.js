const axios = require('axios');
const { apiConfig } = require('./config');

const searchConnections = async(from, to, date) =>{
    const { stationCodes } = require('./config');
    const stationFromCode = stationCodes[from];
    const stationToCode = stationCodes[to];

    if (!stationFromCode|| !stationToCode) {
        throw new Error('Invalid beginning or destination point.');
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

const checkPrice = async (from, to, date, time,trainId) => {
    const {stationCodes} = require('./config');
    const stationFromCode = stationCodes[from];
    const stationToCode = stationCodes[to];


    priceRequestBody = {
        urzadzenieNr: apiConfig.urzadzenieNr,
        metoda: "sprawdzCene",
        jezyk: "PL",
        ofertaKod: 1,
        podrozni: [{ kodZakupowyZnizki: 1010 }],
        biletTyp: 1,
        odcinki: [{
          pociagNr: trainId,
          wyjazdData: `${date} ${time}:00`,
          stacjaOdKod: stationFromCode,
          stacjaDoKod: stationToCode,
        }],
      };
    
      try {
        const priceResponse = await axios.post(
            `${apiConfig.url}/Sprzedaz`,
            priceRequestBody,{
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible)',
            }},
        )
        const ceny = priceResponse.data.ceny;

        if (!ceny || ceny.length === 0) {
            console.warn('Brak danych o cenach w odpowiedzi API.');
            return null;
        }

        const klasa2Cena = ceny.find(item => item.klasa === 2)?.cena;
        const klasa1Cena = ceny.find(item => item.klasa === 1)?.cena;

        return {
            klasa1: klasa1Cena,
            klasa2: klasa2Cena,
        };
      } catch (error) {
        console.error(`Błąd przy sprawdzaniu ceny dla pociągu nr ${trainId}:`, error.message);
        return null;
      }
    };

module.exports = {searchConnections, checkPrice}

