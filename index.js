const express = require('express')
require("dotenv").config();
const app = express()
const dbConnection = require('./utils/dbConnection')
const cors = require('cors')
const http = require('http')
const mainRouter = require('./routes/index.routes')
const swaggerDocs = require('./utils/swagger')

const corsOptions = {
    origin: "*",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ limit: "32kb", extended: true }));
  app.use("/api", mainRouter);

  swaggerDocs(app)

const PORT = 5677;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

dbConnection.connectDb()
