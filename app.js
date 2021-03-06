const game = {
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
        //add player name to game display
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
        //controls gameflow by allowing users to click on briefcases to eliminate from the game
        if(game.round === 0 && game.activeBoard === true) {
            const player = document.querySelector('#playerInfo')
            const selection = event.target
            selection.classList.add('playerCase')
            selection.classList.remove('unopened')
            player.appendChild(selection)
            game.round += 1
            selection.removeEventListener('click', game.selectBriefcases)
            game.reminderMessage() 
        } else if(game.round <= 1 && game.activeBoard === true) {
            game.briefcaseToOpen()
        } else if(game.activeBoard === true){
            game.reminderMessage()
        }
    },
    briefcaseToOpen: function() {
        //display contents of briefcase and check to see if the banker should call with an offer
        if(this.casesToOpen > 1) {
            const clickedCase = event.target
            const eliminatedValue = event.target.innerHTML
            clickedCase.classList.add('revealed')
            clickedCase.classList.remove('unopened')
            this.casesToOpen --
            this.selectedValues.push(parseInt(eliminatedValue))
            const listOfValues = document.querySelectorAll('.availablePrize')
            for(let i = 0; i < listOfValues.length; i++) {
                if(eliminatedValue === listOfValues[i].innerHTML) {
                    listOfValues[i].classList.add('eliminatedPrize')
                }
            }
            this.bankerCalls()
            clickedCase.removeEventListener('click', game.selectBriefcases)
        } else if(this.casesToOpen === 1) {
            const lastCase = event.target
            this.casesToOpen --
            this.bankerCalls()
            lastCase.removeEventListener('click', game.selectBriefcases)
        } else if(this.casesToOpen === 0) {
            this.offerPrompt()
        }
        
    },
    availableValues: function() {
        //sorts the prizes in ascending order and appends them to an element that will display on the side of gameboard so player can keep track of remaining available prizes
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
        //compute offer banker will present to player
        let maxPrize = this.prizeValues.reduce(function(a, b) {
            return a + b
        })
        let eliminatedAmount = this.selectedValues.reduce(function(x,y) {
            return x + y
        })
        //Potential enhancement: add 10% variability into banker offer calculation
        this.offerValue = Math.round((maxPrize - eliminatedAmount) / (this.casesToOpen + 1))
        return this.offerValue
        
    },
    bankerCalls: function() {
        //mechanism for keeping track of when banker should call
        if(this.casesToOpen === 16
            || this.casesToOpen === 13
            || this.casesToOpen === 10
            || this.casesToOpen === 7
            || this.casesToOpen === 4
            || this.casesToOpen === 2
            || this.casesToOpen === 1
        ) {
            this.activeBoard = false
            this.computeBankOffer()
            this.offerTracker()
            this.offerPrompt()
            this.userOption()
        } else if(this.casesToOpen === 0) {
            this.offerPrompt()
            this.userOption()
        }
    },
    offerTracker: function() {
        //add a conditional here to account for last case being selected so that if cases left = 0, call offer prompt method
        if(this.casesToOpen > 0) {
        const addPastOffer = document.querySelector('#storeOffers')
        const mostRecentOffer = addPastOffer.firstChild
        const offer = document.createElement('p')
        offer.classList.add('presentedOffer')
        offer.innerHTML = this.offerValue
        addPastOffer.insertBefore(offer, mostRecentOffer)
        } else if(this.casesToOpen ===0) {
            this.offerPrompt()
        }
    },
    bonusCaseOutcomes: function() {
        //grab what is in the bonus case and use that to calculate final winnings if user decides to open bonus case
        const bonusValue = document.querySelector('#bonus').innerHTML
        if(bonusValue === 'add 10k') {
            return this.playerWinnings = this.playerWinnings + 10000
        } else if(bonusValue === 'double money') {
            return this.playerWinnings = this.playerWinnings * 2
        } else if(bonusValue === 'lose half') {
            return this.playerWinnings = this.playerWinnings / 2
        } else {
            return this.playerWinnings = 0
        }
    },
    userOption: function(event) {
        //mechanism to keep track of when user should make decision
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
            game.dealOrNoDeal()
        } else if(game.casesToOpen === 0 && game.bonusStatus === true) {
            //build bonus case logic into dealOrNoDeal method
            console.log('Bonus case decision')
        }
    },
    dealOrNoDeal: function() {
        //evaluate whether deal or no deal button is clicked
        //unfreeze board if user rejects deal and there is a case to open
        //evaluate whether user participates in bonus round
        const buttonSelected = event.target.getAttribute('id')
        if (buttonSelected === 'deal' && this.casesToOpen === 0 && this.activeBoard === true && this.bonusStatus === false) {
            this.switchCases()
        } else if (buttonSelected === 'noDeal' && this.casesToOpen === 0 && this.activeBoard === true && this.bonusStatus === false) {
            this.keepCase()
        } else if (buttonSelected === 'deal' && this.activeBoard === false && this.bonusStatus === false) {
            const showPlayerCaseValue = document.querySelector('.playerCase')
            showPlayerCaseValue.classList.add('revealed')
            this.playerWinnings = this.offerValue
            this.bonusStatus = true
            this.casesToOpen = 0
            this.offerPrompt()
        } else if (buttonSelected === 'noDeal' && this.casesToOpen > 0 && this.activeBoard === false && this.bonusStatus === false) {
            this.reminderMessage()
            this.activeBoard = true
        } else if (buttonSelected === 'deal' && this.bonusStatus === true) {
            this.bonusCaseOutcomes()
            this.bonusMessage()
            document.querySelectorAll('.buttons').forEach(button => button.parentNode.removeChild(button))
        } else if (buttonSelected === 'noDeal' && this.bonusStatus === true) {
            this.bonusMessage()
            document.querySelectorAll('.buttons').forEach(button => button.parentNode.removeChild(button))
        }
    },
    switchCases: function() {
        //in final round before bonus, player has option to swap cases with the remaining unopened briefcase. This code will run if user decides to switch
        if(this.casesToOpen === 0 && this.activeBoard === true && this.bonusStatus === false){
        const playersCaseLocation = document.querySelector('#playerInfo')
        const playersCase = document.querySelector('.playerCase')
        const board = document.querySelector('main')
        const unopenedCase = document.querySelector('.unopened')
        board.insertBefore(playersCase, unopenedCase)
        playersCaseLocation.appendChild(unopenedCase)
        playersCase.classList.add('revealed')
        this.selectedValues.push(parseInt(playersCase.innerHTML))
        const listOfValues = document.querySelectorAll('.availablePrize')
        for(let i = 0; i < listOfValues.length; i++) {
            if(playersCase.innerHTML === listOfValues[i].innerHTML) {
                listOfValues[i].classList.add('eliminatedPrize')
            }
        }
        unopenedCase.classList.add('revealed')
        const swapValue = unopenedCase.innerHTML
        this.playerWinnings = parseFloat(swapValue)
        this.bonusStatus = true
        this.swapOutcome()
        }
        
    },
    keepCase: function() {
        //run this code if the player has one briefcase remaining and decides not to switch
        const caseValue = document.querySelector('.playerCase')
        caseValue.classList.add('revealed')
        const unopenedCase = document.querySelector('.unopened')
        unopenedCase.classList.add('revealed')
        this.selectedValues.push(parseInt(unopenedCase.innerHTML))
        const listOfValues = document.querySelectorAll('.availablePrize')
        for(let i = 0; i < listOfValues.length; i++) {
            if(unopenedCase.innerHTML === listOfValues[i].innerHTML) {
                listOfValues[i].classList.add('eliminatedPrize')
            }
        }
        this.playerWinnings = parseFloat(caseValue.innerHTML)
        this.bonusStatus = true
        this.swapOutcome()
    },
    clearMessageCenter: function() {
        //clear existing message - will be invoked in each message display method
        const textToReplace = document.querySelector('.messageCenterText')
        while(textToReplace.firstChild){
            textToReplace.removeChild(textToReplace.firstChild)
        }
    },
    offerPrompt: function() {
        //generate message to use conveying offer information and request to accept or reject offer
        this.clearMessageCenter()
        const offerValue = document.querySelector('.presentedOffer').innerHTML
        const messageCenter = document.querySelector('.messageCenterText')
        const presentOffer = document.createElement('p')
        presentOffer.classList.add('messageCenterText')
        if(this.casesToOpen >= 1) {
            presentOffer.innerHTML = 'The banker called! He is offering you '+ offerValue+' for your briefcase. Deal or no deal?'  
        } else if(this.casesToOpen === 0 && this.bonusStatus === false) {
            presentOffer.innerHTML = 'The banker called! He is offering you the opportunity to switch your briefcase with the last unopened briefcase. Deal or no deal?'
        } else if(this.bonusStatus === true) {
            presentOffer.innerHTML = 'Congratulations, you won ' + offerValue + '! Would you like to win more? You can open the bonus briefcase to try to win 10k more or even double your money but beware, you could lose half or everything! Press Deal if you want to open the bonus case, press No Deal if you are happy with your winnings.'
            //add code in to show what was in case
        }
        messageCenter.appendChild(presentOffer)

    },
    swapOutcome: function() {
        //message to display after player is asked to switch briefcases
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const displayWinnings = document.createElement('p')
        displayWinnings.classList.add('messageCenterText')
        displayWinnings.innerHTML = 'Congratulations, you won ' + this.playerWinnings + '! Would you like to win 10k more or double your money? You can open the bonus briefcase to try to win more but beware, you could lose half of your winnings, or you could even lose everything! Press Deal if you want to open the bonus case, press No Deal if you are happing with your winnings.'
        messageCenter.appendChild(displayWinnings)
    },
    bonusMessage: function() {
        //reveal what was in bonus case, determine player's final winnings
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const bonus = document.createElement('p')
        bonus.classList.add('messageCenterText')
        const winnings = this.playerWinnings
        const revealBonus = document.querySelector('#bonus')
        revealBonus.classList.add('revealed')
        const bonusText = document.querySelector('#bonus').innerHTML
        bonus.innerHTML = 'The bonus case contained ' + bonusText + '! Your winnings for the game are ' + winnings + '.'
        messageCenter.appendChild(bonus)
        

    },
    initiateGameMessage: function() {
        //instructions to display after player enters name
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const message = document.createElement('p')
        message.classList.add('messageCenterText')
        message.innerHTML = 'Please select a briefcase from the board. You will hold onto this briefcase until either you sell it to the banker or all of the other briefcases have been opened. This game has up to eight rounds. You open five briefcases by clicking on them in the first round, three briefcases in rounds two-five, two briefcases in round six, and one briefcase in round seven. In the final round, you will have the option to switch your briefcase with the remaining unopened briefcase. Choose your briefcase carefully! Values range from 0.01 to 500k. Finally, you will be given a chance to open the golden bonus briefcase at the end of the game. More on that later.'
        messageCenter.appendChild(message)
    },
    reminderMessage: function() {
        //standard message to display while user is between offers
        this.clearMessageCenter()
        const messageCenter = document.querySelector('.messageCenterText')
        const reminder = document.createElement('p')
        reminder.classList.add('messageCenterText')
        reminder.innerHTML = 'Please select a suitcase!'
        messageCenter.appendChild(reminder)
    },
    resetBoard: function() {
        //reset cases selected, round

        game.clearMessageCenter()
        game.initiateGameMessage()

        const board = document.querySelector('main')
        const buttonSelected = event.target.getAttribute('id')
        const playerInfo = document.querySelector('#playerInfo')
        const playerInfoChildren = document.querySelector('#playerInfo').childElementCount
        const storeOffers = document.querySelector('#storeOffers')
        const listOfValues = document.querySelectorAll('.availablePrize')
        for(let i = 0; i < listOfValues.length; i++) {
                listOfValues[i].classList.remove('eliminatedPrize')
            }

        //console.log(event.target)
        /*if(buttonSelected === 'reset') {
            console.log('RESET FIRED')
        }*/
        
        while(board.firstChild){
            board.removeChild(board.firstChild)
        }

        while(storeOffers.firstChild) {
            storeOffers.removeChild(storeOffers.firstChild)
        }

        if(playerInfoChildren > 1) {
            playerInfo.removeChild(playerInfo.lastChild)
        }

        game.round = 0
        game.casesToOpen = 21
        game.selectedValues = [0]
        game.activeBoard = true
        

        game.createBriefcases()
        game.createBonusCase()
        game.selectBriefcases()
        

        
        
    },
    addBriefcaseListeners: function() {
        //add listeners to briefcase so they can be opened
        const cases = document.querySelectorAll('.briefcase')
        for(let i = 0; i < cases.length; i++) {
            cases[i].addEventListener('click',this.selectBriefcases)
            /*cases[i].addEventListener('click', (event) => {
                this.selectBriefcases.bind(game)
                this.selectBriefcases(event)
            })*/
        }
    },
    addButtonListeners: function() {
        //add listeners to deal/no deal buttons
        const buttons = document.querySelectorAll('.buttons')
        for(let i = 0; i < buttons.length; i++) {
            for(let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', this.userOption)
            /*buttons[i].addEventListener('click', (event) => {
                this.userOption.bind(game)
                this.userOption(event)
            })*/
            }
        }
    },
    addResetListener: function() {
        const reset = document.querySelector('#reset')
        reset.addEventListener('click', this.resetBoard)
    },
    addUserNameListener: function() {
        //add listener to user name submit button
        const nameButton = document.querySelector('#submitName')
        nameButton.addEventListener('click', this.addPlayerName)
    }

}

document.addEventListener('DOMContentLoaded', () => {
    game.createBriefcases()
    game.createBonusCase()
    game.availableValues()
    game.bonusCaseOutcomes()
    game.addButtonListeners()
    game.addResetListener()
    game.addUserNameListener()
})