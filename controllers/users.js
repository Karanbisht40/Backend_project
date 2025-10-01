
const User = require("../Models/user");


module.exports.renderSignupForm =(req,res)=> {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=> {
    try{
 let {username, email,password}= req.body;
   const newUser=  new User({email,username});
   const registerUser = await User.register(newUser,password); // database m register krne ke liye
   console.log(registerUser);
   req.login(registerUser,(err)=> {  //login after signup
    if(err){
        return next(err);
    }
      req.flash("success","welcome to Stayhub!");
      res.redirect("/listings");
   });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login.ejs");
};

module.exports.login =async(req,res)=>{
    req.flash("success","welcome back to Stayhub!");
    // let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect("/listings");
};

module.exports.logout =(req,res,next)=> {
    req.logOut((err)=> {
        if(err){
          return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};