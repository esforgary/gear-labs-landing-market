import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'; 
import Container from 'react-bootstrap/Container';

import Header from "./components/header/header";
import { Banner } from './components/banner/banner';
import { Technologys } from './components/technologys/technologys';
import AboutUs from './components/ab/about-us';
import FitbackForm from './components/fitback_form/fitback-form';
import WorkShop from './components/work_shop/work-shop';
import Footer from './components/footer/footer';
import { ThemeLangProvider } from './context/ThemeLangContext';

import { useEffect } from "react";
import { startFloatingParticles } from "./components/scripts/floatingParticles";

function App() {
useEffect(() => {
    return startFloatingParticles();
  }, []);

useEffect(() => {
  const handleScroll = () => {
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
        (el as HTMLElement).style.setProperty('--delay', `${index * 0.15}s`);
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <ThemeLangProvider>
      <Header />
      <Container className='wrapper'>
        <section id="home" className="page-section">
          <Banner/>
        </section>
        <section id="development" className="page-section">
          <Technologys/>
        </section>
        <section id="catalog" className="page-section">
          <WorkShop/>
        </section>
        <section id="about" className="page-section">
          <AboutUs/>
        </section>
        <section id="start" className="page-section">
          <FitbackForm/>
        </section>
      </Container>
      <Footer/>
    </ThemeLangProvider>
  );
}

export default App;
