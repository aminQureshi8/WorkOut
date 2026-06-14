const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/starfit');
  console.log('Connected to MongoDB');
  const BlogSchema = new mongoose.Schema({}, { strict: false });
  const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
  const blogs = await Blog.find({}, 'title slug status').lean();
  console.log('Blogs in DB:', JSON.stringify(blogs, null, 2));
  await mongoose.disconnect();
}

run().catch(console.error);
