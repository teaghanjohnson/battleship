// implementing hunt and target AI strategy
class BattleshipAI {
  constructor() {
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

  targetMode() {
    // check if attackedCell hit a ship
    while (this.targetStack.length > 0) {
      let target = targetStack.pop();

      // make sure it's valid and unattacked
      if (isValidCell(target) && !isAlreadyAttacked(target)) {
        return target;
      }
    }

    // no valid targets left, go back to hunting
  }

  makeMove() {
    let move;

    if (this.mode === "hunt") {
      move = this.getRandomUnattackedCell();
    } else {
      move = this.targetMode();
    }
  }

  // will track if make move returns a hit
  // then look for adjacent cells to fully sink ship
}
