import { Vec2 } from './vec2';

export class Particle {
        pos: Vec2;
        vel: Vec2;
        mass: number;
        constructor(x: number, y: number, mass: number) {
                this.pos = Vec2.init(x, y);
                this.vel = Vec2.zero();
                this.mass = mass;
        }
        static init(x: number = 0, y: number = 0, mass: number = 1): Particle {
                return new Particle(x, y, mass);
        }
}
