import React, { useEffect, useState } from "react";
import "./Categories.css";
import axios from "axios";
import { BASEURL } from "../Comman/CommanConstans";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const Categories = () => {
  const navigate = useNavigate();
  const [allCategorise, setAllCategorise] = useState([]);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}/customers/sub-category?page=1&limit=50`
      );
      if (response) {
        setAllCategorise(response.data.rows);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const navigateToShop = (Id) => {
    window.scroll(0, 0);
    navigate("/shop", { state: { category: Id } });
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <div className="categories-container" data-aos="zoom-in-down">
      {allCategorise.map((category, index) => (
        <div
          key={category.id}
          className="category-item pointer"
          onClick={() => navigateToShop(category.id)}
        >
          <img src={BASEURL + category.category_image} alt={category.name} />
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Categories;
