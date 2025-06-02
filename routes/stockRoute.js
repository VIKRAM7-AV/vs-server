import express from 'express';
import projectmiddle from '../middleware/projectmiddle.js';
import adminRoute from '../middleware/adminRoute.js';
import { stockEntry,getProductStack,lastentry,getProductSite,stockproducts,AllProduct } from '../controllers/stockcontroller.js';

const router = express.Router();   

router.post('/stockentry/:id',projectmiddle,stockEntry);
router.get('/lastentry',projectmiddle,lastentry);
router.get('/',projectmiddle,getProductStack);
router.get('/stockdata/:id',adminRoute,stockproducts);
router.get('/all',adminRoute,AllProduct);
router.get('/:id',adminRoute,getProductSite);



export default router;