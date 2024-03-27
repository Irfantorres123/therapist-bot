# therapist-bot
Bot that gives therapy and dating advice 

To set this up, follow these steps,

**Install docker:**

https://docs.docker.com/desktop/install/windows-install/

To spin up the docker container, simply run

```
docker-compose build
docker-compose up
```

Before making any pull requests, run the above commands and test if the app runs properly by going to http://localhost

If that works, you can stop all the containers by running 

```
docker-compose down
```

Now during development, it's too slow to run the app that way every time, therefore, follow these steps.

# Setting up the development environment 

## 1. Start up the database service alone in docker by running

  ```
  docker-compose up mongo
  ```
  
  This will output all the logs from mongo in the terminal every time it's started up. If you wish to avoid that, then use the -d flag
  
  ```
  docker-compose up -d mongo
  ```


## 2. Start the react development server 

Run:

  ```
  cd client
  npm start
  ```

To view the test app go to http://localhost:3000 which will automatically open up when you start the react development server.

## 3. Start the backend express server 

Check if there is a .env file in the server directory, the contents of which will be shared with you privately.

  ```
  cd server
  npm start
  ```


Testing documentation coming soon...
