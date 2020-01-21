
exports.postImage = (req, res, next) => {
    if(req.files === null) {
        return res.status(400).json({ msg: 'No image uploaded!' });
    }

    const image = req.files.image;

    image.mv(`client/public/uploads/${image.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.status(200).json({
            imageName: image.name,
            imagePath: `/uploads/${image.name}`
        });
    });
};