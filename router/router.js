import express from "express"
import { sendSession , openUrl , status , takePrice } from "../route/route.js"
const router = express.Router()

router.post("/pay" , sendSession)
router.post("/stripesession" , openUrl)
router.get('/status' , status)
router.post("/price" , takePrice)

export default router