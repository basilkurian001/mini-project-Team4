<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GameHub - Free Browser Games</title>
  <link rel="stylesheet" href="./frontend/home_page_style.css" />
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">Game<span>hub</span></div>
      <nav>
        <ul>
          <?php if (isset($_SESSION['email'])): ?>
          <p>Welcome, <?php echo $_SESSION['user_name']; ?>!</p>
          <li><a href="./backend/logout.php">Logout</a></li>
          <?php else: ?>
            <li><a class="login-signup-text" href="./frontend/login_page.html">Login</a></li>
            <li><a class="login-signup-text" href="./frontend/signup_page.html">Sign Up</a></li>
          <?php endif; ?>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">

    <!-- Action Games -->
    <section class="category-section">
      <h2 class="category-title">🔥 Action Games</h2>
      <div class="game-grid">
        <div class="game-card"><a href="#" data-game="Prince Of Persia"><img src="./assets/game_thumbnails/Prince_of_Persia_thumbnail.png" alt="Action 1"><p>Prince Of Persia</p></a></div>
        <div class="game-card"><a href="#" data-game="Flappy Bird"><img src="./assets/game_thumbnails/flappy_bird_thumbnail.jpg" alt="Action 2"><p>Flappy Bird</p></a></div>
        <div class="game-card"><a href="#" data-game="Street Fighter II"><img src="./assets/game_thumbnails/street-fighter-2_thumbnail.jpg" alt="Action 3"><p>Street Fighter II</p></a></div>
        <div class="game-card"><a href="#" data-game="Whack A Mole"><img src="./assets/game_thumbnails/whack_a_mole_thumbnail.png" alt="Action 4"><p>Whack a Mole</p></a> </div>     
      </div>
    </section>

    <!-- Puzzle Games -->
    <section class="category-section">
      <h2 class="category-title">🧩 Puzzle Games</h2>
      <div class="game-grid">
        <div class="game-card"><a href="#" data-game="2048"><img src="./assets/game_thumbnails/2048_thumbnail.png" alt="Puzzle 1"><p>2048</p></a></div>
        <div class="game-card"><a href="#" data-game="Tetris"><img src="./assets/game_thumbnails/tetris_thumbnail.png" alt="Puzzle 2"><p>Tetris</p></a></div>
        <div class="game-card"><a href="#" data-game="Guess The Word"> <img src="./assets/game_thumbnails/guess-word-thumbnail.png" alt="Puzzle 3"><p>Guess The Word</p></a></div>
      </div>
    </section>

    

    <!-- Strategy Games -->
    <section class="category-section">
      <h2 class="category-title">🧠 Strategy Games</h2>
      <div class="game-grid">
        <div class="game-card"><a href="#" data-game="Tic Tac Toe"><img src="./assets/game_thumbnails/tic_tac_toe_thumbnail.png" alt="Strategy 1"><p>Tic Tac Toe</p></a></div>
        <div class="game-card"><a href="#" data-game="Pac Man"><img src="./assets/game_thumbnails/pacman_thumbnail.png" alt="Strategy 2"><p>Pac-Man</p></a></div>
        <div class="game-card"><a href="#" data-game="Chess"><img src="./assets/game_thumbnails/chess_thumbnail.jpg" alt="Strategy 3"><p>Chess</p></a></div>
      </div>
    </section>

    <!-- Shooting Games -->
     <section class="category-section">
      <h2 class="category-title">🔫 Shooting Games</h2>
      <div class="game-grid">
        <div class="game-card"><a href="#" data-game="Space Shooter"><img src="./assets/game_thumbnails/space_shooter_thumbnail.png" alt="Strategy 1"><p>Space Shooter</p></a></div>
        <div class="game-card"><a href="#" data-game="Duck Hunt"><img src="./assets/game_thumbnails/duck_hunt_thumbnail.png" alt="Strategy 2"><p>Duck Hunt</p></a></div>
        <div class="game-card"><a href="#" data-game="Deadshot"><img src="./assets/game_thumbnails/deadshot_thumbnail.avif" alt="Strategy 3"><p>Dead Shot</p></a></div>
      </div>
    </section>

  </main>

  <footer>
    <div class="container">
      <p class="footer-text">&copy; 2025 GameHub. All rights reserved.</p>
    </div>
  </footer>

  <!-- Game Preview Modal -->
<div id="gameModal" class="modal hidden">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-video">
      <iframe id="gamePreview" src="" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="modal-info">
      <h2 id="gameTitle"></h2>
      <p id="gameDescription"></p>
      <p><strong>Controls:</strong> <span id="gameControls"></span></p>
      <a id="playGameBtn" class="play-button" href="#" target="_blank">Play Now</a>
    </div>
  </div>
</div>

<script>
  const gameData = {
    "Prince Of Persia": {
      src: "./games/PrinceJS-master/index.html",
      description: "A classic platformer where you rescue the princess.",
      controls: "Arrow keys: movement,\nSpace: Jump,\nSHIFT: Drink Potion, Grab Edge, Sword Strike\nSPACE : Show Remaining Time\nENTER : Continue Game"
    },
    "Flappy Bird": {
      src: "./games/flappy-bird-master/index.html",
      description: "Guide the bird through pipes.",
      controls: "Click or Spacebar to flap"
    },
    "Street Fighter II": {
      src: "./games/street-fighter-2-javascript-main/index.html",
      description: "Step into the ring with the legendary Street Fighter II! Choose your fighter and battle opponents from around the world in this iconic arcade classic. Master special moves, combos, and become the ultimate champion!",
      controls: "Q: Left player Kick\nE: Left player round kick\nZ: Left player movement left\nC: Left player movement right\nX: Left player crouch"
    },
    "Whack A Mole": {
      src: "./games/JavaScript-Whack-A-Mole-master/index.html",
      description: "Test your reflexes in this fast-paced game! Whack the moles as they pop up before they disappear.",
      controls: "Mouse left click to hit the mole."
    },
    "2048": {
      src: "./games/2048-master/index.html",
      description: "Combine matching number tiles to reach 2048. A fun and addictive puzzle game that challenges your strategy skills.",
      controls: "Move the tiles using arrow keys"
    },
    "Tetris": {
      src: "./games/javascript-tetris-master/index.html",
      description: "Arrange falling blocks to complete and clear lines. A timeless puzzle game that tests your speed and strategy.",
      controls: "Left and Right arrow keys: Move the block left and right\nUp arrow key: Rotate the block\nDown arrow key: Make the block fall down faster"
    },
    "Guess The Word": {
      src: "./games/guess-the-word-main/index.html",
      description: "Test your vocabulary skills by guessing the hidden word one letter at a time. Can you figure it out before you run out of chances?",
      controls: "Type each letter of the word using the Keyboard"
    },
    "Tic Tac Toe": {
      src: "./games/tic-tac-toe-main/index.html",
      description: "A classic two-player game where X and O take turns marking the grid. Get three in a row to win!",
      controls: "Mouse left click"
    },
    "Pac Man": {
      src: "./games/pacman-js-master/index.html",
      description: "Navigate Pac-Man through a maze, eat all the pellets, and avoid ghosts. Classic arcade fun with a maze-chase twist!",
      controls: "Use the arrow keys to move Pac-Man"
    },
    "Chess": {
      src: "./games/ai-chess-main/index.html",
      description: "A strategic board game where two players battle to checkmate the opponent’s king. Plan your moves and outsmart your rival!",
      controls: " "
    },
    "Space Shooter": {
      src: "./games/shooting-game-js-master/index.html",
      description: "Pilot your spaceship, dodge enemy fire, and blast your way through waves of alien invaders in this fast-paced shooter!",
      controls: "WASD: Move the ship\nSpace: Fire a missile\nShift: Activate the ship's shield\nF: Drop a bomb\nR: Restart from Wave 1 after a game over\nC: Restart from the last 5-Wave checkpoint after a game over"
    },
    "Duck Hunt": {
      src: "./games/Duck_shooter_game_JS-master/html/index.html",
      description: "Aim and shoot flying ducks before they escape. Test your reflexes and accuracy in this classic hunting challenge!",
      controls: "Mouse Left click to shoot"
    },
    "Deadshot": {
      src: "https://deadshot.io/",
      description: "An online multiplayer shooting game where you compete to be the last sharpshooter standing. Quick reflexes and precision aim are key!",
      controls: " "
    }
    // Add data for other games similarly...
  };

  const modal = document.getElementById("gameModal");
  const gameTitle = document.getElementById("gameTitle");
  const gameDesc = document.getElementById("gameDescription");
  const gameControls = document.getElementById("gameControls");
  const gamePreview = document.getElementById("gamePreview");
  const playBtn = document.getElementById("playGameBtn");
  const closeBtn = document.querySelector(".close");

  document.querySelectorAll(".game-card a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const gameName = this.getAttribute("data-game");
      console.log("Clicked:", gameName);

    const data = gameData[gameName];
    if (!data) {
      console.log("No data found for:", gameName);
      return;
    }

      if (!data) return;

      gameTitle.textContent = gameName;
      gameDesc.textContent = data.description;
      gameControls.innerHTML = data.controls.replace(/\n/g, '<br>');
      gamePreview.src = data.src;
      playBtn.href = data.src;

      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    gamePreview.src = ""; // stop the preview
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      gamePreview.src = "";
    }
  });
</script>


</body>
</html>
