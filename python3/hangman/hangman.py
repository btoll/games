from art import *
import os
import random
import sys

def main(argv):
    global hanging_man
    global token
    global words

    hanging_man = (
        [head, spacer, spacer, scaffold_base],
        [head, torso, spacer, scaffold_base],
        [head, one_arm, spacer, scaffold_base],
        [head, two_arms, spacer, scaffold_base],
        [head, two_arms, one_leg, scaffold_base],
        [head, two_arms, two_legs, scaffold_base]
    )

    token = '  ___  '
    words = open('/usr/share/dict/words').read().splitlines()

    try:
        init_game()

    except (KeyboardInterrupt, EOFError):
        # Control-C or Control-D  sent a SIGINT to the process, handle it.
        print('\nGame aborted!')
        sys.exit(1)

def draw(pieces):
    for piece in pieces:
        piece()

def guess():
    global guesses

    letter = input('Pick a letter: ')
    os.system('clear')

    if letter in word:
        # Replace every blank with the guessed letter.
        for index, item in enumerate(word):
            if item == letter:
                blanks[index] = letter

        # Draw the hanging man (since the guesses counter hasn't increased it will be the same as last time).
        # Note only draw him if the guesses counter has been incremented due to a bad guess.
        if guesses > 0:
            draw(hanging_man[guesses - 1])

        print('\nGood job!')
        print('\nGuess the word: ' + ' '.join(blanks) + '\n')
        if token in blanks:
            guess()
        else:
            print('Congratulations, you are awesome!')
            play_again()
    else:
        guesses += 1

        if guesses < 6:
            # Draw the hanging man.
            draw(hanging_man[guesses - 1])
            print('\nThe word does not contain the letter "' + letter + '".')
            print('\nGuess the word: ' + ' '.join(blanks) + '\n')
            guess()
        elif guesses == 6:
            # Draw the hanging man.
            draw(hanging_man[len(hanging_man) - 1])
            print('\nSorry, you lose!')
            print('The word was ' + word + '.')
            play_again()

def init_game():
    global guesses
    global word
    global blanks

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
        init_game()
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

