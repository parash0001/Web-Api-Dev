import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";

import BlackLogo from "../../../../public/logo.png";
import WhiteLogo from "../../../../public/logo.png";

const compnayName = "BloodBridge Blood Bank";

const HeaderComponent = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [blurActivation, setBlurActivation] = useState(false);
	const [isActiveName, setIsActiveName] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const onScroll = () => {
			setBlurActivation(window.pageYOffset > 5);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

useEffect(() => {
  const checkAuth = () => {
    const name = localStorage.getItem("name");
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!name || !!token);
  };

  checkAuth();
}, []);
const handleLogout = () => {
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("expiresAt");
  setIsLoggedIn(false);
  navigate("/login");
};

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Host Blood Drive", href: "/host-blood-drive" },
		{ name: "Donate Money", href: "https://donorbox.org/donate-money-11" },
		{ name: "Help Needed", href: "/contact" },
	];

	if (isLoggedIn) {
		navigation.push(
			{ name: "Need Blood", href: "/need-blood", secondLast: true },
			{ name: "Donate Blood", href: "/donate-blood", last: true }
		);
	} else {
		navigation.push({
			name: "Login",
			href: "/login",
			isLogin: true,
		});
	}

	const reuseableClass = {
		for_last: `bg-red text-white hover:bg-white hover:text-dark`,
		for_second_last: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark`,
	};

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2] ${
				blurActivation ? "bg-dark/[.6] backdrop-blur-md" : ""
			}`}
		>
			<nav
				className="flex items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
				aria-label="Global"
			>
				<div className="flex lg:flex-1">
					<a href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">{compnayName}</span>
						<img className="w-auto h-10" src={WhiteLogo} alt="logo" />
					</a>
				</div>

				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="w-6 h-6" aria-hidden="true" />
					</button>
				</div>

				<div className="hidden lg:flex lg:gap-x-4">
					{navigation.map((item) => (
						<NavLink
							key={item.name}
							to={item.href}
							onClick={() => {
								setIsActiveName(item.name);
								setMobileMenuOpen(false);
							}}
							className={`text-sm font-medium leading-6 px-3 py-2 rounded-rsm transition-all duration-200 text-white hover:bg-white hover:text-dark ${
								item.secondLast && reuseableClass.for_second_last
							} ${item.last && reuseableClass.for_last} ${
								item.isLogin &&
								"border border-white text-white hover:bg-white hover:text-dark"
							} ${
								isActiveName === item.name ? "bg-white text-dark" : ""
							}`}
						>
							{item.name}
						</NavLink>
					))}
					{isLoggedIn && (
						<button
							onClick={handleLogout}
							className="text-sm font-medium leading-6 px-3 py-2 rounded-rsm border border-white text-white hover:bg-white hover:text-dark transition-all duration-200"
						>
							Logout
						</button>
					)}
				</div>
			</nav>

			<Dialog
				as="div"
				className="lg:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-50" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full px-6 py-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<a href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">{compnayName}</span>
							<img className="w-auto h-12" src={BlackLogo} alt="logo" />
						</a>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="w-6 h-6" aria-hidden="true" />
						</button>
					</div>
					<div className="flow-root mt-6">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="py-6 space-y-2">
								{navigation.map((item) => (
									<NavLink
										key={item.name}
										to={item.href}
										onClick={() => {
											setIsActiveName(item.name);
											setMobileMenuOpen(false);
										}}
										className={`block text-base font-semibold leading-7 px-3 py-2 rounded-lg text-gray-900 hover:bg-dark hover:text-white transition ${
											item.secondLast &&
											"border border-dark/[.5] rounded-rsm"
										} ${
											item.last &&
											"bg-red text-white hover:bg-white hover:text-dark"
										} ${
											item.isLogin &&
											"border border-dark text-dark hover:bg-dark hover:text-white"
										} ${
											isActiveName === item.name
												? "bg-dark text-white"
												: ""
										}`}
									>
										{item.name}
									</NavLink>
								))}
								{isLoggedIn && (
									<button
										onClick={handleLogout}
										className="block w-full text-left text-base font-semibold leading-7 px-3 py-2 rounded-lg border border-dark text-dark hover:bg-dark hover:text-white transition"
									>
										Logout
									</button>
								)}
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default HeaderComponent;
