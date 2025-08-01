import { useState, useEffect } from "react";
import Axios from "axios";

import HeaderComponent from "../../sections/header/header-component";
import HeroComponent from "../../sections/hero/hero-component";
import FormComponent from "../../sections/form/form-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";


const DonateBloodPage = () => {
  const [formData, setFormData] = useState({
    userId: sessionStorage.getItem("userId") || "",
    bloodType: "",
    units: "",
    location: "",
    phone: "",
  });

  const [campLocations, setCampLocations] = useState([]);

  useEffect(() => {
    const fetchCampLocations = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await Axios.get("http://localhost:5000/api/camps/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          const locations = response.data.data.map((camp) => camp.location);
          const uniqueLocations = [...new Set(locations)];
          setCampLocations(uniqueLocations);
        }
      } catch (error) {
        console.error("Failed to fetch camp locations:", error);
      }
    };

    fetchCampLocations();
  }, []);
  const handleSubmit = async (e) => {
  e.preventDefault();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token"); // ✅ Get token here

  const fullLocation = `${formData.location}, ${formData.phone}`;

  try {
    const response = await Axios.post(
      "http://localhost:5000/api/donations",
      {
        userId,
        bloodType: formData.bloodType,
        units: formData.units,
        location: fullLocation,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include the token here
        },
      }
    );

    console.log("Donation response:", response.data);
    newUsersInsertRequest(formData, "donate-blood");
	alert("Donation request submitted successfully!");
    setFormData({
      bloodType: "",
      units: "",
      location: "",
      phone: "",
    });
  } catch (err) {
    console.error("Donation error:", err.response?.data || err.message);
  }
};


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userId = sessionStorage.getItem("userId");

//     // Combine location and phone
//     const fullLocation = `${formData.location}, ${formData.phone}`;

//     try {
//       const response = await Axios.post("http://localhost:5000/api/donations", {
//         userId,
//         bloodType: formData.bloodType,
//         units: formData.units,
//         location: fullLocation,
//         // phone: formData.phone,
//       });

//       console.log("Donation response:", response.data);
//       console.log("Donation submitted:", response.data);
//       newUsersInsertRequest(formData, "donate-blood");

//       setFormData({
//         bloodType: "",
//         units: "",
//         location: "",
//         phone: "",
//       });
//     } catch (err) {
//       console.error("Donation error:", err);
//     }
//   };

  const DonateBloodPageDetails = {
    hero: {
      subheadingText: "Donate Blood",
      headingText: "Save life by donating blood today",
      classHint: "donate-blood-page-hero",
    },
    stepsText: {
      subheadingText: "Donation Process",
      headingText: "Step-by-Step Guide to Donating Blood",
    },
    eligiblity_criteria: {
      subheadingText: "Are you ready?",
      headingText: "Eligibility Criteria",
      classHint: "side-col-image eligibility-criteria",
      paraText: [
        `18-50 years, above 50 Kg.`,
        `Normal temperature, pulse and blood pressure.`,
        `No Respiratory Diseases`,
        `Above 12.5 g/dL Hemoglobin`,
        `No skin disease, puncture or scars`,
        `No history of transmissible disease`,
      ],
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonHave: false,
    },
    why_donate_blood: {
      subheadingText: "Donate blood today",
      headingText: "Why should you donate blood?",
      classHint: "side-col-image why-donate-blood",
      paraText: `Donating blood is a selfless act...`,
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Donate Now",
      buttonLink: "/donate-blood",
      buttonHave: true,
    },
    quote: {
      classHint: "quote",
      quoteText: `“By donating money, you provide nourishment. By donating blood, you give the gift of life. Join us in this noble cause today!”`,
    },
  };

  const stepDetails = [
    {
      key: "check-eligibility",
      stepNumber: "01",
      stepName: "Check your eligibility",
      stepDescription:
        "Confirm you meet the eligibility requirements to donate blood...",
    },
    {
      key: "schedule-an-appointment",
      stepNumber: "02",
      stepName: "Schedule an appointment",
      stepDescription:
        "Schedule an appointment at a blood bank or blood drive near you.",
    },
    {
      key: "donate-blood",
      stepNumber: "03",
      stepName: "Donate Blood",
      stepDescription:
        "Arrive at the appointment, fill out a questionnaire, and donate blood.",
    },
  ];

  // Form fields
  const fields = [
    {
      key: "bloodType",
      name: "bloodType",
      type: "select",
      placeholder: "Select Blood Type",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    {
      key: "units",
      name: "units",
      type: "number",
      placeholder: "Enter number of units",
      required: true,
    },
    {
      key: "location",
      name: "location",
      type: "select",
      placeholder: "Select Camp Location",
      options: campLocations,
      required: true,
    },
    // Show phone field only if location is selected
    ...(formData.location
      ? [
          {
            key: "phone",
            name: "phone",
            type: "text",
            placeholder: "Enter Phone Number",
            required: true,
          },
        ]
      : []),
  ];

  return (
	<>
    <div style={{ backgroundColor: "#f3f4f6" }}>
      <HeaderComponent />
      <HeroComponent {...DonateBloodPageDetails.hero} />
      {/* <FormComponent
        fields={fields}
        heading={"Schedule an Appointment"}
        buttonText={"Schedule an Appointment"}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        inputClassName="bg-white"
      /> */}

      <section className="py-10 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Schedule an Appointment
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-md shadow-md"
        >
          {/* Blood Type Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Blood Type</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                Select Blood Type
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Units Input */}
          <div>
            <label className="block mb-1 font-medium">Number of Units</label>
            <input
              type="number"
              name="units"
              value={formData.units}
              onChange={(e) =>
                setFormData({ ...formData, units: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter number of units"
              required
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Camp Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                Select Camp Location
              </option>
              {campLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Field (only if location is selected) */}
          {formData.location && (
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Phone Number"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Schedule an Appointment
          </button>
        </form>
      </section>

      <ThreeStepProcessComponent
        stepsText={DonateBloodPageDetails.stepsText}
        stepDetails={stepDetails}
      />
      <CriteriaComponent {...DonateBloodPageDetails.eligiblity_criteria} />
      <SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} />
      <QuoteComponent {...DonateBloodPageDetails.quote} />
      <BeforeFooterCTA />
      <FooterComponent />
    </div>
	</>
  );
};

export default DonateBloodPage;
