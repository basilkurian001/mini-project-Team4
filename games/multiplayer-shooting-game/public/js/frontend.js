const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

  const socket = io()

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRation = window.devicePixelRatio || 1

canvas.width = 1024 * devicePixelRation
canvas.height = 576 * devicePixelRation

c.scale(devicePixelRation, devicePixelRation)

const x = canvas.width / 2
const y = canvas.height / 2

const frontEndPlayers = {}
const frontEndProjectiles = {}


socket.on('updateProjectiles',(backendProjectiles) => {
  for(const id in backendProjectiles){
    const backendProjectile = backendProjectiles[id]

    if(!frontEndProjectiles[id]){
      frontEndProjectiles[id] = new Projectile({
        x: backendProjectile.x, 
        y: backendProjectile.y, 
        radius: 5, 
        color: frontEndPlayers[backendProjectile.playerId]?.color,
        velocity: backendProjectile.velocity
      })
    } else{
      frontEndProjectiles[id].x += backendProjectile.velocity.x
      frontEndProjectiles[id].y += backendProjectile.velocity.y
    }
  }

  for(const frontEndProjectileId in frontEndProjectiles){
    if(!backendProjectiles[frontEndProjectileId]){
      delete frontEndProjectiles[frontEndProjectileId]
    }
  }
})

socket.on('updateplayers',(backendPlayers) => {
  for (const id in backendPlayers){
    const backendPlayer = backendPlayers[id]

    if(!frontEndPlayers[id]){
      frontEndPlayers[id] = new Player({
        x:backendPlayer.x,
        y:backendPlayer.y,
         radius:10,
          color:backendPlayer.color,
          username : backendPlayer.username
        })

        document.querySelector('#player-labels').innerHTML += `<div data-id="${id}" data-score="${backendPlayer.score}">${backendPlayer.username}: ${backendPlayer.score}</div>`
    }
    else{
      document.querySelector(`div[data-id="${id}"]`).innerHTML = `${backendPlayer.username}: ${backendPlayer.score}`

      document.querySelector(`div[data-id="${id}"]`).setAttribute('data-score',backendPlayer.score)
      //sorting the leaderboard
      const parentDiv = document.querySelector('#player-labels')
      const childDivs = Array.from(parentDiv.querySelectorAll('div'))
      childDivs.sort((a, b) => {
      const scoreA = Number(a.getAttribute('data-score'))
      const scoreB = Number(b.getAttribute('data-score'))
      return scoreB - scoreA
      })
      //removes old elements
      childDivs.forEach(div => {
        parentDiv.removeChild(div)
      })
      //adds sorted elements
      childDivs.forEach(div => {
        parentDiv.appendChild(div)
      })

      frontEndPlayers[id].target = {
        x: backendPlayer.x,
        y: backendPlayer.y
      }

      if(id === socket.id){
        const lastBackendInputIndex = playerInputs.findIndex(input => {
          return backendPlayer.sequenceNumber === input.sequenceNumber
        })

        if (lastBackendInputIndex > -1)
        {
          playerInputs.splice(0, lastBackendInputIndex+1)
          playerInputs.forEach(input => {
            frontEndPlayers[id].target.x += input.dx
            frontEndPlayers[id].target.y += input.dy
          })
        }
      }
    }
  }

  //this is where we delete frontend players
  for(const id in frontEndPlayers){
    if(!backendPlayers[id]){
      const deadPlayerScore = document.querySelector(`div[data-id="${id}"]`)?.getAttribute('data-score')
      console.log("deadplayer score: "+deadPlayerScore)
      const divToDelete = document.querySelector(`div[data-id="${id}"]`)
      divToDelete.parentNode.removeChild(divToDelete)
      //reshow the username submission form when player dies
      if(id === socket.id){
        document.querySelector('#usernameForm').style.display = 'block'
        // Upload only your score to the DB
        if (deadPlayerScore !== null) {
          checkAuth(deadPlayerScore)
        }
      }

      delete frontEndPlayers[id]
    }
  }
})

/* socket.on('updateprojectiles', (backendProjectiles) => {
  frontEndProjectiles.length = 0 // clear old projectiles
  for (const id in backendProjectiles) {
    const p = backendProjectiles[id]
    frontEndProjectiles.push(
      new Projectile(p.x, p.y, 5, 'white', p.velocity)
    )
  }
}) */


let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  //c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.clearRect(0, 0, canvas.width, canvas.height)

  for(const id in frontEndPlayers){
    const frontEndPlayer = frontEndPlayers[id]

    if(frontEndPlayer.target){
      frontEndPlayers[id].x += (frontEndPlayers[id].target.x - frontEndPlayers[id].x) * 0.5
      frontEndPlayers[id].y += (frontEndPlayers[id].target.y - frontEndPlayers[id].y) * 0.5
    }

    frontEndPlayer.draw()
  }

  for(const id in frontEndProjectiles){
    const frontEndProjectile = frontEndProjectiles[id]
    frontEndProjectile.draw()
  }

  /* for(let i = frontEndProjectiles.length-1; i>=0; i--) {
      const frontEndProjectile = frontEndProjectiles[i]
      frontEndProjectile.draw()
      frontEndProjectile.update()
  } */
}

animate()

const keys = {
  w: {
    pressed:false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const SPEED = 5
const playerInputs = []
let sequenceNumber = 0
setInterval(() => {
  if(keys.w.pressed){
    sequenceNumber++  
    playerInputs.push({sequenceNumber: sequenceNumber, dx: 0, dy: -SPEED})
    //frontEndPlayers[socket.id].y -= SPEED
    socket.emit('keydown', {keycode: 'KeyW', sequenceNumber})
  }

  if(keys.a.pressed){
    sequenceNumber++  
    playerInputs.push({sequenceNumber: sequenceNumber, dx: -SPEED, dy: 0})
    //frontEndPlayers[socket.id].x -= SPEED
    socket.emit('keydown', {keycode: 'KeyA', sequenceNumber})
  }

  if(keys.s.pressed){
    sequenceNumber++  
    playerInputs.push({sequenceNumber: sequenceNumber, dx: 0, dy: SPEED})
    //frontEndPlayers[socket.id].y += SPEED
    socket.emit('keydown', {keycode: 'KeyS', sequenceNumber})
  }

  if(keys.d.pressed){
    sequenceNumber++  
    playerInputs.push({sequenceNumber: sequenceNumber, dx: SPEED, dy: 0})
    //frontEndPlayers[socket.id].x += SPEED
    socket.emit('keydown', {keycode: 'KeyD', sequenceNumber})
  }
}, 15);

window.addEventListener('keydown', (event) => {
  if(!frontEndPlayers[socket.id]) return

  switch(event.code) {
    case 'KeyW':
      keys.w.pressed = true
      break

    case 'KeyA':
      keys.a.pressed = true
      break

    case 'KeyS':
      keys.s.pressed = true
      break

    case 'KeyD':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
     if(!frontEndPlayers[socket.id]) return

  switch(event.code) {
    case 'KeyW':
      keys.w.pressed = false
      break

    case 'KeyA':
      keys.a.pressed = false
      break

    case 'KeyS':
      keys.s.pressed = false
      break

    case 'KeyD':
      keys.d.pressed = false
      break
  }
})

document.querySelector('#usernameForm').addEventListener('submit', (event) => {
  initialise(1);
  event.preventDefault()
  document.querySelector('#usernameForm').style.display = 'none'
  socket.emit('initGame',{
    width: canvas.width, 
    height: canvas.height,
    devicePixelRation,
    username: document.querySelector('#usernameInput').value
  })
})