/*
 * Updates the UI for login.
 */

export class UILogin
{
	constructor(msgEngine)
	{
		this.msgEngine = msgEngine;
		this.proposedPlayerId = "";
        this.playerId = undefined;

        this.appHeight = 1600;
        this.appWidth = 1600;

        this.dividedX = this.appWidth/8;
        this.dividedY = this.appHeight/32; 

        this.buttonWidth = this.appWidth/4;
        this.buttonHeight = this.appHeight/16;

        this.isGameStarter = undefined;

        this.proposedGameId = "";
        this.gameId = undefined;

        this.app = new PIXI.Application({ height: this.appHeight, width: this.appWidth});
		document.body.appendChild(this.app.view);

        this.fontFamily = "\"Lucida Console\", Monaco, monospace";

        PIXI.Assets.load('../assets/background.png').then((data) => {
            this.sheet = data;
            this.hand = PIXI.Sprite.from('../assets/hand.png');
            this.createGameDisplay();
        }); 

        this.error = undefined;
	}

    setupStage(shouldGeneratePrints)
    {
        // Clear stage
        while(this.app.stage.children[0]){
            this.app.stage.removeChild(this.app.stage.children[0]);
        }

        // Add background
        const background = new PIXI.Sprite(this.sheet);
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.app.stage.addChild(background);

        // if (shouldGeneratePrints)
        // {
        //     this.generatePrints();
        // }

        // this.generatePrintsDiagonal();
        this.generatePrints();
        // this.generatePrintsEverywhere();

        this.renderTitle();
    }

    generatePrints() {
        this.hand.anchor.set(0.5);
        this.app.stage.addChild(this.hand);
        this.hand.x = 800;
        this.hand.y = 550;
        this.hand.rotation = 0.5;
        let xLocations = [400, 500, 600, 700, 800, 900, 1000];
        let index = 0;
        let seconds = 0;
        this.app.ticker.add((delta) =>
        {
            seconds += (1 / 60) * delta;
            if(seconds >= 3)
            {
                let location = xLocations[index];
                index = (index + 1) % xLocations.length;
                this.hand.x = location;
                seconds = 0
                this.hand.rotation += delta
            }
        });
    }

    generatePrintsEverywhere() {
        this.hand.anchor.set(0.5);
        this.app.stage.addChild(this.hand);
        this.hand.x = 400;
        this.hand.y = 550;
        this.hand.rotation = 0.5;
        let xLocations = [400, 500, 457, 700, 890, 230, 100];
        let yLocations = [100, 700, 500, 200, 1000, 560, 234];
        let index = 0;
        let seconds = 0;
        this.app.ticker.add((delta) =>
        {
            seconds += (1 / 60) * delta;
            if(seconds >= 3)
            {
                let xLocation = xLocations[index];
                let yLocation = yLocations[index];
                index = (index + 1) % xLocations.length;
                this.hand.x = xLocation;
                this.hand.y = yLocation;
                this.hand.rotation += delta;
                seconds = 0
            }
        });
    }

    generatePrintsDiagonal() {
        this.hand.anchor.set(0.5);
        this.app.stage.addChild(this.hand);
        this.hand.x = 100;
        this.hand.y = 1600;
        this.hand.rotation = 0.5;
        let index = 0;
        let seconds = 0;
        this.app.ticker.add((delta) =>
        {
            seconds += (1 / 60) * delta;
            if(seconds >= 3)
            {
                let xLocation = this.hand.x + 100;
                let yLocation = this.hand.y - 100;
                if (xLocation == this.appHeight) {
                    xLocation = 100;
                }
                if (yLocation == 100) {
                    yLocation = 1600;
                }
                this.hand.x = xLocation;
                this.hand.y = yLocation;
                this.hand.rotation += delta;
                seconds = 0
            }
        });
    }

    generateGameId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 2) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    onClickCreateNewGameChoice(e)
    {
        this.isGameStarter = true;
        this.proposedGameId = this.generateGameId();
        this.msgEngine.sendWithCallback('createNewGame', { 'playerId': this.proposedPlayerId, 'gameId': this.proposedGameId }, (response) => {
            if (response == "Created") {
                this.gameId = this.proposedGameId;
				this.playerId = this.proposedPlayerId;
            }
            else if (response == "EmptyPlayerName") {
                this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game not created. Enter non-empty player name.", 30);
            }
            else if (response == "ExistingGame") {
                this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game not created as game already exists.", 30);
            }
			else if (response == "ExistingPlayer") {
				this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game not created. Enter different player name.", 30);
			}
        });
    }

    onClickJoinExistingGameChoice(e)
    {
        if (this.proposedPlayerId.trim() == "")
        {
            this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Enter non-empty player name.", 30);
        }
        else
        {
            this.isGameStarter = false;
            this.renderJoinGameWithGameID();
        }
    }

    onClickJoinGameWithID(e)
    {
        this.msgEngine.sendWithCallback('joinExistingGame', { 'playerId': this.proposedPlayerId, 'gameId': this.proposedGameId }, (response) => {
            if (response == "Joined") {
                this.gameId = this.proposedGameId;
				this.playerId = this.proposedPlayerId;
            }
            else if (response == "EmptyPlayerName") {
                this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game not created. Enter non-empty player name.", 30);
            }
            else if (response == "NoGame") {
                this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game could not be found. Please enter valid game ID.", 30);
            }
			else if (response == "ExistingPlayer") {
				this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Player name already exists. Please enter different name.", 30);
			}
            else if (response == "AlreadyInProgress") {
				this.renderError(this.getXPlacement(3), this.getYPlacement(10), "Game is already in progress. Please enter a different game ID.", 30);
			}
        });
    }

    onClickStartGame(e)
    {
        this.msgEngine.sendWithCallback('start', { 'playerId': this.playerId, 'gameId': this.gameId }, (response) => {
            if (response) {
                // All the players need to see the game board now. Relying on the server to communicate that the game is starting to the clients.
            }
            else {
                this.renderError(this.getXPlacement(3), this.getYPlacement(14), "Game could not be started due to insufficient number of players. At least 3 players are required to start the game.", 20);
            }
        });
    }

    renderTitle()
    {
		let text = new PIXI.Text(
            "Clue-Less", {
            fontSize: 100,
            fill: 0x5C4033,
            fontFamily: this.fontFamily,
            fontWeight: 'bolder'
        });
        text.x = this.getXPlacement(3) + this.buttonWidth/2 - text.width/2;
        text.y = this.getYPlacement(7) + this.buttonHeight/2 - text.height/2;

        this.app.stage.addChild(text);
    }

    createGameDisplay()
    {
        this.setupStage(false);
        const graphics = new PIXI.Graphics();

		// Allow user to add in a player name
		let input = this.createTextInput(this.getXPlacement(3), this.getYPlacement(13), "Player Name", (e) => this.onPlayerNameInputHandler(e));
		graphics.addChild(input);

        // Join new game button
        let newGameButton = this.createButton(this.getXPlacement(3), this.getYPlacement(17), "Create New Game", 30, (e) => this.onClickCreateNewGameChoice(e));
        graphics.addChild(newGameButton);

        // Join existing game button
        let existingGameButton = this.createButton(this.getXPlacement(3), this.getYPlacement(20), "Join Game with GameID", 30, (e) => this.onClickJoinExistingGameChoice(e));
        graphics.addChild(existingGameButton);

        this.app.stage.addChild(graphics);
    }

    createButton(x, y, buttonText, fontSize, clickHandler)
    {
        let button = new PIXI.Graphics();
        button.eventMode = 'static';
        button.on('pointerup', (event) => { clickHandler(event) } );
        button.beginFill(0x6F4E37);
        button.drawRect(x, y, this.buttonWidth, this.buttonHeight);
        button.endFill();
        
        let text = new PIXI.Text(
            buttonText, {
            fontSize: fontSize,
            fill: 0xffffff,
            fontFamily: this.fontFamily
        }
        );
        text.x = x + this.buttonWidth/2 - text.width/2;
        text.y = y + this.buttonHeight/2 - text.height/2;
        button.addChild(text);

        return button;
    }

	onGameNameInputHandler(text) {
		this.proposedGameId = text;
	}

	onPlayerNameInputHandler(text) {
		this.proposedPlayerId = text;
	}

    createTextInput(x, y, placeholder, typeHandler)
    {
        var input = new PIXI.TextInput({
            input: {
                fontSize: '35px',
                width: this.buttonWidth,
                height: this.buttonHeight,
                fontFamily: this.fontFamily
            }, 
            box: {
                fill: 0xEEEEEE,
                rounded: 10
            }
        });

        input.x = x; 
        input.y = y;

        input.placeholder = placeholder;

        input.on('input', text => {
			typeHandler(text);
        });

        return input;
    }

    renderError(x, y, textValue, fontSize)
    {
        if (this.error) {
            this.app.stage.removeChild(this.error);
        }
        
        let text = new PIXI.Text(
            textValue, {
            fontSize: fontSize,
            fill: 0xDE3249,
            fontFamily: this.fontFamily
        }
        );
        text.x = x + this.buttonWidth/2 - text.width/2;
        text.y = y + this.buttonHeight/2 - text.height/2;
        
        this.error = text;
        this.app.stage.addChild(this.error);
    }

    renderJoinGameWithGameID()
    {
        this.setupStage(false);

        const graphics = new PIXI.Graphics();

        let input = this.createTextInput(this.getXPlacement(3), this.getYPlacement(16), "Enter GameID", (e) => this.onGameNameInputHandler(e));
        graphics.addChild(input);

        let joinGameButton = this.createButton(this.getXPlacement(3), this.getYPlacement(19), "Join Game", 30, (e) => this.onClickJoinGameWithID(e));
        graphics.addChild(joinGameButton);

        this.app.stage.addChild(graphics);
        input.focus();
    }

    getDisplayWaitingText(xFactor, yFactor, text, fontSize) {
        let waitText = new PIXI.Text(
            text, {
            fontSize: fontSize,
            fill: 0x6F4E37,
            fontFamily: this.fontFamily
        });
        waitText.x = this.getXPlacement(xFactor) + this.buttonWidth/2 - waitText.width/2;
        waitText.y = this.getYPlacement(yFactor) + this.buttonHeight/2 - waitText.height/2;
        return waitText;
    }

    displayWaitRoom(obj)
	{
        this.setupStage(true);
        const graphics = new PIXI.Graphics();

        let gameIdText = this.getDisplayWaitingText(3, 13, "Game ID: "  + this.gameId, 60);
        graphics.addChild(gameIdText);

        if (!this.isGameStarter)
        {
            let moreInfoText = this.getDisplayWaitingText(3, 15, "Waiting for host to start the game...", 30);
            graphics.addChild(moreInfoText);
        }
        
        // Display "Start" button and all players for the host
        if (this.isGameStarter)
        {
            let playersText = this.getDisplayPlayersList(obj, 3, 15);
            graphics.addChild(playersText);

            let startButton = this.createButton(this.getXPlacement(3), this.getYPlacement(19), "Start Game", 30, (e) => this.onClickStartGame(e));
            graphics.addChild(startButton);
        }

        this.app.stage.addChild(graphics);
	}

    getDisplayPlayersList(obj, xFactor, yFactor)
    {
        let playersObj = obj.players;
        let players = playersObj.map((a) => {
            return a.playerId;
        });
        let playersText = new PIXI.Text(
            "Players: "  + players, {
            fontSize: 40,
            fill: 0x6F4E37,
            fontFamily: this.fontFamily
        });
        playersText.x = this.getXPlacement(xFactor) + this.buttonWidth/2 - playersText.width/2;
        playersText.y = this.getYPlacement(yFactor) + this.buttonHeight/2 - playersText.height/2;
        return playersText;
    }

    getXPlacement(factor)
    {
        return factor * this.dividedX;
    }

    getYPlacement(factor)
    {
        return factor * this.dividedY;
    }
}
