const fs = require("fs");
const path = require("path");
const merry = require("merry");
const getItems = require("./utils/store.js");

const app = merry();
const indexHtml = fs.readFileSync("./index.html", { encoding: "UTF-8" });

app.route("GET", "/api/items", async (request, response, context) => {
  try {
    const items = await getItems();
    context.send(200, { items, lastUpdated: new Date() });
    return;
  } catch (error) {
    context.send(418, { i: "am a teapot!", error });
  }
});

app.route("default", (request, _response, context) => {
  if (request.url.includes(".css")) {
    const pathToCss = path.join(__dirname, request.url);
    fs.readFile(pathToCss, { encoding: "UTF-8" }, (error, data) => {
      if (error) {
        context.send(418, { error });
      }

      context.send(200, data, { "Content-Type": "text/css" });
    });
    return;
  }

  if (request.url.includes(".js")) {
    const pathToJs = path.join(__dirname, request.url);
    fs.readFile(pathToJs, { encoding: "UTF-8" }, (error, data) => {
      if (error) {
        context.send(418, { error });
      }

      context.send(200, data, { "Content-Type": "text/javascript" });
    });
    return;
  }

  context.send(200, indexHtml, { "Content-Type": "text/html" });
});

app.listen(Number.parseInt(process.env.PORT, 10) || 8080);
