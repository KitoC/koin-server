const getTotalSoldCostBasis = require("../getTotalSoldCostBasis");
const calculateCostBases = require("../calculateCostBases");
const getCoinsOwnTransactions = require("../getCoinsOwnTransactions");

describe("utils/shared/getTotalSoldCostBasis", () => {
  describe("when provided a coin balance object and transactions", () => {
    const coin = { short_name: "BTC", rate: 2, balance: 100, fiat_value: 200 };

    [
      {
        describeText: "FIFO",
        expected: 100,
      },
      {
        describeText: "LIFO",
        expected: 50,
      },
      {
        describeText: "HIFO",
        expected: 100,
      },
    ].forEach(({ describeText, expected }) => {
      const transactions = calculateCostBases(
        describeText,
        getCoinsOwnTransactions(coin, require("./testData/testData.ignore"))
      );

      const result = getTotalSoldCostBasis(transactions);

      describe(`when ${describeText}`, () => {
        it("adds all sold transaction costBases and returns a total", () => {
          expect(result).toEqual(expected);
        });
      });
    });
  });
});
