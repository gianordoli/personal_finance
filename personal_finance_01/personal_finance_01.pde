/*----- DATA -----*/
import java.util.Map;
ArrayList<Transaction> activity;
int maxInMonth;

/*----- VISUALS -----*/
PFont regular;
int textSize;

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
    println("amount: " + thisTransaction.amount);
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

//    String type = thisRow[1];
//    String borough = thisRow[3];
    activity.add(new Transaction(description, category, amount));
//
//    //Adding the type to our list of types
//    if (!myTypes.containsKey(type)) {      
//      myTypes.put(type, 0);
//    }
//    //Adding the boroughs
//    if (!myBoroughs.containsKey(borough)) {
//      myBoroughs.put(borough, 0);      
//      //      println("line: " + i + ", borough: " + borough);
//    }
  }  
  
}
