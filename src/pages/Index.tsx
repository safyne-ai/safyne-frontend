import { useNavigate } from "react-router-dom";
import ContentSections from "@/components/ContentSections";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PostHeroBentoSection from "@/components/PostHeroBentoSection";
import EnginesMeshSection from "@/components/EnginesMeshSection";
import LandingCursorAura from "@/components/LandingCursorAura";
import Pricing from "@/components/Pricing";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`landing-marketing relative min-h-screen text-foreground transition-colors duration-500 ${
        isLight ? "landing-marketing--light bg-[#faf8ff]" : "bg-[#020103]"
      }`}
    >
      <LandingCursorAura isLight={isLight} />
      <Header onSignIn={() => navigate(isLoggedIn ? "/chat" : "/auth")} />
      <main className="relative z-10">
        <Hero />
        <PostHeroBentoSection />
        <EnginesMeshSection />
        <Pricing />
        <ContentSections />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
