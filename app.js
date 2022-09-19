const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const etherscanKey = process.env.ETHERSCAN_KEY;
const moralisKeyEth = process.env.MORALIS_API_ETHEREUM;
const covalentKey = process.env.COVALENT_API;
const courierKey = process.env.COURIER_API_KEY;

const checkingKey = async () => {
  console.log(covalentKey);
  const chainId = 1;
  try {
    const url = `https://api.covalenthq.com/v1/1/block_v2/latest/?key=${covalentKey}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const currentBlock = data.data.items[0].height;
    return currentBlock;
  } catch (err) {
    console.log(err);
  }
};

const handleNotifsDeposit = async (address, token, ticker, hash) => {
  await console.log(
    `You have received ${ticker} to ${address} which has address ${token} on chain with hash ${hash}`
  );
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + courierKey,
    },
    body: JSON.stringify({
      message: {
        template: "TAAZ4M470SMWFPG9E9K64ZBQ1847",
        data: {
          wallet: address,
          token: ticker,
          network: "Ethereum",
          txHash: hash,
        },
        to: {
          email: "sarkarsuporno36@gmail.com",
        },
        brand_id: "N3CA06ENV84GRMMDWVJF3DT615E0",
      },
    }),
  };

  const response = await fetch("https://api.courier.com/send", options);
  const data = await response.json();
  console.log(data);
};

const handleNotifsWithdraw = async (address, token, ticker, hash) => {
  await console.log(
    `You have sent ${ticker} from ${address} which has address ${token} on chain with hash ${hash}`
  );
};

const tableLand = async () => {
  try {
    const tableLandUrl =
      "https://testnet.tableland.network/query?mode=json&s=select%20wallet_address,%20token%20from%20cue_ethereum_5_698";
    const optionsTableland = {
      method: "GET",
    };
    const responseTableland = await fetch(tableLandUrl, optionsTableland);
    const dataTableland = await responseTableland.json();
    return dataTableland;
  } catch (err) {
    console.log(err);
  }
};

let prevBlock = 15527730;

app.get("/", (req, res) => {
  res.status(200).send("Alive!");
});

app.get("/query/:table/:company/:wallet", async (req, res, next) => {
  try {
    const table = req.params.table;
    const company = req.params.company;
    const wallet = req.params.wallet;
    const url = `https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${table}%20where%20company_name%20=%20%27${company}%27%20and%20wallet_address%20=%20%27${wallet}%27`;
    const options = {
      method: "GET",
    };
    console.log(url);
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.length === 0 || data.message == "Row not found") {
      res.status(200).json({
        message: 0,
      });
    } else if (data.length > 0) {
      res.status(200).json({
        message: 1,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// const job = schedule.scheduleJob("*/1 * * * *", async function () {
//   console.log("The answer to life,");
//   try {
//     const endBlock = await checkingKey();
//     const dataTableland = await tableLand();
//     console.log(dataTableland);
//     for (let i = 0; i < dataTableland.length; i++) {
//       try {
//         const url = `https://api.covalenthq.com/v1/1/address/${dataTableland[i].wallet_address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${dataTableland[i].token}&key=${covalentKey}`;
//         const options = {
//           method: "GET",
//         };
//         const response = await fetch(url, options);
//         const data = await response.json();
//         const items = data.data.items;
//         items.forEach(async (item) => {
//           const transferDetail = item.transfers[0];
//           console.log(transferDetail);
//           if (transferDetail.transfer_type == "OUT") {
//             await handleNotifsWithdraw(
//               transferDetail.from_address,
//               transferDetail.contract_address,
//               transferDetail.contract_ticker_symbol,
//               transferDetail.tx_hash
//             );
//           } else if (transferDetail.transfer_type == "IN") {
//             await handleNotifsDeposit(
//               transferDetail.to_address,
//               transferDetail.contract_address,
//               transferDetail.contract_ticker_symbol,
//               transferDetail.tx_hash
//             );
//           }
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// const job2 = schedule.scheduleJob("*/1 * * * *", function () {
//   console.log("the universe, and everything!");
// });

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// checkingKey();
// tableLand();
app.listen(PORT);
