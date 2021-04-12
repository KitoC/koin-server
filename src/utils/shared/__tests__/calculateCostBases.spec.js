const calculateCostBases = require("../calculateCostBases");
const {
  getBuyAmountToBeRealized,
  addZeroRealized,
  stripRealized,
} = calculateCostBases;
const arraySort = require("array-sort");

const simpleTransactions = require("./testData/simpleTransactions.ignore");

describe("utils/shared/calculateCostBases", () => {
  const cost_basis_types = ["FIFO", "FILO", "FIHO"];

  [
    {
      describeText: "FIFO-Simple",
      itText: "adds cost_basis calculated from first orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { created: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { created: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "LIFO-Simple",
      itText: "adds cost_basis calculated from last orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { created: "2021-01-05T12:09:22.108Z", cost_basis: 2100 },
        { created: "2021-01-20T12:09:22.108Z", cost_basis: 2600 },
      ],
    },
    {
      describeText: "HIFO-Simple",
      itText: "adds cost_basis calculated from highest cost orders for a coin",
      transactions: simpleTransactions,
      expectedCostBases: [
        { created: "2021-01-05T12:09:22.108Z", cost_basis: 2250 },
        { created: "2021-01-20T12:09:22.108Z", cost_basis: 2750 },
      ],
    },
    {
      describeText: "FIFO-Complex",
      itText: "adds cost_basis calculated from first orders for a coin",
      transactions: require("./testData/actualData.ignore.json"),
      expectedCostBases: [
        { created: "2021-01-25T21:57:37.621Z", cost_basis: 3793.74 },
        { created: "2021-04-02T05:33:50.637Z", cost_basis: 2270.67 },
      ],
    },
  ].map(({ describeText, itText, expectedCostBases, transactions }) => {
    describe(describeText, () => {
      const [costBasisType] = describeText.split("-");

      it(itText, () => {
        const result = calculateCostBases(costBasisType, transactions);

        const expectedResult = arraySort(transactions, "created").map(
          (transaction) => {
            const byCreatedDate = ({ created }) =>
              created === transaction.created;

            if (transaction.type === "SELL") {
              const matchingDate = expectedCostBases.find(byCreatedDate);

              transaction.cost_basis = matchingDate.cost_basis;
            } else {
              const matchingResult = result.find(byCreatedDate);

              transaction.realized = matchingResult.realized;
            }

            return { ...transaction };
          }
        );

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
