function isJsEnabled() {
    document.querySelector(".js").remove()
}

function startGame(settings) {
    console.log("game started with the following settings: ", settings)

}

function settings(isClicked, gameSettings) {


    //check if the button is clicked (its important)
    if (isClicked === "clicked") { 
        function findCardAmount(setCardAmount) {
            //tells the ammount of cards that will be delt at the beginning of the game
            gameSettings.startCardAmount = setCardAmount[setCardAmount.selectedIndex].value
            console.log("changed game settings to: ", gameSettings)
            return gameSettings
        }
        //remove main page (will be added back)
        const html = document.querySelector("html")
        const oldBody = document.querySelector("body")
        oldBody.remove()

        //set means settings, so I can differenciate between settings and main page
        //creating elements for settings
        const setTitle = document.createElement("h1")
        const setBody = document.createElement("body")
        const setP1 = document.createElement("p")
        const setCardAmount = document.createElement("select")
        const setReturn = document.createElement("button")

        //making the elements do something
        setTitle.innerHTML = "The Settings"
        setP1.innerHTML = "Card start ammount: "
        setCardAmount.onblur = function () {
            gameSettings = findCardAmount(setCardAmount)
        }
        setReturn.innerHTML = "return"
        setReturn.onclick = function () {
            console.log("returning to main Page...")
            setBody.replaceWith(oldBody)

        }

        
        

        //applying the elements
        setBody.appendChild(setTitle)
        for (let i = 1; i < 11; i++){
            const setCardAmountOption = document.createElement("option")
            setCardAmountOption.innerHTML = i
            if (i === 7) {
                setCardAmountOption.selected = true
            }
            setCardAmount.append(setCardAmountOption)
        }
        setP1.appendChild(setCardAmount)
        setBody.appendChild(setP1)
        setBody.appendChild(setReturn)
        html.appendChild(setBody)


        console.log("opening settings...")
        console.log("current game settings: ", gameSettings)


    }
    //return the settings
    return gameSettings
}



document.addEventListener("DOMContentLoaded", () => {
    isJsEnabled()

    //body
    const body = document.querySelector("body")

    //creating elements for main page
    const title = document.createElement("h1")
    const startBtn = document.createElement("button")
    const settingBtn = document.createElement("button")
    var gameSettings = {
        "startCardAmount": 7
    }


    //making elements do something
    title.innerHTML = "Welcome to UNO!"
    startBtn.innerHTML = "Start Game"
    startBtn.onclick = function () {
        startGame(gameSettings)
    }
    settingBtn.innerHTML = "Settings"
    settingBtn.onclick = function () {
        settings("clicked", gameSettings)
    }

    //appending elements
    body.appendChild(title)
    body.appendChild(startBtn)
    body.appendChild(settingBtn)
})  