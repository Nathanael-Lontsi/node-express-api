const db = require("./db");
const { writeJson, readRequestData, getIdFromUrl } = require("./utils");

function getAllUsers(req, res) {
  const users = db.getUsers();
  res.json(users);
}

function getOneUser(req, res) {
  const id = +req.params.id;
  const users = db.getUsers();
  const user = users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ status: "NOT_FOUND" });
  }
}
async function updateOneUser(req, res) {
  const id = +req.params.id;
  const { firstName, lastName, email } = await readRequestData(req);
  if (!email || !firstName || !lastName) {
    return res.status(404).json({ error: "User data missing" });
  }
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index > -1) {
    users.splice(index, 1, { email, firstName, lastName, id });
    db.saveUsers(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ status: "NOT_FOUND" });
  }
}

function deleteOneUser(req, res) {
  const id = +req.params.id;
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index > -1) {
    users.splice(index, 1);
    db.saveUsers(users);
  }
  res.json({ status: "success" });
}

async function patchOnUser(req, res) {
  const id = +req.params.id;
  const data = req.body;
  if (!data) {
    return res.status(403).json({ error: "User data missing" });
  }
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index > -1) {
    users.splice(index, 1, { ...users[index], ...data, id });
    db.saveUsers(users);
    writeJson(res, users[index]);
  } else {
    res.status(404).json({ status: "NOT_FOUND" });
  }
}

async function createUser(req, res) {
  const data = req.body;
  // const data = await readRequestData(req);
  if (!data) {
    return res.status(403).json({ error: "User data missing" });
  }
  const newUser = { ...data, id: Date.now() };
  const users = db.getUsers();
  db.saveUsers([...users, newUser]);
  res.json(newUser);
}

module.exports = {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  patchOnUser,
};
