const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const router = require(path.join(__dirname, "routes", "index.js"));

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require(path.join(
    __dirname,
    "swagger",
    "swagger_output.json"
));

const env = process.env.NODE_ENV || "local_development";
const config = require(path.join(__dirname, "config", "config.json"))[env];
const conn = require(path.join(__dirname, "db", "conn.js"));

// config json response
app.use(express.json());

// solve CORS
app.use(
    cors({
        credentials: true,
        origin: `http://${config["host"]}:${config["port"]}`,
    })
);

// public folder for images
app.use(express.static("public"));

// Routes
app.use(router);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

conn.sync()
    // .sync({force: true})
    .then(() =>
        app.listen(config["port"], () => {
            console.log(
                `Server is running!\nAPI documentation: http://${config["host"]}:${config["port"]}/doc`
            );
        })
    )
    .catch((err) => console.log(err));
