
// Dependencies
const express = require("express");

const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator/check');

// Import Directories
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');



//-----------------USER POST START-----------------\\

// @route  POST api/posts
// @desc   Create a Post
// @access Private
router.post('/',
  [
    auth,
    [
      check('text', 'Text is required!')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    };

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  });

// @route    GET api/posts
// @desc     Get All Posts
// @access   Private
router.get('/',
  auth, async (req, res) => {
    try {
      const posts = await Post.find().sort({
        date: -1
      });

      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  });

// @route    GET api/posts/:id
// @desc     Get Posts by ID
// @access   Private
router.get('/:id',
  auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      };

      res.json(post);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      }
      res.status(500).send('Server Error!');
    }
  });

// @route    DELETE api/posts/:id
// @desc     Delete a Post
// @access   Private
router.delete('/:id',
  auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      }

      // Check user to ensure that they are deleting a post that belongs to them
      // Since we are compare an obj & string we need to convert the obj to string in order to compare
      // the same data type. Otherwise this will never work, even if its the right user deleting their post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'User not authorized!'
        });
      }

      await post.remove();

      res.json({
        msg: 'Post successfully deleted!'
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      }
      res.status(500).send('Server Error!');
    }
  });

// @route    PUT api/posts/like/:id
// @desc     Like a Post
// @access   Private
router.put('/like/:id',
  auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Check if post has already has a like to avoid multiple likes on same post
      // This is why we check if the length is > 0
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({
          msg: 'Post already liked!'
        });
      };

      post.likes.unshift({
        user: req.user.id
      });

      await post.save();

      res.json(post.likes);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      }
      res.status(500).send('Server Error!');
    }
  });

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a Post
// @access   Private
router.put('/unlike/:id',
  auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Check if post has has a like since we can't unlike a post we haven't liked yet
      // This is why we check if the length is = 0
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({
          msg: 'Post has not yet been liked!'
        });
      };

      // Get removed index
      const removeIndex = post.likes.map(like =>
        like.user.toString()).indexOf(req.user.id);

      post.likes.splice(removeIndex, 1)

      await post.save();

      res.json(post.likes);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Post not found!'
        });
      }
      res.status(500).send('Server Error!');
    }
  });

// @route  POST api/posts/comment/:id
// @desc   Comment on a Post
// @access Private
router.post('/comment/:id',
  [auth,
    [
      check('text', 'Text is required!')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    };

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  });

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete Comment
// @access Private
router.delete('/comment/:id/:comment_id',
  auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      //Pull out Comment from the Post
      const comment = post.comments.find(comment =>
        comment.id === req.params.comment_id);

      // Make sure that comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist!' });
      }

      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized!' });
      }

      // If everything checks out: Get removed index
      const removeIndex = post.comments
        .map(comment => comment.user.toString())
        .indexOf(req.user.id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      res.json(post.comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  });

//-------------------USER POST END-------------------\\

module.exports = router;
