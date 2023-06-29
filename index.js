const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const fs = require('fs')
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://kfvxugorgcmsjslpxnvd.supabase.co';
const supabaseKey = process.env.API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
app.use(express.static('images'));

//adding  particles.js



app.listen(8002, () => {
  console.log('Listening at 8000');
});

app.use(express.static(path.join(__dirname, 'tempelates')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'tempelates', 'home.html'));
});

app.get('/blogs', (req,res)=>{
    res.sendFile(path.join(__dirname, 'tempelates', 'blogs.html'))
})

app.get("/upload_blog", (req,res)=>{
    res.sendFile(path.join(__dirname, 'tempelates', 'upload_blog.html'))

})
const upload  = multer({dest:"uploads/"})

app.post('/upload', upload.single('coverImage'), async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const coverImage = req.file;
  
    try {
      // Read the cover image file
      const coverImageBuffer = await fs.promises.readFile(coverImage.path);
      const coverImageBase64 = coverImageBuffer.toString('base64');
  
      // Insert blog data into the 'blogs' table
      const { data, error } = await supabase
        .from('blogs')
        .insert([
          { title: title, blog_content: content, blog_cover: coverImageBase64 }
        ]);
  
      if (error) {
        console.error('Error storing blog:', error);
        res.status(500).send('Error uploading blog.');
      } else {
        console.log('Blog stored with ID:', data);
        res.send('Blog uploaded successfully!');
      }
    } catch (error) {
      console.error('Error reading cover image file:', error);
      res.status(500).send('Error uploading blog.');
    }
  });

  app.get('/image/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      // Retrieve the blog entry from the 'blogs' table
      const { data, error } = await supabase
        .from('blogs')
        .select('blog_cover')
        .eq('id', id)
        .single();
  
      if (error) {
        console.error('Error retrieving blog:', error);
        res.status(500).send('Error retrieving blog.');
      } else {
        const coverImageBase64 = data.blog_cover;
        const coverImageBuffer = Buffer.from(coverImageBase64, 'base64');
  
        // Set the appropriate content type for the image
        res.contentType('image/jpeg');
        res.send(coverImageBuffer);
      }
    } catch (error) {
      console.error('Error retrieving blog:', error);
      res.status(500).send('Error retrieving blog.');
    }
  });