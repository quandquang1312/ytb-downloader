const express = require('express')
const cors = require('cors')
const ytdl = require('ytdl-core')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.post('/api/postlink', (req, res) => {
    console.log('/api/postlink is called')

    const { link } = req.body
    console.log('Received link: ', link)
    res.json({ message: `Link received! ${link}` })
})

app.get('/api/download', async (req, res) => {
    console.log('/api/download is called')

    const videoUrl = req.query.url
    const quality = req.query.quality

    if (!videoUrl) {
        return res.status(400).send('Missing url parameter')
    }

    try {
        const info = await ytdl.getInfo(videoUrl)
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '')

        let format
        if (quality) {
            format = info.formats.find(f => f.qualityLabel === quality && f.hasAudio && f.hasVideo)
        }
        if (!format) {
            format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' })
        }
        res.header('Content-Disposition', `attachment; filename="${title}_${quality || 'video'}.mp4"`)
        ytdl(videoUrl, { format }).pipe(res)
    } catch (err) {
        console.error('Download error:', err)
        res.status(500).send('Failed to download video')
    }
})

app.post('/api/formats', async (req, res) => {
    console.log('/api/formats is called')

    const { link } = req.body
    if (!link) return res.status(400).json({ error: 'Missing link' })
    try {
        const info = await ytdl.getInfo(link)
        const videoFormats = info.formats.filter(f => f.qualityLabel && f.hasVideo)
        const qualitiesSet = new Set(videoFormats.map(f => f.qualityLabel))
        const qualities = Array.from(qualitiesSet).sort((a, b) => {
            const getHeight = q => parseInt(q)
            return getHeight(a) - getHeight(b)
        })
        console.log('Available qualities:', qualities)
        res.json({ qualities });
    } catch (err) {
        console.log('Failed Catches')
        res.status(500).json({ error: 'Failed to fetch formats' });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})