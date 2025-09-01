const game = document.getElementById("world");
const scoreDisplay = document.getElementById("score");
const instructions = document.getElementById("instructions");
const gameOverScreen = document.querySelector(".game-over");
const finalScoreDisplay = document.getElementById("final-score");
const gameReadyScreen = document.querySelector(".game-ready");
const startButton = document.getElementById("start-button");

const gameWidth = 400;
const blockHeight = 30;
let stack = [];
let currentBlock;
let currentPosition = 0;
let currentDirection = 1;
let currentSpeed = 3;
let isPlaying = false;
let animationFrameId;
let score = 0;
let cameraOffset = 0;

function createBlock(width, top) {
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.width = width + "px";
  block.style.top = top + "px";
  block.style.left = "0px";
  game.appendChild(block);
  return block;
}

function startGame() {
  game.innerHTML = "";
  stack = [];
  score = 0;
  scoreDisplay.textContent = score;
  currentPosition = 0;
  currentDirection = 1;
  currentSpeed = 3;
  cameraOffset = 0;
  gameOverScreen.classList.remove("visible");
  gameReadyScreen.classList.remove("visible");
  instructions.style.display = "block";

  const baseWidth = 200;
  const baseTop = window.innerHeight - blockHeight; 
  const baseBlock = {
    element: createBlock(baseWidth, baseTop),
    width: baseWidth,
    left: 100,
    top: baseTop
  };
  baseBlock.element.style.left = baseBlock.left + "px";
  stack.push(baseBlock);

  addMovingBlock();
  isPlaying = true;
  animate();
}

function addMovingBlock() {
  const lastBlock = stack[stack.length - 1];
  const newWidth = lastBlock.width;
  const newTop = lastBlock.top - blockHeight;

  currentPosition = 0;
  currentDirection = 1;

  const element = createBlock(newWidth, newTop);
  element.style.left = currentPosition + "px";

  currentBlock = {
    element,
    width: newWidth,
    left: currentPosition,
    top: newTop
  };
}

function animate() {
  if (!isPlaying) return;

  currentPosition += currentDirection * currentSpeed;

  if (currentPosition + currentBlock.width >= gameWidth) {
    currentPosition = gameWidth - currentBlock.width;
    currentDirection = -1;
  } else if (currentPosition <= 0) {
    currentPosition = 0;
    currentDirection = 1;
  }

  currentBlock.left = currentPosition;
  currentBlock.element.style.left = currentPosition + "px";

  requestAnimationFrame(animate);
}

function placeBlock() {
  if (!isPlaying) return;

  const lastBlock = stack[stack.length - 1];
  const overlap = getOverlap(lastBlock, currentBlock);

  if (overlap <= 0) {
    endGame();
    return;
  }

  const newLeft = Math.max(currentBlock.left, lastBlock.left);
  currentBlock.width = overlap;
  currentBlock.left = newLeft;
  currentBlock.element.style.width = overlap + "px";
  currentBlock.element.style.left = newLeft + "px";

  stack.push(currentBlock);
  score++;
  scoreDisplay.textContent = score;

  currentSpeed += 0.1;

  updateCamera();
  addMovingBlock();
}

function getOverlap(block1, block2) {
  const left1 = block1.left;
  const right1 = block1.left + block1.width;
  const left2 = block2.left;
  const right2 = block2.left + block2.width;

  return Math.min(right1, right2) - Math.max(left1, left2);
}

function updateCamera() {
  const topBlock = stack[stack.length - 1];
  const topY = topBlock.top;

  if (topY < window.innerHeight / 2) {
    cameraOffset = window.innerHeight / 2 - topY;
    game.style.transform = `translateY(${cameraOffset}px)`;
  }
}

function endGame() {
  isPlaying = false;
  instructions.style.display = "none";
  finalScoreDisplay.textContent = `Your score: ${score}`;
  gameOverScreen.classList.add("visible");
  cancelAnimationFrame(animationFrameId);
}

function handleInput() {
  if (!isPlaying) {
    startGame();
  } else {
    placeBlock();
  }
}

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    handleInput();
  }
});
document.addEventListener("click", handleInput);
