import http from 'http';
import inquirer from 'inquirer';
import axios from 'axios';
import colors from 'colors';

let userAnswer = ''; // Make it accessible in server scope

const config = {
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY,
  }
};

async function cryptoServer() {
  try {
    const faveReptile = await inquirer.prompt([
      {
        type: 'input',
        name: 'crypto',
        message: 'What are you looking for?',
        default: 'bitcoin',
      }
    ]);

    userAnswer = faveReptile.crypto; // Save just the string answer

  const response =  axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: userAnswer,
        }
      })
        .then(response => {
          const data = response.data[0];
          console.log(`📈 Market Cap: $${Math.round(data.market_cap).toLocaleString()}`.magenta);
          console.log(`💲Current Price: $${Math.round(data.current_price).toLocaleString()}`.green);
          console.log(`💯 Percentage increace: %${data.price_change_percentage_24h}`.green);
        })
        .catch(err => {
          console.error(err);
        });
    // NO extra res.end() here

    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });

    const PORT = 8000;
    server.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`.blue);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

cryptoServer();
