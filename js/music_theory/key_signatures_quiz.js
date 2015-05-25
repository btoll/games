(function () {

  var aNotes = [], //gather the note names that will be used to build the dom elements;
  aChords = [], //gather the chord names that will be used to build the dom elements;
  aQuizzes = [], //holds the permutations;

  oNotes = {
    "A": ["F&#9839;", "C&#9839;", "G&#9839;"],
    "B": ["F&#9839;", "C&#9839;", "G&#9839;", "D&#9839;", "A&#9839;"],
    "C": ["No &#9839;s or &#9837;s"],
    "D": ["F&#9839;", "C&#9839;"],
    "E": ["F&#9839;", "C&#9839;", "G&#9839;", "D&#9839;"],
    "F": ["B&#9837;"],
    "G": ["F&#9839;"],
    "A&#9837;": ["B&#9837;", "E&#9837;", "A&#9837;", "D&#9837;"],
    "B&#9837;": ["B&#9837;", "E&#9837;"],
    "C&#9837;": ["B&#9837;", "E&#9837;", "A&#9837;", "D&#9837;", "G&#9837;", "C&#9837;", "F&#9837;"],
    "D&#9837;": ["B&#9837;", "E&#9837;", "A&#9837;", "D&#9837;", "G&#9837;"],
    "E&#9837;": ["B&#9837;", "E&#9837;", "A&#9837;"],
    "G&#9837;": ["B&#9837;", "E&#9837;", "A&#9837;", "D&#9837;", "G&#9837;", "C&#9837;"],
    "C&#9839;": ["F&#9839;", "C&#9839;", "G&#9839;", "D&#9839;", "A&#9839;", "E&#9839;", "B&#9839;"],
    "F&#9839;": ["F&#9839;", "C&#9839;", "G&#9839;", "D&#9839;", "A&#9839;", "E&#9839;"]
  },

  fnRandom = function () {
    return (Math.round(Math.random()) - 0.5);
  },

  fnGetArrays = function () { //collect all of the arrays from within the oNotes object;
    var arr = [];

    for (var prop in oNotes) {
      if (oNotes.hasOwnProperty(prop)) {
        aNotes.push(prop); //get each note to use later when we build the dom elements;
        aQuizzes.push(oNotes[prop]);
      }
        aQuizzes.sort(fnRandom);
    }
    //aNotes.sort(fnRandom); //randomize them;
  },

  n = 0,
  fnGetChord = function () { //get the current chord to display to the user;
    if (n === aNotes.length) {
      n = 0;
    }
    //$("currentKeySignature").innerHTML = "<span>" + oNotes[aNotes[n]].join("</span><span>");
    //$("currentKeySignature").currentKeySignature = oNotes[aNotes[n]]; //we need to attach the array to an expando property since we need another way of comparing than the value of the currentChord dom element (since the browser converts the entity when displaying it and it no longer matches the entity when comparing the values in the event handler);
    $("currentKeySignature").innerHTML = "<span>" + aQuizzes[n].join("</span><span>");
    $("currentKeySignature").currentKeySignature = aQuizzes[n]; //we need to attach the array to an expando property since we need another way of comparing than the value of the currentChord dom element (since the browser converts the entity when displaying it and it no longer matches the entity when comparing the values in the event handler);
    n++;
  };

  fnGetArrays();

  JSLITE.ready(function () {

    var i,
      len;

    for (i = 0, len = aNotes.length; i < len; i++) {
      JSLITE.Element.create({tag: "a",
        attr: {
          href: "#"
        },
        children: [
          JSLITE.Element.create({tag: "span",
            attr: {
              innerHTML: aNotes[i],
              note: aNotes[i] //bind an expando property for when comparing values in the event handler;
            }
          })
        ],
        parent: $("keySignatures")
      });
    }

    JSLITE.Element.fly("keySignatures").on("click", function (e) { //note we're only binding one event listener for the entire page (because of this make sure each <span> entirely covers each <a>);
      var oTarget = e.target,
        sNote;

      if (oTarget.nodeName === "SPAN") {
        sNote = oTarget.note;
        if (oNotes[sNote] === $("currentKeySignature").currentKeySignature) {
          alert("Correct");
          fnGetChord();
        } else {
          alert("Incorrect");
        }
      }
      e.preventDefault();
    });

    fnGetChord(); //initialize;

  });

}());

