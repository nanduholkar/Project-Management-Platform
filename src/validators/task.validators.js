import { body } from "express-validator";

/**
 * CREATE TASK
 */
export const createTaskValidator = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),

        body("description")
            .notEmpty()
            .withMessage("Description is required"),

        body("status")
            .optional()
            .isIn(["todo", "in-progress", "done"])
            .withMessage("Invalid status")
    ];
};

/**
 * UPDATE TASK
 */
export const updateTaskValidator = () => {
    return [
        body("title")
            .optional()
            .notEmpty(),

        body("description")
            .optional()
            .notEmpty(),

        body("status")
            .optional()
            .isIn(["todo", "in-progress", "done"])
    ];
};

/**
 * CREATE SUBTASK
 */
export const createSubTaskValidator = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("Subtask title is required")
    ];
};