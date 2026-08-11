'use client';

import { useEffect, useRef } from 'react';

/**
 * Capa de partículas riso (dos tintas, mezcla multiply).
 *
 * Vive aquí y no dentro de la página pública porque el editor la usa también:
 * si el preview y la página publicada no comparten este componente, el usuario
 * elige animaciones que no puede ver.
 */

/** Mapea los ids de animación del editor a los tres tipos de partícula que dibujamos. */
export function animToKind(anim: string): string {
    if (anim === 'hearts-falling' || anim === 'float-up' || anim === 'bubbles' || anim === 'particles') return 'hearts';
    if (anim === 'confetti' || anim === 'fireworks') return 'confetti';
    if (anim === 'petals' || anim === 'snow') return 'petals';
    return 'hearts';
}

/** ¿Esta animación dibuja partículas? 'none' y 'fade-in' no. */
export function hasParticles(anim?: string | null): boolean {
    return Boolean(anim && anim !== 'none' && anim !== 'fade-in');
}

export function ParticleCanvas({ kind = 'hearts', density = 1 }: { kind?: string; density?: number }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        let raf: number;
        let particles: any[] = [];
        let w = 0, h = 0;

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            w = r.width; h = r.height;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const heartPath = (cx: number, cy: number, s: number) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy + s * 0.3);
            ctx.bezierCurveTo(cx, cy, cx - s, cy, cx - s, cy + s * 0.3);
            ctx.bezierCurveTo(cx - s, cy + s * 0.7, cx, cy + s * 0.9, cx, cy + s * 1.2);
            ctx.bezierCurveTo(cx, cy + s * 0.9, cx + s, cy + s * 0.7, cx + s, cy + s * 0.3);
            ctx.bezierCurveTo(cx + s, cy, cx, cy, cx, cy + s * 0.3);
            ctx.fill();
        };

        const readInks = () => {
            const cs = getComputedStyle(document.documentElement);
            return [
                cs.getPropertyValue('--ink-red').trim() || '#e8378a',
                cs.getPropertyValue('--ink-blue').trim() || '#1a1410',
            ];
        };

        const spawn = () => {
            const inks = readInks();
            const p: any = {
                x: Math.random() * w, y: -10,
                vx: (Math.random() - 0.5) * 0.6,
                vy: 0.6 + Math.random() * 1.2,
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.04,
                life: 0,
                size: 10 + Math.random() * 16,
                color: Math.random() < 0.6 ? inks[0] : inks[1],
                kind,
            };
            if (kind === 'confetti') p.size = 8 + Math.random() * 8;
            if (kind === 'petals') { p.size = 11 + Math.random() * 10; p.vy = 0.3 + Math.random() * 0.6; }
            particles.push(p);
        };

        let last = performance.now();
        let acc = 0;
        const target = 28 * density;

        const tick = (t: number) => {
            const dt = Math.min(50, t - last); last = t;
            acc += dt;
            while (particles.length < target && acc > 30) { spawn(); acc -= 30; }
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'multiply';
            particles = particles.filter(p => {
                p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life += dt;
                if (p.kind === 'petals') p.x += Math.sin(p.life / 600) * 0.6;
                if (p.kind === 'confetti') p.vy += 0.005;
                const alive = p.y < h + 30 && p.x > -30 && p.x < w + 30;
                if (!alive) return false;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.78;
                if (p.kind === 'hearts') heartPath(0, -p.size / 2, p.size / 2);
                else if (p.kind === 'confetti') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                else if (p.kind === 'petals') {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
                return true;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [kind, density]);

    return (
        <canvas
            ref={ref}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'multiply', zIndex: 2 }}
        />
    );
}

export default ParticleCanvas;
