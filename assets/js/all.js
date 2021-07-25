"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Symbols = ['https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
];
var GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
};
var utility = {
  getRandomNumberArray: function getRandomNumberArray(count) {
    var number = Array.from(Array(count).keys());

    for (var index = number.length - 1; index > 0; index--) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var _ref = [number[randomIndex], number[index]];
      number[index] = _ref[0];
      number[randomIndex] = _ref[1];
    }

    return number;
  }
};
var view = {
  getCardContent: function getCardContent(index) {
    var number = this.transformNumber(index % 13 + 1);
    var suit = Symbols[Math.floor(index / 13)];
    return "\n      <p>".concat(number, "</p>\n      <img src=").concat(suit, " alt=\"suit\u5716\u793A\">\n      <p>").concat(number, "</p>");
  },
  getCardElement: function getCardElement(index) {
    return "<div class=\"card back\" data-number='".concat(index, "'></div>");
  },
  displayCard: function displayCard(indexs) {
    var _this = this;

    var rawHtml = indexs.map(function (element) {
      return _this.getCardElement(element);
    }).join('');
    var roofElement = document.querySelector('#cards');
    roofElement.innerHTML = rawHtml;
  },
  flipCards: function flipCards() {
    var _this2 = this;

    for (var _len = arguments.length, cards = new Array(_len), _key = 0; _key < _len; _key++) {
      cards[_key] = arguments[_key];
    }

    cards.map(function (card) {
      // 如果是反面
      if (card.matches('.back')) {
        card.classList.remove('back');
        card.innerHTML = _this2.getCardContent(card.dataset.number);
        return;
      }

      card.classList.add('back');
      card.innerHTML = null;
    });
  },
  transformNumber: function transformNumber(index) {
    // 11J 12Q 13K
    switch (index) {
      case 1:
        return 'A';

      case 11:
        return 'J';

      case 12:
        return 'Q';

      case 13:
        return 'K';

      default:
        return index;
    }
  },
  pairedCards: function pairedCards() {
    for (var _len2 = arguments.length, cards = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      cards[_key2] = arguments[_key2];
    }

    console.log('cards', cards);
    cards.forEach(function (card) {
      return card.classList.add('paired');
    });
  },
  renderScore: function renderScore(score) {
    document.querySelector('.header__score span').innerText = score;
  },
  renderTried: function renderTried(tried) {
    document.querySelector('.header__tried span').innerText = tried;
  },
  appendWrongAnimation: function appendWrongAnimation() {
    for (var _len3 = arguments.length, cards = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      cards[_key3] = arguments[_key3];
    }

    cards.map(function (card) {
      card.classList.add('wrong');
      card.addEventListener('animationend', function (e) {
        return e.target.classList.remove('wrong');
      }, {
        once: true
      });
    });
  },
  showGameFinished: function showGameFinished() {
    var div = document.createElement('div');
    div.classList.add('completed');
    div.innerHTML = "\n    <p>Complete!</p>\n    <p>Score: ".concat(model.score, "</p>\n    <p>You've tried: ").concat(model.triedTimes, " times</p>\n    ");
    var header = document.querySelector('#header');
    header.before(div);
  }
};
var model = {
  revealedCard: [],
  isReaveledCardsMatched: function isReaveledCardsMatched() {
    return this.revealedCard[0].dataset.number % 13 === this.revealedCard[1].dataset.number % 13;
  },
  score: 0,
  triedTimes: 0
};
var controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generatCards: function generatCards() {
    view.displayCard(utility.getRandomNumberArray(52));
  },
  dispatchCardAction: function dispatchCardAction(card) {
    if (!card.matches('.back')) {
      return;
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card);
        model.revealedCard.push(card);
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;

      case GAME_STATE.SecondCardAwaits:
        view.renderTried(model.triedTimes += 1);
        view.flipCards(card);
        model.revealedCard.push(card); // 比對是否正確

        if (model.isReaveledCardsMatched()) {
          // 比對正確
          view.renderScore(model.score += 10);
          this.currentState = GAME_STATE.CardsMatched;
          view.pairedCards.apply(view, _toConsumableArray(model.revealedCard));
          model.revealedCard = [];

          if (model.score >= 260) {
            this.currentState = GAME_STATE.GameFinished;
            view.showGameFinished();
            return;
          }

          this.currentState = GAME_STATE.FirstCardAwaits;
        } else {
          // 比對失敗
          this.currentState = GAME_STATE.CardsMatchFailed;
          view.appendWrongAnimation.apply(view, _toConsumableArray(model.revealedCard));
          setTimeout(this.reset, 1000);
        }

        break;
    }

    console.log('currentState', this.currentState);
    console.log('revealedCard', model.revealedCard);
  },
  reset: function reset() {
    console.log('reset');
    view.flipCards.apply(view, _toConsumableArray(model.revealedCard));
    model.revealedCard = [];
    controller.currentState = GAME_STATE.FirstCardAwaits;
  }
};
controller.generatCards();
document.querySelectorAll('.card').forEach(function (card) {
  card.addEventListener('click', function () {
    controller.dispatchCardAction(card);
  });
});
//# sourceMappingURL=all.js.map
