import React, { useState } from 'react'
import Modal from 'react-modal'
import axios from 'axios'

interface DirectoryProps {
    isOpen: boolean,
    setIsOpen: (id: boolean) => void
    fetchFiles: (id: string) => void
}

function CreateDirectory({ isOpen, setIsOpen, fetchFiles }: DirectoryProps) {
    const [dirName, setDirName] = useState('Nova pasta')
    const handleCreateDir = async (dirName: string) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/files/newDirectory`, { name: dirName })
            fetchFiles('')
            console.log(res.data.message)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <Modal style={{
                content: {
                    width: "15%",
                    maxWidth: "500px",
                    margin: "auto",
                    inset: "unset",
                    padding: "24px",
                    borderRadius: "12px"
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }}
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
                        <button onClick={() => setIsOpen(false)}>Cancelar</button>
                        <button onClick={() => { handleCreateDir(dirName); setIsOpen(false) }}>OK</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CreateDirectory
