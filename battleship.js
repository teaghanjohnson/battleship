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
    if (!this._isSunk) {
      this.hitCount++;

      if (this.hitCount >= this.length) {
        this._isSunk = true;
      }
    }
    return this._isSunk;
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
    this._ships = ships;
  }

  createEmptyGrid() {
    //battleship gameboard will consist of a 10x10 board may scale later
    // array of 0's
    // 1's wil replace 0s where ships placed
    // 2's will be misses
    // 3's will be hits
    // may get confusing may optimize later
    const board = Array(10)
      .fill(0)
      .map(() => Array(10).fill(0));
  }

  placeShip(row, col, battleship) {
    // battleship is a ship oject
    // row and col will be front of the ship
    const board = this.grid;

    board[row][col] = 1;
    let vertLength = row + 1;
    let horLength = col + 1;

    if (battleship.direction == "vertical") {
      // place ship ship.length down
      // increment exising row value until length reached
      // if goes over board thow an error not allowing them to place it
      if (battleship.length + row > 10) {
        throw Error("place ship on board.");
      }

      for (vertLength; vertLength < row + battleship.length; vertLength++) {
        board[vertLength][col] = id;
      }
      ships.push([shipId * vertLength]);
    }
    if (battleship.direction == "horizontal") {
      if (battleship.length + col > 10) {
        throw Error("place ship on board.");
      }
      for (horLength; horLength < row + battleship.length; horLength++) {
        board[vertLength][col] = id;
        ships.push([shipId * vertLength]);
      }
    }
  }
}

// place ship function?
//somehow involve gameboard[rows] and [cols]

const gameboard = createGameboard();
