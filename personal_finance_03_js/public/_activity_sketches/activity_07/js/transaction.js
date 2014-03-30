//TRANSACTIONS
//------------
function initTransaction(obj, data){
  //Variables
  obj.description = data.description;
  obj.category = data.category;
  obj.amount = data.amount;
  obj.date = new Date(data.date);
  obj.type = data.type;
}