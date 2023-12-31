import express from 'express'
import mongoose from "mongoose";
import cors from 'cors';
import {loginValidation, registerValidation} from './validations/auth.js'
import checkAuth from "./utils/checkAuth.js";

import { PostController, UserController } from './controllers/index.js'

import {postCreateValidation} from "./validations/post.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import multer from "multer";

//TODO: НИВ КОЕМ СЛУЧАЕ НЕЛЬЗЯ ЗАЛИВАТЬ ЭТО!!!!!!!!!!!!!!!!!!
const MONGO_LINK = process.env.MONGO_LINK;
const PORT = process.env.PORT || 4444;


mongoose.connect(MONGO_LINK).then(()=>console.log('DB, ok!')).catch((err) =>console.log('DB, error!', err))


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: (_,file,cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));



app.get('/', (req, res)=>{
    res.send('Hello, world!')
})


// app.post('/auth/login', (req, res)=>{
//     console.log(req.body);
//
//
//     const token = jwt.sign({
//             email: req.body.email,
//             fullname: "jopa jopa"
//         },
//         'secret234'
//     )
//
//     res.json({
//         success: 'true',
//         token,
//     })
// })

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation,  handleValidationErrors, UserController.register);


app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors,  PostController.update);


app.post('/upload', checkAuth,  upload.single('image'), (req, res) =>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.post('/upload/avatar', upload.single('avatar'), (req, res) =>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});


app.listen(PORT, (err)=>{
    if(err){
        return console.log(err)
    }

    return console.log("OK!")
} )

