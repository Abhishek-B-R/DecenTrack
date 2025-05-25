import Footer from "@/components/Footer";
import ValidatorNavbar from "@/components/validator-navbar";
import ValidatorWrapper from "@/pages/ValidatorWrapper";

export default function validator() {
  return (
    <div className="md:ml-40">
      <ValidatorNavbar />
      <ValidatorWrapper/>
      <Footer/>
    </div>
  )
};
