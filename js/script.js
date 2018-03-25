'use strict';

var deck = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D0', 'DJ', 'DQ', 'DK', 'DA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H0', 'HJ', 'HQ', 'HK', 'HA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C0', 'CJ', 'CQ', 'CK', 'CA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S0', 'SJ', 'SQ', 'SK', 'SA'];

var cards = document.querySelectorAll('.card');
var newGame = document.querySelector('#newGame');
var menuNewGame = document.querySelector('#menu-newGame');
var endGameRetryGame = document.querySelector('#endGame-retryGame');
var score = document.querySelector('#setScore');
var endGameScore = document.querySelector('#endGameScore');

var myScore = 0;
var newDeck = [];
var twoCards = [];
var ticks = 0;

function CreateCard(num, src) {
	this.num = num;
	this.src = src;
};

var shuffle = function shuffle(arr) {
	for (var i = arr.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var _ref = [arr[j], arr[i]];
		arr[i] = _ref[0];
		arr[j] = _ref[1];
	}
};

var setDeck = function setDeck() {
	shuffle(deck);
	newDeck = deck.slice(0, 9);
	newDeck = newDeck.concat(newDeck);
	shuffle(newDeck);

	cards.forEach(function (item, i) {
		item.classList.add(newDeck[i]);
	});

	var timerId = setInterval(function () {
		ticks++;
		if (ticks < 5) {
			document.querySelector('body').style.pointerEvents = 'none';
		} else {
			document.querySelector('body').style = 'none';
			ticks = 0;
			setBacks();
		}
	}, 1000);

	setTimeout(function () {
		clearInterval(timerId);
	}, 5000);
};

var setBacks = function setBacks() {
	cards.forEach(function (item, i) {
		item.classList.remove(newDeck[i]);
		item.setAttribute('data-tid', 'Card');
		item.style = 'none';
	});
};

// РАБОТАЕМ С КАРТАМИ (OСНОВНАЯ ДОСКА)

cards.forEach(function (item, i) {
	item.addEventListener('click', function (evt) {
		evt.preventDefault();

		item.classList.add(newDeck[i]);
		item.setAttribute('data-tid', 'Card-flipped');

		var currentCard = new CreateCard(i, newDeck[i]);

		compareCards(currentCard);
	});
});

var compareCards = function compareCards(card) {

	twoCards.push(card);

	if (twoCards.length === 2) {
		var isSource = twoCards[0].src === twoCards[1].src;
		var isNum = twoCards[0].num !== twoCards[1].num;

		var _ref2 = [cards[twoCards[0].num], cards[twoCards[1].num]];
		twoCards[0] = _ref2[0];
		twoCards[1] = _ref2[1];


		if (isNum && isSource) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {

				for (var _iterator = twoCards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					item.classList.add('animated', 'fadeOut');
					item.style.pointerEvents = 'none';
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			setScore(true);
			twoCards = [];
		} else if (isNum && !isSource) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {

				for (var _iterator2 = twoCards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _item = _step2.value;

					_item.classList.add('animated', 'shake');
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			document.querySelector('body').style.pointerEvents = 'none';

			var unsetStyles = new Promise(function (resolve, reject) {
				setTimeout(function () {

					twoCards.forEach(function (item) {
						item.className = 'card';
						item.setAttribute('data-tid', 'Card');
					});

					resolve();
				}, 1000);
			});

			unsetStyles.then(function () {
				twoCards = [];
				document.querySelector('body').style = 'none';
			});

			setScore(false);
		} else if (!isNum && isSource) {
			twoCards.pop();
		}
	}
};

var setScore = function setScore(state) {
	var guessed = 0;
	var closed = 0;

	cards.forEach(function (item, i) {
		if (item.classList.contains('fadeOut')) {
			guessed++;
		} else if (!item.classList.contains('fadeOut')) {
			closed++;
		}
	});

	if (state) {
		myScore += closed / 2 * 42;
	} else if (!state) {
		myScore -= guessed / 2 * 42;
	}

	score.textContent = myScore;
	endGame(guessed);
};

var endGame = function endGame(num) {
	if (num === 18) {
		document.querySelector('.end').classList.remove('hidden');
		document.querySelector('.end').classList.add('animated', 'fadeIn');
		document.querySelector('.container').classList.add('hidden');

		endGameScore.textContent = myScore;
	}
};

// КНОПКИ

menuNewGame.addEventListener('click', function (evt) {
	evt.preventDefault();

	myScore = 0;
	score.textContent = '0';

	cards.forEach(function (item) {
		item.className = 'card';
	});

	setDeck();
});

newGame.addEventListener('click', function (evt) {
	evt.preventDefault();

	document.querySelector('.start').classList.add('hidden');
	document.querySelector('.container').classList.remove('hidden');

	setDeck();
});

endGameRetryGame.addEventListener('click', function (evt) {
	evt.preventDefault();

	document.querySelector('.end').classList.add('hidden');
	document.querySelector('.end').classList.remove('animated', 'fadeIn');
	document.querySelector('.container').classList.remove('hidden');

	myScore = 0;
	score.textContent = '0';

	cards.forEach(function (item) {
		item.className = 'card';
		item.style = 'none';
	});

	setDeck();
});