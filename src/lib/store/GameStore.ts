import {create, StateCreator} from 'zustand';
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware';

const colors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan',
    'brown', 'gray', 'navy', 'olive', 'teal', 'magenta', 'lime', 'indigo',
    'maroon', 'gold'
] as const;
const animalEmojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦'
] as const;
type Color = typeof colors[number];
type Emoji = typeof animalEmojis[number];
export type TileContent = Color | Emoji;

export type GameMode = 'pair' | 'triplet';
export type TileCount = 12 | 18 | 24 | 30 | 36;
export type AnimationType = 'flip' | 'fade';
export type ContentType = 'colors' | 'emojis';

interface Tile {
    id: number;
    content: TileContent;
    isRevealed: boolean;
    isMatched: boolean;
}

interface GameStatistics {
    timeSpent: number;
    flippedTiles: number;
    successfulMatches: number;
}

interface GameHistory {
    tileCount: TileCount;
    animationType: AnimationType;
    contentType: ContentType;
    gameMode: GameMode;
    initiallyHidden: boolean;
    matchesMade: number;
    timeSpent: number;
    totalFlips: number;
    date: string;
}

interface GameState {
    gameMode: GameMode;
    tileCount: TileCount;
    contentType: ContentType;
    useFlipAnimation: boolean;
    showInitialReveal: boolean;
    isGameStarted: boolean;
    gameCompleted: boolean;


    tiles: Tile[];
    revealedIndices: number[];
    isCheckingMatch: boolean;
    initialRevealDone: boolean;

    currentGameStats: GameStatistics;
    gameHistory: GameHistory[];

    startTime: number | null;
    timerInterval: number | null;
    updateTimer: () => void;

    setContentType: (type: ContentType) => void;
    setGameMode: (mode: GameMode) => void;
    setTileCount: (count: TileCount) => void;
    setAnimationType: (type: AnimationType) => void;
    setShowInitialReveal: (show: boolean) => void;
    startGame: () => void;

    initializeGame: () => void;
    handleTileClick: (index: number) => void;
    endGame: (forceEnd?: boolean) => void;

    checkGameCompletion: () => void;
    updateCurrentGameStats: (stats: Partial<GameStatistics>) => void;
    addGameToHistory: () => void;
    getFilteredGameHistory: (filters: Partial<GameHistory>) => GameHistory[];

    resetGameStore: () => void;
}

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

        currentGameStats: {
            timeSpent: 0,
            flippedTiles: 0,
            successfulMatches: 0
        },
        gameHistory: [],
        startTime: null,
        timerInterval: null,
        gameCompleted: false,
        contentType: 'colors' as ContentType,

        resetGameStore: () => {
            localStorage.removeItem('game-storage');
            set({
                gameMode: 'pair',
                tileCount: 18,
                useFlipAnimation: true,
                showInitialReveal: false,
                isGameStarted: false,
                tiles: [],
                revealedIndices: [],
                isCheckingMatch: false,
                initialRevealDone: false,
                currentGameStats: {
                    timeSpent: 0,
                    flippedTiles: 0,
                    successfulMatches: 0
                },
                gameHistory: [],
                startTime: null,
                timerInterval: null,
                gameCompleted: false,
                contentType: 'colors' as ContentType,
            });
        },

        setGameMode: (mode) => set({gameMode: mode}),
        setTileCount: (count) => set({tileCount: count}),
        setAnimationType: (type) => set({useFlipAnimation: type === 'flip'}),
        setShowInitialReveal: (show) => set({showInitialReveal: show}),
        setContentType: (type: ContentType) => set({ contentType: type }),

        startGame: () => {
            const {showInitialReveal} = get();
            set({
                isGameStarted: true,
                gameCompleted: false,
                currentGameStats: {
                    timeSpent: 0,
                    flippedTiles: 0,
                    successfulMatches: 0
                }
            });
            get().initializeGame();

            if (showInitialReveal) {
                setTimeout(() => {
                    set({ startTime: Date.now() });
                    const interval = setInterval(get().updateTimer, 1000) as unknown as number;
                    set({ timerInterval: interval });
                }, 3000);
            } else {
                set({ startTime: Date.now() });
                const interval = setInterval(get().updateTimer, 1000) as unknown as number;
                set({ timerInterval: interval });
            }
        },

        endGame: (forceEnd = false) => {
            const state = get();
            if (state.isGameStarted && (state.gameCompleted || forceEnd)) {
                if (state.currentGameStats.flippedTiles > 0) {
                    state.addGameToHistory();
                }
                if (state.timerInterval) {
                    clearInterval(state.timerInterval);
                }
                set({
                    isGameStarted: false,
                    gameCompleted: false,
                    tiles: [],
                    revealedIndices: [],
                    isCheckingMatch: false,
                    initialRevealDone: false,
                    currentGameStats: {
                        timeSpent: 0,
                        flippedTiles: 0,
                        successfulMatches: 0
                    },
                    startTime: null,
                    timerInterval: null
                });
            }
        },
        updateTimer: () => {
            const {startTime} = get();
            if (startTime) {
                const currentTime = Date.now();
                const timeSpent = Math.floor((currentTime - startTime) / 1000);
                set(state => ({
                    currentGameStats: {
                        ...state.currentGameStats,
                        timeSpent
                    }
                }));
            }
        },

        initializeGame: () => {
            const {gameMode, tileCount, showInitialReveal, contentType} = get();
            const contentPool = contentType === 'colors' ? colors : animalEmojis;
            const gameContent = contentPool.slice(0, gameMode === 'pair' ? tileCount / 2 : tileCount / 3);
            const repeatedContent = gameMode === 'pair'
                ? [...gameContent, ...gameContent]
                : [...gameContent, ...gameContent, ...gameContent];

            const shuffledContent = repeatedContent
                .sort(() => Math.random() - 0.5)
                .map((content, index) => ({
                    id: index,
                    content,
                    isRevealed: showInitialReveal,
                    isMatched: false,
                }));

            set({
                tiles: shuffledContent,
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

            get().updateCurrentGameStats({ flippedTiles: get().currentGameStats.flippedTiles + 1 });

            set({revealedIndices: newRevealedIndices, tiles: newTiles});

            if (newRevealedIndices.length === (gameMode === 'pair' ? 2 : 3)) {
                set({isCheckingMatch: true});
                setTimeout(() => {
                    const {tiles} = get();
                    const contents = newRevealedIndices.map(index => tiles[index].content);

                    if (contents.every(content => content === contents[0])) {
                        set((state) => ({
                            tiles: state.tiles.map((tile, i) =>
                                newRevealedIndices.includes(i) ? {...tile, isMatched: true} : tile
                            )
                        }));
                        // Update successful matches count
                        get().updateCurrentGameStats({ successfulMatches: get().currentGameStats.successfulMatches + 1 });
                        get().checkGameCompletion();
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

        checkGameCompletion: () => {
            const timer = get().timerInterval;
            const {tiles} = get();
            const allMatched = tiles.every(tile => tile.isMatched);
            if (allMatched) {
                set({gameCompleted: true});
                if (timer) {
                    clearInterval(timer);
                }
            }
        },

        updateCurrentGameStats: (stats: Partial<GameStatistics>) => {
            set((state) => ({
                currentGameStats: {...state.currentGameStats, ...stats}
            }));
        },

        addGameToHistory: () => {
            const state = get();
            const endTime = Date.now();
            const timeSpent = state.startTime ? Math.floor((endTime - state.startTime) / 1000) : 0;

            const gameRecord: GameHistory = {
                tileCount: state.tileCount,
                contentType: state.contentType,
                animationType: state.useFlipAnimation ? 'flip' : 'fade',
                gameMode: state.gameMode,
                initiallyHidden: !state.showInitialReveal,
                matchesMade: state.currentGameStats.successfulMatches,
                timeSpent: timeSpent,
                totalFlips: state.currentGameStats.flippedTiles,
                date: new Date().toISOString()
            };

            set((state) => ({
                gameHistory: [...state.gameHistory, gameRecord]
            }));
        },

        getFilteredGameHistory: (filters: Partial<GameHistory>) => {
            const state = get();
            return state.gameHistory.filter(game =>
                Object.entries(filters).every(([key, value]) =>
                    game[key as keyof GameHistory] === value
                )
            );
        }
    }),
    {
        name: 'game-storage',
        storage: createJSONStorage(() => localStorage),
    }));