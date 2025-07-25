import RecordModel from "../models/record.model.js"



export const mostActiveUser = async (req, res) => {
    try {
        // let record = await RecordModel.find()
        const record = await RecordModel.aggregate([
            { $unwind: "$loginUser" },
            { $sort: { "loginUser.userCount": -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "loginUser.user",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$userInfo._id",
                    name: "$userInfo.name",        // adjust fields of User model
                    email: "$userInfo.email",
                    loginCount: "$loginUser.userCount"
                }
            }
        ]);
        res.status(200).send({ status: true, message: "Top 5 most active users", data: record });
    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }
}

export const mostActiveTags = async (req, res) => {
    try {
        const topTags = await RecordModel.aggregate([
  { $unwind: "$tags" },
  { $sort: { "tags.tagCount": -1 } },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      tagName: "$tags.tagName",
      tagCount: "$tags.tagCount"
    }
  }
]);

res.status(200).send({ status: true, message: "Top 5 tags", data: topTags });
    }  catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }
}