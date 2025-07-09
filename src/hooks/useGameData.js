import { useState, useEffect } from 'react';

export const useGameData = () => {
    const [doggoCards, setDoggoCards] = useState(null);
    const [stores, setStores] = useState(null);
    const [dishTypes, setDishTypes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const [doggoResponse, storesResponse, dishResponse] = await Promise.all([
                    fetch('./game/doggo-cards.json'),
                    fetch('./game/store-types.json'),
                    fetch('./game/dish-types.json')
                ]);

                const doggoData = await doggoResponse.json();
                const storesData = await storesResponse.json();
                const dishData = await dishResponse.json();

                setDoggoCards(doggoData);
                setStores(storesData);
                setDishTypes(dishData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading game data:', error);
                setLoading(false);
            }
        };

        loadGameData();
    }, []);

    return {
        doggoCards,
        stores,
        dishTypes,
        loading
    };
}; 