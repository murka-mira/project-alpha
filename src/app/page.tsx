import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WaveformIdea from "./components/WaveformIdea";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Pricing />
        <WaveformIdea />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
