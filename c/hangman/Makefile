hangman.o: hangman.c hangman.h art.h
	gcc -Wall -o hangman hangman.c

install:
	mkdir /usr/local/share/hangman
	cp ./lists/* /usr/local/share/hangman

clean:
	rm -rf /usr/local/share/hangman

