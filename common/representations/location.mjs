import { GameCard } from './gameCard.mjs';

export const LocationConstants = {
    Room: {
        HALL: 'HALL',
        LOUNGE: 'LOUNGE',
        DININGROOM: 'DININGROOM',
        KITCHEN: 'KITCHEN',
        BALLROOM: 'BALLROOM',
        CONSERVATORY: 'CONSERVATORY',
        LIBRARY: 'LIBRARY',
        STUDY: 'STUDY',
        BILLIARDROOM: 'BILLIARDROOM'
    },
    Hallway: {
        HALL_LOUNGE: 'HALL_LOUNGE',
        LOUNGE_DININGROOM: 'LOUNGE_DININGROOM',  
        DININGROOM_KITCHEN: 'DININGROOM_KITCHEN', 
        KITCHEN_BALLROOM: 'KITCHEN_BALLROOM',
        BALLROOM_CONSERVATORY: 'BALLROOM_CONSERVATORY',
        CONSERVATORY_LIBRARY: 'CONSERVATORY_LIBRARY',
        LIBRARY_STUDY: 'LIBRARY_STUDY',
        STUDY_HALL: 'STUDY_HALL',
        HALL_BILLIARDROOM: 'HALL_BILLIARDROOM',
        LIBRARY_BILLIARDROOM: 'LIBRARY_BILLIARDROOM',
        DININGROOM_BILLIARDROOM: 'DININGROOM_BILLIARDROOM',
        BALLROOM_BILLIARDROOM: 'BALLROOM_BILLIARDROOM'
    },
    Start: {
        HALL_LOUNGE_HOME: 'HALL_LOUNGE_HOME',
        LOUNGE_DININGROOM_HOME: 'LOUNGE_DININGROOM_HOME',
        KITCHEN_BALLROOM_HOME: 'KITCHEN_BALLROOM_HOME',
        BALLROOM_CONSERVATORY_HOME: 'BALLROOM_CONSERVATORY_HOME',
        CONSERVATORY_LIBRARY_HOME: 'CONSERVATORY_LIBRARY_HOME',
        LIBRARY_STUDY_HOME: 'LIBRARY_STUDY_HOME'
    },
    None: 'NONE'
};

export const DiagonalRooms = {
    STUDY: 'KITCHEN',
    KITCHEN: 'STUDY',
    LOUNGE: 'CONSERVATORY',
    CONSERVATORY: 'LOUNGE'
};

export const STAY = 'STAY';
export const CANNOTMOVE = 'CANNOTMOVE';

export const CardLocations = [
    LocationConstants.Room.HALL,
    LocationConstants.Room.LOUNGE,
    LocationConstants.Room.DININGROOM,
    LocationConstants.Room.KITCHEN,
    LocationConstants.Room.BALLROOM,
    LocationConstants.Room.CONSERVATORY,
    LocationConstants.Room.LIBRARY,
    LocationConstants.Room.STUDY,
    LocationConstants.Room.BILLIARDROOM
];

export class LocationCard extends GameCard
{
    constructor(name)
    {
        super(name, 'LOCATION')
    }
}

export function getAvailableHallwaysForMoving(roomLocation, totalCharacterPieces) {
    // Get the hallways adjacent to the room.
    let adjacentHallways = [];
    for (let hallway in LocationConstants.Hallway) {
        let connectingRooms = hallway.split("_");
        if (roomLocation == connectingRooms[0] || roomLocation == connectingRooms[1]) {
            adjacentHallways.push(hallway);
        }
    }

    // For the hallways that are adjacent, check if any character already is there.
    let potentialHallways = [];
    for (let adjacentHallway of adjacentHallways) {
        if (totalCharacterPieces.map(piece => piece.currentLocation).indexOf(adjacentHallway) === -1) {
            potentialHallways.push(adjacentHallway);
        }
    }

    return potentialHallways;
}

export function getAvailableDiagonalRoomsForMoving(roomLocation) {
    if (roomLocation in DiagonalRooms) {
        return [DiagonalRooms[roomLocation]];
    }

    return [];
}

export function getStayMove(character, playerId) {
    if (character.pieceMover != playerId) {
        return [character.currentLocation];
        // return [STAY];
    }

    return [];
}