// src/components/movement.js

class MovementHandler {
    constructor(element) {
        this.element = element;
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.activeKeys = [];
        this.currentCameraIndex = 0;

        this.init();
    }

    init() {
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.centerX}px`;
        this.element.style.top = `${this.centerY}px`;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleKeyDown(event) {
        const step = 10;
        if (!this.activeKeys.includes(event.code)) this.activeKeys.push(event.code);

        switch (event.key) {
            case 'ArrowUp':
                this.element.style.top = `${this.element.offsetTop - step}px`;
                break;
            case 'ArrowDown':
                this.element.style.top = `${this.element.offsetTop + step}px`;
                break;
            case 'ArrowLeft':
                this.element.style.left = `${this.element.offsetLeft - step}px`;
                break;
            case 'ArrowRight':
                this.element.style.left = `${this.element.offsetLeft + step}px`;
                break;
            default:
                break;
        }
    }

    handleKeyUp(event) {
        this.activeKeys = this.activeKeys.filter((key) => key !== event.code);
    }

    handleMouseMove(event) {
        const deltaX = event.clientX - this.centerX;
        this.element.style.left = `${this.centerX + deltaX}px`;
    }
}

export default MovementHandler;
