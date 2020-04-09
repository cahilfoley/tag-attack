function showGameOverMessage(font: p5.Font, score: number, killedBy: string) {
  push()
  background(0, 150)
  fill(255)
  textFont(font)
  textStyle(BOLD)
  stroke(150, 50, 50)
  strokeWeight(10)
  textSize(150)
  text('game over', windowWidth / 2, windowHeight / 2 - 75)
  textSize(50)
  text(`your score: ${score}`, windowWidth / 2, windowHeight / 2 + 50)
  textSize(35)
  textFont(regularFont)
  strokeWeight(2)
  text(
    `You were killed by: ${killedBy}`,
    windowWidth / 2,
    windowHeight / 2 + 125
  )
  pop()
}

function showNextRoundMessage(
  font: p5.Font,
  roundNumber: number,
  message: Message,
  prefix: string
) {
  push()
  background(0, 150)
  fill(255)
  textFont(font)
  textStyle(BOLD)
  stroke(150, 50, 50)
  strokeWeight(10)
  textSize(150)
  text(`round ${roundNumber + 1}`, windowWidth / 2, windowHeight / 3)

  const messageBox = document.getElementById(
    'messageContainer'
  ) as HTMLDivElement
  const messageContent = document.getElementById('message')

  messageBox.classList.remove('hidden')
  messageContent.innerHTML = message.content

  const transmissionContent = document.getElementById('transmission')
  transmissionContent.innerHTML = `${prefix} ${message.sender} wants to grab a coffee with you`

  pop()
}

function showGameTitle(font: p5.Font) {
  push()
  stroke(255, 232, 31)
  noFill()
  strokeWeight(4)
  textFont(font)
  textSize(80)
  textStyle(BOLD)
  text(`ayesha's coffee shot`, windowWidth / 2, 50)
  pop()
}

function showScore(font: p5.Font, score: number) {
  push()
  stroke(255, 232, 31)
  noFill()
  strokeWeight(2)
  textFont(font)
  textSize(35)
  textStyle(BOLD)
  text(`score: ${score}`, windowWidth - 200, 50)
  pop()
}

function showVictoryMessage(font: p5.Font, score: number) {
  push()
  background(0, 150)
  fill(255)
  textFont(font)
  textStyle(BOLD)
  stroke(150, 50, 50)
  strokeWeight(10)
  textSize(150)
  textSize(50)
  text(`victory - well done`, windowWidth / 2, windowHeight / 2 - 75)
  textSize(50)
  text(`total score: ${score}`, windowWidth / 2, windowHeight / 2 + 50)
  pop()
}

function messages(font: p5.Font, message: Message) {
  rect(windowWidth / 2, windowHeight / 2, 200, 200)
  fill('lightGrey')
}
