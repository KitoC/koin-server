const CryptoJS = require("crypto-js");
const axios = require("axios");
const get = require("lodash/get");
const dotenv = require("dotenv");

dotenv.config();
const nonces = [];

const makeCoinspotAxiosInstance = (options) => {
  const coinspotApi = axios.create(options);

  return coinspotApi;
};

const api = {
  coinspot: makeCoinspotAxiosInstance({ baseURL: process.env.COINSPOT_URL }),
  userService: makeCoinspotAxiosInstance({
    baseURL: process.env.USER_SERVICE_URL,
    headers: {
      secretkey: process.env.USER_SERVICE_SECRET_KEY,
      appid: process.env.USER_SERVICE_APP_ID,
      internalkey: process.env.INTERNAL_KEY,
    },
  }),
};

module.exports = api;
