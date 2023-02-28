const http = require('http');
require('dotenv').config();

const app = require('./app/app');
require('./config/dbConnect');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, console.log(`Server is running on port: ${PORT}`));