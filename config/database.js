const mongoose=require("mongoose");
require("dotenv").config();

exports.dbConnect=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    .then(()=>{console.log("DB ka Connection Successful")})
    .catch((err)=>{
        console.log("DB ka connection successful");
        console.error(err);
        process.exit(1);
    })
}