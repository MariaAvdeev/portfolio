// A simple IndexedDB wrapper
export default class IndexedDBWrapper {
  constructor(dbName, storeName, version = 4) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.storeName = storeName;
  }

  init() {
    let store = this.db.objectStoreNames.contains(this.dbName);
    if (!store) {
      store = this.db.createObjectStore(this.dbName, { autoIncrement: true, keyPath: 'name' });
      store.createIndex("name", "name", { unique: true });
    }
  }

  // Open or create a database
  open(callback) {
    const request = indexedDB.open(this.dbName, this.version);

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      this.init()
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      if (callback) callback(this.db);
    };

    request.onerror = (event) => {
      if (callback)
        callback(`Error opening database: ${event.target.error}`, null);
    };
  }

  // Add or update data in a store
  put(db, data) {
    const tx = db.transaction(this.dbName, "readwrite");
    const store = tx.objectStore(this.dbName);
    
    store.put(data);
  }

  // Retrieve data by key
  get(db, key, callback) {
    const tx = db.transaction(this.dbName, "readonly");
    const store = tx.objectStore(this.dbName);

    const request = store.get(key);

    request.onsuccess = () => {
      if (callback) callback(request.result);
    };
    request.onerror = (event) => {
      if (callback)
        callback(`Error retrieving data: ${event.target.error}`, null);
    };
  }

  // Delete data by key
  delete(db, key, callback) {
    const transaction = db.transaction(this.dbName, "readwrite");
    const store = transaction.objectStore(this.dbName);

    const request = store.delete(key);

    request.onsuccess = () => {
      if (callback) callback(null, request.result);
    };
    request.onerror = (event) => {
      if (callback)
        callback(`Error deleting data: ${event.target.error}`, null);
    };
  }

  // Get all keys in a store
  getAllKeys(db, callback) {
    const tx = db.transaction(this.dbName, "readonly");
    const store = tx.objectStore(this.dbName);

    const request = store.getAll();

    request.onsuccess = () => {
      if (callback) callback(request.result);
    };
    request.onerror = (event) => {
      if (callback)
        callback(`Error retrieving keys: ${event.target.error}`, null);
    };
  }

  // Close the database
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Delete the entire database
  static deleteDatabase(dbName, callback) {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      if (callback) callback(null);
    };
    request.onerror = (event) => {
      if (callback) callback(`Error deleting database: ${event.target.error}`);
    };
  }
}
