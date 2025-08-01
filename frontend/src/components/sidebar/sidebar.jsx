"use client"

import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import {
	LayoutDashboard,
	Droplet,
	ShieldAlert,
	Handshake,
	Users,
	LogOut,
	FileText,
	CreditCard,
} from "lucide-react"

export default function Sidebar() {
	const [collapseShow, setCollapseShow] = React.useState("hidden")
	const location = useLocation()
	const navigate = useNavigate()
	const { auth, logout } = useAuth()

	const isActiveLink = (href) => {
		return location.pathname === href || location.pathname.startsWith(href + "/")
	}

	const isDonor = auth?.role === "donor"

	const menuItems = isDonor
		? [
			{ label: "Dashboard", path: "/admin", icon: LayoutDashboard },
			{ label: "Donate Blood", path: "/admin/donate-blood", icon: Droplet },
			{ label: "Need Blood", path: "/admin/need-blood", icon: ShieldAlert },
			{ label: "Donation History", path: "/admin/donations", icon: FileText },
			{ label: "Issues", path: "/admin/issues", icon: ShieldAlert },
			{ label: "Feedback", path: "/admin/feedback", icon: Handshake },
		]
		: [
			{ label: "Dashboard", path: "/admin", icon: LayoutDashboard },
			{ label: "Donate Blood", path: "/admin/donate-blood", icon: Droplet },
			{ label: "Need Blood", path: "/admin/need-blood", icon: ShieldAlert },
			{ label: "Camps", path: "/admin/camp", icon: CreditCard },
			{ label: "User Management", path: "/admin/user-management", icon: Users },
			{ label: "Issues", path: "/admin/issues", icon: ShieldAlert },
			{ label: "Feedback", path: "/admin/feedback", icon: Handshake },
		]

	const handleLogout = () => {
		logout()
		navigate("/login")
	}

	return (
		<nav className="relative z-10 flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-xl md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden md:w-64">
			<div className="flex flex-wrap items-center justify-between w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-nowrap">
				{/* Collapse Button (Mobile) */}
				<button
					className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
					type="button"
					onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
				>
					<i className="fas fa-bars"></i>
				</button>

				{/* Logo */}
				<Link
					className="inline-block p-4 px-0 mr-0 text-sm font-bold text-left uppercase md:block md:pb-2 text-slate-600 whitespace-nowrap"
					to="/"
				>
					<img src="/logo.png" alt="BloodBridge Logo" width="80%" />
				</Link>

				{/* Sidebar Menu */}
				<div
					className={
						"md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
						collapseShow
					}
				>
					{/* Mobile Only Header */}
					<div className="block pb-4 mb-4 border-b border-solid md:min-w-full md:hidden border-slate-200">
						<div className="flex flex-wrap">
							<div className="w-6/12">
								<Link
									className="inline-block p-4 px-0 mr-0 text-sm font-bold text-left uppercase md:block md:pb-2 text-slate-600 whitespace-nowrap"
									to="/"
								>
									BloodBridge
								</Link>
							</div>
							<div className="flex justify-end w-6/12">
								<button
									type="button"
									className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
									onClick={() => setCollapseShow("hidden")}
								>
									<i className="fas fa-times"></i>
								</button>
							</div>
						</div>
					</div>

					{/* Menu Items */}
					<ul className="flex flex-col list-none md:flex-col md:min-w-full">
						{menuItems.map(({ label, path, icon: Icon }) => (
							<li className="items-center" key={path}>
								<Link
									className={
										"text-[16px] py-3 font-bold flex gap-2 items-center " +
										(isActiveLink(path)
											? "text-red-600 hover:text-red-800"
											: "text-slate-700 hover:text-slate-500")
									}
									to={path}
								>
									<Icon size={18} /> {label}
								</Link>
							</li>
						))}
					</ul>

					<hr className="my-4 md:min-w-full" />

					<ul className="flex flex-col list-none md:flex-col md:min-w-full md:mb-4">
						<li className="items-center">
							<Link
								className="text-slate-700 hover:text-slate-500 text-[16px] py-3 font-bold block"
								to="/"
							>
								Landing Page
							</Link>
						</li>
						<li className="items-center">
							<button
								className="text-slate-700 hover:text-slate-500 text-[16px] py-3 font-bold block w-full text-left"
								onClick={handleLogout}
							>
								<LogOut size={18} className="inline mr-2" />
								Log out
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}
