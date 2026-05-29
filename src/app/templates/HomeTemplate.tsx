import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import FAQ from "../modules/home/FAQ";
import HeroSection from "../modules/home/HeroSection";
import LatestArticles from "../modules/home/LatestArticles";
import LiveStats from "../modules/home/LiveStats";
import Testimonials from "../modules/home/Testimonials";
import WhyChooseUs from "../modules/home/WhyChooseUs";
import WorkoutPlans from "../modules/home/WorkoutPlans";

export default function HomeTemplate() {
  return (
    <>
      <Header />
      <HeroSection />
      <WhyChooseUs />
      <WorkoutPlans />
      <Testimonials />
      <LatestArticles />
      <LiveStats />
      <FAQ />
      <Footer />
    </>
  );
}
