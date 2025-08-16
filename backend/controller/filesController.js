const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const fileList = (req, res) => {
    const files = fs.readdirSync(UPLOAD_DIR);
    const arquivos = files.map((nome, index) => {
        const filePath = path.join(UPLOAD_DIR, nome);
        const stats = fs.statSync(filePath);
        return {
            id: index,
            nome,
            size: stats.size
        };
    });
    res.json(arquivos)
};

const mapFiles = () => {
    const files = fs.readdirSync(UPLOAD_DIR);
    return files.map((nome, index) => {
        const filePath = path.join(UPLOAD_DIR, nome);
        const stats = fs.statSync(filePath);
        return {
            id: index,
            nome,
            size: stats.size
        };
    });
};

const upload = (req, res) => {
    try {
        const busboy = Busboy({ headers: req.headers });
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        busboy.on('file', (fieldname, file, filename) => {
            const actualFilename = typeof filename.filename === 'string' ? filename.filename : 'unknown_file';
            const savePath = path.join(__dirname, '../uploads', actualFilename);
            const writeStream = fs.createWriteStream(savePath);
            file.pipe(writeStream);

        });

        busboy.on('finish', () => {
            res.status(200).json({ message: 'Upload concluído com sucesso!' });
        });

        req.pipe(busboy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no upload do arquivo' });
    }
};

const download = (req, res) => {
    const id = req.params.id;
    const fileName = mapFiles()[id].nome
    const filePath = path.join(__dirname, '../uploads', fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error("Erro no download:", err);
            res.status(500).json({ error: 'Erro ao baixar o arquivo' });
        }
    });
};

const fileDelete = (req, res) => {
    try {
        const id = req.params.id
        const fileName = mapFiles()[id].nome
        const filePath = path.join(__dirname, '../uploads', fileName)
        console.log(filePath)
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Erro ao deletar o arquivo:', err);
                return;
            }
            console.log('Arquivo deletado com sucesso!');
        });
        return res.status(200).json({ message: 'Arquivo deletado com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o arquivo' });
        console.log(error)
    }
}


module.exports = { upload, download, fileList, fileDelete }
