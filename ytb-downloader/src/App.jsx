import { useState } from 'react'
import './App.css'

function App() {
    const [link, setLink] = useState('')
    const [formats, setFormats] = useState([])
    const [selectedFormat, setSelectedFormat] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('https://ytb-downloader-nboc.onrender.com/api/formats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link }),
        })
        const data = await response.json()
        setFormats(data.qualities || [])
        setSelectedFormat(data.qualities?.[0] || '')
    }
    
    const handleDownload = () => {
        if (!selectedFormat) return
        window.location.href = `https://ytb-downloader-nboc.onrender.com/api/download?url=${encodeURIComponent(link)}&quality=${selectedFormat}`
    }

    return (
        <div
            style={{
                minHeight: '33vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '40px'
            }}
        >
            <h1 style={{ textAlign: 'center', marginTop: '10px', letterSpacing: '2px' }}>
                <span style={{ color: '#8B0000' }}>Y</span>
                <span style={{ color: '#FF0000' }}>TB</span>
                <span style={{ color: 'inherit' }}> DOWNLOADER</span>
            </h1>
            <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
                <input 
                    type="text"
                    placeholder="Youtube Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    style={{ padding: '8px', width: '300px' }}
                />
                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
            {formats.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <select
                        value={selectedFormat}
                        onChange={e => setSelectedFormat(e.target.value)}
                        style={{ padding: '8px', marginRight: '8px' }}
                    >
                        {formats.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                    <button onClick={handleDownload} className="submit-btn">
                        Download
                    </button>
                </div>
            )}
        </div>
    )
}

export default App
