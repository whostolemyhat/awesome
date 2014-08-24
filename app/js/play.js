/* global game, Phaser */

var app = app || {};

app.playState = {
    create: function() {
        this.cursor = this.game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
         this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);

        this.createWorld();

        game.input.keyboard.addKeyCapture([
                                          Phaser.Keyboard.UP,
                                          Phaser.Keyboard.DOWN,
                                          Phaser.Keyboard.LEFT,
                                          Phaser.Keyboard.RIGHT
                                          ]);
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);

        this.movePlayer();
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls);
        game.add.sprite(480, 0, 'wallV', 0, this.walls);

        game.add.sprite(0, 0, 'wallH', 0, this.walls); // top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // bottom right

        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // bottom right
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // bottom right

        game.add.sprite(100, 80, 'wallH', 0, this.walls).scale.setTo(1.5, 1);
        game.add.sprite(100, 240, 'wallH', 0, this.walls).scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

    movePlayer: function() {
        if(this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        } else if(this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 0;
        }

        if(this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
        }
    }
};
