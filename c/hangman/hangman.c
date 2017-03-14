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
void init();
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
    if (tree == NULL) {
        tree = (struct tnode *) malloc(sizeof(struct tnode));

        tree->letter = tolower(c);
        tree->left = tree->right = NULL;
    } else if (c < tree->letter)
        tree->left = addNode(tree->left, c);
    else
        tree->right = addNode(tree->right, c);

    return tree;
}

FILE *chooseList() {
    int n;
    static FILE *fp1, *fp2, *fp3;

    printf("Word lists:\n");
    printf("1. Dictionary Words\n");
    printf("2. Processes / Binaries\n");
    printf("3. Services / Protocols\n");
    printf("Choose a list: ");
    scanf("%d", &n);

    switch (n) {
        case 1:
            fp1 = fopen("/usr/local/share/hangman/words", "r");
            return fp1;
            break;

        case 2:
            fp2 = fopen("/usr/local/share/hangman/processes", "r");
            return fp2;
            break;

        case 3:
            fp3 = fopen("/usr/local/share/hangman/services", "r");
            return fp3;
            break;

        default:
            fprintf(stderr, "Could not open file, aborting.\n");
            exit(1);
    }
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
        printf("in lookup function\n");
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

void init() {
    struct tnode *tree = NULL;
    char tiles[30];
//     int n, i = 0, j;
    int i = 0, j;
    char word[SIZE_W];
    time_t t;

    FILE *fp = chooseList();

    // Always reset `wrong` counter.
    wrong = 0;

//     printf("Number of guesses: ");
//     scanf("%d", &n);

    draw();

    srand((unsigned) time(&t));
    // TODO: Get size of files for modulo.
    j = rand() % 350;

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

    fclose(fp);
}

int lookup(struct tnode *tree, char c) {
    if (tree == NULL)
        return 0;

    if (c == tree->letter)
        return 1;
    else if (c < tree->letter)
        return lookup(tree->left, c);
    else
        return lookup(tree->right, c);
}

int main(int argc, char **argv) {
    init();
    return 0;
}

