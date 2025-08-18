import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import UploadPanel from './components/uploadPanel';
import Modal from "react-modal";
import styles from './App.module.css'
import FileTable from './components/fileTable';
import CreateDirectory from './components/createDirectory';
import Button from './components/button';

Modal.setAppElement("#root");

interface Files {
  id: number;
  nome: string;
  size: number;
  type: string;
}

interface UploadPanel {
  title: string;
  subtitle: string;
  progress: number;
}

interface selectedFile {
  id: number,
  name: string,
}

function App() {
  const [file, setFile] = useState<UploadPanel | null>(null);
  const [files, setFiles] = useState<Files[]>([]);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDirOpen, setIsDirOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<selectedFile | null>({ id: 0, name: '' });
  const [path, setPath] = useState("");

  const fetchFiles = async (path: string) => {
    try {
      const safePath = path ?? ''
      const res = await fetch(`http://localhost:8000/api/v1/files/list?dir=${safePath}`);
      const data = await res.json();
      setPath(safePath)
      setFiles(data.arquivos);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  useEffect(() => {
    fetchFiles(path);
  }, [path]);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDownload = (filename: string, directory: string) => {
    const url = `http://localhost:8000/api/v1/files/download?folder=${encodeURIComponent(directory)}&file=${encodeURIComponent(filename)}`;
    window.open(url, "_blank");
  };


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach(file => formData.append("files", file));

    setFile({
      title: `Fazendo upload de ${files.length} item(s)`,
      subtitle: files.map(f => f.name).join(", "),
      progress: 0,
    });
    setVisible(true);

    try {
      await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / files.reduce((acc, f) => acc + f.size, 0));
          setFile(prev => prev ? { ...prev, progress: percent } : prev);
          console.log('percent: ', percent)
        },
      });
      if (file) {
        setFile({ ...file, title: 'Upload completo' });
      }
      fetchFiles(path)
    } catch (error) {
      console.error("Erro no upload:", error);
    }
    e.target.value = "";

  };

  const handleRename = async (id: number, name: string,) => {
    console.log(id, name)
    try {
      await axios.patch(`http://localhost:8000/api/v1/files/rename/${id}`, {
        newName: name
      })
      fetchFiles(path)
    } catch (error) {
      console.error("Erro ao renomear arquivo:", error);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/files/delete/${id}`)
      fetchFiles(path)
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Driveubas/{path}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, marginBottom: 24, alignSelf: 'flex-start' }}>
          <button className={styles.buttonNew} onClick={handleButtonClick}>Upload</button>
          <button className={styles.buttonNew} onClick={() => setIsDirOpen(true)}>Novo Diretorio</button>
        </div>
        <input
          type="file"
          multiple
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <FileTable
          files={files}
          setFiles={setFiles}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onFetch={fetchFiles}
          onRename={setSelectedFile}
          setIsOpen={setIsOpen}
          path={path}
          setPath={setPath}
        />
        {file && (<UploadPanel title={file.title} subtitle={file.subtitle} progress={file.progress} visible={visible} setVisible={setVisible} />)}
      </div>
      <Modal style={{
        content: {
          width: "15%",
          maxWidth: "500px",
          margin: "auto",
          inset: "unset",
          padding: "24px",
          borderRadius: "8px"
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ padding: 0, margin: 0 }}>Renomear</p>
          <input
            type="text"
            value={selectedFile?.name}
            onChange={(e) => setSelectedFile(prev =>
              prev ? { ...prev, name: e.target.value } : { id: 0, name: e.target.value }
            )}
            autoFocus={true}
            maxLength={100}
            spellCheck={false}
          />
          <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', gap: 12 }} >
            <Button text='Cancelar ' variant='cancel' onClick={() => setIsOpen(false)} />
            <Button text='OK' variant="confirm" onClick={() => { handleRename(selectedFile?.id || 0, selectedFile?.name || ''); setIsOpen(false) }} />
          </div>
        </div>

      </Modal>
      <CreateDirectory isOpen={isDirOpen} setIsOpen={setIsDirOpen} fetchFiles={fetchFiles} />
    </>
  )
}

export default App
