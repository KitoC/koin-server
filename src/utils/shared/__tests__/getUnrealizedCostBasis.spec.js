const calculateCostBases = require("../calculateCostBases");
const getUnrealizedCostBasis = require("../getUnrealizedCostBasis");
const arraySort = require("array-sort");

const simpleTransactions = require("./testData/simpleTransactions.ignore");

describe("utils/shared/getUnrealizedCostBasis", () => {
  const cost_basis_types = ["FIFO", "FILO", "FIHO"];

  [
    {
      describeText: "FIFO-Simple",
      itText:
        "gets unrealized cost_basis calculated from first orders for a coin",
      transactions: simpleTransactions,
      expected: 3100,
    },
    {
      describeText: "LIFO-Simple",
      itText:
        "gets unrealized cost_basis calculated from last orders for a coin",
      transactions: simpleTransactions,
      expected: 3100,
    },
    {
      describeText: "HIFO-Simple",
      itText:
        "gets unrealized cost_basis calculated from highest cost orders for a coin",
      transactions: simpleTransactions,
      expected: 2800,
    },
  ].map(({ describeText, itText, expected, transactions }) => {
    describe(describeText, () => {
      const [costBasisType] = describeText.split("-");

      it(itText, () => {
        const result = getUnrealizedCostBasis(
          calculateCostBases(costBasisType, transactions)
        );

        expect(result).toEqual(expected);
      });
    });
  });
});
