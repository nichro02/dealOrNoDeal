game = {
    activeBoard: true,
    bankOffer: false,
    bonusStatus: false,
    player: 'Player',
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
        //call shufflePrizes method so that prizes can be randomized and then attached to briefcases 
        this.shufflePrizes(this.prizeValues)
        for(let i = 0; i < this.prizeValues.length; i++) {
            const briefcase = document.createElement('div')
            const board = document.querySelector('main')
            briefcase.classList.add('briefcase', 'unopened')
            briefcase.setAttribute('id', i)
            briefcase.innerHTML = this.prizeValues[i]
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
        //this.addBriefcaseListeners() 
    },
    addPlayerName: function(event) {
        const playerName = document.querySelector('#playerName')
        const addNameButton = document.querySelector('#submitName')
        this.player = playerName.value
        document.querySelector('#name').innerHTML = this.player
        event.target.removeEventListener('click', this.addPlayerName)
        playerName.remove()
        addNameButton.remove()
        game.initiateGameMessage()
    },
    selectBriefcases: function(event) {
        if(game.round === 0 && game.activeBoard === true) {
            //console.log(game.round)
            //console.log('this is the players case')
            const player = document.querySelector('#playerInfo')
            const selection = event.target
            selection.classList.add('playerCase')
            selection.classList.remove('unopened')
            player.appendChild(selection)
            game.round += 1
            console.log(selection)
            //console.log(game.switchCases())
            selection.removeEventListener('click', this.selectBriefcases) 
        } else if(game.round <= 1 && game.activeBoard === true) {
            game.briefcaseToOpen()
            //game.offerPrompt()
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
        }*/ else if(game.activeBoard === true){
            game.reminderMessage()
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
            //console.log('case was opened')
            const clickedCase = event.target
            const eliminatedValue = event.target.innerHTML
            clickedCase.classList.add('revealed')
            clickedCase.classList.remove('unopened')
            game.casesToOpen --
            console.log(game.casesToOpen)
            game.selectedValues.push(parseInt(eliminatedValue))
            //console.log(game.selectedValues)
            const listOfValues = document.querySelectorAll('.availablePrize')
            for(let i = 0; i < listOfValues.length; i++) {
                if(eliminatedValue === listOfValues[i].innerHTML) {
                    listOfValues[i].classList.add('eliminatedPrize')
                }
            }
            game.bankerCalls()
            clickedCase.removeEventListener('click', this.selectBriefcases)
        } else if(game.casesToOpen === 1) {
            const lastCase = event.target
            game.casesToOpen --
            game.bankerCalls()
            lastCase.removeEventListener('click', this.selectBriefcases)
        } else if(game.casesToOpen === 0) {
            console.log('method to give user option to switch briefcases')
            game.offerPrompt()
            //game.activeBoard = false
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
        //this.activeBoard = true
        //shoule probably move gameboard activation into method where player makes choice
        let maxPrize = this.prizeValues.reduce(function(a, b) {
            return a + b
        })
        let eliminatedAmount = this.selectedValues.reduce(function(x,y) {
            return x + y
        })
        let casesLeft = this.prizeValues.length - this.selectedValues.length
        //If I have time: give banker +/- 10 range on offers
        //console.log(maxPrize)
        //console.log(eliminatedAmount)
        //console.log(casesLeft)
        //console.log(this.casesToOpen + 1)
        this.offerValue = Math.round((maxPrize - eliminatedAmount) / (this.casesToOpen + 1))
        console.log('offer is',this.offerValue)
        return this.offerValue
        
    },
    bankerCalls: function() {
        //console.log(this)
        if(this.casesToOpen === 16
            || this.casesToOpen === 13
            || this.casesToOpen === 10
            || this.casesToOpen === 7
            || this.casesToOpen === 4
            || this.casesToOpen === 2
            || this.casesToOpen === 1
            //|| this.casesToOpen === 0
        ) {
            console.log('ring ring')
            this.activeBoard = false
            this.computeBankOffer()
            this.offerTracker()
            //this.clearMessageCenter()
            this.offerPrompt()
            this.userOption()
        } else if(this.casesToOpen === 0) {
            console.log('the banker has one last offer for you. Do you want to swap your briefcase with the unopened briefcase')
            this.offerPrompt()
            this.userOption()
        }
    },
    offerTracker: function() {
        //add a conditional here to account for last case being selected so that if cases left = 0, call offer prompt method
        console.log(this)
        if(this.casesToOpen > 0) {
        const addPastOffer = document.querySelector('#storeOffers')
        const mostRecentOffer = addPastOffer.firstChild
        const offer = document.createElement('p')
        offer.classList.add('presentedOffer')
        offer.innerHTML = '$' + this.offerValue
        //addPastOffer.appendChild(offer)
        addPastOffer.insertBefore(offer, mostRecentOffer)
        } else if(this.casesToOpen ===0) {
            this.offerPrompt()
        }

        /*
        const addPastOffer = document.querySelector('#storeOffers')
        const mostRecentOffer = addPastOffer.firstChild
        const offer = document.createElement('p')
        offer.classList.add('presentedOffer')
        offer.innerHTML = '$' + this.offerValue
        //addPastOffer.appendChild(offer)
        addPastOffer.insertBefore(offer, mostRecentOffer)
        */
    },
    bonusCaseOutcomes: function() {
        const bonusValue = document.querySelector('#bonus').innerHTML
        console.log(bonusValue)
        if(bonusValue === 'add 10k') {
            //console.log(this.playerWinnings + 10000)
            return this.playerWinnings = this.playerWinnings + 10000
        } else if(bonusValue === 'double money') {
            //console.log(this.playerWinnings * 2)
            return this.playerWinnings = this.playerWinnings * 2
        } else if(bonusValue === 'lose half') {
            //console.log(this.playerWinnings / 2)
            return this.playerWinnings = this.playerWinnings / 2
        } else {
            //console.log(this.playerWinnings = 0)
            return this.playerWinnings = 0
        }
    },
    userOption: function(event) {
        //console.log('button works')
        //console.log(event.target)
        if(game.casesToOpen === 16
            || game.casesToOpen === 13
            || game.casesToOpen === 10
            || game.casesToOpen === 7
            || game.casesToOpen === 4
            || game.casesToOpen === 2
            || game.casesToOpen === 1
            || game.casesToOpen === 0 && game.bonusStatus === false
            || game.casesToOpen === 0 && game.bonusStatus === true
        ) {
            //console.log('Do you accept the bankers offer?')
            game.dealOrNoDeal()
        } else if(game.casesToOpen === 0 && game.bonusStatus === true) {
            //build bonus case logic into dealOrNoDeal method
            console.log('Bonus case decision')
        }
    },
    dealOrNoDeal: function() {
        //evaluate whether deal or no deal button is clicked
        //unfreeze board if user rejects deal
        console.log('deal or no deal method called')
        console.log(event.target)
        
        const buttonSelected = event.target.getAttribute('id')
        console.log(buttonSelected)
        if (buttonSelected === 'deal' && game.casesToOpen === 0 && game.activeBoard === true && game.bonusStatus === false) {
            game.switchCases()
        } else if (buttonSelected === 'noDeal' && game.casesToOpen === 0 && game.activeBoard === true && game.bonusStatus === false) {
            game.keepCase()
        } else if (buttonSelected === 'deal' && game.activeBoard === false && game.bonusStatus === false) {
            console.log('deal button was selected')
            const showPlayerCaseValue = document.querySelector('.playerCase')
            showPlayerCaseValue.classList.add('revealed')
            game.playerWinnings = game.offerValue
            console.log(game.playerWinnings)
            //game.activeBoard = false
            game.bonusStatus = true
            game.casesToOpen = 0
            game.offerPrompt()
        } else if (buttonSelected === 'noDeal' && game.casesToOpen > 0 && game.activeBoard === false && game.bonusStatus === false) {
            console.log('no deal button was selected')
            game.reminderMessage()
            game.activeBoard = true
        } else if (buttonSelected === 'deal' && game.bonusStatus === true) {
            game.bonusCaseOutcomes()
            game.bonusMessage()
            document.querySelectorAll('.buttons').forEach(button => button.parentNode.removeChild(button))
            console.log(game.playerWinnings)
        } else if (buttonSelected === 'noDeal' && game.bonusStatus === true) {
            console.log('good game. the bonus case contained ' + document.querySelector('#bonus').innerHTML)
            game.bonusMessage()
            document.querySelectorAll('.buttons').forEach(button => button.parentNode.removeChild(button))
        }
        //expand conditional to include bonus decision?
    },
    switchCases: function() {
        if(game.casesToOpen === 0 && game.activeBoard === true && game.bonusStatus === false){
        const playersCaseLocation = document.querySelector('#playerInfo')
        const playersCase = document.querySelector('.playerCase')
        const board = document.querySelector('main')
        const unopenedCase = document.querySelector('.unopened')
        console.log(playersCase)
        board.insertBefore(playersCase, unopenedCase)
        playersCaseLocation.appendChild(unopenedCase)
        playersCase.classList.add('revealed')
        unopenedCase.classList.add('revealed')
        const swapValue = unopenedCase.innerHTML
        game.playerWinnings = parseInt(swapValue)
        game.bonusStatus = true
        game.swapOutcome()
        }
        
    },
    keepCase: function() {
        const caseValue = document.querySelector('.playerCase')
        caseValue.classList.add('revealed')
        const unopenedCase = document.querySelector('.unopened')
        unopenedCase.classList.add('revealed')
        game.playerWinnings = parseInt(caseValue.innerHTML)
        game.bonusStatus = true
        game.swapOutcome()
    },
    clearMessageCenter: function() {
        const textToReplace = document.querySelector('.messageCenterText')
        while(textToReplace.firstChild){
            //console.log(textToReplace.firstChild)
            textToReplace.removeChild(textToReplace.firstChild)
        }
    },
    offerPrompt: function() {
        this.clearMessageCenter()
        const offerValue = document.querySelector('.presentedOffer').innerHTML
        const messageCenter = document.querySelector('.messageCenterText')
        console.log(offerValue)
        const presentOffer = document.createElement('p')
        presentOffer.classList.add('messageCenterText')
        if(game.casesToOpen >= 1) {
            presentOffer.innerHTML = 'The banker called! He is offering you '+ offerValue+' for your briefcase. Deal or no deal?'  
        } else if(game.casesToOpen === 0 && game.bonusStatus === false) {
            presentOffer.innerHTML = 'The banker called! He is offering you the opportunity to switch your briefcase with the last unopened briefcase. Deal or no deal?'
        } else if(game.bonusStatus === true) {
            presentOffer.innerHTML = 'Congratulations, you won ' + offerValue + '! Would you like to win more? You can open the bonus briefcase to try to win more but beware, you could lose everything! Press Deal if you want to open the bonus case, press No Deal if you are happy with your winnings.'
            //add code in to show what was in case
        }
        messageCenter.appendChild(presentOffer)

    },
    swapOutcome: function() {
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const displayWinnings = document.createElement('p')
        displayWinnings.classList.add('messageCenterText')
        displayWinnings.innerHTML = 'Congratulations, you won ' + this.playerWinnings + '! Would you like to win more? You can open the bonus briefcase to try to win more but beware, you could lose everything! Press Deal if you want to open the bonus case, press No Deal if you are happing with your winnings.'
        messageCenter.appendChild(displayWinnings)
    },
    bonusMessage: function() {
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const bonus = document.createElement('p')
        bonus.classList.add('messageCenterText')
        const winnings = this.playerWinnings
        const bonusText = document.querySelector('#bonus').innerHTML
        bonus.innerHTML = 'The bonus case contained ' + bonusText + '! Your winnings for the game are $' + winnings + '.'
        messageCenter.appendChild(bonus)
        

    },
    initiateGameMessage: function() {
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const message = document.createElement('p')
        message.classList.add('messageCenterText')
        message.innerHTML = 'Please select a briefcase from the board. You will hold onto this briefcase until either you sell it to the banker or all of the other briefcases have been opened. This game has seven rounds. You open five briefcases in the first round, three in rounds two-five, two in round six, and one in round seven. In the final round, you will have the option to switch your briefcase with the remaining unopened briefcase. Choose your briefcase carefully! Values range from $0.01 to $500k.'
        messageCenter.appendChild(message)
    },
    reminderMessage: function() {
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const reminder = document.createElement('p')
        reminder.classList.add('messageCenterText')
        reminder.innerHTML = 'Please select a suitcase!'
        messageCenter.appendChild(reminder)
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
        //console.log(buttons)
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', this.userOption)
            //console.log('event listener added')
        }
    },
    addBonusCaseListner: function() {
        const bonus = document.querySelector('#bonus')
        //not sure if I need this yet, might just use button and unhide if user accepts bonus offer
    },
    addUserNameListener: function() {
        const nameButton = document.querySelector('#submitName')
        nameButton.addEventListener('click', this.addPlayerName)
    }

}

document.addEventListener('DOMContentLoaded', () => {
    //console.log('locked and loaded')
    game.createBriefcases()
    game.createBonusCase()
    game.availableValues()
    game.bonusCaseOutcomes()
    //game.switchCases()
    game.addButtonListeners()
    game.addUserNameListener()
})