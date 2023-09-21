export enum EJobStatus {
  PENDING = 'pending',
  INPROGRESS = 'inProgress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  PAID = 'paid',
  LATE = 'late',
}

export enum ELevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  JUNIOR = 2,
  MID = 3,
  SENIOR = 4,
  MASTER = 5,
  EXPERT = 6,
}

export enum EComplexity {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  HELL = 3,
}

export enum EPaymenType {
  PERTASK = 'PerTask',
  PERHOURS = 'PerHour',
  PERWEEK = 'PerWeek',
  PERMONTH = 'PerMonth',
  WHENDONE = 'WhenDone',
}

export enum EError {
  authorization = 'Authorization is required!',
  userEmailNotFound = 'Invalid email!',
  invalidPassword = 'Invalid password!',
  invalidData = 'You have send invalid data!',
  unauthorized = 'Unauthorized',
  userAlreadyExists = 'User with this email address already exists!',
  incorrectRoom = 'Chat with this room does not exist',
  interlocutorNotFound = 'Chat with this interlocutor does not exist!',
  invalidRefreshToken = 'Invalid refreshToken!',
}

export enum EUserType {
  FREELANCER = 'Freelancer',
  CLIENT = 'Client',
}

export enum EPaymentMethod {
  VNPAY = 'VNPay',
  MOMO = 'Momo',
  CASHOUT = 'Cashout',
}
