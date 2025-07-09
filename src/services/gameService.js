import { ENV } from '../config';

export const gameService = {
    async createGame(numberOfPlayers) {
        const response = await fetch(`${ENV.LOCAL_BACKEND_SERVER_URL}/api/create-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numberOfPlayers }),
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        return await response.json();
    },

    async joinGame(gameCode, playerName, avatar = null) {
        const response = await fetch(`${ENV.LOCAL_BACKEND_SERVER_URL}/api/game/${gameCode}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, avatar }),
        });

        if (!response.ok) {
            throw new Error('Failed to join game');
        }

        return await response.json();
    }
}; 