const STORAGE_KEY = 'game-storage';

export const customStorage = {
    getItem: (): string | null => {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value !== null ? value : null;
        } catch (err) {
            console.error('Error reading from localStorage:', err);
            return null;
        }
    },
    setItem: (state: string): void => {
        try {
            localStorage.setItem(STORAGE_KEY, state);
        } catch (err) {
            console.error('Error writing to localStorage:', err);
        }
    },
    removeItem: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error('Error removing from localStorage:', err);
        }
    }
};