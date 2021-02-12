var config = {
  type: Phaser.AUTO,
  width: 500,
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
  cursors = this.input.keyboard.createCursorKeys();

  var score = 0;
  var scoreText = this.add.text(5, 5, 'Score: 0', { fontFamily: 'Courier', fontSize: 20 });

  player = this.physics.add.sprite(200, 575, 'player').setDisplaySize(50, 50);
  player.setCollideWorldBounds(true);
  player.setGravityY(1100);
  player.data = { originY: player.y };

  apples = this.physics.add.group();
  setInterval(() => {
    for (i = 0; i < Phaser.Math.Between(1, 2); i++) {
      apples.create(Phaser.Math.Between(25, 475), -50, 'apple')
        .setDisplaySize(50, 50)
        .setGravityY(Phaser.Math.Between(50, 100));
      setTimeout(null, 100);
    }
  }, 1000);

  var box = this.add.rectangle(0, 700, this.game.config.width, 50).setOrigin(0, 0);
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
}