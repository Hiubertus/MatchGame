import {create, StateCreator} from 'zustand';
import {persist, PersistOptions, PersistStorage, StateStorage, StorageValue} from 'zustand/middleware';
import {customStorage} from "../storage/customStorage.ts";

const colors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan',
    'brown', 'gray', 'navy', 'olive', 'teal', 'magenta', 'lime', 'indigo',
    'maroon', 'gold'
] as const;
type Color = typeof colors[number];

export type GameMode = 'pair' | 'triplet';
export type TileCount = 12 | 18 | 24 | 30 | 36;
export type AnimationType = 'flip' | 'fade';

interface Tile {
    id: number;
    color: Color;
    isRevealed: boolean;
    isMatched: boolean;
}

interface GameState {
    gameMode: GameMode;
    tileCount: TileCount;
    useFlipAnimation: boolean;
    showInitialReveal: boolean;
    isGameStarted: boolean;

    tiles: Tile[];
    revealedIndices: number[];
    isCheckingMatch: boolean;
    initialRevealDone: boolean;

    setGameMode: (mode: GameMode) => void;
    setTileCount: (count: TileCount) => void;
    setAnimationType: (type: AnimationType) => void;
    setShowInitialReveal: (show: boolean) => void;
    startGame: () => void;

    initializeGame: () => void;
    handleTileClick: (index: number) => void;
    endGame: () => void;
}

const createJSONStorage = (storage: StateStorage): PersistStorage<GameState> => ({
    getItem: (name) => {
        const value = storage.getItem(name);
        return value ? (JSON.parse(value) as StorageValue<GameState>) : null;
    },
    setItem: (name, value) => {
        storage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        storage.removeItem(name);
    },
});

const gameStorage = createJSONStorage({
    getItem: (): string | null => {
        const value = customStorage.getItem();
        return value ? value : null;
    },
    setItem: (value): void => {
        customStorage.setItem(value);
    },
    removeItem: (): void => {
        customStorage.removeItem();
    },
});

type GamePersist = (
    config: StateCreator<GameState>,
    options: PersistOptions<GameState>
) => StateCreator<GameState>;

export const useGameStore = create((persist as GamePersist)((set, get) => ({
        gameMode: 'pair',
        tileCount: 18,
        useFlipAnimation: true,
        showInitialReveal: false,
        isGameStarted: false,
        tiles: [],
        revealedIndices: [],
        isCheckingMatch: false,
        initialRevealDone: false,

        setGameMode: (mode) => set({gameMode: mode}),
        setTileCount: (count) => set({tileCount: count}),
        setAnimationType: (type) => set({useFlipAnimation: type === 'flip'}),
        setShowInitialReveal: (show) => set({showInitialReveal: show}),
        endGame: () => {
            set({
                isGameStarted: false,
                tiles: [],
                revealedIndices: [],
                isCheckingMatch: false,
                initialRevealDone: false,
            });
        },
        startGame: () => {
            set({isGameStarted: true});
            get().initializeGame();
        },

        initializeGame: () => {
            const {gameMode, tileCount, showInitialReveal} = get();
            const gameColors = colors.slice(0, gameMode === 'pair' ? tileCount / 2 : tileCount / 3);
            const repeatedColors = gameMode === 'pair'
                ? [...gameColors, ...gameColors]
                : [...gameColors, ...gameColors, ...gameColors];

            const shuffledColors = repeatedColors
                .sort(() => Math.random() - 0.5)
                .map((color, index) => ({
                    id: index,
                    color,
                    isRevealed: showInitialReveal,
                    isMatched: false,
                }));

            set({
                tiles: shuffledColors,
                revealedIndices: [],
                initialRevealDone: !showInitialReveal,
                isCheckingMatch: false
            });

            if (showInitialReveal) {
                setTimeout(() => {
                    set((state) => ({
                        tiles: state.tiles.map(tile => ({...tile, isRevealed: false})),
                        initialRevealDone: true
                    }));
                }, 3000);
            }
        },

        handleTileClick: (index) => {
            const {tiles, revealedIndices, isCheckingMatch, initialRevealDone, gameMode} = get();
            if (!initialRevealDone || isCheckingMatch || revealedIndices.includes(index) || tiles[index].isMatched) return;

            const newRevealedIndices = [...revealedIndices, index];
            const newTiles = [...tiles];
            newTiles[index].isRevealed = true;

            set({revealedIndices: newRevealedIndices, tiles: newTiles});

            if (newRevealedIndices.length === (gameMode === 'pair' ? 2 : 3)) {
                set({isCheckingMatch: true});
                setTimeout(() => {
                    const {tiles} = get();
                    const colors = newRevealedIndices.map(index => tiles[index].color);

                    if (colors.every(color => color === colors[0])) {
                        set((state) => ({
                            tiles: state.tiles.map((tile, i) =>
                                newRevealedIndices.includes(i) ? {...tile, isMatched: true} : tile
                            )
                        }));
                    } else {
                        set((state) => ({
                            tiles: state.tiles.map((tile, i) =>
                                newRevealedIndices.includes(i) ? {...tile, isRevealed: false} : tile
                            )
                        }));
                    }

                    set({revealedIndices: [], isCheckingMatch: false});
                }, 1000);
            }
        },
    }),
    {
        name: 'game-storage',
        storage: gameStorage,
    })
);