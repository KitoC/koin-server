const addCalculatedFields = require("../addCalculatedFields");

describe("utils/shared/addCalculatedFields", () => {
  describe("when provided a coin balance object and transactions", () => {
    const transactions = require("./testData/testData.ignore");

    const coin = { short_name: "BTC", rate: 2, balance: 100, fiat_value: 200 };

    const getResults = (cost_basis_type = "FIFO") =>
      addCalculatedFields({
        transactions,
        coin,
        options: { cost_basis_type },
      });

    [
      {
        describeText: "FIFO",
        expected: {
          unrealized_profit: 100,
        },
      },
      {
        describeText: "LIFO",
        expected: {
          unrealized_profit: 150,
        },
      },
      {
        describeText: "HIFO",
        expected: {
          unrealized_profit: 100,
        },
      },
    ].forEach(({ describeText, expected }) => {
      const result = getResults(describeText);

      describe(`when ${describeText}`, () => {
        it("adds coins own transactions to coin object", () => {
          expect(result.transactions.length).toEqual(3);
        });

        // it("adds unrealized profit to coin object", () => {
        //   expect(result.unrealized_profit).toEqual(expected.unrealized_profit);
        // });

        // it("adds cost basis to coin object", () => {
        //   expect(result.cost_basis).toEqual(3);
        // });

        // it("sums the amount of fiat spent and adds to coin object as 'total_fiat_spent'", () => {
        //   expect(result.total_buy_order_amount).toEqual(10);
        // });

        // it("sums the amount of fiat spent and adds to coin object as 'total_fiat_spent'", () => {
        //   expect(result.total_sell_order_amount).toEqual(1);
        // });

        // it("sums the amount of fiat spent and adds to coin object as 'total_fiat_spent'", () => {
        //   expect(result.total_fiat_spent).toEqual(10);
        // });
      });
    });
  });
});
