class GameBoardUI {
  constructor(gameboard, containerId) {
    this.gameboard = gameboard;
    this.containerId = containerId;
    this.cells = null;
    this.gridElement = null;
    this.dragOffset = { x: 0, y: 0 };
    this.draggedShip = null;

    this.createGrid();
    this.setupEventListeners();
    this.createShipBank();
    this.globalDragListeners();
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
    shipDiv.dataset.direction = ship.direction || "horizontal";

    if (ship.direction === "vertical") {
      shipDiv.classList.add("vertical");
    }

    // Visual representation based on length - add segments directly to shipDiv
    for (let i = 0; i < ship.length; i++) {
      const segment = document.createElement("div");
      segment.classList.add("bs-segment");
      shipDiv.appendChild(segment);
    }

    // Add a rotation button
    const rotateBtn = document.createElement("button");
    rotateBtn.classList.add("rotation-btn");
    rotateBtn.textContent = "↻";

    rotateBtn.onclick = (e) => {
      e.stopPropagation();
      ship.direction =
        ship.direction === "horizontal" ? "vertical" : "horizontal";
      shipDiv.dataset.direction = ship.direction;

      // Toggle visual orientation
      shipDiv.classList.toggle("vertical");
    };
    shipDiv.appendChild(rotateBtn);

    this.shipDragListeners(shipDiv, ship);
    return shipDiv;
  }

  shipDragListeners(shipElement, ship) {
    let newX = 0,
      newY = 0,
      startX = 0,
      startY = 0;

    shipElement.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("rotation-btn")) return;

      e.preventDefault();

      // Store original position for return to bank
      this.draggedShip = {
        element: shipElement,
        ship: ship,
        originalParent: shipElement.parentElement,
        originalNextSibling: shipElement.nextSibling,
      };

      // Get initial position
      const rect = shipElement.getBoundingClientRect();

      // Make ship draggable - move to body for free movement
      document.body.appendChild(shipElement);
      shipElement.style.position = "fixed";
      shipElement.style.zIndex = "1000";
      shipElement.style.pointerEvents = "none"; // Let mouse events pass through

      // Set initial position
      shipElement.style.left = rect.left + "px";
      shipElement.style.top = rect.top + "px";
      shipElement.style.margin = "0";

      startX = e.clientX;
      startY = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    });

    const mouseMove = (e) => {
      if (!this.draggedShip) return;

      newX = startX - e.clientX;
      newY = startY - e.clientY;

      startX = e.clientX;
      startY = e.clientY;

      shipElement.style.top = shipElement.offsetTop - newY + "px";
      shipElement.style.left = shipElement.offsetLeft - newX + "px";

      // Show preview on grid
      const cellData = this.getCellAtPosition(e.clientX, e.clientY);
      if (cellData) {
        const { row, col } = cellData;
        const isValid = this.showPlacementPreview(
          row,
          col,
          ship.length,
          ship.direction,
        );
        shipElement.style.cursor = isValid ? "grabbing" : "not-allowed";
      } else {
        this.clearPlacementPreview();
      }
    };

    const mouseUp = (e) => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);

      if (!this.draggedShip) return;

      const cellData = this.getCellAtPosition(e.clientX, e.clientY);
      let placed = false;

      if (cellData) {
        const { row, col } = cellData;

        try {
          this.gameboard.placeShip(row, col, ship);
          this.displayShip(row, col, ship);
          shipElement.remove();
          placed = true;
          console.log(`Ship ${ship.id} placed successfully`);
        } catch (error) {
          console.error("Invalid placement:", error.message);
          this.showError(error.message);
        }
      }

      if (!placed) {
        this.returnShipToBank(
          shipElement,
          this.draggedShip.originalParent,
          this.draggedShip.originalNextSibling,
        );
      }

      this.clearPlacementPreview();
      this.draggedShip = null;
    };
  }

  returnShipToBank(shipElement, originalParent, originalNextSibling) {
    // Reset ship styling
    shipElement.style.position = "";
    shipElement.style.left = "";
    shipElement.style.top = "";
    shipElement.style.zIndex = "";
    shipElement.style.pointerEvents = "";
    shipElement.style.cursor = "";

    if (originalNextSibling) {
      originalParent.insertBefore(shipElement, originalNextSibling);
    } else {
      originalParent.appendChild(shipElement);
    }
  }
  //going to use this numerous times
  getCellAtPosition(x, y) {
    const elements = document.elementsFromPoint(x, y);

    const cellElement = elements.find((el) =>
      el.classList.contains("grid-cell"),
    );

    if (cellElement) {
      return {
        row: parseInt(cellElement.dataset.row),
        col: parseInt(cellElement.dataset.col),
        element: cellElement,
      };
    }
    return null;
  }

  //placement preview
  showPlacementPreview(row, col, length, direction) {
    this.clearPlacementPreview();

    let isValid = true;
    const previewCells = [];

    for (let i = 0; i < length; i++) {
      let targetRow = direction === "horizontal" ? row : row + i;
      let targetCol = direction === "horizontal" ? col + i : col;

      //check if cell exists
      if (!this.cells[targetRow] || !this.cells[targetRow][targetCol]) {
        isValid = false;
        break;
      }

      const cell = this.cells[targetRow][targetCol];
      const cellValue = this.gameboard.grid[targetRow][targetCol];

      if (cellValue !== 0) {
        isValid = false;
      }
      previewCells.push(cell);
    }

    // Add preview classes
    previewCells.forEach((cell) => {
      cell.classList.add("placement-preview");
      if (!isValid) {
        cell.classList.add("invalid-placement");
      }
    });
    return isValid;
  }

  clearPlacementPreview() {
    document.querySelectorAll(".placement-preview").forEach((cell) => {
      cell.classList.remove("placement-preview", "invalid-placement");
    });
  }

  rotateShip(shipElement, ship) {
    //toggle direction
    ship.direction =
      ship.direction === "horizontal" ? "vertical" : "horizontal";
    shipElement.dataset.direction = ship.direction;

    //update
    const segments = shipElement.querySelector(".ship-segments");
    segments.classList.toggle("vertical");

    console.log(`Ship rotated to: ${ship.direction}`);
  }
  showError(message) {
    // Simple error notification
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 2000);
  }
}
const player1 = new Player();

const player1UI = new GameBoardUI(player1.gameboard, "gameboard");
