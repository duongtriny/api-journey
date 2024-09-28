import fs, { mkdir } from 'fs';

export const folderPath = "./uploads";


export const uploadFile = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const sampleFile = req.files.file;
    const uploadPath = `${folderPath}/${sampleFile.name}`;
    try {
        fs.writeFile(uploadPath, new Uint8Array(sampleFile.data), (err) => {
            if (err) {
                throw err;
            }
            res.send({
                message: "Upload successful!"
            })
        });
    } catch (ex) {
        return res.status(500).send('Error reading file 2');
    }
}

export const downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = `${folderPath}/${filename}`;

    res.download(filePath, (err) => {
        if (err) {
            return res.status(500).send('Error downloading file');
        }
    });
}