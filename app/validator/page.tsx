import Footer from "@/components/Footer";
import ValidatorNavbar from "@/components/validator-navbar";
import ValidatorPage from "@/pages/Validator";

export default function validator() {
  return (
    <div className="md:ml-40">
      <ValidatorNavbar />
      <ValidatorPage/>
      <Footer/>
    </div>
  )
};
