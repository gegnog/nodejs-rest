const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    cb(null, timestamp.toString());
  }
});
const upload = multer({ storage: storage });

app.delete('/uploads/:id', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.id);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete file' });
    }

    res.json({ message: 'File deleted' });
  });
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/uploads', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.json({ message: 'Image uploaded successfully' });
});

app.get('/uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else {
      res.json(files);
    }
  });
});



app.listen(3000, () => console.log('Server started on port 3000'));