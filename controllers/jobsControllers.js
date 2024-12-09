import mongoose from "mongoose";
import moment from "moment";
import jobModals from "../models/jobModals.js";

//////////////create-//////////////////
export const createjobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("All fields are requires");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobModals.create(req.body);
  res.status(201).json({
    job,
  });
};

//////////////getall-//////////////////
export const getalljobController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //conditions for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  // logic filters
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobModals.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  //pagging
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  queryResult = queryResult.skip(skip).limit(limit);

  //counjobs
  const totaljobs = await jobModals.countDocuments(queryResult);
  const numberofpage = Math.ceil(totaljobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobModals.find({ createdBy: req.user.userId });
  res.status(200).json({
    totaljobs,

    jobs,
    numberofpage,
  });
};
//////////////update-//////////////////
export const updatejobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  const job = await jobModals.findOne({ _id: id });
  if (!job) {
    next(`no jobs find with this ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("your not authrize update this  job");
    return;
  }
  const updatejob = await jobModals.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    updatejob,
  });
};

//////////////delate-//////////////////
export const delatejobController = async (req, res, next) => {
  const { id } = req.params;
  const job = await jobModals.findOne({ _id: id });
  if (!job) {
    next(`no jobs find with this ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("your not authrize delete this  job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({
    message: "Success job delete",
  });
};

//////////////jobs-stats//////////////////
export const jobstatsController = async (req, res) => {
  const stats = await jobModals.aggregate([
    //searching
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultstats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  let monthlyapplication = await jobModals.aggregate([
    //searching
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  monthlyapplication = monthlyapplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(200).json({
    totalstats: stats.length,
    stats,
    defaultstats,
    monthlyapplication,
  });
};
