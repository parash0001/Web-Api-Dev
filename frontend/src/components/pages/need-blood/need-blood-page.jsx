import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

import Axios from "axios";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";
import { Toaster } from "react-hot-toast";

const NeedBloodPage = () => {
	const [formData, setFormData] = useState({
  bloodType: "",
  quantity: "",
  urgency: "",
  phoneNumber: "",
  issueDescription: "",
  location: "",
});


	const handleSubmit = (e) => {
		  e.preventDefault();

  const token = sessionStorage.getItem("token"); 
  console.log(token)

  const payload = {
    bloodType: formData.bloodType,
    quantity: formData.quantity,
    urgency: formData.urgency,
    phoneNumber: formData.phoneNumber,
    issueDescription: formData.issueDescription,
    location: formData.location,
  };

  Axios.post("http://localhost:5000/api/requests/", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log("Blood request success:", response.data);
      newUsersInsertRequest(payload, "need-blood");

      setFormData({
        bloodType: "",
        quantity: "",
        urgency: "",
        phoneNumber: "",
        issueDescription: "",
        location: "",
      });
    })
    .catch((error) => {
      console.error("Error submitting request:", error.response?.data || error);
    });
	};

	const NeedBloodPageDetails = {
		quote: {
			classHint: "quote need-blood-quote",
			quoteText: `Facing a blood emergency?\n 
            Request a callback and let us help you!`,
			buttonText: "Call Now",
			buttonLink: "tel:+920304050607",
			buttonHave: true,
		},
		tips_for_managing_blood_loss: {
			subheadingText: "",
			headingText: "Tips for Managing Blood Loss",
			classHint: "tips-for-managing-blood-loss",
			paraText: [
				`Stay calm and avoid any strenuous activity.`,
				`Elevate the affected area if possible to reduce blood flow.`,
				`Apply pressure to the wound to slow down or stop the bleeding.`,
				`Drink fluids such as water or sports drinks to help replenish lost fluids.`,
				`Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
				`Consider taking iron supplements if recommended by your doctor.`,
				`Keep a record of any symptoms and changes in condition to share with medical professionals.`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Need blood?",
			headingText: "Your blood needs are our priority.",
			classHint: "hero need-blood-page-hero",
		},
		stepsText: {
			subheadingText: "Collecting Blood",
			headingText: "From start to finish, here's what to expect.",
		},
		bloodStock: {
			subheadingText: "When you need it",
			headingText: "Find Available Blood Stock",
			classHint: "search-blood-stock",
		},
	};

	const stepDetails = [
		{
			key: "registration",
			stepNumber: "01",
			stepName: "Registration",
			stepDescription:
				"You will be asked to fill out a form with your personal information and medical history.",
		},
		{
			key: "screening",
			stepNumber: "02",
			stepName: "Screening",
			stepDescription:
				"A medical professional will check your vitals and ask you a series of questions to ensure you are eligible to donate.",
		},
		{
			key: "donation",
			stepNumber: "03",
			stepName: "Donation",
			stepDescription:
				"A sterile needle will be inserted into your arm to collect your blood, which will then be stored and used for transfusions.",
		},
	];

	const fields = [
		{
			key: "name",
			name: "name",
			type: "text",
			placeholder: "Name",
			required: true,
		},
		{
			key: "email",
			name: "email",
			type: "email",
			placeholder: "Email",
			required: true,
		},
		{
			key: "phone",
			name: "phone",
			type: "tel",
			placeholder: "Phone",
			required: true,
		},
		{
			key: "bloodType",
			name: "bloodType",
			type: "text",
			placeholder: "Blood Type",
			required: false,
		},
	];

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...NeedBloodPageDetails.hero} />
			{/* <FormComponent
				fields={fields}
				heading={"Request for emergency blood"}
				buttonText={"Request blood"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
			/> */}
<section className="py-10 px-4 max-w-2xl mx-auto">
  <h2 className="text-2xl font-semibold mb-6 text-center">
    Request for Emergency Blood
  </h2>
  <form
   onSubmit={(e) => {
  e.preventDefault();

  const token = sessionStorage.getItem("token"); // ✅ Get token from sessionStorage

  const payload = {
    bloodType: formData.bloodType,
    quantity: formData.quantity,
    urgency: formData.urgency,
    phoneNumber: formData.phoneNumber,
    issueDescription: formData.issueDescription,
    location: formData.location,
  };

  Axios.post("http://localhost:5000/api/requests/", payload, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Attach Bearer token here
    },
  })
    .then((response) => {
      console.log("Blood request success:", response.data);
      newUsersInsertRequest(payload, "need-blood");

      setFormData({
        bloodType: "",
        quantity: "",
        urgency: "",
        phoneNumber: "",
        issueDescription: "",
        location: "",
      });
    })
    .catch((error) => {
      console.error("Error submitting request:", error.response?.data || error);
    });
}}

    className="space-y-6 bg-white p-6 rounded-md shadow-md"
  >
    {/* Blood Type */}
    <div>
      <label className="block mb-1 font-medium">Blood Type</label>
      <select
        value={formData.bloodType}
        onChange={(e) =>
          setFormData({ ...formData, bloodType: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Select Blood Type</option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Quantity */}
    <div>
      <label className="block mb-1 font-medium">Quantity (units)</label>
      <input
        type="number"
        value={formData.quantity}
        onChange={(e) =>
          setFormData({ ...formData, quantity: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter required units"
      />
    </div>

    {/* Urgency */}
    <div>
      <label className="block mb-1 font-medium">Urgency Level</label>
      <select
        value={formData.urgency}
        onChange={(e) =>
          setFormData({ ...formData, urgency: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Select Urgency</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    {/* Phone Number */}
    <div>
      <label className="block mb-1 font-medium">Phone Number</label>
      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) =>
          setFormData({ ...formData, phoneNumber: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter phone number"
      />
    </div>

    {/* Issue Description */}
    <div>
      <label className="block mb-1 font-medium">Issue Description</label>
      <textarea
        value={formData.issueDescription}
        onChange={(e) =>
          setFormData({ ...formData, issueDescription: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Describe your issue"
      />
    </div>

    {/* Location */}
    <div>
      <label className="block mb-1 font-medium">Location</label>
      <input
        type="text"
        value={formData.location}
        onChange={(e) =>
          setFormData({ ...formData, location: e.target.value })
        }
        required
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter your location"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
    >
      Request Blood
    </button>
  </form>
</section>

			
			<QuoteComponent {...NeedBloodPageDetails.quote} />
			<SearchBloodStockComponent {...NeedBloodPageDetails.bloodStock} />
			<ThreeStepProcessComponent
				stepsText={NeedBloodPageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<CriteriaComponent
				{...NeedBloodPageDetails.tips_for_managing_blood_loss}
			/>
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default NeedBloodPage;
