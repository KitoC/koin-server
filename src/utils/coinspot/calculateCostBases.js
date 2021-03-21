const arraySort = require("array-sort");
const sumBy = require("lodash/sumBy");

const calculateCostBases = (type, transactions = []) => {
  const sortedTransactions = {
    buyorders: arraySort(transactions.buyorders, "created"),
    sellorders: arraySort(transactions.sellorders, "created"),
  };
  let balance = 0;
  let buyorders = arraySort(transactions.buyorders, "created").map((o) => {
    o.realized = 0;
    return o;
  });

  sortedTransactions.sellorders = sortedTransactions.sellorders.map((order) => {
    const filterByCreationDate = ({ created }) => created <= order.created;
    const filterFullyRealizedBuyOrders = ({ realized, amount }) =>
      realized !== amount;
    let costBasis = [];

    buyorders = buyorders
      .map((o) => {
        if (o.created <= order.created) {
          const amountNotRealised = order.amount - sumBy(costBasis, "amount");

          if (amountNotRealised) {
            const amountLeftUnrealized = o.amount - o.realized;
            const realized =
              amountNotRealised > amountLeftUnrealized
                ? amountLeftUnrealized
                : amountLeftUnrealized - amountNotRealised;

            const fraction = o.amount / realized;

            o.realized += realized;

            costBasis.push({
              amount: realized,
              audtotal: o.audtotal / fraction,
            });
          }
        }

        return o;
      })
      .filter(filterFullyRealizedBuyOrders);

    order.cost_basis = sumBy(costBasis, "audtotal");
    order.profit = order.audtotal - order.cost_basis;

    return order;
  });

  return {
    buyorders: sortedTransactions.buyorders
      .map(({ realized, ...rest }) => rest)
      .reverse(),
    sellorders: sortedTransactions.sellorders.reverse(),
  };
};

module.exports = calculateCostBases;
