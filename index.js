var gameSettings = { //default settings
    "startCardAmount": 7,
    "startPlayerAmount": 4,
    "startPlusFourAmount": 4
}

function isJsEnabled() { //if javascript isn't enabled / there is an error, then nothing will load and the user will be notified that something went wrong. (javacript is not enabled)
    document.querySelector(".js").remove()
}

function createTitle(innerHTML, hx, body, isSubtitle) { //creates a title underlined
    const title = document.createElement(hx)
    title.innerHTML = innerHTML
    title.style.textDecoration = "underline"
    if (isSubtitle) { //if specified that the title is a subtitle, then we should make it like a real subtitle
        title.style.marginTop = "-20px"
        title.style.textDecoration = "none"
    }
    body.appendChild(title)
}

function createButton(innerHTML, whatToLoad, body, consoleLog) { //creates a button
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

function createSettings(text, jsontext, optionStart, optionEnd, selectedOption, body) {
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
        createSettings("Card start amount: ", "startCardAmount", 2, 11, gameSettings.startCardAmount, newBody) //i need to sync default settings with this (so i don't have to manually change both instances in the code)
        createSettings("Player amount: ", "startPlayerAmount", 2, 11, gameSettings.startPlayerAmount, newBody)
        createSettings("[+4] amount: ", "startPlusFourAmount", 0, 9, gameSettings.startPlusFourAmount, newBody)
        createButton("Return to main menu", "mainMenu", newBody, "returning home...")
    }

    if (menu == "game") {        
        console.log("game started with the following settings: ", gameSettings)
        load("mainMenu")
    }

    //replacing whatever happened above with the previous body
    html.appendChild(newBody)
    oldBody.replaceWith(newBody)
}


document.addEventListener("DOMContentLoaded", () => {
    isJsEnabled()
    load("mainMenu")
})