class Laser extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y) {
		super(scene, x, y, 'laser');
	}

	fire(x, y) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		this.setVelocityY(-900);
	}

}

class LaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			key: 'laser',
			active: false,
			visible: false,
			classType: Laser
		});
	}

	fireBullet(x, y) {
		const laser = this.getFirstDead(true);
        console.log(laser);

		if(laser) {
			laser.fire(x, y);
		}
	}
}

class Enemy extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y) {
		super(scene, x, y, 'ship1');
	}

	move(x, y) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		this.setVelocityY(900);
	}

}

class enemyGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			key: 'ship1',
			active: false,
			visible: false,
			classType: Enemy
		});
	}
    enemyborn(x, y) {
		const ship1 = this.getFirstDead(true);

		if(ship1) {
			ship1.move(x, y);
		}
	}

}

/*class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser');
    }

    fire(x, y) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(900);  
    }
}*/

/*class EnemyLaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			key: 'laser',
			active: false,
			visible: false,
			classType: EnemyLaser
		});
	}

	fireBullet(x, y) {
		const laser = this.getFirstDead(true);

		if(laser) {
			laser.fire(x, y);
		}
	}
}*/

class EnemyShooterGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            key: 'ship2',
            active: false,
            visible: false,
            classType: EnemyShooter
        });
    }

    enemyborn(x, y) {
        const ship2 = this.getFirstDead(true);
        if (ship2) {
            ship2.move(x, y);
        }
    }
}

class EnemyShooter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ship2');
    }

    move(x, y) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(400); // Movement speed of shooting enemies
    }
}

class Ingame extends Phaser.Scene {
    constructor() {
        super("IngameScene");
        this.my = {sprite: {}};
        this.laserGroup;
        this.enemyGroup;
        //this.enemylaserGroup;
        this.enemyshooterGroup;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.image('laser', 'laserBlue02.png');
        this.load.image('player', 'playership.png');
        this.load.image("ship1", "animship.png");
        this.load.image("ship2", "animship2.png");

        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Goal: get 100 scores<br>Space - emit<br>A - move left // D - move right // W - move up // S - move down</h2>'
    }

    create() {
        this.score = -10;
        this.scoreText = this.add.text(16, 16, 'score: '+ this.score, { fontSize: '32px', fill: '#777' });
        // Set up the player unit
        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'player');
        this.player.setCollideWorldBounds(true);

        // Set up keyboard inputs for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Create a group for bullets
        this.laserGroup = new LaserGroup(this);

        this.enemyGroup = new enemyGroup(this);

        //this.enemylaserGroup = new EnemyLaserGroup(this);

        this.enemyshooterGroup = new EnemyShooterGroup(this);

        // Set up enemy collision detection with bullets
        

        this.time.addEvent({
            delay: 1000, // 1000ms = 1 second
            callback: this.enemyborn,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 1500, // 1000ms = 1 second
            callback: this.enemyshooterborn,
            callbackScope: this,
            loop: true
        });
    }

    fireBullet() {
		this.laserGroup.fireBullet(this.player.x, this.player.y);
	}

    enemyborn() {
        //Enemies are randomly generated on the x-axis within the canvas.
        let randomX = Phaser.Math.Between(20, this.game.config.width-20);
        this.enemyGroup.enemyborn(randomX, 0);
    }

    enemyshooterborn() {
        let randomX = Phaser.Math.Between(20, this.game.config.width-20);
        this.enemyshooterGroup.enemyborn(randomX, 0);
    }

    update(time, delta) {
        // Update the player movement
        if (this.wasdKeys.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.wasdKeys.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.wasdKeys.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.wasdKeys.down.isDown) {
            this.player.setVelocityY(300);
        } else {
            this.player.setVelocityY(0);
        }

        // Fire bullets
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.space)) {
            this.fireBullet();
        }

        this.physics.add.overlap(this.laserGroup, this.enemyGroup, this.handleBulletEnemyCollision, null, this);
        this.physics.add.overlap(this.laserGroup, this.enemyshooterGroup, this.handleBulletEnemyCollision2, null, this);
        this.physics.add.overlap(this.player, this.enemyGroup, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.enemyshooterGroup, this.handlePlayerEnemyCollision, null, this);

        if (this.score == 100) {
            this.scene.start("winScene");
        }
        
    }




    handleBulletEnemyCollision(laser, ship1) {
        // Destroy both the bullet and the enemy on collision
        laser.destroy();
        ship1.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    handleBulletEnemyCollision2(laser, ship1) {
        // Destroy both the bullet and the enemy on collision
        laser.destroy();
        ship1.destroy();
        this.score += 5;
        this.scoreText.setText('Score: ' + this.score);
    }

    handlePlayerEnemyCollision(player, ship1) {
        // Destroy both the bullet and the enemy on collision
        
        this.scene.start("loseScene");
    }

    

}