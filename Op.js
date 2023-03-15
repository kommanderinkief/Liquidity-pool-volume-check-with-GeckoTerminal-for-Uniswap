const axios = require("axios");

const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_TELEGRAM_BOT_TOKEN with your own Telegram bot token
const bot = new TelegramBot('6211774833:AAEv4mJnhTCAl-Evac0DamtX_viQoUjZZtI');


async function getPools(pageNO) {
  const response = await axios.get(
    `https://app.geckoterminal.com/api/p1/optimism/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=${pageNO}&include_network_metrics=true`
  );
  return response.data.data;
}

function checkPool(pool) {
  // console.log(pool)
   //console.log(pool.attributes.historical_data.last_1h.volume_in_usd)
   const tradingVolume1 = pool.attributes.historical_data.last_1h.volume_in_usd;
   const tradingVolume = Number(tradingVolume1.replace('$', ''));
   const liquidity1 = pool.attributes.reserve_in_usd;
   const liquidity = Number(liquidity1.replace('$', ''));
   const last_5_min_cal = liquidity * 0.13;
   const tradingVolume5 = pool.attributes.historical_data.last_5m.volume_in_usd;
   const tradingVolume5m = Number(tradingVolume5.replace('$', ''));
 
   const tradingVolume6h = pool.attributes.historical_data.last_6h.volume_in_usd;
   const tradingVolume6hm = Number(tradingVolume6h.replace('$', ''));
   //we only want high liquidity so we need to look for liquidty that is higher than actual by using a multiplier?
   const last_6h_cal = liquidity * 2.5;
 
 
 //figure out exactly what this does!
 if(liquidity < 800000 && liquidity > 100 && tradingVolume > 80 && tradingVolume < 300000){
   if (tradingVolume > liquidity) {
     const message = `1 Hour: ${pool.attributes.address} Volume : $${tradingVolume} and Liquidity : $${liquidity}. pair name $${pool.attributes.name}  Ratio: ${tradingVolume / liquidity}!\n`;
           console.log(message);
          bot.sendMessage('310580895', message);;
   }
 
 //check last 5 minss using 5_min_cal which checks is trade volume is 0.13 times greater than liquidity  
   if (tradingVolume5m > last_5_min_cal) {
     const message = `5 min: ${pool.attributes.address} Volume of $${tradingVolume5m} and Liquidity of $${liquidity}. pair name $${pool.attributes.name}  Ratio: ${tradingVolume / liquidity}!\n`;
     console.log(message);
     bot.sendMessage('310580895', message);
   }
   
 //check last 6 hours using 6h_cal which checks is trade volume is 2.5 times greater than liquidity
   if (tradingVolume6hm > last_6h_cal) {
     const message = `Last 6 hrs Pools: ${pool.attributes.address} has trading Volume of $${tradingVolume6hm} and Liquidity of $${liquidity}  pair name $${pool.attributes.name}  Ratio: ${tradingVolume6hm / liquidity}!\n`;
     console.log(message);
     bot.sendMessage('310580895', message);
   }
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
 
