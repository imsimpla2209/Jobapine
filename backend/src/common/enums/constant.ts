export const FERoutes = {
  allProposals: '/all-proposals/',
  allContract: '/all-contract',
  myJobs: '/my-jobs',
  allInvitation: '/invitations',
  allMessages: '/messages',
}

export const FEMessage = (extra?: any) => {
  return {
    createProposal: {
      name: `Your Posted got a new proposal for the job: ${extra}`,
      name_vi: `Công việc của bạn vừa nhận được 1 proposal mới tới công việc: ${extra}`,
    },
    rejectProposalDueJobDeleted: {
      name: `The job: ${extra} you applied is deleted by owner and you got a you will be refunded the sickPoints used to create the proposal`,
      name_vi: `Công việc: ${extra} bạn nộp đơn đã bị chủ sở hữu xóa và bạn nhận được công việc, bạn sẽ được hoàn lại số sickPoints đã dùng để tạo đề xuất`,
    },
    rejectProposal: {
      name: `The owner of job: ${extra} | rejects your proposal`,
      name_vi: `Chủ sở hữu công việc: ${extra} | từ chối đề xuất của bạn`,
    },
    acceptRequest: {
      name: 'Your Request Message has been accepted',
      name_vi: 'Yêu cầu giao tiếp trực tiếp của bạn đã được chấp thuận',
    },
    rejectRequest: {
      name: 'Your Request Message has been reject',
      name_vi: 'Yêu cầu giao tiếp trực tiếp của bạn đã bị từ chối',
    },
    createContract: {
      name: 'You got a new contract',
      name_vi: 'Bạn vừa nhận được 1 đề nghị hợp đồng mới',
    },
    requestMessage: {
      name: `You got a new request direct message from ${extra}`,
      name_vi: `Bạn vừa nhận được 1 đề nghị trò chuyện trực tiếp từ ${extra}`,
    },
    gotJob: {
      name: 'You just got a new Job bro, work now',
      name_vi: 'Bạn vừa nhận được 1 công việc mới, bro. Triển luôn và ngay',
    },
    acceptContract: {
      name: 'Your proposed contract has been accepted',
      name_vi: 'Đề nghị hợp đồng làm việc của bạn đã được đồng thuận',
    },
    rejectContract: {
      name: 'Your proposed contract has been rejected',
      name_vi: 'Đề nghị hợp đồng làm việc của bạn đã bị từ chối',
    },
    phoneSMSVerify: `JobSickers-Biggest Application Marketplace \n\nYour OTP verification code is/Mã xác thực số điện thoại của bạn là [ ${extra} ]`,
  }
}
