const { parse } = require("url");

function writeJson(res, json, statusCode = 200) {
  res.writeHead(statusCode, { "Content-Type": "aplication/json" });
  res.end(JSON.stringify(json));
}

function readRequestData(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let result;
      try {
        result = JSON.parse(data);
      } catch (e) {
        result = data;
      } finally {
        resolve(result);
      }
    });
  });
}

function getIdFromUrl(url) {
    const {pathname} = parse(url);
    return +pathname.split("/").pop();
}

module.exports = { writeJson, readRequestData, getIdFromUrl };
