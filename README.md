# api-cookbook
API for cookbook.gg

# Setting up .env
You will need to create a .env file in the root of the project
```
FIREBASE_PROJECT_ID = "DEV_FIREBASE_PROJECT_ID"
FIREBASE_PRIVATE_KEY = "DEV_FIREBASE_PRIVATE_KEY"
FIREBASE_CLIENT_EMAIL = "DEV_FIREBASE_CLIENT_EMAIL"
DISCORD_ID = "DISCORD_ID"
DISCORD_SECRET = "DISCORD_SECRET"
PORT = "8080"
CORS = "localhost"
MONGO_URL = "mongodb://localhost:27017/cookbook"
MIGRATE_dbConnectionUri= "mongodb://localhost:27017/cookbook"
```

# Setting up Mongo

You will need to include some seed data for your mongodb.

## Game
insert into your local `games` collection
```javascript
{
    "name" : "melee",
    "display_name" : "Super Smash Bros. Melee"
}
```

## Character
*this isnt being used yet*

insert into your local `characters` collection 
```javascript
{
    "name" : "falcon",
    "display_name" : "Captain Falcon",
    "game" : ObjectId(GAME_OBJECT_ID)
}
```

## Cookbook
insert into your local `cookbooks` collection
```javascript
{
    "streams" : [ 
        TWITCH_STREAMERS
    ],
    "name" : "falcon",
    "subdomain" : "falcon",
    "game" : ObjectId(GAME_OBJECT_ID),
    "character" : "falcon",
    "roles" : {
        YOUR_FIREBASE_UID : "admin"
    }
}
```
