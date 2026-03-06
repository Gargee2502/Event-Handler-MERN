const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(cors());                    // ← this line must exist
// or more explicit (better for production later):
app.use(cors({
  origin: "http://localhost:3000",  // allow only your frontend
  credentials: true                 // if you add cookies/auth later
}));
app.use(express.json());

/* ROUTES */
app.use("/api/events", eventRoutes);

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Server */
const PORT = process.env.PORT || 5000;

console.log("PORT from environment =", process.env.PORT);
console.log("Final chosen PORT =", PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});