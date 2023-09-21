import { Button, Card, Checkbox, Col, Layout, Menu, Row, Space, Tag, theme } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import React, { useState } from 'react'
import styled from 'styled-components'

interface SelectedValues {
  [menuId: number]: string[]
}
export default function JobList() {
  const { Sider } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const dataMenu = [
    {
      title: 'Job type',
      option: [
        {
          name: 'Hourly',
          quantity: '426',
          value: 'Hourly',
        },
        {
          name: 'Fixed-Price',
          quantity: '323',
          value: 'Fixed-Price',
        },
      ],
    },
    {
      title: 'Client history',
      // eslint-disable-next-line no-sparse-arrays
      option: [
        {
          name: 'No hires',
          quantity: '397',
          value: 'No hires',
        },
        {
          name: '1 to 9 hires',
          quantity: '190',
          value: '1 to 9 hires',
        },
        ,
        {
          name: '10+ hires',
          quantity: '198',
          value: '10+ hires',
        },
      ],
    },
  ]

  const dataCard = [
    {
      title: 'Logo + Business Card Design for PrecisionPrint3D',
      dc1: 'Hourly: $15.00-$35.00 Intermediate Est. time: Less than 1 month, Less than 30 hrs/week',
      dc2: "We are seeking a talented designer to create a visually captivating logo for precisionprint3d, a company specializing in 3D printing services. The logo should reflect the company's dedication to precision and craftsmanship, while capturing the innovation and creativity of the 3D printing industry. The ideal candidate should have experience in logo design and be able to convey the company's motto, 'Crafting Perfection, Layer by Layer', through the",
      tag: ['Chatbot Development', 'Lead Generation'],
    },
    {
      title: 'Logo + Business Card Design for PrecisionPrint3D',
      dc1: 'Hourly: $15.00-$35.00 Intermediate Est. time: Less than 1 month, Less than 30 hrs/week',
      dc2: "We are seeking a talented designer to create a visually captivating logo for precisionprint3d, a company specializing in 3D printing services. The logo should reflect the company's dedication to precision and craftsmanship, while capturing the innovation and creativity of the 3D printing industry. The ideal candidate should have experience in logo design and be able to convey the company's motto, 'Crafting Perfection, Layer by Layer', through the",
      tag: ['Chatbot Development', 'Lead Generation'],
    },
    {
      title: 'Logo + Business Card Design for PrecisionPrint3D',
      dc1: 'Hourly: $15.00-$35.00 Intermediate Est. time: Less than 1 month, Less than 30 hrs/week',
      dc2: "We are seeking a talented designer to create a visually captivating logo for precisionprint3d, a company specializing in 3D printing services. The logo should reflect the company's dedication to precision and craftsmanship, while capturing the innovation and creativity of the 3D printing industry. The ideal candidate should have experience in logo design and be able to convey the company's motto, 'Crafting Perfection, Layer by Layer', through the",
      tag: ['Chatbot Development', 'Lead Generation'],
    },
    {
      title: 'Logo + Business Card Design for PrecisionPrint3D',
      dc1: 'Hourly: $15.00-$35.00 Intermediate Est. time: Less than 1 month, Less than 30 hrs/week',
      dc2: "We are seeking a talented designer to create a visually captivating logo for precisionprint3d, a company specializing in 3D printing services. The logo should reflect the company's dedication to precision and craftsmanship, while capturing the innovation and creativity of the 3D printing industry. The ideal candidate should have experience in logo design and be able to convey the company's motto, 'Crafting Perfection, Layer by Layer', through the",
      tag: ['Chatbot Development', 'Lead Generation'],
    },
  ]
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({})

  const allSelectedValues = [].concat(...Object.values(selectedValues))
  const log = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e)
  }

  const onChange = (menuId: number, selectedList: CheckboxValueType[]) => {
    const selectedStrings = selectedList.map(String)

    setSelectedValues({
      ...selectedValues,
      [menuId]: selectedStrings,
    })
    console.log(selectedValues)
  }
  return (
    <>
      <Space size={[0, 8]} wrap>
        {allSelectedValues.map(item => (
          <StyleTag onClose={log}>{item}</StyleTag>
        ))}
      </Space>
      <Layout>
        <Layout>
          <Sider
            width={300}
            style={{
              background: colorBgContainer,
            }}
          >
            {dataMenu.map((item, index) => (
              <div key={index}>
                <Checkbox.Group
                  style={{ width: '100%', display: 'block' }}
                  value={selectedValues[index] || []}
                  onChange={selectedList => onChange(index, selectedList)}
                >
                  <h4>{item.title}</h4>
                  {item.option.map(i => (
                    <Space direction="vertical" size="middle" style={{ display: 'flex', paddingTop: '12px' }}>
                      <StyleCheckbox className="hove" value={i?.value}>
                        {i?.name} <span>({i?.quantity})</span>
                      </StyleCheckbox>
                    </Space>
                  ))}
                </Checkbox.Group>
              </div>
            ))}
          </Sider>
          <Layout>
            {dataCard.map(item => (
              <Card style={{ width: '100%', border: 'none', borderRadius: 'none ', borderBottom: '1px solid #ccc' }}>
                <Row justify="space-between">
                  <Col>
                    <h2>{item.title}</h2>
                  </Col>
                  <Col>
                    <Button
                      style={{ color: '#108a00', backgroundColor: '#ffff', borderColor: '#108a00' }}
                      type="primary"
                      shape="round"
                      size="large"
                    >
                      View job
                    </Button>
                  </Col>
                </Row>

                <p>{item.dc1}</p>
                <p>{item.dc2}</p>
                <div>
                  {item.tag.map(i => (
                    <Tag
                      style={{ borderRadius: '10rem', height: '32px', lineHeight: '32px', backgroundColor: '#f2f7f2' }}
                    >
                      {i}
                    </Tag>
                  ))}
                </div>
              </Card>
            ))}
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

export const CustomMenu = styled(Menu)`
  .ant-menu-item-only-child {
    height: auto !important ;
    background-color: #ffff;
  }
`
const StyleTag = styled(Tag)`
  background-color: #108a00;
  height: 32px;
  text-align: center;
  line-height: 32px;
  border-radius: 10rem;
  color: #ffff;
`
const StyleCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #108a00;
    border-color: #108a00;
  }
  .hove:hove {
    background-color: #108a00;
    border-color: #108a00;
  }
`
