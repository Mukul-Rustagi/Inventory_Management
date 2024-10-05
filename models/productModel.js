const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    name:
    {
        type:String,required:true
    },
    quantity:
    {
        type:Number,required:true,default:0
    },
    price:
    {
        type:Number,required:true,deafult:0
    },
    lowStckThreshold:
    {
        type:Number,deafult:0
    },
    image:
    {
        type:String
    },
    inventory:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inventory',
        required:true,
    },
},{timeStamps:true});

const Product=mongoose.model('Product',productSchema);
module.exports=Product;