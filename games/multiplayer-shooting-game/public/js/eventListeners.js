addEventListener('click', (event) => {
  const canvas = document.querySelector('canvas')
  const {top, left} = canvas.getBoundingClientRect()
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  const angle = Math.atan2(
    (event.clientY - top) - playerPosition.y,
    (event.clientX - left) - playerPosition.x
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
 /* frontEndProjectiles.push(
   new Projectile(playerPosition.x, playerPosition.y, 5, 'white', velocity)
  ) */
  socket.emit('shoot', {
    x: playerPosition.x,
    y: playerPosition.y,
    angle
  })
})
