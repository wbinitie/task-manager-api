const express = require("express");
require("./db/mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   res.status(503).send("Server is currently under maintenance");
// });

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log(`Server has started on ${port}`);
});
