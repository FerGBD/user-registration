import Dexie from 'dexie';

// Cria/atualiza o banco com nova versão
const db = new Dexie('UserDatabase_v5');

// Schema com índice único no email
db.version(3).stores({
  users: '++id, name, &email' // O '&' torna o email único
});

// Hooks para debug
db.on('populate', () => console.log('Banco de dados inicializado'));
db.on('versionchange', () => window.location.reload());

export default db;