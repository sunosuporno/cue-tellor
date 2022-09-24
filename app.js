const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.status(200).send("Alive!");
});

app.get("/queryUser/:table/:company/:wallet", async (req, res, next) => {
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

app.get("/queryContract/:table/:company/:contract", async (req, res, next) => {
  try {
    const table = req.params.table;
    const company = req.params.company;
    const contract = req.params.contract;
    const url = `https://testnet.tableland.network/query?mode=json&s=select%20*%20from%20${table}%20where%20company_name%20=%20%27${company}%27%20and%20contract_address%20=%20%27${contract}%27`;
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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(PORT);
