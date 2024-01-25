const mongoose = require("mongoose");
const { Schema } = mongoose;

const FormSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  city: { type: String, required: true },
  userType: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  qualification: { type: String, required: true },
  course: { type: String, required: true },
  fundingSource: { type: String, required: true },
  budget: { type: String, required: true },
  intake: { type: String, required: true },
  experience: { type: String, required: true },
  englishProficiency: { type: String, required: true },
  appliedForFranceBefore: { type: String, required: true },
  destinationPreferences: { type: [String], required: true },
  careerFieldInterest: { type: String, required: true },
  careerAspirations: { type: String, required: true },
  admissionCounseling: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Form = mongoose.model("forms", FormSchema);
module.exports = Form;
