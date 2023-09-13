import app from "./app";
// import "./fucc";

app.listen(8080);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
