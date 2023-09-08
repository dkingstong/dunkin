import axios from 'axios'

import TransactionModel from '../models/TransactionModel.js'
import EmployeeModel from '../models/EmployeeModel.js'
import AccountModel from '../models/AccountModel.js'

const API_KEY = process.env.API_KEY
const ACCOUNTS_URL = 'https://dev.methodfi.com/accounts'
const ENTITIES_URL = 'https://dev.methodfi.com/entities'
const PAYMENTS_URL = 'https://dev.methodfi.com/payments'
const MERCHANTS_URL = 'https://dev.methodfi.com/merchants'

export const postPayments = async(fileId) => {
  let savedTransactions = []
  let offset = 0
  do {
    savedTransactions = await TransactionModel.find({ fileId, accepted: true, status: { $ne: 'PROCESSED' } }, null, { limit: 10, skip: offset })
    offset += savedTransactions.length
    for (const transaction of savedTransactions) {
      const employee = await EmployeeModel.findOne({ _id: transaction.employeeId })
      if(!employee) {
        console.error('Employee not found')
        throw new Error(`Employee not found with id: ${transaction.employeeId}`)
      } else if (!employee.methodId) {
        const methodEntity = await axios.post(ENTITIES_URL, {
          type: 'individual',
          individual: {
            first_name: employee.firstName,
            last_name: employee.lastName,
            phone: '15121231111'
          }
        }, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'content-type': 'application/json'
          }
        })
      employee.methodId = methodEntity.data.data.id
      await EmployeeModel.updateOne({_id: employee._id}, {methodId: employee.methodId})
      }
      const sourceAccount = await AccountModel.findOne({_id: transaction.sourceAccountId})
      if(!sourceAccount) {
        console.error('Source account not found')
        throw new Error(`Source account not found with id ${transaction.sourceAccountId}`)
      } else if(!sourceAccount.methodId) {
        const methodEntity = await axios.post(ACCOUNTS_URL, {
          'holder_id': 'ent_PzCWhfccxk9E9',
          ach: {
            routing: sourceAccount.routingNumber,
            number: sourceAccount.accountNumber,
            type: 'checking'
          }
        }, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'content-type': 'application/json'
          }
        })
        sourceAccount.methodId = methodEntity.data.data.id
        await AccountModel.updateOne({_id: sourceAccount._id}, {methodId: sourceAccount.methodId})
      }
      const destinationAccount = await AccountModel.findOne({_id: transaction.destinationAccountId})
      if(!destinationAccount) {
        console.error('Destination account not found')
        throw new Error(`Destination account not found with id:${transaction.destinationAccountId}`)
      } else if(!destinationAccount.methodId) {
        const methodMerchant = await axios.get(MERCHANTS_URL, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          params: {
            'provider_id.plaid': destinationAccount.plaidId
          }
        })
        destinationAccount.merchantId = methodMerchant.data.data[0].mch_id
        const methodEntity = await axios.post(ACCOUNTS_URL, {
          'holder_id': employee.methodId,
          liability: {
            'mch_id': destinationAccount.merchantId,
            number: destinationAccount.loanAccountNumber,
          }
        }, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'content-type': 'application/json'
          }
        })
        destinationAccount.methodId = methodEntity.data.data.id
        await AccountModel.updateOne({_id: destinationAccount._id}, {methodId: destinationAccount.methodId})
      }
      const methodTransaction = await axios.post(PAYMENTS_URL, {
        amount: transaction.amount,
        source: sourceAccount.methodId,
        destination: destinationAccount.methodId,
        description: 'descrip'
      }, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'content-type': 'application/json'
        },
        json: true
      })
      transaction.methodId = methodTransaction.data.data.id
      transaction.status = 'PROCESSED'
      await transaction.save()
    }
  } while (savedTransactions.length > 0)
}
