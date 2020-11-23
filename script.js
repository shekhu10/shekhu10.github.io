const score = document.querySelector(".score");
const level = document.querySelector(".level");
const startScreenPopup = document.querySelector(".startScreenPopup");
const gameArea = document.querySelector(".gameArea");

startScreenPopup.addEventListener('click', gameStart);

let player = {
    speed: 5,
    score: 0,
    level: 1,
    nitros: 0
};

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    Shift: false
}

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
    // console.log(e.key);
}
function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}


function moveLines() {
    let lines = document.querySelectorAll(".lines");

    lines.forEach(function (item) {
        if (item.y >= 800) {
            item.y -= 1050;
        }
        item.y += (player.speed * player.level + player.nitros);
        item.style.top = item.y + "px";
    })
}

function endGame() {
    player.start = false;
    startScreenPopup.classList.remove('hide');
    let ps = player.score + (1 * player.level);
    startScreenPopup.innerHTML = "Game Over <br> final score: " + (ps) + "<br> Did you forgot nitros ? <br> Use Shift";
    + "<br> press to restart";
}

function moveEnemyCars(car) {
    let enemy = document.querySelectorAll(".enemy");
    let gameheight = gameArea.getBoundingClientRect();
    console.log(gameheight);
    enemy.forEach(function (item) {
        if (isColloid(car, item)) {
            console.log("BOOM HIT");
            endGame();
        }

        if (item.y >= 800) {
            item.y -= 900;
            item.style.left = Math.floor(Math.random() * 1000) % 350 + "px";
        }

        item.y += (player.speed * player.level + player.nitros);
        item.style.top = item.y + "px";
    })
}

function isColloid(a, b) {
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();
    // now a dimension and b dimensions are in aRect and bRect
    // a is our car and b is enemy car
    return !((aRect.bottom < bRect.top) || (aRect.top > bRect.bottom)
        || (aRect.right < bRect.left) || (aRect.left > bRect.right));
}



function gameStart() {
    startScreenPopup.classList.add('hide');
    gameArea.innerHTML = "";
    window.requestAnimationFrame(gamePlay);

    // note this is not game play
    player.start = true;
    player.score = 0;
    player.nitros = 0;
    player.nitros_time = 0;
    

    // for road lines
    for (let i = 0; i < 6; i++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        // this y property is used in move lines.. this property is made by us
        roadLine.y = (i * 140);
        roadLine.style.top = (roadLine.y + "px");
        gameArea.appendChild(roadLine);
    }


    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    car.innerText = "";
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    
    // for enemy cars
    for (let i = 0; i < 4; i++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy');        
        enemyCar.y = ((i + 1) * 250) - 50;
        enemyCar.style.top = ((i * 250) + "px");
        enemyCar.style.backgroundColor = RandomColor();
        enemyCar.style.left = Math.floor(Math.random() * 1000) % 350 + "px";
        gameArea.appendChild(enemyCar);
    }


}

function RandomColor() {

    function c() {
        let hex = Math.floor(Math.random() * 256);
        hex = hex.toString(16);
        hex = ("0" + hex).substr(-2);
        return hex;
    }
    return "#" + c() + c() + c();
}


function gamePlay() {
    let car = document.querySelector(".car");
    let road_dimensions = gameArea.getBoundingClientRect();

    // console.log("game is started");

    if (player.start == true) {

        moveLines();
        moveEnemyCars(car);

        

        player.level = Math.floor(player.score / 1000) + 1;

        if (keys.Shift == true){
            player.nitros = Math.floor(player.speed * player.level / 2);
        }
        else{
            player.nitros = 0;
        }

        
        if ((keys.ArrowUp == true || keys.w == true) && player.y > road_dimensions.height / 7) {
            player.y -= (player.speed * player.level + player.nitros);
        }
        if ((keys.ArrowDown == true || keys.s == true) && player.y < (road_dimensions.height - car.offsetHeight - 20)) {

            player.y += (player.speed * player.level + player.nitros);
        }
        if ((keys.ArrowLeft == true || keys.a == true) && player.x > 0) {
            player.x -= (player.speed * player.level + player.nitros);
        }
        if ((keys.ArrowRight == true || keys.d == true) && player.x < (road_dimensions.width - car.offsetWidth - 14)) {
            player.x += (player.speed * player.level + player.nitros);
        }
        
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";
        window.requestAnimationFrame(gamePlay);



        player.score += (player.level * 1);
        player.score = Math.floor(player.score);
        score.innerText = "Score: " + player.score;
        level.innerText = "Level: " + player.level;
    }
}


