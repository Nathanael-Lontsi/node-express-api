const db = require("./db");
const { writeJson, readRequestData, getIdFromUrl } = require("../utils");

function getAllDrinks(req, res) {
  const drinks = db.getDrinks();
  writeJson(res, drinks);
}

async function createDrinks(req, res) {
  const data = await readRequestData(req);
  const drinks = db.getDrinks();
  drinks.push({ ...data, id: Date.now() });
  db.saveDrinks(drinks);
  writeJson(res, drinks.pop());
}

async function patchOneDrink(req, res) {
  const data = await readRequestData(req);
  const id = getIdFromUrl(req.url);
  const drinks = db.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1, { ...drinks[index], ...data });
    db.saveDrinks(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" });
  }
}

function getOneDrink(req, res) {
  const drinks = db.getDrinks();
  const drink = drinks.find((d) => d.id === id);
  if (drink) {
    writeJson(res, drinks);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function updateOneDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const { name, description, imageUrl, ingredients, userId } =
    await readRequestData(req);
  if (!userId || !ingredients || !imageUrl || !description || !name) {
    return writeJson(res, { error: "Drink data missing" }, 403);
  }
  const drinks = db.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1, {
      name,
      description,
      imageUrl,
      ingredients,
      userId,
    });
    db.saveDrink(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

module.exports = {
  getAllDrinks,
  createDrinks,
  patchOneDrink,
  getOneDrink,
  updateOneDrink,
};
