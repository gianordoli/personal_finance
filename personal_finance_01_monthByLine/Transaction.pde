class Transaction{
  String description;
  String category;
  float amount;
  int year;
  int month;
  int day;
  
  Transaction(String _description, String _category, float _amount, int _year, int _month, int _day){
    description = _description;
    category = _category;
    amount = _amount;
    year = _year;
    month = _month;
    day = _day;
  }
}
