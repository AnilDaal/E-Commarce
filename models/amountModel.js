import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/venu", () => {
  console.log("done...");
});

const Venue = mongoose.model(
  "Venue",
  new mongoose.Schema({ name: String, id: mongoose.ObjectId })
);

const addVenue = async (req, res) => {
  const data = await Venue.create({
    name: "anil",
  });
  res.json(data);
};
addVenue();
