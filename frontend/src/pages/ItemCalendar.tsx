import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "@styles/pages/ItemCalendar.css";



const ItemCalendar = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="itemCalendar_container">
      {id}
    </div>
  );
};

export default ItemCalendar;
