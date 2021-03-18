const CryptoJS = require("crypto-js");
const axios = require("axios");
const get = require("lodash/get");
const dotenv = require("dotenv");

dotenv.config();
const nonces = [];

const makeCoinspotAxiosInstance = () => {
  const coinspotApi = axios.create({ baseURL: process.env.COINSPOT_URL });

  return coinspotApi;
};

const api = {
  coinspot: makeCoinspotAxiosInstance(),
};

module.exports = api;
