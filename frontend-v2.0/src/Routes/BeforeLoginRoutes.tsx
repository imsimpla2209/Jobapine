import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/BeforeLoginPages/HomePage";
import SignUp from "../pages/BeforeLoginPages/SignUp";
import Login from "./../pages/BeforeLoginPages/Login";
import FindFreelancingJob from "../pages/BeforeLoginPages/FindFreelancingJob";
import DevelopmentItFreelancer from "pages/BeforeLoginPages/FindTalent_Development_It_Freelancer";
import PageNotFoundBeforeLogin from "pages/PageNotFound";

export default function BeforeLoginRoutes() {
  return (
    <>
      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="/job-sickers"  element={<HomePage />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/sign-up"  element={<SignUp />} />
        <Route path="/freelance-jobs"  element={<FindFreelancingJob />} />
        <Route path="/dev-it"  element={<DevelopmentItFreelancer />} />
        <Route path="*" element={<PageNotFoundBeforeLogin />} />
      </Routes>
    </>
  );
}
