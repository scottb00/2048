import Script from 'next/script';

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="heading">
          <h1 className="title">2048</h1>
          <div className="scores-container">
            <div className="score-container">0</div>
            <div className="best-container">0</div>
          </div>
        </div>

        <div className="above-game">
          <p className="game-intro">Join the numbers and get to the <strong>2048 tile!</strong></p>
          <a className="restart-button">New Game</a>
        </div>

        <div className="game-container">
          <div className="game-message">
            <p></p>
            <div className="lower">
              <a className="keep-playing-button">Keep going</a>
              <a className="retry-button">Try again</a>
            </div>
          </div>

          <div className="grid-container">
            <div className="grid-row">
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
            </div>
            <div className="grid-row">
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
            </div>
            <div className="grid-row">
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
            </div>
            <div className="grid-row">
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
              <div className="grid-cell"></div>
            </div>
          </div>

          <div className="tile-container"></div>
        </div>

        <p className="game-explanation">
          <strong className="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
        </p>
        <hr />
        <p>
          <strong className="important">Note:</strong> This site is the official version of 2048. You can play it on your phone via <a href="http://git.io/2048">http://git.io/2048.</a> All other apps or sites are derivatives or fakes, and should be used with caution.
        </p>
        <hr />
        <p>
          Created by <a href="http://gabrielecirulli.com" target="_blank">Gabriele Cirulli.</a> Based on <a href="https://itunes.apple.com/us/app/1024!/id823499224" target="_blank">1024 by Veewo Studio</a> and conceptually similar to <a href="http://asherv.com/threes/" target="_blank">Threes by Asher Vollmer.</a>
        </p>
      </div>
      <Script src="/js/bind_polyfill.js" />
      <Script src="/js/classlist_polyfill.js" />
      <Script src="/js/animframe_polyfill.js" />
      <Script src="/js/keyboard_input_manager.js" />
      <Script src="/js/html_actuator.js" />
      <Script src="/js/grid.js" />
      <Script src="/js/tile.js" />
      <Script src="/js/local_storage_manager.js" />
      <Script src="/js/game_manager.js" />
      <Script src="/js/application.js" />
    </>
  );
}
