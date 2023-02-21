import fs from "fs";
import mongoose from "mongoose";
import Customer from "../../models/customerModel.js";
import path from "path";
import { fileURLToPath } from "url";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/customer", () => {
  console.log("mongoose connect successfully");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonD = JSON.parse(
  fs.readFileSync(`${__dirname}/jsondata.json`, "utf-8")
);

const importData = async () => {
  await Customer.insertMany(jsonD);
  console.log("Data scuccess fully enter in the database");
  process.exit();
};
// console.log(process.argv);
if (process.argv[2] === "--import") {
  importData();
}
