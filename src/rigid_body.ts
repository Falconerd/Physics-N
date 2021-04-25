import { Vec2 } from './vec2';
import { BoxShape } from './shapes'

export class RigidBody {
        position: Vec2;
        velocity: Vec2 = Vec2.zero();
        angle: number;
        angular_velocity: number;
        force: Vec2 = Vec2.zero();
        torque: number = 0;
        shape: BoxShape;
        constructor(position: Vec2, angle: number, angularVelocity: number, shape: BoxShape) {
                this.position = position;
                this.angle = angle;
                this.angular_velocity = angularVelocity;
                this.shape = shape;
        }
        static init(position: Vec2, angle: number, angularVelocity: number, shape: BoxShape): RigidBody {
                return new RigidBody(position, angle, angularVelocity, shape);
        }
}
