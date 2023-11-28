import { Routes, Route } from "react-router-dom";

import "pages/AdminPages/assets/styles/main.css";
import "pages/AdminPages/assets/styles/responsive.css";
import Main from "src/Components/AdminComponents/layout/Main";
import Billing from "pages/AdminPages/Billing";
import Home from "pages/AdminPages/Home";
import Rtl from "pages/AdminPages/Rtl";
import SignIn from "pages/AdminPages/SignIn";
import Tables from "pages/AdminPages/Tables";
import SignUp from "src/pages/AdminPages/SignUp";
import Profile from "src/pages/AdminPages/Profile";

function AdminRoutes() {
  return (
    <div className="App">
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Main />} >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/rtl" element={<Rtl />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AdminRoutes;
