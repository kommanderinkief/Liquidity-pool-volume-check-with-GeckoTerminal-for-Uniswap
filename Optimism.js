const axios = require("axios");

//const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_TELEGRAM_BOT_TOKEN with your own Telegram bot token
//const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN');


async function getPools(pageNO) {
  const response = await axios.get(
    `https://app.geckoterminal.com/api/p1/optimism/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=${pageNO}&include_network_metrics=true`
  );
  return response.data.data;
}

function checkPool(pool) {
 // console.log(pool.attributes.historical_data.last_1h.volume_in_usd)
  //console.log(pool.attributes.historical_data.last_1h.volume_in_usd)
  const tradingVolume1 = pool.attributes.historical_data.last_1h.volume_in_usd;
  const tradingVolume = Number(tradingVolume1.replace('$', ''));
  const liquidity1 = pool.attributes.reserve_in_usd;
  const liquidity = Number(liquidity1.replace('$', ''));
  const last_5_min_cal = liquidity * 0.13;
  const tradingVolume5 = pool.attributes.historical_data.last_5m.volume_in_usd;
  const tradingVolume5m = Number(tradingVolume5.replace('$', ''));

  const tradingVolume24h = pool.attributes.historical_data.last_24h.volume_in_usd;
  const tradingVolume24hm = Number(tradingVolume24h.replace('$', ''));
  const last_24h_cal = liquidity * 10;

if(liquidity < 800000 && liquidity > 100 && tradingVolume > 80 && tradingVolume < 700000){
  if (tradingVolume > liquidity) {
    const message = `1 Hour: ${pool.attributes.address} volume : $${tradingVolume} liquidity : $${liquidity}. pair name $${pool.attributes.name}  Retio: ${tradingVolume / liquidity}!\n`;
          console.log(message);
     //     bot.sendMessage('YOUR_TELEGRAM_CHAT_ID', message);;
  }
  
  if (tradingVolume5m > last_5_min_cal) {
    const message = `5 min: ${pool.attributes.address} volume of $${tradingVolume5m} liquidity of $${liquidity}. pair name $${pool.attributes.name}  Retio: ${tradingVolume5m / liquidity}!\n`;
    console.log(message);
  //  bot.sendMessage('YOUR_TELEGRAM_CHAT_ID', message);
  }
  

  // if (tradingVolume24hm > last_24h_cal) {
  //   const message = `Last 1 day Pool: ${pool.attributes.address} has trading volume of $${tradingVolume24hm} and liquidity of $${last_24h_cal}. Trading volume is greater than liquidity!`;
  //   console.log(message);
  // //  bot.sendMessage('YOUR_TELEGRAM_CHAT_ID', message);
  // }
}
}
async function getData(maxPage) {
  try {
    for (let i = 1; i <= maxPage; i++) {
      const pools = await getPools(i);
      for (let j = 0; j < pools.length; j++) {
        checkPool(pools[j]);
      }
    }
  } catch (error) {
    console.error(error);
  }
  console.log("checking");
}

// Call getData function with maximum page number
getData(5);

// Run getData function every 18 seconds
setInterval(() => {
  getData(5);
}, 40000);
