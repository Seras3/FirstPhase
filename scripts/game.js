var config = {
  type: Phaser.AUTO,
  width: 300,
  height: 600,
  parent: document.getElementById("game"),
  physics: {
    default: 'arcade',
    fps: 60
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.path = 'squarefighters/';
  this.load.image('player', 'player.png');
  this.load.image('apple', 'apple.png');
  this.load.audio('jump', 'jump.wav');
  this.load.audio('collect', 'collect.wav');
  this.load.audio('next level', 'next-level.wav');

}

function create() {
  H = this.game.config.height;
  W = this.game.config.width;
  cursors = this.input.keyboard.createCursorKeys();

  leftInput = this.add.rectangle(0, 0, W / 2, H)
    .setOrigin(0, 0).setInteractive();
  rightInput = this.add.rectangle(W / 2, 0, W / 2, H)
    .setOrigin(0, 0).setInteractive();

  var score = 0;
  var scoreText = this.add.text(5, 5, 'Score: 0', { fontFamily: 'Courier', fontSize: 20 });

  playerSize = 50;
  player = this.physics.add.sprite(W / 2, H - playerSize / 2, 'player').setDisplaySize(playerSize, playerSize);
  player.setCollideWorldBounds(true);
  player.setGravityY(1100);
  player.data = { originY: player.y };

  appleSize = 50;
  apples = this.physics.add.group();
  setInterval(() => {
    for (i = 0; i < Phaser.Math.Between(1, 2); i++) {
      apples.create(Phaser.Math.Between(appleSize / 2, W - appleSize / 2), -appleSize / 2, 'apple')
        .setDisplaySize(appleSize, appleSize)
        .setGravityY(Phaser.Math.Between(50, 100));
      setTimeout(null, 100);
    }
  }, 1000);

  var box = this.add.rectangle(0, H + 100, W, 50).setOrigin(0, 0);
  destroyer = this.physics.add.staticGroup();
  var destruct = destroyer.add(box);

  function collectApple(player, apple) {
    apple.destroy();
    score += 10;
    scoreText.setText(`Score: ${score}`);
    score % 250 == 0 ? this.game.sound.play('next level') : this.game.sound.play('collect');
  }

  this.physics.add.overlap(apples, destruct, (apple, _) => apple.destroy());
  this.physics.add.overlap(apples, player, collectApple, null, this);
}

function update() {
  // Keyboard
  if (cursors.left.isDown) {
    player.setVelocityX(-400);
    player.flipX = true;
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(400);
    player.flipX = false;
  }
  else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.y == player.data.originY) {
    player.setVelocityY(-600);
    this.game.sound.play('jump');
  }

  // Mobile
  if (this.input.activePointer.isDown) {
    if (Math.abs(this.input.activePointer.x - player.x) > 10) {
      if (this.input.activePointer.x < player.x) {
        player.setVelocityX(-400);
        player.flipX = true;
      } else {
        player.setVelocityX(400);
        player.flipX = false;
      }
    }
    if (this.input.activePointer.y < H / 3 * 2 && player.y == player.data.originY) {
      player.setVelocityY(-600);
      this.game.sound.play('jump');
    }
  }
}