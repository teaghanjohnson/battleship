const P1vsP2 = document.querySelector(".play-friend");
const gameInfo = document.createElement("div");
gameInfo.classList = "hidden";

class playerVsPlayer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
  }

  switchPlayers() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }
  createBoard(currentPlayer) {
    //player will fill out gameboard
    const confirmBtn = document.createElement("button");
    confirmBtn.classList = "confirm-btn";

    confirmBtn.addEventListener("click", () => {
      if (currentPlayer.checkAllShipsPlaced() == false) {
        showError("All ships must be placed on board");
      }
      if (currentPlayer.checkAllShipsPlaced() == true) {
        this.switchPlayers();
      }
    });
  }

  swapBoard(currentPlayer, enemyPlayer) {}
}
P1vsP2.addEventListener("click", () => {
  player1vsPlayer2();
});
function player1vsPlayer2() {
  const player1 = new Player();
  const player2 = new Player();
}

// though seperate gameboards must be shared

// may have to implement ui method that hides enemy ships and call in game

/*GAME RULES:
---------------
1) lobby screen with logo and title
    Going to have 2 gamemodes
      - player vs player
      - player vs computer

2) Player vs Player
  - User 1 creates their board, then confirms
  - Screen switches to the User 2 board, user creates
  - User 2 then starts the game 5 second timer gives it to User 1
  - User 1 has access to User 2 board and vice versa
  - when a user wins, give a return to menu or rematch option

3)
    Player vs Computer
    - player puts ships o board
    - add computer board generator





*/
