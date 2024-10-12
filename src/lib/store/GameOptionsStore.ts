import { create } from 'zustand';

export type GameMode = 'pair' | 'triplet';
export type TileCount = 12 | 18 | 24 | 30 | 36;
export type AnimationType = 'flip' | 'fade';

export interface OptionsState {
    gameMode: GameMode;
    tileCount: TileCount;
    useFlipAnimation: boolean;
    isGameStarted: boolean;
    showInitialReveal: boolean;
    setGameMode: (mode: GameMode) => void;
    setTileCount: (count: TileCount) => void;
    setAnimationType: (type: AnimationType) => void;
    setIsGameStarted: (started: boolean) => void;
    setShowInitialReveal: (show: boolean) => void;
    startGame: () => void;
}

export const useOptionsStore = create<OptionsState>((set) => ({
    gameMode: 'pair',
    tileCount: 18,
    useFlipAnimation: true,
    isGameStarted: false,
    showInitialReveal: false,
    setGameMode: (mode) => set({ gameMode: mode }),
    setTileCount: (count) => set({ tileCount: count }),
    setAnimationType: (type) => set({ useFlipAnimation: type === 'flip' }),
    setIsGameStarted: (started) => set({ isGameStarted: started }),
    setShowInitialReveal: (show) => set({ showInitialReveal: show }),
    startGame: () => set({ isGameStarted: true }),
}));
