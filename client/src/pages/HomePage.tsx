import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import Benefits from "@/components/Benefits";
import Story from "@/components/Story";
import HowToUse from "@/components/HowToUse";
import RecentReviews from "@/components/RecentReviews";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBar />
      <Benefits />
      <Story />
      <HowToUse />
      <RecentReviews />
      <Testimonials />
    </>
  );
}
