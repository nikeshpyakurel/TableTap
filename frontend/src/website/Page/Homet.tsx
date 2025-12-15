import Navbar from "../components/Navbar";
import AdminImage from "./AdminImage";
import BottomBar from "./BottomBar";
import FAQ from "./FAQ";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ManageOrderTab from "./ManageOrderTab";

const Homet = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div>
        <AdminImage />
      </div>
      <div id="features">
        <ManageOrderTab />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <FAQ />
      <div id="contact">
        <BottomBar />
      </div>
    </div>
  );
};

export default Homet;
