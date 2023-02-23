const http = require("http");
// const express = require("express");
const { parse } = require("url");
const { getAllDrinks, createDrinks } = require("./drinks");

const {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  patchOnUser,
  deleteOneUser,
} = require("./users");
const { writeJson } = require("./utils");

/* const app = express();
app.use(express.json());

const API_KEYS = ["1", "2", "3", "4", "5"];

app.use("/users", function (req, res, next) {
  const { apiKey } = req.query;
  const key = req.get("x-api-key");
  if (API_KEYS.includes(apiKey) || API_KEYS.includes(apiKey)) {
    next();
  } else {
    res.sendStatus(403);
  }
});

app.use(function (req, res, next) {
  console.log(`${new Date().toTimeString()}     ${req.originalUrl}`);
  next();
});

app.get("/users", getAllUsers);
app.post("/users", createUser);
app.get("/users/:id", getOneUser);
app.put("./users/:id", updateOneUser);
app.patch("/users/:id", patchOnUser);
app.delete("/users/:id", deleteOneUser);

app.listen(8080, function () {
  console.log("Running on port 8080");
}); */

function registerRoute(routePrefix, handler, req, res) {
  const { pathname } = parse(req.url);
  if (pathname.startsWith(routePrefix)) {
    handler(pathname, req, res);
  }
}

http
  .createServer(function (req, res) {
    registerRoute("/users", handleUsersRequest, req, res);
    registerRoute("/drinks", handleDrinksRequest, req, res);
  })
  .listen(8080);
console.log("Listening on port 8080");

function throw404(res) {
  writeJson(res, { status: "Resource not found" }, 404);
}

function handleDrinksRequest(pathname, req, res) {
  // Logic to check for each routes
  if (pathname === "/drinks") {
    if (req.method === "GET") {
      // handle get all
      getAllDrinks(req, res);
    } else if (req.method === "POST") {
      // handle create
      createDrinks(req, res);
    }
  } else if (pathname.split("/").length === 3) {
    switch (req.method) {
      case "GET":
        getOneDrink(req, res);
        return; //handle get one
      case "PUT":
        updateOneDrink(req, res);
        return; //handle put one
      case "PATCH":
        patchOneDrink(req, res);
        return; //handle patch one
      case "DELETE":
        return; //handle delete one
      default:
        break;
    }
  }
}

function handleUsersRequest(pathname, req, res) {
  const { method } = req;
  if (pathname === "/users") {
    if (method === "GET") {
      return getAllUsers(req, res);
    } else if (method === "POST") {
      return createUser(req, res);
    }
  } else if (pathname.split("/").length === 3) {
    switch (method.toLowerCase()) {
      case "get":
        return getOneUser(req, res);
      case "put":
        return updateOneUser(req, res);
      case "patch":
        return patchOnUser(req, res);
      case "delete":
        return deleteOneUser(req, res);
      default:
        break;
    }
  }

  throw404(res);
}
