/*
 * Interface ( facade ) between the user and the UI for login.
 */

import { GameBoardClient } from '/js/gameBoardClient.js';

export class LoginClient
{
	constructor(msgEngine, playerId)
	{
        this.msgEngine = msgEngine;
        this.playerId = playerId;

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

        this.createGameChooseButtons();
	}

    clearStage()
    {
        while(this.app.stage.children[0]){
            this.app.stage.removeChild(this.app.stage.children[0]);
        }
    }

    generateGameId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 5) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    onClickCreateNewGameChoice(e)
    {
        this.isGameStarter = true;
        this.proposedGameId = this.generateGameId();
        this.msgEngine.sendWithCallback('createNewGame', { 'playerId': this.playerId, 'gameId': this.proposedGameId }, (response) => {
            if (response) {
                this.gameId = this.proposedGameId;
            }
            else {
                this.renderError(this.getXPlacement(3), this.getYPlacement(14), "Game could not created", 20);
            }
        });
    }

    onClickJoinExistingGameChoice(e)
    {
        this.isGameStarter = false;
        this.renderJoinGameWithGameID();
    }

    onClickJoinGameWithID(e)
    {
        let gameId = this.proposedGameId;
        this.msgEngine.sendWithCallback('joinExistingGame', { 'playerId': this.playerId, 'gameId': gameId }, (response) => {
            if (response) {
                this.gameId = gameId;
            }
            else {
                this.renderError(this.getXPlacement(3), this.getYPlacement(14), "Game could not be found. Please enter valid game ID.", 20);
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

    createGameChooseButtons()
    {
        const graphics = new PIXI.Graphics();

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
        button.beginFill(0xDE3249);
        button.drawRect(x, y, this.buttonWidth, this.buttonHeight);
        button.endFill();
        
        let text = new PIXI.Text(
            buttonText, {
            fontSize: fontSize,
            fill: 0xffffff
        }
        );
        text.x = x + this.buttonWidth/2 - text.width/2;
        text.y = y + this.buttonHeight/2 - text.height/2;
        button.addChild(text);

        return button;
    }

    createTextInput(placeholder)
    {
        var input = new PIXI.TextInput({
            input: {
                fontSize: '35px',
                width: this.buttonWidth,
                height: this.buttonHeight
            }, 
            box: {
                fill: 0xEEEEEE,
                rounded: 10
            }
        });

        input.x = this.getXPlacement(3);
        input.y = this.getYPlacement(16);

        input.placeholder = placeholder;

        input.on('input', text => {
            this.proposedGameId = text;
        });

        return input;
    }

    renderError(x, y, textValue, fontSize)
    {
        let text = new PIXI.Text(
            textValue, {
            fontSize: fontSize,
            fill: 0xDE3249
        }
        );
        text.x = x + this.buttonWidth/2 - text.width/2;
        text.y = y + this.buttonHeight/2 - text.height/2;
        
        this.app.stage.addChild(text);
    }

    renderJoinGameWithGameID()
    {
        this.clearStage();

        const graphics = new PIXI.Graphics();

        let input = this.createTextInput("Enter GameID");
        graphics.addChild(input);

        let joinGameButton = this.createButton(this.getXPlacement(3), this.getYPlacement(19), "Join Game", 30, (e) => this.onClickJoinGameWithID(e));
        graphics.addChild(joinGameButton);

        this.app.stage.addChild(graphics);
        input.focus();
    }

    renderWaiting(waitingText)
    {
        this.clearStage();
        
        const graphics = new PIXI.Graphics();

        let text = new PIXI.Text(
            waitingText, {
            fontSize: 30,
            fill: 0xFFFFFF
        }
        );
        text.x = this.getXPlacement(3) + this.buttonWidth/2 - text.width/2;
        text.y = this.getYPlacement(15) + this.buttonHeight/2 - text.height/2;

        graphics.addChild(text);
        this.app.stage.addChild(graphics);
    }

    displayWaitRoom(obj)
	{
        this.clearStage();

        let players = obj.players;
        const graphics = new PIXI.Graphics();

        // Display game ID
        let gameIdText = new PIXI.Text(
            "Game ID: "  + this.gameId, {
            fontSize: 40,
            fill: 0xFFFFFF
        });
        gameIdText.x = this.getXPlacement(3) + this.buttonWidth/2 - gameIdText.width/2;
        gameIdText.y = this.getYPlacement(13) + this.buttonHeight/2 - gameIdText.height/2;
        graphics.addChild(gameIdText);

        // Display player list
        
        // Display "Start" button for the host if more than 3 players
        if (this.isGameStarter)
        {
            let startButton = this.createButton(this.getXPlacement(3), this.getYPlacement(20), "Start Game", 30, (e) => this.onClickStartGame(e));
            graphics.addChild(startButton);
        }

        this.app.stage.addChild(graphics);
	}

    displayGameBoard()
    {
        window.client = new GameBoardClient(this.msgEngine, this.playerId);
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
