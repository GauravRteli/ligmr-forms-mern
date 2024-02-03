import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Spin } from "antd";
import logo from "../assets/logo.png";
import { saveAs } from "file-saver";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  Container,
  Paper,
  TextField,
  FormControlLabel,
  FormControl,
  Button,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
  InputLabel,
} from "@mui/material";

import axios from "axios";
const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    city: "",
    userType: "",
    fatherOccupation: "",
    qualification: "",
    course: "",
    fundingSource: "",
    budget: "",
    intake: "",
    experience: "",
    englishProficiency: "",
    appliedForFranceBefore: "",
    destinationPreferences: [],
    careerFieldInterest: "",
    careerAspirations: "",
    admissionCounseling: "",
    cv: null,
    cvName: "",
  });

  const pdfUrl =
    "https://github.com/GauravRteli/ligmr-forms-mern/files/14152345/LIGMR_brochure.pdf";

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const [downloading, setDownloading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [source, setSource] = useState("");
  const [phoneNumber, setPhoneNumber] = useState({
    countryCode: "in",
    value: "",
    dailCode: "91",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    console.log(name);
    if (type === "file") {
      const file = event.target.files[0];
      console.log(file);

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Cover Letter must be less than 5 MB in size");
        return;
      }

      if (file && file.type === "application/pdf") {
        console.log(file.name);
        setFormData({
          ...formData,
          [name]: file,
          [name + "Name"]: file.name,
        });
        return;
      } else {
        toast.error("Please select a PDF file for cover letter.");
        return;
      }
    }
    // Handle checkbox separately
    if (type === "checkbox") {
      const updatedPreferences = checked
        ? [...formData.destinationPreferences, name]
        : formData.destinationPreferences.filter((pref) => pref !== name);
      setFormData({
        ...formData,
        destinationPreferences: updatedPreferences,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const createFormDataObject = (initialState) => {
    const fdx = new FormData();
    for (const [key, value] of Object.entries(initialState)) {
      fdx.append(key, value);
    }
    return fdx;
  };
  const handleDownload = () => {
    setDownloading(true);

    // Simulate download delay (replace with actual download logic)
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    if (formData.phoneNo.length < 5) {
      toast.error("Please Enter phone valid number.");
      return;
    }
    if (formData.cv.size > 5 * 1024 * 1024) {
      toast.error("Cover Letter must be less than 5 MB in size");
      return;
    }
    if (formData.destinationPreferences.length === 0) {
      toast.error("At least one destination must be selected");
      return; // Prevent further processing if validation fails
    }

    const resultString = formData.destinationPreferences.join(",");
    console.log(resultString);
    const formDataObject = createFormDataObject({
      ...formData,
      destinationPreferences: resultString,
    });
    setLoading(true);

    const { data } = await axios.post(
      // "https://inquiry.egnioldigital.com/api/forms/applyForm",
      "http://localhost:5001/api/forms/applyForm",
      formDataObject
    );
    if (data.success) {
      await addUserActivity("submitted");
      toast.success("Form submitted successfully");
      setFormData({
        name: "",
        email: "",
        phoneNo: "",
        city: "",
        userType: "",
        fatherOccupation: "",
        qualification: "",
        course: "",
        fundingSource: "",
        budget: "",
        intake: "",
        experience: "",
        englishProficiency: "",
        appliedForFranceBefore: "",
        destinationPreferences: [],
        careerFieldInterest: "",
        careerAspirations: "",
        admissionCounseling: "",
      });
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Function to get the query parameter from the URL
    const getQueryParam = async (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };

    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const ip = response.data.ip;
        setIpAddress(ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    // Fetch source from the URL
    const fetchSourceFromUrl = async () => {
      const srcFromUrl = await getQueryParam("src");
      setSource(srcFromUrl || "default"); // Use 'default' if src parameter is not present
    };

    fetchIpAddress();
    fetchSourceFromUrl();
  }, []);

  const addUserActivity = async (request_type) => {
    await axios.post(
      `https://inquiry.egnioldigital.com/api/userAct/addActivity`,
      {
        ipAddress,
        source,
        request_type,
      }
    );
  };

  useEffect(() => {
    addUserActivity("normal");
  }, [ipAddress !== "" && source !== ""]);

  return (
    <div className="items-center justify-center">
      <Container maxWidth="md" className="m-3  ">
        <Toaster />
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            marginTop: "20px",
          }}
          className="shadow-lg"
        >
          <h1 className="font-semibold text-3xl text-orange-500 text-center m-5">
            Application Form
          </h1>
          <form handleSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 items-center">
                <TextField
                  label="Your Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="mt-2">
                  <PhoneInput
                    label="Phone Number"
                    name="phoneNo"
                    country={phoneNumber?.countryCode}
                    value={formData.phoneNo}
                    margin="normal"
                    onChange={async (value, formattedValue) => {
                      setPhoneNumber({
                        countryCode: formattedValue.countryCode,
                        value: value,
                        dailCode: formattedValue.dialCode,
                      });
                      setFormData({
                        ...formData,
                        phoneNo: value,
                      });
                    }}
                    inputProps={{
                      className:
                        "h-15 w-full pl-11 pt-3.5 pb-4 bg-transparent rounded items-center",
                      style: { border: "1px solid #ccc" },
                      placeholder: "Mobile Number",
                    }}
                    InputProps={{
                      style: {
                        border: "none",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 ">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="City"
                  name="city"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="userType">You are *</InputLabel>
                <Select
                  label="You are *"
                  value={formData.userType}
                  onChange={handleChange}
                  inputProps={{
                    name: "userType",
                    id: "userType",
                  }}
                  required
                >
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="fatherOccupation">
                  Father Occupation *
                </InputLabel>
                <Select
                  label="Father Occupation *"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  inputProps={{
                    name: "fatherOccupation",
                    id: "fatherOccupation",
                  }}
                  required
                >
                  <MenuItem value="Self employed">Self employed</MenuItem>
                  <MenuItem value="Salaried">Salaried</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Govt. Job">Govt. Job</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="qualification">
                  Highest Qualification *
                </InputLabel>
                <Select
                  label="Highest Qualification *"
                  value={formData.qualification}
                  onChange={handleChange}
                  inputProps={{
                    name: "qualification",
                    id: "qualification",
                  }}
                  required
                >
                  <MenuItem value="12th Pass">12th Pass</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                  <MenuItem value="Graduate">Graduate</MenuItem>
                  <MenuItem value="Post-Graduate">Post-Graduate</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="course">Course *</InputLabel>
                <Select
                  label="Course *"
                  value={formData.course}
                  onChange={handleChange}
                  inputProps={{
                    name: "course",
                    id: "course",
                  }}
                  required
                >
                  <MenuItem value="BBA">BBA</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="fundingSource">
                  Funding Source of Education *
                </InputLabel>
                <Select
                  label="Funding Source of Education *"
                  value={formData.fundingSource}
                  onChange={handleChange}
                  inputProps={{
                    name: "fundingSource",
                    id: "fundingSource",
                  }}
                  required
                >
                  <MenuItem value="Self-funded">Self-funded</MenuItem>
                  <MenuItem value="Loan">Loan</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="budget">Budget *</InputLabel>
                <Select
                  label="Budget *"
                  value={formData.budget}
                  onChange={handleChange}
                  inputProps={{
                    name: "budget",
                    id: "budget",
                  }}
                  required
                >
                  <MenuItem value="7-10 Lakhs">7 Lakhs - 10 Lakhs</MenuItem>
                  <MenuItem value="10-15 Lakhs">10 Lakhs - 15 Lakhs</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="intake">Preferred Intake *</InputLabel>
                <Select
                  label="Preferred Intake *"
                  value={formData.intake}
                  onChange={handleChange}
                  inputProps={{
                    name: "intake",
                    id: "intake",
                  }}
                  required
                >
                  <MenuItem value="June 2024">June 2024 Intake</MenuItem>
                  <MenuItem value="September 2024">
                    September 2024 Intake
                  </MenuItem>
                  <MenuItem value="February 2025">
                    February 2025 Intake
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="experience">
                  No. Of Years of Experience *
                </InputLabel>
                <Select
                  label="No. Of Years of Experience *"
                  value={formData.experience}
                  onChange={handleChange}
                  inputProps={{
                    name: "experience",
                    id: "experience",
                  }}
                  required
                >
                  <MenuItem value="0-1 years">0-1 years</MenuItem>
                  <MenuItem value="1-3 years">1-3 years</MenuItem>
                  <MenuItem value="3-5 years">3-5 years</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="englishProficiency">
                  English Language Proficiency *
                </InputLabel>
                <Select
                  label="English Language Proficiency *"
                  value={formData.englishProficiency}
                  onChange={handleChange}
                  inputProps={{
                    name: "englishProficiency",
                    id: "englishProficiency",
                  }}
                  required
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="appliedForFranceBefore">
                  Have you ever applied for France before? *
                </InputLabel>
                <Select
                  label="Have you ever applied for France before? *"
                  value={formData.appliedForFranceBefore}
                  onChange={handleChange}
                  inputProps={{
                    name: "appliedForFranceBefore",
                    id: "appliedForFranceBefore",
                  }}
                  required
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl component="fieldset" fullWidth margin="normal">
                <label component="legend" className="font-semibold">
                  Study Destination Preferences in France *
                </label>
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-6">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Paris"
                          )}
                          onChange={handleChange}
                          name="Paris"
                        />
                      }
                      label="Paris"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Lyon"
                          )}
                          onChange={handleChange}
                          name="Lyon"
                        />
                      }
                      label="Lyon"
                      className="text-sm"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Angers"
                          )}
                          onChange={handleChange}
                          name="Angers"
                        />
                      }
                      label="Angers"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Bordeaux"
                          )}
                          onChange={handleChange}
                          name="Bordeaux"
                        />
                      }
                      label="Bordeaux"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Geneva"
                          )}
                          onChange={handleChange}
                          name="Geneva"
                        />
                      }
                      label="Geneva"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.destinationPreferences.includes(
                            "Other"
                          )}
                          onChange={handleChange}
                          name="Other"
                        />
                      }
                      label="Other"
                    />
                  </div>
                </div>
              </FormControl>
            </div>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="careerFieldInterest">
                  Career Field Interest *
                </InputLabel>
                <Select
                  label="Career Field Interest *"
                  value={formData.careerFieldInterest}
                  onChange={handleChange}
                  inputProps={{
                    name: "careerFieldInterest",
                    id: "careerFieldInterest",
                  }}
                  required
                >
                  <MenuItem value="Business/Management">
                    Business/Management
                  </MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="careerAspirations">
                  Career Aspirations Post-Study *
                </InputLabel>
                <Select
                  label="Career Aspirations Post-Study *"
                  value={formData.careerAspirations}
                  onChange={handleChange}
                  inputProps={{
                    name: "careerAspirations",
                    id: "careerAspirations",
                  }}
                  required
                >
                  <MenuItem value="In France">In France</MenuItem>
                  <MenuItem value="In my Home Country">
                    In my Home Country
                  </MenuItem>
                  <MenuItem value="In another European Country">
                    In another European Country
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="admissionCounseling">
                  Available for Admission Counselling Session *
                </InputLabel>
                <Select
                  label="Available for Admission Counselling Session *"
                  value={formData.admissionCounseling}
                  onChange={handleChange}
                  inputProps={{
                    name: "admissionCounseling",
                    id: "admissionCounseling",
                  }}
                  required
                >
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Tomorrow">Tomorrow</MenuItem>
                </Select>
              </FormControl>
              <div className="flex flex-col mx-auto w-full h-full">
                <label className="font-semibold text-sm">Cover Letter :</label>

                <div class="file-input border">
                  <input
                    type="file"
                    accept=".pdf"
                    name="cv"
                    className="-px-1"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={`px-2 py-1 mx-1 rounded-sm ${
                      formData.cvName
                        ? "bg-blue-900 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {formData.cv ? "File Selected" : "Choose File"}
                  </button>
                  <span className="label" data-js-label>
                    {formData.cv ? formData.cvName : "No file selected"}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px", padding: "10px" }}
              disabled={loading}
            >
              {/* Submit */}
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spin size="large" spinning={loading} />
                </div>
              ) : (
                "Apply Now"
              )}
            </Button>
          </form>

          <Spin spinning={downloading} size="default">
            <a
              href={pdfUrl}
              onClick={handleDownload}
              download="LIGMR-Brochure.pdf"
            >
              <h1 className="border-b  mt-5 text-center p-2 cursor-pointer bg-green-600 hover:bg-green-700  rounded-sm text-white ">
                DOWNLOAD BROCHURE
              </h1>
            </a>
          </Spin>
        </Paper>
      </Container>
    </div>
  );
};

export default FormComponent;
