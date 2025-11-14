const express = require('express')
const fetch = require('node-fetch');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000})
const RADIUS = 10
const PROJECTILE_RADIUS = 5

const port = 3000
app.use(express.static('public')) //make any file available to the public

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backendPlayers = {}
const backendProjectiles = {}
const SPEED = 5
let projectileId = 0


io.on('connection', (socket) => {
  console.log('a user connected '+socket.id),
  
  io.emit('updateplayers',backendPlayers)

  socket.on('initCanvas', () => {
    
  })

  socket.on('keydown', ({keycode, sequenceNumber}) => {
    const backendPlayer = backendPlayers[socket.id]

    if(!backendPlayers[socket.id]) return
    backendPlayers[socket.id].sequenceNumber = sequenceNumber
    switch(keycode) {
      case 'KeyW':
        backendPlayers[socket.id].y -= SPEED
        break

      case 'KeyA':
        backendPlayers[socket.id].x -= SPEED
        break

      case 'KeyS':
        backendPlayers[socket.id].y += SPEED
        break

      case 'KeyD':
        backendPlayers[socket.id].x += SPEED
        break
    }

    const playerSize = {
      left: backendPlayer.x - backendPlayer.radius,
      right: backendPlayer.x + backendPlayer.radius,
      top: backendPlayer.y - backendPlayer.radius,
      bottom: backendPlayer.y + backendPlayer.radius
    }
    //setting player boundary
    if(playerSize.left < 0){
      backendPlayers[socket.id].x = backendPlayer.radius
    }
    if(playerSize.right > 1024){
      backendPlayers[socket.id].x = 1024 - backendPlayer.radius
    }
    if(playerSize.top < 0)
    {
      backendPlayers[socket.id].y = backendPlayer.radius 
    }
    if(playerSize.bottom > 576){
      backendPlayers[socket.id].y = 576 - backendPlayer.radius
    }
    //chatgpt
    // Store the latest sequenceNumber from this client
    backendPlayers[socket.id].sequenceNumber = sequenceNumber

    // Broadcast to all clients
    io.emit('updateplayers', backendPlayers)

})

   socket.on('shoot', ({x,y,angle}) => {

      const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
      }

      backendProjectiles[projectileId] = {
        id: projectileId, x, y, velocity,playerId: socket.id
      }
      projectileId++
      //io.emit('updateProjectiles', backendProjectiles)
    })

  socket.on('initGame',({username, width, height}) => {
    backendPlayers[socket.id] = {
    x: 1024 * Math.random(),
    y: 576 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0,
    score: 0,
    username: username
  }
  //where we init canvas
    backendPlayers[socket.id].canvas = {
      width,
      height,
    }

    backendPlayers[socket.id].radius = RADIUS
    
    console.log(username)
  })

  socket.on('disconnect',(reason) => {
    console.log(reason)
    delete backendPlayers[socket.id]
    io.emit('updateplayers',backendPlayers)
  })
})

//backend ticker
setInterval(() => {
  //update backend projectiles
  for(const id in backendProjectiles){
    backendProjectiles[id].x += backendProjectiles[id].velocity.x
    backendProjectiles[id].y += backendProjectiles[id].velocity.y

    const PROJECTILE_RADIUS = 5
    if(backendProjectiles[id].x - PROJECTILE_RADIUS >= backendPlayers[backendProjectiles[id].playerId]?.canvas?.width ||
       backendProjectiles[id].x + PROJECTILE_RADIUS <= 0 ||
       backendProjectiles[id].y - PROJECTILE_RADIUS >= backendPlayers[backendProjectiles[id].playerId]?.canvas?.height ||
        backendProjectiles[id].y + PROJECTILE_RADIUS <= 0
    ) {
      delete backendProjectiles[id]
      continue
    }

    for(const playerId in backendPlayers){
      const backendPlayer = backendPlayers[playerId]
      const DISTANCE = Math.hypot(backendProjectiles[id].x - backendPlayer.x, backendProjectiles[id].y - backendPlayer.y)

      //collision detection
      if(DISTANCE < PROJECTILE_RADIUS + backendPlayer.radius && backendProjectiles[id].playerId !== playerId){
        if(backendPlayers[backendProjectiles[id].playerId])
          backendPlayers[backendProjectiles[id].playerId].score++

        console.log(backendPlayers[backendProjectiles[id].playerId])
        delete backendProjectiles[id]
        delete backendPlayers[playerId]
        break
      }
    }

  }
  io.emit('updateProjectiles', backendProjectiles)
  io.emit('updateplayers',backendPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Proxy endpoint for auth check
app.get('/api/checkAuth', async (req, res) => {
    try {
        const phpResponse = await fetch('http://10.57.207.31/gamehub/backend/login_server_validation.php?action=checkAuth', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                      'Cookie': req.headers.cookie || '', // forward browser cookies
             }
        });

        const json = await phpResponse.json();
        res.json(json);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Auth proxy failed' });
    }
});

//proxy endpoint for updating score to DB
app.post('/api/uploadScore', async (req,res) => {
    try{
       const { gameName, score } = req.body;
       //console.log("Forwarding cookies to PHP:", req.headers.cookie);
        //console.log("Score to upload:", score, "Game:", gameName);

        const phpResponse = await fetch('http://10.57.207.31/gamehub/backend/score_handler.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Cookie': req.headers.cookie || '',
            },
            body: new URLSearchParams({
                action: "upload_highscore",
                score,
                gameName
            }),
            credentials: "include" //includes session cookie
        });

        const result = await phpResponse.json();

        if (result.success){
            res.json({ success: true, message: result.message || 'Score updated successfully' });
        } else if (result.error) {
            res.status(500).json({ success: false, error: result.error || 'Server error' });
        }

    }catch (err) {
                console.log("Failed to send score to server: "+err);
                res.status(500).json({ success: false, error: 'Failed to send score to server' });
            }
});

//for fetching player Highscore
app.post('/api/fetchPlayerHighScore', async (req, res) => {
    try{
        const { gameName } = req.body;
        const phpResponse = await fetch('http://10.57.207.31/gamehub/backend/score_handler.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Cookie': req.headers.cookie || '',
            },
            body: new URLSearchParams({
                action: "fetch_highscore",
                gameName: gameName
            }),
        });

        const result = await phpResponse.json();
        res.json(result);
      }catch (err) {
                console.log("Failed to fetch high score from server: "+err);
                res.status(500).json({ error: 'Auth proxy failed' });
            }
});
