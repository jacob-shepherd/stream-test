const express = require('express')
const fs = require('fs-extra')
const app = express()


app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + "video.html")
})

app.get('/video', function (req, res) {
    const range = req.headers.range
    if(!range){
        res.status(400).send('range headers required')
    }
    const videoPath = 'metallicahaverster.mp4'
    const videoSize = fs.statSync(videoPath).size



    const CHUNK_SIZE = 10 ** 4; // ~ 1mb
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize -1)
    const contentLength = end - start + 1


    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

app.get('/test', (req, res) => {
    const videoPath = 'metallicahaverster.mp4'
    res.sendFile(__dirname + '/' + "video.html")
})





app.post('/auth', (req, res) => {
    const streamkey = req.body.key

    if(streamkey === 'secret'){
        res.status(200).send()
        return
    }

    res.status(403).send('rejected')
    //auth failed
})



app.listen(5000, () => {
    console.log('listening on port: 5000')
})


