import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/project.models.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";


const getProjects = asyncHandler(async (req, res) => {
    //test
})

const getProjectId = asyncHandler(async (req, res) => {
    //test
})


const createproject = asyncHandler(async (req, res) =>{
    //test
})


const deleteProject  = asyncHandler(async (req, res) =>{
    //test
})


const addMembersToProject = asyncHandler(async (req, res) =>{
    //test
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
    getProjectId,
    getProjectMember,
    updateMemberRole,


}
