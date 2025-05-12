import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/Landing";

export default async function page() {
  return (
    <>
      <Navbar/>
      <LandingPage/>
      <Footer/>
    </>
  )
};
