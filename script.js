  const container = document.getElementById("gameContainer");
  const player = document.getElementById("player");
  const gameOverText = document.getElementById("game-over");
  const scoreBoard = document.getElementById("scoreBoard");

  let playerX = 165;
  const step = 5;
  let moveInterval;
  let gameRunning = true;
  let score = 0;
  let baseSpeed = 5;
  let maxSpeed = 15;

  function startMoving(direction) {
    if (!gameRunning) return;

    stopMoving();
    moveInterval = setInterval(() => {
      const maxX = container.clientWidth - player.clientWidth;
      if (direction === "left" && playerX > 0) {
        playerX -= step;
      } else if (direction === "right" && playerX < maxX) {
        playerX += step;
      }
      player.style.left = playerX + "px";
    }, 20);
  }

  function stopMoving() {
    clearInterval(moveInterval);
  }

  function createEnemy() {
    if (!gameRunning) return;

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.floor(Math.random() * (container.clientWidth - 30)) + "px";
    container.appendChild(enemy);

    let enemyY = 0;
    // दुश्मन की गति स्कोर के आधार पर बढ़ाएं
    let speed = Math.min(baseSpeed + Math.floor(score / 10), maxSpeed);

    const interval = setInterval(() => {
      if (!gameRunning) {
        clearInterval(interval);
        enemy.remove();
        return;
      }

      enemyY += speed;
      enemy.style.top = enemyY + "px";

      if (isColliding(player, enemy)) {
        gameOver();
        clearInterval(interval);
        return;
      }

      if (enemyY > container.clientHeight) {
        clearInterval(interval);
        enemy.remove();
        // स्कोर बढ़ाएं जब दुश्मन स्क्रीन से बाहर चला जाए
        score++;
        scoreBoard.innerText = "Score: " + score;
      }
    }, 30);
  }

  function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  }

  function gameOver() {
    gameRunning = false;
    stopMoving();
    gameOverText.style.display = "block";
  }

  // पेड़ बनाएं
  for (let i = 0; i < 8; i++) {
    const leftTree = document.createElement("div");
    const rightTree = document.createElement("div");
    leftTree.classList.add("tree", "left");
    rightTree.classList.add("tree", "right");
    leftTree.style.top = (i * 75) + "px";
    rightTree.style.top = (i * 75) + "px";
    container.appendChild(leftTree);
    container.appendChild(rightTree);
  }

  setInterval(createEnemy, 1500);