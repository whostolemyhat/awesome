/* global game, Phaser */

var app = app || {};
var jumping = false;
var jumpTime = 0;
var maxJumpTime = 150;
var jumpStart = 0;

app.playState = {
    create: function() {
        this.GRAVITY = 2100;
        this.JUMP_SPEED = -500;
        this.canDoubleJump = false;
        this.canVariableJump = true;
        this.maxJumpTime = 50;

        this.cursor = this.game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT
        ]);

        // player
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.GRAVITY;
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        // world
        this.createWorld();

        // enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        this.nextEnemy = 1000;
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);

        this.movePlayer();

        if(!this.player.inWorld) {
            this.playerDie();
        }

        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        // add enemies
        var start = 4000;
        var end = 1000;
        var score = 100;
        var delay;

        if(this.nextEnemy < game.time.now) {
            delay = Math.max(start - (start - end) * game.global.score/score, end);
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls);
        game.add.sprite(0, 300, 'wallV', 0, this.walls);
        game.add.sprite(game.world.width - 20, 0, 'wallV', 0, this.walls);
        game.add.sprite(game.world.width - 20, 300, 'wallV', 0, this.walls);

        game.add.sprite(0, 0, 'wallH', 0, this.walls).scale.setTo(1.4, 1); // top left
        game.add.sprite(480, 0, 'wallH', 0, this.walls).scale.setTo(1.5, 1); // top right
        game.add.sprite(0, game.world.height - 20, 'wallH', 0, this.walls).scale.setTo(2, 1); // bottom left
        game.add.sprite(500, game.world.height - 20, 'wallH', 0, this.walls).scale.setTo(1.5, 1); // bottom right

        // left
        game.add.sprite(-15, 80, 'wallH', 0, this.walls);
        game.add.sprite(-15, 200, 'wallH', 0, this.walls);
        game.add.sprite(-15, 340, 'wallH', 0, this.walls);
        game.add.sprite(-15, 480, 'wallH', 0, this.walls);

        // right
        game.add.sprite(600, 80, 'wallH', 0, this.walls);
        game.add.sprite(600, 200, 'wallH', 0, this.walls);
        game.add.sprite(600, 340, 'wallH', 0, this.walls);
        game.add.sprite(600, 480, 'wallH', 0, this.walls);

        // middle
        game.add.sprite(250, 140, 'wallH', 0, this.walls).scale.setTo(1.4, 1);
        game.add.sprite(250, 280, 'wallH', 0, this.walls).scale.setTo(1.4, 1);
        // game.add.sprite(250, 400, 'wallH', 0, this.walls).scale.setTo(1.4, 1);
        game.add.sprite(250, 520, 'wallH', 0, this.walls).scale.setTo(1.4, 1);


        this.walls.setAll('body.immovable', true);
    },

    movePlayer: function() {
        var onGround = this.player.body.touching.down;

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

        // jump
        if(onGround && !jumping && this.cursor.up.isDown) {
            console.log('jumping from ground');

            jumpTime = 0;
            onGround = false;
            jumping = true;
            jumpStart = game.time.now;

            this.player.body.velocity.y = this.JUMP_SPEED;

        } else if(!onGround && this.cursor.up.isDown && jumpTime < maxJumpTime && jumping) {
            console.log('carry on jumping');

            jumpTime = game.time.elapsedSince(jumpStart);
            console.log(jumpTime, maxJumpTime, jumpTime < maxJumpTime);

            this.player.body.velocity.y = this.JUMP_SPEED;

        } else if(!onGround && (!this.cursor.up.isDown || jumpTime >= maxJumpTime)) {
            // falling
            // jumpTime = 0;
            console.log('falling');
            jumping = false;

        }
        if(!this.cursor.up.isDown && onGround) {
            jumping = false;
            jumpTime = 0;
            console.log('finished');
        }


        // if(this.cursor.up.isDown && onGround) {
        //     this.player.body.velocity.y = this.JUMP_SPEED;
        // } else if(this.cursor.up.isDown && game.input.keyboard.justPressed(this.cursor.up, 200)) {
        //     this.player.body.velocity.y = this.JUMP_SPEED;
        // }
    },

    playerDie: function() {
        if(!this.player.alive) {
            return;
        }

        this.player.kill();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        // 15 particles which live for 600ms
        this.emitter.start(true, 600, null, 15);

        game.time.events.add(1000, this.startMenu, this);
    },

    startMenu: function() {
        game.state.start('menu');
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();
        if(!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();

        // rebound when hitting a wall
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    }
};
