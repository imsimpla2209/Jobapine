import { timeAgo } from 'src/utils/helperFuncs'
import img from '../../../assets/img/icon-user.svg'
import { useTranslation } from 'react-i18next'

export default function IncomeMsg({ msg, avatar }) {
	const { t } = useTranslation(['main'])
	return (
		<div className="incoming_msg">
			<div className="incoming_msg_img">
				<img
					className="fas rounded-circle border fa-user_img"
					src={avatar || img}
					alt="Profile Pic"
				/>
			</div>
			<div className="received_msg">
				<div className="received_withd_msg">
					<p>{msg?.content}</p>
					<span className="time_date">{timeAgo(msg?.createdAt, t)}</span>
				</div>
			</div>
		</div>
	)
}
