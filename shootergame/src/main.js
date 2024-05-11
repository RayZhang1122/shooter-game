
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1400,
    height: 800,
    physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { x: 0, y: 0 }
		}
	},
    scene: [Begin, Ingame, Win, Lose]
}

const game = new Phaser.Game(config);