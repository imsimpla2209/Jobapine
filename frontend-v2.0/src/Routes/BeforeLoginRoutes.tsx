import DevelopmentItFreelancer from 'pages/BeforeLoginPages/FindTalent_Development_It_Freelancer'
import PageNotFoundBeforeLogin from 'pages/PageNotFound'
import { Route, Routes } from 'react-router-dom'
import Footer from 'src/Components/BeforeLoginComponents/Footer'
import Header from 'src/Components/BeforeLoginComponents/Header'
import AllJobPosts from 'src/pages/ClientPages/AllJobPost'
import FreelancerList from 'src/pages/ClientPages/Freelancer'
import FreelancerProfile from 'src/pages/ClientPages/FreelancerProfile'
import HomePage from '../pages/BeforeLoginPages/HomePage'
import SignUp from '../pages/BeforeLoginPages/SignUp'
import Login from './../pages/BeforeLoginPages/Login'
import JobDetailsBeforeProposals from 'src/pages/ClientPages/JobDetailsBeforeProposols'

export default function BeforeLoginRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/job-sickers" element={<HomePage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/freelancer"
        element={
          <div>
            <Header />
            <FreelancerList />
            <Footer />
          </div>
        }
      />
      <Route
        path="/freelancer-profile/:id"
        element={
          <div>
            <Header />
            <FreelancerProfile />
            <Footer />
          </div>
        }
      />
      <Route
        path="/find-work"
        element={
          <div>
            <Header />
            <AllJobPosts />
            <Footer />
          </div>
        }
      />
      <Route
        path="/job-details/:id"
        element={
          <div>
            <Header />
            <JobDetailsBeforeProposals />
            <Footer />
          </div>
        }
      />

      <Route path="/dev-it" element={<DevelopmentItFreelancer />} />
      <Route path="*" element={<PageNotFoundBeforeLogin />} />
    </Routes>
  )
}
