window.startGame = function(walletAddress) {
  // Wait till the browser is ready to render the game (avoids glitches)
  window.requestAnimationFrame(function () {
    var storageManager = new LocalStorageManager;
    storageManager.setWalletAddress(walletAddress);
    new GameManager(4, KeyboardInputManager, HTMLActuator, storageManager);
  });
};
