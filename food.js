class Food {
    constructor() {
        this.image = loadImage("images/Milk.png");
        this.foodStock = database.ref("Food");
        this.foodStock = foodStock;
        this.lastfed = database.ref("feedTime");
    }

    getFoodStock() {
        var foodRef = database.ref("Food");
        foodRef.on("value",function(data){
            foodStock = data.val();
        })
    }
        
    updateFoodStock(food) {
        database.ref("/").update({
            Food : food
        })
    }
    
    deductFood(x) {
        if(x <= 0) {
            x = 0;
          } else {
            x--;
          }
        database.ref("/").update({
            Food: x
        })
    }

    display() {
        var x = 80
        var y = 100;
        imageMode(CENTER);
        if(foodStock!==0) {
            for(var i=0;i < foodStock;i++) {
                if(i%10===0) {
                    x=80;
                    y=y+50;
                }
                image(this.image,y,x,50,50);
                x = x+30;
            }
        }
    }

    bedroom(){
        background(bedroomImage, 550, 500);
    }

    garden(){
        background(gardenImage, 550, 500);
    }

    washroom(){
        background(washroomImage, 550, 500);
    }
}
