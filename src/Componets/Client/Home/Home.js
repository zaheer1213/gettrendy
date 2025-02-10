import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Hero from "../Hero/Hero";
import "./Home.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const navigate = useNavigate();

  const navigateToShop = () => {
    navigate("/shop");
    window.scroll(0, 0);
  };

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <Carousel
        prevIcon={<FaChevronLeft />}
        nextIcon={<FaChevronRight />}
        className="custom-carousel"
      >
        <Carousel.Item>
          <div className="carousel-content" >
            <div
              className="left-side"
              data-aos="fade-right"
              data-aos-duration="2000"
            >
              {/* <img src="/Images/todays.png" alt="label" /> */}
              <h3>Wear Your Story : Custom Tees for Every Mood</h3>
              <p>
                Express yourself with our premium collection of custom T-shirts.
                Whether it’s bold, quirky, or minimalist, we’ve got a tee for
                every vibe!
              </p>
              <Button className="home-btn btn" onClick={() => navigateToShop()}>
                Shop Now
              </Button>
            </div>
            <div
              className="right-side"
              data-aos="fade-left"
              data-aos-duration="2000"
            >
              <img
                className="d-block w-100"
                src="/Images/tshirt4.png"
                alt="First slide"
              />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content">
            <div
              className="left-side"
              data-aos="fade-right"
              data-aos-duration="2000"
            >
              {/* <img src="/Images/todays.png" alt="label" /> */}
              <h3>Style Meets Comfort: T-Shirts That Speak</h3>
              <p>
                Discover ultra-soft, durable T-shirts designed to make a
                statement. Perfect for casual wear, workouts, or just chilling
                in style.
              </p>
              <Button className="home-btn btn" onClick={() => navigateToShop()}>
                Shop Now
              </Button>
            </div>
            <div
              className="right-side"
              data-aos="fade-left"
              data-aos-duration="2000"
            >
              <img
                className="d-block w-100"
                src="/Images/pngegg.png" // Replace with your image source
                alt="Second slide"
              />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content">
            <div
              className="left-side"
              data-aos="fade-right"
              data-aos-duration="2000"
            >
              {/* <img src="/Images/todays.png" alt="label" /> */}
              <h3>Your Style, Your Tee: Find the Perfect Fit</h3>
              <p>
                Explore a wide range of trendy T-shirts in every size, color,
                and design. Shop now and redefine your wardrobe with effortless
                fashion.
              </p>
              <Button className="home-btn btn" onClick={() => navigateToShop()}>
                Shop Now
              </Button>
            </div>
            <div
              className="right-side"
              data-aos="fade-left"
              data-aos-duration="2000"
            >
              <img
                className="d-block w-100"
                src="/Images/tshirt3.png" // Replace with your image source
                alt="Third slide"
              />
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
      <Hero />
    </>
  );
};

export default Home;
