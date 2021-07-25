const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}
const view = {
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const suit = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src=${suit} alt="suit圖示">
      <p>${number}</p>`
  },
  getCardElement(index) {
    return `<div class="card back" data-number='${index}'></div>`
  },
  displayCard(indexs) {
    const rawHtml = indexs.map(element => this.getCardElement(element)).join('')
    const roofElement = document.querySelector('#cards')
    roofElement.innerHTML = rawHtml
  },
  flipCards(...cards) {
    cards.map(card => {
      // 如果是反面
      if (card.matches('.back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(card.dataset.number)
        return
      }
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  transformNumber(index) {
    // 11J 12Q 13K
    switch (index) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return index
    }
  },
  pairedCards(...cards) {
    console.log('cards', cards)
    cards.forEach(card => card.classList.add('paired'))
  },
  renderScore(score) {
    document.querySelector('.header__score span').innerText = score
  },
  renderTried(tried) {
    document.querySelector('.header__tried span').innerText = tried
  },
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', e => e.target.classList.remove('wrong'), { once: true })
    })
  },
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
    <p>Complete!</p>
    <p>Score: ${model.score}</p>
    <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

const model = {
  revealedCard: [],
  isReaveledCardsMatched() {
    return this.revealedCard[0].dataset.number % 13 === this.revealedCard[1].dataset.number % 13
  },
  score: 0,
  triedTimes: 0
}
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generatCards() {
    view.displayCard(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card) {
    if (!card.matches('.back')) { return }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCard.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTried(model.triedTimes += 1)
        view.flipCards(card)
        model.revealedCard.push(card)
        // 比對是否正確
        if (model.isReaveledCardsMatched()) {
          // 比對正確
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairedCards(...model.revealedCard)
          model.revealedCard = []
          if (model.score >= 260) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 比對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCard)
          setTimeout(this.reset, 1000)
        }
        break
    }
    console.log('currentState', this.currentState)
    console.log('revealedCard', model.revealedCard)
  },
  reset() {
    console.log('reset')
    view.flipCards(...model.revealedCard)
    model.revealedCard = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}
controller.generatCards()
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function () {
    controller.dispatchCardAction(card)
  })
})
