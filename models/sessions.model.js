import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    createdAt:{type:Date,default:()=>moment().tz("American/Mexico_City").toDate(),required:true},
    lastAccessedAt: { type: Date,default:()=>moment().tz("American/Mexico_City").toDate(), required: true },
    status: { 
        type: String, 
        enum: ['activa', 'inactiva','Finalizada por el usuario',"Finalizada por error del sistema"], 
        required: true 
    },
    clientData:{
        ip:{type:String,required:true},
        macAddress:{type:String,required:true}
    },
    serverData:{
        ip:{type:String,required:true},
        masAddress:{type:String,required:true}
    },
    inactivityTime:{
        hours:{type:Number,required:true,min:0},
        minutes:{type:Number,required:true,min:0,max:59},
        seconds:{type:Number,required:true,min:0,max:59},
    }
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;