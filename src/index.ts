import app from "./app";
// import "./fucc";

app.listen(8080, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
