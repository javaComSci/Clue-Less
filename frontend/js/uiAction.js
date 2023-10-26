/*
 * Performs an action on the UI
 */
import { UIState } from '/js/uiState.js';

export class UIAction
{
	constructor()
	{
		this.ui = new UIState();
	}
	/*
	 * Methods to be defined
	 */
	move()
	{
	}
	suggestion()
	{
	}
	accusation()
	{
	}
	gameend()
	{
	}
}

/*
 * non-implemented code saved for future reference
/*
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = window;
*/
//PIXI.Assets.loader('assets/gamemap.png');

//const gamemap = PIXI.Sprite.from("/assets/gamemap.png");
/*
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0x66CCFF);
rectangle.drawRect(Mb,Mb,Re,Re);
rectangle.endFill();
app.stage.addChild(rectangle);
//app.stage.addChild(gamemap);
*/
/*
const map = PIXI.Sprite.from("/assets/gamemap.png");
map.width = Re;
map.height = Re;
room_rectangles[0].mask = map;*/


