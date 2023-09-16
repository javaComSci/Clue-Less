import { io } from '../index';

export function requestMove()
{
}

export function alertGameCannotStart()
{
    io.sockets.emit('gameCannotStart');
}