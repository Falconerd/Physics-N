export class BoxShape {
        width: number;
        height: number;
        mass: number;
        momentOfInertia: number;

        constructor(width: number, height: number, mass: number) {
                this.width = width;
                this.height = height;
                this.mass = mass;
                this.momentOfInertia = this.calculateMomentOfInertia();
        }

        static init(width: number = 0, height: number = 0, mass: number = 0): BoxShape {
                return new BoxShape(width, height, mass);
        }

        calculateMomentOfInertia(): number {
                const m = this.mass;
                const w = this.width;
                const h = this.height;
                return m * (w * w + h * h) / 12;
        }
}
