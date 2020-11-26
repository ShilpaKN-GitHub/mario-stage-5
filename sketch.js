var canvas;
var backgroundImage;
var mario, marioImage, marioHeadImage, marioDeadImage;
var ground, groundImage, invisibleGround;
var enemy, enemy1, enemy2, enemy3, enemy4, enemy5, enemyGroup;
var coin, coinGroup, coinImage;
var pipe, pipeGroup, pipeImage;
var cloud, cloudGroup, cloudImage;
var bullet, bulletGroup, bulletImage;
var instruction, instructionImage;
var gameOver, gameOverImage;
var restart, restartImage;
var survivalTime, coinCount;

const PLAY = 1;
const END = 0;
var gameState = PLAY;

function preload()
{
    backgroundImage = loadImage("images/bg.png");

    groundImage = loadImage("images/ground.png");
    cloudImage = loadImage("images/cloud.png");
    coinImage = loadImage("images/coin.png");
    bulletImage = loadImage("images/bullet.png");
    pipeImage = loadImage("images/pipes.png");
    instructionImage = loadImage("images/text.png");
    gameOverImage = loadImage("images/gameOver.png");
    restartImage = loadImage("images/restart.png");
    
    marioImage = loadAnimation(
        "images/mario_01.png",
        "images/mario_02.png",
        "images/mario_03.png",
        "images/mario_04.png");
    marioDeadImage = loadImage("images/mario_dead.png");
    marioHeadImage = loadImage("images/mario_head.png");

    enemy1 = loadImage("images/enemy_01.png");
    enemy2 = loadImage("images/enemy_02.png");
    enemy3 = loadImage("images/enemy_03.png");
    enemy4 = loadImage("images/enemy_04.png");
    enemy5 = loadImage("images/enemy_05.png");
}

function setup()
{
    canvas = createCanvas(displayWidth - 450, displayHeight - 200);
    canvas.position(25, 25);

    survivalTime = 0;
    coinCount = 0;

    ground = createSprite(width - 100, height - 10, width, 20);
    ground.addImage(groundImage);
    ground.scale = 0.7;

    invisibleGround = createSprite(width/2, height - 9, width, 20);
    invisibleGround.visible = false;

    mario = createSprite(80, height - 40, 50, 50);
    mario.addAnimation("mario", marioImage);
    mario.addAnimation("dead", marioDeadImage);
    mario.addAnimation("head", marioHeadImage);
    mario.scale = 0.5;

    gameOver = createSprite(width/2, height/3);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.3;
    gameOver.visible = false;

    restart = createSprite(width/2, height/2);
    restart.addImage(restartImage);
    restart.scale = 0.3;
    restart.visible = false;

    instruction = createSprite(width/2 - 20, 50);
    instruction.addImage(instructionImage);
    instruction.scale = 0.6;

    enemyGroup = new Group();
    pipeGroup = new Group();
    bulletGroup = new Group();
    coinGroup = new Group();
    cloudGroup = new Group();

    fill("black");
    stroke("black");
    textSize(20);
    textFont("cambria");
}

function draw()
{
    background(backgroundImage);

    text("Survival Time : " + survivalTime, 40, 25);
    text("COIN COUNT : " + coinCount, width - 220, 25);

    if(gameState === PLAY)
    {
        if(frameCount % 20 === 0)
        {
            survivalTime++;
        }

        ground.velocityX = -5;
        if(ground.x < 0)
        {
            ground.x = width;
        }

        if(touches.length > 0 || keyDown(UP_ARROW) && mario.isTouching(ground))
        {
            mario.velocityY = -15;
            touches = [];
        }
        mario.velocityY = mario.velocityY + 0.8;

        if(touches.length > 0 || keyDown("space"))
        {
            releaseBullet();
            touches = [];
        }

        if(bulletGroup.isTouching(enemyGroup))
        {
            bulletGroup.destroyEach();
            enemyGroup.destroyEach();
            survivalTime += 2;
        }

        for(var i = 0; i <coinGroup.length; i++)
        {
            if(coinGroup.isTouching(mario))
            {
                coinGroup.get(i).destroy();
                coinCount++;
            }
        }

        if(enemyGroup.isTouching(mario))
        {
            survivalTime--;
            gameState = END;
        }

        if(pipeGroup.isTouching(mario))
        {
            console.log(mario.y)
            if(mario.isTouching(ground))
            {
                survivalTime--;
                gameState = END;
            }
            else
            {
                mario.collide(pipeGroup);
                mario.changeAnimation("head", marioHeadImage);
            }
        }
        
        if(mario.isTouching(invisibleGround))
        {
            mario.changeAnimation("mario", marioImage);
        }

        mario.x = 80;
        spawnEnemy();
        spawnPipe();
        spawnCoin();
        spawnCloud();
    }

    if(gameState === END)
    {
        pipeGroup.destroyEach();
        coinGroup.destroyEach();
        cloudGroup.destroyEach();
        enemyGroup.destroyEach();
        bulletGroup.destroyEach();

        ground.velocityX = 0;

        mario.velocityY = 0;
        mario.changeAnimation("dead", marioDeadImage);
        mario.scale = 1;
        mario.y = height - 10;
        mario.x = width/2;

        gameOver.visible = true;
        restart.visible = true;

        if(touches.length > 0 || mousePressedOver(restart))
        {
            gameState = PLAY;

            restart.visible = false;
            gameOver.visible = false;
            
            mario.changeAnimation("mario", marioImage);
            mario.x = 80;
            mario.scale = 0.4;
            
            survivalTime = 0;
            coinCount = 0;
            touches = [];
        }
    }

    mario.collide(invisibleGround);
    drawSprites();
}

function releaseBullet()
{
    if(bulletGroup.length > 0)
    {
        bulletGroup.destroyEach();
    }
    bullet = createSprite(mario.x, mario.y, 20, 10);
    bullet.addImage(bulletImage);
    bullet.scale = 0.1;
    bullet.velocityX = 5;
    bulletGroup.add(bullet);
}

function spawnEnemy()
{
    if(frameCount % 300 === 0)
    {
        enemy = createSprite(width, height - 55, 50, 50);
        enemy.velocityX = -4;

        var rand = Math.round(random(1, 5));
        switch(rand)
        {
            case 1:
                enemy.addImage(enemy1);
                break;
            case 2:
                enemy.addImage(enemy2);
                break;
            case 3:
                enemy.addImage(enemy3);
                break;
            case 4:
                enemy.addImage(enemy4);
                break;
            case 5:
                enemy.addImage(enemy5);
                break;
            default: break;
        }

        enemy.scale = 0.4;
        enemy.lifetime = 300;

        mario.depth = enemy.depth + 1;

        enemyGroup.add(enemy);
    }
}

function spawnPipe()
{
    if(frameCount % 200 === 0)
    { 
        pipe = createSprite(width, height - 70, 10, 10);
        pipe.addImage(pipeImage);
        pipe.scale = 1;
        pipe.velocityX = -5;
        pipe.lifetime = 200;

        mario.depth = pipe.depth + 1;

        pipeGroup.add(pipe);
    }
}

function spawnCoin()
{
    if(frameCount % 100 === 0)
    {
        coin = createSprite(width, height / 2 + 50, 10, 10);
        coin.addImage(coinImage);
        coin.scale = 0.4;
        coin.velocityX = -4;
        coin.lifetime = 200;

        mario.depth = coin.depth + 1;

        coinGroup.add(coin);
    }
}

function spawnCloud()
{
    if(frameCount % 100 === 0)
    { 
        cloud = createSprite(width, random(80, 250), 10, 10);
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -2;
        cloud.lifetime = 400;

        mario.depth = cloud.depth + 1;

        cloudGroup.add(cloud);
    }
}