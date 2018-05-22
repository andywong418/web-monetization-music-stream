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
const monetizer = new ExpressWebMonetization({maxBalance: 1000});
const cookieParser = require("cookie-parser");
const path = require("path");
const serveIndex = require("serve-index");
const stream = require('stream');
const Throttle = require('throttle');
const mp3Duration = require('mp3-duration');
const plugin = require('ilp-plugin')();
const SPSP = require('ilp-protocol-spsp');
const axios = require('axios');

const EXPRESS_WEB_MONETIZATION_CLIENT_PATH =
  "/node_modules/express-web-monetization/client.js";
const WEB_SERVER_PORT = 8080;
const FREE_BYTES = 50000;

// Later when user uploads a song, there will be an audio fingerprint matching system where we check for the same fingerprint in our DB.
// If no match then we will query GraceNote API. and store that fingerprint? In that case we should always just query GraceNote API.
// Licenses database will also have the fingerprint to identify payment pointers

// This is just so we can make the correct API call.
const mockDB = {
  "chico_mono.mp3": 1,
  "Natsusemi - Asian Kung Fu-Generation.mp3": 2,
  "Marvin Gaye-Sexual Healing (Sashka 2k17 remix).mp3": 3,
}

app.use(
  "/scripts/monetization-client.js",
  express.static(__dirname + EXPRESS_WEB_MONETIZATION_CLIENT_PATH)
);

app.use("/public", express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(WebMonetizationMiddleware(monetizer));
// This is the SPSP endpoint that lets you receive ILP payments.  Money that
// comes in is associated with the :id
router.get(monetizer.receiverEndpointUrl, monetizer.receive.bind(monetizer));
app.use("/", router);



// This endpoint charges 100 units to the user with :id
// If awaitBalance is set to true, the call will stay open until the balance is sufficient. This is convenient
// for making sure that the call doesn't immediately fail when called on startup.

// If we choose to publish the web app, this is where we would serve it
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });

app.use(express.static(__dirname + "/"));
app.use("/playlist", serveIndex(__dirname + "/music"));
app.get('/duration', (req, res) => {
  const { id } = req.query;
  const file = __dirname + "/music/" + id;
  mp3Duration(file, (err, duration) => {
    if(err) return console.log(err.message);
    res.send({ duration });
  })
})


// TODO: add monetizer here
app.get("/music", async (req, res) => {
  const { id } = req.query;
  const file = __dirname + "/music/" + id;
  const licenseName = id.substr(0, id.lastIndexOf(".")) + ".json";
  //Ping other server running on serving license files.
  const fetchUrl = "http://localhost:5000/license/"
  let licenseObj = await axios.get(fetchUrl + mockDB[id]);
  licenseObj = licenseObj.data;
  fs.exists(file, async exists => {
    if (exists) {
      const rstream = fs.createReadStream(file);
      let cost = 100;
      console.log('connecting plugin');
      await plugin.connect();
      // Decrease chunksize as song progresses.
      var throttle = new Throttle({bps: cost * 500, chunkSize: cost * 500});
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
            SPSP.pay(plugin, {
              receiver: licenseObj.paymentPointer,
              sourceAmount: '' + cost
            });
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
