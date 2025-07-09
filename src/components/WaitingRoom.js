import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const WaitingRoom = ({ gameCode, onGameStart }) => {
    const { waitingRoomData, emit } = useSocket();
    const [playerSlots, setPlayerSlots] = useState([]);
    const [canStartGame, setCanStartGame] = useState(false);

    useEffect(() => {
        if (waitingRoomData) {
            const existingPlayerIds = playerSlots.map(slot => slot.id);
            const newPlayers = [];

            for (const [simpleId, summary] of Object.entries(waitingRoomData)) {
                if (!existingPlayerIds.includes(simpleId)) {
                    newPlayers.push({
                        id: simpleId,
                        name: summary.name,
                        isCurrentPlayer: simpleId === localStorage.getItem('playerSimpleId')
                    });
                }
            }

            setPlayerSlots(prev => [...prev, ...newPlayers]);
            
            // Check if current player is the host (first player)
            const currentPlayerId = localStorage.getItem('playerSimpleId');
            const isHost = Object.keys(waitingRoomData)[0] === currentPlayerId;
            setCanStartGame(isHost && Object.keys(waitingRoomData).length >= 2);
        }
    }, [waitingRoomData]);

    const handleStartGame = () => {
        const gameId = localStorage.getItem('gameId');
        const playerId = localStorage.getItem('playerId');
        emit('start_game', { gameId, playerId });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="welcome-box rounded-3xl p-8 max-w-2xl w-full shadow-xl border-4 border-amber-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Waiting Room</h2>
                    <p className="text-lg text-amber-700">Game Code: <span className="font-bold">{gameCode}</span></p>
                    <p className="text-amber-600">Waiting for players to join...</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {playerSlots.map((player, index) => (
                        <div 
                            key={player.id} 
                            className={`rounded-xl p-4 flex items-center ${
                                player.isCurrentPlayer ? 'bg-amber-50' : 'bg-gray-100'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center overflow-hidden">
                                {player.isCurrentPlayer ? (
                                    <img 
                                        src="https://placedog.net/100/100?random=10" 
                                        alt="Player" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <i className="fas fa-user text-green-400"></i>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-500">
                                    {player.isCurrentPlayer ? 'You' : player.name}
                                </p>
                                {player.isCurrentPlayer && (
                                    <p className="text-sm text-amber-600">Ready</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center">
                    {canStartGame && (
                        <button 
                            onClick={handleStartGame}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl"
                        >
                            Start Game
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom; 