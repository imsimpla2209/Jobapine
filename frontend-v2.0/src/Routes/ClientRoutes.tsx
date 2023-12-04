import Footer from 'Components/BeforeLoginComponents/Footer'
import { SearchContextProvider } from 'Context/SearchContext'
import AllContract from 'pages/ClientPages/AllContract'
import AllJobPosts from 'pages/ClientPages/AllJobPost'
import CreateContract from 'pages/ClientPages/CreateContract'
import FreelancerList from 'pages/ClientPages/Freelancer'
import JobDetailsBeforeProposals from 'pages/ClientPages/JobDetailsBeforeProposols'
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
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from 'src/Components/ClientComponents/Header'
import HomeLayout from 'src/Components/ClientComponents/HomeLayout'
import { getAllJobs } from 'src/api/job-apis'
import ProfileFreelancerInClientPage from 'src/pages/ClientPages/Freelancer/freelancer-profile'
import Offers from 'src/pages/FreelancerPages/Offers'
import BuyConnects from 'src/pages/FreelancerPages/Reports/BuyConnects'
import { handleCacheData, handleGetCacheData, miniSearch } from 'src/utils/handleData'
import './styles.css'

export default function ClientRoutes() {
  const [freelancerArr, setfreelancerArr] = useState([])
  const [freelancerSearchList, setfreelancerSearchList] = useState('')

  useEffect(() => {
    const isIndex = localStorage.getItem('index')
    if (!isIndex || isIndex !== 'okay') {
      console.log('reIndex')
      getAllJobs()
        .then(res => {
          miniSearch.addAll(res.data)
          handleCacheData(res.data)
          localStorage.setItem('index', 'okay')
        })
        .catch(err => console.log('sth wrong', err))
    } else if (isIndex === 'okay') {
      handleGetCacheData()
        .then(res => {
          console.log('cache res', res)
          miniSearch.addAll(res?.rows?.map(s => s?.doc))
        })
        .catch(err => console.log('get cache failed', err))
    }
  }, [])

  return (
    <div>
      <SearchContextProvider value={{ freelancerSearchList, setfreelancerSearchList, freelancerArr, setfreelancerArr }}>
        <Header />
        <div className="background_body">
          <Routes>
            <Route path="/home" element={<HomeLayout />} />
            <Route path="/" element={<HomeLayout />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/all-job-posts" element={<AllJobPosts />} />
            <Route path="/all-contracts" element={<AllContract />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/job-details/:id" element={<JobDetailsBeforeProposals />} />
            <Route path="/job/:id" element={<JobDetailsBeforeProposals />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/create-contract/:id" element={<CreateContract />} />
            <Route path="/email-verification" element={<EmailVerified />} />
            <Route path="/sign-up/please-verify" element={<PleaseVerifiy />} />
            <Route path="/freelancer" element={<FreelancerList saved={false} key={'all-freelancers'} />} />
            <Route path="/saved-freelancer" element={<FreelancerList saved={true} key={'saved-freelancers'} />} />
            <Route path="/freelancer-profile/:id" element={<ProfileFreelancerInClientPage />} />
            <Route path="/all-proposals/:id" element={<ReviewProposals />} />
            <Route path="/billing-history" element={<Reports />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/buyconnects" element={<BuyConnects />} />
            <Route path="/invitations" element={<Offers />} />
            <Route path="**" element={<PageNotFound />} />
          </Routes>
        </div>
      </SearchContextProvider>
      <Footer />
    </div>
  )
}
