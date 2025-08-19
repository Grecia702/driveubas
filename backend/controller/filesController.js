const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const mime = require('mime-types')
const { fileType, sortByField, getDirectorySize, mapFiles } = require('../utils/fileUtils')


const fileList = (req, res) => {
    const relativeDir = req.query.dir || "";
    const { sortBy, sortOrder } = req.query
    const currentDir = path.join(UPLOAD_DIR, relativeDir);
    let size = 0;
    if (!currentDir.startsWith(UPLOAD_DIR)) {
        return res.status(400).json({ error: "Acesso negado" });
    }
    const files = fs.readdirSync(currentDir);
    const arquivos = files.map((nome, index) => {
        const filePath = path.join(currentDir, nome);
        const mimeType = mime.lookup(filePath);
        const stats = fs.statSync(filePath);
        const type = stats.isFile() ? fileType(mimeType) : (stats.isDirectory() ? 'directory' : 'other')
        if (type === "directory") {
            size = getDirectorySize(filePath);
        } else {
            size = stats.size;
        }
        return {
            id: index,
            nome,
            size,
            type,
            mimeType,
            path: path.join(relativeDir, nome),
        };
    });
    sortByField(arquivos, sortBy, sortOrder)
    res.json({
        currentPath: relativeDir,
        arquivos,
    });
};

const upload = (req, res) => {
    try {
        const folder = req.query.folder || '';
        const busboy = Busboy({ headers: req.headers });
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        busboy.on('file', (fieldname, file, filename) => {
            const actualFilename = typeof filename.filename === 'string' ? filename.filename : 'unknown_file';
            const uploadPath = path.join(UPLOAD_DIR, folder, actualFilename);
            const writeStream = fs.createWriteStream(uploadPath);
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

const download = async (req, res) => {
    try {
        const folder = req.query.folder || '';
        const fileName = req.query.file;
        if (!fileName) return res.status(400).json({ error: 'Nome do arquivo obrigatório' });
        const filePath = path.join(UPLOAD_DIR, folder, fileName);
        await fs.promises.access(filePath, fs.constants.R_OK);
        res.download(filePath, fileName, (err) => {
            if (err) console.error('Erro no download:', err);
        });
    } catch {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
};

const newDirectory = (req, res) => {
    const { name } = req.body
    const folder = req.query.folder || '';
    const dirPath = path.join(UPLOAD_DIR, folder, name);
    fs.mkdirSync(dirPath, { recursive: true });
    return res.status(200).json({ message: 'Pasta criada com sucesso' })
};

const fileDelete = (req, res) => {
    try {
        const folder = req.query.folder || '';
        const fileName = req.query.file;
        const filePath = path.join(UPLOAD_DIR, folder, fileName)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory) {
            fs.rmSync(filePath, { recursive: true, force: true })
            return res.status(200).json({ message: 'Pasta deletada com sucesso' })
        } else {
            fs.unlinkSync(filePath, (err) => {
                if (err) {
                    console.error('Erro ao deletar o arquivo:', err);
                    return;
                }
                console.log('Arquivo deletado com sucesso!');
                return res.status(200).json({ message: 'Arquivo deletado com sucesso' })
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o arquivo' });
        console.log(error)
    }
}

const fileRename = (req, res) => {
    try {
        const folder = req.query.folder || '';
        const fileName = req.query.file;
        const { newName } = req.body
        const oldFilePath = path.join(UPLOAD_DIR, folder, fileName)
        const newFilePath = path.join(UPLOAD_DIR, folder, newName)
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                console.error('Erro ao renomear o arquivo:', err);
                return;
            }
            console.log('Arquivo renomeado com sucesso!');
            return res.status(200).json({ message: `Arquivo renomeado com sucesso: de ${oldFilePath} para ${newFilePath}` })
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao renomear o arquivo' });
        console.log(error)
    }
}

module.exports = { upload, download, newDirectory, fileList, fileDelete, fileRename }
