import express from 'express'
import axios from 'axios'
import axiosRetry from 'axios-retry'

import TransactionModel from '../models/TransactionModel.js'
import { postPayments } from '../controllers/transactionControllers.js'

const router = express.Router()
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 10 });

router.patch('/', async(req, res) => {
  const { transactions } = req.body
  for(const transaction of transactions) {
    await TransactionModel.updateOne({_id: transaction._id}, transaction)
  }

  return res.status(200).send('Updated successfully')

})

router.get('/:fileId', async (req,res) => {
  const { fileId } = req.params

  const { offset, limit } = req.query
  
  const batchedTransactions = await TransactionModel.find({ fileId }, null, {
    skip: offset,
    limit
  })

  return res.status(200).json(batchedTransactions)
})

router.post('/send', async (req,res) => {

  const { fileId } = req.body
  await postPayments(fileId)
  return res.status(200).send('Transaction successful')

})

router.get('/branches/list', async(req, res) => {
  const branches = await TransactionModel.distinct('branchId')
  
  return res.status(200).json(branches)
})

router.get('/metrics/branch/:branchId', async(req, res) => {
  const { branchId } = req.params
  const aggregate = await TransactionModel.aggregate(
    [{
      $match: { branchId: branchId, status: 'PROCESSED' }
    },
    {
      $group: {
        _id: '$branchId',
        amount: { $sum: '$amount' }
      }
    }
  ])

  const amount = aggregate.length > 0 ? aggregate[0].amount : 0
  
  return res.status(200).json(amount)
})

router.get('/metrics/account/:accountId', async(req, res) => {
  const { accountId } = req.params
  const t = await TransactionModel.find()
  const aggregate = await TransactionModel.aggregate(
    [{
      $match: { sourceAccountId: accountId, status: 'PROCESSED' }
    },
    {
      $group: {
        _id: '$sourceAccountId',
        amount: { $sum: '$amount' }
      }
    }
  ])

  const amount = aggregate.length > 0 ? aggregate[0].amount : 0
  
  return res.status(200).json(amount)
})

export default router;
