import * as fs from 'fs';
import * as path from 'path';
import { getStore, setStore } from './schema.js';
const DB_PATH = path.join(process.cwd(), 'scholars-db.json');
function loadDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            setStore(JSON.parse(data));
        }
    }
    catch (error) {
        console.error('Failed to load database:', error);
    }
}
function saveDatabase() {
    try {
        const store = getStore();
        store.metadata.last_updated = new Date().toISOString();
        fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2));
    }
    catch (error) {
        console.error('Failed to save database:', error);
    }
}
const args = process.argv.slice(2);
const command = args[0];
if (!command) {
    console.log('Voices of Truth CLI');
    console.log('Available commands:');
    console.log('  list-scholars         List all scholars');
    console.log('  list-categories      List all categories');
    console.log('  list-countries        List all countries');
    console.log('  get-statistics        Get directory statistics');
    console.log('  add-scholar <name>    Add a new scholar');
    console.log('  add-category <en> <ar> Add a new category');
    console.log('  add-country <en> <ar>  Add a new country');
    process.exit(0);
}
loadDatabase();
switch (command) {
    case 'list-scholars': {
        const store = getStore();
        console.log(JSON.stringify(store.scholars, null, 2));
        break;
    }
    case 'list-categories': {
        const store = getStore();
        console.log(JSON.stringify(store.categories, null, 2));
        break;
    }
    case 'list-countries': {
        const store = getStore();
        console.log(JSON.stringify(store.countries, null, 2));
        break;
    }
    case 'get-statistics': {
        const store = getStore();
        const stats = {
            total: store.scholars.length,
            categories: store.categories.length,
            countries: store.countries.length
        };
        console.log(JSON.stringify(stats, null, 2));
        break;
    }
    case 'add-category': {
        const store = getStore();
        const newCat = { id: store.categories.length + 1, en: args[1] || '', ar: args[2] || '' };
        store.categories.push(newCat);
        setStore(store);
        saveDatabase();
        console.log('Category added:', newCat);
        break;
    }
    case 'add-country': {
        const store = getStore();
        const newCountry = { id: store.countries.length + 1, en: args[1] || '', ar: args[2] || '' };
        store.countries.push(newCountry);
        setStore(store);
        saveDatabase();
        console.log('Country added:', newCountry);
        break;
    }
    case 'search': {
        const store = getStore();
        const q = (args[1] || '').toLowerCase();
        const results = store.scholars.filter(s => s.name.en?.toLowerCase().includes(q) ||
            s.name.ar?.includes(q));
        console.log(JSON.stringify(results, null, 2));
        break;
    }
    default:
        console.log('Unknown command:', command);
        process.exit(1);
}
