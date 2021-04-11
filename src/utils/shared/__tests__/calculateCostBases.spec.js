const calculateCostBases = require("../calculateCostBases");
const {
  getBuyAmountToBeRealized,
  addZeroRealized,
  stripRealized,
} = calculateCostBases;
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

  const simpleTransactions = [
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
      describeText: "FIFO-Simple",
      itText: "adds cost_basis calculated from first orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "LIFO-Simple",
      itText: "adds cost_basis calculated from last orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "HIFO-Simple",
      itText: "adds cost_basis calculated from highest cost orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { date: "2021-01-05T12:09:22.108Z", cost_basis: 2250 },
        { date: "2021-01-20T12:09:22.108Z", cost_basis: 2750 },
      ],
    },
    {
      describeText: "FIFO-Complex",
      itText: "adds cost_basis calculated from first orders for a coin",
      transactions: require("./actualData.ignore.json"),
      expectedCostBases: [
        { date: "2021-01-25T21:57:37.621Z", cost_basis: 3793.74 },
        { date: "2021-04-02T05:33:50.637Z", cost_basis: 2270.67 },
      ],
    },
  ].map(({ describeText, itText, expectedCostBases, transactions }) => {
    describe(describeText, () => {
      const [costBasisType] = describeText.split("-");

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

        const result = calculateCostBases(costBasisType, transactions);

        expect(result).toEqual(expectedResult);
      });
    });
  });
});

describe("utils/shared/calculateCostBases/addZeroRealized", () => {
  it("adds realized attribute to order and sets to zero", () => {
    const order = {};
    const expected = { realized: 0 };
    const result = addZeroRealized(order);

    expect(result).toEqual(expected);
  });
});

describe("utils/shared/calculateCostBases/stripRealized", () => {
  it("removes realized attribute form order", () => {
    const order = { realized: 0 };
    const expected = {};
    const result = stripRealized(order);

    expect(result).toEqual(expected);
  });
});

describe("utils/shared/calculateCostBases/getBuyAmountToBeRealized", () => {
  describe("when amountToRealize is lower than amountLeftUnrealized", () => {
    it("returns amountToRealize", () => {
      const buyorder = { realized: 0, amount: 2 };
      const amountToRealize = 1;
      const result = getBuyAmountToBeRealized(buyorder, amountToRealize);

      expect(result).toEqual(amountToRealize);
    });
  });

  describe("when amountToRealize is higher than amountLeftUnrealized", () => {
    it("returns amountLeftUnrealized", () => {
      const buyorder = { realized: 1.5, amount: 2 };
      const amountToRealize = 1;
      const amountLeftUnrealized = 0.5;
      const result = getBuyAmountToBeRealized(buyorder, amountToRealize);

      expect(result).toEqual(amountLeftUnrealized);
    });
  });
});
