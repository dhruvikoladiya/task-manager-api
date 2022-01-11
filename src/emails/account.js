const sgmail=require('@sendgrid/mail')
require('dotenv').config()

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwelcomeemail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'koladiyadhruvi532@gmail.com',
        subject:'Thanks for joining',
        text:`Welcome to the app, ${name}.Let us know how you go along with the app.`
    })
}

const sendcancelemail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'koladiyadhruvi532@gmail.com',
        subject:'Sorry to see you go!',
        text:`Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports={
    sendwelcomeemail,
    sendcancelemail
}