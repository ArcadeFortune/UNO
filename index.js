function isJsEnabled() {
    document.querySelector(".js").remove()
}

function createTitle(text, body) {
    const title = document.createElement("h1")
    title.innerHTML = text
    title.style.textDecoration = "underline"
    body.appendChild(title)

}

function removeBody() {

    
}

function startGame(settings) {
    console.log("game started with the following settings: ", settings)




}

function settings(gameSettings) {
    //remove main page (will be added back)
    const html = document.querySelector("html")
    const mainMenu = document.querySelector("body")
    mainMenu.remove()

    //set means settings, so I can differenciate between settings and main page
    //creating elements for settings
    const setBody = document.createElement("body")
    const setReturn = document.createElement("button")

    //allows you to create settings very easily
    function createSettings(text, jsontext, optionStart, optionEnd, selectedOption) {
        const setAmountP = document.createElement("p")
        const setAmount = document.createElement("select")
        setAmountP.innerHTML = text
        setAmount.onblur = function () {
            //tells the ammount of the selected value
            gameSettings[jsontext] = setAmount[setAmount.selectedIndex].value
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
        setBody.appendChild(setAmountP)
    }

    //making the elements do something
    setReturn.innerHTML = "return"
    setReturn.onclick = function () {
        console.log("returning to main Page...")
        setBody.replaceWith(mainMenu)
    }

    
    

    //applying the elements
    createTitle("The Settings", setBody)
    createSettings("Card start amount: ", "startCardAmount", 2, 11, gameSettings.startCardAmount)
    createSettings("Player amount: ", "startPlayerAmount", 2, 11, gameSettings.startPlayerAmount)
    createSettings("[+4] amount: ", "startPlusFourAmount", 0, 9, gameSettings.startPlusFourAmount)
    setBody.appendChild(setReturn)

    html.appendChild(setBody)

    console.log("opening settings...")
    console.log("current game settings: ", gameSettings)
}



document.addEventListener("DOMContentLoaded", () => {
    isJsEnabled()

    //body
    const body = document.querySelector("body")

    //creating elements for main page
    const startBtn = document.createElement("button")
    const settingBtn = document.createElement("button")
    var gameSettings = { //default settings
        "startCardAmount": 7,
        "startPlayerAmount": 4,
        "startPlusFourAmount": 4
    }


    //making elements do something
    startBtn.innerHTML = "Start Game"
    startBtn.onclick = function () {
        startGame(gameSettings)
    }
    settingBtn.innerHTML = "Settings"
    settingBtn.onclick = function () {
        settings(gameSettings)
    }

    //appending elements
    createTitle("Welcome to UNO!", body)
    body.appendChild(startBtn)
    body.appendChild(settingBtn)
})  