const STORAGE_KEYS = {
    MEDICAMENTOS: 'cuidar_plus_medicamentos',
    PRESSAO: 'cuidar_plus_pressao',
    DIABETES: 'cuidar_plus_diabetes',
};

export const getStoredData = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error('Error reading from storage', error);
        return [];
    }
};

export const saveData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to storage', error);
    }
};

export { STORAGE_KEYS };
