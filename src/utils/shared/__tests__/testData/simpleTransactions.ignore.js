const createTransaction = (transaction = {}) => {
  const {
    amount,
    fiat_value,
    type = "BUY",
    market = "BTC/AUD",
    created = "2021-01-05T12:09:22.108Z",
    ...rest
  } = transaction;

  const fee = fiat_value * 0.01;
  const feeGST = fee * 0.1;

  return {
    type,
    market,
    amount,
    created,
    audfeeExGst: fee - feeGST,
    audGst: feeGST,
    fiat_value,
    total: fiat_value,
    ...rest,
  };
};

module.exports = [
  createTransaction({
    amount: 1,
    fiat_value: 1500,
    created: "2020-12-26T12:09:22.108Z",
  }),
  createTransaction({
    amount: 1,
    fiat_value: 1200,
    created: "2020-12-28T12:09:22.108Z",
  }),
  createTransaction({
    amount: 1,
    fiat_value: 1500,
    created: "2020-12-29T12:09:22.108Z",
  }),
  createTransaction({
    type: "SELL",
    amount: 1.5,
    fiat_value: 2000,
    created: "2021-01-05T12:09:22.108Z",
  }),
  createTransaction({
    amount: 1,
    fiat_value: 1000,
    created: "2021-01-08T12:09:22.108Z",
  }),
  createTransaction({
    amount: 1,
    fiat_value: 1400,
    created: "2021-01-09T12:09:22.108Z",
  }),
  createTransaction({
    amount: 1,
    fiat_value: 1200,
    created: "2021-01-10T12:09:22.108Z",
  }),
  createTransaction({
    type: "SELL",
    amount: 2,
    fiat_value: 4000,
    created: "2021-01-20T12:09:22.108Z",
  }),
];
