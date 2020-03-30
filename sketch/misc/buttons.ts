function setupButtons() {
  const muteButton = document.getElementById('mute') as HTMLButtonElement

  let muted = false

  muteButton.onclick = function(event) {
    if (muted) {
      music.setVolume(0.1)
      explosionSound.setVolume(1)
      laserSound.setVolume(0.4)
      playerLaserSound.setVolume(0.6)
      muted = false
      muteButton.classList.remove('muted')
    } else {
      music.setVolume(0)
      explosionSound.setVolume(0)
      laserSound.setVolume(0)
      playerLaserSound.setVolume(0)
      muted = true
      muteButton.classList.add('muted')
    }
  }

  const retryButton = document.getElementById('retry')

  retryButton.onclick = function(event) {
    setup()
    loop()
    retryButton.classList.add('hidden')
  }

  const continueButton = document.getElementById('continue')

  continueButton.onclick = function(event) {
    startRound(levels[roundNumber])
    continueButton.classList.add('hidden')
  }

  return { continueButton, muteButton, retryButton }
}
