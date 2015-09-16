from art import *
import getopt
import os
import random
import sys
import textwrap

def usage():
    str = '''
        USAGE:

            python3 hangman.py [--guesses=10]

        --guesses, -g  The number of guesses to allow.

        HINT:

            Press Ctl-D to start over at any time.
    '''
    print(textwrap.dedent(str))

def main(argv):
    global hanging_man
    global token
    global total_guesses
    global words

    try:
        opts, args = getopt.getopt(argv, 'hg:', ['help', 'guesses='])
    except getopt.GetoptError:
        print('Error: Unrecognized flag.')
        usage()
        sys.exit(2)

    # 6 == the number of hanging man body parts.
    total_guesses = 6

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            usage()
            sys.exit(0)
        elif opt in ('-g', '--guesses'):
            total_guesses = int(arg)

    hanging_man = (
        [head, spacer, spacer, scaffold_base],
        [head, torso, spacer, scaffold_base],
        [head, one_arm, spacer, scaffold_base],
        [head, two_arms, spacer, scaffold_base],
        [head, two_arms, one_leg, scaffold_base],
        [head, two_arms, two_legs, scaffold_base]
    )

    token = ' _ '
    words = open('/usr/share/dict/words').read().splitlines()

    try:
        init_game(total_guesses)

    except KeyboardInterrupt:
        # Control-C or Control-D  sent a SIGINT to the process, handle it.
        print('\nGame aborted!')
        sys.exit(1)

def draw(pieces):
    for piece in pieces:
        piece()

def guess():
    global guessed_letters
    global guesses

    try:
        letter = input('Pick a letter: ')

        # Always clear the screen. The code below will determine what needs drawn.
        os.system('clear')

        guessed_letters += letter

        if letter in word:
            # Replace every blank with the guessed letter.
            for index, item in enumerate(word):
                if item == letter:
                    blanks[index] = letter

            # Draw the hanging man (since the guesses counter hasn't increased it will be the same as last time).
            # Note only draw him if the guesses counter has been incremented due to a bad guess.
            if guesses == 0:
                setup()
            elif guesses < 6:
                draw(hanging_man[guesses - 1])
            else:
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])

            print('\nGood job!')
            print('Previous guesses = ' + guessed_letters)
            print('\nGuess the word: ' + ' '.join(blanks) + '\n')
            if token in blanks:
                guess()
            else:
                print('Congratulations, you are awesome!')
                play_again()
        else:
            guesses += 1

            if guesses < 6:
                # Always draw the hanging man, regardless of the total number of guesses.
                draw(hanging_man[guesses - 1])
                print('\nThe word does not contain the letter "' + letter + '".')
                print('Previous guesses = ' + guessed_letters)
                print('\nGuess the word: ' + ' '.join(blanks) + '\n')
                guess()
            elif guesses < total_guesses:
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])
                print('\nThe word does not contain the letter "' + letter + '".')
                print('Previous guesses = ' + guessed_letters)
                print('\nGuess the word: ' + ' '.join(blanks) + '\n')
                guess()
            elif guesses == total_guesses:
                # Draw the whole hanging man.
                draw(hanging_man[len(hanging_man) - 1])
                print('\nSorry, you lose!')
                print('The word was ' + word + '.')
                play_again()

    except EOFError:
        # Control-D to start over.
        init_game(total_guesses)

def init_game(total_guesses):
    global guessed_letters
    global guesses
    global word
    global blanks

    guessed_letters = ''
    guesses = 0
    word = random.choice(words)
    blanks = [token] * len(word)
    os.system('clear')
    setup()
    print('\nGuess the word: ' + ' '.join(blanks) + '\n')
    guess()

def play_again():
    resp = input('\nPlay again? [Y|n]: ')
    if resp not in ('N', 'n'):
        init_game(total_guesses)
    else:
        print('Goodbye.')

def setup():
    draw([
        scaffold_top,
        scaffold_middle,
        scaffold_base
    ])

if __name__ == '__main__':
    main(sys.argv[1:])

