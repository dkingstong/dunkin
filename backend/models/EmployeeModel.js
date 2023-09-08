import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const EmployeeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  employerId: {
    type: String,
    required: true,
  },
  employerBranchId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  methodId: {
    type: String
  }

}, { timestamps: true });

const EmployeeModel = mongoose.model("Employees", EmployeeSchema);

export default EmployeeModel;