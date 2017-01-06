(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 20;
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 100; // higher is less frequent
  const ENEMY_SPEED = 2;
  const ENEMY_FIRE_FREQ = 30; // higher is less frequent
  const ENEMY_BULLET_ACCEL = 5;
  let player;
  let cursors;
  let playerBullets;
  let enemies;

  const preload = _ => {
    game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  const handlePlayerFire = _ => {
    playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7) );
  };

  const create = _ => {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add( handlePlayerFire );

    player = game.add.sprite(215, 500, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
  };

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

  const handleBulletAnimations = _ => {
    playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
    enemyBullets.children.forEach( bullet =>  {
      game.physics.arcade.accelerateToObject(bullet, player, ENEMY_BULLET_ACCEL);
    });
  };

  const randomlySpawnEnemy = _ => {
    if( Math.floor(Math.random()*ENEMY_SPAWN_FREQ) === 0 ){
      let randomX = Math.floor( Math.random()*GAME_WIDTH );
      enemies.add( game.add.sprite(randomX, -24, GFX, 0) );
    }
  };

  const handleEnemyActions = _ => {
    enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
    enemies.children.forEach( enemy => randomEnemyFire(enemy));
  };

  const removeBullet = bullet => bullet.destroy();

  const destroyEnemy = enemy => enemy.kill();

  const gameOver = _ => {
    game.state.destroy();
    game.add.text(150, 200, 'O NOES', { fill: '#FFFFFF' });
    let playAgain = game.add.text(120, 300, 'Play Again', { fill: '#FFFFFF' });
    playAgain.inputEnabled = true;
    playAgain.events.onInputUp.add(_ => {
      window.location.reload();
    });
  };

  const handlePlayerHit = _ => {
    gameOver();
  };

  const handleCollisions = _ => {
    // check if any bullets touch any enemies
    let enemiesHit = enemies.children
      .filter( enemy => enemy.alive )
      .filter( enemy => enemy.overlap(playerBullets) );

    if( enemiesHit.length > 0 ){
      // clean up bullets that land
      playerBullets.children
        .filter( bullet => bullet.overlap(enemies) )
        .forEach( removeBullet );

      enemiesHit.forEach( destroyEnemy );
    }

    // check if enemies hit the player
    enemiesHit = enemies.children
      .filter( enemy => enemy.overlap(player) );

    if( enemiesHit.length > 0 ){
      handlePlayerHit();

      enemiesHit.forEach( destroyEnemy );
    }

    // check if enemy bullets hit the player
    let enemyBulletsLanded = enemyBullets.children
      .filter( bullet => bullet.overlap(player) );

    if( enemyBulletsLanded.length > 0 ){
      handlePlayerHit(); // count as one hit
      enemyBulletsLanded.forEach( removeBullet );
    }

  };

  const randomEnemyFire = enemy => {
    if( Math.floor(Math.random()*ENEMY_FIRE_FREQ) === 0 ){
      let enemyBullet = game.add.sprite(enemy.x, enemy.y, GFX, 9);
      enemyBullet.checkWorldBounds = true;
      enemyBullet.outOfBoundsKill = true;
      enemyBullets.add( enemyBullet );
    }
  };

  const cleanup = _ => {
    playerBullets.children
      .filter( bullet => bullet.y < 0 )
      .forEach( bullet => bullet.destroy() );
    enemies.children
      .filter( enemy => enemy.y > GAME_HEIGHT || !enemy.alive )
      .forEach( enemy => enemy.destroy() );
    enemyBullets.children
      .filter( bullet => !bullet.alive )
      .forEach( bullet => bullet.destroy() );
  };

  const update = _ => {
    handlePlayerMovement();
    handleBulletAnimations();
    handleEnemyActions();
    handleCollisions();
    randomlySpawnEnemy();

    cleanup();
  };

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);