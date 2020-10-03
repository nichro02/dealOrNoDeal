# Deal or No Deal

## Game Overview and Methodology
The concept of Deal or No Deal is relatively simple - pick a briefcase at the beginning of the game that you will either sell to the banker or win the amount of money inside the briefcase. My version is a take on the British version of the game, selected because there are a couple of wrinkles that I think make the game more intriguing. These twists strongly influenced my approach to the game.

I knew early on how I wanted to structure the layout of the game on the page. I wanted the gameboard centered on the page, with a list of the values contained in the suitcases on one side of the gameboard and an offer tracker to track the banker's offers on the other side. I also wanted a message center to help guide the player through the game.

At the same time, I was also thinking about the main components of gameplay: the user has to select a briefcase at the start of the game, the user has to be able to eliminate briefcases from the board, the banker (computer) has to be able to calculate and present an offer to the player, and the player ultimately wins a certain amount of money. Those were useful in writing functions for the game.

The twists in the game added additional complexity I needed to account for. The first wrinkle is that the player has the option to switch briefcases if there is one unopened briefcase left on the board. It fits into the framework of the game because it's essentially another Deal/No Deal scenario, but the logic is different than just opening a briefcase. The trickiest part for me was invoking the function at the right time. The second wrinkle is the bonus round at the end of the game. Again, it works with the general logic of the game because it is presented as a Deal/No Deal option, but I needed to attach a scenario to the briefcase that would subsequently calculate the impact to the player's winnings.

## Technologies Used

* HTML
* CSS
* Vanilla Javascript
    * Object Oriented Programming
    * DOM Manipulation

I chose to take an OOP approach to programming my game because it helped structure and organize my code. Wrapping my game in an object will be useful if additional code is added in the future and I need to go back and update code for the game - remembering which object stores the game will be much easier than sifting through lines of code.

DOM Manipulation is crucial to controlling the flow of the game because it is involved with basically every aspect of gameplay, from generating opening the briefcase to displaying messages to the user to details like greying out eliminated values and displaying past offers.

I leverage display grid to structure the webpage in the way I envisioned it. I knew I needed three columns and that the middle column needed to be significantly larger than the other two, and I found grid the simplest way to achieve this goal.

## Issues to Address/Challenges
I worked with the bind method in this project to make the syntax more consistent but was ultimately unable to incorporate it into my code. I understand that the bind method allows me to more fully leverage the "this" keyword and solves issues related to scope, but I ran into issues when trying to remove event listeners. My code, I think, runs fine without the bind method, but I would have liked to leverage it.

I'd also be curious to hear feedback on the webpage layout. I intentionally tried to limit the amount of content on the page to what was relevant to the game and providing the user with enough information to understand what is going on, but one thing I didn't include but thought about is a turn counter. The user gets a message at the start of the game letting them know how many rounds there are and how many cases to open, but I wasn't sure if adding it would have made the page too busy. I thought the offer tracker and available values display were more important to gameplay.

## Installation Instructions
This game is hosted on Github so no installation is required. Game can be accessed at https://nichro02.github.io/dealOrNoDeal/


