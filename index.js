import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import customerRoute from "./routes/customerRoute.js";
import publicRoute from "./routes/publicRoute.js";
import sellerRoute from "./routes/sellersRoute.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
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

// routes
app.use("/customer", customerRoute);
app.use("/public", publicRoute);
app.use("/seller", sellerRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => {
  console.log(`E-Commarce App listening on port ${port}!`);
});
