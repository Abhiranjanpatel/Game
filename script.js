
    const board = document.getElementById("board");
    const statusText = document.getElementById("status");
    const gameModeSelect = document.getElementById("gameMode");
    let cells = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameOver = false;

    function createBoard() {
      board.innerHTML = "";
      cells.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.textContent = cell;
        if (cell !== "") cellDiv.classList.add("taken");
        cellDiv.addEventListener("click", handleMove);
        board.appendChild(cellDiv);
      });
    }

    function handleMove(e) {
      const index = e.target.dataset.index;
      if (cells[index] !== "" || isGameOver) return;

      cells[index] = currentPlayer;
      checkGame();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      createBoard();

      if (!isGameOver && gameModeSelect.value === "single" && currentPlayer === "O") {
        setTimeout(aiMove, 400);
      }
    }

    function aiMove() {
      const available = cells.map((c, i) => (c === "" ? i : null)).filter(i => i !== null);
      if (available.length === 0 || isGameOver) return;
      const aiIndex = available[Math.floor(Math.random() * available.length)];
      cells[aiIndex] = "O";
      checkGame();
      currentPlayer = "X";
      createBoard();
    }

    function checkGame() {
      const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];

      for (let pattern of winPatterns) {
        const [a,b,c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
          statusText.textContent = `🏆 ${cells[a]} wins!`;
          isGameOver = true;
          setTimeout(() => {
            document.querySelectorAll(".cell").forEach((el, idx) => {
              if (pattern.includes(idx)) el.classList.add("win");
              el.classList.add("taken");
            });
          }, 100);
          return;
        }
      }

      if (!cells.includes("")) {
        statusText.textContent = "🤝 It's a draw!";
        isGameOver = true;
      } else {
        statusText.textContent = `⏳ Current turn: ${currentPlayer}`;
      }
    }

    function restartGame() {
      cells = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "X";
      isGameOver = false;
      statusText.textContent = `⏳ Current turn: ${currentPlayer}`;
      createBoard();
    }

    function toggleTheme() {
      document.body.classList.toggle("dark");
    }

    gameModeSelect.addEventListener("change", restartGame);

    createBoard();
    statusText.textContent = `⏳ Current turn: ${currentPlayer}`;
