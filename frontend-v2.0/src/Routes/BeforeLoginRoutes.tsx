import DevelopmentItFreelancer from 'pages/BeforeLoginPages/FindTalent_Development_It_Freelancer'
import PageNotFoundBeforeLogin from 'pages/PageNotFound'
import { Outlet, Route, Routes } from 'react-router-dom'
import Footer from 'src/Components/BeforeLoginComponents/Footer'
import Header from 'src/Components/BeforeLoginComponents/Header'
import JobDetails from 'src/pages/BeforeLoginPages/JobDetails'
import WorkerList from 'src/pages/ClientPages/Freelancer/worker-list'
import FindFreelancingJob from '../pages/BeforeLoginPages/FindFreelancingJob'
import HomePage from '../pages/BeforeLoginPages/HomePage'
import SignUp from '../pages/BeforeLoginPages/SignUp'
import Login from './../pages/BeforeLoginPages/Login'

export default function BeforeLoginRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-sickers" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/freelance-jobs"
          element={
            <div>
              <Header />
              <Outlet />
              <Footer />
            </div>
          }
        >
          <Route path="" element={<FindFreelancingJob />} />
          <Route path=":id" element={<JobDetails />} />
        </Route>

        <Route path="/dev-it" element={<DevelopmentItFreelancer />} />
        <Route path="*" element={<PageNotFoundBeforeLogin />} />
      </Routes>
    </>
  )
}
