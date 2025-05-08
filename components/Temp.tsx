"use client";
import { useContext, useState } from "react";
import { MonitorContext } from "../Context/MonitoringContext";

export default function Index() {
    const context = useContext(MonitorContext);
    console.log("Context value:", context);

  const [temp, setTemp] = useState("");

  if (!context) return <div>Loading or context not found</div>;

  const {
    // currentUser,
    // connectWallet,
    // createWebsite,
    // addTick,
    getAllWebsites,
    // deleteWebsite,
    // registerValidator,
    // getWebsite,
    // getRecentTicks,
    // getWebsiteTicks,
    // getMyWebsites,
    // myPendingPayout,
    // getMyPayouts
  } = context;


  const getWebsiteData = async () => {
    try {
      console.log("Fetching websites..."); 
      const getData = await getAllWebsites();
      console.log("Data fetched:", getData); 
      setTemp(getData);
    } catch (error) {
      console.error("Error fetching websites:", error); 
    }
  };
  

  return (
    <div>
      <button onClick={getWebsiteData} className="cursor-pointer">hi</button>
      {temp}
    </div>
  );
}
