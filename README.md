# RESTfulBlogApp

Simple blog made with NodeJS - Express - Mongodb and Bootstrap4

# Installation

After cloning this repo , create a config.env file into the root directory and set these variables:

```
PORT=8080
DATABASE_LOCAL=mongodb://mongo:27017/restful_blog_app
SESSION_SECRET=your_secret_phrase
```

# Running application with Docker

From the root directory execute this command:

```
docker-compose up
```

It will create all the necessary services in order to run the application , served at http://localhost:8080
