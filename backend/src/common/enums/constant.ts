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
      name_en: 'Your Posted got a new proposal',
      name_vi: 'Công việc của bạn vừa nhận được 1 proposal mới',
    },
    acceptRequest: {
      name_en: 'Your Request Message has been accepted',
      name_vi: 'Yêu cầu giao tiếp trực tiếp của bạn đã được chuẩn bị chấp thuận',
    },
    createContract: {
      name_en: 'You got a new contract',
      name_vi: 'Bạn vừa nhận được 1 đề nghị hợp đồng mới',
    },
    requestMessage: {
      name_en: `You got a new request direct message from ${extra}`,
      name_vi: `Bạn vừa nhận được 1 đề nghị trò chuyện trực tiếp từ ${extra}`,
    },
    gotJob: {
      name_en: 'You just got a new Job bro, work now',
      name_vi: 'Bạn vừa nhận được 1 công việc mới, bro. Triển luôn và ngay',
    },
    acceptContract: {
      name_en: 'Your proposed contract has been accepted',
      name_vi: 'Đề nghị hợp đồng làm việc của bạn đã được đồng thuận',
    },
  }
}
