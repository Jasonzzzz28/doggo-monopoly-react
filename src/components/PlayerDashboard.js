import React from 'react';

const PlayerDashboard = ({ playerMoney, drawPileCount, discardPileCount }) => {
    return (
        <div className="mt-4 bg-white rounded-2xl shadow-xl p-4 max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
                <div className="player-avatar w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-4 border-amber-300 mr-4">
                    <img src="https://placedog.net/100/100?random=9" alt="You" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="font-bold text-xl">Your Empire</h2>
                    <div className="flex items-center mt-1">
                        <i className="fas fa-coins text-yellow-500 mr-1"></i>
                        <span className="font-bold mr-4">{playerMoney} coins</span>
                        <span className="turn-indicator bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Your Turn</span>
                    </div>
                </div>
            </div>
            
            {/* Built Stores */}
            <div className="mb-6">
                <h3 className="font-bold mb-2 flex items-center">
                    <i className="fas fa-store mr-2 text-amber-600"></i>
                    Your Stores
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Stores will be added here dynamically */}
                </div>
            </div>
            
            {/* Dish Cards */}
            <div className="mb-6">
                <h3 className="font-bold mb-2 flex items-center">
                    <i className="fas fa-utensils mr-2 text-amber-600"></i>
                    Your Dish Cards
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {/* Draw and Discard Piles */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="bg-gray-100 rounded-lg p-2 shadow-inner w-20 h-28 flex flex-col items-center justify-center">
                            <i className="fas fa-layer-group text-gray-500 text-2xl"></i>
                            <p className="text-xs mt-1">Draw ({drawPileCount})</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-2 shadow-md w-20 h-28 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 mb-1 flex items-center justify-center">
                                <i className="fas fa-hamburger text-red-500"></i>
                            </div>
                            <p className="text-xs">Discard ({discardPileCount})</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="action-btn bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center">
                    <i className="fas fa-store mr-2"></i>
                    Take Store Card
                </button>
                
                <button className="action-btn bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center">
                    <i className="fas fa-hammer mr-2"></i>
                    Build Store
                </button>
                
                <button className="action-btn bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center">
                    <i className="fas fa-dog mr-2"></i>
                    Host Doggo
                </button>
                
                <button className="action-btn bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center">
                    <i className="fas fa-flag-checkered mr-2"></i>
                    End Turn
                </button>
            </div>
        </div>
    );
};

export default PlayerDashboard; 