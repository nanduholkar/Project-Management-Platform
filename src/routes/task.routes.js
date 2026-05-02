import { Router } from "express";
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} from "../controllers/task.controller.js";

import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validators.middleware.js";

import {
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator
} from "../validators/task.validators.js";

import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

/**
 * GLOBAL AUTH
 */
router.use(verifyJWT);

/**
 * PROJECT TASK ROUTES
 */

// GET all tasks in project
router.get(
    "/:projectId",
    validateProjectPermission([]),
    getTasks
);

// CREATE task
router.post(
    "/:projectId",
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createTaskValidator(),
    validate,
    createTask
);

// GET single task
router.get(
    "/:projectId/t/:taskId",
    validateProjectPermission([]),
    getTaskById
);

// UPDATE task
router.put(
    "/:projectId/t/:taskId",
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateTaskValidator(),
    validate,
    updateTask
);

// DELETE task
router.delete(
    "/:projectId/t/:taskId",
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteTask
);

// CREATE subtask
router.post(
    "/:projectId/t/:taskId/subtasks",
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createSubTaskValidator(),
    validate,
    createSubTask
);

// UPDATE subtask
router.put(
    "/:projectId/st/:subtaskId",
    validateProjectPermission([]),
    updateSubTask
);

// DELETE subtask
router.delete(
    "/:projectId/st/:subtaskId",
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteSubTask
);

export default router;