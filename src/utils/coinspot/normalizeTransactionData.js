const normalizeTransactionData = (type, transaction) => ({
  type,
  otc: transaction.otc,
  market: transaction.market,
  amount: transaction.amount,
  created: transaction.created,
  transaction_fee: transaction.audfeeExGst + transaction.audGst,
  fiat_value: transaction.audtotal,
  fiat_currency: "AUD",
});

module.exports = normalizeTransactionData;
