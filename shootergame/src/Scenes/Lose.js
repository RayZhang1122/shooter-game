class Lose extends Phaser.Scene {
    constructor() {
        super("loseScene");
        this.mykey;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Press Space to Play</h2>'
    }

    create() {
        this.mykey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const message = this.add.text(500,400,"You Lose! Press Space to Play")
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.mykey)) {
            this.scene.start("IngameScene");
        }
       
    }

}