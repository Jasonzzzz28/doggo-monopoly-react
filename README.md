# 🐕 Doggo Monopoly

A delightful online multiplayer board game where players host adorable doggos and build a thriving pet business empire!

## 🎮 Game Overview

**Doggo Monopoly** is a React-based online multiplayer board game that puts a fun, canine twist on the classic monopoly experience. Players take on the role of pet business owners, building various pet-related establishments to earn coins and dominate the market.
<img width="1280" height="683" style="width: 90%; height: auto" alt="Screenshot 2025-07-10 at 11 43 40 AM" src="https://github.com/user-attachments/assets/dc22f70c-03f6-4db8-b393-c2ba52baac1a" />
<img width="1280" height="683" style="width: 90%; height: auto" alt="Screenshot 2025-07-10 at 11 43 22 AM" src="https://github.com/user-attachments/assets/6d1898ab-4071-4ca7-88bb-08a110573873" />
<img width="1280" height="683" style="width: 90%; height: auto" alt="Screenshot 2025-07-10 at 1 05 26 PM" src="https://github.com/user-attachments/assets/55aba4d9-cd06-4ee7-9747-6669e32968c4" />

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doggo-monopoly-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## 🎯 How to Play

1. **Join or Create a Game**: Enter a game code or create a new game
2. **Host Doggos**: Host doggos to earn coins
3. **Build Stores**: Purchase and build stores to generate income
4. **Win**: Become the wealthiest pet business owner!

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Real-time Communication**: Socket.IO Client
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── DoggoCard.js    # Individual doggo display
│   ├── GameScreen.js   # Main game interface
│   ├── LandingPage.js  # Welcome screen
│   ├── PlayerDashboard.js # Player stats
│   ├── StoreCard.js    # Store display
│   └── WaitingRoom.js  # Pre-game lobby
├── hooks/              # Custom React hooks
│   ├── useGameData.js  # Game state management
│   └── useSocket.js    # WebSocket connection
├── services/           # API and game services
│   └── gameService.js  # Game logic and API calls
└── config.js          # Configuration settings

public/game/           # Game assets and data
├── doggo-cards.json   # Doggo definitions
├── store-types.json   # Store definitions
└── dish-types.json    # Food definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready to build your pet empire? Start playing Doggo Monopoly today! 🐕✨** 
