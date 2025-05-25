import Footer from "@/components/Footer";
import ValidatorNavbar from "@/components/ValidatorNavbar";
import ValidatorWrapper from "@/pages/Validator";

export default function validator() {
  return (
    <div className="md:ml-40">
      <ValidatorNavbar />
      <ValidatorWrapper/>
      <Footer/>
    </div>
  )
};
