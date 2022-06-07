# CatalogRepoBackend

Developed with NODE js, Express, MongoDB, and calls to the SpotifyAPI

100% test coverage within the Models folder if you do not include the API calls and database connection. Unable to build consistent tests with calls to the Spotify API.

Catalog Product Spec: https://docs.google.com/document/d/19jHN31FKUMMZ6EW8DFhTgSvYol8LVn-j9hdNSQfbLMQ/edit?usp=sharing

Updated Product Spec: https://docs.google.com/document/d/1ogO4qJQe5q4V0Pby3Te-ghBrWuaUdyLSyqtJD5cvtKU/edit

## Getting Started

If you want to be able to replicate this project, then the instructions below should help.

Front-end: https://github.com/catalogTeam/CatalogRepoFE

Back-end: https://github.com/colewarner24/CatalogRepoBackend

To run this locally, all you need to do is download both repositories and run them individually.

Locally, the Front-end runs on port 3000, and the Back-end runs on port 5000.

Front-end command script

```md
npm start
```

Back-end command script

```md
npm run dev
```

## Setting Up Backend Environmental Variables

Environmental Variables used:

MONGODB_URI= (A mongoDB URL for a connection ot the Database)

CLIENT_ID= A User spotify Client ID to connect to the spotify API

CLIENT_SECRET= A User spotify Client Secret to connect to the spotify API

TOKEN_SECRET = (A Token secret for the authentication of a password system. Could just be a randomly hashed number)

## Installing Packages Used

Use command

We used a ton of packages, so best way to install it is to just use the command

```md
npm install
```

On the terminal
