import { Router } from "express";
import multer from "multer";
import {
  createTransaction,
  deleteTransaction,
  exportTransactionsCsv,
  importTransactionsCsv,
  listTransactions,
  updateTransaction
} from "../controllers/transaction.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { idParamsSchema } from "../validators/common.validators";
import {
  createTransactionSchema,
  transactionQuerySchema,
  updateTransactionSchema
} from "../validators/transaction.validators";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".csv") && file.mimetype !== "text/csv") {
      cb(new Error("Only CSV files are allowed"));
      return;
    }
    cb(null, true);
  }
});

export const transactionRouter = Router();

transactionRouter.use(authenticate, requireVerifiedEmail);
transactionRouter.get("/", validate({ query: transactionQuerySchema }), listTransactions);
transactionRouter.get("/export.csv", validate({ query: transactionQuerySchema }), exportTransactionsCsv);
transactionRouter.post("/import.csv", upload.single("file"), importTransactionsCsv);
transactionRouter.post("/", validate({ body: createTransactionSchema }), createTransaction);
transactionRouter.patch("/:id", validate({ params: idParamsSchema, body: updateTransactionSchema }), updateTransaction);
transactionRouter.delete("/:id", validate({ params: idParamsSchema }), deleteTransaction);
