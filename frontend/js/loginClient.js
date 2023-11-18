/*
 * Interface ( facade ) between the user and the UI for login.
 */


export class LoginClient
{
	constructor()
	{
        this.appHeight = 1600;
        this.appWidth = 1600;
        this.app = new PIXI.Application({ height: this.appHeight, width: this.appWidth});
		document.body.appendChild(this.app.view);

        this.createGameChooseButtons();
	}

    createGameChooseButtons()
    {
        const graphics = new PIXI.Graphics();

        const buttonHeight = this.appHeight/16;
        const buttonWidth = this.appHeight/4;
        const x = 3 * this.appHeight/8;

        // Join new game button
        let newGameButton = new PIXI.Graphics();
        newGameButton.eventMode = 'static';
        newGameButton.on('pointerup', (event) => { console.log('New game'); } );
        newGameButton.beginFill(0xDE3249);
        const newGameY = 17 * this.appHeight/32;
        newGameButton.drawRect(x, newGameY, buttonWidth, buttonHeight);
        newGameButton.endFill();
        
        graphics.addChild(newGameButton);

        // Join existing game button
        let existingGameButton = new PIXI.Graphics();
        existingGameButton.eventMode = 'static';
        existingGameButton.on('pointerup', (event) => { console.log('Existing game'); } );
        graphics.beginFill(0xDE3249);
        const existingGameY = 20 * this.appHeight/32;
        graphics.drawRect(x, existingGameY, buttonWidth, buttonHeight);
        graphics.endFill();
        graphics.addChild(existingGameButton);

        this.app.stage.addChild(graphics);
    }
}
