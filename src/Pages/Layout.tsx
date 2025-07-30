import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
