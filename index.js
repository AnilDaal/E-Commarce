import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import customerRoute from "./routes/customerRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());

//mongoose
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/ecom", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("mongoose connect successfully");
  }
});

// routes
app.use("/customer", customerRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`E-Commarce App listening on port ${port}!`)
);
