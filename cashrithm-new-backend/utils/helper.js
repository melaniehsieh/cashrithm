exports.checkGreaterThan = (value1, value2) => {
  const newObj = {};
  if(value1.total_revenue > value2.total_expense) {
    newObj["vendor"] = value1.revenue_vendor;
    newObj["revenue_expense_difference"] = value1.total_revenue - value2.total_expense;
  };
  if(value1.total_revenue < value2.total_expense) {
    newObj["vendor"] = value1.revenue_vendor;
    newObj["revenue_expense_difference"] = value2.total_expense - value1.total_revenue;
  };
  
  return newObj;
};

/*if(totalExpenseByVendor.includes(el.revenue_vendor)) {
      if(el.total_revenue > totalExpenseByVendor[i].total_expense) {
        newObj["vendor"] = el.revenue_vendor;
        newObj["revenue_expense_difference"] = el.total_revenue - totalExpenseByVendor[i].total_expense;
      }
      if(el.total_revenue < totalExpenseByVendor[i].total_expense) {
        newObj["vendor"] = el.revenue_vendor;
        newObj["revenue_expense_difference"] = totalExpenseByVendor[i].total_expense - el.total_revenue;
      }
    }*/