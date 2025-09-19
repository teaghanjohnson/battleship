const { Battleship, GameBoard } = require("./battleship");

describe("Battleship Class", () => {
  test("creates ship with correct properties", () => {
    const ship = new Battleship(3, "horizontal");
    expect(ship.length).toBe(3);
    expect(ship.direction).toBe("horizontal");
    expect(ship.hitCount).toBe(0);
    expect(ship.isSunk()).toBe(false);
    expect(ship.id).toBeDefined();
  });

  test("auto-increments ship IDs", () => {
    const ship1 = new Battleship(2);
    const ship2 = new Battleship(3);
    expect(ship2.id).toBe(ship1.id + 1);
  });

  test("defaults to horizontal direction", () => {
    const ship = new Battleship(4);
    expect(ship.direction).toBe("horizontal");
  });

  test("hit() increases hit count", () => {
    const ship = new Battleship(3);
    expect(ship.getHits()).toBe(0);

    ship.hit();
    expect(ship.getHits()).toBe(1);
    expect(ship.isSunk()).toBe(false);
  });

  test("ship sinks when hit count reaches length", () => {
    const ship = new Battleship(2);

    ship.hit();
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("cannot hit sunk ship", () => {
    const ship = new Battleship(1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);

    ship.hit(); // Should not increase hit count
    expect(ship.getHits()).toBe(1);
  });
});

describe("GameBoard Class", () => {
  let board;

  beforeEach(() => {
    board = new GameBoard();
  });

  test("creates 10x10 grid filled with zeros", () => {
    expect(board.size).toBe(10);
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
    expect(board.grid[0][0]).toBe(0);
    expect(board.grid[9][9]).toBe(0);
  });

  test("starts with empty ships array", () => {
    expect(board._ships).toEqual([]);
  });
});

describe("GameBoard - Ship Placement", () => {
  let board;

  beforeEach(() => {
    board = new GameBoard();
  });

  test("places horizontal ship correctly", () => {
    const ship = new Battleship(3, "horizontal");
    board.placeShip(2, 3, ship);

    expect(board.grid[2][3]).toBe(ship.id);
    expect(board.grid[2][4]).toBe(ship.id);
    expect(board.grid[2][5]).toBe(ship.id);
    expect(board._ships).toContain(ship);
  });

  test("places vertical ship correctly", () => {
    const ship = new Battleship(4, "vertical");
    board.placeShip(1, 2, ship);

    expect(board.grid[1][2]).toBe(ship.id);
    expect(board.grid[2][2]).toBe(ship.id);
    expect(board.grid[3][2]).toBe(ship.id);
    expect(board.grid[4][2]).toBe(ship.id);
    expect(board._ships).toContain(ship);
  });

  test("throws error when horizontal ship goes off board", () => {
    const ship = new Battleship(3, "horizontal");
    expect(() => {
      board.placeShip(0, 8, ship); // Would place at cols 8, 9, 10 (off board)
    }).toThrow("place ship on board");
  });

  test("throws error when vertical ship goes off board", () => {
    const ship = new Battleship(4, "vertical");
    expect(() => {
      board.placeShip(7, 0, ship); // Would place at rows 7, 8, 9, 10 (off board)
    }).toThrow("place ship on board");
  });

  test("throws error when placing ship on occupied space", () => {
    const ship1 = new Battleship(2, "horizontal");
    const ship2 = new Battleship(3, "horizontal");

    board.placeShip(3, 3, ship1);

    expect(() => {
      board.placeShip(3, 2, ship2); // Would overlap at (3,3)
    }).toThrow("cannot place ship on top of another ship");
  });
});

describe("GameBoard - Receive Attack", () => {
  let board;
  let ship;

  beforeEach(() => {
    board = new GameBoard();
    ship = new Battleship(3, "horizontal");
    board.placeShip(2, 2, ship);
  });

  test("returns miss when attacking empty water", () => {
    const result = board.recieveAttack(0, 0);
    expect(result).toBe("miss");
    expect(board.grid[0][0]).toBe(null);
  });

  test("returns hit when attacking ship", () => {
    const result = board.recieveAttack(2, 3);
    expect(result).toBe("hit");
    expect(board.grid[2][3]).toBe(-ship.id);
    expect(ship.getHits()).toBe(1);
  });

  test("returns sunk when ship is completely hit", () => {
    board.recieveAttack(2, 2); // First hit
    board.recieveAttack(2, 3); // Second hit
    const result = board.recieveAttack(2, 4); // Final hit

    expect(result).toBe("sunk");
    expect(ship.isSunk()).toBe(true);
  });

  test("returns already attacked when attacking same spot twice", () => {
    board.recieveAttack(0, 0); // Miss
    const result = board.recieveAttack(0, 0); // Attack again
    expect(result).toBe("already attacked");
  });

  test("returns already attacked when attacking hit ship spot again", () => {
    board.recieveAttack(2, 2); // Hit
    const result = board.recieveAttack(2, 2); // Attack again
    expect(result).toBe("already attacked");
  });
});

describe("GameBoard - All Ships Sunk", () => {
  let board;

  beforeEach(() => {
    board = new GameBoard();
  });

  test("returns true when no ships are placed", () => {
    expect(board.allShipsSunk()).toBe(true);
  });

  test("returns false when ships are not sunk", () => {
    const ship = new Battleship(2, "horizontal");
    board.placeShip(0, 0, ship);

    expect(board.allShipsSunk()).toBe(false);
  });

  test("returns false when some ships are sunk but not all", () => {
    const ship1 = new Battleship(1, "horizontal");
    const ship2 = new Battleship(2, "horizontal");

    board.placeShip(0, 0, ship1);
    board.placeShip(2, 2, ship2);

    board.recieveAttack(0, 0); // Sink ship1
    expect(board.allShipsSunk()).toBe(false);
  });

  test("returns true when all ships are sunk", () => {
    const ship1 = new Battleship(1, "horizontal");
    const ship2 = new Battleship(2, "horizontal");

    board.placeShip(0, 0, ship1);
    board.placeShip(2, 2, ship2);

    // Sink both ships
    board.recieveAttack(0, 0);
    board.recieveAttack(2, 2);
    board.recieveAttack(2, 3);

    expect(board.allShipsSunk()).toBe(true);
  });
});

describe("GameBoard Integration Tests", () => {
  test("complete game scenario", () => {
    const board = new GameBoard();
    const destroyer = new Battleship(2, "horizontal");
    const cruiser = new Battleship(3, "vertical");

    // Place ships
    board.placeShip(1, 1, destroyer);
    board.placeShip(5, 5, cruiser);

    expect(board.allShipsSunk()).toBe(false);

    // Attack and miss
    expect(board.recieveAttack(0, 0)).toBe("miss");

    // Hit destroyer
    expect(board.recieveAttack(1, 1)).toBe("hit");
    expect(board.recieveAttack(1, 2)).toBe("sunk");

    expect(board.allShipsSunk()).toBe(false);

    // Sink cruiser
    expect(board.recieveAttack(5, 5)).toBe("hit");
    expect(board.recieveAttack(6, 5)).toBe("hit");
    expect(board.recieveAttack(7, 5)).toBe("sunk");

    expect(board.allShipsSunk()).toBe(true);
  });
});
