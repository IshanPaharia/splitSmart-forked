import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createExpense,
  getGroupExpenses,
  approveExpense,
  updateExpense,
  deleteExpense,
  getgroupBalances,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createExpense);
router.get("/group/:groupId", getGroupExpenses);
router.get("/group/:groupId/balances", getgroupBalances);
router.put("/:id/approve", approveExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
