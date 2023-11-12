import { LocationConstants } from './location.mjs';

export class GamePiece
{
    constructor(name, startingLocation, type)
    {
        this.name = name;
        this.currentLocation = startingLocation;
        this.type = type;
        this.pieceMover = undefined;
    }

    movePiece(newLocation, mover) {
		this.pieceMover = mover;
		this.priorLocation = this.currentLocation;
		this.currentLocation = newLocation;
	}

    movePieceToNearestRoom()
    {
        if (this.currentLocation in LocationConstants.Hallway)
        {
            let connectingRooms = hallway.split("_");
            this.movePiece(connectingRooms[0], this.pieceMover);
        }
    }
}