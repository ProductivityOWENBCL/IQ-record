document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const turnMessage = document.getElementById('turn-message');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty-select');

    let currentPlayer = 'X';
    let gameActive = true;
    let board = ['', '', '', '', '', '', '', '', ''];

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    // Difficulty levels configuration
    const difficultyLevels = {
        easy: () => makeRandomAIMove(),
        normal: () => makeMinMaxAIMove(3), // Depth 3 for normal difficulty
        hard: () => makeMinMaxAIMove(5) // Depth 5 for hard difficulty
    };

    // Default to normal difficulty
    let currentDifficulty = 'normal';

    const checkWin = (currentBoard, player) => {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
                return true;
            }
        }
        return false;
    };

    const checkDraw = () => {
        return board.every(cell => cell !== '');
    };

    const handleCellClick = (cell, index) => {
        if (!gameActive || board[index] !== '') return;

        // Player's move
        cell.textContent = currentPlayer;
        board[index] = currentPlayer;

        // Check for win
        if (checkWin(board, currentPlayer)) {
            turnMessage.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        // Check for draw
        if (checkDraw()) {
            turnMessage.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnMessage.textContent = `Player ${currentPlayer}'s Turn`;

        // AI's move based on selected difficulty level
        if (currentPlayer === 'O' && gameActive) {
            difficultyLevels[currentDifficulty]();
        }
    };

    const makeRandomAIMove = () => {
        // Simple AI: Randomly pick an empty cell
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMoveIndex = emptyCells[randomIndex];

        setTimeout(() => {
            cells[aiMoveIndex].textContent = 'O';
            board[aiMoveIndex] = 'O';

            // Check for win after AI move
            if (checkWin(board, 'O')) {
                turnMessage.textContent = 'AI wins!';
                gameActive = false;
                return;
            }

            // Check for draw after AI move
            if (checkDraw()) {
                turnMessage.textContent = "It's a draw!";
                gameActive = false;
                return;
            }

            // Switch back to player's turn
            currentPlayer = 'X';
            turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
        }, 1000); // Delay AI move for 1 second for better visualization
    };

    const makeMinMaxAIMove = (depth) => {
        // Minimax algorithm with alpha-beta pruning
        const minimax = (currentBoard, depth, isMaximizing, alpha, beta) => {
            // Base cases: terminal states (win/lose/draw) or reached depth
            if (checkWin(currentBoard, 'X')) {
                return -10 + depth; // Player X wins
            } else if (checkWin(currentBoard, 'O')) {
                return 10 - depth; // Player O wins
            } else if (checkDraw()) {
                return 0; // Draw
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < currentBoard.length; i++) {
                    if (currentBoard[i] === '') {
                        currentBoard[i] = 'O';
                        let score = minimax(currentBoard, depth - 1, false, alpha, beta);
                        currentBoard[i] = '';
                        bestScore = Math.max(bestScore, score);
                        alpha = Math.max(alpha, score);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < currentBoard.length; i++) {
                    if (currentBoard[i] === '') {
                        currentBoard[i] = 'X';
                        let score = minimax(currentBoard, depth - 1, true, alpha, beta);
                        currentBoard[i] = '';
                        bestScore = Math.min(bestScore, score);
                        beta = Math.min(beta, score);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                return bestScore;
            }
        };

        // AI's move using minimax algorithm
        let bestMove;
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth, false, -Infinity, Infinity);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        setTimeout(() => {
            cells[bestMove].textContent = 'O';
            board[bestMove] = 'O';

            // Check for win after AI move
            if (checkWin(board, 'O')) {
                turnMessage.textContent = 'AI wins!';
                gameActive = false;
                return;
            }

            // Check for draw after AI move
            if (checkDraw()) {
                turnMessage.textContent = "It's a draw!";
                gameActive = false;
                return;
            }

            // Switch back to player's turn
            currentPlayer = 'X';
            turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
        }, 1000); // Delay AI move for 1 second for better visualization
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
        cells.forEach(cell => cell.textContent = '');
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index));
    });

    resetBtn.addEventListener('click', resetGame);

    difficultySelect.addEventListener('change', () => {
        currentDifficulty = difficultySelect.value;
    });

    // Initial turn message
    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
});
