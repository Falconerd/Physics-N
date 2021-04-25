import './style.css'
import { Vec2 } from './vec2';
import { Particle } from './particle';
import { BoxShape } from './shapes';
import { RigidBody } from './rigid_body';
import { World } from './world';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext("2d")!;

const WIDTH = 720;
const HEIGHT = 480;

const PARTICLE_DRAW_RADIUS = 3;
const BACKGROUND_COLOR = '#383c44';
const TEXT_COLOR = 'white'

canvas.width = WIDTH;
canvas.style.width = WIDTH + 'px';
canvas.height = HEIGHT;
canvas.style.height = HEIGHT + 'px';

// Particle example force function
function computeForce(particle: Particle, gravity: number): Vec2 {
        const gravity_result = Vec2.init(0, particle.mass * gravity);
        const wind = Vec2.init(particle.mass * -1, 0);
        return gravity_result.add(wind);
}

// RigidBody example force + torque function
function computeForceAndTorque(rigid_body: RigidBody, gravity: number): void {
        const force = Vec2.init(-Math.sin(Date.now()), Math.sin(Date.now()));
        rigid_body.force = force;
        // r is the 'arm vector' that goes from center of mass to point of application
        const r = Vec2.init(rigid_body.shape.width / 2, rigid_body.torque);
        rigid_body.torque = r.x * force.y - r.y * force.x;
}


// Initialise any variables
const world = World.init();
const time = {
        MS_PER_UPDATE: 50, // 1000 / MS_PER_UPDATE updates per second
        previous: Date.now(),
        lag: 0
}

// Initialise objects, assign functions
// world.particles.push(Particle.init(WIDTH / 2, HEIGHT / 8, 1.2));
// world.particleForceComputer = computeForce;
world.rigidBodyForceComputer = computeForceAndTorque;
world.rigid_bodies.push(RigidBody.init(Vec2.init(Math.random() * WIDTH / 2 + WIDTH / 4, Math.random() * HEIGHT / 2 + HEIGHT / 4), 0, 0, BoxShape.init(100, 100, 1)));
world.rigid_bodies.push(RigidBody.init(Vec2.init(Math.random() * WIDTH / 2 + WIDTH / 4, Math.random() * HEIGHT / 2 + HEIGHT / 4), 0, 0, BoxShape.init(100, 100, 1)));
world.rigid_bodies.push(RigidBody.init(Vec2.init(Math.random() * WIDTH / 2 + WIDTH / 4, Math.random() * HEIGHT / 2 + HEIGHT / 4), 0, 0, BoxShape.init(100, 100, 1)));

// Update and render everything
function update(): void {
        const time_now = Date.now();
        const delta_time = time_now - time.previous;
        time.previous = time_now;
        time.lag += delta_time;

        while (time.lag >= time.MS_PER_UPDATE) {
                world.step();
                time.lag -= time.MS_PER_UPDATE;
        }

        render(time.lag / time.MS_PER_UPDATE);

        requestAnimationFrame(update);
}

function render(alpha: number): void {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = TEXT_COLOR;
        renderParticles(world.particles, alpha);
        renderRigidBodies(world.rigid_bodies, alpha);
        renderDebug();
}

function renderParticles(particles: Particle[], alpha: number): void {
        for (const particle of particles) {
                ctx.beginPath();
                ctx.arc(particle.pos.x + (particle.vel.x * alpha), particle.pos.y + (particle.vel.y * alpha), PARTICLE_DRAW_RADIUS, 0, 2 * Math.PI);
                ctx.fill();
        }
}

function renderRigidBodies(rigid_bodies: RigidBody[], alpha: number): void {
        for (const rigid_body of rigid_bodies) {
                const centroid = Vec2.init(rigid_body.position.x + (rigid_body.velocity.x * alpha), rigid_body.position.y + (rigid_body.velocity.y * alpha));
                // simulate wrap around
                centroid.x %= WIDTH;
                centroid.y %= HEIGHT;
                if (centroid.x < 0) {
                        centroid.x += WIDTH;
                }
                if (centroid.y < 0) {
                        centroid.y += HEIGHT;
                }
                const width = rigid_body.shape.width;
                const height = rigid_body.shape.height;
                ctx.save();
                ctx.translate(centroid.x, centroid.y);
                ctx.rotate(rigid_body.angle);
                ctx.strokeRect(-(width / 2), -(height / 2), width, height);
                ctx.restore();
        }
}

function renderDebug(): void {
        const rigid_body = world.rigid_bodies[0];
        ctx.font = "14px monospace";
        ctx.fillText(`position: ${rigid_body.position.x.toFixed(2)}, ${rigid_body.position.y.toFixed(2)}`, 8, 16);
        ctx.fillText(`velocity: ${rigid_body.velocity.x.toFixed(2)}, ${rigid_body.velocity.y.toFixed(2)}`, 8, 32);
        ctx.fillText(`angle: ${rigid_body.angle.toFixed(2)}`, 8, 48);
        ctx.fillText(`angular_velocity: ${rigid_body.angular_velocity.toFixed(2)}`, 8, 64);
        ctx.fillText(`torque: ${rigid_body.torque.toFixed(2)}`, 8, 80);
        ctx.fillText(`force: ${rigid_body.force.x.toFixed(2)}, ${rigid_body.force.y.toFixed(2)}`, 8, 96);
}

// bind event listeners
canvas.addEventListener('mousedown', () => {
        world.step(1);
        console.log(world.particles);
});

// Run the simulation
update();
