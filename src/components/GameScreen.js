import React, { useEffect, useState } from 'react';
import { INITIAL_MONEY } from '../config';
import { useGameData } from '../hooks/useGameData';
import DoggoCard from './DoggoCard';
import StoreCard from './StoreCard';
import PlayerDashboard from './PlayerDashboard';

const GameScreen = ({ gameData }) => {
    const { doggoCards, stores, loading } = useGameData();
    const [playerMoney, setPlayerMoney] = useState(INITIAL_MONEY);
    const [drawPileCount, setDrawPileCount] = useState(8);
    const [discardPileCount, setDiscardPileCount] = useState(0);

    useEffect(() => {
        if (gameData) {
            const playerSimpleId = localStorage.getItem('playerSimpleId');
            const player = gameData.players[playerSimpleId];
            
            if (player) {
                setPlayerMoney(player.money);
                setDrawPileCount(player.dishCardsDrawPileLength);
                setDiscardPileCount(player.dishCardsDiscardPileLength);
            }
        }
    }, [gameData]);

    const generateGamePlayers = () => {
        if (!gameData) return [];

        const playerCount = gameData.requiredPlayers;
        const otherPlayersCount = playerCount - 1;
        
        const playerConfigs = {
            0: [],
            1: [{ position: 'top', color: 'blue', random: 2 }],
            2: [
                { position: 'right', color: 'blue', random: 2 },
                { position: 'top', color: 'red', random: 3 }
            ],
            3: [
                { position: 'right', color: 'blue', random: 2 },
                { position: 'top', color: 'red', random: 3 },
                { position: 'left', color: 'green', random: 4 }
            ]
        };
        
        const config = playerConfigs[otherPlayersCount];
        const playerOrder = gameData.playerOrder;
        const playerSimpleId = localStorage.getItem('playerSimpleId');
        const playerIndex = playerOrder.indexOf(playerSimpleId);
        const otherPlayers = playerOrder
            .slice(playerIndex + 1)
            .concat(playerOrder.slice(0, playerIndex))
            .map(simpleId => gameData.players[simpleId].name);
        
        return config.map((playerConfig, index) => ({
            ...playerConfig,
            name: otherPlayers[index]
        }));
    };

    if (loading || !gameData) {
        return <div>Loading...</div>;
    }

    const otherPlayers = generateGamePlayers();
    const doggoIds = gameData.npcDoggos.visible;
    const bonusCoins = gameData.npcDoggos.extraMoney;
    const storeIds = gameData.storeMarket.visible.map(store => store.type);

    return (
        <div className="min-h-screen p-4">
            {/* Game Header */}
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <i className="fas fa-paw text-amber-600 text-3xl mr-2"></i>
                    <h1 className="text-2xl font-bold text-amber-800">Doggo Monopoly</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center">
                        <i className="fas fa-coins text-yellow-500 mr-2"></i>
                        <span className="font-bold">{playerMoney}</span>
                    </div>
                    
                    <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-full font-bold flex items-center">
                        <i className="fas fa-cog mr-2"></i>
                        <span>Settings</span>
                    </button>
                </div>
            </header>
            
            {/* Main Game Area */}
            <main className="relative mb-4 mt-20">
                {/* Players around the table */}
                <div className="relative">
                    <div className="relative">
                        {otherPlayers.map((player, index) => {
                            let positionClasses = '';
                            switch (player.position) {
                                case 'top':
                                    positionClasses = 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
                                    break;
                                case 'right':
                                    positionClasses = 'absolute right-[5%] top-1/2 transform translate-y-1/2';
                                    break;
                                case 'left':
                                    positionClasses = 'absolute left-[5%] top-1/2 transform -translate-y-1/2';
                                    break;
                                case 'bottom':
                                    positionClasses = 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2';
                                    break;
                            }
                            
                            return (
                                <div key={index} className={`${positionClasses} z-10 flex flex-col items-center`}>
                                    <div className={`player-avatar w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-4 border-${player.color}-300`}>
                                        <img 
                                            src={`https://placedog.net/100/100?random=${player.random}`} 
                                            alt={`Player ${index + 2}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="player-info-tooltip mt-2 bg-white p-2 rounded-lg shadow-lg text-center">
                                        <p className="font-bold">{player.name}</p>
                                        <div className="flex mt-1">
                                            <i className={`fas fa-store text-${player.color}-500 mx-1`} title="Store"></i>
                                            <i className="fas fa-bone text-amber-500 mx-1" title="Bone Bakery"></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Main Table */}
                    <div className="doggo-table mx-auto rounded-[100px] w-full max-w-4xl h-[450px] flex flex-col items-center justify-center p-6 relative">
                        {/* NPC Doggo Cards */}
                        <div className="w-full max-w-xl mb-8">
                            <h2 className="text-center font-bold text-lg mb-2 text-amber-900">Visiting Doggos</h2>
                            <div className="flex justify-center space-x-4">
                                {/* Star indicator for first card */}
                                <div className="flex items-center mr-2">
                                    <i className="fas fa-star text-yellow-500 text-xl"></i>
                                    <span className="text-yellow-500 text-sm font-bold">START</span>
                                </div>
                                
                                {doggoIds.map((doggoId, index) => (
                                    <DoggoCard
                                        key={doggoId}
                                        doggoId={doggoId}
                                        doggoData={doggoCards[doggoId]}
                                        stores={stores}
                                        bonusCoins={bonusCoins[index]}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Store Card Market */}
                        <div className="w-full max-w-xl">
                            <h2 className="text-center font-bold text-lg mb-2 text-amber-900">Available Stores</h2>
                            <div className="flex justify-center space-x-4">
                                {storeIds.map((storeId, index) => (
                                    <StoreCard
                                        key={storeId}
                                        storeId={storeId}
                                        storeData={stores[storeId]}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Current Player Dashboard */}
                <PlayerDashboard 
                    playerMoney={playerMoney}
                    drawPileCount={drawPileCount}
                    discardPileCount={discardPileCount}
                />
            </main>
        </div>
    );
};

export default GameScreen; 