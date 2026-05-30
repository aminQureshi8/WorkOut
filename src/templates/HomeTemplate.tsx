import HeroSection from "@/modules/home/HeroSection";
import FAQ from "@/modules/home/FAQ";
import WhyChooseUs from "@/modules/home/WhyChooseUs";
import WorkoutPlans from "@/modules/home/WorkoutPlans";
import Testimonials from "@/modules/home/Testimonials";
import LiveStats from "@/modules/home/LiveStats";
import LatestArticles from "@/modules/home/LatestArticles";

export default function HomeTemplate() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <WorkoutPlans />
      <Testimonials />
      <LatestArticles />
      <LiveStats />
      <FAQ />
    </>
  );
}
