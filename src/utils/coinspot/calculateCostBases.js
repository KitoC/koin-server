const arraySort = require("array-sort");
const sumBy = require("lodash/sumBy");

const addZeroRealized = (order) => {
  order.realized = 0;

  return order;
};
const stripRealized = (order) => {
  delete order.realized;

  return order;
};

const filterByType = (type) => (order) => type === order.type;

const calculateCostBases = (type, transactions = []) => {
  const sortedTransactions = arraySort(transactions, "created");
  let buyorders = sortedTransactions
    .filter(filterByType("BUY"))
    .map(addZeroRealized);
  let sellorders = sortedTransactions.filter(filterByType("SELL"));

  sellorders = sellorders.map((sellorder) => {
    const filterByCreationDate = ({ created }) => created <= sellorder.created;
    const filterFullyRealizedBuyOrders = ({ realized, amount }) =>
      realized !== amount;
    let costBasis = [];

    buyorders = buyorders
      .map((buyorder) => {
        if (buyorder.created <= sellorder.created) {
          const amountNotRealised =
            sellorder.amount - sumBy(costBasis, "amount");

          if (amountNotRealised) {
            const amountLeftUnrealized = buyorder.amount - buyorder.realized;
            const realized =
              amountNotRealised > amountLeftUnrealized
                ? amountLeftUnrealized
                : amountLeftUnrealized - amountNotRealised;

            const fraction = buyorder.amount / realized;

            buyorder.realized += realized;

            costBasis.push({
              amount: realized,
              audtotal: buyorder.audtotal / fraction,
            });
          }
        }

        return buyorder;
      })
      .filter(filterFullyRealizedBuyOrders);

    sellorder.cost_basis = sumBy(costBasis, "audtotal");
    sellorder.profit = sellorder.audtotal - sellorder.cost_basis;

    return sellorder;
  });

  return arraySort(
    [
      ...sortedTransactions.filter(filterByType("BUY")).map(stripRealized),
      ...sellorders,
    ],
    "created"
  );
};

module.exports = calculateCostBases;
