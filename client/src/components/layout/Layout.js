import React from "react";
import "../../style/layout.css";
import { userMenus } from "./Menus/userMenus";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Layout = ({ children }) => {
  const sidebarmenu = userMenus;
  const navigate = useNavigate();
  const location = useLocation();
  const handlelogout = () => {
    localStorage.clear();
    toast.success("succesfully logout");
    navigate("/login");
  };
  return (
    <>
      <div className="row ">
        <div className="col-md-3 sidebar">
          {" "}
          <div className="logo">
            <h5 className="text-center">job portal</h5>{" "}
          </div>{" "}
          <hr />
          <p className="text-center">welcome:username</p>
          <hr />
          <div className="menu">
            {sidebarmenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div className={`menu-item ${isActive && "active"}`}>
                  <i className>{menu.icon}</i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div className={`menu-item`} onClick={handlelogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>{" "}
        .<div className="col-md-9"> {children}</div>{" "}
      </div>{" "}
    </>
  );
};

export default Layout;
