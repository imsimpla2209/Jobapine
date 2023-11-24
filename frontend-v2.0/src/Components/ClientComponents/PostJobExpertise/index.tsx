import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiSkillPicker } from 'src/Components/SharedComponents/SkillPicker'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { ELevel } from 'src/utils/enum'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'

export default function PostJobExpertise({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)

  const [job, setJob] = useState<{ jobExperienceLevel: ELevel[]; skills: string[] }>({
    jobExperienceLevel: [],
    skills: [],
  })
  const { t } = useTranslation(['main'])

  const addData = () => {
    postJobSubscribtion.updateState({
      reqSkills: job.skills.map(skill => ({ skill, level: 1 })),
      experienceLevel: job.jobExperienceLevel,
    })
    setBtns({ ...btns, visibility: false })
    setStep('visibility')
  }

  const handleChangeJobExperienceLevel = e => {
    const level = e.target.value
    setJob({
      ...job,
      jobExperienceLevel: job.jobExperienceLevel.includes(level)
        ? job.jobExperienceLevel.filter(item => item !== level)
        : [...job.jobExperienceLevel, level],
    })
  }

  const onSkillsChange = skills => {
    setJob({
      ...job,
      skills: skills.map(skill => skill.value),
    })
  }
  return (
    <>
      <section className=" bg-white border rounded mt-3 pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Expertise')}</h4>
          <p>{t('Step 4 of 7')}</p>
        </div>
        <div className="px-4 mt-3  mb-4">
          <p className="fw-bold mt-2">
            {t('What level of experience should your freelancer have?')}
            <span className="text-danger"> *</span>
          </p>
          <div className="my-4 d-flex justify-content-between">
            <label className="border border-success rounded p-3 text-center">
              <input
                type="checkbox"
                className="float-end"
                name="jobExperienceLevel"
                value={ELevel.BEGINNER}
                onInput={handleChangeJobExperienceLevel}
              />
              <h6 className="my-3">{t('Entry Level')}</h6>
              <div>{t('Looking for someone relatively new to this field')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center mx-3">
              <input
                type="checkbox"
                className="float-end"
                name="jobExperienceLevel"
                value={ELevel.INTERMEDIATE}
                onInput={handleChangeJobExperienceLevel}
              />
              <h6 className="my-3">{t('Intermediate')}</h6>
              <div>{t('Looking for substantial experience in this field')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center">
              <input
                type="checkbox"
                className="float-end"
                name="jobExperienceLevel"
                value={ELevel.EXPERT}
                onInput={handleChangeJobExperienceLevel}
              />
              <h6 className="my-3">{t('Expert')}</h6>
              <div>{t('Looking for comprehensive and deep expertise in this field')}</div>
            </label>
          </div>
          <p className="fw-bold">{t('Enter the skills of your job post?')}</p>
          <MultiSkillPicker reset handleChange={onSkillsChange} istakeValue></MultiSkillPicker>
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
          <button className={`btn ${!job.jobExperienceLevel?.length && !job.skills?.length && 'disabled'}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
