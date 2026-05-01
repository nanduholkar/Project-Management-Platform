import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/project.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

import { UserRolesEnum } from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";

const getProjects = asyncHandler(async (req, res) => {

    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from : "projects",
                localField: "project",
                foreignField: "_id",
                as: "projects",
                pipeline:[
                    {
                        $lookup:{
                            from : "projectmembers",
                            localField: "_id",
                            foreignField: "project",
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    },

                ]

            }
        },
        {
            $unwind: "$project"
        },
        {
            $project : {
                project:{
                    _id: 1,
                    name: 1,
                    description:1,
                    members:1,
                    createdAt: 1,
                    createdBy: 1
                },
                role: 1,
                _id: 0
            }
        }

    ])
    return res
      .status(200)
      .json(
        new ApiResponse(200, projects, "Projects fetched successfully")
      )
})

const getProjectById = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project Not found ")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, project, "Project fetched successfully")
      )
})


const createproject = asyncHandler(async (req, res) =>{

    const {name, description} = req.body;

    if (!name || !description){
        throw new ApiError(400, "Name and description are required")
    }

    const project = await Project.create({
        name, 
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id)
    })

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project : new mongoose.Types.ObjectId(project._id),
        role : UserRolesEnum.ADMIN
    })

    return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "Project Created Successfully"
        )
      )
})


const updateProject  = asyncHandler(async (req, res) =>{
    const {name, description} = req.body
    const {projectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid Project ID");
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const project = await Project.findByIdAndUpdate(
        projectId, 
        {
            name, 
            description
        },
        {new: true}


    )

    if(!project){
        throw new ApiError(404, "Project Not found")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project updated Successfully"
        )
      )
})


const deleteProject  = asyncHandler(async (req, res) =>{

    const {projectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid Project ID");
    }

    const project = await Project.findByIdAndDelete(projectId)

    if(!project){
        throw new ApiError(404, "Project Not found")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project deleted Successfully"
        )
      )

})


const addMembersToProject = asyncHandler(async (req, res) =>{
    const {email, role} = req.body
    const {projectId} = req.params
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    await ProjectMember.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true, 
            upsert: true
        }
    )

    return res
      .status(200)
      .json(
        new ApiResponse(201, {}, "Project member added successfully")
      )
})


const getProjectMember  = asyncHandler(async (req, res) =>{
    //test
})


const updateMemberRole  = asyncHandler(async (req, res) =>{
    //test
})


const deleteMember  = asyncHandler(async (req, res) =>{
    //test
})



export{
    addMembersToProject, 
    deleteProject,
    createproject,
    deleteMember,
    getProjects,
    getProjectMember,
    updateMemberRole,


}
