const P1vsP2 = document.querySelector(".play-friend");
const gameInfo = document.createElement("div");
gameInfo.classList = "hidden";

const playboard = document.createElement("div");

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
    return this.currentPlayer === this.player1 ? this.player2UI : this.player1UI;
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
      console.log("Player 1 is ready!");

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
      console.log("Player 2 is ready!");

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
    console.log("Starting game...");

    // Hide ship banks
    document.querySelector(".bs-bank-1").style.display = "none";
    document.querySelector(".bs-bank-2").style.display = "none";

    // Show both boards
    document.getElementById("gameboard-1").style.display = "inline-block";
    document.getElementById("gameboard-2").style.display = "inline-block";

    // Hide ships on both boards
    this.hideAllShips();

    // Add game phase attack listeners
    this.setupAttackListeners();

    // Set initial turn
    this.setTurn();

    console.log("Game started! Both players ready.");
  }

  setupAttackListeners() {
    // Add click listeners to both boards for attacking
    this.player1UI.gridElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        this.handleAttack(e, this.player1UI, this.player1);
      }
    });

    this.player2UI.gridElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        this.handleAttack(e, this.player2UI, this.player2);
      }
    });
  }

  handleAttack(e, clickedUI, clickedBoardOwner) {
    // Only allow attacking enemy board (not your own)
    if (this.currentPlayer === clickedBoardOwner) {
      console.log("Cannot attack your own board!");
      return;
    }

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    console.log(`${this.currentPlayer.user} attacking (${row}, ${col})`);

    // Attack using the UI's method (updates display and messages)
    const result = clickedUI.handleAttack(row, col);

    // Don't switch turns if already attacked
    if (result === "already attacked") return;

    // Check for winner
    if (clickedBoardOwner.hasLost()) {
      this.endGame(this.currentPlayer);
      return;
    }

    // Switch turns
    this.switchTurn();
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
  }

  hideAllShips() {
    // Hide all ship segments on both boards
    const allShips = document.querySelectorAll('[class*="ship-"]');
    allShips.forEach((cell) => {
      // Store original classes for when ships are hit
      cell.dataset.hasShip = "true";
      // Remove ship class to hide it
      const shipClasses = Array.from(cell.classList).filter((c) =>
        c.startsWith("ship-"),
      );
      shipClasses.forEach((shipClass) => {
        cell.classList.remove(shipClass);
        cell.dataset.shipClass = shipClass; // Store for later
      });
    });
  }
}

// Initialize players and UI
const player1 = new Player();
const player2 = new Player();
const player1UI = new GameBoardUI(
  player1.gameboard,
  "gameboard-1",
  "bs-bank-1",
);
const player2UI = new GameBoardUI(
  player2.gameboard,
  "gameboard-2",
  "bs-bank-2",
);

const game = new PvPGame(player1, player2, player1UI, player2UI);

document.addEventListener("DOMContentLoaded", () => {
  game.startSetup();
});
