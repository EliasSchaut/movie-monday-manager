# Movie Monday Manager
A full stack management application for voting movies for weekly movie events.

## Features
- Account-registration with email verification
- Users can vote, add and remove movies
- Users can manage own profile
- Clean and responsive Bootstrap-UI
- 100% useable without client (via REST-API)
- **(soon)** automatic management of voted movies around movie events
- **(soon)** automatic notifications for movie events with the list of interested users

## Installation
1. You need [node.js](https://nodejs.org/en/) installed (version 18.12.1 or newer).
2. Download the [newest version](https://github.com/EliasSchaut/Movie-Monday-Managerreleases) of the code
3. Rename the .env file from ```.env.tmp``` to ```.env```
4. Open the configuration file (now ```.env```) and set values.
5. In ```client``` folder: run ```npm install``` and ```npm run build```
6. In ```prisma``` folder: run prismas ```migrate``` command (e.g. ```npx prisma migrate dev --name init```)
7. In root folder: `npm install`.
8. Run the server with `npm start`.

## Dev-Docs & API-Docs
This documentation is still work in progress.
