import { Booking } from "../booking/booking.model"
import { Tour } from "../tour/tour.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"




const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)


const getBookingStats = async () => {
   const totalUserPromise = await User.countDocuments()

   const totalActiveUsersPromise = User.countDocuments({isActive: IsActive.ACTIVE})
   const totalInActiveUsersPromise = User.countDocuments({isActive: IsActive.INACTIVE})
   const totalBlockedUsersPromise = User.countDocuments({isActive: IsActive.BLOCKED})
   const newUsersInLast7DaysPromise = User.countDocuments({
    createAt: {$gte: sevenDaysAgo}
   })
   const newUsersInLast30DaysPromise = User.countDocuments({
    createAt: {$gte: thirtyDaysAgo}
   })

   const usersByRolePromise = User.aggregate([
    //stage -1 : Grouping users by role and count total users in each role
    {
        $group: {
            _id: "$role",
            count: {$sum: 1}
        }
    }
   ])

   const [totalUsers, totalActiveUsers, totalInactiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
    totalUserPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise
   ])
   return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole
   }
   
   
}
const getTourStats = async () => {
   
   const totalTourPromise = Tour.countDocuments()

   const totalTourByTourTypePromise = Tour.aggregate([
    // stage-1 : connect Tour Type model - lookup stage
    {
        $lookup: {
            from: "tourtypes",
            localField: "tourType",
            foreignField: "_id",
            as: "type"
        }
    },
     //stage - 2 : unwind the array to object
     {
        $unwind: "$type"
     },

        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$type.name",
                count: {$sum: 1}
            }
        }
   ])

   const avgTourCostPromise = Tour.aggregate([
     //Stage-1 : group the cost from, do sum, and average the sum
     {
        $group: {
            _id: null,
            agvCostFrom: {$avg: "$costFrom"}
        }
     }
   ])

   const totalTourByDivisionPromise = Tour.aggregate([
    // stage-1 : connect Division model - lookup stage
    {
        $lookup: {
            from: "divisions",
            localField: "division",
            foreignField: "_id",
            as: "division"
        }
    },
        //stage - 2 : unwind the array to object
        {
            $unwind: "$division"
        },

        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$division.name",
                count: {$sum: 1}
            }
        }
   ])

   const totalHighestBookedTourPromise = Booking.aggregate([
     // stage-1 : Group the tour




     
   ])
   
}


export const StatsService = {
    getBookingStats,
    getTourStats
}