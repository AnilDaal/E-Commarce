import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import customerRoute from "./routes/customerRoute.js";
import publicRoute from "./routes/publicRoute.js";
import sellerRoute from "./routes/sellersRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(express.json());

//mongoose
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_DB, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("mongoose connect successfully");
  }
});

// customer routes
app.use("/customer", customerRoute);

// public routes
app.use("/public", publicRoute);

// sellers routes
app.use("/seller", sellerRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`E-Commarce App listening on port ${port}!`)
);
