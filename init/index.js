const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/STAYHUB";
// connected to datbase
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {  // database  connected krne ke liye
    await mongoose.connect(MONGO_URL);
}

//function
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "68cef1b266bcfcacef26db1b",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};
initDB();