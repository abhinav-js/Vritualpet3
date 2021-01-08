var dog, database, foodStock;
var dogImage1, dogImage2, name;
var fedTime, lastFed, foodObj, currentTime;
var feedPetButton, addFoodButton;
var bedroomImage, gardenImage, washroomImage;
var gameState, readState;

function preload() {
  dogImage1 = loadImage("images/dogImg.png");
  dogImage2 = loadImage("images/dogImg1.png");
  bedroomImage = loadImage("virtual pet images/Bed Room.png");
  gardenImage = loadImage("virtual pet images/Garden.png");
  washroomImage = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(800, 800);

  dog = createSprite(400,500,10,10);
  dog.addImage(dogImage1);
  dog.scale = 0.3;
  
  database = firebase.database();
  fedTime = database.ref("feedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  foodObj = new Food();
  
  foodsRef = database.ref("Food");
  foodsRef.on("value",function(data){
    foodStock = data.val();
  });

  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  });

  var nameInput = createInput(name);
  nameInput.position(876,60);
  var saveNameButton = createButton("SAVE NAME");
  saveNameButton.position(1015,60);
  saveNameButton.mousePressed(function(){
    name = nameInput.value();
    database.ref("/").update({
      Name: name
    })
  })

  addFoodButton = createButton("ADD FOOD");
  addFoodButton.position(1110,60);
  addFoodButton.mousePressed(addFoods);
  feedPetButton = createButton("FEED DOG");
  feedPetButton.position(1200,60);
  feedPetButton.mousePressed(feedDog);

}

function draw() {  
  background(color(0,mouseY,0));

  currentTime = hour();
  foodObj.getFoodStock();

  if(gameState !== "hungry") {
    addFoodButton.hide();
    feedPetButton.hide();
    dog.visible = false;
  } else {
    addFoodButton.show();
    feedPetButton.show();
    dog.visible = true;
  }

  if(currentTime === lastFed+1) {
      foodObj.garden();
      update("playing");
  } else if(currentTime === lastFed+2) {
      foodObj.bedroom();
      update("sleeping");
  } else if(currentTime>lastFed+2 && currentTime<=lastFed+4) {
      update("bathing")
      foodObj.washroom();
  } else {
      update("hungry");
      foodObj.display();
  }

  drawSprites();

  textFont("georgia");
  fill(255);
  strokeWeight(3);
  stroke(0);
  if(foodStock !== undefined && gameState==="hungry") {
    textSize(20);
    text("Food Remaining: "+foodStock, 10, 45);
    text("One hour after feeding "+name+", he will go in the garden to play!",20,650);
    text("Two hours after feeding "+name+", he will go in the bedroom to sleep.",20,680);
    text("If it is between 2 and 4 since you last fed "+name+", he will go in the washroom.",20,710);
    text(name+" is hungry. Time to feed "+name+"!",20,740);
  }
  if(lastFed>=12) {
    textSize(20);
    text("Last Fed: "+lastFed%12+" PM", 10, 20);
  } else if(lastFed===0) {
    textSize(20);
    text("Last Fed: Never", 10, 20);
  } else {
    textSize(20);
    text("Last Fed: "+lastFed + " AM", 10, 20);
  }
  if(gameState==="playing") {
    textSize(20);
    text(name+" is playing in the garden!", 10, 40);
  }
  if(gameState==="sleeping") {
    textSize(20);
    text(name+" is sleeping in the bedroom!", 10, 40);
  }
  if(gameState==="bathing") {
    textSize(20);
    text(name+" is bathing in the washroom!", 10, 40);
  }
}

function addFoods() {
  dog.addImage(dogImage1);
  foodStock++;
  database.ref("/").update({
    Food: foodStock
  });
}

function feedDog() {
  dog.addImage(dogImage2);
  foodObj.deductFood(foodStock);
  database.ref("/").update({
    Food: foodStock,
    feedTime: hour()
  })
}

function update(gamestate) {
  database.ref("/").update({
    gameState: gamestate
  })
}