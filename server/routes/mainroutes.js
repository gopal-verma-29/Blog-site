const express = require('express');
const router = express.Router();
const Post = require('../models/post');


//Get, Home//
router.get('/', async (req, res) => {
 try {
 const locals = {
  title: "NodeJS Blog",
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
 let perPage = 10;
 let page = parseInt(req.query.page) || 1;

const data = await Post.aggregate([ { $sort: {createdAt: -1} } ])
.skip(perPage * page - perPage)
.limit(perPage)
.exec()

const count = await Post.countDocuments();
const nextPage = parseInt(page) +1;
const hasNextPage = nextPage <= Math.ceil(count / perPage);

  res.render('index', { 
    locals, 
    data,
    current: page,
    nextPage: hasNextPage ? nextPage: null,
    currentRoute: '/'
  });

 } catch (error) {
  console.log('errorrr in mainroutes')
 }
});



//Get, POST**

router.get('/post/:id', async (req, res) => {
 try {
  let slug = req.params.id;

  const data = await Post.findById( slug );

  const locals = {
  title: data.title,
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
  res.render('post', { 
    locals, 
    data, 
    currentRoute: `/post/${slug}`
  });
 } 
 catch (error) {
  console.log('error in get.')
 }
});



//post, POST-searchTerm**
router.post('/search', async (req, res) => {
 try {
 const locals = {
  title: "Search",
  description: "A simple blog website made with NodeJS, Express and MongoDB"
 }
  let searchTerm = req.body.searchTerm;
  const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9 ]/g, "")
  console.log(searchTerm)


  const data = await Post.find({
    $or: [
     { title: {$regex: new RegExp(searchNoSpecialChar, 'i') }},
     { body: {$regex: new RegExp(searchNoSpecialChar, 'i') }}
    ]
  });

  res.render("search", {
    data,
    locals,
    currentRoute: '/'
  });


 } catch (error) {
  console.log('error in searchBar')
 }
})





router.get('/about', (req, res) => {
  res.render('about',{ 
    currentRoute: '/about'
  });
});

module.exports = router;







// //Get, Home//
// router.get('/', async (req, res) => {
//  const locals = {
//   title: "NodeJS Blog",
//   description: "A simple blog website made with NodeJS, Express and MongoDB"
//  }

//  try {
//   const data = await Post.find();+
//   res.render('index', { locals, data });
//  } catch (error) {
//   console.log('error')
//  }
// })


 





// async function insertPostData () {
//   try {
//     const result = aw ait Post.insertMany([
//       { title: "Example blog", body: "It is a test blog to see how the mongo is working..." }
//     ]);
//     console.log('Inserted docs:', result);
//   } catch (err) {
//     console.error('Insert error:', err);
//   }
// };
// insertPostData();