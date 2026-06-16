import HeroSection from "@/modules/home/HeroSection";
import FAQ from "@/modules/home/FAQ";
import WhyChooseUs from "@/modules/home/WhyChooseUs";
import WorkoutPlans from "@/modules/home/WorkoutPlans";
import Testimonials from "@/modules/home/Testimonials";
import LiveStats from "@/modules/home/LiveStats";
import LatestArticles from "@/modules/home/LatestArticles";

interface HomeTemplateProps {
  articles: any[];
}

export default function HomeTemplate({ articles }: HomeTemplateProps) {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <WorkoutPlans />
      <Testimonials />
      <LatestArticles articles={articles} />
      <LiveStats />
      <FAQ />
    </>
  );
}
