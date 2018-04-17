"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const server = require("http").Server(app);
const router = express.Router();
const {
  WebMonetizationMiddleware,
  ExpressWebMonetization
} = require("express-web-monetization");
const monetizer = new ExpressWebMonetization();
const cookieParser = require("cookie-parser");
const path = require("path");
const serveIndex = require("serve-index");
const stream = require('stream');

const Throttle = require('throttle');
const EXPRESS_WEB_MONETIZATION_CLIENT_PATH =
  "/node_modules/express-web-monetization/client.js";
const WEB_SERVER_PORT = 8080;
const FREE_BYTES = 150000;

app.use(
  "/scripts/monetization-client.js",
  express.static(__dirname + EXPRESS_WEB_MONETIZATION_CLIENT_PATH)
);

app.use("/public", express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(WebMonetizationMiddleware(monetizer));

app.use("/", router);

// This is the SPSP endpoint that lets you receive ILP payments.  Money that
// comes in is associated with the :id
router.get(monetizer.receiverEndpointUrl, monetizer.receive.bind(monetizer));

// This endpoint charges 100 units to the user with :id
// If awaitBalance is set to true, the call will stay open until the balance is sufficient. This is convenient
// for making sure that the call doesn't immediately fail when called on startup.
router.get("/content/", async (req, res) => {
  await req.awaitBalance(100);

  req.spend(100);
  // load content
});

// If we choose to publish the web app, this is where we would serve it
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });

app.use(express.static(__dirname + "/"));
app.use("/playlist", serveIndex(__dirname + "/music"));

// TODO: add monetizer here
app.get("/music", (req, res) => {
  const { id } = req.query;
  const file = __dirname + "/music/" + id;

  fs.exists(file, exists => {
    if (exists) {
      const rstream = fs.createReadStream(file);
      let cost = 100;
      var throttle = new Throttle({bps: 60000, chunkSize: 60000});
      function createParser () {
        const transform = new stream.Transform({
          writableObjectMode: true,
          async transform (chunk, encoding, cb) {

            if(rstream.bytesRead < FREE_BYTES) {
              console.log('giving free bytes. total=' + rstream.bytesRead);
              cb(null, chunk);
              return;
            }
            console.log("chunk length", chunk.length);
            await req.awaitBalance(cost);
            req.spend(cost);
            cb(null, chunk);

          }
        });
        return transform
      }

      rstream.on('error', e => console.error(e))
      rstream.pipe(throttle).pipe(createParser()).pipe(res);
    } else {
      res.send("Its a 404");
      res.end();
    }
  });
});

server.listen(WEB_SERVER_PORT, () => {
  console.log("App listening on port " + WEB_SERVER_PORT);
});
