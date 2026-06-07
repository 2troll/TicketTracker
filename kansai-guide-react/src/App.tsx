import { Nav }          from "./components/sections/Nav";
import { Hero }         from "./components/sections/Hero";
import { Stats }        from "./components/sections/Stats";
import { About }        from "./components/sections/About";
import { Tours }        from "./components/sections/Tours";
import { Pricing }      from "./components/sections/Pricing";
import { Testimonials } from "./components/sections/Testimonials";
import { FAQ }          from "./components/sections/FAQ";
import { Booking }      from "./components/sections/Booking";
import { Footer }       from "./components/sections/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <About />
        <Tours />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
