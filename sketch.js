var PLAY = 1;
var END = 0;
var gameState = PLAY;

var car;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  carImage = loadImage("car.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  restartImg = loadImage("restart.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  

  car = createSprite(50,180,20,50);
  
  car.addImage("moving", carImage);

  car.scale = 0.25;
  
  ground = createSprite(200,180,1000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  car.setCollider("rectangle",0,0,car.width,car.height);
  car.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/500)
    //scoring
    score = score + Math.round(frameCount/60);
    
    if(score>0 && score%500 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& car.y >= 130) {
        car.velocityY = -14;
        jumpSound.play();
    }
    
    //add gravity
    car.velocityY = car.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(car)){
        //car.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      restart.visible = true;
       
      ground.velocityX = 0;
      car.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop car from falling down
  car.collide(invisibleGround);
  

  if(mousePressedOver(restart))
  {
    reset ()
  }

  drawSprites();
}

function reset()
{
  gameState = PLAY
  restart.visible = false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.025;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = car.depth;
    car.depth = car.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

