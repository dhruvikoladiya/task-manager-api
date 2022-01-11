const express=require('express')
const multer=require('multer')
const User=require('../models/users')
const router=new express.Router()
const auth=require('../middleware/auth')
const sharp=require('sharp')
const {sendwelcomeemail,sendcancelemail}=require('../emails/account')

router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        await sendwelcomeemail(user.email,user.name)
        const token=await user.genauthtoken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }

    // user.save().then(()=>{
    //    res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.genauthtoken()
        res.send({user, token})      
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)
    // try{
    //     const user=await User.find({})
    //     res.send(user)
    // }catch(e){
    //     res.status(500).send()
    // }

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})
 
// router.get('/users/:id',async(req,res)=>{
//     const _id = req.params.id

//     try{
//         const user=await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
    // }
    // User.findById(_id).then((user)=>{
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
// })

router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowupdates=['name','email','password','age']
    const validoperation=updates.every((update)=>allowupdates.includes(update))
    if(!validoperation){
        res.status(400).send({error:"invalid updates"})
    }

    try{
        //const user =await User.findById(req.user._id) 
        updates.forEach((update)=>req.user[update]=req.body[update])

        await req.user.save()

        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     res.status(404).send()
        // }
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{

    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendcancelemail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload jpg,jpeg or png file'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if( !user || !user.avatar ){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

module.exports=router