const sum = require("lodash/sum");
const router = require("express").Router({ mergeParams: true });
const CryptoJS = require("crypto-js");
const utils = require("../../../utils");

const coinspotEndpoints = {
  balances: "/api/ro/my/balances",
  transactions: "/api/ro/my/transactions",
  withdrawals: "/api/ro/my/withdrawals",
  deposits: "/api/ro/my/deposits",
  latest_prices: "/pubapi/latest",
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
    const { secret, key, cost_basis_type = "FIFO" } = req.headers;

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

    const { prices } = (
      await api.coinspot.get(coinspotEndpoints.latest_prices)
    ).data;

    const balances = await fetchCoinspot("balances");
    const { withdrawals } = (await fetchCoinspot("withdrawals")).data;
    const { deposits } = (await fetchCoinspot("deposits")).data;
    const { data: transactions } = await fetchCoinspot("transactions");

    const removeAUDBalance = ({ short_name }) => short_name !== "AUD";

    const normalizedBalances = balances.data.balances
      .map(utils.coinspot.normalizeCoinData)
      .filter(removeAUDBalance);

    const normalizedTransactions = [
      ...transactions.buyorders.map((t) =>
        utils.coinspot.normalizeTransactionData("BUY", t)
      ),
      ...transactions.sellorders.map((t) =>
        utils.coinspot.normalizeTransactionData("SELL", t)
      ),
    ];

    const allBalances = utils.coinspot.getZeroBalanceCoins({
      transactions,
      balances: normalizedBalances,
    });

    const data = allBalances.map((coin) => {
      const { aud_balance, short_name } = coin;

      return utils.shared.addCalculatedFields({
        transactions: normalizedTransactions,
        coin,
        options: { cost_basis_type },
      });
    });

    const getAmount = ({ amount }) => amount;
    const getAudBalance = ({ audbalance }) => audbalance;

    const total_deposits = sum(deposits.map(getAmount));
    const total_withdrawals = sum(withdrawals.map(getAmount));
    const total_aud_spent = total_deposits - total_withdrawals;

    const total_profit = sum(data.map(({ gainz }) => gainz));
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
        withdrawals,
        deposits,
        transactions,
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
