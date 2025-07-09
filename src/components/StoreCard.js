import React from 'react';

const StoreCard = ({ storeId, storeData, index }) => {
    if (!storeData) return null;

    return (
        <div className="store-card card bg-white rounded-xl p-3 shadow-md w-24 h-32 flex flex-col items-center cursor-pointer">
            <div className="store-icon w-12 h-12 rounded-full bg-gray-100 mb-2 flex items-center justify-center">
                <i 
                    className={`${storeData.icon} text-xl`} 
                    style={{ color: storeData.color }}
                ></i>
            </div>
            <p className="name text-xs font-bold text-center">{storeData.name}</p>
            <p className="special-effect text-xs text-center mt-1">
                {storeData.special_effect_icon && storeData.special_effect_icon.map((icon, iconIndex) => (
                    <i 
                        key={iconIndex}
                        className={`${icon} text-xs mr-1`} 
                        style={{ color: storeData.special_effect_icon_color[iconIndex] }}
                    ></i>
                ))}
                {storeData.special_effect_text && storeData.special_effect_text}
            </p>
            <div className="mt-auto flex items-center">
                <i className="fas fa-hammer text-blue-500 text-xs mr-1"></i>
                <span className="build-cost text-xs font-bold">{storeData.build_cost}</span>
                <span className="text-xs font-bold"> </span>
                <i className="fas fa-coins text-yellow-500 text-xs mr-1"></i>
                <span className="income text-xs font-bold">{storeData.income_per_doggo}</span>
            </div>
        </div>
    );
};

export default StoreCard; 