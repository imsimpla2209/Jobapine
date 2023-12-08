import { Avatar, List } from 'antd'
import { Link } from 'react-router-dom'

export default function ContractsInJob({ contracts }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={contracts}
      renderItem={(item, index) => {
        const { freelancer } = item as any
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={freelancer.images?.[0]} />}
              title={<Link to={`/freelancer-profile/${freelancer._id}`}>{freelancer.name}</Link>}
              description={freelancer.intro?.substring(0, 50) + '...'}
            />
          </List.Item>
        )
      }}
    />
  )
}
