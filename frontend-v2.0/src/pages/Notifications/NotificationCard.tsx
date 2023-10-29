import React from 'react'
import { Link } from 'react-router-dom'
import img from "../../assets/img/icon-user.svg";
import { useTranslation } from 'react-i18next';
import { timeAgo } from 'src/utils/helperFuncs';
// import { auth, db } from '../../firebase';


export default function NotificationCard({ notification, collectionName, getNotifications }) {
	const { t } = useTranslation(['main'])

	const remove = () => {
		// db.collection(collectionName)
		//     .doc(auth.currentUser.uid)
		//     .collection("notification")
		//     .doc(docID)
		//     .delete().then(res => getNotifications())
	}

	const updateShow = () => {
		// db.collection(collectionName)
		//     .doc(auth.currentUser.uid)
		//     .collection("notification")
		//     .doc(docID).update({ isShow: true })
	}


	return (
		<div className="row border border-1 py-4 px-2" style={{ backgroundColor: !notification.isDeleted ? "white" : "#e1f5b1" }}>
			<div className="col-1">
				<img style={{ height: "40px", width: "40px" }} className="rounded-circle bg-white" src={notification?.image ? notification?.image : img} alt="" />
			</div>
			<p className="col-3">{timeAgo(notification?.createdAt, t)}</p>
			{/* <p className="col-2">{data?.type}</p> */}
			<Link style={{ display: "contents" }}
				to={notification?.path}
				onClick={updateShow}
			>
				<p className="col-5">
					{notification?.content}
				</p>
			</Link>
			<div className="col-1" style={{ cursor: "pointer" }} onClick={remove}>
				<i className="fas fa-times text-danger fs-4"></i>
			</div>
		</div>
	)
}
