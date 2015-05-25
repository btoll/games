(function () {
  /*
  NOTES
  - chordQuiz and chordBuilder use the same div but just turn on/off different elements depending on what radio button was selected
  - the types of chords that display (i.e., "Major7", "HalfDiminished7") depend on the properties of the oDeepCopy object
  */

  var getChord = function () {
    fnGetChord();
  },

  init = function (skillLevel) {
    sSkillLevel = skillLevel || "advanced";
    n = 0; //reset the counter;

    if (!oCache[sSkillLevel]) { //first lookup the skill level to see if the object needs to be created;
      fnGetArrays();
    }

    fnSetQuiz();

    if (sSkillLevel !== "beginner") {
      $("inversions").style.visibility = "visible";
    } else {
      $("inversions").style.visibility = "hidden";
    }

    fnGetChord(); //get first chord permutation;

  },

  skip = function () {
    fnGetChord();
  },

  aChordBuilder = [],

  oCache = {
    beginner: null,
    intermediate: null,
    advanced: null,
    chordBuilder: null
  },

  aNotes = [], //gather the note names that will be used to build the dom elements;
  aInversions = ["RootPosition", "FirstInversion", "SecondInversion", "ThirdInversion"],
  oDeepCopy = {}, //holds the deep copy of either the oNotes object or both te oNotes and oNotesAdvanced objects;
  aPermutations = [], //holds the permutations;
  sSkillLevel,

  oNotes = {
    "A": {
      Major7: ["A", "C&#9839;", "E", "G&#9839;"],
      Minor7: ["A", "C", "E", "G"]
    },
    "B": {
      Major7: ["B", "D&#9839;", "F&#9839;", "A&#9839;"],
      Minor7: ["B", "D", "F&#9839;", "A"]
    },
    "C": {
      Major7: ["C", "E", "G", "B"],
      Minor7: ["C", "E&#9837;", "G", "B&#9837;"]
    },
    "D": {
      Major7: ["D", "F&#9839;", "A", "C&#9839;"],
      Minor7: ["D", "F", "A", "C"]
    },
    "E": {
      Major7: ["E", "G&#9839;", "B", "D&#9839;"],
      Minor7: ["E", "G", "B", "D"]
    },
    "F": {
      Major7: ["F", "A", "C", "E"],
      Minor7: ["F", "A&#9837;", "C", "E&#9837;"]
    },
    "G": {
      Major7: ["G", "B", "D", "F&#9839;"],
      Minor7: ["G", "B&#9837;", "D", "F"]
    },
    "A&#9837;": {
      Major7: ["A&#9837;", "C", "E&#9837;", "G"],
      Minor7: ["A&#9837;", "C&#9837;", "E&#9837;", "G&#9837;"]
    },
    "B&#9837;": {
      Major7: ["B&#9837;", "D", "F", "A"],
      Minor7: ["B&#9837;", "D&#9837;", "F", "A&#9837;"]
    },
    "C&#9837;": false,
    "D&#9837;": {
      Major7: ["D&#9837;", "F", "A&#9837;", "C"],
      Minor7: ["D&#9837;", "F&#9837;", "A&#9837;", "C&#9837;"]
    },
    "E&#9837;": {
      Major7: ["E&#9837;", "G", "B&#9837;", "D"],
      Minor7: ["E&#9837;", "G&#9837;", "B&#9837;", "D&#9837;"]
    },
    "F&#9837;": false,
    "G&#9837;": {
      Major7: ["G&#9837;", "B&#9837;", "D&#9837;", "F"],
      Minor7: ["G&#9837;", "B&#9837;&#9837;", "D&#9837;", "F&#9837;"]
    },
    "A&#9839;": {
      Major7: ["A&#9839;", "C&#9839;&#9839;", "E&#9839;", "G&#9839;&#9839;"],
      Minor7: ["A&#9839;", "C&#9839;", "E&#9839;", "G&#9839;"]
    },
    "B&#9839;": false,
    "C&#9839;": {
      Major7: ["C&#9839;", "E&#9839;", "G&#9839;", "B&#9839;"],
      Minor7: ["C&#9839;", "E", "G&#9839;", "B"]
    },
    "D&#9839;": {
      Major7: ["D&#9839;", "F&#9839;&#9839;", "A&#9839;", "C&#9839;&#9839;"],
      Minor7: ["D&#9839;", "F&#9839;", "A&#9839;", "C&#9839;"]
    },
    "E&#9839;": false,
    "F&#9839;": {
      Major7: ["F&#9839;", "A&#9839;", "C&#9839;", "E&#9839;"],
      Minor7: ["F&#9839;", "A", "C&#9839;", "E"]
    },
    "G&#9839;": {
      Major7: ["G&#9839;", "B&#9839;", "D&#9839;", "F&#9839;&#9839;"],
      Minor7: ["G&#9839;", "B", "D&#9839;", "F&#9839;"]
    }
  },

  oNotesAdvanced = {
    "A": {
      Dominant7: ["A", "C&#9839;", "E", "G"],
      Augmented7: ["A", "C&#9839;", "E&#9839;", "G"],
      HalfDiminished7: ["A", "C", "E&#9837;", "G"],
      MinorMajor7: ["A", "C", "E", "G&#9839;"]
    },
    "B": {
      Dominant7: ["B", "D&#9839;", "F&#9839;", "A"],
      Augmented7: ["B", "D&#9839;", "F&#9839;&#9839;", "A"],
      HalfDiminished7: ["B", "D", "F", "A"],
      MinorMajor7: ["B", "D", "F&#9839;", "A&#9839;"]
    },
    "C": {
      Dominant7: ["C", "E", "G", "B&#9837;"],
      Augmented7: ["C", "E", "G&#9839;", "B&#9837;"],
      HalfDiminished7: ["C", "E&#9837;", "G&#9837;", "B&#9837;"],
      MinorMajor7: ["C", "E&#9837;", "G", "B"]
    },
    "D": {
      Dominant7: ["D", "F&#9839;", "A", "C"],
      Augmented7: ["D", "F&#9839;", "A&#9839;", "C"],
      HalfDiminished7: ["D", "F", "A&#9837;", "C"],
      MinorMajor7: ["D", "F", "A", "C&#9839;"]
    },
    "E": {
      Dominant7: ["E", "G&#9839;", "B", "D"],
      Augmented7: ["E", "G&#9839;", "B&#9839;", "D"],
      HalfDiminished7: ["E", "G", "B&#9837;", "D"],
      MinorMajor7: ["E", "G", "B", "D&#9839;"]
    },
    "F": {
      Dominant7: ["F", "A", "C", "E&#9837;"],
      Augmented7: ["F", "A", "C&#9839;", "E&#9837;"],
      HalfDiminished7: ["F", "A&#9837;", "C&#9837;", "E&#9837;"],
      MinorMajor7: ["F", "A&#9837;", "C", "E"]
    },
    "G": {
      Dominant7: ["G", "B", "D", "F"],
      Augmented7: ["G", "B", "D&#9839;", "F"],
      HalfDiminished7: ["G", "B&#9837;", "D&#9837;", "F"],
      MinorMajor7: ["G", "B&#9837;", "D", "F&#9839;"]
    },
    "A&#9837;": {
      Dominant7: ["A&#9837;", "C", "E&#9837;", "G&#9837;"],
      Augmented7: ["A&#9837;", "C", "E", "G&#9837;"],
      HalfDiminished7: ["A&#9837;", "C&#9837;", "E", "G&#9837;"],
      MinorMajor7: ["A&#9837;", "C&#9837;", "E&#9837;", "G"]
    },
    "B&#9837;": {
      Dominant7: ["B&#9837;", "D", "F", "A&#9837;"],
      Augmented7: ["B&#9837;", "D", "F&#9839;", "A&#9837;"],
      HalfDiminished7: ["B&#9837;", "D&#9837;", "F&#9837;", "A&#9837;"],
      MinorMajor7: ["B&#9837;", "D&#9837;", "F", "A"]
    },
    "C&#9837;": false,
    "D&#9837;": {
      Dominant7: ["D&#9837;", "F", "A&#9837;", "C&#9837;"],
      Augmented7: ["D&#9837;", "F", "A", "C&#9837;"],
      HalfDiminished7: ["D&#9837;", "F&#9837;", "A&#9837;&#9837;", "C&#9837;"],
      MinorMajor7: ["D&#9837;", "F&#9837;", "A&#9837;", "C"]
    },
    "E&#9837;": {
      Dominant7: ["E&#9837;", "G", "B&#9837;", "D&#9837;"],
      Augmented7: ["E&#9837;", "G", "B", "D&#9837;"],
      HalfDiminished7: ["E&#9837;", "G&#9837;", "B&#9837;&#9837;", "D&#9837;"],
      MinorMajor7: ["E&#9837;", "G&#9837;", "B&#9837;", "D"]
    },
    "F&#9837;": false,
    "G&#9837;": {
      Dominant7: ["G&#9837;", "B&#9837;", "D&#9837;", "F&#9837;"],
      Augmented7: ["G&#9837;", "B&#9837;", "D", "F&#9837;"],
      HalfDiminished7: ["G&#9837;", "B&#9837;&#9837;", "D&#9837;&#9837;", "F&#9837;"],
      MinorMajor7: ["G&#9837;", "B&#9837;&#9837;", "D&#9837;", "F"]
    },
    "A&#9839;": {
      Dominant7: ["A&#9839;", "C&#9839;&#9839;", "E&#9839;", "G&#9839;"],
      Augmented7: ["A&#9839;", "C&#9839;&#9839;", "E&#9839;&#9839;", "G&#9839;"],
      HalfDiminished7: ["A&#9839;", "C&#9839;", "E", "G&#9839;"],
      MinorMajor7: ["A&#9839;", "C&#9839;", "E&#9839;", "G&#9839;&#9839;"]
    },
    "B&#9839;": false,
    "C&#9839;": {
      Dominant7: ["C&#9839;", "E&#9839;", "G&#9839;", "B"],
      Augmented7: ["C&#9839;", "E&#9839;", "G&#9839;&#9839;", "B"],
      HalfDiminished7: ["C&#9839;", "E", "G", "B"],
      MinorMajor7: ["C&#9839;", "E", "G&#9839;", "B&#9839;"]
    },
    "D&#9839;": {
      Dominant7: ["D&#9839;", "F&#9839;&#9839;", "A&#9839;", "C&#9839;"],
      Augmented7: ["D&#9839;", "F&#9839;&#9839;", "A&#9839;&#9839;", "C&#9839;"],
      HalfDiminished7: ["D&#9839;", "F&#9839;", "A", "C&#9839;"],
      MinorMajor7: ["D&#9839;", "F&#9839;", "A&#9839;", "C&#9839;&#9839;"]
    },
    "E&#9839;": false,
    "F&#9839;": {
      Dominant7: ["F&#9839;", "A&#9839;", "C&#9839;", "E"],
      Augmented7: ["F&#9839;", "A&#9839;", "C&#9839;&#9839;", "E"],
      HalfDiminished7: ["F&#9839;", "A", "C", "E"],
      MinorMajor7: ["F&#9839;", "A", "C&#9839;", "E&#9839;"]
    },
    "G&#9839;": {
      HalfDiminished7: ["G&#9839;", "B", "D", "F&#9839;"],
      Augmented7: ["G&#9839;", "B", "D&#9839;", "F&#9839;"],
      Dominant7: ["G&#9839;", "B&#9839;", "D&#9839;", "F&#9839;"],
      MinorMajor7: ["G&#9839;", "B", "D&#9839;", "F&#9839;&#9839;"]
    }
  },

  fnRandom = function () {
    return (Math.round(Math.random()) - 0.5);
  },

  fnMakeInversions = function (obj) { //instead of hardcoding the inversions, make them on the fly and bind them to the oDeepCopy object;
    var aClone = obj.arr.concat(),
      aClone2 = obj.arr.concat(),
      aClone3 = obj.arr.concat(),
      sTemp = aClone.shift(),
      aTemp = aClone2.splice(0, 2),
      sTemp3 = aClone3.pop();

    aClone.push(sTemp);
    aClone3.unshift(sTemp3);
    aPermutations.push(oDeepCopy[obj.note][obj.chord + "FirstInversion"] = aClone);
    aPermutations.push(oDeepCopy[obj.note][obj.chord + "SecondInversion"] = aClone2.concat(aTemp));
    aPermutations.push(oDeepCopy[obj.note][obj.chord + "ThirdInversion"] = aClone3);
  },

  fnGetArrays = function () { //collect all of the arrays from within the oDeepCopy object;
    var arr = [],
      bGotChords = false,
      aChords = []; //gather the chord names that will be used to build the dom elements;

    //a deep copy must be made every time in case the user selects a different skill level (since expand properties are bound to the object depending which level is selected);
    oDeepCopy = sSkillLevel !== "advanced" ? //only mixin the advanced types ("augmented", "diminished", etc.) for the advanced level;
      JSLITE.deepCopy(oNotes) :
        (function () {
          var o = JSLITE.deepCopy(oNotes);
          for (var p in oNotes) {
           o[p] = JSLITE.apply(o[p], oNotesAdvanced[p]);
          }
          return o;
        }());

    aChords.length = aPermutations.length = 0; //reset the chords and permutations array;

    //get the permutations for the chordBuilder view;
    //since the default selection is advanced, oDeepCopy will contain all the possible chords on page load; use it to create a hash of chord: notes
    if (!oCache.chordBuilder) {
      for (var sNote in oDeepCopy) {
        if (oDeepCopy.hasOwnProperty(sNote)) {
          for (var s in oDeepCopy[sNote]) {
            aChordBuilder.push({chord: sNote + " " + s, notes: oDeepCopy[sNote][s].join("")});
          }
        }
        aChordBuilder.sort(fnRandom); //randomize after every iteration for the best results;
      }
      oCache.chordBuilder = aChordBuilder;
    }

    for (var sNote in oDeepCopy) {
      if (oDeepCopy.hasOwnProperty(sNote)) {
        if (!fnGetArrays.gotNotes) { //only collect the chords names the first time instead of every time (wasteful);
          aNotes.push(sNote); //get each note to use later when we build the dom elements;
        }
        var oTone = oDeepCopy[sNote];
        if (!oTone) { //if the oTone object is false then skip it, i.e., c-flat and e-sharp;
          continue;
        }
        for (var sChord in oTone) {
          if (!bGotChords) {
            aChords.push(sChord);
          }
          if (oTone.hasOwnProperty(sChord)) {
            aPermutations.push(oTone[sChord]);
            if (sSkillLevel !== "beginner") {
              fnMakeInversions({
                arr: oTone[sChord],
                note: sNote,
                chord: sChord
              });
            }
          }
        }
        bGotChords = true;
        aPermutations.sort(fnRandom); //sorting them frequently does a better job at randomizing them;
      }
    }
    fnGetArrays.gotNotes = true; //change value or else we'll collect the notes over and over again;
    bGotChords = false;
    oCache[sSkillLevel] = {
      permutations: aPermutations.concat(), //store the skill level object so it's only created once (since aPermutations is a global array it must be cloned or all the skill levels will reference the last skill level created;
      chords: aChords
    };
    //oCache[sSkillLevel] = oDeepCopy; //store the skill level object so it's only created once;
  },

  n = 0,

  fnGetChord = function () { //get the current chord to display to the user;
    var aPermutations;
    if (sSkillLevel !== "chordBuilder") {
      aPermutations = oCache[sSkillLevel].permutations;
      if (n === aPermutations.length) {
        n = 0;
      }
      $("currentChord").innerHTML = "<span>" + aPermutations[n].join("</span><span>");
      $("currentChord").currentChord = aPermutations[n]; //we need to attach the array to an expando property since we need another way of comparing than the value of the currentChord dom element (since the browser converts the entity when displaying it and it no longer matches the entity when comparing the values in the event handler);

    } else {
      aPermutations = oCache.chordBuilder;
      if (n === aPermutations.length) {
        n = 0;
      }
      $("currentChord").innerHTML = "<span>" + aPermutations[n].chord + "</span>";
      $("currentChord").currentChord = aPermutations[n].notes; //we need to attach the array to an expando property since we need another way of comparing than the value of the currentChord dom element (since the browser converts the entity when displaying it and it no longer matches the entity when comparing the values in the event handler);
    }
    n++;
  },

  fnSetQuiz = function () {
    if (sSkillLevel === "chordBuilder") {
      return;
    }

    var i,
      len,
      bDisplayNote,

      fnSetElements = function (a, sName) {
        JSLITE.Element.gets("#" + sName + " a", true).remove(); //first remove everything but the title in the <p>, i.e., "Type" and "Inversion";
        for (i = 0, len = a.length; i < len; i++) {
          JSLITE.Element.create({tag: "a",
            attr: {
              href: "#"
            },
            children: [
              JSLITE.Element.create({tag: "span",
                attr: {
                  className: sName,
                  innerHTML: sName === "inversions" ? a[i].replace(/(Position|Inversion)/, " $1") : a[i] //add a space, i.e., "Third Inversion";
                }
              })
            ],
            parent: $(sName)
          });
        }
      };

    if (!fnSetQuiz.initiated) {
      for (i = 0, len = aNotes.length; i < len; i++) {
        JSLITE.Element.create({tag: "a",
          attr: {
            className: "notes",
            href: "#",
            sortOrder: i
          },
          children: [
            JSLITE.Element.create({tag: "span",
              attr: {
                innerHTML: aNotes[i],
                note: aNotes[i] //bind an expando property for when comparing values in the event handler;
              }
            })
          ],
          parent: $("notes")
        });
      }
      fnSetElements(aInversions, "inversions");
    }

    /*
      the chords change depending upon the skill level but the notes and inversions never do
    */
    fnSetQuiz.initiated = true; //set an expando so this is only done once;
    fnSetElements(oCache[sSkillLevel].chords, "chords");

  };

  var fnReset = function () {
    var arr = JSLITE.makeArray($("notes").childNodes).concat(JSLITE.makeArray(JSLITE.Element.gets("#dropZoneContainer .JSLITE_draggable", true))).filter(function (v) { //get all child nodes within the drop zone that have a "sortOrder" property;
      return (typeof v.sortOrder === "number"); //should there be a better check?;
    }),
    oFrag = document.createDocumentFragment(),
    oDropZone = JSLITE.Element.get("notes");

    arr.sort(function (a, b) { //sort all nodes in this drop zone by their sort order property;
      return a.sortOrder - b.sortOrder;
    });

    oDropZone.remove(true); //remove all the nodes...;

    arr.forEach(function (v) { //...and readd them to the document fragment;
      //v.style.border = v.style.margin = null; //null out the inline styles that were bound to the element when it was dragged to the drop zone (b/c of specificity the the rules set in the class won't "shine" through);
      delete v.style.border;
      delete v.style.margin;
      oFrag.appendChild(v);
    });
    oDropZone.append(oFrag); //only append once!;
  };

  JSLITE.ready(function () {
    /*
    init the drag 'n' drop stuff
    */
    JSLITE.ux.DropZoneManager.add(JSLITE.Element.gets("#notes"), {
      sort: true
    });

    JSLITE.ux.DropZoneManager.add(JSLITE.Element.gets(".dropZone"), {
      snapToZone: true,
      subscribe: {
        beforenodedrop: function (e) {
          if (JSLITE.Element.gets(".JSLITE_draggable", this).length) { //only drop if there isn't another child element in the target drop zone;
            return false;
          }
        },
        afternodedrop: function (e) {
          var aDragged = JSLITE.Element.gets("#dropZoneContainer .JSLITE_draggable", true),
            i,
            len,
            arr = [];

          if (aDragged.length === 4) {
            for (i = 0, len = aDragged.length; i < len; i++) {
              arr.push(JSLITE.Element.get("span", aDragged[i], true).note);
            }
            if ($("currentChord").currentChord === arr.join("")) {
              alert("Correct!");
              aDragged.forEach(function (v) { //re-apply the original styles or else it looks like a$$;
                JSLITE.Element.fly(v).setStyle(v.originalStyles);
                v.snapped = false; //also, make sure to reset the snapped property!;
              });
              fnReset();
              fnGetChord();
            } else {
              alert("Incorrect!");
            }
          }
        }
      }
    });
    /*********************************************************************************/

    init();

    JSLITE.Element.fly("chordQuiz").on("click", function (e) { //note we're only binding one event listener for the entire page (because of this make sure each <span> entirely covers each <a>);
      var oTarget = e.target,
        sNote,
        sChord,
        sInversion;

      if (oTarget.nodeName === "SPAN" && oTarget.className !== "blank") {
        JSLITE.Element.gets("span", $(JSLITE.trim(oTarget.className))).removeClass("selected"); //the classname needs to be trimmed b/c if it removeClass() was previously called on this then there will be an extra space in the classname, i.e., "notes " (is this a bug?);
        JSLITE.Element.fly(oTarget).addClass("selected");
        if (JSLITE.Element.get("#notes span.selected", true) && JSLITE.Element.get("#chords span.selected", true) && JSLITE.Element.get("#inversions span.selected", true)) { //user selected one of each so see if he selected correctly;
          sNote = JSLITE.Element.get("#notes .selected").dom.note;
          sChord = JSLITE.Element.get("#chords .selected").value();
          sInversion = JSLITE.Element.get("#inversions .selected").value().replace(/\s/, ""); //remove the space that was put in when the dom element was created, i.e., "Second Inversion";
          if (oDeepCopy[sNote][sChord + (sInversion === "RootPosition" ? "" : sInversion)] === $("currentChord").currentChord) { //remember root position is the only inversion that doesn't have its inversion as part of its name in oDeepCopy;
            alert("Correct!");
            fnGetChord();
          } else {
            alert("Incorrect!");
          }
          JSLITE.Element.gets("span").removeClass("selected");
          if ($("beginner").checked) { //if beginner skill level is selected, make sure the "Root Position" element is given the selected class (to understand why see the logic w/in the handler bound to the "chordQuiz" element);
            JSLITE.Element.get("#inversions span").addClass("selected");
          }
        }
        e.preventDefault();
      }
    });

    JSLITE.Element.get(".skipChord").on("click", skip);

    JSLITE.Element.gets("input[type=radio]").on("click", function (e) {
      var oForm = e.target.form,
        sValue = e.target.value;

      if (oForm.id === "mainMenu") {
        var oChordQuiz = JSLITE.Element.get("chordQuiz"),
          oKeyQuiz = JSLITE.Element.get("keySignaturesQuiz"),
          fnToggleElements = function (sDiv) {
            //elements to toggle: the <h3>s, the value of #notes p, rest are self-evident;

            var a = sDiv === "chordQuiz" ? ["none", "block"] : ["block", "none"];
            oChordQuiz.show();
            JSLITE.Element.gets("#notes span").removeClass("selected"); //no matter which "view" was selected remove any previously selected notes;
            JSLITE.Element.get("#chordQuiz h3 + h3", true).style.display = $("dropZoneContainer").style.display = a[0];
            JSLITE.Element.get("#chordQuiz h3", true).style.display = $("chordMenu").style.display = $("chords").style.display = $("inversions").style.display = a[1];
            fnReset(); //finally, reset the notes div (in case any were dragged in the chord builder);
          };

        if (sValue === "chordQuiz") {
          fnToggleElements("chordQuiz");
          JSLITE.Element.get("h3 + div + p").hide(); //hide the first paragraph;
          JSLITE.Element.gets("p + div + p").show(); //show every other paragraph;
          JSLITE.Element.gets("#notes a.notes").removeClass("JSLITE_draggable");
          oKeyQuiz.hide();
          init();

        } else if (sValue === "chordBuilder") {
          sSkillLevel = "chordBuilder"; //set this so we know which object to look up in the cache;
          fnToggleElements("chordBuilder");
          JSLITE.Element.get("h3 + div + p").show(); //show the first paragraph;
          JSLITE.Element.gets("p + div + p").hide(); //hide every other paragraph;
          JSLITE.Element.gets("#notes a.notes").addClass("JSLITE_draggable");
          oKeyQuiz.hide();
          init(sValue);

        } else {
          oChordQuiz.hide();
          oKeyQuiz.show();
        }

      } else if (oForm.id === "chordMenu") {
        JSLITE.Element.get("#inversions span").removeClass("selected");
        if (sValue === "beginner") { //if beginner skill level is selected, make sure the "Root Position" element is given the selected class (to understand why see the logic w/in the handler bound to the "chordQuiz" element);
          JSLITE.Element.get("#inversions span").addClass("selected");
        }
        init(sValue);
      }
    });

    //if (navigator.userAgent.indexOf("iPhone") !== -1 || navigator.userAgent.indexOf("Android") !== -1) { //if user agent is an iphone tweak the styles so everything fits in the screen;
    if (navigator.userAgent.indexOf("iPhone") !== -1) { //if user agent is an iphone tweak the styles so everything fits in the screen;
      $("chords").style.width = "450px";
      $("inversions").style.width = "330px";
    }

  });
}());

