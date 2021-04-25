import { Vec2 } from './vec2';
import { Particle } from './particle';
import { RigidBody } from './rigid_body';

export class World {
        particles: Particle[] = [];
        rigid_bodies: RigidBody[] = [];
        gravity: number;
        particleForceComputer: ((particle: Particle, gravity: number) => Vec2) | null = null;
        rigidBodyForceComputer: ((rigid_body: RigidBody, gravity: number) => void) | null = null;
        constructor(gravity: number) {
                this.gravity = gravity;
        }
        static init(gravity: number = 9.81): World {
                return new World(gravity);
        }

        step(): void {
                if (this.particles.length > 0) {
                        this.updateParticles();
                }
                if (this.rigid_bodies.length > 0) {
                        this.updateRigidBodies();
                }
        }

        updateParticles(): void {
                if (!this.particleForceComputer) return;
                for (const particle of this.particles) {
                        const force = this.particleForceComputer(particle, this.gravity);
                        const acceleration = Vec2.init(force.x / particle.mass, force.y / particle.mass);
                        particle.vel.x += acceleration.x;
                        particle.vel.y += acceleration.y;
                        particle.pos.x += particle.vel.x;
                        particle.pos.y += particle.vel.y;
                }
        }

        updateRigidBodies(): void {
                if (!this.rigidBodyForceComputer) return;
                for (const rigid_body of this.rigid_bodies) {
                        this.rigidBodyForceComputer(rigid_body, 0); // Gravity omitted for now
                        const linear_acceleration = Vec2.init(rigid_body.force.x / rigid_body.shape.mass, rigid_body.force.y / rigid_body.shape.mass);
                        rigid_body.velocity.x += linear_acceleration.x;
                        rigid_body.velocity.y += linear_acceleration.y;
                        rigid_body.position.x += rigid_body.velocity.x;
                        rigid_body.position.y += rigid_body.velocity.y;
                        const angular_acceleration = rigid_body.torque / rigid_body.shape.momentOfInertia;
                        rigid_body.angular_velocity += angular_acceleration;
                        rigid_body.angle += rigid_body.angular_velocity;
                }
        }
}

