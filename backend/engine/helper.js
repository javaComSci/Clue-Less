import { CardWeapons, WeaponPiece, WeaponCard } from '../../common/representations/weapon.mjs';
import { CardCharacters, CharacterConstants, CharacterPiece, CharacterCard } from  '../../common/representations/character.mjs';
import { LocationConstants, CardLocations, LocationCard, DiagonalRooms, STAY, CANNOTMOVE } from '../../common/representations/location.mjs';

export function shuffleInPlace(arr)
{
    arr.sort((a, b) => 0.5 - Math.random());
}

export function createWeaponPieces()
{
    let weaponPieces = [];
    CardWeapons.forEach(weaponConstant => weaponPieces.push(new WeaponPiece(weaponConstant, LocationConstants.None)));
    return weaponPieces;
}

export function createCharacterPieces()
{
    // Provide starting locations on initialization of character cards.
    var scarlet = new CharacterPiece(CharacterConstants.SCARLET, LocationConstants.Start.HALL_LOUNGE_HOME);
    var plum = new CharacterPiece(CharacterConstants.PLUM, LocationConstants.Start.LIBRARY_STUDY_HOME);
    var peacock = new CharacterPiece(CharacterConstants.PEACOCK, LocationConstants.Start.CONSERVATORY_LIBRARY_HOME);
    var green = new CharacterPiece(CharacterConstants.GREEN, LocationConstants.Start.BALLROOM_CONSERVATORY_HOME);
    var white = new CharacterPiece(CharacterConstants.WHITE, LocationConstants.Start.KITCHEN_BALLROOM_HOME);
    var mustard = new CharacterPiece(CharacterConstants.MUSTARD, LocationConstants.Start.LOUNGE_DININGROOM_HOME);
    
    // Shuffle the characters randomly so that when characters become assigned to players, there is random assignment.
    // Scarlet is always assigned to the first player joining the game though.
    var characters = [plum, peacock, green, white, mustard];
    shuffleInPlace(characters);
    characters.splice(0, 0, scarlet);
    return characters;
}

export function createCharacterCards()
{
    let characterCards = [];
    CardCharacters.forEach(characterConstant => characterCards.push(new CharacterCard(characterConstant)));
    return characterCards;
}

export function createWeaponCards()
{
    let weaponCards = [];
    CardWeapons.forEach(weaponConstant => weaponCards.push(new WeaponCard(weaponConstant)));
    return weaponCards;
}

export function createLocationCards()
{
    let locationCards = [];
    CardLocations.forEach(locationConstant => locationCards.push(new LocationCard(locationConstant)));
    return locationCards;
}

export function getCharacterPieceByCharacterName(totalCharacterPieces, characterName)
{
    return totalCharacterPieces.find(characterPiece => characterPiece.name == characterName);
}

export function getWeaponPieceByWeaponName(totalWeaponPieces, weaponName)
{
    return totalWeaponPieces.find(weaponPiece => weaponPiece.name == weaponName);
}