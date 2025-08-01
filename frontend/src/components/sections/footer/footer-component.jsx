// import "./footer-styles.scss";

import { NavLink } from "react-router-dom";

const FooterComponent = () => {
	const exploreLinks = [
		{
			title: "Home",
			link: "/",
		},
		{
			title: "Donate Blood",
			link: "/donate-blood",
		},
		{
			title: "Request Blood",
			link: "/need-blood",
		},
		{
			title: "Donate Money",
			link: "https://donorbox.org/donate-money-11",
		},
		{
			title: "Host Blood Drive",
			link: "/host-blood-drive",
		},
		{
			title: "Contact",
			link: "/contact",
		},
		{
			title: "Admin Dashboard",
			link: "/admin",
		},
	];

	const contactLinks = [
		{
			title: "+977 986-2576249",
			link: "tel:+9779862576249",
		},
		{
			title: "help@bloodbridge.com",
			link: "mailto:help@bloodbridge.com",
		},
		{
			title: "Dillibajaar, Kathmandu, Nepal",
			link: "https://www.google.com/maps/place/Softwarica+College+of+IT+and+E-Commerce/@27.7089603,85.3261328,13z/data=!4m6!3m5!1s0x39eb190a74aa1f23:0x74ebef82ad0e5c15!8m2!3d27.7061384!4d85.3299792!16s%2Fg%2F12hvnfc2d?entry=ttu&g_ep=EgoyMDI1MDcyOS4wIKXMDSoASAFQAw%3D%3D",
		},
		{
			title: "Open 24/7",
			link: "/contact",
		},
	];

	return (
		<section className="footer two-cta-wrapper flex flex-col justify-center items-center w-full mx-auto my-0 px-2.5 pt-[70px] pb-[40px] bg-dark">
			<div className="two-cta-container relative w-[min(100%_-_15px,1250px)]  mx-auto my-0 p-2.5">
				<div className="first-section-wrapper grid sm:grid-cols-[1.5fr_1fr_1fr] gap-10">
					<div className="flex flex-col footer-col first-col">
						<h2 className="not-italic font-bold text-[40px] leading-[55px] text-white">
							Hemo<span className="text-[red]">Cell</span>
						</h2>
						<h3 className="not-italic font-normal text-[20px] leading-10 text-[#D9D9D9]">
							You don't have to be a doctor to save a life: Just
							donate blood
						</h3>
					</div>
					<div className="footer-col second-col">
						<h3 className="not-italic font-medium text-[16px] leading-[27px] tracking-[0.21em] uppercase text-[red] mb-3">
							Explore
						</h3>
						<ul className="flex flex-col gap-2">
							{exploreLinks.map((link, index) => (
								<li key={index}>
									<NavLink
										className="not-italic font-medium text-[18px] leading-[34px] text-[#D9D9D9]"
										to={link.link}
									>
										{link.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
					<div className="footer-col third-col">
						<h3 className="not-italic font-medium text-[16px] leading-[27px] tracking-[0.21em] uppercase text-[red] mb-3">
							Contact
						</h3>
						<ul className="flex flex-col gap-2">
							{contactLinks.map((link, index) => (
								<li key={index}>
									<NavLink
										className="not-italic font-medium text-[18px] leading-[34px] text-[#D9D9D9]"
										to={link.link}
									>
										{link.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="footer-col fourth-col text-center mt-10 border-t-[1px] border-off_white/[.2] pt-6">
					<h3 className="not-italic text-center font-regular text-[18px] leading-[34px] text-[#D9D9D9] ">
						©️ 2023 BloodBridge - Website design by{" "}
						<a
							href="https://linkedin.com/in/moazamdev"
							className="underline"
							target="_blank"
						>
							AlphaDev
						</a>
					</h3>
				</div>
			</div>
		</section>
	);
};

export default FooterComponent;
