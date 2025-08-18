const fs = require('fs')
const path = require('path');
const mime = require('mime-types')

const fileType = (mimeType) => {
    const fileType = mimeType.split("/")[0]
    const subType = mimeType.split("/")[1]
    if (fileType === "image") {
        return "image"
    }
    if (fileType === "video") {
        return "video"
    }
    if (fileType === "audio") {
        return "audio"
    }
    if (fileType === "application") {
        if (subType === "pdf") {
            return "pdf"
        }
        if (subType === "msword" || subType === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
            return "doc"
        }
        if (subType === "vnd.ms-excel" || subType === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return "xls"
        }
        if (subType === "vnd.ms-powerpoint" || subType === "vnd.openxmlformats-officedocument.presentationml.presentation") {
            return "pptx"
        }
        if (subType === "zip" || subType === "x-rar-compressed" || subType === "x-7z-compressed" || subType === "x-tar") {
            return "zip"
        }
        if (subType === "x-msdos-program") {
            return "exe"
        }
        if (subType === "x-iso9660-image") {
            return "iso"
        }
        if (subType === "x-msdownload") {
            return "msi"
        }
    }
    if (fileType === "text") {
        if (subType === "plain") {
            return "text"
        }
        if (subType === "html") {
            return "html"
        }
        if (subType === "csv") {
            return "csv"
        }
        if (subType === "json") {
            return "json"
        }
    }
}

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