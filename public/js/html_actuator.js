function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");

  switch (tile.value) {
    case 2048:
      const logoImage = document.createElement("img");
      logoImage.src = "/2048.jpg";
      logoImage.alt = "2048";
      logoImage.classList.add("tile-logo-image");
      inner.appendChild(logoImage);
      break;
    case 4096:
      const image4096 = document.createElement("img");
      image4096.src = "/4096.jpg";
      image4096.alt = "4096";
      image4096.classList.add("tile-logo-image");
      inner.appendChild(image4096);
      break;
    case 8192:
      const image8192 = document.createElement("img");
      image8192.src = "/8192.jpg";
      image8192.alt = "8192";
      image8192.classList.add("tile-logo-image");
      inner.appendChild(image8192);
      break;
    case 16384:
      const image16384 = document.createElement("img");
      image16384.src = "/16384.jpg";
      image16384.alt = "16384";
      image16384.classList.add("tile-logo-image");
      inner.appendChild(image16384);
      break;
    case 32768:
      const image32768 = document.createElement("img");
      image32768.src = "/32768.jpg";
      image32768.alt = "32768";
      image32768.classList.add("tile-logo-image");
      inner.appendChild(image32768);
      break;
    case 65536:
      const image65536 = document.createElement("img");
      image65536.src = "/65536.jpg";
      image65536.alt = "65536";
      image65536.classList.add("tile-logo-image");
      inner.appendChild(image65536);
      break;
    case 131072:
      const image131072 = document.createElement("img");
      image131072.src = "/131072.jpg";
      image131072.alt = "131072";
      image131072.classList.add("tile-logo-image");
      inner.appendChild(image131072);
      break;
    default:
      inner.textContent = tile.value;
  }

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  // Update React component's score state
  if (window.updateScore && typeof window.updateScore === 'function') {
    window.updateScore(this.score);
  }

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
