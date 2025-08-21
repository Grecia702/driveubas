const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const fileType = (filePath) => {
    const mimeType = mime.lookup(filePath);

    if (!mimeType || typeof mimeType !== "string") {
        return "unknown";
    }

    const [fileType, subType] = mimeType.split("/");

    if (fileType === "image") return "image";
    if (fileType === "video") return "video";
    if (fileType === "audio") return "audio";

    if (fileType === "application") {
        if (subType === "pdf") return "pdf";
        if (["msword", "vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(subType)) return "doc";
        if (["vnd.ms-excel", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(subType)) return "xls";
        if (["vnd.ms-powerpoint", "vnd.openxmlformats-officedocument.presentationml.presentation"].includes(subType)) return "pptx";
        if (["zip", "x-rar-compressed", "x-7z-compressed", "x-tar"].includes(subType)) return "zip";
        if (subType === "x-msdos-program") return "exe";
        if (subType === "x-iso9660-image") return "iso";
        if (subType === "x-msdownload") return "msi";
    }

    if (fileType === "text") {
        if (subType === "plain") return "text";
        if (subType === "html") return "html";
        if (subType === "csv") return "csv";
        if (subType === "json") return "json";
    }

    return "unknown";
};


const sortByField = (arr, field, order) => {
    return arr.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (typeof valA === "string" && typeof valB === "string") {
            return order === "ASC"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }
        if (typeof valA === "number" && typeof valB === "number") {
            return order === "ASC" ? valA - valB : valB - valA;
        }
        return 0;
    });
}

const getDirectorySize = (dirPath) => {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const childPath = path.join(dirPath, file);
        const stat = fs.statSync(childPath);
        if (stat.isFile()) {
            totalSize += stat.size;
        } else if (stat.isDirectory()) {
            totalSize += getDirectorySize(childPath);
        }
    });
    return totalSize;
};

const mapFiles = (uploadPath) => {
    const files = fs.readdirSync(uploadPath);
    return files.map((nome, index) => {
        const filePath = path.join(uploadPath, nome);
        const stats = fs.statSync(filePath);
        const type = stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : 'other';
        let size = 0;
        if (type === 'directory') {
            size = getDirectorySize(filePath);
            console.log(size)
        } else {
            size = stats.size
        }
        return {
            id: index,
            nome,
            size,
            type
        };
    });
};

module.exports = { fileType, sortByField, mapFiles, getDirectorySize }