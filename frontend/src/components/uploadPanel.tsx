import React, { useState } from 'react'
import { MdOutlineClose, MdExpandLess, MdExpandMore, MdInsertDriveFile } from 'react-icons/md';
import styles from './uploadPanel.module.css';

interface UploadPanelProps {
    title: string;
    subtitle: string;
    progress: number;
    visible: boolean
    setVisible: (visible: boolean) => void;
}

function UploadPanel({ title, subtitle, progress, visible, setVisible }: UploadPanelProps) {
    const [expand, setExpand] = useState(true)
    if (!visible) return null;

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <p className={styles.title}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
                    <button className={styles.button} onClick={() => setExpand(!expand)}>
                        {expand ? <MdExpandMore size={24} /> : <MdExpandLess size={24} />}
                    </button>
                    <button className={styles.button} onClick={() => setVisible(!visible)}>
                        <MdOutlineClose size={24} />
                    </button>
                </div>
            </div>
            {expand && (
                <div className={styles.item_details}>
                    <MdInsertDriveFile size={18} color="#868686ff" />
                    <p className={styles.item_name}>{subtitle}</p>
                    <p>{progress}%  </p>
                </div>
            )}
        </div>
    )
}

export default UploadPanel
