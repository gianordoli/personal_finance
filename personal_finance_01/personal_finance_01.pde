/*----- DATA -----*/
ArrayList<Transaction> activity;
int totalMonths;
float maxAmount;

void setup() {
  
  size(640, 1136);
  colorMode(HSB);
   
  /*----- DATA -----*/  
  activity = new ArrayList<Transaction>();
  String filename = "transactions.tsv";  
  parseData(filename);
  
  totalMonths = getTotalMonths();
  maxAmount = getMaxAmount();
  
  debug();
}

void draw() {
  background(255);
  PVector pos = new PVector();
  PVector size = new PVector();
  int currMonth = 1;
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    
    //New month?
    if(i > 0){
      if(thisTransaction.month != activity.get(i - 1).month){
        currMonth ++;
      }    
    }

    pos.x = map(thisTransaction.day, 0, 31, 0, width);
    pos.y = map(currMonth, 1, totalMonths, height/totalMonths, height);
    
//    size.x
    
  }
}

float getMaxAmount(){
  float myMaxAmount = 0;
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    if(thisTransaction.amount > myMaxAmount){
      myMaxAmount = thisTransaction.amount;
    }
  }
  return myMaxAmount;
}
  
int getTotalMonths(){
  int myTotalMonths = 0;
  int currMonth = 0;
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    if(thisTransaction.month != currMonth){
      myTotalMonths ++;
      currMonth = thisTransaction.month;
    }
  }
  return myTotalMonths;
}

void debug(){
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    print("description: " + thisTransaction.description + "\t");
    print("category: " + thisTransaction.category + "\t");
    print("amount: " + thisTransaction.amount + "\t");
    println("date: " + thisTransaction.month + "\\" + thisTransaction.day + "\\" +thisTransaction.year);
  }
  
  println("total months: " + totalMonths);
  println("max amount: " + maxAmount);  
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

    String type = trim(thisRow[4]);
//    println(type);
    if(!type.equals("credit")){
      activity.add(new Transaction(description, category, amount, year, month, day));
    }
  }  
}
