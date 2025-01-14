import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { FaLinkedinIn, FaLocationPinLock } from "react-icons/fa6";
import { BsFillTelephoneInboundFill } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <MDBFooter bgColor="light" className="text-center text-lg-start ">
        <section
          className=""
          style={{ backgroundColor: "black", color: "white" }}
        >
          <MDBContainer className="text-center text-md-start  py-5">
            <MDBRow className="mt-3">
              <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                <img
                  src="/Images/Get_Trendy_Logo.png"
                  alt="logo"
                  style={{
                    height: "150px",
                    width: "150px",
                    objectFit: "contain",
                  }}
                />
                <p className="text-white">
                  GET Trendy brings you premium-quality T-shirts designed to
                  match your unique style. We believe in combining comfort,
                  creativity, and customer care to deliver the best for you!
                </p>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">My Account</h6>
                <p>
                  <a href="/aboutUs" className="text-white">
                    About Us
                  </a>
                </p>
                <p>
                  <a href="/myOrders" className="text-white">
                    Track Orders
                  </a>
                </p>
                {/* <p>
                  <a href="#!" className="text-white">
                    Shipping
                  </a>
                </p> */}
                <p>
                  <a href="/profilePage" className="text-white">
                    My Account
                  </a>
                </p>
                {/* <p>
                  <a href="/storeRegister" className="text-white">
                    My Store
                  </a>
                </p> */}
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>

                <p>
                  <a href="/privacyPolicy" className="text-white">
                    Privacy Policy
                  </a>
                </p>
                <p>
                  <a href="/cancellation-Reschedule" className="text-white">
                    Cancellation & Reschedule Policy
                  </a>
                </p>
                <p>
                  <a href="/contact" className="text-white">
                    Contact Us
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                <p className="text-white">
                  <FaEnvelope /> &nbsp; prashhaant@gmail.com
                </p>
                <p className="text-white">
                  <BsFillTelephoneInboundFill /> &nbsp; +91 90963 21038
                </p>
                <p className="text-white">
                  <FaLocationPinLock /> &nbsp; Flat No. 403, 4th Floor, B-wing,
                  Saraswati Crystal, Opp. Silver Brich Hospital, Raikar Mala,
                  Dhayari, Pune-411041
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
        <section
          className="d-flex justify-content-center  p-4 border-bottom"
          style={{ backgroundColor: "black", color: "white" }}
        >
          <div>
            <a href="" className="me-4 text-reset">
              <FaFacebook size={25} />
            </a>
            <a href="" className="me-4 text-reset">
              <FaTwitter size={25} />
            </a>
            <a href="" className="me-4 text-reset">
              <FaGoogle size={25} />
            </a>
            <a href="" className="me-4 text-reset">
              <FaInstagram fab icon="instagram" size={25} />
            </a>
            <a href="" className="me-4 text-reset">
              <FaLinkedinIn fab icon="linkedin" size={25} />
            </a>
          </div>
        </section>
        <div
          className="text-center p-4"
          style={{ backgroundColor: "black", color: "white" }}
        >
          © {new Date().getFullYear()} All Rights Reserved &nbsp; | &nbsp;
          <a className="text-reset fw-bold" href="">
            Get Trendy
          </a>
        </div>
      </MDBFooter>
    </>
  );
};

export default Footer;
