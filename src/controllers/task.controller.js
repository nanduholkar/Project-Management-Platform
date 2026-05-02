import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose, { mongo } from "mongoose";

import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";



const getTasks = asyncHandler(async (req, res) => {
    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project Not Found !")
    }

    const tasks = await Task.find({
        project : new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName")


    return res
      .status(200)
      .json(
        new ApiResponse(200, tasks , "Task fetched successfully")
      )
})

const createTask = asyncHandler(async (req, res) => {

    const {title, description, assignedTo, status} = req.body
    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project Not Found !")
    }

    const files = req.files || []

    const attachments = files.map((file) =>{
        return{
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype : file.mimetype,
            size: file.size
        }
    })
    const task = await Task.create ({
        title, 
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo): undefined,
        status: status,
        assignedBy : new mongoose.Types.ObjectId(req.user._id) ,
        attachments

    })
    return res
      .status(201)
      .json(
        new ApiResponse(201, task , "Task Created successfully")
      )

})

const getTaskById = asyncHandler(async (req, res) => {
    const {taskId} = req.params
    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from : 'users',
                localField: "assignedTo",
                foreignField: "_id", 
                as: "assignedTo", 
                pipeline: [
                    {
                        $project:{

                            _id: 1,
                            username: 1,
                            fullName : 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from : 'subtasks',
                localField: "_id",
                foreignField: "task", 
                as: "subtasks", 
                pipeline:[
                    {
                        $lookup:{
                            from: "users",
                            localField: "createdBy",
                            foreignField:"_id",
                            as : "createdBy",
                            pipeline:[
                                {
                                    $project:{
                                        _id : 1,
                                        username: 1,
                                        fullName:1, 
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    },
                    
                ]
            }
        },
        {
            $addFields:{
                assignedTo:{
                    $arrayElemAt:["$assignedTo", 0]
                }
            }
        }
    ])

    if(!task || task.length === 0){
        throw new ApiError(404, "Task not found")
    }

    return res.status(200).json( new ApiResponse(200, task[0], "Task fetched Successfully"))
})
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(
        taskId,
        updates,
        { new: true }
    );

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task deleted successfully")
    );
});
const createSubTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Parent task not found");
    }

    const newSubTask = await subtask.create({
        title,
        task: taskId,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, newSubTask, "Subtask created successfully")
    );
});
const updateSubTask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;
    const updates = req.body;

    const updated = await subtask.findByIdAndUpdate(
        subtaskId,
        updates,
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updated, "Subtask updated successfully")
    );
});
const deleteSubTask = asyncHandler(async (req, res) => {
    const { subtaskId } = req.params;

    const deleted = await subtask.findByIdAndDelete(subtaskId);

    if (!deleted) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deleted, "Subtask deleted successfully")
    );
});


export{
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask

}
