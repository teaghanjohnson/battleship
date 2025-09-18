// Ship class
class Battleship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this._isSunk = false;
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
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    //battleship gameboard will consist of a 10x10 board may scale later
    // array of 0's
    // 1's wil replace 0s where ships placed
    // 2's will be misses
    // 3's will be hits
    // may get confusing may optimize later
    const board = [];
    for (i = 0; i <= 10; i++) {
      for (j = 0; j <= 10; j++) {
        board.append([i][j]);
      }
    }
  }
}

// place ship function?
//somehow involve gameboard[rows] and [cols]

const gameboard = createGameboard();
