export class Vec2 {
        x: number;
        y: number;

        constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
        }

        static init(x: number = 0, y: number = 0): Vec2 {
                return new Vec2(x, y);
        }

        static zero(): Vec2 {
                return Vec2.init(0, 0);
        }

        add(v: Vec2): Vec2 {
                return Vec2.init(this.x + v.x, this.y + v.y);
        }

        sub(v: Vec2): Vec2 {
                return Vec2.init(this.x - v.x, this.y - v.y);
        }

        mul(v: Vec2): Vec2 {
                return Vec2.init(this.x * v.x, this.y * v.y);
        }

        sqrdist(v: Vec2): number {
                const x = v.x - this.x;
                const y = v.y - this.y;
                return x * x + y * y;
        }

        dist(v: Vec2): number {
                return Math.sqrt(this.sqrdist(v));
        }

        mutableSet(v: Vec2): Vec2 {
                this.x = v.x;
                this.y = v.y;
                return this;
        }

        angle(v: Vec2): number {
                return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
        }

        angle2(a: Vec2, b: Vec2): number {
                return a.sub(this).angle(b.sub(this));
        }

        rotate(origin: Vec2, theta: number): Vec2 {
                const x = this.x - origin.x;
                const y = this.y - origin.y;
                return Vec2.init(y * Math.cos(theta) - y * Math.sin(theta) + origin.x, x * Math.sin(theta) + y * Math.cos(theta) + origin.y);
        }
}

