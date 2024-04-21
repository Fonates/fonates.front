export const STORE_KEYS = {
    KEY_CONSTRUCTOR_FORM: 'key-constructor-form',
}

export function getFromStroe(key: string) {
    if (typeof localStorage === 'undefined') {
        return null;
    }

    const rawData = localStorage.getItem(key);
    const data = rawData ? JSON.parse(rawData) : {
        data: {},
    };

    return data
} 

export function setItemToStore(key: string, data: any) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(key, JSON.stringify({
        "data": data
    }))
}

export function deleteItemFromStore(key: string) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.removeItem(key);
}
    