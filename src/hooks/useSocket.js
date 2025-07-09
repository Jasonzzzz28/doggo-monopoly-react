import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ENV } from '../config';

export const useSocket = () => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [waitingRoomData, setWaitingRoomData] = useState(null);

    const connectToSocket = (playerId, gameId) => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        socketRef.current = io(ENV.LOCAL_BACKEND_SERVER_URL);
        
        socketRef.current.on('connect', () => {
            console.log('Connected to game server');
            setIsConnected(true);
            
            if (playerId && gameId) {
                socketRef.current.emit('connect_to_game', {
                    gameId: gameId,
                    playerId: playerId
                });
            }
        });

        socketRef.current.on('waiting_room_update', (data) => {
            console.log('Waiting room update', data);
            setWaitingRoomData(JSON.parse(data));
        });

        socketRef.current.on('game_update', (data) => {
            console.log('Game started', data);
            setGameData(JSON.parse(data.game));
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from game server');
            setIsConnected(false);
            // Attempt to reconnect after 1 second
            setTimeout(() => {
                if (playerId && gameId) {
                    connectToSocket(playerId, gameId);
                }
            }, 1000);
        });

        socketRef.current.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return socketRef.current;
    };

    const emit = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        gameData,
        waitingRoomData,
        connectToSocket,
        emit,
        disconnect
    };
}; 