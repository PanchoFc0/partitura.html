const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = '';
        switch (req.body.instrument) {
            case 'saxofon':
                folder = 'partituras_saxofon';
                break;
            case 'trompeta':
                folder = 'partituras_trompeta';
                break;
            case 'violin':
                folder = 'partituras_violin';
                break;
            default:
                folder = 'partituras_violin'; // Default folder
        }
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        // Use the name provided in the form
        const originalName = req.body.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Sanitize the name
        cb(null, originalName + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const instrument = req.body.instrument;
    const partitura = {
        name: req.body.name,
        choir: req.body.choir,
        url: `/partituras_${instrument}/${req.file.filename}`
    };

    const jsonFilePath = path.join(__dirname, `public/${instrument}.json`);

    fs.readFile(jsonFilePath, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading JSON file.');
        }

        const partituras = data ? JSON.parse(data) : [];
        partituras.push(partitura);

        fs.writeFile(jsonFilePath, JSON.stringify(partituras, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing JSON file.');
            }
            res.send('File uploaded successfully!');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
