import React from 'react';

const DoggoCard = ({ doggoId, doggoData, stores, bonusCoins, index }) => {
    if (!doggoData) return null;

    return (
        <div className="doggo-card card bg-white rounded-xl p-3 shadow-md w-24 h-32 flex flex-col items-center">
            <div className="image w-12 h-12 rounded-full bg-gray-200 mb-2 overflow-hidden">
                <img 
                    src={`https://placedog.net/100/100?random=${index + 5}`} 
                    alt="Doggo" 
                    className="w-full h-full object-cover"
                />
            </div>
            <p className="name text-xs font-bold text-center">{doggoData.name}</p>
            <p className="stores-visited text-xs text-center mt-1">
                {doggoData.stores_visited.map(storeId => {
                    const store = stores[storeId];
                    if (!store) return null;
                    return (
                        <i 
                            key={storeId}
                            className={`${store.icon} text-xs mr-1`} 
                            style={{ color: store.color }}
                        ></i>
                    );
                })}
            </p>
            <div className="mt-auto flex items-center">
                <i className="fas fa-utensils text-amber-500 text-xs mr-1"></i>
                <span className="dishes-eaten text-xs font-bold">{doggoData.dishes_eaten}</span>
                <i className="fas fa-coins text-yellow-500 text-xs mr-1 ml-2"></i>
                <span className="bonus-coins text-xs font-bold">{bonusCoins}</span>
            </div>
        </div>
    );
};

export default DoggoCard; 