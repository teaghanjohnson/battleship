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

function createGameboard() {
  const gameboard = [];
  for (let i = 0; i < 10; i++) {
    gameboard[i] = [];
    for (let j = 0; j < 10; j++) {
      gameboard[i][j] = null;
    }
  }
  return gameboard;
}

// place ship function?
//somehow involve gameboard[rows] and [cols]

const gameboard = createGameboard();
