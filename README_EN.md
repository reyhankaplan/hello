# hello

Implementation of logistic regression on a friend suggestion system, 4th Assignment of Engineering Project

## Overview

A backend api:

Uses PostgreSQL database (A script to create the database is in the `files/` directory).

Fills the database with the data in the `files/` directory of this repo, with `npm run db:write` command.

Runs on `http://localhost:3000`.

Answers two type of get requests: 

The first one is `/person?name=<person_name>&id=<person_id>` sends people which contains the name in their name
or has given id.

The second is `/hello?id=<person_id>&iter=<iter_count>&step=<step_size>` sends friend suggestions and factor values
calculated using gradient descent for the person. The `iter` and `step` are optional.

Creates models and test sets for every `/hello?...` requests, calculates factors with gradient descent, predicts 
the top 10 possible-friends from the test set for the person with the id.

If we send request with id query value it has to be absolute id, but name can be every value contained in names.

## Client

[ryhnnl/mpaos](https://github.com/ryhnnl/mpaos), a client application written in React.js

## Installation

Git clone: 

`git clone git@github.com:ryhnnl/hello.git`

Cd into hello:

`cd hello`

Install packages:

`npm i`

## Run

To run the server:

`npm run start:dev`

## Database

Create database with help of given sql script in files/ dir
Edit .env file for your own database
Write data to database running this script:

`npm run write:db`

## About The Data

The data we are using has taken from students in our classroom. We have answered 15 questions about activities. 
For example, "How much do I like cinema?". The answers are the points we give for activities, values between 0 and 10. 
And the data includes 10 friends we have in the classroom.

The application tags our friends with 1 and the half of non-friends with 0 for data model. And the other half used
for testing the data model.

