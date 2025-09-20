const P1vsP2 = document.querySelector(".play-friend");
const gameInfo = document.createElement("div");
gameInfo.classList = "hidden";

P1vsP2.addEventListener("click", () => {
  player1vsPlayer2();
});
function player1vsPlayer2() {
  const player1 = new Player();
  const player2 = new Player();

  /*have the first player have their ships and place them across the board
  // when player is fully done have the player press a done button and then have a confirm pop up
  // Then depending on which one (same device p1vsp2, online p1vsp2 lets do same device more simple logic)
  //have the screen reset but player 2 is chooses his spots when the spots are filled
  then start the game
  after each recieve attack a pop up appears telling the user whether they missed or hit
  if missed say switch players(have a button)
  if hit the player that hit gets to keep playing until they miss
  when a players ships are all sunk the game is over and a winner is declared
  */
}
