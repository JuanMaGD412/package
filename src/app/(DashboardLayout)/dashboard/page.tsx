import React from "react";
import SalesProfit from "../../components/dashboard/RevenueForecast";
import ProductRevenue from "../../components/dashboard/ProductRevenue";
import DailyActivity from "../../components/dashboard/DailyActivity";
import Link from "next/link";

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-8 col-span-12">
          <SalesProfit />
        </div>
        <div className="lg:col-span-4 col-span-12 flex flex-col h-full">
        <div className="bg-white p-4 rounded-xl shadow h-full overflow-y-auto">
          <DailyActivity />
        </div>

        </div>
        <div className="col-span-12">
          <ProductRevenue />
        </div>

        <div className="col-span-12 text-center">
          <p className="text-base">
            Design and Developed by{" "}
            <Link
              href="https://prosecto.com.co/"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
              Prosecto 
            </Link>
             <a> & </a>
            <Link
              href="https://store.goldbots.com/?srsltid=AfmBOopY5YnUn0Ucm3qJxgpgl15onH27A0cWMOxVDIF83mrHpQWFPOKs"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
            GoldBots
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
