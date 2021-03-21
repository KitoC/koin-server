const calculateCostBases = require("../calculateCostBases");
const arraySort = require("array-sort");

const createTransaction = (transaction = {}) => {
  const {
    amount,
    audtotal,
    type = "BUY",
    market = "BTC/AUD",
    created = "2021-01-05T12:09:22.108Z",
    ...rest
  } = transaction;

  const fee = audtotal * 0.01;
  const feeGST = fee * 0.1;

  return {
    type,
    market,
    amount,
    created,
    audfeeExGst: fee - feeGST,
    audGst: feeGST,
    audtotal,
    total: audtotal,
    ...rest,
  };
};

describe("utils/coinspot/calculateCostBases", () => {
  const cost_basis_types = ["FIFO", "FILO", "FIHO"];

  const transactions = [
    createTransaction({
      amount: 1,
      audtotal: 1000,
      created: "2021-01-08T12:09:22.108Z",
    }),
    createTransaction({
      amount: 1,
      audtotal: 1500,
      created: "2020-12-29T12:09:22.108Z",
    }),
    createTransaction({
      amount: 1,
      audtotal: 1000,
      created: "2020-12-28T12:09:22.108Z",
    }),
    createTransaction({
      type: "SELL",
      amount: 1,
      audtotal: 2000,
      created: "2021-01-20T12:09:22.108Z",
    }),
    createTransaction({
      type: "SELL",
      amount: 1.5,
      audtotal: 2000,
      created: "2021-01-05T12:09:22.108Z",
    }),
  ];
  // const transactions = {
  //   buyorders: [
  //     createTransaction({
  //       amount: 1,
  //       audtotal: 1000,
  //       created: "2021-01-08T12:09:22.108Z",
  //     }),
  //     createTransaction({
  //       amount: 1,
  //       audtotal: 1500,
  //       created: "2020-12-29T12:09:22.108Z",
  //     }),
  //     createTransaction({
  //       amount: 1,
  //       audtotal: 1000,
  //       created: "2020-12-28T12:09:22.108Z",
  //     }),
  //   ],
  //   sellorders: [
  //     createTransaction({
  //       type: "SELL",
  //       amount: 1,
  //       audtotal: 2000,
  //       created: "2021-01-20T12:09:22.108Z",
  //     }),
  //     createTransaction({
  //       type: "SELL",
  //       amount: 1.5,
  //       audtotal: 2000,
  //       created: "2021-01-05T12:09:22.108Z",
  //     }),
  //   ],
  // };

  describe("FIFO", () => {
    it("adds cost_basis and profit to SELL orders ", () => {
      const expectedResult = arraySort(
        [
          createTransaction({
            amount: 1,
            audtotal: 1000,
            created: "2021-01-08T12:09:22.108Z",
          }),
          createTransaction({
            amount: 1,
            audtotal: 1500,
            created: "2020-12-29T12:09:22.108Z",
          }),
          createTransaction({
            amount: 1,
            audtotal: 1000,
            created: "2020-12-28T12:09:22.108Z",
          }),
          createTransaction({
            type: "SELL",
            amount: 1,
            audtotal: 2000,
            created: "2021-01-20T12:09:22.108Z",
            cost_basis: 1250,
            profit: 750,
          }),
          createTransaction({
            type: "SELL",
            amount: 1.5,
            audtotal: 2000,
            created: "2021-01-05T12:09:22.108Z",
            cost_basis: 1750,
            profit: 250,
          }),
        ],
        "created"
      );
      // const expectedResult = {
      //   buyorders: [
      //     createTransaction({
      //       amount: 1,
      //       audtotal: 1000,
      //       created: "2021-01-08T12:09:22.108Z",
      //     }),
      //     createTransaction({
      //       amount: 1,
      //       audtotal: 1500,
      //       created: "2020-12-29T12:09:22.108Z",
      //     }),
      //     createTransaction({
      //       amount: 1,
      //       audtotal: 1000,
      //       created: "2020-12-28T12:09:22.108Z",
      //     }),
      //   ],
      //   sellorders: [
      //     createTransaction({
      //       type: "SELL",
      //       amount: 1,
      //       audtotal: 2000,
      //       created: "2021-01-20T12:09:22.108Z",
      //       cost_basis: 1250,
      //       profit: 750,
      //     }),
      //     createTransaction({
      //       type: "SELL",
      //       amount: 1.5,
      //       audtotal: 2000,
      //       created: "2021-01-05T12:09:22.108Z",
      //       cost_basis: 1750,
      //       profit: 250,
      //     }),
      //   ],
      // };

      expect(calculateCostBases("FIFO", transactions)).toEqual(expectedResult);
    });
  });
});
