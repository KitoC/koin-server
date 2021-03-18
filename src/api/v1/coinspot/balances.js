const sum = require("lodash/sum");
const router = require("express").Router({ mergeParams: true });
const CryptoJS = require("crypto-js");

const coinspotEndpoints = {
  balances: "/api/ro/my/balances",
  transactions: "/api/ro/my/transactions",
  withdrawals: "/api/ro/my/withdrawals",
  deposits: "/api/ro/my/deposits",
};

const getPercentageDifference = (difference, original) => {
  return (difference / original) * 100;
};

const getSign = (body, secret) => {
  const bodyStringified = JSON.stringify(body);

  return CryptoJS.HmacSHA512(bodyStringified, secret).toString(CryptoJS.digest);

  return sign;
};

router.get("/", async (req, res, next) => {
  try {
    const { api } = res.locals;
    const { secret, key } = req.headers;

    const fetchCoinspot = (fetch_key) => {
      const body = { nonce: new Date().getTime() * 1000 };
      const headers = { common: {} };

      if (secret) {
        headers.common["sign"] = getSign(body, secret);
      }

      if (key) {
        headers.common["key"] = key;
      }

      return api.coinspot.post(coinspotEndpoints[fetch_key], body, { headers });
    };

    const balances = await fetchCoinspot("balances");
    const { withdrawals } = (await fetchCoinspot("withdrawals")).data;
    const { deposits } = (await fetchCoinspot("deposits")).data;
    const { data: transactions } = await fetchCoinspot("transactions");

    const data = balances.data.balances
      .filter((coin) => {
        const [shortName, balance] = Object.entries(coin)[0];

        return shortName !== "AUD";
      })
      .map((coin) => {
        const [shortName, balance] = Object.entries(coin)[0];
        const { audbalance } = balance;
        const filterByShortName = ({ market }) => market.includes(shortName);

        const buy_orders = transactions.buyorders.filter(filterByShortName);
        const sell_orders = transactions.sellorders.filter(filterByShortName);

        const getAudTotal = ({ audtotal }) => audtotal;
        const total_buy_order_amount = sum(buy_orders.map(getAudTotal));
        const total_sell_order_amount = sum(sell_orders.map(getAudTotal));
        const total_aud_spent =
          total_buy_order_amount - total_sell_order_amount;

        const profit = audbalance - total_aud_spent;

        const percentage_difference = getPercentageDifference(
          profit,
          total_aud_spent
        );

        return {
          profit,
          shortName,
          total_aud_spent,
          total_buy_order_amount,
          total_sell_order_amount,
          percentage_difference,
          ...balance,
          buy_orders,
          sell_orders,
        };
      });

    const getAmount = ({ amount }) => amount;
    const getAudBalance = ({ audbalance }) => audbalance;

    const total_deposits = sum(deposits.map(getAmount));
    const total_withdrawals = sum(withdrawals.map(getAmount));
    const total_aud_spent = total_deposits - total_withdrawals;

    const total_profit = sum(data.map(({ profit }) => profit));
    const total_coin_balance_in_aud = sum(data.map(getAudBalance));
    const total_percentage_difference = getPercentageDifference(
      total_profit,
      total_aud_spent
    );

    res.json({
      data: {
        total_aud_spent,
        total_percentage_difference,
        total_deposits,
        total_withdrawals,
        total_profit,
        aud_spent_plus_total_profit: total_aud_spent + total_profit,
        total_coin_balance_in_aud,
        balances: data,
      },
    });
  } catch (error) {
    if (error.response) {
      next(error.response.data);
    }

    next({ message: error });
  }
});

module.exports = router;
