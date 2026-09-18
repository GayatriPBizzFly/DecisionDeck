import Header from "../components/Header";
import About from "../components/About";
import Subscription from "../components/Subscription";
import Footer from "../components/Footer";
import Cards from "../components/Cards";

function LandingPage() {
  return (
    <>
      <Header />

      <main>

        <About />
        <Cards/>
        <Subscription />
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;