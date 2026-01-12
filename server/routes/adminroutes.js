const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;




// Check Login//

const authMiddleware = (req,res, next) =>{
  const token = req.cookies.token;

  if(!token){
     return res.status(401).json( {message: "UnAuthorized"} );
  }
  try{
     const decoded = jwt.verify(token, jwtSecret);
     req.userId = decoded.userId;
     next();
   } catch(error) {
    return res.status(401).json( {message: "UnAuthorized"} );
  }
  };



//Get, Admin - login page//
router.get('/admin', async (req, res) => {
 try {
     const locals = {
  title: "Admin",
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
  res.render('admin/index', { locals, layout: adminLayout });
 } catch (error) {
  console.log('error in login page')
 }
});



//POST, Admin - Check login//
router.post('/admin', async (req, res) => {
 try {
const { username, password } = req.body; 

 const user = await User.findOne( {username} );
 if(!user) {
  return res.status(401).json( {message: "Invalid Credentials"} );
 }

 const isPasswordValid = await bcrypt.compare( password, user.password );

 if(!isPasswordValid) {
   return res.status(401).json( {message: "Invalid Credentials"} );
 }

 const token = jwt.sign({userId: user._id}, jwtSecret );
 res.cookie('token', token, { httpOnly: true });

 res.redirect('/dashboard')

  
 } catch (error) {
  console.log('error in post route')
 }
});




//GET, Admin - DashBoard//
router.get('/dashboard', authMiddleware, async (req, res) => {
try {
    const locals = {
  title: "Dashboard",
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
    const data = await Post.find();
    res.render('admin/dashboard',{
    locals,
    data,
    layout: adminLayout 
});
 } catch (error) {
  console.log('error in dashboard route');
  console.error(error);   // <- THIS
  return res.status(500).send('Dashboard error');
}

});


//GET, Admin - Add posts//
router.get('/add-post', authMiddleware, async (req, res) => {
try {
    const locals = {
  title: "Add Post",
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
    const data = await Post.find();
    res.render('admin/add-post',{
    locals,
    data,
    layout: adminLayout 
});
 } catch (error) {
  console.log('error in add-post route');
}

});


//POST, Admin -  Create new posts//
router.post('/add-post', authMiddleware, async (req, res) => {
try {
 console.log(req.body);

try {
const newPost = new Post({
title: req.body.title,
body: req.body.body
})  ;

await Post.create(newPost);
res.redirect('/dashboard');
} catch (error) {
  console.log('gdbd ho gyi')
}


 } catch (error) {
  console.log('error in add new post route');
   }

});


//GET, Admin - Edit posts//
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
try {
    const locals = {
  title: "Edit Post",
  description: "For editing and updating the posts"
 }

const data = await Post.findOne({_id: req.params.id})

res.render('admin/edit-post', {
    locals,
    data, 
    layout: adminLayout
});


 } catch (error) {
  console.log('error in edit-post route');
}
});


//PUT, Admin - Edit posts//
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
try {

await Post.findByIdAndUpdate(req.params.id, {
  title: req.body.title,
  body: req.body.body,
  updatedAt: Date.now()
});

res.redirect(`/edit-post/${req.params.id}`)


 } catch (error) {
  console.log('error in edit-page-post route');
}

});

//DELETE, Admin - DELETE posts//
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
try {
  await Post.deleteOne({_id: req.params.id})
  res.redirect('/dashboard');
} catch (error) {
  console.log('error in delete route')
}

});


// GET, Admin - logout//

router.get('/logout', (req, res) =>{
  res.clearCookie('token')
  //res.json({ message: 'Logout Successfull.'})  
  res.redirect('/')
});










//POST, Admin - Register//
router.post('/register', async (req, res) => {
 try {
const { username, password } = req.body; 
const hashedPassword = await bcrypt.hash(password, 10);

try {
  const user = await User.create ({ username, password: hashedPassword });
  res.status(201).json({message: 'User Created', user });

} catch (error) {
  if (error.code === 11000) {
   res.status(409).json({message: 'Username already in use' });
  }
    res.status(500).json({message: 'Internal server error' });
}


 } catch (error) {
  console.log('error in register route')
 }
});


module.exports = router;
