// implementing hunt and target AI strategy
class BattleshipAI {
  constructor(enemyboard) {
    this.enemyboard = enemyboard;
    this.mode = "hunt"; // "hunt" or "target"
    this.targetStack = []; // cells to attack in target mode
    this.lastHit = null; //most recent successful hit {row, col}
    this.hits = new Set(); // All unsunk hits [{row, col}, ...]
  }

  // hunt mode
  huntMode() {
    const available = [];

    // find all unattacked cells
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const key = `${row}, ${col}`;
        //checkerboard approach
        if (!this.hits.has(key) && (row + col) % 2 === 0) {
          available.push({ row, col });
        }
      }
    }
    // pick random one
    const randomIndex = Math.floor(Math.random() * available.length);
    let attackedCell = available[randomIndex];
    return attackedCell;
  }

  // assume hit already occured
  targetMode() {
    while (this.targetStack.length > 0) {
      let target = this.targetStack.pop();
      const key = `${target.row},${target.col}`;

      // check if we haven't attacked this cell yet
      if (!this.hits.has(key)) {
        return target;
      }
    }
    // no valid targets left, go back to hunting
    this.mode = "hunt";
    return this.huntMode();
  }

  makeMove() {
    let move;
    if (this.mode === "hunt") {
      move = this.huntMode();
    } else {
      move = this.targetMode();
    }
    return move;
  }

  addAdjacentCells(cell) {
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }, // right
    ];

    for (let dir of directions) {
      const newRow = cell.row + dir.row;
      const newCol = cell.col + dir.col;

      // check bounds
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
        const key = `${newRow},${newCol}`;
        if (!this.hits.has(key)) {
          this.targetStack.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  processResult(cell, result) {
    if (result === "hit") {
      this.mode = "target";
      this.lastHit = cell;
      this.addAdjacentCells(cell); // add neighbours to targetStack
      this.hits.add(`${cell.row},${cell.col}`);
    } else if (result === "sunk") {
      this.mode = "hunt";
      this.targetStack = [];
      this.lastHit = null;
    } else if (result === "miss") {
      this.hits.add(`${cell.row},${cell.col}`); // track so we dont attack again
    }
  }
}

window.BattleshipAI = BattleshipAI;
