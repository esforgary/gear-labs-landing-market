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

import { useEffect } from "react";
import { startFloatingParticles } from "./components/scripts/floatingParticles";

function App() {
useEffect(() => {
    startFloatingParticles();
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
    <>
       <Header />
       <Container className='wrapper'>
        <Banner/>
        <Technologys/>
        <WorkShop/>
        <AboutUs/>
        <FitbackForm/>
       </Container>
       <Footer/>
    </>
  );
}

export default App;

