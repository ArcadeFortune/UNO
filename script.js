localStorage.setItem("totalPlayerCount", 1); //there is currently 1 player here
var won = false; //no one has won yet
var skippedRound = false; //no rounds have been skipped by the ㊀ card
var disabled = false; //all the buttons are ENabled
var myHand = [];
var middleCard; //this line of code is infact useless, and i do not know why
var b = 0; //index for bot list
var reversed = false; //here to check if the round is reversed or not
var allowedToWin = false; //you are allowed to win when you shout UNO!
var gameSettings = { //get default settings from index.html
    "startCardAmount": localStorage.getItem("startCardAmount"),
    "startPlayerAmount": localStorage.getItem("startPlayerAmount"),
    "startLuck": localStorage.getItem("startLuck"),
    "roundSpeed": localStorage.getItem("roundSpeed"),
    "fullReload": localStorage.getItem("fullReload")
}; //if adding new settings, add them in 3 places: here, index.html and in load("settings")

var gameCards = [ //40 game cards
    "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9",
    "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9",
    "y0", "y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9",
    "g0", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"
];

var specialCards = [ //14 special game cards, I am thinking about adding the "Swap Hands Card" | the letters at the start is the color, r = red, etc. (d = darkGrey)
    "b+2", "b↺", "b㊀",
    "r+2", "r↺", "r㊀",
    "g+2", "g↺", "g㊀",
    "y+2", "y↺", "y㊀",
    "d⍟", "d+4",
    "d⍟", "d+4"
];

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) { //everytime page is reloaded:
    if (gameSettings.fullReload === 1) { //only full reloads when the user wants to.
        window.location.href = "/UNO/index.html"; //will go back to index.html
    }
}

class Bot {
    constructor() {        
        localStorage.setItem("totalPlayerCount", parseInt(localStorage.getItem("totalPlayerCount")) + 1);
        this.name = "Player " + localStorage.getItem("totalPlayerCount");
        this.hand = createHand();
    }
};

var bots = createBots(); //lets create our bots

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function body() {
    return document.querySelector("#newBody");
}

function remove(querySelector) { //usefull to remove html elements
    document.querySelector(querySelector).remove();
}

function firstCapital(string) { //usefull to capitalize the first letter in a string
    return string[0].toUpperCase() + string.substring(1);
}

function removeLetters(string) { //removes all letters from a string, return int
    string = string.replace(/[a-zA-Z()]/g,'');
    return parseFloat(string)
}

function disableButtons() {
    const inputs = document.querySelectorAll("button");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
        disabled = true;
    }
}

function enableButtons() {
    const inputs = document.querySelectorAll("button");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        disabled = false;
    }
}

function wait(miliseconds = 0) {
    return new Promise(resolve => {
        setTimeout(() => {  
            resolve('resolved');
        }, (gameSettings.roundSpeed * 100) + miliseconds);
    });
}

function turn() {
    if (reversed) {
        reversed = false
    } else {
        reversed = true
    }
}

function checkIfUno() {
    if (myHand.length === 1) {        
        const coordsX = findCoords();
        const coordsY = findCoords();
        thunder(coordsX, coordsY);
    }
}

function checkIfWon(hand) {
    if (hand.length === 0) {
        load("victory");
        console.log("YOU WON!!");
        won = true;
    }
}

function createUno(coordsX, coordsY) {

    try {
        document.querySelector(".a").style.backgroundImage = ""; //makes the colorful card uncolorful
    } catch (error) {
    }
    
    const html = document.querySelector("html") 
    var id1 = null; //light cards
    var id2 = null; //light background
    var id3 = null; //unlight cards
    var id4 = null; //unlight background
    var cardOpacity = 0;
    var backgroundOpacity = -1;
    var finished = false;
    var trulyFinished = false;
    var speed = 0.05; //0.3
    var backgroundSpeed = 0.04;
    var durationCard = 1.2;
    var durationGround = 0.6;
    var durationUnCard = 0.2;
    var durationUnGround = 0;
    var shouldAlert = false
    console.log(coordsX)
    console.log(coordsY)
    // createScreenCanvas();
    // drawLine(canvas, [0, 0], [coordsX, coordsY])
    // html.append(createOverlay(0.1))
    // canvas.id = "uno";
    // canvas.width = maxSize;
    // canvas.height = maxSize;    
    // canvas.style.cssText = `
    //     position: absolute;
    //     object-position: 20% 80%;
    //     border: 1px solid #000000;
    //     transform: scale(1);
    // `;
    createOverlay(0);
    clearInterval(id);
    clearInterval(id2);
    id1 = setInterval(shiningCards, 10);
    id2 = setInterval(shiningGround, 10);
    const inputs = document.querySelectorAll("button"); 

    function shiningCards() {
        if (cardOpacity >= durationCard) {
            console.log("max Opacity reached.");
            shouldAlert ? alert("max Opacity reached.") : null;
            clearInterval(id1);
            
            if (finished) { //plays after the first time everything gets white
                console.log("finsihing it");
                shouldAlert ? alert("finisching it") : null;
                trulyFinished = true;
                clearInterval(id3);
                // console.log(durationUnCard);
                // console.log(durationUnGround);
                // console.log(cardOpacity);
                backgroundOpacity = cardOpacity
                id3 = setInterval(unShineCards, 10)
                clearInterval(id4);
                id4 = setInterval(unShineGround, 10);
                console.log("FINISHEDDDDDDDDDDDDDDDDDDDDddd")
            } else {
                durationUnCard = 0;
                clearInterval(id3);
                id3 = setInterval(unShineCards, 10)
            }
        }
        else {
            cardOpacity += speed;
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].style.backgroundColor = `rgba(255,255,255, ${cardOpacity})`;
                // console.log(inputs[i])  
            }
        }
    }

    // function shiningCards() {
    //     if (cardOpacity >= durationCard) {
    //         console.log("max Opacity reached.");
    //         //alert("max Opacity reached.");
    //         clearInterval(id);
    //         if (finished) { //plays after the first time everything gets white
    //             console.log("finsihing it");
    //             alert("finisching it");
    //             trulyFinished = true;
    //             clearInterval(id3);
    //             // console.log(durationUnCard);
    //             // console.log(durationUnGround);
    //             // console.log(cardOpacity);
    //             backgroundOpacity = cardOpacity
    //             id3 = setInterval(unShineCards, 10)
    //             clearInterval(id4);
    //             id4 = setInterval(unShineGround, 10);
    //             console.log("FINISHEDDDDDDDDDDDDDDDDDDDDddd")
    //         } else {
    //             durationUnCard = 0;
    //             clearInterval(id3);
    //             id3 = setInterval(unShineCards, 10)
    //         }            
    //     }

    //     else {
    //         cardOpacity += speed;
    //         for (var i = 0; i < inputs.length; i++) {
    //             inputs[i].style.backgroundColor = `rgba(255,255,255, ${cardOpacity})`;
    //             // console.log(inputs[i])  
    //         }
    //     }
    // }   

    function unShineCards() {
        if (cardOpacity <= durationUnCard) {
            console.log("cards have been unlighted.");
            shouldAlert ? alert("cards have been unlighted.") : null;
            // for (var i = 0; i < inputs.length; i++) {
            //     colorIt(inputs[i].className, inputs[i]);
            // }
            clearInterval(id3);

            if (!trulyFinished) {                   
                clearInterval(id1);
                durationCard = 1.6;
                id1 = setInterval(shiningCards, 10);
            }
            if (finished) {
                clearInterval(id4);
                id4 = setInterval(unShineGround, 10);
            }
            finished = true;
        }
        else {
            cardOpacity -= speed;
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].style.backgroundColor = `rgba(255,255,255, ${cardOpacity})`  
                // console.log(inputs[i])  
            }
        }
    }

    function shiningGround() {
        if (backgroundOpacity >= durationGround) {
            console.log("background is now shiny")
            shouldAlert ? alert("background is now shiny") : null;
            clearInterval(id2);
            
            clearInterval(id3); //after the ground has shined, make the cards slightly transparent
            id3 = setInterval(unShineCards, 10)
        }
        else {
            remove(".overlay");
            createOverlay(backgroundOpacity);
            backgroundOpacity += backgroundSpeed;
        }
    }

    function unShineGround() {
        if (backgroundOpacity <= durationUnGround) {
            remove(".overlay");
            clearInterval(id4);            
            for (var i = 0; i < inputs.length; i++) {
                colorIt(inputs[i].className, inputs[i]);
            }
            console.log("ground has been unshined")
            shouldAlert ? alert("stopped.") : null;
        }
        else {
            remove(".overlay");
            createOverlay(backgroundOpacity);
            backgroundOpacity -= speed;
        }
    }
    // function thunderOverlay() {
    //     if (opacity >= 1) {
    //         console.log("max Opacity reached.")           
            
    //         var elements = document.querySelectorAll("button");   

    //         for(i = 0, len = elements.length; i < len; i++) {   
    //             elements[i].style.cssText = `
    //             background-color: rgba(255,255,255, ${opacity});
    //             `
    //         }
    //         // html.append(createOverlay(1, 0))
    //         clearInterval(id);
    //     }
    //     else {
    //         console.log(opacity)
            
    //         var elements = document.querySelectorAll("button");   

    //         for(i = 0, len = elements.length; i < len; i++) {   
    //             elements[i].style.cssText = `
    //             background-color: rgba(255,255,255, ${opacity});
    //             `
    //         }
 
    //         // html.append(createOverlay(opacity))
    //         opacity += 0.2;
        // }
    // }



















    var spawnId = null;
    var id = null;
    var maxAnimateSize = 0.5;
    var tempSize = 0;
    var tempSizeScale = 0.09;
    const canvas = makeCanvas(coordsX, coordsY);
    console.log("max size", maxAnimateSize);
    console.log(canvas.style.transform)
    console.log(removeLetters(canvas.style.transform.slice(7)))

    canvas.style.transform = `scale(0) rotate(${removeLetters(canvas.style.transform.slice(12))}deg)`;
       

    function spawnUno() {
        if (removeLetters(canvas.style.transform) >= maxAnimateSize) {
            maxAnimateSize = 1.5;
            tempSizeScale = 0.005;
            clearInterval(spawnId);
        } else {
            canvas.style.transform = `scale(${tempSize + tempSizeScale}) rotate(${removeLetters(canvas.style.transform.slice(12))}deg)`;
            tempSize += tempSizeScale;
        }
    }

    // clearInterval(id);
    // id = setInterval(animateSize, 60);

    // function animateSize() {
    //     console.log("current Size", canvas.style.transform);
    //     console.log(removeLetters(canvas.style.transform))
    //     if (removeLetters(canvas.style.transform) >= maxAnimateSize) {
    //         console.log("Max size reached.!s");
    //         console.log(canvas)
    //         clearInterval(id);
    //     }
    //     else {
    //         canvas.style.transform = `scale(${tempSize + tempSizeScale}) rotate(${removeLetters(canvas.style.transform.slice(12))}deg)`;
    //         tempSize += tempSizeScale;
    //     }
    // }
    return canvas
}

function createTitle(innerHTML, hx, body, isSubtitle) { //creates a title underlined
    const title = document.createElement(hx);
    title.innerHTML = innerHTML;
    title.style.textDecoration = "underline";
    if (isSubtitle) { //if specified that the title is a subtitle, then we should make it like a real subtitle
        title.style.marginTop = "-20px";
        title.style.textDecoration = "none"; //I could shorten the code, but it would be less readable i think
    }
    body.appendChild(title);
}

function createButton(innerHTML, whatToLoad, body, consoleLog) { //creates a button that loads what you want it to load when you create it somewhere
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.onclick = function () {
        if (consoleLog !== undefined) {
            console.log(consoleLog);
        }
        window.location.href = "../" + whatToLoad + "/";
    };
    button.style.cssText = `
        position: relative;
        max-height: 30px;
    `
    body.appendChild(button);
}

function createSettings(text, jsontext, optionStart, optionEnd, selectedOption, body) { //creates a setting that will write into the global setting
    const setAmountP = document.createElement("p");
    const setAmount = document.createElement("select");
    setAmountP.innerHTML = text;
    setAmount.onblur = function () {
        window.localStorage.setItem(jsontext, setAmount[setAmount.selectedIndex].value); //sets the new setting
        console.log("changed game settings to: ", gameSettings);
    };
    
    for (let i = optionStart; i < optionEnd; i++){ //Card amount option picker
        const setAmountOption = document.createElement("option");
        setAmountOption.innerHTML = i;
        if (i == selectedOption) {
            setAmountOption.selected = true;
        }

        setAmount.append(setAmountOption);
    }

    setAmountP.appendChild(setAmount);
    body.appendChild(setAmountP);
}

function createForm(body) {
    const form = document.createElement("form");
    const div = document.createElement("div");
    div.id = "login";
    div.style.width = "170px";

    form.action = "/UNO/test.php";
    form.method = "post";

    createLogin("username", form);
    createLogin("password", form);
    createSubmitButton(form);
    createRemeberButton(form);

    div.appendChild(form);
    body.appendChild(div);
}

function createLogin(type, body) {
    const label = document.createElement("label");
    const login = document.createElement("input");
    
    label.for = type;
    label.innerHTML = firstCapital(type);

    login.placeholder = "Enter " + firstCapital(type);
    login.name = type;
    login.type = type;
    login.required = false;

    body.appendChild(label);
    body.appendChild(login);
}

function createSubmitButton(body) {
    const button = document.createElement("button");
    button.type = "submit";
    button.innerHTML = "Log In";

    body.appendChild(button);
}

function createRemeberButton(body) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = false;
    input.name = "remeber";
    label.appendChild(input);
    label.appendChild(document.createTextNode("Remeber Me"));

    body.appendChild(label);
}

function createScreenCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "uno";
    canvas.width = "100%";
    canvas.height = "100%";    
    canvas.style.cssText = `
        position: absolute;
        border: 1px solid #000000;
    `;
    html.appendChild(canvas)
}


function createHand(amount, allowSpecial) { //creates X cards according to the set settings
    let myHand = [];
    if (amount == undefined) {
        amount = gameSettings.startCardAmount;
        allowSpecial = true;
    }
    for (let i = 0 + (gameSettings.startCardAmount - amount); i < gameSettings.startCardAmount; i++) { //draws you the cards
        if (allowSpecial === true) {
            amount = 0; //so the cardgiver gives one card and allows special
        }
        if ((Math.random() * 10) < gameSettings.startLuck && amount == 0) { //Math.random() decides if you get a special cards depending on how high your luck is
            myHand.push(specialCards[Math.floor(Math.random() * specialCards.length)]);
        }
        else {
            myHand.push(gameCards[Math.floor(Math.random() * gameCards.length)]);
        }
    }

    return myHand;
}

function createMiddle(body, card) { //card here is an array
    const div = document.createElement("div");
    div.classList.add("middleCard");
    div.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    middleCard = createCard(card[0], div); //btw card is an array so you make sure to make the parameter a string
    if (document.querySelectorAll(".middleCard").length > 0); { //if its not the first card being rendered:
        let rng = Math.random() * 10;
        if (Math.random() > 0.5) { //gives it some rotation to the otherside
            rng *= -1;
        }
        div.style.rotate = rng + "deg"; //changes the next card rotation. (between -10 and 10 degrees)
    }

    body.appendChild(div);
}

function createCard(card, body, playableHand, realBody, givesCard) { //RENDERS the given card
    //card is a string remeber!!
    const button = document.createElement("button");
    disabled ? button.disabled = true : button.disabled = false;
    if (typeof playableHand === 'object' && givesCard === undefined) {
        button.onclick = function () {
            playCard(card, playableHand, realBody); //geez thats some garbage code but it works aaah
        };
    } else if (givesCard !== undefined) {
        button.onclick = function () {
            let myCard = createHand(1, true) ;
            console.log("↑ You picked the card", myCard[0] + "!");
            playableHand.push(myCard[0]);
            remove("#hotbar");
            createHotbar(playableHand, realBody);
            botsTurn(true);
        };
    }
    button.style.cssText = `
    width: 30px;
    height: 50px;
    z-index: 200;
    `
    button.className = card.slice(0, 1);
    button.innerHTML = card.slice(1);
    colorIt(card, button);
        
    body.appendChild(button);
    return card;
}

function isPlayable(card) { //checks if the card has the same color or number or is dark
    if (middleCard.includes(card.slice(0, 1)) || middleCard.includes(card.slice(1, 3)) || card.slice(0, 1) === "d") {
        if (middleCard.slice(0, 1) === "d") { //so u can't play a dark card while choosing
            return false;
        } else{
            return true;
        }
    } else {
        return false;
    }
}

function playCard(card, myHand, body, forced) { //card here is also an array
    //check if skipped
    var valid = true; //if its still true then bots will play next
    skippedRound = false
    if (isPlayable(card) == true || forced == true) {//choose a color needs to override current middle     
        
        console.log("↓ You played the card", card);
        if (card.slice(0, 1) === "d") {
            valid = false; //bots will not play, when color has been chosen, then this will obv be skipped, so bots will play after color has been chosen
            chooseColor(body, myHand, card.slice(1, 696969));
        }
        if (card.slice(1, 2) === "↺") {
            turn()
            // skippedRound = true //why is this commented out but the other turn() appearance isnt commented out xd
        }
        myHand.splice(myHand.indexOf(card), 1);
        remove("#hotbar");
        createHotbar(myHand, body);
        createMiddle(body, [card]); //createMiddle() only accepts arrays idk why
    }
    
    else {
        console.log("Not allowed to play, try picking another card!");
        valid = false;
    }

    //now its the bots turn
    botsTurn(valid); //valid is here to check if ur picking a color or not
}

async function botsTurn(valid) {
    if (valid) { //prepare for spaghetti
        reversed ? b = list.length - 1 : b = 0
        disableButtons(); //disables other input
        if (!won) { //as soon as someone wins, everything stops
            while (b < bots.length) { //every bot plays 1 card
                try {
                    if (!won) { //as soon as someone wins, everything stops more!!!
                        if (await somethingHappened(bots[b], false)) {
                            skippedRound = true; //the round has been skipped
                            // cantFind = true; //and then it should stop finding other cards                        
                        } else {
                            var cantFind = false; //once a card has been found, no longer searches for another card
                            for (var c in bots[b].hand) { //goes through the whole loop
                                if (isPlayable(bots[b].hand[c])) {
                                    await wait()
                                    botPlaysCard(bots[b], c); //the bot plays his found card
                                    skippedRound = false;                     
                                    cantFind = true; //and then it should stop finding other cards
                                    break;
                                }
                            }
                            if (!cantFind) {
                                botPicksCard(bots[b]);
                            }
                        }
                        createBotsMiddle(body(), bots); //refresh bots list
                        remove(".botsMiddle"); //refresh bots list
                        reversed ? b-- : b++
                    }
                }
                catch {
                    break;
                }
            }

            if (await somethingHappened(myHand, true)) {
                skippedRound = true; //the round has been skipped
                botsTurn(true);
            } else {
                console.log("Choose your card!");
                enableButtons();
            }
            console.log("----------------------------");
            // console.log(`Here are the current bots: `, bots, "\n-----------------------------------"); //u could delete this line
        }
    }
}

function botPlaysCard(bot, whichCardIndex) {
    const randomColor = createHand(1, false)[0].slice(0, 1); //choose a random color to pick when choosing
    if (bot.hand[whichCardIndex].slice(0, 1) === "d") { //if bot happens to play a chooser card
        createMiddle(body(), [randomColor + bot.hand[whichCardIndex].slice(1, 696969)]); //places bots card
    } else {
        createMiddle(body(), [bot.hand[whichCardIndex]]); //places bots card
    }
    if (bot.hand[whichCardIndex].slice(1, 2) === "↺") {
        console.log("TURNINGGGGGG");
        turn()
        skippedRound = true
    }

    console.log(`↓ ${bot.name} plays ${bot.hand[whichCardIndex]}`);
    bot.hand.splice(whichCardIndex, 1); //remove card from bots hand
    checkIfBotWins(bot); //check if bot wins
}

function botPicksCard(bot) {    
    let card = createHand(1, true); //creates a quick card
    console.log(`↑ ${bot.name} picks ${card[0]}`);
    bot.hand.push(card[0]); //adds card to the bots hand
}

function checkIfBotWins(bot) {
    if(bot.hand.length === 0) { //if bots has no cards left
        console.log(`BOT ${bot.name} WONNNNNNNNNNNNNNNNNNNNN`);
        won = true; //sets global variable 'won' to true
        load("victory", bot.name); //loads victory screen
    }
}

async function somethingHappened(hand, isHuman) {
    if (shouldSkip()) {
        await wait();
        isHuman ? console.log("㊀ You have been blocked") : console.log(`㊀ ${hand.name} got blocked`);
        return true;
    }
    else if (shouldPickUp()) {
        isHuman ? console.log(`+${middleCard.slice(2, 3)} You have to pick up ${middleCard.slice(2, 3)} cards`) : console.log(`${middleCard.slice(1, 3)} ${hand.name} has to pick up ${middleCard.slice(2,3)} cards`);
        isHuman ? await pickUp(hand, isHuman) : await pickUp(hand.hand, isHuman); //notice the hand.hand
        return true;
    }
    // else if (shouldTurn()) {
    //     console.log("TURNINGGGGGG");
    //     turn();        
    //     skippedRound = true;
    //     return true;
    // } //turn() will be executed as soon as a player plays the reverse card
    else {
        return false;
    }
}

function shouldSkip() { 
    if (middleCard.slice(1, 6969) === "㊀" && !skippedRound) { //skips this round
        return true;
    }
    else {
        return false;
    }
}

function shouldTurn() {
    if (middleCard.slice(1, 6969) === "↺" && !skippedRound) {
        return true;
    } else {
        return false;   
    }
}

function shouldPickUp() {//my spaghetti code requires u to put this function after shouldSkip()
    if (middleCard.slice(1, 2) === "+" && !skippedRound) {
        return true;
    }
    else {
        return false;
    }
}

async function pickUp(hand, graphically) { //make it nicely showable
    var graphy = middleCard.slice(2, 3);
    if (graphically) {
        const fillercard = "a" + middleCard.slice(1, 3);
        for (var i = 0; i < middleCard.slice(2, 3); i++) {
            hand.push(fillercard);
            remove("#hotbar");
            createHotbar(myHand, body());
        }
    }
    await wait()
    for (var g = 0; g < middleCard.slice(2, 3); g++) {
        const card = createHand(1, true); //returns an array btw
        console.log("↑ Picking up a card...");

        if (graphically) { //replaces the fillercards slowly
            hand.splice(-graphy, 1, card[0]);
            graphy -= 1;
        } else {
            hand.push(card[0]);
        }

        createHotbar(myHand, body());
        remove("#hotbar");
        createBotsMiddle(body(), bots); //refresh bots list
        remove(".botsMiddle"); //refresh bots list
        await wait();
    }
}

function createHotbar(myHand, body) {
    const p = document.createElement("p");
    p.id = "hotbar";
    p.style.cssText = `
        position: absolute;
        top: 75%;
        width: 97%;
        text-align: center;

    `;
    // p.style.cssText = `
    // text-align: center;
    // line-height: 50%;
    // position: relative;
    // bottom: 0px;
    // `
    myHand.map((card) => createCard(card, p, myHand, body));
    body.appendChild(p);
    checkIfUno();
    checkIfWon(myHand);

    return p;
}

function createSideMiddle(myHand, body) {
    const div = document.createElement("div");
    div.classList.add("middleCard");
    div.style.cssText = `
        position: absolute;
        left: 30%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    createCard("a✦", div , myHand, body, true); //the render removes the first letter btw
    
    body.appendChild(div);
}

function colorIt(colorString, card) {
    // what.style.display = "grid"; //it breaks everything


    if (colorString.includes("g")) {
        card.style.backgroundColor = "rgb(48, 252, 82)"; //green
    } else if (colorString.includes("r")) { //idk how to simplify this, I tried it with switch and case it didnt work :(
        card.style.backgroundColor = "rgb(252, 25, 25)"; //red
    } else if (colorString.includes("y")) {
        card.style.backgroundColor = "rgb(255, 248, 51)"; //yellow
    } else if (colorString.includes("b")) {
        card.style.backgroundColor = "rgb(48, 153, 252)"; //blue
        card.style.color = "white"; //make it readable

    } else if (colorString.includes("a")) { //All the colors
        card.style.backgroundImage = "linear-gradient(90deg, red, orange, yellow, lightgreen, blue)";

    } else {
        card.style.backgroundColor = "rgb(163, 163, 163)"; //grey
    }
}

function chooseColor(body, hand, number) {
    console.log("Choose a color!");
    const chooserDiv = document.createElement("div");
    chooserDiv.id = "chooserDiv";
    chooserDiv.style.cssText = `
        background-color: blue;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 200px;
        width: 200px;
        z-index: 1;        
    `;
    //z-index makes it override everything else
    createChooseButton("red", chooserDiv, hand, number);
    createChooseButton("blue", chooserDiv, hand, number);
    createChooseButton("green", chooserDiv, hand, number);
    createChooseButton("yellow", chooserDiv, hand, number);

    body.appendChild(chooserDiv);
}

function createChooseButton(color, div, hand, number) { //make sure color is a css accepted string
    const chooseColor = document.createElement("button");
    chooseColor.innerHTML = "CHOOSE " + color.toUpperCase();
    chooseColor.style.cssText = `
        height: 100px;
        width: 100px;
    `;
    chooseColor.onclick = function() {
        const card = color.slice(0, 1) + number; //for playing the card by making it the correct color
        console.log("You chose the color", color + "!");
        hand.push("filler card because playCard() requires food");
        playCard(card, hand, body(), true); //i couldnt bother writing more paramteres for the body
        remove("#chooserDiv");
    };
    colorIt(color, chooseColor); //color it

    div.appendChild(chooseColor);
}

function createBots() { //creates all the bots neccessary
    var bots = [];

    for (var i = 0; i <= gameSettings.startPlayerAmount - 2; ++i) { //creates a new Bot() depending on the setting
        bots[i] = new Bot();
    }
    return bots;
}

function createBotsMiddle(body, player) { //creates a list displaying all the bots
    const ul = document.createElement("ul");
    const div = document.createElement("div");
    div.style.cssText = `
        position: absolute;
        left: 70%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    div.className = "botsMiddle";
    for (var x in player) { //makes list bigger when there are more players (bots)
        const li = document.createElement("li") ; 
        li.innerHTML = `${player[x].name} [✦] x${player[x].hand.length}`;
        ul.appendChild(li);
    }

    div.appendChild(ul);
    body.appendChild(div);
}
// document.querySelector("html").style.cssText = `
//     min-height: 100%;
// `
function load(menu, parameter) { //loads a premade menu
    console.log(window.screen.width)
    console.log(window.screen.height)
    //creating important elements to remove / replace
    const oldBody = document.querySelector("body");
    const body = document.createElement("body");
    const newBody = document.createElement("div");
    newBody.id = "newBody";
    newBody.style.cssText = `
        min-height: 100%;

    `



    // newBody.style.cssText = `
    
    // position: relative;
    // background-color: green;
    // max-width: 800px;
    // min-height: 340px;
    // `
    if (menu === "mainMenu") { //if you want to load the main page
        const titleDiv = createDiv(80, 800, newBody, "");

        createTitle("Welcome to UNO!", "h1", titleDiv);
        createTitle("Made by ArcadeFortune; DESPykesfying#3794.", "h5", newBody, true);
        createButton("Start Game", "game", newBody, "starting game...");
        createButton("Change settings", "settings", newBody, "opening settings...");
        createButton("Login", "login", newBody, "Logging in");
        
        const btn = document.createElement("button");
        btn.innerHTML = "secret dev route";
        btn.onclick = function() {
            window.location.href = "/UNO/test.html";
        };
        newBody.appendChild(btn);

    }

    if (menu === "settings") { //if you want to load the settings
        createTitle("The Settings", "h1", newBody);
        createSettings("Card start amount: ", "startCardAmount", 3, 11, gameSettings.startCardAmount, newBody); //i need to sync default settings with this (so i don't have to manually change both instances in the code)
        createSettings("Total player amount: ", "startPlayerAmount", 2, 11, gameSettings.startPlayerAmount, newBody);
        createSettings("Luck: ", "startLuck", 0, 11, gameSettings.startLuck, newBody);
        createSettings("Round Speed ", "roundSpeed", 0, 6, gameSettings.roundSpeed, newBody);
        createSettings("Full Reload: ", "fullReload", 0, 2, gameSettings.fullReload, newBody);
        createButton("Return to main menu", "mainMenu", newBody, "returning home...");
    }

    if (menu === "game") { //if you want the game to start
        
        if (gameSettings.startCardAmount  == null) { //makes sure the browser saves settings
            console.log("no settings found");
            window.location.href = "../"; //redirects to index.html to reload settings
        }
        localStorage.setItem("totalPlayerCount", 1); //make sure every game starts with the same totalPlayerCount
        html.style.background = "url(../pictures/table.jpg)";
        myHand = createHand(); //creating;
        console.log("This is you hand: ", myHand);
        for (let p = 2; p < gameSettings.startPlayerAmount + 1; p++) {
        }
        middleCard = createHand(1); //parameter makes it only draw 1 random card
        console.log("Starting card will be: ", middleCard[0]);
        
        createMiddle(newBody, middleCard);
        createHotbar(myHand, newBody);
        createSideMiddle(myHand, newBody); //to collect cards when you cant play a card
        createBotsMiddle(newBody, bots);
        
        const btn = document.createElement("button");
        btn.innerHTML = "win";
        btn.onclick = function() {
            myHand.splice(0, 1);
            remove("#hotbar");
            createHotbar(myHand, newBody);
            createMiddle(newBody, ["r69"]); //createMiddle() only accepts arrays idk why
        };
        newBody.appendChild(btn);
        
        const plus2 = document.createElement("button");
        plus2.innerHTML = "lose";
        plus2.onclick = function() {
            const cards = createHand(20, true);
            for (var x of cards) {
                myHand.push(x);
            }
            remove("#hotbar");
            createHotbar(myHand, newBody);
            createMiddle(newBody, ["r69"]); //createMiddle() only accepts arrays idk why
        };
        newBody.appendChild(plus2);

        // const plus3 = document.createElement("button");
        // plus3.style.backgroundImage = "linear-gradient(90deg, red, orange, yellow, lightgreen, blue)";
        // plus3.innerHTML = "get + 8";
        // plus3.onclick = function() {
        //     createMiddle(newBody, ["r+8"]);
        //     pickUp(myHand, true);
        // };
        // newBody.appendChild(plus3);

        

        const uno = document.createElement("button");
        uno.innerHTML = "create thunder";
        uno.onclick = function() {
            console.log("THUNDERING");
            const coordsX = findCoords();
            const coordsY = findCoords();
            const canvas = makeCanvas(coordsX, coordsY);
            newBody.appendChild(canvas);
            thunder(coordsX, coordsY);

        };
        newBody.appendChild(uno);

        const plus4 = document.createElement("button");
        plus4.innerHTML = "get + 8";
        plus4.onclick = function() {
            
            const inputs = document.querySelectorAll("button");
            for (var i = 0; i < inputs.length; i++) {
                console.log(inputs[i].style.backgroundColor)
                inputs[i].className = inputs[i].style.backgroundColor.slice(0, 1)
            }
        };
        newBody.appendChild(plus4);
    }

    if (menu === "victory") { //if you want the vicotry screen
        if (!parameter) {
            createTitle("You won!!!", "h1", newBody);
            createButton("YAY!", "mainMenu", newBody, "returning to main menu...");
        } else{
            createTitle(`${parameter} won!!!`, "h1", newBody);
            createButton("next time!", "mainMenu", newBody, "returning to main menu...");
        }
    }

    if (menu === "login") {
        createTitle("Login", "h1", newBody);
        createForm(newBody);
        createButton("return", "mainMenu", newBody, "returning home");
    }

    if (menu === "test") {
        html.style.background = "url(../UNO/pictures/table.jpg)";
        newBody.style.cssText = `
            min-height: 100%;
        `
        // const btn = document.createElement("button");
        // btn.innerHTML = "secret dev route";
        // btn.onclick = async function() {
        //     disableButtons();
        //     for (var i = 0; i < 5; i++) {
        //         console.log(i);
        //         await wait();
        //     }
        //     enableButtons();
        // };
        // newBody.appendChild(btn);

        // const btn2 = document.createElement("button");
        // btn2.innerHTML = "what are you";
        // btn2.onclick = function() {
        //       console.log("testt");
        // };
        // newBody.appendChild(btn2);
        window.z = 0
        const btn5 = document.createElement("button");
        btn5.innerHTML = "simulate uno round";
        btn5.onclick = async function() {
            console.log("heres the bot list:", list);
            reversed ? z = list.length - 1 : z = 0
            while (z < list.length) {
                try {
                    console.log(list[z].name)
                } catch {
                    break;
                }                    
                reversed ? z-- : z++
                await wait();
            }
        };
        newBody.appendChild(btn5);

        const btn4 = document.createElement("button");
        btn4.innerHTML = "reverse List";
        btn4.onclick = function() {
            if (reversed) {
                reversed = false
                z += 2
            } else {
                reversed = true
                z -= 2
            }
        };
        newBody.appendChild(btn4);

        const btn6 = document.createElement("button");
        btn6.innerHTML = "show list[z]";
        btn6.onclick = function() {
            console.log(list[z]);
        };
        newBody.appendChild(btn6);

        const btn3 = document.createElement("button");
        btn3.innerHTML = "create thunder";
        btn3.onclick = function() {
            const coordsX = findCoords();
            const coordsY = findCoords();
            console.log("THUNDERING!!");
            thunder(coordsX, coordsY);
            newBody.appendChild(createUno(coordsX, coordsY));
        };
        newBody.appendChild(btn3);
        
    }

    //replacing whatever happened above with the previous body
    body.appendChild(newBody)
    oldBody.replaceWith(body);
}

function createBlackHole() {
    const hole = document.createElement("div");
    hole.style.cssText = `
    background-color: black;
    position: absolute;
    height: 100%;
    width: 100%;
    `
    return hole;

}

function createDiv(height, width, append, color) {
    const div = document.createElement("div");
    div.style.cssText = `
    height: ${height}px;
    width: ${width}px;
    background-color: ${color};
    `
    append.append(div)
    return div;

}

function createTitleDiv() {
    
}

var list = createBots()

function findCoords() {
    return getRandomInt(0, 70)
}

function makeCanvas(coordsX, coordsY) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
        background-color: yellow;
        position: absolute;
        border: 1px solid #000000;
        height: 50px;
        width: 100px;
        top: ${coordsY}%;
        left: ${coordsX}%;
        transform: scale(1) rotate(20deg);
    `;
    canvas.onmouseover = function() {
        canvas.style.cursor = "pointer";
    }
    canvas.onclick = function() {
        console.log("hello");
    }

    return canvas
} //top: 70% - 0%
  //left: 70% - 0%
function thunder(coordsX, coordsY) {//ground gets light with the lighting, THEN sky gets light, THEN ground gets slightly unlight(while the thunder gets unlight), THEN all three get light, THEN all three get unlight
    
}

function drawLine() {
    const canvas = document.createElement("canvas");
    const body = document.querySelector(body);
    canvas.style.cssText = `
        border: 1px solid #000000;
        height: 100%;
        width: 99%;
        top: 0;
        left: 0;
        transform: scale(1) translate(0, 0);
    `;
    body.parentNode.insertBefore(canvas, body)
}

function createOverlay(opacity) {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0%;
    left: 0%
    z-index: 1;
    background-color: white;
    opacity: ${opacity};
    `
    overlay.className = "overlay"
    document.querySelector("html").append(overlay);
}
//----------------CSS COMES HERE------------------
const html = document.querySelector("html");
//found bugs:
//✓ reloading in settings messes up bots count
//✓ bots cant play dark cards
//p2 places ㊀ card, p3 gets blocked, p4 picks a card, AND THE PLAYER 1 GETS BLOCKED!!
//when playing a skip turn card as the last, it keeps the buttons disabled 
//when a bot plays a dark card, console.log() wont show which color it played
//middle card gets disabled while playing
//when bot plays + card to win, it freezes OR PERHAPS IDK when u pick a card and a bot wins, it freezes5