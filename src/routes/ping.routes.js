import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/ping', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    
    res.status(200).json({ status: 'ok' })
  } catch (err) {
    res.status(500).json({ status: 'error' })
  }
})

export default router