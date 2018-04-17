# soundClone
## MVP music player and server

## How to make it "go"
* clone this repo
* `cd client`, then `npm` or `yarn` install
* `cd ../server`, then `npm` or `yarn` install
* Add any music you would like to serve into `/server/music` (these files will be dynamically exposed to client)
* Start server from /server dir `npm start` which defaults to `localhost:8080`
* Start client from /client dir `npm start` which runs a react app from `localhost:3000`, and proxies all calls to `localhost:8080`

This is not a secure application. It is only a proof of concept!

Credit to [Haroun Serang](https://github.com/hserang) for the music jukebox!
