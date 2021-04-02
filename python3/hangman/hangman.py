import getopt
import os
import random
import sys
import textwrap


from art import *


hanging_man = (
    [head, spacer, spacer, scaffold_base],
    [head, torso, spacer, scaffold_base],
    [head, one_arm, spacer, scaffold_base],
    [head, two_arms, spacer, scaffold_base],
    [head, two_arms, one_leg, scaffold_base],
    [head, two_arms, two_legs, scaffold_base]
)


def usage():
    str = '''
        USAGE:

            python3 hangman.py [--guesses=10]

        --guesses, -g  The number of guesses to allow.

        HINT:

            Press Ctl-D to start over at any time.
    '''
    print(textwrap.dedent(str))


def draw(pieces):
    for piece in pieces:
        piece()


def guess(session, guesses):
    try:
        letter = input("Pick a letter: ")

        # Always clear the screen. The code below will determine what needs drawn.
        os.system("clear")

        session["guessed_letters"] += letter

        blanks = session.get("blanks")

        if letter in session.get("word"):
            # Replace every blank with the guessed letter.
            for index, item in enumerate(session.get("word")):
                if item == letter:
                    blanks[index] = letter

            # Draw the hanging man (since the guesses counter hasn't increased it will be the same as last time).
            # Note only draw him if the guesses counter has been incremented due to a bad guess.
            if guesses == 0:
                pass
            if guesses < 6:
                draw(hanging_man[guesses - 1])
            else:
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])

            print("\nGood job!")
            print("Previous guesses = " + session.get("guessed_letters"))
            print("\nGuess the word: " + " ".join(blanks) + "\n")
            if session.get("token") in blanks:
                guess(session, guesses)
            else:
                print("Congratulations, you win! You are awesome!")
                play_again(session)
        else:
            guesses += 1

            if guesses < 6:
                # Always draw the hanging man, regardless of the total number of guesses.
                draw(hanging_man[guesses - 1])
                print("\nThe word does not contain the letter " + letter + ".")
                print("Previous guesses = " + session.get("guessed_letters"))
                print("\nGuess the word: " + " ".join(blanks) + "\n")
                guess(session, guesses)
            elif guesses < session.get("total_guesses"):
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])
                print("\nThe word does not contain the letter " + letter + ".")
                print("Previous guesses = " + session.get("guessed_letters"))
                print("\nGuess the word: " + " ".join(blanks) + "\n")
                guess(session, guesses)
            elif guesses == session.get("total_guesses"):
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])
                print("\nSorry, you lose!")
                print("The word was " + session.get("word") + ".")
                play_again(session)
    except EOFError:
        # Control-D to start over.
        init_game(session)


def init_game(session):
    os.system("clear")

    word = random.choice(session.get("words"))
    blanks = [session.get("token")] * len(word)

    session["blanks"] = blanks
    session["word"] = word
    session["guessed_letters"] = ""

    # Draw the scaffold!
    draw([
        scaffold_top,
        scaffold_middle,
        scaffold_base
    ])

    print("\nGuess the word: " + " ".join(blanks) + "\n")
    guess(session, 0)


def play_again(session):
    resp = input("\nPlay again? [Y|n]: ")
    if resp not in ("N", "n"):
        init_game(session)
    else:
        print("Goodbye.")


def main(argv):
    try:
        opts, args = getopt.getopt(argv, "hg:", ["help", "guesses="])
    except getopt.GetoptError:
        print("Error: Unrecognized flag.")
        usage()
        sys.exit(2)

    # 6 == the number of hanging man body parts.
    total_guesses = 6

    for opt, arg in opts:
        if opt in ("-h", "--help"):
            usage()
            sys.exit(0)
        elif opt in ("-g", "--guesses"):
            total_guesses = int(arg)

    try:
        init_game({
            "token": " _ ",
            "total_guesses": total_guesses,
            "words": open("/usr/share/dict/words").read().splitlines(),
        })
    except KeyboardInterrupt:
        # Control-C or Control-D sent a SIGINT to the process, handle it.
        print("\nGame aborted!")
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1:])
