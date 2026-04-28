let store = {
    countries: [],
    specializations: [],
    scholars: [],
    categories: [],
    metadata: { last_updated: '', version: '1.0.0' }
};
export function getStore() {
    return store;
}
export function setStore(newStore) {
    store = newStore;
}
export function generateId() {
    const maxId = store.scholars.reduce((max, s) => Math.max(max, s.id), 0);
    return maxId + 1;
}
