const normalizeTransactionData = (type, coin) => ({
  type,
  otc: coin.otc,
  market: coin.market,
  amount: coin.amount,
  created: coin.created,
  transaction_fee: coin.audfeeExGst + coin.audGst,
  fiat_value: coin.audtotal,
  fiat_currency: "AUD",
});

module.exports = normalizeTransactionData;
