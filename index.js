const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./module/replaceTemplate");

/////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //const pathName = req.url;
  // overview page
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("%PRODUCT_CARDS%", cardHtml);
    //console.log(output);
    res.end(output);
  }
  // product page
  else if (pathname == "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    //res.end(tempProduct);
    res.end(output);
  }
  // api page
  else if (pathname == "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  }
  // page not found
  else {
    res.writeHead(404, {
      "Content-Type": "Text/Html",
      "my-owner-heat": "Hello",
    });
    res.end("<h1>page not found.</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening the request on port 8000");
});
