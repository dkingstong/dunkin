import express from 'express'
import AccountModel from '../models/AccountModel.js'

const router = express.Router()

router.get('/source', async (req,res) => {
  const distinctAccounts = await AccountModel.find({ accountNumber: { $exists: true }, routingNumber: { $exists: true } })

  res.status(200).json({ distinctAccounts })
})

export default router;