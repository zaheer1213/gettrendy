import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import Footer from "../Footer/Footer";
import axios from "axios";
import { BASEURL } from "../Comman/CommanConstans";
import { useAuth } from "../../AuthContext/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userToken } = useAuth();
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
  });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${BASEURL}/accounts/user-profile`, {
        headers: {
          "x-access-token": userToken || localStorage.getItem("token"),
        },
      });
      const data = response.data.data;
      setFormData({
        fullName: data.username,
        phone: data.mobile_number,
        email: data.email,
        userId: data.id,
        postcode: data.pincode,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {
      const payload = {
        email: formData.email,
        mobile_number: formData.phone,
        // pincode: formData.postcode,
        username: formData.fullName,
      };

      const response = await axios.put(
        `${BASEURL}/accounts/user/${formData.userId}`,
        payload,
        {
          headers: {
            "x-access-token": userToken,
          },
        }
      );
      if (response.data) {
        toast.success("Profile Updated Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      <div className="profile-container ">
        <div className="row">
          <div className="profile-details">
            <div className="">
              <h3 className="mb-3">Personal Details</h3>
              <form>
                {/* Full Name */}
                <div className="form-group">
                  <label>
                    Full Name <span className="require">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Postcode */}
                {/* <div className="form-group">
                  <label>
                    Postcode / ZIP <span className="require">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ZIP"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                  />
                  {errors.postcode && (
                    <p className="text-danger">{errors.postcode}</p>
                  )}
                </div> */}

                {/* Phone */}
                <div className="form-group">
                  <label>
                    Phone <span className="require">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <p className="text-danger">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label>
                    Email <span className="require">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                </div>

                {/* Order Notes */}
                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    className="form-control"
                    placeholder="Notes about your self"
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                  />
                </div>
              </form>
              <button className="btn button" onClick={() => updateProfile()}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
