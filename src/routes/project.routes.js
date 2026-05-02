import { Router } from "express";

import { 
    addMembersToProject, 
    deleteProject,
    createproject,
    deleteMember,
    getProjects,
    getProjectMember,
    updateMemberRole,
    getProjectById,
    updateProject, } 
    from "../controllers/project.controllers.js"

import { validate } 
        from "../middlewares/validators.middleware.js";

import {createProjectValidator,
        addMembertoProjectValidator} 
        from "../validators/index.js"

import {verifyJWT, 
        validateProjectPermission}
        from "../middlewares/auth.middleware.js"
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createproject)


router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject,

    )

router
    .route("/:projectId/members")
    .get(validateProjectPermission(AvailableUserRole), getProjectMember)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMembertoProjectValidator(),
        validate,
        addMembersToProject
    )


router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]),updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteMember)



export default router