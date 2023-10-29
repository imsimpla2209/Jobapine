import { useTranslation } from "react-i18next";
import { timeAgo } from "src/utils/helperFuncs";
import img from '../../../assets/img/icon-user.svg'

export default function OutgoingMsg({ msg }) {
	const { t } = useTranslation(['main'])
	return (
		<div className="outgoing_msg">
			<div className="sent_msg">
				<p>{msg.content}</p>
				<span className="time_date">{timeAgo(msg?.createdAt, t)}</span>
			</div>

		</div>
	)
}
