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

}

void parseData(String filename){  

}
