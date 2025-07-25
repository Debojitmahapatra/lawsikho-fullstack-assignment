import express from 'express'
const router=express.Router()
import { createUser,loginUser,getUserById ,allUsers} from '../controllers/user.controller.js'
import { createNode,getNodes,updateNodes,deleteNodes,getNodeById,searchByKey } from '../controllers/note.controller.js'
import { mostActiveUser,mostActiveTags } from '../controllers/record.controller.js'
import { shareNote,getSharedNotes } from '../controllers/share.controller.js'
import { checkAuth } from '../utils/auth.js'

//user create and login
router.post('/user/signup',createUser)
router.post('/user/login',loginUser)
//get user
router.get('/user/:userId',getUserById)
router.get('/user',allUsers)

//note curd operations
router.post('/node/create',checkAuth,createNode)
router.get('/node/get',checkAuth,getNodes)
router.put('/node/update/:nodeId',checkAuth,updateNodes)
router.delete('/node/delete/:nodeId',checkAuth,deleteNodes)
//get note by id
router.get('/node/get/:nodeId',checkAuth,getNodeById)
//search by key
router.get('/search_nods/:key',checkAuth,searchByKey)


//get most active user
router.get('/most_active',mostActiveUser)
//get most useable tags
router.get('/most_useable_tags',mostActiveTags)


//to share note
router.post('/node/share/:noteId',checkAuth,shareNote)
router.get('/node/share_nodes',checkAuth,getSharedNotes)

export default router