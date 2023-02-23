const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "./db.json");
const DRINKS_DB_FILE = path.join(__dirname, "./drinks.db.json")

function getUsers() {
  try {
    const data = readFileSync(DB_FILE) || "[]";
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function saveUsers(users = []) {
  try {
    const data = JSON.stringify(users, null, 4);
    writeFileSync(DB_FILE, data);
  } catch (e) {
    throw new Error("Database write error");
  }
}

function getDrinks() {
  try {
    const data = readFileSync(DRINKS_DB_FILE) || "[]";
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function saveDrinks(drinks = []) {
  try {
    const data = JSON.stringify(users, null, 4);
    writeFileSync(DRINKS_DB_FILE, data);
  } catch (e) {
    throw new Error("Database write error");
  }
}

const db = { saveUsers, getUsers, saveDrinks, getDrinks }

module.exports = db;
