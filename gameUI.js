class GameBoardUI {
  constructor(gameboard, containerId) {
    this.gameboard = gameboard;
    this.containerId = containerId;
    this.cells = null;
    this.gridElement = null;
    this.createGrid();
    this.setupEventListeners();
  }

  createGrid() {
    const container = document.getElementById(this.containerId);
    this.gridElement = document.createElement("div");
    this.gridElement.classList.add("game-grid");
    this.cells = [];

    for (let row = 0; row < this.gameboard.size; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.gameboard.size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        this.cells[row][col] = cell;
        this.gridElement.appendChild(cell);
      }
    }

    container.appendChild(this.gridElement);
  }
  displayShip(row, col, ship) {
    for (let i = 0; i < ship.length; i++) {
      let targetRow, targetCol;

      if (ship.direction == "horizontal") {
        targetRow = row;
        targetCol = col + i; // move right for each ship segment
      } else {
        //vertical
        targetRow = row + i; //move down for each ship segment
        targetCol = col;
      }

      if (this.cells[targetRow] && this.cells[targetRow][targetCol]) {
        this.cells[targetRow][targetCol].classList.add(`ship-${ship.id}`);
      }
    }
  }

  handleAttack(row, col) {
    const result = this.gameboard.recieveAttack(row, col);
    const hitMessage = document.querySelector(".hit-message");

    switch (result) {
      case "hit":
        hitMessage.textContent = "You hit a Battleship!";
        break;
      case "miss":
        hitMessage.textContent = "You Missed...";
        break;
      case "sunk":
        hitMessage.textContent = "You sunk a ship!";
        break;
      case "already attacked":
        hitMessage.textContent = "You already attacked here!";
        break;
      default:
        hitMessage.textContent = "Unknown result";
    }

    this.updateCellDisplay(row, col, result);
    return result;
  }
  updateCellDisplay(row, col, result) {
    const cell = this.cells[row][col];

    if (result === "hit") {
      cell.classList.add("hit");
      console.log("Ship has been hit!");
    } else if (result === "miss") {
      cell.classList.add("miss");
      console.log("Missed - no ship here");
    } else if (result === "sunk") {
      const shipId = this.getShipIdFromCell(row, col);
      const sunkShipCells = this.gridElement.querySelectorAll(
        `.ship-${shipId}`,
      );

      sunkShipCells.forEach((shipCell) => {
        shipCell.classList.remove("hit", "ship");
        shipCell.classList.add("sunk");
      });
      console.log("Ship sunk!");
    } else if (result === "already attacked") {
      console.log("Already attacked this spot");
    }
  }

  getShipIdFromCell(row, col) {
    const cellValue = this.gameboard.grid[row][col];
    // If negative (already hit), make positive to get ship ID
    return Math.abs(cellValue);
  }
  setupEventListeners() {
    for (let row = 0; row < this.gameboard.size; row++) {
      for (let col = 0; col < this.gameboard.size; col++) {
        const cell = this.cells[row][col];

        cell.addEventListener("click", (event) => {
          const clickedRow = parseInt(event.target.dataset.row);
          const clickedCol = parseInt(event.target.dataset.col);
          this.handleAttack(clickedRow, clickedCol);
        });
      }
    }
  }

  //create a ship bankk
  //draggable ships
  //rotation capability
  //Placement Preview
  //Validation feedback
  //error handling

  // 1) CREATE A VISUAL SHIP BANK
  createShipBank() {
    const bankContainer = document.querySelector(".bs-bank");

    //create ship elements for each ship in fleet
    this.gameboard._ships.forEach((ship, index) => {
      const shipElement = this.createShipElement(ship, index);
      bankContainer.appendChild(shipElement);
    });
  }

  createShipElement(ship, index) {
    const shipDiv = document.createElement("div");
    shipDiv.classList.add("bank-item");
    shipDiv.dataset.shipIndex = index;
    shipDiv.dataset.shipLength = ship.length;
    shipDiv.dataset.shipId = ship.id;

    //Visual representation on Length
    for (let i = 0; i < ship.length; i++) {
      const segment = document.createElement("div");
      segment.classList.add("bs-segment");
      shipDiv.appendChild(segment);
    }

    //add a rotation button
    const rotateBtn = document.createElement("button");
    rotateBtn.classList.add("rotation-btn");
    rotateBtn.textContent = "↻";

    rotateBtn.onclick = (e) => {
      e.stopPropagation();
      ship.direction =
        ship.direction === "horizontal" ? "vertical" : "horizontal";
    };
    shipDiv.appendChild(rotateBtn);

    return shipDiv;
  }

  dragEventListeners() {}
}

const player1 = new Player();

const player1UI = new GameBoardUI(player1.gameboard, "gameboard");

const testShip = new Battleship(3, "vertical");
const ship2 = new Battleship(6, "horizontal");

player1.gameboard.placeShip(2, 2, testShip);
player1UI.displayShip(2, 2, testShip);

player1.gameboard.placeShip(7, 4, ship2);
player1UI.displayShip(7, 4, ship2);
