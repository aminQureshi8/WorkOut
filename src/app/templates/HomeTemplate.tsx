import Header from "../components/layout/Header";
import HeroSection from "../modules/home/HeroSection";
import LatestArticles from "../modules/home/LatestArticles";
import WhyChooseUs from "../modules/home/WhyChooseUs";
import WorkoutPlans from "../modules/home/WorkoutPlans";

export default function HomeTemplate() {
  return (
    <>
      <Header />
      <HeroSection />
      <WhyChooseUs />
      <WorkoutPlans />
      <LatestArticles />
    </>
  );
}
