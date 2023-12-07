import { Avatar, List } from 'antd'

export default function ContractsInJob({ contracts }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={contracts}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
            title={<a href="https://ant.design">{123}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />
  )
}
