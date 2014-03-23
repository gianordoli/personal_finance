/*----- DATA -----*/
ArrayList<Transaction> activity;

void setup() {
  
  size(640, 1136);
  colorMode(HSB);
   
  /*----- DATA -----*/  
  activity = new ArrayList<Transaction>();
  String filename = "transactions.tsv";  
  parseData(filename);

  debug();
}

void draw() {

}

void debug(){
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    print("description: " + thisTransaction.description + "\t");
    print("category: " + thisTransaction.category + "\t");
    print("amount: " + thisTransaction.amount + "\t");
    println("date: " + thisTransaction.month + "\\" + thisTransaction.day + "\\" +thisTransaction.year);
  }
}

void parseData(String filename){  
  String[] rawData = loadStrings(filename);
  for (int i = 1; i < rawData.length; i++) {
    String[] thisRow = split(rawData[i], "\t");
//    println(thisRow);
    String description = thisRow[1];
    String category = thisRow[5];    
    float amount = parseFloat(thisRow[3]);
    String dateString = thisRow[0];
    int month = parseInt(dateString.substring(0, dateString.indexOf('/')));
//    println(month);
    dateString = dateString.substring(dateString.indexOf('/') + 1);
//    println(dateString);    
    int day = parseInt(dateString.substring(0, dateString.indexOf('/')));
//    println(day);    
    int year = parseInt(dateString.substring(dateString.indexOf('/') + 1));
//    println(dateString);

    activity.add(new Transaction(description, category, amount, year, month, day));
  }  
}
