function isJsEnabled() {
    document.querySelector(".js").remove()
}

function startGame(settings) {
    console.log("game started with the following settings: ", settings)

}

function settings(isClicked) {
    if (isClicked === "clicked") { //check if the button is clicked (its important)
        const html = document.querySelector("html")
        const oldBody = document.querySelector("body")
        oldBody.remove()

        //set means settings, so I can differenciate between settings and main page
        const setTitle = document.createElement("h1")
        const setBody = document.createElement("body")
        const setReturn = document.createElement("button")


        setTitle.innerHTML = "The Settings"

        setReturn.innerHTML = "return"
        setReturn.onclick = function () {
            console.log("returning")
            setBody.replaceWith(oldBody)
        }

        setBody.appendChild(setTitle)
        setBody.appendChild(setReturn)
        html.appendChild(setBody)


        console.log("settings")

    }
    return "red"
}

document.addEventListener("DOMContentLoaded", () => {
    isJsEnabled()

    const startBtn = document.createElement("button")
    startBtn.innerHTML = "Start Game"
    startBtn.onclick = function () {
        startGame(settings())
    }

    const settingBtn = document.createElement("button")
    settingBtn.innerHTML = "Settings"
    settingBtn.onclick = function () {
        settings("clicked")
    }

    document.querySelector("body").appendChild(startBtn)
    document.querySelector("body").appendChild(settingBtn)
})  