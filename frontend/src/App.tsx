import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import './App.css'

interface Files {
  id: number;
  nome: string;
  size: number;
}

function App() {
  const [files, setFiles] = useState<Files[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/files/list");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDownload = async (id: number) => {
    const res = await fetch(`http://localhost:8000/api/v1/files/download/${id}`);
    const disposition = res.headers.get("Content-Disposition");
    let filename = `arquivo_${id}`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / file.size);
          console.log("Progresso:", percent, "%");
        },
      });
      fetchFiles()
    } catch (error) {
      console.error("Erro no upload:", error);
    }
    e.target.value = "";

  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/files/delete/${id}`)
      fetchFiles()
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <h1>Arquivos</h1>
        <button onClick={handleButtonClick}>Escolher Arquivo</button>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        {files.map(a => (
          <div key={a.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <li >
              {a.nome} ({a.size} bytes)
            </li>
            <button style={{ backgroundColor: '#0092ccff', padding: 15, border: 'none', borderRadius: 5 }} onClick={() => { handleDownload(a.id); console.log("downloaded") }}>
              <span style={{ color: 'white', fontWeight: 'bold' }}>Download</span>
            </button>
            <button style={{ backgroundColor: '#e76262ff', padding: 15, border: 'none', borderRadius: 5 }} onClick={() => handleDelete(a.id)} >
              <span style={{ color: 'white', fontWeight: 'bold' }}>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
