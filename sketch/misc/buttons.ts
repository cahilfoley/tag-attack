function setupButtons() {
  const muteButton = document.getElementById('mute') as HTMLButtonElement

  let muted = false

  muteButton.onclick = function (event) {
    muted = !muted
    sounds.forEach((sound) => sound.file.setVolume(muted ? 0 : sound.volume))
    muteButton.classList[muted ? 'add' : 'remove']('muted')
  }

  const retryButton = document.getElementById('retry')

  retryButton.onclick = function (event) {
    setup()
    loop()
    retryButton.classList.add('hidden')
  }

  const continueButton = document.getElementById('continue')

  continueButton.onclick = function (event) {
    startRound(levels[roundNumber])
    continueButton.classList.add('hidden')
  }

  const exitButton = document.getElementById('exit')

  exitButton.onclick = function () {
    require('electron').remote.getCurrentWindow().close()
  }

  return { continueButton, exitButton, muteButton, retryButton }
}
