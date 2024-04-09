const canvas = document.querySelector('canvas');

canvas.width = 500;
canvas.height = 450;

const ctx = canvas.getContext('2d');

const score = {
    left: 0,
    right: 0,
}

const getPddle = ({x = 0, color = 'orange'}) =>({
    x, //POSICION EN X
    y: 0, //POSICION EN Y
    w: 10, //ANCHO
    h: 30, //ALTO
    color, //COLOR
    speed: 20,
    draw(){//METODO PARA DIBUJAR LA PALA
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    },
    moveUp(){
        if(this.y < 1){ return };
        this.y -= this.speed;
    },
    moveDown(){
        if(this.y > canvas.height - this.h - 1){ return };
        this.y += this.speed;
    },
    contains(b){//b representa la pelota
        return (this.x < b.x + b.w) &&
                (this.x + this.w > b.x) &&
                (this.y < b.y + b.h) &&
                (this.y + this.h > b.y)
    }
});

const getBall = () =>({
    x: canvas.width / 2, //POSICION EN X
    y: canvas.height / 2, //POSICION EN Y
    w: 10, //ANCHO
    h: 10, //ALTO
    color: 'blue',//COLOR
    directionX: 'right',//DDIRECCION POR DEFAULT
    directionY: 'up',
    friccion: .6,
    speedX: 1,
    speedY: 1,
    isMoving: false,
    handdleMovement(){
        if(!this.isMoving){ return }
        //0. izquierda y derecha
        if(this.x < 0){
            this.directionX = 'right';
        }else if(this.x > canvas.width - this.w){
            this.directionX = 'left';
        }

        if(this.directionX === 'right'){
            this.speedX++;
        }else{
            this.speedX--;
        }
        this.speedX *= this.friccion;
        this.x += this.speedX;
        //1. piso y techo
        if(this.y < 0){
            this.directionY = 'down';
        }else if(this.y > canvas.height - this.h){
            this.directionY = 'up';
        }

        if(this.directionY === 'down'){
            this.speedY++;
        }else{
            this.speedY--;
        }

        this.speedY *= this.friccion;
        this.y += this.speedY;
    },
    draw(){//METODO PARA DU¿IBUJAR LA PELOTA
        this.handdleMovement()
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
});

const ball = getBall();//GUARDA A LA FUNCION GETPADDLE
ball.draw()//PINTA LA PELOTA

const padleLefth = getPddle({});//GUARDA A LA FUNCION GETPADDLE
const padleRigth = getPddle({//GUARDA A LA FUNCION GETPADDLE
    x: canvas.width - 10,
    color: 'red',
});


const upddate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//LIMPIA EL CANAVAS PARA NO SOBREESCRIBIR A LA PELOTA
    drawCurt();
    drawSore();
    ball.draw();
    padleLefth.draw();//PINTA LA TABLA IZQUIERADA
    padleRigth.draw()//PINTA LA TABLA DERECHA
    checkColitions();
    requestAnimationFrame(upddate);
}

//AUX FUNCTONS
const drawCurt = () => {//fucion para dibujar la cancha
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(0,0, canvas.width, canvas.height);  //dibuja un  ordde al canvas

    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI, false);
    ctx.closePath()
}

const checkColitions = () =>{//cambia la direccion de la pelota si choca con una pala
    if(padleLefth.contains(ball)){
        ball.directionX = 'right';
    }else if(padleRigth.contains(ball)){
        ball.directionX = 'left';
    }

    if(ball.x < 0){
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.isMoving = false;
        score.right ++;
    }else if(ball.x > canvas.width - ball.w){
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.isMoving = false;
        score.left ++;
    }
}

const drawSore = () =>{
    ctx.fillStyle = 'purple';
    ctx.font = '34px Pixelify Sans, sans-serif'
    ctx.fillText(score.left, 120, 70);
    ctx.fillText(score.right, 360, 70)
}

//LISTENERS

addEventListener('keydown', e =>{
    console.log(e.keyCode);
    switch(e.keyCode){
        case 32:
            ball.isMoving = true;
        break;

        case 38: //UP
            padleRigth.moveUp();
            padleLefth.moveUp();
        break;

        case 40: //DOWN
            padleRigth.moveDown();
            padleLefth.moveDown();
        break;
    }
})

requestAnimationFrame(upddate);
