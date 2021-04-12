const calculateCostBases = require("../calculateCostBases");
const getRealizedProfit = require("../getRealizedProfit");
const arraySort = require("array-sort");

const simpleTransactions = require("./testData/simpleTransactions.ignore");

describe("utils/shared/getRealizedProfit", () => {
  const cost_basis_types = ["FIFO", "FILO", "FIHO"];

  [
    {
      describeText: "FIFO-Simple",
      itText: "sums realized profit calculated from first orders for a coin",
      transactions: simpleTransactions,
      expected: 1300,
    },
    {
      describeText: "LIFO-Simple",
      itText: "sums realized profit calculated from last orders for a coin",
      transactions: simpleTransactions,
      expected: 1300,
    },
    {
      describeText: "HIFO-Simple",
      itText:
        "sums realized profit calculated from highest cost orders for a coin",
      transactions: simpleTransactions,
      expected: 1000,
    },
  ].map(({ describeText, itText, expected, transactions }) => {
    describe(describeText, () => {
      const [costBasisType] = describeText.split("-");

      it(itText, () => {
        const result = getRealizedProfit(
          calculateCostBases(costBasisType, transactions)
        );

        expect(result).toEqual(expected);
      });
    });
  });
});
