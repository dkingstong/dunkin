import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const AccountSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  type: {
    type: String,
    enum: ['SOURCE', 'DESTINATION'],
  },
  // this is employee._id and not employee.methodId which is what is required for Method API
  holderId: {
    type: String,
    required: true,
  },
  routingNumber: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  plaidId: {
    type: String
  },
  loanAccountNumber: {
    type: String,
  },
  merchantId: {
    type: String
  },
  methodId: {
    type: String
  }

}, { timestamps: true });

const AccountModel = mongoose.model("Accounts", AccountSchema);

export default AccountModel;