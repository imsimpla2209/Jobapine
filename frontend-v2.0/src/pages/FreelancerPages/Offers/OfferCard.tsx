/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Divider, Modal, Popconfirm, Space, Tag, Typography, Image } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProposalCard from 'src/Components/FreelancerComponents/ProposalCard';
import { acceptMessageRoom, rejectMessageRoom, updateStatusInvitation } from 'src/api/message-api';
import { getProposal } from 'src/api/proposal-apis';
import { EStatus } from 'src/utils/enum';
import { currencyFormatter, formatDay, pickName } from 'src/utils/helperFuncs';

const { Text } = Typography

export default function OfferCard({ invitation, getOffers }) {
	const [decide, setDecide] = useState<any>();
	const [proposal, setProposal] = useState();
	const { t, i18n } = useTranslation(['main'])

	useEffect(() => {
		getProposal(invitation.content?.proposal).then(res => {
			setProposal(res.data);
		})
	}, [invitation])

	const accept = () => {
		if (invitation?._id) {
			acceptMessageRoom(invitation?._id).then(() => {
				return setDecide(EStatus.ACCEPTED);
			})
		}
	}

	const decline = () => {
		if (invitation?._id) {
			rejectMessageRoom(invitation?._id).then(() => {
				return setDecide(EStatus.REJECTED);
			})
		}
	}

	const info = () => {
		Modal.info({
			title: `${t("Details")}`,
			content: (
				<div>
					{proposal && <>
						Proposal
						<ProposalCard proposal={proposal} jobId={invitation?.content?.jobId} ind={1} isInMSG={true} ></ProposalCard>
					</>}
				</div>
			),
			onOk() { },
		});
	};
	return (

		<div className="col-11 mx-auto bg-gray border border-gray rounded p-5 mb-4 text-center">
			{
				(invitation) &&
				<>
					<div className='d-flex justify-content-around'>
						{
							invitation?.content?.fromUser && <Card className='d-xl-flex d-none' bodyStyle={{ padding: 16 }}>
								<Space direction="vertical" size={10}>
									<Image
										height={120}
										src={invitation?.content?.fromUser?.avatar}
										fallback="https://i2-prod.manchestereveningnews.co.uk/sport/football/article27536776.ece/ALTERNATES/s1200c/1_GettyImages-1615425379.jpg"
									/>
									<div className="center">
										<Tag color="#f50" style={{ fontSize: 20, padding: 8 }}>
											{invitation?.content?.fromUser?.name}
										</Tag>
									</div>
									<Divider style={{ margin: 0 }} />
									<Text>
										<b>DOB: </b>
										{formatDay(invitation?.content?.fromUser?.dob)}
									</Text>
									<Text>
										<b>Phone: </b>
										{invitation?.content?.fromUser?.phone || 'None'}
									</Text>
									<Text>
										<b>Email: </b>
										{invitation?.content?.fromUser?.email}
									</Text>
								</Space>
							</Card>
						}
						<div>
							<p><strong>{t("Request to message")}: </strong>{pickName(invitation?.content?.content, i18n.language)}</p>
							<p><strong>{t("Name")}: </strong>{invitation?.content?.fromUser?.name}</p>
							<p><strong>{t("End date")}: </strong>{new Date(Number(invitation?.dueDate)).toLocaleString()}</p>
							<Button
								onClick={async () => {
									info();
								}}
							>
								{t("Details")}
							</Button>
						</div>
					</div>
					<Popconfirm
						title="Confirm"
						description="Are you sure?"
						onConfirm={accept}
						okText="Yes"
						cancelText="No"
					>
						<button
							className="btn bg-jobsicker me-1"
						>
							{t("Accept")}
						</button>
					</Popconfirm>
					<Popconfirm
						title="Confirm"
						description="Are you sure?"
						onConfirm={decline}
						okText="Yes"
						cancelText="No"
					>
						<button
							className="btn btn-danger ms-1"
						>
							{t("Reject")}
						</button>
					</Popconfirm>
				</>
			}
		</div>
	)
}
