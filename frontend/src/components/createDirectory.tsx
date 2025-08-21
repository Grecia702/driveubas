import React, { useState } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import styles from './createDirectory.module.css'
import Button from './button'

interface DirectoryProps {
    isOpen: boolean,
    setIsOpen: (id: boolean) => void,
    fetchFiles: (id: string) => void,
    path: string
}

function CreateDirectory({ isOpen, setIsOpen, fetchFiles, path }: DirectoryProps) {
    const [dirName, setDirName] = useState('Nova pasta')
    const handleCreateDir = async (dirName: string, path: string) => {
        try {
            const res = await axios.post(`https://localhost:443/api/v1/files/newDirectory?folder=${path}`, { name: dirName })
            fetchFiles('')
            console.log(res.data.message)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <Modal
                className={styles.modal}
                overlayClassName={styles.overlay}
                style={{}}
                isOpen={isOpen} onRequestClose={() => setIsOpen(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <h3>Criar pasta</h3>
                    <input
                        type="text"
                        value={dirName}
                        onChange={(e) => setDirName(e.target.value)}
                        autoFocus={true}
                        maxLength={100}
                        spellCheck={false}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', gap: 12 }} >
                        <Button text={'Cancelar'} variant='cancel' onClick={() => setIsOpen(false)} />
                        <Button text={'OK'} variant='confirm' onClick={() => { handleCreateDir(dirName, path); setIsOpen(false) }} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CreateDirectory
