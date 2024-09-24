import {Router} from 'express';
import {createInsect, deleteInsect, getInsects, updateInsect} from './Controller.mjs';
import cors from "cors";

const router = Router();
router.use(cors())

router.get('/', getInsects);
router.post('/', createInsect);
router.put('/:id', updateInsect);
router.delete('/:id', deleteInsect);

export default router;
