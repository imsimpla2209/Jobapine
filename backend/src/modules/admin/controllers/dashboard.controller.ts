/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { Job } from '@modules/job'
import { User } from '@modules/user'
import { EJobStatus } from 'common/enums'
import moment from 'moment'

export const getUserSignUpStats = async (req, res, next) => {
  try {
    const today = moment().startOf('day')
    const twoMonthsAgo = moment().subtract(2, 'months').startOf('day')

    const dateArray = []
    let currentDate = moment(twoMonthsAgo)
    while (currentDate <= today) {
      dateArray.push({
        createdAt: {
          $gte: moment(currentDate).toDate(),
          $lte: moment(currentDate).endOf('day').toDate(),
        },
      })
      currentDate = moment(currentDate).add(1, 'days')
    }

    const userStats = await User.aggregate([
      {
        $match: {
          $or: dateArray,
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            type: '$lastLoginAs',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          totalUser: { $sum: '$count' },
          types: {
            $push: {
              type: '$_id.type',
              total: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalUser: 1,
          types: 1,
        },
      },
    ])

    // Create an object to hold results
    const result = {}

    // Fill the result object with the data and fill missing dates with zero
    let currentDateToCheck = moment(twoMonthsAgo)
    while (currentDateToCheck <= today) {
      const formattedDate = currentDateToCheck.format('YYYY-MM-DD')
      const foundData = userStats.find(data => data.date === formattedDate)
      if (foundData) {
        result[formattedDate] = foundData
      } else {
        result[formattedDate] = {
          totalUser: 0,
          types: [
            {
              type: 'Client',
              total: 0,
            },
            {
              type: 'Freelancer',
              total: 0,
            },
          ],
          date: formattedDate,
        }
      }
      currentDateToCheck = currentDateToCheck.add(1, 'days')
    }

    // Convert the result object to an array
    const finalResult = Object.values(result)

    return res.status(200).json(finalResult)
  } catch (error) {
    return next(error)
  }
}

export const getProjectStats = async (req, res, next) => {
  try {
    const { startDate, endDate, timelineOption } = req.body
    const realEndDate = endDate || new Date()

    let timeline = []
    let currentDate = moment(startDate)

    if (timelineOption === 'daily') {
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'day')
      }
    } else if (timelineOption === 'weekly') {
      // Use ISOWeek to specify date time
      const startWeek = moment(startDate).isoWeek()
      const endWeek = moment(realEndDate).isoWeek()
      for (let week = startWeek; week <= endWeek; week++) {
        timeline.push(`Week ${week}, ${moment(startDate).isoWeek(week).format('YYYY')}`)
      }
    } else if (timelineOption === 'monthly') {
      // Use ISOMonth to specify date time
      while (currentDate <= moment(realEndDate)) {
        timeline.push(moment(currentDate).startOf('month').format('YYYY-MM'))
        currentDate = moment(currentDate).add(1, 'month')
      }
    }

    const projectStats = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment(startDate).toDate(),
            $lte: moment(realEndDate).toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timelineOption === 'monthly' ? '%Y-%m' : timelineOption === 'weekly' ? 'Week %V, %Y' : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          openJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.OPEN] }, 1, 0] } },
          wipJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.INPROGRESS] }, 1, 0] } },
          doneJobs: { $sum: { $cond: [{ $eq: ['$currentStatus', EJobStatus.COMPLETED] }, 1, 0] } },
        },
      },
    ])
    const statsByTimeline = timeline.map(date => {
      const foundStat = projectStats.find(stat => stat._id === date)
      return {
        date,
        count: foundStat || { openJobs: 0, wipJobs: 0, doneJobs: 0 },
      }
    })

    return res.status(200).json(statsByTimeline)
  } catch (error) {
    return next(error)
  }
}
