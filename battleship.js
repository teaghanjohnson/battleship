// Ship class
class Battleship {
  static nextId = 1;

  constructor(length, direction = "horizontal") {
    this.id = Battleship.nextId++;
    this.length = length;
    this.hitCount = 0;
    this._isSunk = false;
    this.direction = direction;
  }

  hit() {
    if (this._isSunk) {
      return "ship already sunk"; // Or throw error, or return false
    }

    this.hitCount++;
    if (this.hitCount >= this.length) {
      this._isSunk = true;
      return "sunk";
    }
    return "hit";
  }

  isSunk() {
    return this._isSunk;
  }

  getHits() {
    return this.hitCount;
  }
}

class GameBoard {
  constructor(size = 10, ships = []) {
    this.size = size;
    this.grid = this.createEmptyGrid();
    // 0 = empty, 1 = ship A, 2 = ship B, etc.
    this._ships = this.createStandardFleet();
  }

  createEmptyGrid() {
    const board = [];
    for (let row = 0; row < this.size; row++) {
      board[row] = [];
      for (let col = 0; col < this.size; col++) {
        board[row][col] = 0;
      }
    }
    return board;
  }

  createStandardFleet() {
    const shipSizes = [5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2];
    return shipSizes.map((size) => new Battleship(size));
  }

  placeShip(row, col, battleship) {
    // battleship is a ship object
    // row and col will be front of the ship
    const board = this.grid;

    if (battleship.direction == "vertical") {
      // place ship ship.length down
      // increment exising row value until length reached
      // if goes over board thow an error not allowing them to place it
      if (board[row][col] != 0) {
        throw Error("cannot place ships on top of another ship");
      }
      if (battleship.length + row > 10) {
        throw Error("place ship on board.");
      }
      for (
        let vertLength = row;
        vertLength < row + battleship.length;
        vertLength++
      ) {
        if (board[vertLength][col] != 0) {
          throw Error(" cannot place ship on top of another ship");
        }
        board[vertLength][col] = battleship.id; // Use battleship.id
      }
      this._ships.push(battleship); // Add ship to ships array
    }

    if (battleship.direction == "horizontal") {
      if (battleship.length + col > 10) {
        throw Error("place ship on board.");
      }
      for (
        let horLength = col;
        horLength < col + battleship.length;
        horLength++
      ) {
        if (board[row][horLength] != 0) {
          throw Error(" cannot place ship on top of another ship");
        }
        board[row][horLength] = battleship.id;
      }
      this._ships.push(battleship);
    }
  }

  recieveAttack(row, col) {
    /*Positive = active ships
      0 = empty water
      null = miss (hit water)
      -1, -2, -3, etc. = hit ships (-shipId )
    */

    const board = this.grid;

    const cellValue = board[row][col];
    if (cellValue === 0) {
      this.grid[row][col] = null; // hit water
      return "miss";
    } else if (cellValue > 0) {
      this.grid[row][col] = -cellValue; // hit ship
      const ship = this._ships.find((s) => s.id === cellValue);
      const shipStatus = ship.hit();

      if (shipStatus == "hit") {
        return "hit";
      }
      if (shipStatus == "sunk") {
        return "sunk";
      }
    } else {
      return "already attacked";
    }
  }

  allShipsSunk() {
    for (const ship of this._ships) {
      if (!ship.isSunk()) {
        return false; // Found a living ship
      }
    }
    return true; // All ships are sunk
  }
}

class Player {
  static playerId = 1;
  constructor(gameboard = new Gameboard()) {
    this.user = `Player ${Player.playerId++}`;
    this.gameboard = gameboard;
  }

  attack(enemyboard, row, col) {
    return enemyboard.recieveAttack(row, col);
  }

  hasLost() {
    return this.gameboard.allShipsSunk();
  }
}

window.Battleship = Battleship;
window.Gameboard = GameBoard;
window.Player = Player;
