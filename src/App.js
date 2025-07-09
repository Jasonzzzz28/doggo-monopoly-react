import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import LandingPage from './components/LandingPage';
import WaitingRoom from './components/WaitingRoom';
import GameScreen from './components/GameScreen';
import Notification from './components/Notification';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('landing');
    const [gameCode, setGameCode] = useState('');
    const [notification, setNotification] = useState(null);
    const { gameData, connectToSocket } = useSocket();

    useEffect(() => {
        // Check if we're already in a game
        const existingGameId = localStorage.getItem('gameId');
        const existingPlayerId = localStorage.getItem('playerId');
        
        if (existingGameId && existingPlayerId) {
            setGameCode(existingGameId);
            connectToSocket(existingPlayerId, existingGameId);
            setCurrentScreen('waiting');
        }
    }, [connectToSocket]);

    useEffect(() => {
        if (gameData) {
            setCurrentScreen('game');
        }
    }, [gameData]);

    const handleWaitingRoom = (code) => {
        setGameCode(code);
        setCurrentScreen('waiting');
    };

    const handleGameStart = () => {
        setCurrentScreen('game');
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <div className="min-h-screen">
            {currentScreen === 'landing' && (
                <LandingPage 
                    onGameStart={handleGameStart}
                    onWaitingRoom={handleWaitingRoom}
                />
            )}
            
            {currentScreen === 'waiting' && (
                <WaitingRoom 
                    gameCode={gameCode}
                    onGameStart={handleGameStart}
                />
            )}
            
            {currentScreen === 'game' && gameData && (
                <GameScreen gameData={gameData} />
            )}
            
            {notification && (
                <Notification 
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </div>
    );
};

export default App; 