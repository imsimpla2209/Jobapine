/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Space, Tag, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Progress from 'src/Components/SharedComponents/Progress'
import { categoryStore, locationStore, skillStore } from 'src/Store/commom.store'
import { clientStore } from 'src/Store/user.store'
import { createJob } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter, fetchAllToCL, pickName } from 'src/utils/helperFuncs'
import Loader from '../../SharedComponents/Loader/Loader'
import { defaultPostJobState, postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { EJobType, LevelName } from 'src/utils/enum'

export const { Paragraph } = Typography

export default function PostJobReview() {
  const { state: userStoreState } = useSubscription(clientStore)
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const { state } = useSubscription(postJobSubscribtion)
  const { state: allCategories } = useSubscription(categoryStore)
  const { state: allSkills } = useSubscription(skillStore)
  const locations = useSubscription(locationStore).state

  const publishJob = async () => {
    if (state.attachments?.length) {
      await fetchAllToCL(state.attachments, false)
        .then(res => {
          state['attachments'] = res?.filter(url => !!url) || []
        })
        .catch(err => {
          state['attachments'] = []
        })
    }
    createJob({ ...state, client: userStoreState.id })
      .then(res => {
        postJobSubscribtion.updateState({ currentStatus: 'public' })
        message.success('🎉🎉🎉 Job created successfully! 🎉🎉🎉')
      })
      .catch(err => {
        message.error('Failed to create Job')
      })
  }

  const deletePost = () => {
    postJobSubscribtion.updateState(defaultPostJobState)
  }
  console.log(state.preferences)
  return (
    <>
      {state !== null ? (
        <>
          <section className=" bg-white border rounded">
            <div className="ps-4 d-flex border-bottom justify-content-between align-items-center py-4">
              <h4>{t('Review and post')}</h4>
              <Button className="btn bg-jobsicker px-5" onClick={publishJob}>
                {t('Post Job Now')}
              </Button>
            </div>
            <div className="px-4 mt-4">
              <h6 className="text-muted">{t('Title')}</h6>
              <div>
                <h3>{state?.title}</h3>
              </div>
              <div className="my-4">
                <h6 className="text-muted">{t('Job Category')}</h6>
                <Space direction="horizontal">
                  {state?.categories?.map((c, index) => (
                    <button type="button" className="btn text-light btn-sm rounded-pill cats mx-1">
                      {Object.values(allCategories || {})?.find(cat => cat?._id === c)?.name}
                    </button>
                  ))}
                </Space>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Description')}</h5>
              <div className="my-4">
                <h6 className="text-muted">{t('Description')}</h6>
                <span>{state?.description}</span>
              </div>

              <div className="my-4">
                <h6 className="text-muted">{t('Locations')}</h6>
                <span>
                  {state?.preferences?.locations?.map(l => locations.find(loc => loc.code === l)?.name).join(', ')}
                </span>
              </div>

              {state?.tags?.length ? (
                <div className="my-4 d-flex" style={{ alignItems: 'baseline', gap: 8 }}>
                  <h6 className="text-muted">{t('Tags')}:</h6>
                  {state.tags.map((item, index) => (
                    <div className="chip ms" key="index">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {state?.questions?.length ? (
                <div className="my-4">
                  <h6 className="text-muted">{t('Questions')}</h6>
                  <ul>
                    {state.questions.map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Details')}</h5>

              <div className="my-4 d-flex" style={{ alignItems: 'baseline', gap: 16 }}>
                <h6 className="text-muted">{'Type of Project'}:</h6>
                {state?.type === EJobType.ONE_TIME_PROJECT ? (
                  <h6>
                    <i className="fas fa-briefcase" style={{ marginRight: 8 }}></i>
                    {t('One-time project')}
                  </h6>
                ) : state?.type === EJobType.ONGOING_PROJECT ? (
                  <h6>
                    <i className="fas fa-list-alt" style={{ marginRight: 8 }}></i>
                    {t('Ongoing project')}
                  </h6>
                ) : (
                  <h6>
                    <i className="fas fa-th-large" style={{ marginRight: 8 }}></i>
                    {t('Complex project')}
                  </h6>
                )}
              </div>

              {state?.checkLists?.length ? (
                <div className="my-4">
                  <h6 className="text-muted">{t('Checklists')}</h6>
                  <Paragraph>
                    <ul>
                      {state.checkLists.map((item, index) => (
                        <li key={index}>
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Paragraph>
                </div>
              ) : null}
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Expertise')}</h5>
              <div>
                <div className="my-4 d-flex" style={{ alignItems: 'baseline', gap: 8 }}>
                  <h6 className="text-muted">{t('Experience Level')}:</h6>
                  <Space direction="horizontal" size={1}>
                    {state?.experienceLevel.map((item, index) => (
                      <Tag color={['magenta', 'red', 'volcano'][index]} key={index}>
                        {LevelName[item]}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div className="my-4">
                  <h6 className="text-muted">{t('Skill Level')}</h6>

                  {state?.reqSkills?.map((skill, index) => (
                    <Space key={index} size={1} className="me-sm-5 " wrap={true}>
                      <span className="btn text-light btn-sm rounded-pill cats mx-1 my-1">
                        {pickName(
                          Object.values(allSkills).find(s => s?._id === skill?.skill),
                          lang
                        )}
                        :
                      </span>
                      <Progress done={skill?.level || 1} />
                    </Space>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className=" bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Visibility')}</h5>
              <div>
                <div className="my-4 d-flex" style={{ alignItems: 'baseline', gap: 8 }}>
                  <h6 className="text-muted">{t('Job posting visibility')}:</h6>
                  <Tag color="geekblue">{state.visibility ? 'Anyone' : 'Only JobSickers users can find this job'}</Tag>
                </div>
                <div className="my-4 d-flex" style={{ alignItems: 'baseline', gap: 8 }}>
                  <h6 className="text-muted">{t('Number freelancer')}:</h6>
                  <Tag color="cyan">{state?.preferences.nOEmployee}</Tag>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded mt-4">
            <div className="px-4 mt-4">
              <h5>{t('Budget')}</h5>
              <div className="d-flex">
                <div className="my-4 w-50">
                  <h6 className="text-muted">{t('Payment')}</h6>
                  <span>
                    {t(state?.payment.type)}: {currencyFormatter(state?.payment.amount)}
                  </span>
                </div>
                <div className="my-4">
                  <h6 className="text-muted">{t('Budget')}</h6>
                  <span>{currencyFormatter(state?.budget)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded mt-4">
            <div className="ps-4 my-3 py-2">
              <Button className="btn bg-jobsicker px-5" onClick={publishJob}>
                {t('Post Job Now')}
              </Button>
              <Link className="btn border text-success px-5" to="/home" onClick={deletePost}>
                {t('Delete & Exit')}
              </Link>
            </div>
          </section>
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}
