import React from "react";

// components

// import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats({
	heading = "Welcome to BloodBank",
	subheading = "Admin Dashboard",
}) {
	return (
		<>
			{/* Header */}
			<div className=" bg-dark_red md:pt-32 pb-32 pt-12">
				<div className="px-4 md:px-10 mx-auto w-full">
					<div>
						{/* Card stats */}
						<h2 className="text-white font-bold text-[50px]">
							{heading}
						</h2>
						<h3 className="text-off_white tracking-[10px] font-medium text-[20px] uppercase">
							{subheading}
						</h3>
						<div className="flex flex-wrap">
							{/* <div className="w-full lg:w-6/12 xl:w-3/12 px-4"> */}
							{/* <CardStats
                                statSubtitle="TRAFFIC"
                                statTitle="350,897"
                                statArrow="up"
                                statPercent="3.48"
                                statPercentColor="text-emerald-500"
                                statDescripiron="Since last month"
                                statIconName="far fa-chart-bar"
                                statIconColor="bg-red-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                statSubtitle="NEW USERS"
                                statTitle="2,356"
                                statArrow="down"
                                statPercent="3.48"
                                statPercentColor="text-red-500"
                                statDescripiron="Since last week"
                                statIconName="fas fa-chart-pie"
                                statIconColor="bg-orange-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                statSubtitle="SALES"
                                statTitle="924"
                                statArrow="down"
                                statPercent="1.10"
                                statPercentColor="text-orange-500"
                                statDescripiron="Since yesterday"
                                statIconName="fas fa-users"
                                statIconColor="bg-pink-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                statSubtitle="PERFORMANCE"
                                statTitle="49,65%"
                                statArrow="up"
                                statPercent="12"
                                statPercentColor="text-emerald-500"
                                statDescripiron="Since last month"
                                statIconName="fas fa-percent"
                                statIconColor="bg-lightBlue-500"
                                />
                            </div> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
