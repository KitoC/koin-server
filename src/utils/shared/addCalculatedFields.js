const sum = require("lodash/sum");

const getPercentageDifference = (difference, original) => {
  return (difference / original) * 100;
};

const addCalculatedFields = ({ transactions, coin }) => {
  const { aud_balance, short_name } = coin;
  const filterByShortName = ({ market }) => market.includes(short_name);

  const buy_orders = transactions.buyorders.filter(filterByShortName);
  const sell_orders = transactions.sellorders.filter(filterByShortName);

  const getAudTotal = ({ audtotal }) => audtotal;
  const total_buy_order_amount = sum(buy_orders.map(getAudTotal));
  const total_sell_order_amount = sum(sell_orders.map(getAudTotal));
  const total_aud_spent = total_buy_order_amount - total_sell_order_amount;

  const profit = aud_balance - total_aud_spent;

  const percentage_difference = getPercentageDifference(
    profit,
    total_aud_spent
  );

  const gainz = aud_balance + total_sell_order_amount - total_buy_order_amount;

  return {
    // profit,
    // total_aud_spent,
    total_buy_order_amount,
    total_sell_order_amount,
    percentage_difference,
    ...coin,
    buy_orders,
    sell_orders,
    gainz,
  };
};

module.exports = addCalculatedFields;
