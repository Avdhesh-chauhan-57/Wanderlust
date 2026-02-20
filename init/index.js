const mongoose =require("mongoose");
const initData =require("./data.js");
const listing = require("../models/listing.js");


main()
.then( ()=>{
    console.log("Connected to DB")
}).catch((err) =>{
    console.log(err)
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async() => {
    await listing.deleteMany({});
     const ownerId = new mongoose.Types.ObjectId("6982033ccb35cd6b0e8633c7");
    initData.data= initData.data.map((obj)=>({...obj,  owner: ownerId}));
    await listing.insertMany(initData.data);
    console.log("data was Intialized")
};
initDB();