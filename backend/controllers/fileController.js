import convert from 'xml-js'
import { PostFileSchema } from '../schemas/filesSchema.js'
import TransactionModel from '../models/TransactionModel.js'
import { v4 as uuidv4 } from 'uuid';
import { convertToNumber } from './helpers/fileHelpers.js'
import EmployeeModel from '../models/EmployeeModel.js'
import AccountModel from '../models/AccountModel.js'

export const postFile = async(file) => {
  const stringResult = convert.xml2json(file.buffer, {compact: true, spaces: 4})
  const result = JSON.parse(stringResult)
  const validatedResult = PostFileSchema.validate(result)

  if (validatedResult.error) {
    console.error('File could not be parsed')
    return res.status(500).send('Could not parse file')
  }

  const fileId = uuidv4()

  for(const record of result.rows.row) {
    const transaction = {
      branchId: record.Employee.DunkinBranch._text,
      amount: convertToNumber(record.Amount._text),
      fileId: fileId,
    }

    let existingEmployee = await EmployeeModel.findOne({employeeId: record.Employee.DunkinId._text})
    if(!existingEmployee) {
      const employee = {
        employeeId: record.Employee.DunkinId._text,
        employerId: record.Payor.DunkinId._text,
        employerBranchId: record.Employee.DunkinBranch._text,
        firstName: record.Employee.FirstName._text,
        lastName: record.Employee.LastName._text,
        dob: record.Employee.DOB._text,
        phoneNumber: '15121231111'
      }
      const newEmployee = new EmployeeModel(employee)
      const newEmployeeSaved = await newEmployee.save()
      existingEmployee = newEmployeeSaved
      transaction['employeeId'] = newEmployeeSaved._id
    } else {
      transaction['employeeId'] = existingEmployee._id
    }
    
    const [existingSourceAccount, existingDestinationAccount] = await Promise.all([
      AccountModel.findOne({ routingNumber: record.Payor.ABARouting._text, accountNumber: record.Payor.AccountNumber._text }),
      AccountModel.findOne({ plaidId: record.Payee.PlaidId._text, loanAccountNumber: record.Payee.LoanAccountNumber._text })
    ])
    if(!existingSourceAccount) {
      const sourceAccount = {
        type: 'SOURCE',
        holderId: record.Payor.DunkinId._text,
        routingNumber: record.Payor.ABARouting._text,
        accountNumber: record.Payor.AccountNumber._text,
      }
      const newSourceAccount = new AccountModel(sourceAccount)
      const newSourceAccountSaved = await newSourceAccount.save()
      transaction['sourceAccountId'] = newSourceAccountSaved._id
    } else {
      transaction['sourceAccountId'] = existingSourceAccount._id
    }
    
    if(!existingDestinationAccount) {
      const destinationAccount = {
        type: 'DESTINATION',
        holderId: existingEmployee._id,
        plaidId: record.Payee.PlaidId._text,
        loanAccountNumber: record.Payee.LoanAccountNumber._text
      }
      const newDestinationAccount = new AccountModel(destinationAccount)
      const newDestinationAccountSaved = await newDestinationAccount.save()
      transaction['destinationAccountId'] = newDestinationAccountSaved._id
    } else {
      transaction['destinationAccountId'] = existingDestinationAccount._id
    }

    const acceptedTransaction = new TransactionModel(transaction)
    await acceptedTransaction.save()
  }

  const transactions = await TransactionModel.find({ fileId }, null, { limit: 10 })
  return transactions;
}

