#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>
#include "hangman.h"

struct tnode *addNode(struct tnode *tree, char c);
void draw(void);
int drawTiles(char *tiles);
void endGame(char *s);
// void guess(struct tnode *tree, char *word, char *tiles, int n);
void guess(struct tnode *tree, char *word, char *tiles);
struct tnode *init(FILE *fp);
int lookup(struct tnode *tree, char c);

FILE *fp;
int wrong = 0;

char *art[] = {
    SCAFFOLD,
    HEAD,
    TRUNK,
    ONE_ARM,
    TWO_ARMS,
    ONE_LEG,
    TWO_LEGS
};

struct tnode {
    char letter;
    struct tnode *left;
    struct tnode *right;
};

struct tnode *addNode(struct tnode *tree, char c) {
    int n;

    if (tree == NULL) {
        tree = (struct tnode *) malloc(sizeof(struct tnode));

        tree->letter = tolower(c);
        tree->left = tree->right = NULL;
    } else if ((n = c < tree->letter) < 0)
        tree->left = addNode(tree->left, c);
    else if (n > 0)
        tree->right = addNode(tree->right, c);

    return tree;
}

void draw(void) {
    // Clear the screen.
    // http://stackoverflow.com/questions/2347770/how-do-you-clear-console-screen-in-c#7660837
    printf("\e[1;1H\e[2J");
    printf("Let's play hangman!\n");
    printf(art[wrong]);
}

int drawTiles(char *tiles) {
    int i, blank = 0;

    printf("\n");

    for (i = 0; tiles[i] != '\0'; ++i) {
        if (tiles[i] == '_')
            blank++;

        printf("%c", tiles[i]);
    }

    printf("\n\n");

    return blank;
}

void endGame(char *s) {
    char c;

    printf(s);
    scanf("%s", &c);

    if (c == 'Y' || c == 'y')
        init(fp);
    else
        printf("Goodbye!\n");
}

// void guess(struct tnode *tree, char *word, char *tiles, int n) {
void guess(struct tnode *tree, char *word, char *tiles) {
    char c;

    printf("\n\nGuess: ");
    scanf("%s", &c);

    if (lookup(tree, c)) {
        int i;

        for (i = 0; word[i]; ++i) {
            if (tolower(word[i]) == c)
                tiles[i] = c;
        }

        draw();

        if (drawTiles(tiles))
//             guess(tree, word, tiles, n);
            guess(tree, word, tiles);
        else
            endGame("You won! Play again? [Y/n] ");

    } else {
        int size = (sizeof(art) / sizeof(*art)) - 1;
        ++wrong;
        draw();

//         if (--n == 0 || wrong == size) {
        if (wrong == size) {
            printf("The word was %s\n", word);
            endGame("You lose! Play again? [Y/n] ");
        } else {
            drawTiles(tiles);
            printf("\n\nWrong! Guess again!");

//             guess(tree, word, tiles, n);
            guess(tree, word, tiles);
        }
    }
}

struct tnode *init(FILE *fp) {
    struct tnode *tree = NULL;
    char tiles[30];
//     int n, i = 0, j;
    int i = 0, j;
    char word[SIZE_W];
    time_t t;

//     printf("Number of guesses: ");
//     scanf("%d", &n);

    draw();

    srand((unsigned) time(&t));
    j = rand() % 75000;

    while (i++ < j)
        fgets(word, SIZE_W, fp);

    i = 0;
    while (word[i] != '\n') {
        tiles[i] = '_';
        tree = addNode(tree, word[i++]);
    }

    tiles[i] = '\0';

    drawTiles(tiles);
//     guess(tree, word, tiles, n);
    guess(tree, word, tiles);

    return tree;
}

int lookup(struct tnode *tree, char c) {
    if (tree == NULL)
        return 0;

    int n = c < tree->letter;

    if (n < 0)
        return lookup(tree->left, c);
    else if (n > 0)
        return lookup(tree->right, c);
    else
        // It's a match.
        return 1;
}

int main(int argc, char **argv) {
    // TODO: Allow a words file to be passed on CLI.
    fp = fopen("/usr/share/dict/words", "r");
    init(fp);

    return 0;
}

