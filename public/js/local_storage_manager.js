window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";
  this.walletAddress    = null;

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

LocalStorageManager.prototype.setWalletAddress = function (address) {
  this.walletAddress = address;
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  if (!this.walletAddress) return 0;
  var key = this.walletAddress + "-" + this.bestScoreKey;
  return this.storage.getItem(key) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  if (!this.walletAddress) return;
  var key = this.walletAddress + "-" + this.bestScoreKey;
  this.storage.setItem(key, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  if (!this.walletAddress) return null;
  var key = this.walletAddress + "-" + this.gameStateKey;
  var stateJSON = this.storage.getItem(key);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  if (!this.walletAddress) return;
  var key = this.walletAddress + "-" + this.gameStateKey;
  this.storage.setItem(key, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  if (!this.walletAddress) return;
  var key = this.walletAddress + "-" + this.gameStateKey;
  this.storage.removeItem(key);
};
