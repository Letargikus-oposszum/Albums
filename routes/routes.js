import express from "express"
import * as Controllers from "../controllers/controllers.js"
const router =express.Router()

router.get('/', Controllers.getalbum)
router.get('/:id', Controllers.getalbumById)
router.post('/', Controllers.createalbum)
router.put('/:id',Controllers.updatealbum)
router.delete('/:id', Controllers.deletealbum)

export default router