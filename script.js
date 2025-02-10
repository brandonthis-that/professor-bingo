class BingoGame {
    constructor() {
        this.playerName = '';
        this.phrases = new Set();
        this.isCardLocked = false;
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {  
        // Screens
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.gameScreen = document.getElementById('gameScreen');
        
        // Inputs and buttons
        this.playerNameInput = document.getElementById('playerName');
        this.startGameButton = document.getElementById('startGame');
        this.newPhraseInput = document.getElementById('newPhrase');
        this.addPhraseButton = document.getElementById('addPhrase');
        this.lockCardButton = document.getElementById('lockCard');
        this.callBingoButton = document.getElementById('callBingo');
        
        // Display elements
        this.currentPlayerSpan = document.getElementById('currentPlayer');
        this.bingoGrid = document.getElementById('bingoGrid');
        this.playersList = document.getElementById('playersList');
    }

    addEventListeners() {
        this.startGameButton.addEventListener('click', () => this.startGame());
        this.addPhraseButton.addEventListener('click', () => this.addPhrase());
        this.lockCardButton.addEventListener('click', () => this.lockCard());
        this.callBingoButton.addEventListener('click', () => this.callBingo());
        
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        
        this.newPhraseInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPhrase();
        });
    }

    startGame() {
        console.log("Start game function triggered.")
        const name = this.playerNameInput.value.trim();
        if (name) {
            this.playerName = name;
            this.welcomeScreen.classList.add('hidden');
            this.gameScreen.classList.remove('hidden');
            this.currentPlayerSpan.textContent = name;
            
            // Here you would typically send the player name to your backend
            this.sendToBackend('joinGame', { playerName: name });
        } else {
            console.log("No name entered")
        }
    }

    addPhrase() {
        if (this.isCardLocked) return;
        
        const phrase = this.newPhraseInput.value.trim();
        if (phrase && this.phrases.size < 25) {
            this.phrases.add(phrase);
            this.newPhraseInput.value = '';
            this.updateBingoGrid();
        }
    }

    updateBingoGrid() {
        this.bingoGrid.innerHTML = '';
        const phrasesArray = [...this.phrases];
        
        // Fill grid with existing phrases
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            if (i < phrasesArray.length) {
                cell.textContent = phrasesArray[i];
                cell.addEventListener('click', () => this.toggleCell(cell));
            }
            this.bingoGrid.appendChild(cell);
        }
    }

    toggleCell(cell) {
        if (!this.isCardLocked || !cell.textContent) return;
        cell.classList.toggle('marked');
        this.checkWin();
    }

    lockCard() {
        if (this.phrases.size !== 25) {
            alert('Please fill all 25 squares before locking your card!');
            return;
        }
        
        this.isCardLocked = true;
        this.lockCardButton.disabled = true;
        this.newPhraseInput.disabled = true;
        this.addPhraseButton.disabled = true;
        
        // Send the final card to the backend
        this.sendToBackend('lockCard', {
            playerName: this.playerName,
            phrases: [...this.phrases]
        });
    }

    checkWin() {
        // Check rows, columns, and diagonals
        const cells = Array.from(this.bingoGrid.children);
        const isMarked = (index) => cells[index].classList.contains('marked');
        
        // Simple row check example
        for (let i = 0; i < 25; i += 5) {
            if (isMarked(i) && isMarked(i+1) && isMarked(i+2) && isMarked(i+3) && isMarked(i+4)) {
                return true;
            }
        }
        
        return false;
    }

    callBingo() {
        if (this.checkWin()) {
            // Send win notification to backend
            this.sendToBackend('bingoCalled', {
                playerName: this.playerName
            });
            alert('BINGO! Waiting for verification...');
        }
    }

    // Placeholder for backend communication
    sendToBackend(action, data) {
        console.log(`Sending to backend: ${action}`, data);
        // Your friend will implement the actual backend communication here
    }

    // Method to receive updates from backend
    handleBackendUpdate(update) {
        switch(update.type) {
            case 'playerJoined':
                this.updatePlayersList(update.players);
                break;
            case 'bingoVerified':
                this.handleBingoVerification(update);
                break;
            // Add more cases as needed
        }
    }

    updatePlayersList(players) {
        this.playersList.innerHTML = '<h3>Players in Game</h3>';
        players.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.textContent = player.name;
            this.playersList.appendChild(playerItem);
        });
    }
}

// Initialize the game
const game = new BingoGame();