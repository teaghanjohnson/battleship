function createGameGrid(containerId) {
  const container = document.getElementById(containerId);
  const grid = document.createElement("div");
  grid.classList.add("game-grid");

  const cells = [];

  for (let row = 0; row < 10; row++) {
    cells[row] = [];
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      cells[row][col] = cell;
      grid.appendChild(cell);
    }
  }

  container.appendChild(grid);
  return { grid, cells };
}

function displayShip(cells, row, col, ship) {
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

    if (cells[targetRow] && cells[targetRow][targetCol]) {
      cells[targetRow][targetCol].classList.add("ship");
    }
  }
}

const { grid, cells } = createGameGrid("gameboard");

const testShip = new Battleship(3, "horizontal");
const ship2 = new Battleship(6, "vertical");
displayShip(cells, 7, 4, ship2);
displayShip(cells, 2, 2, testShip);
cells[4][6].classList.add("hit");
cells[1][1].classList.add("miss");
