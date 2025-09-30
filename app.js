if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");



// const { any } = require("joi");

// const MONGO_URL = "mongodb://127.0.0.1:27017/STAYHUB";
const dbUrl = process.env.ATLASDB_URL;
// connected to datbase
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {  // database  connected krne ke liye
    await mongoose.connect(dbUrl,  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true // enforce TLS
    });
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // data reqest ke under pass ho jye
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // for css


//sessions store in atlas

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION", err);
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {      
//     res.send("hy i am root");
// });



app.use(session(sessionOptions));
app.use(flash());


// configuring setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//expression 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user|| null;
    next();
});

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// app.get("/demouser", async(req,res)=> {
//        let fakeUser = new User({
//         email : "student@gmail.com",
//         username: "delta-student"
//        });

//   let registerUser= await User.register(fakeUser,"helloworld"); 
//   res.send(registerUser);
// })

app.use("/listings", listingRouter); // jha jha listings hoga vha hm listings use krege
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all(/.*/, (req, res, next) => {   // version change
    next(new ExpressError(404, "Page not found!"));
});

//error handling middlewares 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");

});  