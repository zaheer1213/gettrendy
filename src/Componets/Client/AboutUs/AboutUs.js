import React from "react";
import "./AboutUs.css";
import { LuChefHat } from "react-icons/lu";
import { TbBowlSpoon } from "react-icons/tb";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaRegSmileBeam } from "react-icons/fa";
import Footer from "../Footer/Footer";

const AboutUs = () => {
  return (
    <>
      <div>
        <div className="about-us-hero-section mb-96">
          <div className="hero-text-div rounded-3 mx-auto p-5">
            <h1 className="text-center mb-4">About Us</h1>
            <p className="text-center">
              At GET Trendy, we don’t just sell T-shirts; we create experiences.
              We care deeply about our customers and believe in delivering
              nothing but the best. Every design is crafted with love, every
              stitch speaks of quality, and every T-shirt reflects our
              commitment to your satisfaction. Because at GET Trendy, your style
              and comfort are our top priorities.
            </p>
          </div>
        </div>
        <div className="our-mission-section row mx-auto column-gap-1 ">
          <div class="col-12 col-xl-5 ml-lg-0 mr-lg-auto ">
            <h2 className="mb-4 text-center text-xl-start">
              Stay Trendy with GET Trendy!
            </h2>
            <p>
              Welcome to GET Trendy, your ultimate destination for stylish and
              comfortable T-shirts. We blend quality, creativity, and the latest
              trends to bring you designs that speak your personality. Whether
              it’s casual vibes or bold statements, GET Trendy helps you wear
              your story with confidence. Join us in redefining style, one
              T-shirt at a time!
            </p>
          </div>

          <div class="col-12 col-xl-6 mx-auto ml-xl-auto mr-xl-0">
            <img
              src="/Images/man.jpg"
              alt="imgs"
              className="rounded-3 img-fluid"
            />
          </div>
        </div>
        <div className="teams-work-section mx-auto mb-5 p-5">
          <h2 className="text-center mb-5">Our Features</h2>
          <div className="row column-gap-3 row-gap-3 feature-row justify-content-center">
            <div className="col d-flex flex-column align-items-center p-5 feature-box col-12 col-md-5 col-xl">
              <LuChefHat
                style={{ fontSize: "50px" }}
                className="mb-3 feature-icon"
              />
              <h5 className="text-center">High-Quality Products</h5>
            </div>
            <div className="col d-flex flex-column align-items-center p-5 feature-box col-12 col-md-5 col-xl">
              <TbBowlSpoon style={{ fontSize: "50px" }} className="mb-3" />
              <h5 className="text-center">Outstanding Customer Service</h5>
            </div>
            <div className="col d-flex flex-column align-items-center p-5 feature-box col-12 col-md-5 col-xl">
              <RiMoneyRupeeCircleLine
                style={{ fontSize: "50px" }}
                className="mb-3"
              />

              <h5 className="text-center">Value for Money</h5>
            </div>
            <div className="col d-flex flex-column align-items-center p-5 feature-box col-12 col-md-5 col-xl">
              <FaRegSmileBeam style={{ fontSize: "50px" }} className="mb-3" />

              <h5 className="text-center">Positive Reviews and Reputation</h5>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
