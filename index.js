import http from 'http';
import inquirer from 'inquirer';
import axios from 'axios';
import colors from 'colors';

async function cryptoServer() {
  try {
    // Ask user which crypto to track
    const { crypto } = await inquirer.prompt([
      {
        type: 'input',
        name: 'crypto',
        message: 'Which cryptocurrency are you tracking?',
        default: 'bitcoin',
      }
    ]);

    console.log(`🔁 Tracking real-time ${crypto} prices...\n`.yellow);

    // Function to fetch and print data
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: crypto,
          }
        });

        const data = response.data[0];
        const currentPrice = Math.round(data.current_price).toLocaleString();
        const marketCap = Math.round(data.market_cap).toLocaleString();
        const percentChange = data.price_change_percentage_24h?.toFixed(2);

        console.clear(); // Clear CLI before each update
        console.log(`📈 ${crypto.toUpperCase()} Market Data:`.bold.green);
        console.log(`💲 Current Price: $${currentPrice}`.blue);
        console.log(`🏦 Market Cap: $${marketCap}`.magenta);
        console.log(`📊 24h Change: ${percentChange}%`.cyan);

      } catch (err) {
        console.error('Failed to fetch data:', err.message.red);
      }
    };

    // Call once immediately
    await fetchData();

    // Then poll every 10 seconds
    setInterval(fetchData, 30000);

    // Optional server
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify(fetchData()));
    });

    const PORT = 8000;
    server.listen(PORT, () => {
      console.log(`🌐 Server running at http://localhost:${PORT}`.green);
    });

  } catch (error) {
    console.error('❌ Error:', error.message.red);
  }
}

cryptoServer();
