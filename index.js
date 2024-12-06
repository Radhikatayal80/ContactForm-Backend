const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.log("MongoDB connection error:", err.message);
  });


const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  state: String,
  city: String,
  age: Number,
  gender: String,
  mobileNumber: String,
  message: String,
  selectedOption: String,
  selectedHobbies: [String],
  termsAccepted: Boolean,
});

const Form = mongoose.model("Form", formSchema);


app.post("/submit-form", async (req, res) => {
  try {
    console.log("Form data received:", req.body);
    const newForm = new Form(req.body);
    await newForm.save();
    res.status(200).json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.log("Error saving form data:", error.message);
    res.status(500).json({ message: "Error saving form data" });
  }
});


app.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching form data" });
  }
});


app.put("/update-form/:id", async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Form data updated successfully", updatedForm });
  } catch (error) {
    console.log("Error updating form data:", error.message);
    res.status(500).json({ message: "Error updating form data" });
  }
});


app.delete("/delete-form/:id", async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Form data deleted successfully", deletedForm });
  } catch (error) {
    console.log("Error deleting form data:", error.message);
    res.status(500).json({ message: "Error deleting form data" });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
