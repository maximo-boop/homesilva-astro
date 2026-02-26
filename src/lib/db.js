// src/lib/db.js
import Database from 'better-sqlite3'

const db = new Database('./propiedades.db')
export default db