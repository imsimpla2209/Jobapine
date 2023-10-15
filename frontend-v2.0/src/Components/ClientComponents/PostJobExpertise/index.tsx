import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { ELevel } from 'src/utils/enum'

export default function PostJobExpertise({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const [inputVal, setInputVal] = useState('')
  const [skillsList, setSkillsList] = useState([])
  const [job, setJob] = useState<{ jobExperienceLevel: ELevel[]; skills: string[] }>({
    jobExperienceLevel: null,
    skills: [],
  })
  const { t } = useTranslation(['main'])

  const getData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'jobExperienceLevel':
        setJob({ ...job, jobExperienceLevel: [val] })
        break
      case 'jobSkills':
        setInputVal(val)
        break
      default:
        break
    }
  }

  const addSkills = () => {
    skillsList.push(inputVal)
    setSkillsList([...skillsList])
    setJob({ ...job, skills: skillsList })
    setInputVal('')
    console.log(skillsList)
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      reqSkills: job.skills,
      experienceLevel: job.jobExperienceLevel,
    })
    setBtns({ ...btns, visibility: false })
    setStep('visibility')
  }

  return (
    <>
      <section className=" bg-white border rounded mt-3 pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Expertise')}</h4>
          <p>{t('Step 4 of 7')}</p>
        </div>
        <div className="px-4 mt-3">
          <p className="fw-bold mt-2">
            {t('What level of experience should your freelancer have?')}
            <span className="text-danger"> *</span>
          </p>
          <div className="my-4 d-flex justify-content-between" onInput={getData}>
            <label className="border border-success rounded p-3 text-center">
              <input type="radio" className="float-end" name="jobExperienceLevel" value={ELevel.BEGINNER} />
              <h6 className="my-3">{t('Entry Level')}</h6>
              <div>{t('Looking for someone relatively new to this field')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center mx-3">
              <input type="radio" className="float-end" name="jobExperienceLevel" value={ELevel.INTERMEDIATE} />
              <h6 className="my-3">{t('Intermediate')}</h6>
              <div>{t('Looking for substantial experience in this field')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center">
              <input type="radio" className="float-end" name="jobExperienceLevel" value={ELevel.EXPERT} />
              <h6 className="my-3">{t('Expert')}</h6>
              <div>{t('Looking for comprehensive and deep expertise in this field')}</div>
            </label>
          </div>
          <p className="fw-bold">{t('Enter the skills of your job post?')}</p>
          <div className="my-4 d-flex justify-content-between">
            <input
              className="form-control w-75 shadow-none"
              type="text"
              name="jobSkills"
              value={inputVal}
              onChange={getData}
            />
            <button className="btn bg-jobsicker px-5" disabled={!inputVal} onClick={addSkills}>
              Add
            </button>
            <div className="my-4 d-flex justify-content-between"></div>
          </div>
          {skillsList.map((item, index) => (
            <div className="chip mb-3 ms" key="index">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded mt-3">
        <div className="ps-4 my-3">
          <button
            className="btn"
            onClick={() => {
              setStep('details')
            }}
          >
            <span className="btn border text-success me-4 px-5">{t('Back')}</span>
          </button>
          <button className={`btn ${!job.jobExperienceLevel && 'disabled'}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
