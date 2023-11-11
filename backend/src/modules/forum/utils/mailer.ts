/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import SibApiV3Sdk from 'sib-api-v3-sdk'
import config from '@config/config'
import ApiErrorResponse from './ApiErrorResponse'
// const oauth_url = "https://developers.google.com/oauthplayground";

const initStmp = async () => {
  const client = SibApiV3Sdk.ApiClient.instance

  const apiKey = client.authentications['api-key']
  apiKey.apiKey = config.email.sibKey

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
  return tranEmailApi
}

type mailOptions = {
  from: string
  to: string
  subject: string
  html: string
  text: string
}

export const sendEmailFunc = async (
  email: string,
  template: string,
  subject?: string,
  text?: any,
  attachment?: any
) => {
  try {
    // const stmp = await initstmp()
    const sender = {
      email: process.env.BASE_EMAIL,
      name: 'Leaks Application',
    }
    const receivers = [
      {
        email,
      },
    ]
    const tranEmailApi = await initStmp()
    const sendMailMetaData = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: subject! || '',
      htmlContent: template,
      textContent: text || '',
    })
    console.log(sendMailMetaData)
    return sendMailMetaData
  } catch (error) {
    return error
  }
}

export const senVerification = async (email: string, name: string, url: string) => {
  try {
    const template = `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><style type="text/css">a,body {-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%}</style></head><body style="width:600px;max-width:600px;"><div border="1px solid #ccc" cellpadding="0" cellspacing="0" style="max-width:600px; background:#fff;"><div bgcolor="#ffffff" align="center" valign="top"style="padding:40px 20px 20px 20px;color:#341edb;font-size:45px;font-weight:1000;letter-spacing:2px;line-height:48px"><h1 style="font-size:40px;font-weight:700;margin:w-50">Leaks</h1></div><div bgcolor="#ffffff" align="center"style="padding:20px 30px 40px 30px;color:#000;font-size:16px;font-weight:600;line-height:25px"><p>Kindly verify your email to complete your account registration.</p></div><div bgcolor="#ffffff" align="center" style="padding:20px 30px 60px 30px"><div align="center" style="border-radius:30px" bgcolor="#000000"> <a href="${url}" target="_blank"style="background:#000;font-size:20px;color:#fff;text-decoration:none;color:#fff;text-decoration:none;padding:10px 55px;border-radius:2px;display:inline-block">VERIFY NOW </a> </div></div></div></body></html>`
    const sendMailMetaData = await sendEmailFunc(
      email,
      template,
      'Leaks email verification',
      'We sent this mail to activate your account'
    )
    return sendMailMetaData
  } catch (error) {
    throw error
  }
}

export const sendNotification = async (email: string, content?: string, title?: string, datetime?: any, url?: any) => {
  try {
    console.log('email: ', email)

    const template = `<!DOCTYPE html> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <style type="text/css"> a, body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100% } </style> </head> <body style="width:600px;max-width:600px;"> <div border="1px solid #ccc" cellpadding="0" cellspacing="0" style="max-width:600px; background:#fff; border: 1px solid #ccc"> <div bgcolor="#ffffff" align="center" valign="top" style="padding:40px 0px 20px 20px;color:#341edb;font-size:45px;font-weight:1000;letter-spacing:2px;line-height:48px;margin-bottom: 0;"> <h1 style="font-size:40px;font-weight:700;margin:w-50">Leaks</h1> <h1 style="font-size: 48px; font-weight: 400; margin: 2;">${title} <img src="https://th.bing.com/th/id/OIP.lE62x1N59IinU1S4RvBL6QHaHa?w=202&h=202&c=7&r=0&o=5&dpr=1.3&pid=1.7" width="125" height="120" style="display: block; border: 0px;" /> </div> <div bgcolor="#ffffff" align="center" style="padding:20px 30px 40px 30px;color:#000;font-size:16px;font-weight:600;line-height:25px"> <p style="margin: 0;">${content}</p> </div> <div bgcolor="#ffffff" align="center" style="padding:20px 30px 60px 30px"> <div align="center" style="border-radius:30px" bgcolor="#000000"> <a href="${url}" target="_blank" style="background:#000;font-size:20px;color:#fff;text-decoration:none;color:#fff;text-decoration:none;padding:10px 55px;border-radius:2px;display:inline-block">View Idea </a> </div> </div> </div> </body> </html>`
    const sendMailMetaData = await sendEmailFunc(
      email,
      template,
      'Ye5Sir Notification',
      `We sent it to notify you about ${title}`
    )
    console.log(sendMailMetaData)
    return sendMailMetaData
  } catch (error) {
    throw error
  }
}

export const sendResetPassword = async (email: string, name: string, code: string) => {
  try {
    const template = 's'
    const result = await sendEmailFunc(email, template, 'Ye5Sir reset password')
    if (result.response.status !== 200) {
      throw new ApiErrorResponse(
        `Send Email Failed, status code: ${result.response.status}, \nData: ${result.response.data} \n`
      )
    } else {
      return true
    }
  } catch (error) {
    return error
  }
}
