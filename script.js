var gameSettings = { //default settings
    "startCardAmount": localStorage.getItem("startCardAmount"),
    "startPlayerAmount": localStorage.getItem("startPlayerAmount"),
    "startLuck": localStorage.getItem("startLuck"),
    "fullReload": localStorage.getItem("fullReload"),
}

var gameCards = [ //40 game cards
    "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9",
    "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9",
    "y0", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9",
    "g0", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9",
]

var specialCards = [ //14 special game cards, I am thinking about adding the "Swap Hands Card" | the letters at the start is the color, r = red, etc. (d = darkGrey)
    "b+2", "b↺", "b㊀",
    "r+2", "r↺", "r㊀",
    "g+2", "g↺", "g㊀",
    "y+2", "y↺", "y㊀",
    "d⍟", "d+4",
    "d⍟", "d+4",
]

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) { //everytime page is reloaded:
    if (gameSettings.fullReload == 1) { //only full reloads when the user wants to
        window.localStorage.clear() //will clear localStorage
        window.location.href = "/" //will go back to index.php
    }
}

// class Bot {
//     constructor() {        
//         localStorage.setItem("totalPlayerCount", parseInt(localStorage.getItem("totalPlayerCount")) + 1)
//         this.name = "Player " + localStorage.getItem("totalPlayerCount")
//     }

//     //method
//     print() {
//         return `I am ${this.name}`
//     }
// }

function remove(querySelector) { //usefull to remove html elements
    document.querySelector(querySelector).remove()
}

function firstCapital(string) { //usefull to capitalize the first letter in a string
    return string[0].toUpperCase() + string.substring(1)
}

function switchTurn() {
    turn += 1
}

function createTitle(innerHTML, hx, body, isSubtitle) { //creates a title underlined
    const title = document.createElement(hx)
    title.innerHTML = innerHTML
    title.style.textDecoration = "underline"
    if (isSubtitle) { //if specified that the title is a subtitle, then we should make it like a real subtitle
        title.style.marginTop = "-20px"
        title.style.textDecoration = "none" //I could shorten the code, but it would be less readable i think
    }

    body.appendChild(title)
}

function createButton(innerHTML, whatToLoad, body, consoleLog) { //creates a button that loads what you want it to load when you create it somewhere
    const button = document.createElement("button")
    button.innerHTML = innerHTML
    button.onclick = function () {
        if (consoleLog !== undefined) {
            console.log(consoleLog)
        }
        window.location.href = "../" + whatToLoad + "/"
    }

    body.appendChild(button)
}

function createSettings(text, jsontext, optionStart, optionEnd, selectedOption, body) { //creates a setting that will write into the global setting
    const setAmountP = document.createElement("p")
    const setAmount = document.createElement("select")
    setAmountP.innerHTML = text
    setAmount.onblur = function () {
        window.localStorage.setItem(jsontext, setAmount[setAmount.selectedIndex].value)//sets the new setting
        console.log("changed game settings to: ", gameSettings)
    }
    
    for (let i = optionStart; i < optionEnd; i++){ //Card amount option picker
        const setAmountOption = document.createElement("option")
        setAmountOption.innerHTML = i
        if (i == selectedOption) {
            setAmountOption.selected = true
        }

        setAmount.append(setAmountOption)
    }

    setAmountP.appendChild(setAmount)
    body.appendChild(setAmountP)
}

function createForm(body) {
    const form = document.createElement("form")
    const div = document.createElement("div")
    div.id = "login"
    div.style.width = "170px"

    form.action = "/UNO/test.php"
    form.method = "post"

    createLogin("username", form)
    createLogin("password", form)
    createSubmitButton(form)
    createRemeberButton(form)

    div.appendChild(form)
    body.appendChild(div)
}

function createLogin(type, body) {
    const label = document.createElement("label")
    const login = document.createElement("input")
    
    label.for = type
    label.innerHTML = firstCapital(type)

    // login.style.display = "inline-block"
    login.placeholder = "Enter " + firstCapital(type)
    login.name = type
    login.type = type
    login.required = false

    // login.appendChild(label)
    body.appendChild(label)
    body.appendChild(login)
}

function createSubmitButton(body) {
    const button = document.createElement("button")
    button.type = "submit"
    button.innerHTML = "Log In"

    body.appendChild(button)
}

function createRemeberButton(body) {
    const label = document.createElement("label")
    const input = document.createElement("input")
    input.type = "checkbox"
    input.checked = false
    input.name = "remeber"
    label.appendChild(input)
    label.appendChild(document.createTextNode("Remeber Me"))

    body.appendChild(label)
}

function createHand(isMiddle, allowSpecial) { //creates X cards according to the set settings
    let myHand = {}
    myHand.hand = []
    if (isMiddle === true) { //if there is no parameter: draws full hand, if there is one: draw only 1 card (its for the starting card)
        isMiddle = gameSettings.startCardAmount
    } else {
        isMiddle = 1
    }
    for (let i = 0 + (isMiddle - 1); i < gameSettings.startCardAmount; i++) { //draws you the cards
        if (allowSpecial === true) {
            isMiddle = 1 //so the cardgiver gives one card and allows special
        }
        if ((Math.random() * 10) < gameSettings.startLuck && isMiddle == 1) { //Math.random() decides if you get a special cards depending on how high your luck is
            myHand.hand.push(specialCards[Math.floor(Math.random() * specialCards.length)])
        }
        else {
            myHand.hand.push(gameCards[Math.floor(Math.random() * gameCards.length)])
        }
    }
    return myHand
}

function createMiddle(body, card) { //card here is an array
    const div = document.createElement("div")
    div.classList.add("middleCard")
    div.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `
    
    middleCard = createCard(card[0], div) //btw card is an array so you make sure to make the parameter a string
    if (document.querySelectorAll(".middleCard").length > 0) { //if its not the first card being rendered:
        let rng = Math.random() * 10
        if (Math.random() > 0.5) { //gives it some rotation to the otherside
            rng *= -1
        }
        div.style.rotate = rng + "deg" //changes the next card rotation. (between -10 and 10 degrees)
    }

    body.appendChild(div) 
}

function createCard(card, body, playableHand, realBody, givesCard) { //RENDERS the given card
    //card is a string remeber!!
    const button = document.createElement("button")
    if (typeof playableHand === 'object' && givesCard === undefined) {
        button.onclick = function () {
            if (isPlayable(card)) {
                playCard(card, playableHand, realBody) //geez thats some garbage code but it works aaah
            } else {                
                console.log("Not allowed to play, try picking another card!")
            }
        }
    } else if (givesCard !== undefined) {
        button.onclick = function () {
            let myCard = createHand(true, true) 
            console.log("You picked the card", myCard.hand[0] + "!")
            playableHand.hand.push(myCard.hand[0])
            remove("#hotbar")
            createHotbar(playableHand, realBody)
        }
    }    
    button.style.height = "50px"
    button.style.width = "30px"
    button.innerHTML = card.slice(1)
    colorIt(card, button)
        
    body.appendChild(button)
    return card
}

function isPlayable(card) { //checks if the card has the same color or number or is dark
    if (middleCard.includes(card.slice(0, 1)) || middleCard.includes(card.slice(1, 3)) || card.slice(0, 1) === "d") {
        if (middleCard.slice(0, 1) === "d") { //so u can't play a dark card while choosing
            return false
        } else{
            return true
        }
    } else {
        return false
    }
}

function playCard(card, myHand, body) { //card here is also an array
    console.log("Playing card", card)
    myHand.hand.splice(myHand.hand.indexOf(card), 1)
    remove("#hotbar")
    if (card.slice(0, 1) === "d") {
        chooseColor(body, myHand, card.slice(1, 696969))
    }
    createHotbar(myHand, body)
    createMiddle(body, [card]) //createMiddle() only accepts arrays idk why
    
    checkIfWon(myHand)
    // switchTurn() //needs to be implemented with bots
    // console.log("current turn: ", turn)
}

function createHotbar(myHand, body) {
    const p = document.createElement("p")
    p.id = "hotbar"
    p.style.cssText = `
        position: absolute;
        left: 50%;
        top: 90%;
        transform: translate(-50%, -90%);
    `
    myHand.hand.map((card) => createCard(card, p, myHand, body))
    body.appendChild(p)

    return p
}

function checkIfWon(hand) {
    if (hand.hand.length === 0) {
        console.log("You WON!!")
        load("victory")
    }
}

function createSideMiddle(myHand, body) {
    const div = document.createElement("div")
    div.classList.add("middleCard")
    div.style.cssText = `
        position: absolute;
        left: 30%;
        top: 50%;
        transform: translate(-50%, -50%);
    `
    createCard("✞✦", div , myHand, body, true) //the render removes the first letter btw
    
    body.appendChild(div) 
}

function colorIt(colorString, what) {
    if (colorString.includes("g")) {
        what.style.backgroundColor = "lightGreen"
    } else if (colorString.includes("r")) { //idk how to simplify this, I tried it with switch and case it didnt work :(
        what.style.backgroundColor = "red"
    } else if (colorString.includes("y")) {
        what.style.backgroundColor = "yellow"
    } else if (colorString.includes("b")) {
        what.style.backgroundColor = "blue"
        what.style.color = "white" //make it readable
    } else {
        what.style.backgroundColor = "darkGrey"
    }
}

function chooseColor(body, hand, number) {
    console.log("Choose a color!")
    const chooserDiv = document.createElement("div")
    chooserDiv.id = "chooserDiv"
    chooserDiv.style.cssText = `
        background-color: red;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 200px;
        width: 200px;
        z-index: 1;
    `
    //z-index makes it override everything else
    createChooseButton("red", chooserDiv, hand, number)
    createChooseButton("blue", chooserDiv, hand, number)
    createChooseButton("green", chooserDiv, hand, number)
    createChooseButton("yellow", chooserDiv, hand, number)

    body.appendChild(chooserDiv)
}

function createChooseButton(color, div, hand, number) { //make sure color is a css accepted string
    const chooseColor = document.createElement("button")
    chooseColor.innerHTML = "CHOOSE " + color.toUpperCase()
    chooseColor.style.cssText = `
        height: 100px;
        width: 100px;
    `
    chooseColor.onclick = function() {
        const card = color.slice(0, 1) + number //for playing the card by making it the correct color
        console.log("You chose the color", color + "!")
        hand.hand.push("filler card because playCard() requires food")
        playCard(card, hand, document.querySelector("body")) //i couldnt bother writing more paramteres for the body
        remove("#chooserDiv")
    }
    colorIt(color, chooseColor) //color it

    div.appendChild(chooseColor)
}

// function createBots() { //creates all the bots neccessary
//     var bots = []

//     for (var i = 1; i <= gameSettings.startPlayerAmount - 1; ++i) { //creates a new Bot() depending on the setting
//         bots[i] = new Bot()
//     }
//     return bots
// }

// function createBotsMiddle(body, player) { //creates a list displaying all the bots
//     const ul = document.createElement("ul")
//     const div = document.createElement("div")
//     div.style.cssText = `
//         position: absolute;
//         left: 80%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//     `
//     for (x in player) { //makes list bigger when there are more players (bots)
//         const li = document.createElement("li")  
//         li.innerHTML = player[x].name
//         ul.appendChild(li)
//     }

//     div.appendChild(ul)
//     body.appendChild(div)
// }

function load(menu) { //loads a premade menu
    if ((gameSettings.startCardAmount || gameSettings.startPlayerAmount || gameSettings.startLuck) == null) { //makes sure the browser saves settings
        window.location.href = "index.html" //redirects to index.html to reload settings
    }
    //creating important elements to remove / replace
    const html = document.querySelector("html")
    const oldBody = document.querySelector("body")
    const newBody = document.createElement("body")
    
    
    if (menu === "mainMenu") { //if you want to load the main page
        createTitle("Welcome to UNO!", "h1", newBody)
        createTitle("Made by ArcadeFortune; DESPykesfying#3794.", "h5", newBody, true)
        createButton("Start Game", "game", newBody, "starting game...")
        createButton("Change settings", "settings", newBody, "opening settings...")    
        createButton("Login", "login", newBody, "Logging in") 
        
        const btn = document.createElement("button")
        btn.innerHTML = "secret dev route"
        btn.onclick = function() {
            window.location.href = "settings/settings.php"
        }
        newBody.appendChild(btn)
    }

    if (menu === "settings") { //if you want to load the settings
        createTitle("The Settings", "h1", newBody)
        createSettings("Card start amount: ", "startCardAmount", 3, 11, gameSettings.startCardAmount, newBody) //i need to sync default settings with this (so i don't have to manually change both instances in the code)
        createSettings("Total player amount: ", "startPlayerAmount", 2, 11, gameSettings.startPlayerAmount, newBody)
        createSettings("Luck: ", "startLuck", 0, 11, gameSettings.startLuck, newBody)
        createSettings("Full Reload: ", "fullReload", 0, 2, gameSettings.fullReload, newBody)
        createButton("Return to main menu", "mainMenu", newBody, "returning home...")
    }

    if (menu === "game") { //if you want the game to start
        let myHand = createHand() //creating
        console.log("This is you hand: ", myHand.hand)
        for (let p = 2; p < gameSettings.startPlayerAmount + 1; p++) {
        }
        middleCard = createHand(true) //parameter makes it only draw 1 random card
        console.log("Starting card will be: ", middleCard.hand[0])
        createMiddle(newBody, middleCard.hand)
        createHotbar(myHand, newBody)
        createSideMiddle(myHand, newBody) //to collect cards when you cant play a card
        
        
        // //     need to create hands for bots
        // edit: creating bots oh yeahh
        // var bots = createBots()
        // createBotsMiddle(newBody, bots)

        // let nr = 8
        // console.log("testing creating variables")
        // nr = "test"
        // let p2 = createHand()
        // console.log("here mainPlayer: ", myHand)
        // console.log("here p2: ", p2)
        // console.log("old turn: ", turn)
        // switchTurn()       

    }

    if (menu === "victory") { //if you want the vicotry screen
        createTitle("You won!!!", "h1", newBody)
        createButton("YAY!", "mainMenu", newBody, "returning to main menu...")
    }

    if (menu === "login") {
        createTitle("Login", "h1", newBody)
        createForm(newBody)
        createButton("return", "mainMenu", newBody, "returning home")
    }

    //replacing whatever happened above with the previous body
    oldBody.replaceWith(newBody)
}
