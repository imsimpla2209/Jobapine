import { FrownOutlined, SmileOutlined } from '@ant-design/icons'
import { Checkbox, InputNumber, Layout, Radio, Slider, Space } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LocationPicker from 'src/Components/SharedComponents/LocationPicker'
import { MultiSkillPicker } from 'src/Components/SharedComponents/SkillPicker'
import { filterFreelancersBody } from 'src/types/freelancer'
import { EPaymenType } from 'src/utils/enum'
import './Freelancer.css'
import FreelancerListCards from './freelancer-list'

export default function FreelancerList() {
  const { t } = useTranslation(['main'])
  const [filterOption, setfilterOption] = useState<filterFreelancersBody>({})
  const [refresh, onRefresh] = useState<boolean>(false)

  const [value, setValue] = useState({ from: 0, to: 5 })
  const mid = Number((5 / 2).toFixed(5))
  const preColorCls = value.from >= mid ? '' : 'icon-wrapper-active'
  const nextColorCls = value.to >= mid ? 'icon-wrapper-active' : ''

  const onSkillsChange = (c: any) => {
    const skills = c?.map((cc, ix) => cc.label)
    setfilterOption({ ...filterOption, skills })
  }

  const onLocationChange = (l: any) => {
    setfilterOption({ ...filterOption, currentLocations: l })
  }

  const onPayTypeChange = (l: any) => {
    setfilterOption({ ...filterOption, preferJobType: l })
  }

  const handleEarnedAmountFrom = (from: any = -1) => {
    setfilterOption({ ...filterOption, earned: { from, to: filterOption?.earned?.to } })
  }

  const handleEarnedAmountTo = (to: any = -1) => {
    setfilterOption({ ...filterOption, earned: { to, from: filterOption?.earned?.from } })
  }

  const onAvailabilityChange = (c: any) => {
    const v = c?.target?.value
    v === undefined && delete filterOption.available

    setfilterOption({ ...filterOption, available: v })
  }
  const removeFilterOptions = useCallback(() => {
    setfilterOption({})
    onRefresh(true)
    setTimeout(() => onRefresh(false), 2000)
  }, [filterOption])

  return (
    <Layout style={{ marginTop: 150 }}>
      <Layout.Sider width={300} style={{ background: '#ffffff', padding: 16, borderRight: '1px solid #dee2e6' }}>
        <div>
          <h5 className="mb-lg-4 display-inline-block">{t('FilterBy')}</h5>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-3 fw-bold">{t('Skills')}</h6>
          <MultiSkillPicker reset={refresh} handleChange={onSkillsChange} istakeValue={true}></MultiSkillPicker>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-2 fw-bold">{t('Freelancer Location')}</h6>
          <div className="input-group rounded-3">
            <LocationPicker reset={refresh} handleChange={onLocationChange}></LocationPicker>
          </div>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-3 fw-bold">{t('Prefer payment type')}</h6>
          <Checkbox.Group style={{ width: '100%' }} onChange={onPayTypeChange} value={filterOption?.preferJobType}>
            <Space direction="vertical">
              {Object.keys(EPaymenType).map(l => (
                <span key={l}>
                  <Checkbox value={EPaymenType[l]}>{t(`${EPaymenType[l]}`)}</Checkbox>
                </span>
              ))}
            </Space>
          </Checkbox.Group>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-3 fw-bold">
            {t('Earned')} {`(${t('VND')})`}
          </h6>
          <Space wrap>
            <InputNumber
              prefix="From"
              addonBefore=""
              addonAfter={<> VND</>}
              defaultValue={0}
              placeholder="Enter a number"
              controls
              onKeyPress={event => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              min={0}
              value={filterOption?.earned?.from >= 0 ? filterOption?.earned?.from : null}
              onChange={(v: any) => handleEarnedAmountFrom(v)}
              decimalSeparator=","
              max={filterOption?.earned?.to || Number.MAX_SAFE_INTEGER}
            />
            <InputNumber
              prefix="To"
              addonBefore=""
              addonAfter={<> VND</>}
              placeholder="Enter a number"
              value={filterOption?.earned?.to >= 0 ? filterOption?.earned?.to : null}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              onKeyPress={event => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              onChange={(v: any) => handleEarnedAmountTo(v)}
              min={filterOption?.earned?.from || 1}
              controls
            />
          </Space>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-3 fw-bold">{t('Rating')}</h6>
          <div style={{ display: 'flex', gap: 8 }}>
            <FrownOutlined className={preColorCls} />
            <Slider
              style={{ flex: 1 }}
              max={5}
              min={0}
              range={true}
              defaultValue={[0, 5]}
              onChange={val => setValue({ from: val[0], to: val[1] })}
              value={[value.from, value.to]}
            />
            <SmileOutlined className={nextColorCls} />
          </div>
          <hr />

          <h6 className="mb-lg-2 display-inline-block mt-lg-2 fw-bold">Availability</h6>
          <Radio.Group onChange={onAvailabilityChange} value={filterOption?.available}>
            <Radio style={{ display: 'block' }} value={undefined}>
              {t('All')}
            </Radio>
            <Radio style={{ display: 'block' }} value={true}>
              {t('Available')}
            </Radio>
            <Radio style={{ display: 'block' }} value={false}>
              {t('Unavailable')}
            </Radio>
          </Radio.Group>
          <hr />
        </div>
      </Layout.Sider>
      <FreelancerListCards filterOption={filterOption} />
    </Layout>
  )
}
