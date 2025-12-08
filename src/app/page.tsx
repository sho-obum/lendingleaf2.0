import Hero from "@/components/sections/Hero";
import Services from "../components/sections/Services";
import Steps from "@/components/sections/Steps";
import EMICalculator from "@/components/sections/EMICalculator";
import { MarqueeAnimation } from "@/components/sections/MarqueeBanner";




export default function Home() {
  return (
    <>
      <div className="overflow-hidden">
       <Hero />
       <Services />
       <Steps />
       <EMICalculator />
      </div>
    </>
  );
}
