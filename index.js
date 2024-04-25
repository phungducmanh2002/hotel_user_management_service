const app = require("./app");
const http = require("http");
const { GetEnvValueByKey } = require("./src/projectUtils");

const server = http.createServer(app);
const PORT = GetEnvValueByKey("PORT") || 5000;

server.listen(PORT, () => {
  console.log(
    `Project Enviroment: ${GetEnvValueByKey(
      "PROJECT_ENVIROMENT"
    )} \nServer started on port: ${PORT}`
  );
});
