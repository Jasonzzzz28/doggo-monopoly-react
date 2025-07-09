// Configuration
const INITIAL_MONEY = 0;
const MAX_STORES = 8;
const INITIAL_DRAW_PILE_COUNT = 8; // Configurable draw pile count
const INITIAL_DISCARD_PILE_COUNT = 0; // Configurable discard pile count

// Game state
let playerCoins = INITIAL_MONEY;
let storesPurchased = 0;
let purchasedStores = [];
let builtStores = [];
let currentDrawPileCount = INITIAL_DRAW_PILE_COUNT; // Current cards in draw pile
let currentDiscardPileCount = INITIAL_DISCARD_PILE_COUNT; // Current cards in discard pile

// Store purchase costs: 1st is free, then 2,3,4,7,8,9,10
const storePurchaseCosts = [0, 2, 3, 4, 7, 8, 9, 10];

let doggoCardsJson = null;
let storesJson = null;
let dishTypesJson = null;


const serverUrl = window.ENV.LOCAL_BACKEND_SERVER_URL;
// const serverUrl = window.ENV.PROD_BACKEND_SERVER_URL;

let socket = null;

// Panel control functions
function showJoinGamePanel() {
    document.getElementById('join-game-panel').classList.remove('hidden');
    document.getElementById('create-game-panel').classList.add('hidden');
}

function showCreateGamePanel() {
    document.getElementById('create-game-panel').classList.remove('hidden');
    document.getElementById('join-game-panel').classList.add('hidden');
}

function showWaitingRoom() {
    document.getElementById('waiting-room').classList.remove('hidden');
    document.getElementById('start-game-btn').classList.remove('hidden');
    document.getElementById('start-game-btn').addEventListener('click', startGame);
}

async function joinGame() {
    const playerName = document.getElementById('join-player-name-input').value;
    const gameId = document.getElementById('join-game-code-input').value;
    // localStorage.setItem('playerName', playerName);
    localStorage.setItem('gameId', gameId);
    if (await handleJoinGame(gameId, playerName)) {
        document.getElementById('game-code').textContent = gameId;
        generatePlayerSlot();
        showWaitingRoom();
    }
}

async function handleJoinGame(gameCode, playerName, avatar=null) {
    // POST to server to join game
    const response = await fetch(`${serverUrl}/api/game/${gameCode}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName: playerName, avatar: avatar }),
    })
    if (!response.ok) {
        showNotification('Failed to join game. Please try again.');
        return false;
    }
    
    const data = await response.json();
    localStorage.setItem('playerId', data.playerId);
    localStorage.setItem('playerSimpleId', data.playerSimpleId);
    localStorage.setItem('playerName', data.playerName);
    localStorage.setItem('playerCount', data.numberOfPlayers);
    connectToSocket();
    return true;
}

function connectToSocket() {
    socket = io(serverUrl);
    console.log('Socket', socket);
    
    socket.on('connect', () => {
        console.log('Connected to game server');
        const playerId = localStorage.getItem('playerId');
        const gameId = localStorage.getItem('gameId');
        console.log('Player ID', playerId);
        console.log('Game ID', gameId);
        
        if (playerId && gameId) {
            socket.emit('connect_to_game', {
                gameId: gameId,
                playerId: playerId
            });
        }
        else {
            console.error('Player ID or game ID not found');
        }
    });

    socket.on('waiting_room_update', (data) => {
        console.log('Waiting room update', data);
        const container = document.getElementById('player-slots-container');

        const dataObject = JSON.parse(data);
        const existingPlayerIds = [...container.querySelectorAll('div')].map(div => div.id).filter(id => id);
        console.log('Existing player IDs', existingPlayerIds);
        for (const [simpleId, summary] of Object.entries(dataObject)) {
            if (existingPlayerIds.includes(simpleId)) {
                continue;
            }
            const slot = document.createElement('div');
            slot.id = simpleId;
            slot.className = 'bg-gray-100 rounded-xl p-4 flex items-center';
            slot.innerHTML = `
                <div class="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                    <i class="fas fa-user text-green-400"></i>
                </div>
                <div>
                    <p class="font-bold text-gray-500">${summary.name}</p>
                </div>
            `;
            container.appendChild(slot);
        }
    });

    socket.on('game_update', (data) => {
        console.log('Game started', data);
        document.getElementById('waiting-room').classList.add('hidden');
        localStorage.setItem('game', JSON.stringify(data));
        showGameScreen(JSON.parse(data.game));
    });

    socket.onclose = () => {
        console.log('Disconnected from game server');
        // Attempt to reconnect after 1 second
        setTimeout(connectToSocket, 1000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return socket;
}

async function createGame() {
    console.log(doggoCardsJson);
    // Get the selected number of players
    const playerCount = parseInt(document.getElementById('player-count-select').value);
    const playerName = document.getElementById('player-name-input').value;
    // localStorage.setItem('playerName', playerName);
    localStorage.setItem('playerCount', playerCount);
    
    // POST to server to create game
    const response = await fetch(`${serverUrl}/api/create-game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numberOfPlayers: playerCount }),
    })
    if (!response.ok) {
        showNotification('Failed to create game. Please try again.');
        return;
    }
    
    const data = await response.json();
    document.getElementById('game-code').textContent = data.gameId;
    localStorage.setItem('gameId', data.gameId);

    await handleJoinGame(data.gameId, playerName);

    generatePlayerSlot();
    showWaitingRoom();
}

function generatePlayerSlot() {
    const container = document.getElementById('player-slots-container');
    container.innerHTML = '';
    
    // Always show the current player
    const mainSlot = document.createElement('div');
    mainSlot.id = localStorage.getItem('playerSimpleId');
    mainSlot.className = 'bg-amber-50 rounded-xl p-4 flex items-center';
    mainSlot.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-white mr-4 overflow-hidden">
            <img src="https://placedog.net/100/100?random=10" alt="Player" class="w-full h-full object-cover">
        </div>
        <div>
            <p class="font-bold">You</p>
            <p class="text-sm text-amber-600">Ready</p>
        </div>
    `;
    container.appendChild(mainSlot);
}

function startGame() {
    console.log("start game button clicked")
    const gameId = localStorage.getItem('gameId');
    const playerId = localStorage.getItem('playerId');
    console.log("startGame gameId", gameId);
    console.log("startGame playerId", playerId);
    socket.emit('start_game', { gameId: gameId, playerId: playerId });
}

// Simple function to switch from landing page to game screen
function showGameScreen(gameData) {
    document.getElementById('landing-page').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('game-screen').classList.remove('hidden');
    const playerSimpleId = localStorage.getItem('playerSimpleId');
    
    // Generate game players based on selected count
    generateGamePlayers(gameData);
    
    const player = gameData.players[playerSimpleId];
    // Initialize coin display
    updatePlayerCoins(player.money);
    
    // Initialize draw pile count
    updateDrawPileCount(player.dishCardsDrawPileLength);
    
    // Initialize discard pile count
    updateDiscardPileCount(player.dishCardsDiscardPileLength);
    
    // After transition completes, remove landing page from DOM
    // setTimeout(() => {
    //     document.getElementById('landing-page').remove();
    // }, 500);
    const doggoIds = gameData.npcDoggos.visible;
    const bonusCoins = gameData.npcDoggos.extraMoney;
    updateDoggoCards(doggoIds, bonusCoins);

    const storeIds = gameData.storeMarket.visible.map(store => store.type);
    updateStoreCards(storeIds);
}

// Store purchasing functions
function showPurchaseModal(storeName, buildCost, iconClass, colorClass) {
    // Check if player has reached the maximum number of stores (8)
    if (purchasedStores.length + builtStores.length >= MAX_STORES) {
        showNotification('You have reached the maximum of 8 stores!');
        return;
    }
    
    const purchaseCost = storePurchaseCosts[storesPurchased];
    const storeNumber = storesPurchased + 1;
    
    // Update modal content
    document.getElementById('purchase-store-info').innerHTML = `
        <div class="flex items-center justify-center mb-2">
            <div class="w-12 h-12 rounded-full bg-${colorClass}-100 flex items-center justify-center mr-3">
                <i class="${iconClass} text-${colorClass}-500 text-xl"></i>
            </div>
            <div class="text-left">
                <p class="font-bold text-amber-800">${storeName}</p>
                <p class="text-sm text-amber-600">Build cost: ${buildCost} coins</p>
            </div>
        </div>
    `;
    
    document.getElementById('purchase-cost').textContent = purchaseCost;
    document.getElementById('store-number').textContent = getOrdinal(storeNumber);
    
    // Store modal data
    document.getElementById('purchase-modal').setAttribute('data-store-name', storeName);
    document.getElementById('purchase-modal').setAttribute('data-build-cost', buildCost);
    document.getElementById('purchase-modal').setAttribute('data-icon-class', iconClass);
    document.getElementById('purchase-modal').setAttribute('data-color-class', colorClass);
    
    // Show modal
    document.getElementById('purchase-modal').classList.remove('hidden');
}

function closePurchaseModal() {
    document.getElementById('purchase-modal').classList.add('hidden');
}

function confirmPurchase() {
    const storeName = document.getElementById('purchase-modal').getAttribute('data-store-name');
    const buildCost = parseInt(document.getElementById('purchase-modal').getAttribute('data-build-cost'));
    const iconClass = document.getElementById('purchase-modal').getAttribute('data-icon-class');
    const colorClass = document.getElementById('purchase-modal').getAttribute('data-color-class');
    const purchaseCost = storePurchaseCosts[storesPurchased];
    
    // Check if player has reached the maximum number of stores (8)
    if (purchasedStores.length + builtStores.length >= MAX_STORES) {
        showNotification('You have reached the maximum of 8 stores!');
        closePurchaseModal();
        return;
    }
    
    // Check if player has enough coins
    if (playerCoins < purchaseCost) {
        alert('Not enough coins to purchase this store!');
        return;
    }
    
    // Deduct coins
    playerCoins -= purchaseCost;
    updatePlayerCoins();
    
    // Add to purchased stores
    const storeData = {
        name: storeName,
        buildCost: buildCost,
        iconClass: iconClass,
        colorClass: colorClass,
        id: Date.now() // Unique ID for the store
    };
    
    purchasedStores.push(storeData);
    storesPurchased++;
    
    // Update UI
    updatePlayerStores();
    
    // Close modal
    closePurchaseModal();
    
    // Show success message
    showNotification(`Successfully purchased ${storeName}!`);
}

// Store building functions
function showBuildModal(storeData) {
    // Update modal content
    document.getElementById('build-store-info').innerHTML = `
        <div class="flex items-center justify-center mb-2">
            <div class="w-12 h-12 rounded-full bg-${storeData.colorClass}-100 flex items-center justify-center mr-3">
                <i class="${storeData.iconClass} text-${storeData.colorClass}-500 text-xl"></i>
            </div>
            <div class="text-left">
                <p class="font-bold text-amber-800">${storeData.name}</p>
                <p class="text-sm text-amber-600">Ready to build!</p>
            </div>
        </div>
    `;
    
    document.getElementById('build-cost').textContent = storeData.buildCost;
    
    // Store modal data
    document.getElementById('build-modal').setAttribute('data-store-id', storeData.id);
    
    // Show modal
    document.getElementById('build-modal').classList.remove('hidden');
}

function closeBuildModal() {
    document.getElementById('build-modal').classList.add('hidden');
}

function confirmBuild() {
    const storeId = parseInt(document.getElementById('build-modal').getAttribute('data-store-id'));
    const storeData = purchasedStores.find(store => store.id === storeId);
    
    if (!storeData) return;
    
    // Check if player has enough coins
    if (playerCoins < storeData.buildCost) {
        alert('Not enough coins to build this store!');
        return;
    }
    
    // Deduct coins
    playerCoins -= storeData.buildCost;
    updatePlayerCoins();
    
    // Move from purchased to built
    purchasedStores = purchasedStores.filter(store => store.id !== storeId);
    builtStores.push(storeData);
    
    // Update UI
    updatePlayerStores();
    
    // Close modal
    closeBuildModal();
    
    // Show success message
    showNotification(`Successfully built ${storeData.name}!`);
}

// UI update functions
function updatePlayerCoins(playerMoney) {
    // Update header coin display
    const headerCoinElement = document.querySelector('header .fas.fa-coins + span');
    if (headerCoinElement) {
        headerCoinElement.textContent = playerMoney;
    }
    
    // Update player dashboard coin display
    const dashboardCoinElement = document.querySelector('.player-avatar + div .fas.fa-coins + span');
    if (dashboardCoinElement) {
        dashboardCoinElement.textContent = playerMoney + ' coins';
    }
    
    // // Update any other coin displays
    // const coinElements = document.querySelectorAll('.fas.fa-coins + span, .fas.fa-coins + .font-bold');
    // coinElements.forEach(el => {
    //     if (el.textContent.includes('coins')) {
    //         el.textContent = playerCoins;
    //     }
    // });
}

function updateDrawPileCount() {
    const drawPileElement = document.getElementById('draw-pile-count');
    if (drawPileElement) {
        drawPileElement.textContent = currentDrawPileCount;
    }
}

function updateDiscardPileCount() {
    const discardPileElement = document.getElementById('discard-pile-count');
    if (discardPileElement) {
        discardPileElement.textContent = currentDiscardPileCount;
    }
}

function updatePlayerStores() {
    const storesContainer = document.getElementById('player-stores');
    storesContainer.innerHTML = '';
    
    // Add purchased (unfinished) stores
    purchasedStores.forEach(store => {
        const storeElement = createStoreElement(store, false);
        storesContainer.appendChild(storeElement);
    });
    
    // Add built stores
    builtStores.forEach(store => {
        const storeElement = createStoreElement(store, true);
        storesContainer.appendChild(storeElement);
    });
    
    // Update store card availability
    updateStoreCardAvailability();
}

function updateStoreCardAvailability() {
    const totalStores = purchasedStores.length + builtStores.length;
    const storeCards = document.querySelectorAll('.card[onclick*="showPurchaseModal"]');
    
    storeCards.forEach(card => {
        if (totalStores >= MAX_STORES) {
            card.classList.add('opacity-50', 'cursor-not-allowed');
            card.style.pointerEvents = 'none';
        } else {
            card.classList.remove('opacity-50', 'cursor-not-allowed');
            card.style.pointerEvents = 'auto';
        }
    });
}

function createStoreElement(store, isBuilt) {
    const div = document.createElement('div');
    div.className = `card bg-white rounded-lg p-2 shadow-md w-20 h-28 flex-shrink-0 flex flex-col items-center cursor-pointer ${!isBuilt ? 'store-card-purchased' : ''}`;
    
    if (!isBuilt) {
        div.onclick = () => showBuildModal(store);
    }
    
    div.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-${store.colorClass}-100 mb-2 flex items-center justify-center">
            <i class="${store.iconClass} text-${store.colorClass}-500"></i>
        </div>
        <p class="text-xs font-bold text-center">${store.name}</p>
        <div class="mt-auto flex items-center">
            <i class="fas fa-coins text-yellow-500 text-xs mr-1"></i>
            <span class="text-xs font-bold">${store.buildCost}</span>
        </div>
    `;
    
    return div;
}

// Utility functions
function getOrdinal(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add some interactive elements
document.addEventListener('DOMContentLoaded', async function() {

    doggoCardsJson = await fetch('./game/doggo-cards.json').then(response => response.json());
    storesJson = await fetch('./game/store-types.json').then(response => response.json());
    dishTypesJson = await fetch('./game/dish-types.json').then(response => response.json());

    // Make cards clickable
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real game, this would trigger game logic
            console.log('Card clicked:', this.querySelector('p')?.textContent);
        });
    });
    
    // Add floating animation to some elements
    const floatingElements = document.querySelectorAll('.floating-dog, .player-avatar');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Start game button
    console.log("start game button set up")
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    
    // Add random paw prints
    for (let i = 0; i < 10; i++) {
        const paw = document.createElement('div');
        paw.className = 'paw-print text-amber-300 text-2xl';
        paw.innerHTML = '<i class="fas fa-paw"></i>';
        
        // Random position
        const left = Math.random() * 90 + 5;
        const top = Math.random() * 90 + 5;
        const rotation = Math.random() * 360;
        
        paw.style.left = `${left}%`;
        paw.style.top = `${top}%`;
        paw.style.transform = `rotate(${rotation}deg)`;
        paw.style.opacity = Math.random() * 0.2 + 0.05;
        
        document.body.appendChild(paw);
    }
});

function generateGamePlayers(gameData) {
    const container = document.getElementById('game-players-container');
    container.innerHTML = '';
    
    const playerCount = gameData.requiredPlayers;
    // We only show other players around the table (not the current player)
    const otherPlayersCount = playerCount - 1;
    
    // Define player positions and colors for different player counts
    const playerConfigs = {
        0: [], // Only current player, no others to show
        1: [
            { position: 'top', color: 'blue', random: 2 }
        ],
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
    const otherPlayers = playerOrder.slice(playerIndex + 1).concat(playerOrder.slice(0, playerIndex)).map(simpleId => gameData.players[simpleId].name);
    
    config.forEach((playerConfig, index) => {
        const playerElement = document.createElement('div');
        
        // Set position classes based on player position
        let positionClasses = '';
        switch (playerConfig.position) {
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
        
        playerElement.className = `${positionClasses} z-10 flex flex-col items-center`;
        playerElement.innerHTML = `
            <div class="player-avatar w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-4 border-${playerConfig.color}-300">
                <img src="https://placedog.net/100/100?random=${playerConfig.random}" alt="Player ${index + 2}" class="w-full h-full object-cover">
            </div>
            <div class="player-info-tooltip mt-2 bg-white p-2 rounded-lg shadow-lg text-center">
                <p class="font-bold">${otherPlayers[index]}</p>
                <div class="flex mt-1">
                    <i class="fas fa-store text-${playerConfig.color}-500 mx-1" title="Store"></i>
                    <i class="fas fa-bone text-amber-500 mx-1" title="Bone Bakery"></i>
                </div>
            </div>
        `;
        
        container.appendChild(playerElement);
    });
} 

function updateDoggoCards(newDoggoIds, bonusCoins) {
    const existingDoggoCards = document.querySelectorAll('.doggo-card');
    existingDoggoCards.forEach((existingDoggoCard, index) => {
        const newDoggoId = newDoggoIds[index];
        if (existingDoggoCard.id !== newDoggoId) {
            existingDoggoCard.id = newDoggoId;
            existingDoggoCard.querySelector('.image').querySelector('img').src = `https://placedog.net/100/100?random=${index + 1}`;
            existingDoggoCard.querySelector('.name').textContent = doggoCardsJson[newDoggoId].name;
            existingDoggoCard.querySelector('.stores-visited').innerHTML = doggoCardsJson[newDoggoId].stores_visited.map(storeId => {
                return `<i class="${storesJson[storeId].icon} text-xs mr-1" style="color: ${storesJson[storeId].color}"></i>`;
            }).join('');
            existingDoggoCard.querySelector('.dishes-eaten').textContent = doggoCardsJson[newDoggoId].dishes_eaten;
        }
        existingDoggoCard.querySelector('.bonus-coins').textContent = bonusCoins[index];
    });
}

function updateStoreCards(newStoreIds) {
    const existingStoreCards = document.querySelectorAll('.store-card');
    existingStoreCards.forEach((existingStoreCard, index) => {
        const newStoreId = newStoreIds[index];
        if (existingStoreCard.id !== newStoreId) {
            existingStoreCard.id = newStoreId;
            existingStoreCard.querySelector('.name').textContent = storesJson[newStoreId].name;
            existingStoreCard.querySelector('.store-icon').innerHTML = `<i class="${storesJson[newStoreId].icon} text-[${storesJson[newStoreId].color}] text-xl}"></i>`;
            if (storesJson[newStoreId].special_effect_icon) {
                existingStoreCard.querySelector('.special-effect').innerHTML = storesJson[newStoreId].special_effect_icon.map((icon, index) => {
                    return `<i class="${icon} text-xs mr-1 text-[${storesJson[newStoreId].special_effect_icon_color[index]}]"></i>`;
                }).join('');
                existingStoreCard.querySelector('.special-effect').innerHTML += storesJson[newStoreId].special_effect_text;
            }
            existingStoreCard.querySelector('.build-cost').textContent = storesJson[newStoreId].build_cost;
            existingStoreCard.querySelector('.income').textContent = storesJson[newStoreId].income_per_doggo;
        }
    });
}