import { FrownOutlined, SmileOutlined } from '@ant-design/icons'
import { Card, InputNumber, Radio, Row, Slider, Space } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategoriesPicker from 'src/Components/SharedComponents/CategoriesPicker'
import LocationPicker from 'src/Components/SharedComponents/LocationPicker'
import { MultiSkillPicker } from 'src/Components/SharedComponents/SkillPicker'
import { filterFreelancersBody } from 'src/types/freelancer'
import './Freelancer.css'
import FreelancerListCards from './freelancer-list'

export default function FreelancerList({ saved = false }) {
  const { t } = useTranslation(['main'])
  const [filterOption, setfilterOption] = useState<filterFreelancersBody>({})
  const [refresh, onRefresh] = useState<boolean>(false)

  const [value, setValue] = useState({ from: 0, to: 5 })
  const mid = Number((5 / 2).toFixed(5))
  const preColorCls = value.from >= mid ? '' : 'icon-wrapper-active'
  const nextColorCls = value.to >= mid ? 'icon-wrapper-active' : ''

  const onSkillsChange = (c: any) => {
    const skills = c?.map((cc, ix) => cc.value)
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

  const handleFilterRating = val => {
    setValue({ from: val[0], to: val[1] })
    setfilterOption({ ...filterOption, rating: { from: val[0], to: val[1] } })
  }
  const removeFilterOptions = useCallback(() => {
    setfilterOption({})
    onRefresh(true)
    setTimeout(() => onRefresh(false), 2000)
  }, [filterOption])

  return (
    <Row style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <h6 className=" display-inline-block  fw-bold">{t('Skills')}</h6>
            <MultiSkillPicker reset={refresh} handleChange={onSkillsChange} istakeValue={true}></MultiSkillPicker>
          </Card>

          <Card>
            <h6 className="display-inline-block fw-bold">{t('Freelancer Location')}</h6>
            <div className="input-group rounded-3">
              <LocationPicker reset={refresh} handleChange={onLocationChange}></LocationPicker>
            </div>
          </Card>

          <Card>
            <h6 className=" display-inline-block fw-bold">{t('Prefer job type')}</h6>
            <CategoriesPicker handleChange={onPayTypeChange} />
          </Card>

          <Card>
            <h6 className="display-inline-block  fw-bold">
              {t('Earned')} {`(${t('VND')})`}
            </h6>
            <Space wrap>
              <InputNumber
                prefix="From"
                addonBefore=""
                addonAfter={<> VND</>}
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
          </Card>

          <Card>
            <h6 className=" display-inline-block fw-bold">{t('Rating')}</h6>
            <div style={{ display: 'flex', gap: 8 }}>
              <FrownOutlined className={preColorCls} />
              <Slider
                style={{ flex: 1 }}
                max={5}
                min={0}
                range={true}
                defaultValue={[0, 5]}
                onChange={handleFilterRating}
                value={[value.from, value.to]}
              />
              <SmileOutlined className={nextColorCls} />
            </div>
          </Card>

          <Card>
            <h6 className="display-inline-block fw-bold">Availability</h6>
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
          </Card>
        </div>
      </div>
      <FreelancerListCards filterOption={filterOption} saved={saved} />
    </Row>
  )
}
