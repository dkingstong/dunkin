import express from 'express'
import multer from 'multer'
import { postFile } from '../controllers/fileController.js'
import TransactionModel from '../models/TransactionModel.js'

const router = express.Router()
const upload = multer();

router.post('/', upload.single('file'), async (req,res) => {
  const file = req.file;
  
  const transactions = await postFile(file)

  console.log('file has been validated')
  res.status(200).json({ transactions })
})

router.get('/download/csv', async (req,res) => {
  const csvRows = []
  const [branchMetrics, accountMetrics] = await Promise.all([
    TransactionModel.aggregate(
      [{
        $match: { status: 'PROCESSED' }
      },
      {
        $group: {
          _id: '$branchId',
          amount: { $sum: '$amount' }
        }
      }
    ]),
    TransactionModel.aggregate(
      [ 
      {
        $match: {status: 'PROCESSED'}
      },
      {
        $group: {
          _id: '$sourceAccountId',
          amount: { $sum: '$amount' }
        }
      }
    ])
  ])

  const metrics = [...branchMetrics, ...accountMetrics]
  const headers = Object.keys(metrics[0])
  csvRows.push(headers.join(','));

  for(const metric of metrics) {
    const values = Object.values(metric).join(',');
    csvRows.push(values)
  }

  const csvData = csvRows.join('\n')
    
  return res.status(200).json(csvData)
})

export default router;
