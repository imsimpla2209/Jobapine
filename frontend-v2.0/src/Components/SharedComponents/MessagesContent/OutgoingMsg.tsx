import { useTranslation } from "react-i18next";
import { timeAgo } from "src/utils/helperFuncs";
import img from '../../../assets/img/icon-user.svg'

export default function OutgoingMsg({ msg, avatar }) {
	const { t } = useTranslation(['main'])
	return (
		<div className="outgoing_msg">
			<div className="sent_msg">
				<div className="row">
					<div className="col-10">
						<p>{msg.content}</p>
						<span className="time_date">{timeAgo(msg?.createdAt, t)}</span>
					</div>
					<div className="outcoming_msg_img col-2">
						<img
							className="fas rounded-circle border fa-user_img"
							src={avatar || img}
							alt="Profile Pic"
						/>
					</div>
				</div>

			</div>

		</div>
	)
}
