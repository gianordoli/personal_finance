class Transaction{
  String description;
  String category;
  float amount;
  int[][] date; //day, month, year
  
  Transaction(String _description, String _category, float _amount){
    description = _description;
    category = _category;
    amount = _amount;
  }

}
