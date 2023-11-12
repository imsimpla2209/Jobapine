import Footer from 'Components/BeforeLoginComponents/Footer'
import { SearchContextProvider } from 'Context/SearchContext'
import AllContract from 'pages/ClientPages/AllContract'
import AllJobPosts from 'pages/ClientPages/AllJobPost'
import BringYourFreelancer from 'pages/ClientPages/BringYourTalent'
import CreateContract from 'pages/ClientPages/CreateContract'
import FreelancerList from 'pages/ClientPages/Freelancer'
import FreelancerProfile from 'pages/ClientPages/FreelancerProfile'
import JobDetailsBeforeProposals from 'pages/ClientPages/JobDetailsBeforeProposols'
import Jobs from 'pages/ClientPages/Jobs'
import PostJob from 'pages/ClientPages/PostJop'
import Reports from 'pages/ClientPages/Reports'
import ReviewProposals from 'pages/ClientPages/ReviewProposals'
import EmailVerified from 'pages/EmailVerification/EmailVerified'
import PleaseVerifiy from 'pages/EmailVerification/PleaseVerifiy'
import Contract from 'pages/FreelancerPages/Contract'
import TransactionHistory from 'pages/FreelancerPages/Reports/TransactionHistory'
import Messages from 'pages/Messages'
import Notifications from 'pages/Notifications'
import PageNotFound from 'pages/PageNotFound'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from 'src/Components/ClientComponents/Header'

export default function ClientRoutes() {
  const [freelancerArr, setfreelancerArr] = useState([])
  const [freelancerSearchList, setfreelancerSearchList] = useState('')

  return (
    <>
      <SearchContextProvider value={{ freelancerSearchList, setfreelancerSearchList, freelancerArr, setfreelancerArr }}>
        <Header />
        <Routes>
          <Route path="/home" element={<Jobs />} />
          <Route path="/" element={<Jobs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/all-job-posts" element={<AllJobPosts />} />
          <Route path="/all-contracts" element={<AllContract />} />
          <Route path="/bring-your-own-freelancer" element={<BringYourFreelancer />} />
          <Route path="/job-details/:id" element={<JobDetailsBeforeProposals />} />
          <Route path="/job/:id" element={<JobDetailsBeforeProposals />} />
          <Route path="/contract" element={<Contract location={undefined} />} />
          <Route path="/email-verification" element={<EmailVerified />} />
          <Route path="/sign-up/please-verify" element={<PleaseVerifiy />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/freelancer" element={<FreelancerList />} />
          <Route path="/saved-freelancer" element={<FreelancerList />} />
          <Route path="/freelancer-profile/:id" element={<FreelancerProfile />} />
          <Route path="/job/review-proposal/:id" element={<ReviewProposals />} />
          <Route path="/billing-history" element={<Reports />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/create-contract" element={<CreateContract location={undefined} />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="**" element={<PageNotFound />} />
        </Routes>
      </SearchContextProvider>
      <Footer />
    </>
  )
}
