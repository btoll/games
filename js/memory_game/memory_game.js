JSLITE.ready(function () {
    // An array that holds the newly created card divs.
    var aCards = [],
        // An array that holds the 2 selected cards.
        aSelectedCards = [],
        // An array that holds the cards that have been successfully matched.
        aMatched = [],
        oCardTable = JSLITE.Element.get('#cardTable'),
        iTotalCards = 24,
        iChances = 20,
        aSeed = (function () {
            var arr = [],
                i;

            for (i = iTotalCards / 2; i--;) {
                arr.push(i);
            }

            // Create duplicates.
            return arr.concat(arr);
        }()),
        timer = null,
        oFragment = null,
        i,
        a,

    fnResetCards = function () {
        for (i = aSelectedCards.length; i--;) {
            a = aSelectedCards;
            $(a[0][1]).style.backgroundImage = $(a[1][1]).style.backgroundImage = 'url(images/blue.gif)';
            $(a[0][1]).firstChild.style.display = $(a[1][1]).firstChild.style.display = 'none';
        }
        aSelectedCards.length = 0;
        // Re-attach the event handler.
        oCardTable.on('click', fnShowValue);
    },

    fnCompareCards = function () {
        // Remove the listener to simplify the UI while the cards are processed.
        oCardTable.un('click', fnShowValue);

        if (parseInt(aSelectedCards[0][0], 10) === parseInt(aSelectedCards[1][0], 10)) {
            // Increment their 'matches' score.
            $('matches').innerHTML = parseInt($('matches').innerHTML, 10) + 1;
            aMatched.push(aSelectedCards[0][1], aSelectedCards[1][1]);
            //fnResetCards();

            // All the cards have been successfully matched.
            if (aMatched.length === 24) {
                if (confirm('Congratulations, you won! Play again?')) {
                    clearTimeout(timer);
                    initGame();
                }
            } else {
                JSLITE.ux.fade($('scorer'), 0, 0, 221);
                $('scorer').innerHTML = 'Match!';
                aSelectedCards.length = 0;
                // Re-attach the event handler.
                oCardTable.on('click', fnShowValue);
            }

        } else {
            JSLITE.ux.fade($('scorer'), 238, 0, 0);
            $('scorer').innerHTML = 'Too bad, you lost a chance!';

            // There was no match so reset their backgrounds images after 1.2 seconds.
            timer = setTimeout(function () {
                fnResetCards();
            }, 1200);

            $('chances').innerHTML = parseInt($('chances').innerHTML, 10) - 1;

            if (parseInt($('chances').innerHTML, 10) === 0) {
                if (confirm('You lost! Play again?')) {
                    clearTimeout(timer);
                    initGame();
                } else {
                    $('cardTable').style.display = 'none';
                }
            }
        }
    },

    fnShowValue = function (e) {
        var target = e.target;

        // Since there's only one handler for the entire page we need to make sure the user actually clicked on a card and discard all other events.
        if (/card\d{1,2}/.test(target.id)) {
            target.style.backgroundImage = 'none';
            target.firstChild.style.display = 'block';
            aSelectedCards.push([JSLITE.Element.get('span', target).value(), target.id]);

            if (aSelectedCards.length === 2) {
                // Send along the text from within the paragraph (it will be a number) and the div id as an array.
                fnCompareCards();
            }
        }
    },

    initGame = function () {
        aCards.length = 0;
        $('cardTable').innerHTML = '';
        $('chances').innerHTML = iChances;
        $('matches').innerHTML = 0;

        aSeed.sort(function () {
            return (Math.round(Math.random()) - 0.5);
        });

        // Create an array that holds two of each number (array elements = [number displayed by the paragraph, div element]).
        // REMEMBER that each div MUST have a unique id, hence the creation of an array that holds both the number and a unique id.
        for (i = iTotalCards; i--;) {
            aCards.push(JSLITE.Element.create({tag: 'div',
                attr: {
                    id: 'card' + i
                },
                children: [
                    JSLITE.Element.create({tag: 'p',
                        children: [
                            JSLITE.Element.create({tag: 'span',
                                attr: {
                                    innerHTML: aSeed[i]
                                }
                            })
                        ]
                    })
                ]
            }));
        }

        // Let's use a document fragment to optimize.
        oFragment = document.createDocumentFragment();

        for (i = aCards.length; i--;) {
            oFragment.appendChild(aCards[i].dom);
        }

        $('cardTable').appendChild(oFragment);

        // Event delegation.
        oCardTable.on('click', fnShowValue);

        aSelectedCards.length = 0;
        aMatched.length = 0;
    };

    initGame();
});

