const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('blog'));


app.use(bodyParser.json());

// connect to MongoDB
const dbURI = 'mongodb://localhost:27017/blogDB';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// define Schema
const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
});




const Blog = mongoose.model('Blog', blogSchema);


// GET all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new blog
app.post('/api/blogs', async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    });
    try {
        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET a single blog by ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT (update) a blog by ID
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Update only the specified fields
        if (req.body.title) {
            blog.title = req.body.title;
        }
        if (req.body.body) {
            blog.body = req.body.body;
        }
        if (req.body.author) {
            blog.author = req.body.author;
        }

        // Save the updated blog
        const updatedBlog = await blog.save();

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// DELETE a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
