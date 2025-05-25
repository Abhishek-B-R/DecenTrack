/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useContext, useState } from "react";
import { MonitorContext } from "@/Context/MonitoringContext";
import {ethers} from 'ethers'

export default function Index() {
  const context = useContext(MonitorContext);
  console.log("Context value:", context);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [temp, setTemp] = useState<any>();

  if (!context) return <div>Loading or context not found</div>;

  const {
    // currentUser,
    // connectWallet,
    createWebsite,
    addTick,
    addMultipleTicks,
    getAllWebsites,
    deleteWebsite,
    registerValidator,
    isValidatorAuthenticated,
    getValidator,
    getWebsite,
    getRecentTicks,
    getWebsiteTicks,
    getMyWebsites,
    myPendingPayout,
    getMyPayouts,
    addWebsiteBalance,
    getWebsiteBalance,
  } = context;


  const getWebsiteData = async () => {
    try {
      // const getData = await createWebsite('www.abhi.wtf','abhishekbr989@gmail.com');
      // const [websiteIds, websiteDetails] = await getAllWebsites();
      // const getData = await addTick('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912',0,120);// add actual id
      // const getData = await deleteWebsite('0x74628cdf52d26fbbf840703d92bcaece0df674718a6d57b0950a503de10adf47');
      // const getData = await registerValidator('0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De','hubli');
      // const getData = await isValidatorAuthenticated('0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De');
      // const getData = await getValidator('0x1aB98C06b3FaB72a124E34d39aaCfe7F5a6094De');
      // const getData = await getWebsite('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912');// add actual id
      // const getData = await getMyWebsites();
      // const getData = await getRecentTicks('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912',5)
      // const getData = await getWebsiteTicks('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912')
      // const getData = await myPendingPayout()
      // const getData = await getMyPayouts()
      // const getData = await addWebsiteBalance('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912', ethers.parseEther('0.001').toString());
      // const getData = await getWebsiteBalance('0x0c7840a85014bcf3fb25cdc40c05ef358d795e98d097f50398493b76e5d6f912')
      // const getData=await addMultipleTicks([{
      //     "websiteId":"0x01da11aee2ee8fc85963d03e56016d87246187cc9623e54cb58e29c93f3fb8a3",
      //     "status":0,
      //     "latency":200
      // },{
      //     "websiteId":"0x87daf0846656bdc31a78c0d05fb9bcb192733780d1cd0276916caf6b61a48e94",
      //     "status":1,
      //     "latency":200
      // }])
      // console.log("Data fetched:", getData); 
      // setTemp(getData);

      // websiteIds.forEach((id, i) => {
      //   const site = websiteDetails[i];
      //   console.log(`ID: ${id}`);
      //   console.log(`  URL: ${site.url}`);
      //   console.log(`  Contact: ${site.contactInfo}`);
      //   console.log(`  Owner: ${site.owner}`);
      //   console.log(`  Disabled: ${site.disabled}`);
      //   console.log(`  Balance: ${ethers.formatEther(site.currentBalance)} ETH`);
      // });
      
    } catch (error) {
      console.error("Error fetching websites:", error); 
    }
  };
  

  return (
    <div>
      <button onClick={getWebsiteData} className="cursor-pointer">hi</button>
      <div>{typeof temp==='string'?temp:''}</div> 
      <div>{JSON.stringify(temp)}</div>
      <div>{temp+""}</div>
    </div>
  );
}
