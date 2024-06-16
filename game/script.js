const car = document.getElementById('car');
const gameContainer = document.querySelector('.game-container');
const containerWidth = gameContainer.offsetWidth;
const containerHeight = gameContainer.offsetHeight;
const carWidth = 100; // Largura do carro após o redimensionamento
const carHeight = 260; // Altura do carro após o redimensionamento
let carX = containerWidth / 2 - carWidth / 2;
let carY = containerHeight / 2 - carHeight / 2;
let keysPressed = {};
let rotationAngle = 0;
let speedX = 0;
let speedY = 0;
const acceleration = 0.2; // Aceleração do carro
const maxSpeed = 8; // Velocidade máxima do carro
const rotationSpeed = 3; // Velocidade de rotação

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keysPressed[key] = true;
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    keysPressed[key] = false;
});

let handbrakeActive = false; // Variável para rastrear se o freio de mão está ativado

// Evento de tecla pressionada para ativar o freio de mão
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === ' ') {
        handbrakeActive = true;
    }
});

// Evento de tecla liberada para desativar o freio de mão
document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();

    if (key === ' ') {
        handbrakeActive = false;
    }
});

function moveCar() {

    // Verificar colisão com os obstáculos
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach((obstacle) => {
        if (collisionWithObstacle(obstacle)) {
            speedX = 0;
            speedY = 0;
        }
    });

    // Aplicar freio de mão se estiver ativado
    if (handbrakeActive) {
        speedX *= 0.9; // Ajuste conforme necessário para a desaceleração do freio de mão
        speedY *= 0.9;
    }

    // Cálculo do módulo da velocidade escalar do carro
    const speedModule = Math.sqrt(speedX * speedX + speedY * speedY);

    // Atualizar o texto do velocímetro
    const velocimetro = document.getElementById('velocimetro');
    velocimetro.textContent = Math.round(speedModule) + " km/h";

    if (keysPressed['w']) {
        speedX += Math.cos((rotationAngle - 90) * (Math.PI / 180)) * acceleration;
        speedY += Math.sin((rotationAngle - 90) * (Math.PI / 180)) * acceleration;
    }
    if (keysPressed['s']) {
        speedX -= Math.cos((rotationAngle - 90) * (Math.PI / 180)) * acceleration * 0.5;
        speedY -= Math.sin((rotationAngle - 90) * (Math.PI / 180)) * acceleration * 0.5;
    }
    if (keysPressed['a']) {
        rotationAngle -= rotationSpeed;
    }
    if (keysPressed['d']) {
        rotationAngle += rotationSpeed;
    }

    // Aplicar desaceleração
    speedX *= 0.98;
    speedY *= 0.98;

    // Limitar a velocidade
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        speedX *= ratio;
        speedY *= ratio;
    }

    // Calcular os limites do carro
    const carLeft = carX;
    const carTop = carY;
    const carRight = carX + carWidth;
    const carBottom = carY + carHeight;

    // Calcular a nova posição do carro
    const newCarX = carX + speedX;
    const newCarY = carY + speedY;

    // Verificar colisão com as bordas da área jogável
    if (
        newCarX >= 0 &&
        newCarX <= containerWidth - carWidth &&
        newCarY >= 0 &&
        newCarY <= containerHeight - carHeight
    ) {
        carX = newCarX;
        carY = newCarY;
    }

    // Atualizar a posição e a rotação do carro
    car.style.left = carX + 'px';
    car.style.top = carY + 'px';
    car.style.transform = `rotate(${rotationAngle}deg)`;
}

setInterval(moveCar, 50);

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === 'r') {
        resetCarPosition();
    } else {
        keysPressed[key] = true;
    }
});

function resetCarPosition() {
    carX = containerWidth / 2 - carWidth / 2;
    carY = containerHeight / 2 - carHeight / 2;
    speedX = 0;
    speedY = 0;
    rotationAngle = 0;
}

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === 'j') {
        const modalToggle = document.getElementById('modal-toggle-2');
        modalToggle.checked = !modalToggle.checked;
    }
});

// Função para gerar obstáculos aleatórios
function generateObstacles() {
    const numObstacles = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Entre 5 e 10 obstáculos

    for (let i = 0; i < numObstacles; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        placeObstacle(obstacle);
        gameContainer.appendChild(obstacle);
    }
}

// Função para posicionar obstáculos de forma aleatória
function placeObstacle(obstacle) {
    const obstacleWidth = 50; // Ajuste conforme necessário
    const obstacleHeight = 50; // Ajuste conforme necessário

    do {
        obstacle.style.left = Math.random() * (containerWidth - obstacleWidth) + 'px';
        obstacle.style.top = Math.random() * (containerHeight - obstacleHeight) + 'px';
    } while (collisionWithCar(obstacle)); // Garante que o obstáculo não está na mesma posição do carro
}

// Função para verificar colisão com o carro
function collisionWithCar(obstacle) {
    const carLeft = carX;
    const carTop = carY;
    const carRight = carX + carWidth;
    const carBottom = carY + carHeight;

    const obstacleLeft = parseInt(obstacle.style.left);
    const obstacleTop = parseInt(obstacle.style.top);
    const obstacleRight = obstacleLeft + obstacle.offsetWidth;
    const obstacleBottom = obstacleTop + obstacle.offsetHeight;

    return (
        carLeft < obstacleRight &&
        carRight > obstacleLeft &&
        carTop < obstacleBottom &&
        carBottom > obstacleTop
    );
}

function collisionWithObstacle(obstacle) {
    const carMargin = 23; // Margem de segurança para o carro
    const obstacleMargin = 23; // Margem de segurança para o obstáculo

    const carLeft = carX + carMargin;
    const carTop = carY + carMargin;
    const carRight = carX + carWidth - carMargin;
    const carBottom = carY + carHeight - carMargin;

    const obstacleLeft = parseInt(obstacle.style.left) + obstacleMargin;
    const obstacleTop = parseInt(obstacle.style.top) + obstacleMargin;
    const obstacleRight = obstacleLeft + obstacle.offsetWidth - obstacleMargin;
    const obstacleBottom = obstacleTop + obstacle.offsetHeight - obstacleMargin;

    return (
        carLeft < obstacleRight &&
        carRight > obstacleLeft &&
        carTop < obstacleBottom &&
        carBottom > obstacleTop
    );
}

// Chamar a função para gerar obstáculos no início do jogo
generateObstacles();
