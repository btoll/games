#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "hangman.h"

FILE *fp;
int wrong = 0;
char *art[] = {
    SCAFFOLD,
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

struct tnode *addNode(struct tnode *tree, char c);
int charCmp(char s, char t);
void draw(void);
int drawTiles(char *tiles);
void guess(struct tnode *tree, char *word, char *tiles, int n);
struct tnode *init(FILE *fp);
int lookup(struct tnode *tree, char c);
int toLowerCase(char c);

struct tnode *addNode(struct tnode *tree, char c) {
    int n;

    if (tree == NULL) {
        tree = (struct tnode *) malloc(sizeof(struct tnode));

        tree->letter = toLowerCase(c);
        tree->left = tree->right = NULL;
    } else if ((n = charCmp(c, tree->letter)) < 0)
        tree->left = addNode(tree->left, c);
    else if (n > 0)
        tree->right = addNode(tree->right, c);

    return tree;
}

int charCmp(char s, char t) {
    s = toLowerCase(s);
    t = toLowerCase(t);

    if (s < t) {
        return -1;
    } else if (s > t) {
        return 1;
    } else {
        return 0;
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

void guess(struct tnode *tree, char *word, char *tiles, int n) {
    char c;

    printf("\n\nGuess: ");
    scanf("%s", &c);

    if (lookup(tree, c)) {
        int i;

        for (i = 0; word[i]; ++i) {
            if (toLowerCase(word[i]) == c)
                tiles[i] = c;

            printf("%c\n", word[i]);
        }

        draw();

        if (drawTiles(tiles))
            guess(tree, word, tiles, n);
        else
            printf("You won!\n");
    } else {
        ++wrong;
        draw();

        if (--n == 0 || wrong == 5) {
            printf("You lose! Play again? [Y/n] ");
            scanf("%s", &c);

            if (c == 'Y' || c == 'y')
                init(fp);
            else
                printf("Goodbye!\n");

        } else {
            drawTiles(tiles);
            printf("\n\nNo! Guess again!");

            guess(tree, word, tiles, n);
        }
    }
}

struct tnode *init(FILE *fp) {
    struct tnode *tree = NULL;
    char tiles[30];
    int n, i = 0;
    char word[SIZE_W];

    printf("Number of guesses: ");
    scanf("%d", &n);

    draw();

    while (i++ < 100)
        fgets(word, SIZE_W, fp);

//     printf("%s\n", word);

    i = 0;
    while (word[i] != '\n') {
        tiles[i] = '_';
        tree = addNode(tree, word[i++]);
    }

    tiles[i] = '\0';

    drawTiles(tiles);
    guess(tree, word, tiles, n);

    return tree;
}

int lookup(struct tnode *tree, char c) {
    if (tree == NULL)
        return 0;

    int n;

    if (tree->letter == c)
        return 1;
    else if ((n = charCmp(c, tree->letter)) < 0)
        lookup(tree->left, c);
    else if (n > 0)
        lookup(tree->right, c);
}

int toLowerCase(char c) {
    if (c >= 'A' && c <= 'Z')
        c += 32;

    return c;
}

int main(int argc, char **argv) {
    // TODO: Allow a words file to be passed on CLI.
    fp = fopen("/usr/share/dict/words", "r");
    init(fp);

    return 0;
}

