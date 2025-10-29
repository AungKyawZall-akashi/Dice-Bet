document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const diceTotal = document.getElementById('diceTotal');
    const result = document.getElementById('result');
    const winAmount = document.getElementById('winAmount');
    
    // Game buttons
    const btnUnder7 = document.getElementById('under7');
    const btnEqual7 = document.getElementById('equal7');
    const btnOver7 = document.getElementById('over7');
    
    // Balance and betting elements
    const balanceDisplay = document.getElementById('balance');
    const betAmountDisplay = document.getElementById('betAmount');
    const amountInput = document.getElementById('amountInput');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const amountBtns = document.querySelectorAll('.amount-btn');
    
    // Game state variables
    let balance = 0;
    let currentBet = 0;
    const UNDER_OVER_MULTIPLIER = 2.3;
    const EQUAL_MULTIPLIER = 5.8;
    const MIN_BET = 500;
    const MAX_BET = 10000;
    
    // Initialize dice
    updateDiceDisplay(1, dice1);
    updateDiceDisplay(1, dice2);
    
    // Add event listeners to game buttons
    btnUnder7.addEventListener('click', () => playGame('under'));
    btnEqual7.addEventListener('click', () => playGame('equal'));
    btnOver7.addEventListener('click', () => playGame('over'));
    
    // Add event listeners to deposit/withdraw buttons
    depositBtn.addEventListener('click', handleDeposit);
    withdrawBtn.addEventListener('click', handleWithdraw);
    
    // Add event listeners to amount buttons
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => handleAmountButton(btn.dataset.amount));
    });
    
    // Handle deposit
    function handleDeposit() {
        const amount = parseInt(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        balance += amount;
        updateBalanceDisplay();
        amountInput.value = '';
    }
    
    // Handle withdraw
    function handleWithdraw() {
        const amount = parseInt(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (amount > balance) {
            alert('Insufficient balance');
            return;
        }
        
        balance -= amount;
        updateBalanceDisplay();
        amountInput.value = '';
    }
    
    // Handle amount button clicks
    function handleAmountButton(amount) {
        if (amount === 'min') {
            currentBet = MIN_BET;
        } else if (amount === 'max') {
            currentBet = balance;
        } else {
            const numAmount = parseInt(amount);
            if (numAmount > balance) {
                alert('Insufficient balance');
                return;
            }
            currentBet = numAmount;
        }
        
        updateBetDisplay();
    }
    
    // Update balance display
    function updateBalanceDisplay() {
        balanceDisplay.textContent = balance;
    }
    
    // Update bet display
    function updateBetDisplay() {
        betAmountDisplay.textContent = currentBet;
    }
    
    // Play game
    function playGame(choice) {
        // Check if bet is valid
        if (currentBet <= 0) {
            alert('Please set a bet amount');
            return;
        }
        
        if (currentBet > balance) {
            alert('Insufficient balance');
            return;
        }
        
        // Deduct bet from balance
        balance -= currentBet;
        updateBalanceDisplay();
        
        // Disable buttons during roll
        setButtonsEnabled(false);
        
        // Clear previous result
        result.textContent = '';
        result.className = '';
        winAmount.textContent = '';
        winAmount.classList.add('hidden');
        
        // Roll animation
        dice1.classList.add('rolling');
        dice2.classList.add('rolling');
        
        setTimeout(() => {
            // Generate random dice values
            const value1 = rollDice();
            const value2 = rollDice();
            const total = value1 + value2;
            
            // Update dice display
            updateDiceDisplay(value1, dice1);
            updateDiceDisplay(value2, dice2);
            
            // Remove rolling animation
            dice1.classList.remove('rolling');
            dice2.classList.remove('rolling');
            
            // Update total
            diceTotal.textContent = total;
            
            // Check result
            let isWin = false;
            let winMultiplier = 0;
            
            if (choice === 'under' && total < 7) {
                isWin = true;
                winMultiplier = UNDER_OVER_MULTIPLIER;
            } else if (choice === 'equal' && total === 7) {
                isWin = true;
                winMultiplier = EQUAL_MULTIPLIER;
            } else if (choice === 'over' && total > 7) {
                isWin = true;
                winMultiplier = UNDER_OVER_MULTIPLIER;
            }
            
            // Display result
            if (isWin) {
                const winnings = Math.floor(currentBet * winMultiplier);
                balance += winnings;
                updateBalanceDisplay();
                
                result.textContent = 'You Win!';
                result.className = 'result-win';
                winAmount.textContent = `+${winnings} MMK`;
                winAmount.classList.remove('hidden');
            } else {
                result.textContent = 'You Lose!';
                result.className = 'result-lose';
            }
            
            // Re-enable buttons
            setButtonsEnabled(true);
        }, 600);
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function updateDiceDisplay(value, diceElement) {
        // Remove previous dice class
        diceElement.className = 'dice w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center';
        diceElement.classList.add(`dice-${value}`);
        
        // Clear previous dots
        const dotsContainer = diceElement.querySelector('.dots-container');
        dotsContainer.innerHTML = '';
        
        // Add new dots based on dice value
        for (let i = 0; i < value; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotsContainer.appendChild(dot);
        }
    }

    function setButtonsEnabled(enabled) {
        btnUnder7.disabled = !enabled;
        btnEqual7.disabled = !enabled;
        btnOver7.disabled = !enabled;
        depositBtn.disabled = !enabled;
        withdrawBtn.disabled = !enabled;
        
        const gameButtons = [btnUnder7, btnEqual7, btnOver7];
        
        gameButtons.forEach(btn => {
            btn.classList.toggle('opacity-50', !enabled);
            btn.classList.toggle('cursor-not-allowed', !enabled);
        });
    }
});