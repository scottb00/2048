/*
  Type definitions for legacy 2048 game scripts that live under public/js
  These declarations make the global classes and helpers available to
  TypeScript code running in the Next.js project while leaving the
  underlying JavaScript exactly as-is in the browser.
*/

// ---------------------------------------------------------------------------
// Utility types
// ---------------------------------------------------------------------------

interface Vector {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Tile
// ---------------------------------------------------------------------------

declare class Tile {
  constructor(position: Vector, value?: number);

  x: number;
  y: number;
  value: number;

  previousPosition: Vector | null;
  mergedFrom: [Tile, Tile] | null;

  savePosition(): void;
  updatePosition(position: Vector): void;
  serialize(): {
    position: Vector;
    value: number;
  };
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

declare class Grid {
  constructor(size: number, previousState?: any);

  readonly size: number;
  cells: Array<Array<Tile | null>>;

  empty(): Array<Array<Tile | null>>;
  fromState(state: any): Array<Array<Tile | null>>;

  randomAvailableCell(): Vector | undefined;
  availableCells(): Vector[];
  eachCell(callback: (x: number, y: number, tile: Tile | null) => void): void;
  cellsAvailable(): boolean;

  cellAvailable(cell: Vector): boolean;
  cellOccupied(cell: Vector): boolean;
  cellContent(cell: Vector): Tile | null;

  insertTile(tile: Tile): void;
  removeTile(tile: Tile): void;
  withinBounds(position: Vector): boolean;
  serialize(): {
    size: number;
    cells: any;
  };
}

// ---------------------------------------------------------------------------
// LocalStorageManager
// ---------------------------------------------------------------------------

declare class LocalStorageManager {
  constructor();

  bestScoreKey: string;
  gameStateKey: string;
  walletAddress: string | null;

  localStorageSupported(): boolean;
  setWalletAddress(address: string): void;

  // Best score
  getBestScore(): number;
  setBestScore(score: number): void;

  // Game state
  getGameState(): any;
  setGameState(gameState: any): void;
  clearGameState(): void;
}

// ---------------------------------------------------------------------------
// HTMLActuator
// ---------------------------------------------------------------------------

interface ActuatorMetadata {
  score: number;
  over: boolean;
  won: boolean;
  bestScore: number;
  terminated: boolean;
}

declare class HTMLActuator {
  constructor();

  tileContainer: Element;
  scoreContainer: Element;
  bestContainer: Element;
  messageContainer: Element;

  score: number;

  actuate(grid: Grid, metadata: ActuatorMetadata): void;
  continueGame(): void;
}

// ---------------------------------------------------------------------------
// KeyboardInputManager
// ---------------------------------------------------------------------------

declare type InputCallback = (data?: any) => void;

declare class KeyboardInputManager {
  constructor();

  events: Record<string, InputCallback[]>;
  eventTouchstart: string;
  eventTouchmove: string;
  eventTouchend: string;

  on(event: string, callback: InputCallback): void;
  emit(event: string, data?: any): void;
  listen(): void;
  restart(event?: Event): void;
  keepPlaying(event?: Event): void;
  bindButtonPress(selector: string, fn: (event: Event) => void): void;
}

// ---------------------------------------------------------------------------
// GameManager
// ---------------------------------------------------------------------------

declare class GameManager {
  constructor(
    size: number,
    InputManager: new () => KeyboardInputManager,
    Actuator: new () => HTMLActuator,
    storageManager: LocalStorageManager,
  );

  // Core state
  size: number;
  inputManager: KeyboardInputManager;
  storageManager: LocalStorageManager;
  actuator: HTMLActuator;

  startTiles: number;

  score: number;
  over: boolean;
  won: boolean;
  keepPlaying: boolean;

  // Public API (methods called by other scripts)
  restart(): void;
  isGameTerminated(): boolean;
  move(direction: number): void;
}

// ---------------------------------------------------------------------------
// Global helpers / singletons
// ---------------------------------------------------------------------------

declare const fakeStorage: {
  _data: Record<string, string>;
  setItem(id: string, val: unknown): string;
  getItem(id: string): string | undefined;
  removeItem(id: string): boolean;
  clear(): Record<string, string>;
};

declare global {
  interface Window {
    startGame?: (walletAddress: string) => void;
    updateScore?: (newScore: number) => void;
    fakeStorage?: typeof fakeStorage;
  }
}

export {}; 