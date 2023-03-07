# School Management System
*  This project is the backend part of a web application designed to manage the activities of a school. The application is built using Node.js, Express, and Mongoose. The School Management System provides various features such as:
     * student registration 
     * course management
     * attendance management
     * grading
     * report generation
* The backend of the application is responsible for handling data storage and retrieval from the database. It provides APIs for the frontend to interact with the database and perform various operations like creating, updating, deleting, and retrieving data.
* The application is built using the RESTful architecture, which ensures that the APIs are consistent, scalable, and maintainable. The application is designed with proper authentication and authorization mechanisms in place to ensure the security of the data.
* The data is stored in a MongoDB database using the Mongoose ODM. The database schema is designed to ensure data consistency and maintain data integrity. The application also includes data validation and error handling to ensure that the data is accurate and error-free.
* The application includes various middleware functions that handle authentication, authorization, and error handling


## Steps to Setup

## 1. Clone the application
```bash
git clone https://github.com/tmarko99/school-management-system.git
```

## 2. Getting Started
Go to the root folder and install the backend dependencies by using the command-
```bash
npm install
```

## 3. ENV Variables
Create a .env file in the root and add the following
```bash
PORT=3000
MONGO_URL="Your mongo url"
JWT_SECRET_KEY="Anything you like"
```

## 4. Running
```bash
Go to the root folder
npm start
```
