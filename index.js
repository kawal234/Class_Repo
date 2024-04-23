const express=require ('express');
const mongoose=require('mongoose');
const path = require('path');
const app=express();
const PORT=2929;

//middleware
app.use(express.json());
// connnect to MongoDb
mongoose.connect("mongodb+srv://gk2740249:Kawaljot%4025@cluster0.eqfxjmj.mongodb.net/")
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB:',err));

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User=mongoose.model('User',userSchema);
app.use(express.static(path.join(__dirname,'public')));

const mongoURI = process.env.MONGODB_URI;
app.get('/users',(req,res)=>{
    User.find({})
    .then(users=>res.json(users))
    .catch(err=>res.status(500).json({
        message:err.message
    }));
});

app.post('/users',(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    user.save()
    .then(newUser=>res.status(201).json(newUser))
    .catch(err=>res.status(400).json({message:err.message}));
});

app.put('/users/:id',(req,res)=>{
    const userId=req.params.id;
    const updateData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    };

    User.findByIdAndUpdate(userId,updateData,{new:true})
    .then(updateUser=>{
        if(!updateUser){
            return res.status(404).json({message:'User not found'});
        }
        res.json(updateUser);
    })
    .catch(err =>res.status(400).json({message:err.message}));

});

app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;

    User.findByIdAndDelete(userId)
    .then(deletedUser =>{
        if(!deletedUser){
            return res.status(404).json({message:'User not found'});

        }
        res.json({message:'User deleted successfully'});
    })
    .catch(err=>res.status(400).json({message:err.message}));
});

app.listen(PORT,()=>{
    console.log(`server is listening to the port${PORT}`);
});