const express = require("express");
const {subTaskController} = require("../controllers/subTask.controller");
const { authenticateToken } = require("../middlewares");

const router = express.Router()
const base="/subtask"

router.get(`${base}/:taskId`, (req, res) => {subTaskController.getByTaskId(res, req.params.taskId)})
router.post(`${base}/:taskId`, authenticateToken, (req, res) => {subTaskController.create(res, req.params.taskId, req.body)})
router.put(`${base}/:subTaskId`,authenticateToken,  (req, res) => {subTaskController.update(res, req.params.subTaskId, req.body)})
router.delete(`${base}/:subTaskId`, authenticateToken, (req, res) => {subTaskController.deleteById(res, req.params.subTaskId)})
exports.subTaskRouter = router