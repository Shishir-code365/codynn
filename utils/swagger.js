const swaggerJSDoc = require ("swagger-jsdoc");
const swaggerUi = require ("swagger-ui-express");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Resources API",
            version: "1.0.0",
            description: "API documentation for the Resources"
            
        },
        servers: [
            {
                url: "http://localhost:5677"
            }
        ]
    },
    apis: [path.resolve(__dirname, "../routes/*.js"), path.resolve(__dirname, "../controllers/*.js")]
};


const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = (swaggerDocs);