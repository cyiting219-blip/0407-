let cols;
let rows;
const cellSize = 40; // 將格子大小設為一個固定的常數
let mineCol;
let mineRow;
let gameState = 'playing'; // 遊戲狀態: 'playing', 'won', 'lost'
let startTime;
let timeLimit = 30; // 倒數 30 秒
let remainingClicks; // 剩餘點擊次數

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 根據視窗大小和固定的格子大小來計算行列數
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  initGame();
}

function draw() {
  background(220);
  
  if (gameState === 'playing') {
    // 計算倒數計時
    let elapsed = floor((millis() - startTime) / 1000);
    let timeLeft = timeLimit - elapsed;
    
    if (timeLeft <= 0 || remainingClicks <= 0) {
      gameState = 'lost';
    }

    // 繪製棋盤
    stroke(150);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        fill(240);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }

    // 計算游標所在的格子位置
    let hoverCol = floor(mouseX / cellSize);
    let hoverRow = floor(mouseY / cellSize);

    // 確保滑鼠游標在畫布範圍內才顯示圓圈
    if (hoverCol >= 0 && hoverCol < cols && hoverRow >= 0 && hoverRow < rows) {
      let d = dist(hoverCol, hoverRow, mineCol, mineRow);
      let maxD = dist(0, 0, cols - 1, rows - 1);
      
      // 利用 map() 函數將距離轉換為圓圈大小：距離越近，圓圈越大 (最大不超過格子大小的 90%)
      let circleSize = map(d, 0, maxD, cellSize * 0.9, cellSize * 0.1);
      
      fill(100, 150, 255, 180);
      noStroke();
      ellipse(hoverCol * cellSize + cellSize / 2, hoverRow * cellSize + cellSize / 2, circleSize);
    }

    // 顯示倒數計時文字
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text(`剩餘時間: ${timeLeft} 秒 | 剩餘次數: ${remainingClicks}`, 10, 10);

  } else {
    // 遊戲結束畫面 (成功或失敗)
    textAlign(CENTER, CENTER);
    textSize(36);
    if (gameState === 'won') {
      fill(0, 150, 0);
      text('遊戲成功！', width / 2, height / 2 - 30);
    } else {
      fill(200, 0, 0);
      text('遊戲失敗！', width / 2, height / 2 - 30);
    }

    // 繪製畫面下方的「再來一次」按鈕
    let btnW = 120;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 30;
    
    fill(70, 130, 180);
    rect(btnX, btnY, btnW, btnH, 5); // 包含 5px 圓角
    fill(255);
    textSize(18);
    text('再來一次', width / 2, btnY + btnH / 2);
  }
}

function initGame() {
  gameState = 'playing';
  // 隨機決定地雷位置
  mineCol = floor(random(cols));
  mineRow = floor(random(rows));
  // 紀錄遊戲開始時間 (毫秒)
  startTime = millis();
  remainingClicks = floor(random(5, 11)); // 隨機產生 5~10 次點擊機會
}

function mousePressed() {
  if (gameState === 'playing') {
    let col = floor(mouseX / cellSize);
    let row = floor(mouseY / cellSize);
    // 只要在格子範圍內點擊，就消耗一次機會
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      remainingClicks--;
      // 檢查玩家點擊的格子是否為地雷位置
      if (col === mineCol && row === mineRow) {
        gameState = 'won';
      }
    }
  } else {
    // 如果遊戲已結束，判斷是否點擊到「再來一次」按鈕的範圍
    let btnW = 120;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 30;
    
    if (mouseX >= btnX && mouseX <= btnX + btnW && mouseY >= btnY && mouseY <= btnY + btnH) {
      initGame(); // 重置遊戲
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 當視窗大小改變時，重新計算行列數
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  // 重置遊戲以適應新的佈局
  initGame();
}
