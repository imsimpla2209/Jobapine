import PostJobAside from 'Components/ClientComponents/PostJobAside'
import PostJobGetStarted from 'Components/ClientComponents/PostJobGetStarted'
import { createContext, useState } from 'react'
import PostJobBudget from 'src/Components/ClientComponents/PostJobBudget'
import PostJobDescription from 'src/Components/ClientComponents/PostJobDescription'
import PostJobDetails from 'src/Components/ClientComponents/PostJobDetails'
import PostJobExpertise from 'src/Components/ClientComponents/PostJobExpertise'
import PostJobReview from 'src/Components/ClientComponents/PostJobReview'
import PostJobTitle from 'src/Components/ClientComponents/PostJobTitle'
import PostJobVisibility from 'src/Components/ClientComponents/PostJobVisibility'

export const StepContext = createContext({ step: 'started', setStep: val => {} })

export default function PostJob() {
  const [step, setStep] = useState('started')
  const [btns, setBtns] = useState({
    title: true,
    description: true,
    details: true,
    expertise: true,
    visibility: true,
    budget: true,
    review: true,
  })
  console.log(step)
  return (
    <StepContext.Provider value={{ step, setStep }}>
      <section className="sec-bg-cn p-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <PostJobAside btns={btns} />
            </div>
            <div className="col-lg-9">
              {step === 'started' && <PostJobGetStarted setBtns={setBtns} btns={btns} />}
              {step === 'title' && <PostJobTitle setBtns={setBtns} btns={btns} />}
              {step === 'description' && <PostJobDescription setBtns={setBtns} btns={btns} />}
              {step === 'details' && <PostJobDetails setBtns={setBtns} btns={btns} />}
              {step === 'expertise' && <PostJobExpertise setBtns={setBtns} btns={btns} />}
              {step === 'visibility' && <PostJobVisibility setBtns={setBtns} btns={btns} />}
              {step === 'budget' && <PostJobBudget setBtns={setBtns} btns={btns} />}
              {step === 'review' && <PostJobReview />}

              {/* <Routes>
              <Route path="/" element={<PostJobGetStarted setBtns={setBtns} btns={btns} />} />
              <Route path="/title" element={<PostJobTitle setBtns={setBtns} btns={btns} />} />
              <Route path="/description" element={<PostJobDescription setBtns={setBtns} btns={btns} />} />
              <Route path="/details" element={<PostJobDetails setBtns={setBtns} btns={btns} />} />
              <Route path="/expertise" element={<PostJobExpertise setBtns={setBtns} btns={btns} />} />
              <Route path="/visibility" element={<PostJobVisibility setBtns={setBtns} btns={btns} />} />
              <Route path="/budget" element={<PostJobBudget setBtns={setBtns} btns={btns} />} />
              <Route path="/review" element={<PostJobReview />} />
            </Routes> */}
            </div>
          </div>
        </div>
      </section>
    </StepContext.Provider>
  )
}
