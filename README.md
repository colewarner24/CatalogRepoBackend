![example workflow](https://github.com/catalogTeam/CatalogRepoFE/actions/workflows/node.js.yml/badge.svg)

# Catalog Repository Backend

Developed with NODE js, Express, MongoDB, and calls to the SpotifyAPI

100% test coverage within the Models folder if you do not include the API calls and database connection. Unable to build consistent tests with calls to the Spotify API.

Catalog Product Spec: https://docs.google.com/document/d/19jHN31FKUMMZ6EW8DFhTgSvYol8LVn-j9hdNSQfbLMQ/edit?usp=sharing

Updated Product Spec: https://docs.google.com/document/d/1ogO4qJQe5q4V0Pby3Te-ghBrWuaUdyLSyqtJD5cvtKU/edit

**_(based on requirements, scroll down to see the updated asepcts of the project)_**

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

```md
MONGODB_URI= (A mongoDB URL for a connection ot the Database)

CLIENT_ID= A User spotify Client ID to connect to the spotify API

CLIENT_SECRET= A User spotify Client Secret to connect to the spotify API

TOKEN_SECRET = (A Token secret for the authentication of a password system. Could just be a randomly hashed number)
```

## Setting Up Heroku Backend Environmental Variables

Due to the backend requiring environmental variables, that also means for deployment of the backend, Config Vars are required for heroku.

```md
CLIENT_ID= A User spotify Client ID to connect to the spotify API

CLIENT_SECRET= A User spotify Client Secret to connect to the spotify API

MONGODB_URI= (A mongoDB URL for a connection ot the Database)

TOKEN_SECRET = (A Token secret for the authentication of a password system. Could just be a randomly hashed number)

HEROKU_ENV_VAR = true
```

## Installing Packages Used

Use command

We used a ton of packages, so best way to install it is to just use the command

```md
npm install
```

On the terminal

## Continuous Integration / Deployment

We used heroku for our CI from this github repository. Connecting our CI requires editing our YML file and runnning the code below.

```md
npx prettier --write .
```

The CI requires prettier to be checked and ran before the continuing of our CI.

In the -> Github\workflow\node.js.yml

Edit the snippet below with your own heroku_app_name and heroku_email. (This is done by signing up on their website and obtaining the information after deploying a project)

```
with:
    heroku_api_key: ${{secrets.HEROKU_API_KEY}}
    heroku_app_name: "heroku_app_name" #Must be unique on Heroku
    heroku_email: "heroku_email" #Must be the one you used on Heroku
```
