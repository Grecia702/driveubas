import React, { useState } from 'react';
import { MdDownload, MdDelete, MdFolder, MdOutlineQuestionMark, MdEdit, MdImage, MdOutlineVideoCameraBack, MdAudiotrack, MdFolderZip, MdLaptop, MdArrowDropUp, MdArrowDropDown, MdInstallDesktop } from 'react-icons/md';
import { FaCompactDisc } from "react-icons/fa";
import styles from './fileTable.module.css'
import { formatBytes } from '../utils/formatSize';
import { useTheme } from '../context/themeContext.tsx';
import axios from 'axios'

interface File {
    id: number;
    nome: string;
    size: number;
    type: string;
    path: string;
}

interface Props {
    files: File[];
    setFiles: (id: File[]) => void;
    onDownload: (filename: string, directory: string) => void;
    onDelete: (id: string) => void;
    onFetch: (id: string) => void;
    setIsOpen: (id: boolean) => void;
    onRename: (args: { newName: string, oldName: string }) => void;
    path: string;
    setPath: (id: string) => void
}

const FileTable: React.FC<Props> = ({ files, setFiles, onDownload, onDelete, onFetch, setIsOpen, onRename, path, setPath }) => {
    const [sort, setSort] = useState<{ field: string; order: string } | null>(null);
    const handleSort = (field: string) => {
        let order: "ASC" | "DESC" = "ASC";
        if (sort?.field === field) {
            order = sort.order === "ASC" ? "DESC" : "ASC";
        } else {
            order = "DESC";
        }
        setSort({ field, order });
        axios.get(`http://localhost:8000/api/v1/files/list?sortBy=${field}&sortOrder=${order}`)
            .then((res) => setFiles(res.data.arquivos));
        setPath('')
    };

    const fields = [
        { sortBy: 'id', text: 'ID', width: '5%' },
        { sortBy: 'nome', text: 'Nome', width: '45%' },
        { sortBy: 'dono', text: 'Dono', width: '20%' },
        { sortBy: 'size', text: 'Tamanho', width: '20%' },
    ]

    const typeIcons: Record<string, React.ReactNode> = {
        directory: <MdFolder size={24} className={styles.icon} />,
        image: <MdImage size={24} className={styles.icon} />,
        video: <MdOutlineVideoCameraBack size={24} className={styles.icon} />,
        audio: <MdAudiotrack size={24} className={styles.icon} />,
        default: <MdOutlineQuestionMark size={24} className={styles.icon} />,
        zip: <MdFolderZip size={24} className={styles.icon} />,
        iso: <FaCompactDisc size={24} className={styles.icon} />,
        exe: <MdLaptop size={24} className={styles.icon} />,
        msi: <MdInstallDesktop size={24} className={styles.icon} />
    };

    return (
        <table>
            <thead>
                <tr>
                    {fields.map((fields) => (
                        <th key={fields.sortBy} style={{ width: fields.width }}>
                            <button className={styles.buttonSort} onClick={() => handleSort(fields.sortBy)}>
                                {fields.text}
                                {sort?.field === fields.sortBy ? (
                                    sort.order === "ASC" ? <MdArrowDropUp size={24} className={styles.icon} /> : <MdArrowDropDown size={24} className={styles.icon} />
                                ) : (
                                    <MdArrowDropUp size={24} className="opacity-30" />
                                )}
                            </button>
                        </th>
                    ))}
                    <th style={{ width: '10%' }}>
                        Ações
                    </th>
                </tr>
            </thead>
            <tbody>
                {files.map((file) => (
                    <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>
                            <button className={styles.buttonItem} onClick={() => file.type === 'directory' && onFetch(file.path)}>
                                {typeIcons[file.type] || typeIcons.default}
                                {file.nome}
                            </button>
                        </td>
                        <td>Gabriel</td>
                        <td>{formatBytes(file.size)}</td>
                        <td>
                            <button className={styles.buttonAction} onClick={() => { onRename({ newName: file.nome, oldName: file.nome }); setIsOpen(true) }}>
                                <MdEdit size={20} className={styles.icon} />
                            </button>
                            <button className={styles.buttonAction} onClick={() => onDownload(file.nome, path)}>
                                <MdDownload size={20} className={styles.icon} />
                            </button>
                            <button className={styles.buttonAction} onClick={() => onDelete(file.nome)}>
                                <MdDelete size={20} className={styles.icon} />
                            </button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FileTable;
