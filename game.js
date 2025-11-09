class PvPGame {
  constructor(player1, player2, player1UI, player2UI) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1UI = player1UI;
    this.player2UI = player2UI;
    this.currentPlayer = player1;
    this.player1Ready = false;
    this.player2Ready = false;
  }

  getEnemy() {
    return this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  getEnemyUI() {
    return this.currentPlayer === this.player1
      ? this.player2UI
      : this.player1UI;
  }

  startSetup() {
    // Create Player 1's ready button
    this.ready1Btn = document.createElement("button");
    this.ready1Btn.textContent = "Player 1 Confirm";
    this.ready1Btn.classList.add("ready-btn");
    this.ready1Btn.addEventListener("click", () => {
      if (!this.player1UI.checkAllShipsPlaced()) {
        this.player1UI.showError("All ships must be placed on board");
      } else {
        this.playerReady(1);
      }
    });
    document.body.appendChild(this.ready1Btn);

    // Create Player 2's ready button (will show after P1 confirms)
    this.ready2Btn = document.createElement("button");
    this.ready2Btn.textContent = "Player 2 Confirm";
    this.ready2Btn.classList.add("ready-btn");
    this.ready2Btn.style.display = "none"; // Hide initially
    this.ready2Btn.addEventListener("click", () => {
      if (!this.player2UI.checkAllShipsPlaced()) {
        this.player2UI.showError("All ships must be placed on board");
      } else {
        this.playerReady(2);
      }
    });
    document.body.appendChild(this.ready2Btn);
  }

  playerReady(playerNum) {
    if (playerNum === 1) {
      this.player1Ready = true;

      // Hide Player 1 board and bank
      document.getElementById("gameboard-1").style.display = "none";
      document.querySelector(".bs-bank-1").style.display = "none";
      this.ready1Btn.style.display = "none";

      // Show Player 2 board and bank
      document.getElementById("gameboard-2").style.display = "inline-block";
      document.querySelector(".bs-bank-2").style.display = "grid";
      this.ready2Btn.style.display = "block";
    } else if (playerNum === 2) {
      this.player2Ready = true;

      // Hide ready button
      this.ready2Btn.style.display = "none";

      // Start the game immediately
      this.startGame();
    }
  }

  switchPlayers() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
    this.enemyPlayer =
      this.enemyPlayer === this.player1 ? this.player2 : this.player1;
  }

  setUpBoards() {
    //player will fill out gameboard
    const confirmBtn = document.createElement("button");
    confirmBtn.classList = "confirm-btn";
    let enemyPlayer = this.player2;

    //hide enemy board while creation occurs
    enemyPlayer.gameboard.toggle("hidden");

    confirmBtn.addEventListener("click", () => {
      if (this.currentPlayer.checkAllShipsPlaced() == false) {
        showError("All ships must be placed on board");
      }
      if (this.currentPlayer.checkAllShipsPlaced() == true) {
        this.switchPlayers();
        enemyPlayer = player1;
      }
      if (
        this.player1.gameboard.checkAllShipsPlaced() == true &&
        this.player2.gameboard.checkAllShipsPlaced() == true
      ) {
        return;
      }
    });
  }
  switchBoard() {
    this.currentPlayer.gameboard.classList.add("hidden");
  }

  startGame() {
    // Add body class to enable ship hiding CSS
    document.body.classList.add("game-active");

    // Hide ship banks
    document.querySelector(".bs-bank-1").style.display = "none";
    document.querySelector(".bs-bank-2").style.display = "none";

    // Show both boards
    document.getElementById("gameboard-1").style.display = "inline-block";
    document.getElementById("gameboard-2").style.display = "inline-block";

    // Hide ships on both boards (using CSS now)
    this.hideAllShips();

    // Add game phase attack listeners
    this.setupAttackListeners();

    // Set initial turn
    this.setTurn();
  }

  setupAttackListeners() {
    // Add click listeners to both boards
    this.player1UI.gridElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        // Player clicking on board 1 - means attacking player 1's board
        this.processAttack(e, this.player1UI, this.player1);
      }
    });

    this.player2UI.gridElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        // Player clicking on board 2 - means attacking player 2's board
        this.processAttack(e, this.player2UI, this.player2);
      }
    });
  }

  processAttack(e, targetUI, targetPlayer) {
    // User cannot interact with its own board
    if (this.currentPlayer === targetPlayer) {
      return;
    }

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    // Use UI handleAttack method to process the attack
    const result = targetUI.handleAttack(row, col);

    // If already attacked, don't do anything
    if (result === "already attacked") return;

    // Check if enemy board has lost
    if (targetPlayer.hasLost()) {
      this.endGame(this.currentPlayer);
      return;
    }

    // Until the user MISSES, user can continue to interact with the board
    // When miss happens, current player switches
    if (result === "miss") {
      this.switchTurn();
    }
    // If hit or sunk, don't switch - same player continues
  }

  setTurn() {
    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `${this.currentPlayer.user}'s turn - Attack the enemy board!`;

    // Enable/disable boards based on current player
    if (this.currentPlayer === this.player1) {
      this.player1UI.gridElement.style.pointerEvents = "none";
      this.player2UI.gridElement.style.pointerEvents = "auto";
    } else {
      this.player1UI.gridElement.style.pointerEvents = "auto";
      this.player2UI.gridElement.style.pointerEvents = "none";
    }
  }

  switchTurn() {
    this.switchPlayers();
    this.setTurn();
  }

  endGame(winner) {
    const turnMessage = document.querySelector(".turn-message");
    turnMessage.textContent = `${winner.user} wins! 🎉`;

    this.player1UI.gridElement.style.pointerEvents = "none";
    this.player2UI.gridElement.style.pointerEvents = "none";

    // create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("end-game-buttons");

    // create home button
    const homeBtn = document.createElement("button");
    homeBtn.textContent = "Home";
    homeBtn.classList.add("end-game-btn");
    homeBtn.addEventListener("click", () => {
      const homeScreen = document.querySelector(".home-screen");
      const gameScreen = document.querySelector(".game-screen");
      homeScreen.classList.remove("hidden");
      gameScreen.classList.add("hidden");
      buttonContainer.remove();
      resetGame();
    });

    // create rematch button
    const rematchBtn = document.createElement("button");
    rematchBtn.textContent = "Rematch";
    rematchBtn.classList.add("end-game-btn");
    rematchBtn.addEventListener("click", () => {
      buttonContainer.remove();
      const mode = this instanceof PvEGame ? "pve" : "pvp";
      resetGame();
      startGameMode(mode);
    });

    buttonContainer.appendChild(homeBtn);
    buttonContainer.appendChild(rematchBtn);
    document.body.appendChild(buttonContainer);
  }

  hideAllShips() {
    const allShips = document.querySelectorAll('[class*="ship-"]');
    allShips.forEach((cell) => {
      const shipClasses = Array.from(cell.classList).filter((c) =>
        c.startsWith("ship-"),
      );
      if (shipClasses.length > 0) {
        cell.dataset.shipClass = shipClasses[0]; // Store ship-X class
        // Instead of removing the class, we'll hide it with CSS
      }
    });
  }
}

class PvEGame extends PvPGame {
  constructor(humanPlayer, aiPlayer, humanUI, aiUI) {
    super(humanPlayer, aiPlayer, humanUI, aiUI);
    this.ai = new BattleshipAI(humanPlayer.gameboard);
  }

  // when its the AI's turn
  makeAIMove() {
    const move = this.ai.makeMove(); // AI picks {row: 3, col: 4}

    // execute the attack using your existing method
    const result = this.player1UI.handleAttack(move.row, move.col);

    // tell AI what happened ie (hit or no hit)
    this.ai.processResult(move, result);

    if (result === "miss") {
      this.switchTurn();
    } else {
      // ai hit - goes again after delay
      setTimeout(() => this.makeAIMove(), 1500);
    }
  }

  placeAIShips(gameboard, gameboardUI) {
    /*
      player2.gameboard._ships - get the fleet
      player2.gameboard.placeShip(row, col, ship) - place the ship
      player2UI.displayShip(row, col, ship) - show it visually
      Math.random() - for random coordinates and direction
    */
    gameboard._ships.forEach((ship) => {
      let placed = false;
      //keep trying until ship is successfully placed
      while (!placed) {
        //random position
        let randomRow = Math.floor(Math.random() * 10);
        let randomCol = Math.floor(Math.random() * 10);

        //random direction
        ship.direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        try {
          // try placing the ship
          gameboard.placeShip(randomRow, randomCol, ship);
          gameboardUI.displayShip(randomRow, randomCol, ship);
          placed = true;
        } catch {
          // a collision occured randomize again
        }
      }
    });
  }

  setTurn() {
    const turnMessage = document.querySelector(".turn-message");
    if (this.currentPlayer === this.player1) {
      turnMessage.textContent = "Your turn - Attack the Computer";
      this.player2UI.gridElement.style.pointerEvents = "auto";
    } else {
      turnMessage.textContent = "AI is thinking...";
      this.player2UI.gridElement.style.pointerEvents = "none";
    }
  }
  startAISetup() {
    document.getElementById("gameboard-2").style.display = "none";
    document.querySelector(".bs-bank-2").style.display = "none";

    this.placeAIShips(this.player2.gameboard, this.player2UI);
    this.player2Ready = true; // AI is always ready

    // Human ready button
    this.ready1Btn = document.createElement("button");
    this.ready1Btn.textContent = "Player 1 Confirm";
    this.ready1Btn.classList.add("ready-btn");
    this.ready1Btn.addEventListener("click", () => {
      if (!this.player1UI.checkAllShipsPlaced()) {
        this.player1UI.showError("All ships must be placed on board");
      } else {
        this.playerReady();
      }
    });
    document.body.appendChild(this.ready1Btn);
  }

  startGame() {
    // Add body class to enable ship hiding CSS
    document.body.classList.add("game-active");

    document.querySelector(".bs-bank-1").style.display = "none";
    document.querySelector(".bs-bank-2").style.display = "none";

    // Show both boards
    document.getElementById("gameboard-1").style.display = "inline-block";
    document.getElementById("gameboard-2").style.display = "inline-block";

    // Hide ships on both boards
    this.hideAllShips();
    // Setup attack listeners
    this.setupAttackListeners();

    // Human goes first
    this.currentPlayer = this.player1;
    this.setTurn();
  }

  setupAttackListeners() {
    // human can only attack AI's board (board 2)
    this.player2UI.gridElement.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("grid-cell") &&
        this.currentPlayer === this.player1
      ) {
        this.processAttack(e, this.player2UI, this.player2);
      }
    });
  }
  playerReady() {
    // Hide ready button and ship bank
    this.ready1Btn.style.display = "none";

    // Start the game
    this.startGame();
  }
  //override to handle AI turns
  processAttack(e, targetUI) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    // Use UI handleAttack method to process the attack
    const result = targetUI.handleAttack(row, col);

    // check if AI lost
    if (this.player2.hasLost()) {
      this.endGame(this.player1);
      return;
    }
    if (result === "miss") {
      this.switchTurn();
      // delay AI move slightly for realism
      setTimeout(() => this.makeAIMove(), 1500);
    }
  }
}

let player1;
let player2;
let player1UI;
let player2UI;

function resetGame() {
  // remove game active class
  document.body.classList.remove("game-active");

  // clear gameboards
  document.getElementById("gameboard-1").innerHTML = "";
  document.getElementById("gameboard-2").innerHTML = "";
  document.querySelector(".bs-bank-1").innerHTML =
    '<h3 class="bank-title">SHIPS:</h3>';
  document.querySelector(".bs-bank-2").innerHTML =
    '<h3 class="bank-title">SHIPS:</h3>';

  // clear messages
  document.querySelector(".turn-message").textContent = "";
  document.querySelector(".hit-message").textContent = "";

  // reset static IDs
  Battleship.nextId = 1;
  Player.playerId = 1;

  // create new players and UIs
  player1 = new Player();
  player2 = new Player();
  player1UI = new GameBoardUI(player1.gameboard, "gameboard-1", "bs-bank-1");
  player2UI = new GameBoardUI(player2.gameboard, "gameboard-2", "bs-bank-2");

  // remove any existing ready buttons
  const existingReadyBtns = document.querySelectorAll(".ready-btn");
  existingReadyBtns.forEach((btn) => btn.remove());
}

let game;

function startGameMode(mode) {
  const homeScreen = document.querySelector(".home-screen");
  const gameScreen = document.querySelector(".game-screen");

  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  if (mode === "pvp") {
    game = new PvPGame(player1, player2, player1UI, player2UI);
    game.startSetup();
  } else if (mode === "pve") {
    game = new PvEGame(player1, player2, player1UI, player2UI);
    game.startAISetup();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize players and UIs after DOM is loaded
  player1 = new Player();
  player2 = new Player();
  player1UI = new GameBoardUI(player1.gameboard, "gameboard-1", "bs-bank-1");
  player2UI = new GameBoardUI(player2.gameboard, "gameboard-2", "bs-bank-2");

  const pvpButton = document.querySelector(".play-friend");
  const pveButton = document.querySelector(".play-computer");

  pvpButton.addEventListener("click", () => {
    startGameMode("pvp");
  });

  pveButton.addEventListener("click", () => {
    try {
      startGameMode("pve");
    } catch (error) {
      console.error("Error creating PvE game:", error);
    }
  });
});
