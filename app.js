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
    bankOffer: false,
    playerWinnings: 0,
    offerValue: 0,
    round: 0,
    casesToOpen: 21,
    prizeValues: [.01, .1, .5, 1, 5, 10, 50, 100, 250, 500, 750, 1000, 3000, 5000, 10000, 15000, 25000, 50000, 75000, 100000, 250000, 500000],
    selectedValues: [0],
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
            //console.log(briefcase)
            //append to board (append to main?)
            board.appendChild(briefcase)
        }
        this.addBriefcaseListeners()  
    },
    createBonusCase: function() {
        //double-randomizes bonus case by randomizing bonus scenario array and then generating a random number correlating to index of randomized array
        this.shufflePrizes(this.bonusOutcomes)
        const board = document.querySelector('main')
        const bonus = document.createElement('div')
        bonus.classList.add('briefcase')
        bonus.setAttribute('id', 'bonus')
        bonus.innerHTML = this.bonusOutcomes[Math.floor(Math.random() * this.bonusOutcomes.length)]
        board.appendChild(bonus)
    },
    selectBriefcases: function(event) {
        //console.log(this)
        //console.log(game.round)
        if(game.round === 0 && game.activeBoard === true) {
            console.log(game.round)
            console.log('this is the players case')
            const player = document.querySelector('#playerInfo')
            const selection = event.target
            player.appendChild(selection)
            game.round += 1
            //game.casesToOpen = 5
            console.log(selection)
            //console.log(game.round)
            selection.removeEventListener('click', this.selectBriefcases) 
        } else if(game.round <= 1 && game.activeBoard === true) {
            //console.log('this is round one')
            //console.log(game.casesToOpen)
            game.briefcaseToOpen()

        } /*else if(game.round <= 5 && game.activeBoard === true) {
            console.log('new round')
            game.casesToOpen = 3
            console.log(game.casesToOpen)
            game.briefcaseToOpen()
            game.round += 1
        } else if(game.round === 6 && game.activeBoard === true) {
            console.log('new round')
            game.casesToOpen = 2
            console.log(game.casesToOpen)
            game.briefcaseToOpen()
            game.round += 1
        } else if(game.round === 7 && game.activeBoard === true) {
            console.log('new round')
            game.casesToOpen = 1
            console.log(game.casesToOpen)
            game.briefcaseToOpen()
            game.round += 1
        }*/ else {
            console.log('Ask if player wants to swap')
        }
        /*
        console.log('this is the players case')
        const player = document.querySelector('#top-left')
        const selection = event.target
        player.appendChild(selection)
        this.round += 1
        console.log(selection)
        console.log(this.round)
        //briefcaseToKeep.removeEventListener('click', briefcaseToKeep)
        */
    },
    briefcaseToOpen: function() {
        if(game.casesToOpen > 1) {
            console.log('case was opened')
            const clickedCase = event.target
            const eliminatedValue = event.target.innerHTML
            clickedCase.classList.add('revealed')
            game.casesToOpen --
            //console.log(this.casesToOpen)
            game.selectedValues.push(parseInt(eliminatedValue))
            console.log(game.selectedValues)
            const listOfValues = document.querySelectorAll('.availablePrize')
            for(let i = 0; i < listOfValues.length; i++) {
                if(eliminatedValue === listOfValues[i].innerHTML) {
                    listOfValues[i].classList.add('eliminatedPrize')
                }
            }
            game.bankerCalls()
            clickedCase.removeEventListener('click', this.selectBriefcases)
            //caseToOpen.removeEventListener('click', this.briefcaseToOpen)
        } else {
            console.log('method to give user option to switch briefcases')
            game.activeBoard = false
            //game.bankerCalls()
            //game.round += 1
        }
        
    },
    availableValues: function() {
        let sortedPrizes = this.prizeValues.sort((a,b)=>a-b)
        sortedPrizes.forEach(function(prize) {
            const valueBoard = document.querySelector('#valueBoard')
            const addToBoard = document.createElement('p')
            addToBoard.innerHTML = prize
            addToBoard.classList.add('availablePrize')
            valueBoard.appendChild(addToBoard)

        })
    },
    computeBankOffer: function() {
        this.activeBoard = true
        //shoule probably move gameboard activation into method where player makes choice
        let maxPrize = this.prizeValues.reduce(function(a, b) {
            return a + b
        })
        let eliminatedAmount = this.selectedValues.reduce(function(x,y) {
            return x + y
        })
        let casesLeft = this.prizeValues.length - this.selectedValues.length
        //If I have time: give banker +/- 10 range on offers
        console.log(maxPrize)
        console.log(eliminatedAmount)
        console.log(casesLeft)
        console.log(this.casesToOpen)
        this.offerValue = Math.round((maxPrize - eliminatedAmount) / this.casesToOpen)
        console.log('offer is',this.offerValue)
        return this.offerValue
        
    },
    bankerCalls: function() {
        //console.log(this)
        //console.log('looking for')
        if(this.casesToOpen === 16
            || this.casesToOpen === 13
            || this.casesToOpen === 10
            || this.casesToOpen === 7
            || this.casesToOpen === 4
            || this.casesToOpen === 2
            || this.casesToOpen === 1
        ) {
            console.log('ring ring')
            this.activeBoard = false
            this.computeBankOffer()
            this.offerTracker()
            //add offer tracking method
            //need Deal, No Deal buttons
            //need player response
            //write a method that turns on event listeners before computer offer, then turns them off after user has decided
        } else if(this.casesToOpen === 0) {
            console.log('the banker has one last offer for you. Do you want to swap your briefcase with the unopened briefcase')
        }
    },
    offerTracker: function() {
        const addPastOffer = document.querySelector('#storeOffers')
        const mostRecentOffer = addPastOffer.firstChild
        const offer = document.createElement('p')
        offer.innerHTML = '$' + this.offerValue
        //addPastOffer.appendChild(offer)
        addPastOffer.insertBefore(offer, mostRecentOffer)
    },
    bonusCaseOutcomes: function() {
        const bonusValue = document.querySelector('#bonus').innerHTML
        //console.log(bonusValue)
        if(bonusValue === 'add 10k') {
            //console.log(this.playerWinnings + 10000)
            return this.playerWinnings + 10000
        } else if(bonusValue === 'double money') {
            //console.log(this.playerWinnings * 2)
            return this.playerWinnings * 2
        } else if(bonusValue === 'lose half') {
            //console.log(this.playerWinnings / 2)
            return this.playerWinnings / 2
        } else {
            //console.log(this.playerWinnings = 0)
            return this.playerWinnings = 0
        }
    },
    addBriefcaseListeners: function() {
        const cases = document.querySelectorAll('.briefcase')
        for(let i = 0; i < cases.length; i++) {
            cases[i].addEventListener('click', this.selectBriefcases)
            //console.log('event listener added')
        }
    },
    addButtonListeners: function() {
        const buttons = document.querySelectorAll('.buttons')
        console.log(buttons)
    }

}

document.addEventListener('DOMContentLoaded', () => {
    //console.log('locked and loaded')
    game.createBriefcases()
    game.createBonusCase()
    game.availableValues()
    game.bonusCaseOutcomes()
    game.addButtonListeners()
})