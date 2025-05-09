import {body} from 'express-validator';



const validationSchema = () => {
    return [
        body('title').notEmpty().withMessage('Title is required').isLength({min: 3}).withMessage('Title must be at least 3 characters long'),
     
    ]
}

export default validationSchema;