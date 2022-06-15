import kaboom from "kaboom"

// initialize context
kaboom({
  font: "sink",
  background: [ 210, 210, 155, ],
})

//let load sprit
loadSprite("bean", "sprites/bean.png");
loadSprite("apple", "sprites/apple.png");
loadSprite("bomb", "sprites/bomb.png");



//let load music
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");
loadSound("spring", "sounds/spring.mp3");
loadSound("score", "sounds/score.mp3");
loadSound("game over", "sounds/game over.mp3");


// Lets define some game variables
let SPEED = 620
let BSPEED = 2
let SCORE = 0
let scoreText;
let bg = false;
let backgroundMusic;

// Lets define a function to display our score
const displayScore = ()=>{
  destroy(scoreText)
  // a simple score counter
  scoreText = add([
      text("Score: " + SCORE),
      scale(3),
      pos(width() - 181, 21),
      color(10, 10, 255)
  ])
}

// Lets define a function to play background music
const playBg = ()=>{
  if(!bg){ 
    backgroundMusic = play("OtherworldlyFoe", {volume: 0.5})
    bg = true;
  }
}

// Lets add the player or bean
const player = add([
    sprite("bean"),  // renders as a sprite
    pos(120, 80),    // position in world
    area(),          // has a collider
    scale(1.2), 
])

// Lets add events to our player 
onKeyDown("left", () => {
  playBg()
  player.move(-SPEED, 0)
})

onKeyDown("right", () => {
  playBg()
  player.move(SPEED, 0)
})

onKeyDown("up", () => {
  playBg()
  player.move(0, -SPEED)
})

onKeyDown("down", () => {
  playBg()
  player.move(0, SPEED)
})

// Lets add 4 bomb and a apple on loop
loop(4,()=>{
  for(let i=0; i<4; i++){
    let x = rand(0, width())
    let y = height()

    let c = add([
       sprite("bomb"),   
       pos(x, y),   
       area(),
       scale(0.90), 
       "bomb"
    ])
    c.onUpdate(()=>{
      c.moveTo(c.pos.x, c.pos.y - BSPEED)
    })
  }
  
  let x = rand(0, width())
  let y = height()
  
  // Lets introduce a apple for our programmer to eat
  let c = add([
     sprite("apple"),   
     pos(x, y),   
     area(),
     scale(0.90), 
     "apple"
  ])
  c.onUpdate(()=>{
    c.moveTo(c.pos.x, c.pos.y - BSPEED)
  })
  if(BSPEED<13){ 
    BSPEED +=1
  }
})

player.onCollide("bomb", () => {
  backgroundMusic.volume(0.2)
  play("game over")
  destroy(player)
  addKaboom(player.pos)
  scoreText = add([
      text("Game Over"),
      scale(3),
      pos(10, 21),
      color(10, 10, 255)
  ])
})

player.onCollide("apple", (apple) => {
  backgroundMusic.volume(0.2)
  play("score", {
    volume: 2
  })
  destroy(apple)
  SCORE += 1
  displayScore()
  // 2 seconds until the volume is back
  wait(2, () => {
      backgroundMusic.volume(0.5)
  })
})


// Display the score
displayScore()