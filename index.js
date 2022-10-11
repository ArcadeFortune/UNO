var gameSettings = { //default settings
    "startCardAmount": 7,
    "startPlayerAmount": 4,
    "startLuck": 3,
}

var gameCards = [ //40 game cards
    "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9",
    "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9",
    "y0", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9",
    "g0", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9",
]

var speicalCards = [ //14 special game cards, I am thinking about adding the "Swap Hands Card" | the letters at the start is the color, r = red, etc. (d = darkGrey)
    "b+2", "b↺", "b㊀",
    "r+2", "r↺", "r㊀",
    "g+2", "g↺", "g㊀",
    "y+2", "y↺", "y㊀",
    "d⍟", "d+4",
    "d⍟", "d+4",
]

function isJsEnabled() { //if javascript isn't enabled / there is an error, then nothing will load and the user will be notified that something went wrong. (javacript is not enabled)
    document.querySelector(".js").remove()
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
        load(whatToLoad)
        if (consoleLog !== undefined) {
            console.log(consoleLog)
        }
    }

    body.appendChild(button)
}

function createSettings(text, jsontext, optionStart, optionEnd, selectedOption, body) { //creates a setting that will write into the global setting
    const setAmountP = document.createElement("p")
    const setAmount = document.createElement("select")
    setAmountP.innerHTML = text
    setAmount.onblur = function () {
        //tells the ammount of the selected value
        gameSettings[jsontext] = parseInt(setAmount[setAmount.selectedIndex].value)
        console.log("changed game settings to: ", gameSettings)
    }
    
    for (let i = optionStart; i < optionEnd; i++){ //Card amount option slider
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

function createCard(card, body, hasFunction) {
    const button = document.createElement("button")
    if (hasFunction != undefined) {
        button.onclick = function () {
            console.log("you clicked the", card, "card")
        }
    }
   
    //RENDERS the given card
    button.style.height = "50px"
    button.style.width = "30px"
    button.innerHTML = card.slice(1)

    if (card.includes("r")) { //idk how to simplify this, I tried it with switch and case it didnt work :(
        button.style.backgroundColor = "red"
    } else if (card.includes("g")) {
        button.style.backgroundColor = "lightGreen"
    } else if (card.includes("y")) {
        button.style.backgroundColor = "yellow"
    } else if (card.includes("b")) {
        button.style.backgroundColor = "blue"
        button.style.color = "white" //make it readable
    } else {
        button.style.backgroundColor = "darkGrey"
    }
        
    body.appendChild(button)
}

function createHand(idkHowToCallIt) { //creates X cards according to the set settings
    let myHand = []
    if (idkHowToCallIt == undefined) { //if there is no parameter: draws full hand, if there is one: draw only 1 card (its for the starting card)
        idkHowToCallIt = 1
    }

    for (let i = 0 + (idkHowToCallIt - 1); i < gameSettings.startCardAmount; i++) { //draws you the cards
        if ((Math.random() * 10) < gameSettings.startLuck) { //Math.random() decides if you get a special cards depending on how high your luck is
            myHand.push(speicalCards[Math.floor(Math.random() * speicalCards.length)])
        } else {
            myHand.push(gameCards[Math.floor(Math.random() * gameCards.length)])
        }
    }
    return myHand
}

function createHotbar(myHand, body) {
    const p = document.createElement("p")
    p.style.cssText = `
        position: absolute;
        left: 50%;
        top: 90%;
        transform: translate(-50%, -90%);
    `;
    myHand.map((card) => createCard(card, p, "blabla yes it should have function xd"))
    body.appendChild(p)
}

function createMiddle(body, card) {
    const div = document.createElement("div")
    div.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    console.log("BEFORE CREATING THE STARTING CARD, I WOULD LIKE TO KNOW WHAT THE STARTING CARD REALLY IS: ", card.slice(1))
    card.map((card) => createCard(card, div)) //map turns the array into string. (card is an array)
    body.appendChild(div)
}

function load(menu) { //loads a premade menu
    //creating important elements to remove / replace
    const html = document.querySelector("html")
    const oldBody = document.querySelector("body")
    const newBody = document.createElement("body")

    if (menu == "mainMenu") { //if you want to load the main page
        createTitle("Welcome to UNO!", "h1", newBody)
        createTitle("Made by ArcadeFortune, DESPykesfying#3794", "h5", newBody, true)
        createButton("Start Game", "game", newBody)
        createButton("Change settings", "settings", newBody, "opening settings...")        
    }

    if (menu == "settings") { //if you want to load the settings
        createTitle("The Settings", "h1", newBody)
        createSettings("Card start amount: ", "startCardAmount", 3, 11, gameSettings.startCardAmount, newBody) //i need to sync default settings with this (so i don't have to manually change both instances in the code)
        createSettings("Total player amount: ", "startPlayerAmount", 2, 11, gameSettings.startPlayerAmount, newBody)
        createSettings("Luck: ", "startLuck", 0, 11, gameSettings.startLuck, newBody)
        createButton("Return to main menu", "mainMenu", newBody, "returning home...")
    }

    if (menu == "game") { //if you want the game to start   
        console.log("game started with the following settings: ", gameSettings)
        let myHand = createHand()
        console.log("your hand:", myHand)
        createHotbar(myHand, newBody)
        for (let p = 1; p < gameSettings.startPlayerAmount; p++) {
            console.log("Player", p, "has: ", createHand())
        }
        
        let startingCard = createHand(gameSettings.startCardAmount) //parameter makes it only draw 1 random card
        console.log("Starting card will be: ", startingCard)
        createMiddle(newBody, startingCard)

        createButton("Temporarily return to main menu", "mainMenu", newBody, "returning home...") //debug
    }

    //replacing whatever happened above with the previous body
    oldBody.replaceWith(newBody)
}


document.addEventListener("DOMContentLoaded", () => { //cleanest DOMContentLoaded ever
    isJsEnabled()
    load("mainMenu")
})