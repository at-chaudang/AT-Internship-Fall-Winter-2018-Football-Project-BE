module.exports = function(startDate) {
  let dates = [];
  let days = 1;
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + ++days);

  for (var i = 0; i <= 31; i++) {
    let timeStamp =
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    dates.push(new Date(timeStamp).toLocaleString());
  }
  return dates;
}
