import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const TransactionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  employeeId: {
    type: String,
    required: true,
  },
  sourceAccountId: {
    type: String,
    required: true,
  },
  destinationAccountId: {
    type: String,
    required: true,
  },
  branchId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    required: true,
    default: () => true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PROCESSED'],
    default: () => 'PENDING'
  },
  methodId: {
    type: String,
  }

}, { timestamps: true });

const TransactionModel = mongoose.model("Transactions", TransactionSchema);

export default TransactionModel;
