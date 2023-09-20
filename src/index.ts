import app from "./app";

app.listen(8080, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
