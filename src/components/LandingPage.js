import React, { useState } from 'react';
import { gameService } from '../services/gameService';
import { useSocket } from '../hooks/useSocket';

const LandingPage = ({ onGameStart, onWaitingRoom }) => {
    const [activePanel, setActivePanel] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [playerCount, setPlayerCount] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { connectToSocket } = useSocket();

    const showJoinGamePanel = () => {
        setActivePanel('join');
        setError('');
    };

    const showCreateGamePanel = () => {
        setActivePanel('create');
        setError('');
    };

    const handleJoinGame = async () => {
        if (!playerName.trim() || !gameCode.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await gameService.joinGame(gameCode, playerName);
            
            // Store player data in localStorage
            localStorage.setItem('playerId', data.playerId);
            localStorage.setItem('playerSimpleId', data.playerSimpleId);
            localStorage.setItem('playerName', data.playerName);
            localStorage.setItem('playerCount', data.numberOfPlayers);
            localStorage.setItem('gameId', gameCode);

            // Connect to socket
            connectToSocket(data.playerId, gameCode);
            
            onWaitingRoom(gameCode);
        } catch (error) {
            setError('Failed to join game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGame = async () => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await gameService.createGame(playerCount);
            
            // Store game data
            localStorage.setItem('gameId', data.gameId);
            localStorage.setItem('playerCount', playerCount);

            // Join the created game
            const joinData = await gameService.joinGame(data.gameId, playerName);
            
            localStorage.setItem('playerId', joinData.playerId);
            localStorage.setItem('playerSimpleId', joinData.playerSimpleId);
            localStorage.setItem('playerName', joinData.playerName);

            // Connect to socket
            connectToSocket(joinData.playerId, data.gameId);
            
            onWaitingRoom(data.gameId);
        } catch (error) {
            setError('Failed to create game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 landing-bg flex flex-col items-center justify-center p-4 transition-opacity duration-500">
            <div className="welcome-box rounded-3xl p-8 max-w-2xl w-full shadow-xl border-4 border-amber-200">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-6">
                        <i className="fas fa-paw text-amber-600 text-5xl mr-4"></i>
                        <h1 className="text-5xl font-bold text-amber-800">Doggo Monopoly</h1>
                    </div>
                    <p className="text-xl text-amber-900 mb-2">The cutest business strategy game for dog lovers!</p>
                    <p className="text-lg text-amber-800">Build your empire one tail wag at a time.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button 
                        onClick={showCreateGamePanel} 
                        className="landing-btn bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                    >
                        <i className="fas fa-plus-circle text-2xl mb-2"></i>
                        <span>Create Game</span>
                    </button>
                    
                    <button 
                        onClick={showJoinGamePanel} 
                        className="landing-btn bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                    >
                        <i className="fas fa-sign-in-alt text-2xl mb-2"></i>
                        <span>Join Game</span>
                    </button>
                    
                    <button className="landing-btn bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                        <i className="fas fa-question-circle text-2xl mb-2"></i>
                        <span>How to Play</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Join Game Panel */}
                {activePanel === 'join' && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full mx-auto mb-8">
                        <h3 className="text-xl font-bold text-center mb-4 text-amber-800">Join Existing Game</h3>
                        <div className="mb-4">
                            <label className="block text-amber-700 mb-2">Your Name:</label>
                            <input 
                                type="text" 
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name" 
                                className="w-full px-4 py-2 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-amber-700 mb-2">Enter Game Code:</label>
                            <input 
                                type="text" 
                                value={gameCode}
                                onChange={(e) => setGameCode(e.target.value)}
                                placeholder="Enter game code" 
                                className="w-full px-4 py-2 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <button 
                            onClick={handleJoinGame}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-xl"
                        >
                            {loading ? 'Joining...' : 'Join Game'}
                        </button>
                    </div>
                )}

                {/* Create Game Panel */}
                {activePanel === 'create' && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full mx-auto mb-8">
                        <h3 className="text-xl font-bold text-center mb-4 text-amber-800">Create New Game</h3>
                        <div className="mb-4">
                            <label className="block text-amber-700 mb-2">Your Name:</label>
                            <input 
                                type="text" 
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name" 
                                className="w-full px-4 py-2 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-amber-700 mb-2">Number of Players:</label>
                            <select 
                                value={playerCount}
                                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                                className="w-full px-4 py-2 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500"
                            >
                                <option value={2}>2 Players</option>
                                <option value={3}>3 Players</option>
                                <option value={4}>4 Players</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleCreateGame}
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 px-4 rounded-xl"
                        >
                            {loading ? 'Creating...' : 'Create Game'}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-4 right-4">
                <div className="floating-dog bg-white p-3 rounded-full shadow-lg">
                    <img src="https://placedog.net/100/100?random=1" alt="Happy Dog" className="w-16 h-16 rounded-full object-cover border-4 border-amber-300" />
                </div>
            </div>
            
            {/* Random paw prints */}
            <div className="paw-print top-1/4 left-1/4 text-amber-300 text-4xl"><i className="fas fa-paw"></i></div>
            <div className="paw-print top-1/3 right-1/4 text-amber-300 text-4xl"><i className="fas fa-paw"></i></div>
            <div className="paw-print bottom-1/4 left-1/3 text-amber-300 text-4xl"><i className="fas fa-paw"></i></div>
            <div className="paw-print bottom-1/3 right-1/3 text-amber-300 text-4xl"><i className="fas fa-paw"></i></div>
        </div>
    );
};

export default LandingPage; 