//User selects one briefcase at beginning of game
//Function for selecting briefcases -> will need event listeners
//Function to calculate banker offer
//Select 5 briefcases in first round, 3 in subsequent rounds
//Banker offers calculated value, which user can accept or reject
//If accept, go to briefcase 23 option. If reject, continue playing the game
//Option to swap briefcases when there are two left
//Final round: user has opportunity to buy briefcase 23 to potentially increase earnings
/*
//Keep track of board status
let activeBoard = true

//Keep track of rounds -> increment by one
let round = 1

//Keep track of cases to open in each round -> change to 3 for rounds 2-5, 2 for 6, 1 for 7
let casesToOpen = 5

//Array to hold potential prize values
const prizeValues = [.01, .1, .5, 1, 5, 10, 50, 100, 250, 500, 750, 1000, 3000, 5000, 10000, 15000, 25000, 50000, 75000, 100000, 250000, 500000]

//Array to hold potential bonus briefcase outcomes
const bonusOutcomes = ['add 10k', 'double money', 'lose half', 'lose all']

//Grab random Index of bonus briefcase outcome to be used to calculate value of bonus briefcase
const assignBonus = Math.floor(Math.random() * bonusOutcomes.length)
console.log(assignBonus)

//Randomize prize array
const shufflePrizes = (array) => {
    for(let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[random]
        array[random] = temp
    }

    return array
}

console.log(shufflePrizes(prizeValues))
console.log(prizeValues[21])

//Create 22 briefcases and attach value to corresponding index of randomized array
//This can be used as a method in OOP
const createBriefcases = () => {
    for(let i = 0; i < prizeValues.length; i++) {
        const briefcase = document.createElement('div')
        const board = document.querySelector('main')
        briefcase.classList.add('briefcase')
        briefcase.setAttribute('id', i)
        briefcase.innerHTML = prizeValues[i]
        //is this best way to attach prize value to briefcases?
        console.log(briefcase)
        //append to board (append to main?)
        board.appendChild(briefcase)
    }
}
*/
game = {
    activeBoard: true,
    round: 1,
    casesToOpen: 5,
    prizeValues: [.01, .1, .5, 1, 5, 10, 50, 100, 250, 500, 750, 1000, 3000, 5000, 10000, 15000, 25000, 50000, 75000, 100000, 250000, 500000],
    bonusOutcomes: ['add 10k', 'double money', 'lose half', 'lose all'],
    //shuffle prize array
    shufflePrizes: function(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1))
            const temp = array[i]
            array[i] = array[random]
            array[random] = temp
        }
        //could use return here, but that would mean prizeValue array is randomized
        //return array
    },
    createBriefcases: function() {
        //call shufflePrizes function at top so that prizes can be randomized and then attached to briefcases 
        this.shufflePrizes(this.prizeValues)
        for(let i = 0; i < this.prizeValues.length; i++) {
            const briefcase = document.createElement('div')
            const board = document.querySelector('main')
            briefcase.classList.add('briefcase')
            briefcase.setAttribute('id', i)
            briefcase.innerHTML = this.prizeValues[i]
            //is this best way to attach prize value to briefcases?
            console.log(briefcase)
            //append to board (append to main?)
            board.appendChild(briefcase)
        }
        this.addBriefcaseListeners()  
    },
    addBriefcaseListeners: function() {
        const cases = document.querySelectorAll('.briefcase')
        for(let i = 0; i < cases.length; i++) {
            cases[i].addEventListener('click', () => {
                console.log('suitcase has been clicked')
            })
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    console.log('locked and loaded')
    //createBriefcases()
    //game.shufflePrizes(game.prizeValues)
    game.createBriefcases()
})