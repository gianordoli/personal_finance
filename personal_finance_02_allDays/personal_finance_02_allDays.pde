/*----- DATA -----*/
ArrayList<Transaction> activity;
int totalMonths;
int totalDays;
float maxAmount;

void setup() {
  
  size(1136, 640);
  colorMode(HSB);
   
  /*----- DATA -----*/  
  activity = new ArrayList<Transaction>();
  String filename = "transactions.tsv";  
  parseData(filename);
  
  totalMonths = getTotalMonths();
  totalDays = getTotalDays();
  maxAmount = getMaxAmount();
  
  debug();
}

void draw() {
  background(255);
  PVector pos = new PVector(0, height);
  PVector size = new PVector(width/totalDays, 0);
  
  fill(0, 150, 255);
  
  for(int i = activity.size() - 1; i > 0; i--){
    Transaction thisTransaction = activity.get(i);
    
    //New month?
    if(i > 0){
      if(thisTransaction.month != activity.get(i - 1).month){
        line(pos.x, 0, pos.x, height);
      }
      if(thisTransaction.day != activity.get(i - 1).day){
        pos.x += size.x;
      }      
    }
    
    size.y = map(thisTransaction.amount, 0, maxAmount, 0, height);
    
    rect(pos.x, pos.y, size.x, -size.y);
  }
  noLoop();
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

int getTotalDays(){
  int myTotalDays = 0;
  int currDay = 0;
  for(int i = 0; i < activity.size(); i++){
    Transaction thisTransaction = activity.get(i);
    if(thisTransaction.day != currDay){
      myTotalDays ++;
      currDay = thisTransaction.day;
    }
  }
  return myTotalDays;
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
  println("total days: " + totalDays);
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
