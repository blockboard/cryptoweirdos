const express = require('express');
const fileUploader = require('express-fileupload');

const app = express();

app.use(fileUploader());

// Upload Endpoint
app.post('/upload', (req, res) => {
    if(req.files === null) {
        return res.status(400).json({ msg: 'No image uploaded!' });
    }

    const image = req.files.image;

    image.mv(`${__dirname}/client/public/uploads/${image.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ imageName: image.name, imagePath: `/uploads/${image.name}` });
    });
});

app.listen(5000, () => console.log('Server Started...'));