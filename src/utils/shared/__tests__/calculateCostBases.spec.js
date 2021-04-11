const calculateCostBases = require("../calculateCostBases");
const arraySort = require("array-sort");

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

describe("utils/shared/calculateCostBases", () => {
  const cost_basis_types = ["FIFO", "FILO", "FIHO"];

  const transactions = [
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
  [
    {
      describeText: "FIFO",
      itText: "adds cost_basis calculated from first orders for a coin",
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "LIFO",
      itText: "adds cost_basis calculated from last orders for a coin",
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "HIFO",
      itText: "adds cost_basis calculated from highest cost orders for a coin",
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2250 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2750 },
      ],
    },
  ].map(({ describeText, itText, expectedCostBases }) => {
    describe(describeText, () => {
      it(itText, () => {
        const expectedResult = arraySort(transactions, "created").map(
          (transaction) => {
            if (transaction.type === "SELL") {
              const matchingDate = expectedCostBases.find(
                ({ date }) => date === transaction.created
              );
              transaction.cost_basis = matchingDate.cost_basis;
            }

            return { ...transaction };
          }
        );

        expect(calculateCostBases(describeText, transactions)).toEqual(
          expectedResult
        );
      });
    });
  });
});
