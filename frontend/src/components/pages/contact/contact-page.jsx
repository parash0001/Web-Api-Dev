import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import FormComponent from "../../sections/form/form-component";
import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

import Axios from "axios";

import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";
import { Navigate } from "react-router-dom";

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		reason: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(formData);

		Axios.post("http://localhost:3001/create-need-help", {
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			reason: formData.reason,
			message: formData.message,
		})
			.then((response) => {
				console.log("success");
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});

		newUsersInsertRequest(formData, "need-help");

		setFormData({
			name: "",
			email: "",
			phone: "",
			reason: "",
			message: "",
		});
	};

	const ContactPageDetails = {
		hero: {
			subheadingText: "Got any Questions?",
			headingText: "Don't Know What to Do? Let Us Assist You.",
			classHint: "contact-page-hero",
		},
	};

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
			key: "reason",
			name: "reason",
			type: "text",
			placeholder: "Reason",
			required: false,
		},
	];

	const contactDetails = [
		{
			key: "phone",
			stepNumber: <FaPhoneAlt />,
			stepName: "Phone",
			stepDescription: "+977 986-2576249",
			stepUrl: "tel:+9779862576249",
		},
		{
			key: "email",
			stepNumber: <MdEmail />,
			stepName: "Email",
			stepDescription: "help@bloodbridge.com",
			stepUrl: "mailto:help@bloodbridge.com",
		},
		{
			key: "address",
			stepNumber: <FaMapMarkerAlt />,
			stepName: "Address",
			stepDescription: "Dillibajaar, Kathmandu, Nepal",
			stepUrl: "https://www.google.com/maps/place/Softwarica+College+of+IT+and+E-Commerce/@27.7089603,85.3261328,13z/data=!4m6!3m5!1s0x39eb190a74aa1f23:0x74ebef82ad0e5c15!8m2!3d27.7061384!4d85.3299792!16s%2Fg%2F12hvnfc2d?entry=ttu&g_ep=EgoyMDI1MDcyOS4wIKXMDSoASAFQAw%3D%3D",
		},
	];

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...ContactPageDetails.hero} />
			{/* <FormComponent
				fields={fields}
				heading={"We're to help"}
				buttonText={"Send Message"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
			/> */}

			<section className="py-10 px-4 max-w-2xl mx-auto">
  <h2 className="text-2xl font-semibold mb-6 text-center">We're here to help</h2>
  <form
    onSubmit={(e) => {
  e.preventDefault();
  const token = sessionStorage.getItem("token");

  const payload = {
    type: formData.type,
    subject: formData.subject,
    message: formData.message,
  };

  Axios.post("http://localhost:5000/api/feedbacks/", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      console.log("Feedback submitted:", res.data);
      alert(res.data.message); 

      newUsersInsertRequest(payload, "need-help");

      setFormData({
        type: "",
        subject: "",
        message: "",
      });
	  Navigate("/");
    })
    .catch((err) => {
      console.error("Error submitting feedback:", err.response?.data || err);
      alert(
        err.response?.data?.message || "Something went wrong. Please try again."
      ); // ✅ Show error message as alert
    });
}}

    className="space-y-6 bg-white p-6 rounded-md shadow-md"
  >
    {/* Type */}
    <div>
      <label className="block mb-1 font-medium">Type</label>
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Select Type</option>
        <option value="suggestion">Suggestion</option>
        <option value="issue">Issue</option>
        <option value="question">Question</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Subject */}
    <div>
      <label className="block mb-1 font-medium">Subject</label>
      <input
        type="text"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
        placeholder="Enter subject"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Message */}
    <div>
      <label className="block mb-1 font-medium">Message</label>
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
        placeholder="Enter your message"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
    >
      Send Message
    </button>
  </form>
</section>

			<ContactDetailsComponent contactDetails={contactDetails} />
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default ContactPage;
