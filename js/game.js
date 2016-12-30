(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 10;
  const PLAYER_BULLET_SPEED = 1;
  const ENEMY_SPAWN_FREQ = 100; // higher is less frequent
  const ENEMY_SPEED = 4.5;
  let player;
  let cursors;
  let playerBullets;
  let enemies;

  //Ecma script, _ = ()

  const preload = _ => {
    game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  const create = _ => {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add( handlePlayerFire );
    player = game.add.sprite(210, 500, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
  };


  const randomlySpawnEnemy = _ => {
    if( Math.floor(Math.random()*ENEMY_SPAWN_FREQ) === 0 ){
      let randomX = Math.floor( Math.random()*GAME_WIDTH );
      enemies.add( game.add.sprite(randomX, -24, GFX, 0) );
    }
  }

  const handlePlayerMovement = _ => {
    let movingH = Math.sqrt(2);
    let movingV = Math.sqrt(2);
    if( cursors.up.isDown || cursors.down.isDown){
      movingH = 1; // slow down diagonal movement
    }
    if( cursors.left.isDown || cursors.right.isDown){
      movingV = 1; // slow down diagonal movement
    }
    switch( true ){
      case cursors.left.isDown:
        player.x -= player.moveSpeed * movingH;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed * movingH;
        break;
    }
    switch( true ){
      case cursors.down.isDown:
        player.y += player.moveSpeed * movingV;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed * movingV;
        break;
    }
  };

  const handlePlayerFire = _ => {
    playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7) );
  };

  const handleBulletAnimations1 = _ => {
    playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
  };

  const handleEnemyActions = _ => {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
  };

  const cleanup = _ => {
    playerBullets.children
      .filter( bullet => bullet.y < 0 )
      .forEach( bullet => bullet.destroy() );
  };

  const update = _ => {
    handlePlayerMovement();
    handleBulletAnimations1();
    handleEnemyActions();
    randomlySpawnEnemy();

    cleanup();
  };

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);