const canvas= document.querySelector('#game')
const game= canvas.getContext('2d');
const btnLeft= document.querySelector('#left')
const btnRight= document.querySelector('#right')
const btnUp= document.querySelector('#up')
const btnDown= document.querySelector('#down')
const spanLives= document.querySelector('#spanLives')
const spanTime= document.querySelector('#spanTime')
const record= document.querySelector('#record')
const message= document.querySelector('#message')
const btnReload=document.querySelector('#btnReload')
const btnReload1=document.querySelector('#btnReload1')





btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnUp.addEventListener('click',moveUp);
btnDown.addEventListener('click',moveDown);
window.addEventListener('keydown',moveSkull)
window.addEventListener('load',setCanvasSize)
window.addEventListener('resize',setCanvasSize)
btnReload.addEventListener('click', reloadPage)
btnReload1.addEventListener('click', reloadPage)


const playerPosition={
    x:undefined,
    y:undefined
}

const giftPosition={
    x:undefined,
    y:undefined
}
const bombaPosition=[]

const recordTime=localStorage.record_time
let canvasSize;
let elementSize;
let mapa;
let bombas;
let mapNumber=0
let lives=3
let timeStart;
let playerTime;
let timeInterval;
let complete;
let comunicado;
let bombasPosition=[]


function moveLeft(){
    console.log('Me estoy moviendo el Left');
    playerPosition.x-=elementSize
   startgame()

}
function moveRight(){
    console.log('Me estoy moviendo el Right');
    playerPosition.x+=elementSize
   startgame()
}
function moveUp(){
    console.log('Me estoy moviendo el Up');
    playerPosition.y-=elementSize

   startgame()

}
function moveDown(){
    console.log('Me estoy moviendo el Down');
    playerPosition.y+=elementSize

   startgame()

}
function moveSkull(event){
    console.log(event.key);
    switch(event.key){
        case 'ArrowUp':
            moveUp()
            break;
            case 'ArrowDown':
                moveDown()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
    }

}
function setCanvasSize(){
    if (window.innerHeight>window.innerWidth){
        canvasSize=window.innerWidth*0.6
    }
    else{
        canvasSize=window.innerHeight*0.6
    }
    canvasSize=Number(canvasSize.toFixed(3))
    
    canvas.setAttribute('width',canvasSize)
    canvas.setAttribute('height',canvasSize)
    elementSize=canvasSize/10

    playerPosition.x=undefined;
    playerPosition.y=undefined
    startgame()
}
function startgame(){
    bombas=[]
    game.font=elementSize + 'px Verdana'
    game.textAlign='end'

    mapa=maps[mapNumber].match(/[IOX\-]+/g).map(x=>x.split(''))
    if (bombasPosition.length!=0){
        for (position of bombasPosition){
            mapa[Math.round(position.y/elementSize-1)][position.x/elementSize-1]="BOMB_COLLISION"
        }
    }
    showLives()
    
    

    if (!timeStart){
        timeStart=Date.now()
        timeInterval=setInterval(showTimePlaying,100)
           }
        
    seconds=Math.floor(recordTime/1000)
    miliseconds=recordTime%1000
    record.innerHTML=`${seconds} :${miliseconds}`

    // mapa1=maps[0].trim().split('\n').map(x=>x.trim().split(""))
    // console.log(mapa1);


    // for (let i = 1; i <= 10; i++) {
    //     for (let j = 1; j <= 10; j++) {
    //     game.fillText(emojis['X'],elementSize*j,elementSize*i)
    //     }        
    // }
 
    
    // for (let i = 1; i <= 10; i++) {
    //     for (let j = 1; j <= 10; j++) {
    //     game.fillText(emojis[mapa[i-1][j-1]],elementSize*j,elementSize*i)
    //     }        
    // }
    let cont1=1
    

    game.clearRect(0,0,canvasSize,canvasSize)
   
    for(row of mapa){
        let cont2=1
        for(col of row){
            positionX=Number(elementSize*cont2.toFixed(3))
            positionY=Number(elementSize*cont1.toFixed(3))

            game.fillText(emojis[col],positionX,positionY)
            cont2+=1
            if(col=='O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x=positionX;
                    playerPosition.y=positionY;
                }
            }
            else if(col=='I'){
                giftPosition.x=positionX;
                giftPosition.y=positionY;
            }
            else if(col=='X'){                
                    let a={
                        x:positionX,
                        y:positionY
                    }
                    bombas.push(a)
            }
        }
        cont1+=1
    }
    movePlayer()
    // game.fillRect(0,50,50,50)
    // game.clearRect(25,75,25,25)
    // game.font='25px Verdana'
    // game.fillStyle='purple'
    // game.textAlign=''
    // game.fillText('Santy',50,30)
}
function movePlayer(){
    if(playerPosition.x<elementSize){
        playerPosition.x=elementSize
    }
    if(playerPosition.y<elementSize){
        playerPosition.y=elementSize
    }
    if(playerPosition.x>elementSize*10){
        playerPosition.x=elementSize*10
    }
    if(playerPosition.y>elementSize*10){
        playerPosition.y=elementSize*10
    }
    
    const colisionY=Number(playerPosition.y).toFixed(3)==Number(giftPosition.y).toFixed(3)
    const colisionX=Number(playerPosition.x).toFixed(3)==Number(giftPosition.x).toFixed(3)
    const giftColision=colisionX && colisionY
    if (giftColision){
        if (mapNumber==maps.length-1){
            winGame()
        }
        if (mapNumber<maps.length-1){
            bombasPosition=[]
            mapNumber+=1
            startgame()
        }
    }

    

    bombas.forEach(bomba => {
        const estallidoX=Math.round(playerPosition.x)==Math.round(bomba.x);
        const estallidoY=Math.round(playerPosition.y)==Math.round(bomba.y);
        const estallido=estallidoX  && estallidoY
        if (estallido){
           bombasPosition.push(bomba)
            fail()
        }
    });

    game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y)
    
}

function fail(){
    lives--
    if (lives<=0){

        bombasPosition=[]
        mapNumber=0
        lives=3
        timeStart=undefined
        loseGame()
    }

    playerPosition.x=undefined
    playerPosition.y=undefined
    console.log(lives);
    startgame()
}

function showLives(){
    heartsArray=Array(lives).fill(emojis['HEART']);
    console.log(heartsArray);
    spanLives.innerHTML=heartsArray.join("")
}

function showTimePlaying(){
        complete=Date.now()-timeStart
        seconds=Math.floor(complete/1000)
        miliseconds=complete%1000
        spanTime.innerHTML=`${seconds} :${miliseconds}`
}

function winGame(){
    console.log("Terminaste el juego!");
    clearInterval(timeInterval)
    console.log(recordTime);
    playerTime=complete
    if (recordTime!=undefined){
        if (recordTime>playerTime){
            comunicado=
            `You have beated a record  🎉🎉. <br>        
                Your score is =     ${Math.floor(complete/1000)}:${Math.round(complete/1000)}. <br>    
                The previous record was ${Math.floor(recordTime/1000)}:${Math.round(recordTime/1000)}
            `
            localStorage.setItem('record_time',playerTime)
        }
        else{
            comunicado=`
            Your score was =    ${Math.floor(complete/1000)}:${Math.round(complete/1000)}.  <br>       
                The current record is ${Math.floor(recordTime/1000)}:${Math.round(recordTime/1000)} <br>        
                Try again, maybe you'll do it better later`;
        }
    }
    else{
        localStorage.setItem('record_time',playerTime)
        comunicado=`
        You created a new record 🎉🎉  <br>         
        Your score is = ${Math.floor(complete/1000)}:${Math.round(complete/1000)} <br>         
        Now you have to beat it! `
    }

    abrirModal()

    message.innerHTML=comunicado
}

function abrirModal(){
    $('#winGame').modal('toggle')
}
function reloadPage(){
    window.location.reload()
}
function loseGame(){
    $('#failGame').modal('toggle')
}