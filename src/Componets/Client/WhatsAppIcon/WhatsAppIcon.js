import React from "react";
import "./WhatsAppIcon.css"; // Create a CSS file for styling

const WhatsAppIcon = () => {
  const whatsappNumber = "+919096321038"; // Replace with your WhatsApp number

  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <div className="whatsapp-icon" onClick={handleClick}>
      <img src="/Images/whatsappimg.png" alt="whatsapp" />
    </div>
  );
};

export default WhatsAppIcon;
