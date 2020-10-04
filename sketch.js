var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var dieSound,jumpSound,checkSound;

var restart, restartImage, gameOver,gameOverimage

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  restartImage=loadImage("restart.png");
  gameOverimage=loadImage("gameOver.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  dieSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
  checkSound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.debug=false
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,35);
                   
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  restart=createSprite(300,120,20,20);
  restart.addImage(restartImage);
  restart.scale=0.5;
  gameOver=createSprite(300,80,50,20);
  gameOver.addImage(gameOverimage);
  gameOver.scale=0.5;
  
  
  score = 0;
}
function draw() {
   background(rgb(255,99,71));
    text("Score: "+ score, 500,50);
  
  //allows only the codes that are supposed to play in play gamestate play
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(10+score/200);
    // allows trex to jump
   if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    //adds gravity
    trex.velocityY = trex.velocityY + 0.8;
   
    //updates the score
    if (frameCount%5===0){
    score=score+1;
    }
    //shifts the ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
     //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
     
    if (score>0 && score%100===0){
      checkSound.play();
    }
    //makes restart and gameover invisible
    restart.visible=false;
    
    gameOver.visible=false;
    //chnges the gamestate to end when trex touches the obstacles
    if (obstaclesGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();

    }
  }
   //allows only the codes that are supposed to play in end gamestate play
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    
    trex.changeAnimation("collided", trex_collided);
    trex.scale=0.5;
    trex.velocityY=0;
   
    //making velocity x 0 for cloud and obsacle groups
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    //makes restart and gameover visible
    restart.visible=true;
    
    gameOver.visible=true;
    
    //resets the game when space or restart button is pressed
    if (mousePressedOver(restart)|| keyDown("space")){
     reset();
    }
    
  }
  
  //allows the trex to stand on the ground
  trex.collide(invisibleGround);
  
  //draw all the sprites
  drawSprites();
}

function spawnObstacles(){
  //spawns obstacles after every 140 frames
  if (frameCount%140===0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX=-(7+score/200); 

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount%100===0){
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX=-2;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}
function reset(){
  gameState=PLAY;
  cloudsGroup.destroyEach();
  score=0;
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
}