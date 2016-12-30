(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';

  //Ecma script, _ = ()

  const preload = _ => {
    game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  let player;

  const create = _ => {
    player = game.add.sprite(100, 100, GFX, 8);
  };

  const update = _ => {

  };

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);