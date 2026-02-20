import React, { useEffect, useState } from "react";
import { getProfissionais } from "../api/api";
import { MenuItem, Select, Typography } from "@mui/material";
import Agenda from "../components/Agenda";

const Home: React.FC = () => {

  return (
    <div>
      <Agenda />
    </div>
  );
};

export default Home;