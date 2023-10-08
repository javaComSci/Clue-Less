//import { initializeGame } from '/js/initialize.js' 
const app = new PIXI.Application({ height: 1200, width: 1200});
/*
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = window;
*/
document.body.appendChild(app.view);
//PIXI.Assets.loader('assets/gamemap.png');

// screen width
const Sw = app.renderer.view.width;
// screen height
const Sh = app.renderer.view.height;
// map buffer
const Mb = 25;
// map width
const Mw = Sw - 2 * Mb;
// map height
const Mh = Sh - 2 * Mb;
// room edge
const Re = Mh/5;
// hallway ( long side )
const Hl = Re;
// hallway ( short side )
const Hs = Re/3;

const room_coordinates = [
	[ Mb, Mb ],
	[ Mb, Mb + Re + Hl ],
	[ Mb, Mb + 2 * ( Re + Hl ) ],
	[ Mb + Re + Hl, Mb ],
	[ Mb + Re + Hl, Mb + Re + Hl ],
	[ Mb + Re + Hl, Mb + 2 * ( Re + Hl ) ],
	[ Mb + 2 * ( Re + Hl ), Mb ],
	[ Mb + 2 * ( Re + Hl ), Mb + Re + Hl ],
	[ Mb + 2 * ( Re + Hl ), Mb + 2 * ( Re + Hl ) ]
];

const hallway_across_coordinates = [
	[ Mb + Re, Mb + Re/3 ],
	[ Mb + Re, Mb + Re/3 + Hl + Re ],
	[ Mb + Re, Mb + Re/3 + 2 * ( Hl + Re ) ],
	[ Mb + Re + Hl + Re, Mb + Re/3 ],
	[ Mb + Re + Hl + Re, Mb + Re/3 + Hl + Re ],
	[ Mb + Re + Hl + Re, Mb + Re/3 + 2 * ( Hl + Re ) ],
];

const hallway_down_coordinates = [
	[ Mb + Re/3, Mb + Re ],
	[ Mb + Re/3, Mb + Hl + ( 2 * Re ) ],
	[ Mb + Re/3 + Hl + Re, Mb + Re ],
	[ Mb + Re/3 + Hl + Re, Mb + Re + Hl + Re ],
	[ Mb + Re/3 + 2 * ( Hl + Re ), Mb + Re ],
	[ Mb + Re/3 + 2 * ( Hl + Re ), Mb + Re + Hl + Re ]
];

let room_rectangles = [];
room_coordinates.forEach((room) => {
	const rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(room[0],room[1],Re,Re);
	rectangle.endFill();
	app.stage.addChild(rectangle);
	room_rectangles.push(rectangle);
});

/*
const map = PIXI.Sprite.from("/assets/gamemap.png");
map.width = Re;
map.height = Re;
room_rectangles[0].mask = map;*/


let hallway_rectangles = [];
hallway_across_coordinates.forEach((hallway) => {
	const rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(hallway[0],hallway[1],Hl,Hs);
	rectangle.endFill();
	app.stage.addChild(rectangle);
	hallway_rectangles.push(rectangle);
});

hallway_down_coordinates.forEach((hallway) => {
	const rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(hallway[0],hallway[1],Hs,Hl);
	rectangle.endFill();
	app.stage.addChild(rectangle);
	hallway_rectangles.push(rectangle);
});
//const gamemap = PIXI.Sprite.from("/assets/gamemap.png");
/*
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0x66CCFF);
rectangle.drawRect(Mb,Mb,Re,Re);
rectangle.endFill();
app.stage.addChild(rectangle);
//app.stage.addChild(gamemap);
*/
