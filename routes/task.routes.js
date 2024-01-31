const express = require("express");
const {taskController} = require("../controllers/task.controller")
const {authenticateToken} = require("../middlewares")

const router = express.Router()
const base="/task"

router.get(`${base}/`, (req, res) => {taskController.getByQuery(res, req.query)})
router.get(`${base}/all`, (req, res) => {taskController.getAll(res)})
router.post(`${base}/`, authenticateToken, (req, res) => {taskController.create(res,req.body)})
router.put(`${base}/:taskId`, authenticateToken, (req, res) => {taskController.updateById(req, res.body, req.params.taskId)})
router.delete(`${base}/:taskId`, authenticateToken, (req, res) => {taskController.deleteById(res, req.params.taskId)})

exports.taskRouter = router