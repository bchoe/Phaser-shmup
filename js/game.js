(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  let player;
  const INITIAL_MOVESPEED = 20;
  let cursors;

  //Ecma script, _ = ()

  const preload = _ => {
    game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  const create = _ => {
    cursors = game.input.keyboard.createCursorKeys();
    player = game.add.sprite(210, 500, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
  };

  const handlePlayerMovement = _ => {
    switch( true ){
      case cursors.left.isDown:
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch( true ){
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
    }
  };

  const update = _ => {
    handlePlayerMovement();
  };

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);