/* eslint no-restricted-globals: ["off"] */
export default class MoveController {
    constructor(camera, canvas) {
        this.viewMatrix = this.getViewMatrix(camera);
        this.activeKeys = [];
        this.initEventListeners(canvas);
    }

    getViewMatrix(camera) {
        const R = camera.rotation.flat();
        const t = camera.position;
        const camToWorld = [
            [R[0], R[1], R[2], 0],
            [R[3], R[4], R[5], 0],
            [R[6], R[7], R[8], 0],
            [
                -t[0] * R[0] - t[1] * R[3] - t[2] * R[6],
                -t[0] * R[1] - t[1] * R[4] - t[2] * R[7],
                -t[0] * R[2] - t[1] * R[5] - t[2] * R[8],
                1,
            ],
        ].flat();
        return camToWorld;
    }

    initEventListeners(canvas) {
        window.addEventListener("keydown", (e) => {
            if (!this.activeKeys.includes(e.code)) this.activeKeys.push(e.code);
        });

        window.addEventListener("keyup", (e) => {
            this.activeKeys = this.activeKeys.filter((k) => k !== e.code);
        });

        window.addEventListener("blur", () => {
            this.activeKeys = [];
        });

        window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        window.addEventListener("wheel", (e) => this.handleWheel(e));

        let startX, startY, down;
        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            down = e.ctrlKey || e.metaKey ? 2 : 1;
        });
        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            down = 2;
        });
        canvas.addEventListener("mousemove", (e) => {
            e.preventDefault();
            if (down == 1) {
                let inv = this.invert4(this.viewMatrix);
                let dx = (5 * (e.clientX - startX)) / innerWidth;
                let dy = (5 * (e.clientY - startY)) / innerHeight;
                let d = 4;

                inv = this.translate4(inv, 0, 0, d);
                inv = this.rotate4(inv, dx, 0, 1, 0);
                inv = this.rotate4(inv, -dy, 1, 0, 0);
                inv = this.translate4(inv, 0, 0, -d);

                this.viewMatrix = this.invert4(inv);

                startX = e.clientX;
                startY = e.clientY;
            } else if (down == 2) {
                let inv = this.invert4(this.viewMatrix);
                inv = this.translate4(
                    inv,
                    (-10 * (e.clientX - startX)) / innerWidth,
                    0,
                    (10 * (e.clientY - startY)) / innerHeight,
                );
                this.viewMatrix = this.invert4(inv);

                startX = e.clientX;
                startY = e.clientY;
            }
        });
        canvas.addEventListener("mouseup", (e) => {
            e.preventDefault();
            down = false;
            startX = 0;
            startY = 0;
        });
    }

    handleMouseMove(event) {
        // Implement mouse move handling logic here
    }

    handleWheel(event) {
        // Implement mouse wheel handling logic here
    }

    update() {
        let inv = this.invert4(this.viewMatrix);
        if (this.activeKeys.includes("ArrowUp")) {
            inv = this.translate4(inv, 0, 0, 0.1);
        }
        if (this.activeKeys.includes("ArrowDown")) {
            inv = this.translate4(inv, 0, 0, -0.1);
        }
        if (this.activeKeys.includes("ArrowLeft")) {
            inv = this.translate4(inv, -0.03, 0, 0);
        }
        if (this.activeKeys.includes("ArrowRight")) {
            inv = this.translate4(inv, 0.03, 0, 0);
        }
        if (this.activeKeys.includes("KeyA")) {
            inv = this.rotate4(inv, -0.01, 0, 1, 0);
        }
        if (this.activeKeys.includes("KeyD")) {
            inv = this.rotate4(inv, 0.01, 0, 1, 0);
        }
        if (this.activeKeys.includes("KeyQ")) {
            inv = this.rotate4(inv, 0.01, 0, 0, 1);
        }
        if (this.activeKeys.includes("KeyE")) {
            inv = this.rotate4(inv, -0.01, 0, 0, 1);
        }
        if (this.activeKeys.includes("KeyW")) {
            inv = this.rotate4(inv, 0.005, 1, 0, 0);
        }
        if (this.activeKeys.includes("KeyS")) {
            inv = this.rotate4(inv, -0.005, 1, 0, 0);
        }

        this.viewMatrix = this.invert4(inv);
    }

    translate4(a, x, y, z) {
        return [
            ...a.slice(0, 12),
            a[0] * x + a[4] * y + a[8] * z + a[12],
            a[1] * x + a[5] * y + a[9] * z + a[13],
            a[2] * x + a[6] * y + a[10] * z + a[14],
            a[3] * x + a[7] * y + a[11] * z + a[15],
        ];
    }

    rotate4(a, rad, x, y, z) {
        let len = Math.hypot(x, y, z);
        x /= len;
        y /= len;
        z /= len;
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let t = 1 - c;
        let b00 = x * x * t + c;
        let b01 = y * x * t + z * s;
        let b02 = z * x * t - y * s;
        let b10 = x * y * t - z * s;
        let b11 = y * y * t + c;
        let b12 = z * y * t + x * s;
        let b20 = x * z * t + y * s;
        let b21 = y * z * t - x * s;
        let b22 = z * z * t + c;
        return [
            a[0] * b00 + a[4] * b01 + a[8] * b02,
            a[1] * b00 + a[5] * b01 + a[9] * b02,
            a[2] * b00 + a[6] * b01 + a[10] * b02,
            a[3] * b00 + a[7] * b01 + a[11] * b02,
            a[0] * b10 + a[4] * b11 + a[8] * b12,
            a[1] * b10 + a[5] * b11 + a[9] * b12,
            a[2] * b10 + a[6] * b11 + a[10] * b12,
            a[3] * b10 + a[7] * b11 + a[11] * b12,
            a[0] * b20 + a[4] * b21 + a[8] * b22,
            a[1] * b20 + a[5] * b21 + a[9] * b22,
            a[2] * b20 + a[6] * b21 + a[10] * b22,
            a[3] * b20 + a[7] * b21 + a[11] * b22,
            ...a.slice(12, 16),
        ];
    }

    invert4(a) {
        let b00 = a[0] * a[5] - a[1] * a[4];
        let b01 = a[0] * a[6] - a[2] * a[4];
        let b02 = a[0] * a[7] - a[3] * a[4];
        let b03 = a[1] * a[6] - a[2] * a[5];
        let b04 = a[1] * a[7] - a[3] * a[5];
        let b05 = a[2] * a[7] - a[3] * a[6];
        let b06 = a[8] * a[13] - a[9] * a[12];
        let b07 = a[8] * a[14] - a[10] * a[12];
        let b08 = a[8] * a[15] - a[11] * a[12];
        let b09 = a[9] * a[14] - a[10] * a[13];
        let b10 = a[9] * a[15] - a[11] * a[13];
        let b11 = a[10] * a[15] - a[11] * a[14];
        let det =
            b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        return [
            (a[5] * b11 - a[6] * b10 + a[7] * b09) / det,
            (a[2] * b10 - a[1] * b11 - a[3] * b09) / det,
            (a[13] * b05 - a[14] * b04 + a[15] * b03) / det,
            (a[10] * b04 - a[9] * b05 - a[11] * b03) / det,
            (a[6] * b08 - a[4] * b11 - a[7] * b07) / det,
            (a[0] * b11 - a[2] * b08 + a[3] * b07) / det,
            (a[14] * b02 - a[12] * b05 - a[15] * b01) / det,
            (a[8] * b05 - a[10] * b02 + a[11] * b01) / det,
            (a[4] * b10 - a[5] * b08 + a[7] * b06) / det,
            (a[1] * b08 - a[0] * b10 - a[3] * b06) / det,
            (a[12] * b04 - a[13] * b02 + a[15] * b00) / det,
            (a[9] * b02 - a[8] * b04 - a[11] * b00) / det,
            (a[5] * b07 - a[4] * b09 - a[6] * b06) / det,
            (a[0] * b09 - a[1] * b07 + a[2] * b06) / det,
            (a[13] * b01 - a[12] * b03 - a[14] * b00) / det,
            (a[8] * b03 - a[9] * b01 + a[10] * b00) / det,
        ];
    }
}
