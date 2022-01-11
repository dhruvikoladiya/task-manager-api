const express = require('express')
require('./db/mongoose')
const userrouter=require('./routers/user')
const taskrouter=require('./routers/task')

const app = express()
const port=process.env.PORT

const multer=require('multer')

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400  ).send({error:error.message})
})

// app.use((req,res,next)=>{
//     if(req.method === "GET"){
//         res.send('GET requests are disabled!')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Serevr is under maintenance. please try later!')
// })

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

app.listen(port,()=>{
    console.log('Server is up on ' + port)
})

// const jwt=require('jsonwebtoken')
// const { response } = require('express')

// const myfunction=async()=>{
//     const token=jwt.sign({_id:'123ab'},'thisisnode')
//     console.log(token)

//     const data =jwt.verify(token,'thisisnode')
//     console.log(data)
// }

// myfunction() 

const Task=require('./models/tasks')
const User=require('./models/users')
const { response } = require('express')

const main=async()=>{
      
        // const task=await Task.findById('61dae491e7911fa5077b492e')
        //  await task.populate('owner').then((user)=>{
        //   JSON.stringify(user)
        //    console.log(task.owner)
        //  })
         
        // const user=await User.findById('61dae487e7911fa5077b4928')
        // await user.populate('tasks').then((task)=>{
        //     JSON.stringify(task)
        // })
        // console.log(user.tasks)
    
}
main()