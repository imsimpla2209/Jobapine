import ReactApexChart from 'react-apexcharts'
import { Typography } from 'antd'
import { MinusOutlined } from '@ant-design/icons'
import lineChart from './configs/lineChart'
import { ApexOptions } from 'apexcharts'
import { useEffect } from 'react'
import { getUserSignUpStats } from 'src/api/admin-apis'

function LineChart() {
  const { Title, Paragraph } = Typography

  useEffect(() => {
    getUserSignUpStats()
  }, [])

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Posted Jobs</Title>
          {/* <Paragraph className="lastweek">
            than last week <span className="bnb2">+30%</span>
          </Paragraph> */}
        </div>
        {/* <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Traffic</li>
            <li>{<MinusOutlined />} Sales</li>
          </ul>
        </div> */}
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options as ApexOptions}
        series={
          [
            {
              name: 'Mobile apps',
              data: [350, 40, 300, 220, 500, 250, 400, 230, 500],
              offsetY: 0,
            },
            // {
            //   name: 'Websites',
            //   data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
            //   offsetY: 0,
            // },
          ] as any
        }
        type="area"
        height={350}
        width={'100%'}
      />
    </>
  )
}

export default LineChart
