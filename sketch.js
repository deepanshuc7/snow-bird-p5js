let bird;                   // Bird object
let pipes = [];             // Array to hold the pipes
let score = 0;              // Current score
let highScore = 0;          // High score
let birdImg;                // Bird image
let snowflakes = [];        // Array to hold snowflakes
let clouds = [];            // Array to hold clouds
let gameState = 'start';    // Initial game state
let pipeDelay = 0;          // Delay between pipe generations

function preload() {
  birdImg = loadImage('assets/bird.png');   // Load bird image from assets folder
}

function setup() {
  createCanvas(400, 600);   // Create a canvas of 400x600 pixels
  initializeGame();         // Initialize game objects
  frameRate(60);            // Set frame rate to 60 frames per second for smooth animation
}

function draw() {
  background(135, 206, 235);   // Set background color to a sky blue

  updateAndShowClouds();      

  if (gameState === 'start') {         // Display start screen if game is in 'start' state
    showStartScreen();
  } else if (gameState === 'play') {     // Play the game if in 'play' state
    playGame();
  } else if (gameState === 'end') {      // Display end screen if game is in 'end' state
    showEndScreen();
  }
}

function initializeGame() {
  bird = new Bird();              // Initialize the bird object
  pipes = [];                     // Reset the pipes array
  score = 0;                      // Reset the score
  pipeDelay = 0;                  // Reset pipe delay
  initializeSnowflakes();           // Initialize snowflakes array
  initializeClouds();               // Initialize clouds array
}

function initializeSnowflakes() {
  snowflakes = [];                            // Reset snowflakes array
  for (let i = 0; i < 100; i++) {             // Create 100 snowflakes
    snowflakes.push(new Snowflake());
  }
}

function initializeClouds() {
  clouds = [];                    // Reset clouds array
  for (let i = 0; i < 5; i++) {      // Create 5 clouds
    clouds.push(new Cloud());
  }
}

function updateAndShowClouds() {
  for (let cloud of clouds) {     
    cloud.update();                   // Update cloud position
    cloud.show();                 // Display cloud
  }
}

function updateAndShowSnowflakes() {
  for (let snowflake of snowflakes) { 
    snowflake.update();               // Update snowflake position
    snowflake.show();                 // Display snowflake
  }
}

function showStartScreen() {
  drawText('Snowy Bird', 48, width / 2, height / 2 - 50);                          // Display title at a fixed position
  drawText('Press SPACE or CLICK to Start', 24, width / 2, height / 2 + 50);         // Display instructions to start
}

function showEndScreen() {
  drawText('Game Over', 48, width / 2, height / 2 - 50);                                 // Display game over text
  drawText(`Score: ${score}`, 32, width / 2, height / 2);                             // Display the final score
  drawText(`High Score: ${highScore}`, 32, width / 2, height / 2 + 40);                   // Display the high score
  drawText('Press R or CLICK to Restart', 32, width / 2, height / 2 + 80);            // Display instructions to restart
}

function drawText(textContent, size, x, y) {
  fill(0);                   
  textSize(size);               
  textAlign(CENTER);            
  text(textContent, x, y);      
}

function playGame() {
  updateAndShowSnowflakes();    // update and display snowflakes
  updateAndShowPipes();         // update and display pipes
  bird.update();                // update bird position
  bird.show();                  // display the bird
  generatePipesWithDelay();     // generate pipes with delay
  displayScores();              // display current score and high score
}

function updateAndShowPipes() {
  for (let i = pipes.length - 1; i >= 0; i--) { // looping pipe array backwards
    pipes[i].show();           
    pipes[i].update();         

    if (pipes[i].hits(bird)) {          // check if the bird hits a pipe
      gameState = 'end';           // end the game if collision occurs
      updateHighScore();           // update high score if necessary
    }

    if (pipes[i].offscreen()) {              // check if the pipe has moved offscreen
      pipes.splice(i, 1);                   // remove pipe from array if offscreen
      score++;                               // increase score
    }
  }
}

function generatePipesWithDelay() {
  if (pipeDelay > 75 && frameCount % 75 === 0) {           // generate a new pipe every 75 frames
    pipes.push(new Pipe());      // add a new pipe to the pipes array
  }
  pipeDelay++;                     // increment pipe delay counter
}

function displayScores() {            // display the scores
  drawText(`Your Score: ${score}`, 24, 80, 30);         
  drawText(`High Score: ${highScore}`, 24, 300, 30);    
}

function updateHighScore() {      // update high score if necessary
  if (score > highScore) {      
    highScore = score;          
  }
}

function keyPressed() {     // initializing the key press event for playing the game
  if (gameState === 'start' && key === ' ') { 
    startGame();
  } else if (gameState === 'play' && key === ' ') { 
    bird.up();
  } else if (gameState === 'end' && key === 'r') {  
    restartGame();
  }
}
function touchStarted() {
  if (gameState === 'start') {  
    startGame();                
  } else if (gameState === 'play') { 
    bird.up();                 
  } else if (gameState === 'end') {  
    restartGame();              
  }
}

function mousePressed() {
  touchStarted();               // Call the touchStarted function to handle both mouse clicks and touch inputs becasue they work the same way 
}

// function mousePressed() {             // initializing the mouse press for playing the game.
//   if (gameState === 'start') {  
//     startGame();
//   } else if (gameState === 'play') { 
//     bird.up();
//   } else if (gameState === 'end') {  
//     restartGame();
//   }
// }

function startGame() {
  gameState = 'play';            // set game state to play
  pipeDelay = 0;                 
  pipes.push(new Pipe());        // make new pipe
}

function restartGame() {        // reinitializing the game objects
  initializeGame();              
  gameState = 'start';           
}

class Bird {
  constructor() {
    this.y = height / 2;         // bird's initial vertical position
    this.x = 64;                 // bird's initial horizontal position
    this.gravity = 0.6;          // gravity for the bird
    this.lift = -15;             // the jump force of the bird
    this.velocity = 0;           // initial velocity 0
  }

  show() {
    push();                      
    translate(this.x, this.y);   // moving the origin to the bird's position
    let angle = map(this.velocity, -15, 15, -PI / 6, PI / 6); // calculating the angle based on velocity
    rotate(angle);               // rorating the bird based on its velocity
    imageMode(CENTER);          
    image(birdImg, 0, 0, 32, 32); 
    pop();                     
  }

  up() {
    this.velocity += this.lift;  //  when the bird jumps the life force is applied
  }

  update() {
    this.velocity += this.gravity; // adding gravity for the bird
    this.y += this.velocity;       // updaing bird's vertical position
    this.velocity *= 0.9;          // damping

    if (this.y > height) {         // if the bird hits the ground
      this.y = height;             
      this.velocity = 0;           // downward velocity end
    }

    if (this.y < 0) {              // if the bird hits the top of the screen
      this.y = 0;                  
      this.velocity = 0;           // upward velocity end
    }
  }
}

class Pipe {
  constructor() {
    this.spacing = 150;          // spacing between top and bottom of the pipe
    this.top = random(height / 6, 3 / 4 * height); // randomize the height of the top pipe
    this.bottom = height - (this.top + this.spacing); // calculate the height of the bottom pipe
    this.x = width;              //  initial horizontal position of the pipe
    this.w = 40;                 //  width of the pipe
    this.speed = 3;              // speed of the pipe movement
  }

  hits(bird) {            // if the bird collides with the top or bottom pipe
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;             
      }
    }
    return false;                
  }

  show() {
    fill(34, 139, 34);            // pipe color green
    stroke(0);                   

    // drawing the pipe
    rect(this.x, 0, this.w, this.top); 
    rect(this.x - 5, this.top - 20, this.w + 10, 20); 
    rect(this.x, height - this.bottom, this.w, this.bottom); 
    rect(this.x - 5, height - this.bottom, this.w + 10, 20); 

    drawSnowOnPipe(this.x, this.top, this.w);            
    drawSnowOnPipe(this.x, height - this.bottom, this.w, true); 
  }

  update() {
    this.x -= this.speed;         // moving the pipe to the left
  }

  offscreen() {
    return this.x < -this.w;      
  }
}

function drawSnowOnPipe(x, y, w, isBottom = false) {
  fill(255);                     
  noStroke();                    
  beginShape();                 
  vertex(x - 5, y + (isBottom ? 20 : -20)); 
  vertex(x + w + 5, y + (isBottom ? 20 : -20));
  vertex(x + w + 5, y + (isBottom ? 15 : -25));
  vertex(x + w / 2, y + (isBottom ? 10 : -30));
  vertex(x - 5, y + (isBottom ? 15 : -25));
  endShape(CLOSE);               
}
class Snowflake {
  constructor() {
    this.x = random(width);        // random horizontal position
    this.y = random(-height, 0);   // random vertical position 
    this.size = random(2, 5);      // random size for the snowflake
    this.speed = random(1, 3);     // random fall speed
  }

  update() {
    this.x -= this.speed / 2;      // moving the snow left as it falls
    this.y += this.speed;          // moving snow downwards

    if (this.x < 0) {              // wrapping around the screen horizontally
      this.x = width;
    }
    if (this.y > height) {         // reset when offscreen
      this.y = random(-height, 0);
    }
  }

  show() {
    fill(255);                     
    noStroke();                   
    ellipse(this.x, this.y, this.size); // drawing snowflake as circle with white fill
  }
}

class Cloud {
  constructor() {
    this.x = random(width);        // random horizontal position
    this.y = random(height / 2);   // random vertical position in the upper half
    this.size = random(50, 100);   // random size for the cloud
    this.speed = random(0.5, 2);   //random speed for the cloud movement
  }

  update() {
    this.x -= this.speed;          // moving the cloud to the left
    if (this.x < -this.size) {     
      this.x = width + this.size;
      this.y = random(height / 2); // reset to a random vertical position
    }
  }

  show() {    // show the cloud
    fill(255);                    
    noStroke();                   
    ellipse(this.x, this.y, this.size, this.size / 2); 
    ellipse(this.x + this.size / 2, this.y + 10, this.size / 2, this.size / 3); 
    ellipse(this.x - this.size / 2, this.y + 10, this.size / 2, this.size / 3); 
  }
}
