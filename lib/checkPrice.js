const axios = require('axios');
const { apiConfig } = require('./config');

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

    module.exports = {checkPrice}