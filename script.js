class Game {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.basket = document.getElementById('basket');
        this.scoreDisplay = document.getElementById('score');
        this.livesDisplay = document.getElementById('lives');
        this.timerDisplay = document.getElementById('timer');
        this.gameOverScreen = document.getElementById('gameOver');
        this.finalScore = document.getElementById('finalScore');
        this.finalTime = document.getElementById('finalTime');
        
        this.score = 0;
        this.lives = 3;
        this.time = 0;
        this.gameActive = true;
        this.basketX = this.gameBoard.offsetWidth / 2;
        this.basketY = this.gameBoard.offsetHeight - 50;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startGame();
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            const rect = this.gameBoard.getBoundingClientRect();
            this.basketX = e.clientX - rect.left - 30;
            
            if (this.basketX < 0) this.basketX = 0;
            if (this.basketX > this.gameBoard.offsetWidth - 60) {
                this.basketX = this.gameBoard.offsetWidth - 60;
            }
            
            this.basket.style.left = this.basketX + 'px';
        });
        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = this.gameBoard.getBoundingClientRect();
            this.basketX = touch.clientX - rect.left - 30;
            
            if (this.basketX < 0) this.basketX = 0;
            if (this.basketX > this.gameBoard.offsetWidth - 60) {
                this.basketX = this.gameBoard.offsetWidth - 60;
            }
            
            this.basket.style.left = this.basketX + 'px';
            e.preventDefault();
        });
    }
    
    startGame() {
        // Spawn objects
        setInterval(() => this.spawnObject(), 600);
        
        // Update timer
        setInterval(() => {
            if (this.gameActive) {
                this.time++;
                this.timerDisplay.textContent = this.time;
            }
        }, 1000);
    }
    
    spawnObject() {
        if (!this.gameActive) return;
        
        const rand = Math.random();
        let emoji, className;
        
        if (rand < 0.7) {
            emoji = '⭐';
            className = 'star';
        } else if (rand < 0.9) {
            emoji = '💣';
            className = 'bomb';
        } else {
            emoji = '❤️';
            className = 'heart';
        }
        
        const obj = document.createElement('div');
        obj.textContent = emoji;
        obj.className = className;
        
        const x = Math.random() * (this.gameBoard.offsetWidth - 40);
        obj.style.left = x + 'px';
        obj.style.top = '-50px';
        
        const duration = 4 + Math.random() * 2;
        obj.style.animationDuration = duration + 's';
        
        this.gameBoard.appendChild(obj);
        
        // Check collision
        this.checkCollision(obj, emoji, duration * 1000);
    }
    
    checkCollision(obj, emoji, duration) {
        const checkInterval = setInterval(() => {
            if (!document.body.contains(obj)) {
                clearInterval(checkInterval);
                return;
            }
            
            const objRect = obj.getBoundingClientRect();
            const basketRect = this.basket.getBoundingClientRect();
            const gameBoardRect = this.gameBoard.getBoundingClientRect();
            
            // Check if object is caught
            if (
                objRect.bottom >= basketRect.top &&
                objRect.left < basketRect.right &&
                objRect.right > basketRect.left
            ) {
                if (emoji === '⭐') {
                    this.score += 10;
                    this.scoreDisplay.textContent = this.score;
                    this.showFloatingText('+10', objRect.left, objRect.top);
                } else if (emoji === '💣') {
                    this.lives--;
                    this.livesDisplay.textContent = this.lives;
                    this.showFloatingText('-1', objRect.left, objRect.top);
                    if (this.lives <= 0) {
                        this.endGame();
                    }
                } else if (emoji === '❤️') {
                    this.lives++;
                    this.livesDisplay.textContent = this.lives;
                    this.showFloatingText('+1', objRect.left, objRect.top);
                }
                
                obj.remove();
                clearInterval(checkInterval);
            }
            
            // Check if object fell off screen
            if (objRect.top > gameBoardRect.bottom) {
                obj.remove();
                clearInterval(checkInterval);
            }
        }, 50);
        
        // Remove object after duration if not caught
        setTimeout(() => {
            if (document.body.contains(obj)) {
                obj.remove();
            }
            clearInterval(checkInterval);
        }, duration);
    }
    
    showFloatingText(text, x, y) {
        const floating = document.createElement('div');
        floating.textContent = text;
        floating.style.position = 'absolute';
        floating.style.left = x + 'px';
        floating.style.top = y + 'px';
        floating.style.fontSize = '1.5em';
        floating.style.fontWeight = 'bold';
        floating.style.color = text.includes('+') ? '#00ff00' : '#ff0000';
        floating.style.pointerEvents = 'none';
        floating.style.zIndex = '100';
        
        this.gameBoard.appendChild(floating);
        
        // Animate floating text
        let opacity = 1;
        let posY = y;
        const floatInterval = setInterval(() => {
            opacity -= 0.05;
            posY -= 2;
            floating.style.opacity = opacity;
            floating.style.top = posY + 'px';
            
            if (opacity <= 0) {
                floating.remove();
                clearInterval(floatInterval);
            }
        }, 30);
    }
    
    endGame() {
        this.gameActive = false;
        this.finalScore.textContent = this.score;
        this.finalTime.textContent = this.time;
        
        setTimeout(() => {
            this.gameOverScreen.classList.add('show');
        }, 300);
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
});
