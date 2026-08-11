/**
 * Lógica de huida del botón "No".
 *
 * La versión anterior saltaba a una posición aleatoria: `Math.random() - 0.5`
 * podía devolver casi cero, así que a menudo el botón se movía un pelo y seguía
 * debajo del cursor. Aquí la huida es direccional — se aleja del puntero con una
 * distancia mínima garantizada — y siempre dentro del contenedor.
 */

/** A qué distancia del puntero empieza a apartarse. */
export const FLEE_RADIUS = 130;

function clamp(v: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, v));
}

export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface FleeOptions {
    /**
     * Rectángulo *de destino* del botón, en coordenadas de viewport.
     *
     * Importa que sea el destino y no el que devuelve `getBoundingClientRect()`
     * mientras la transición corre: ese va retrasado, y acotar contra él dejaba
     * que cada movimiento del ratón se pasara un poco del límite. Con el ratón
     * generando decenas de eventos por segundo, ese error se acumulaba hasta
     * sacar el botón de la pantalla.
     */
    btn: Rect;
    /** Límites dentro de los que puede moverse, en coordenadas de viewport. */
    container: Bounds;
    pointerX: number;
    pointerY: number;
    /** Huir aunque el puntero esté lejos (toque directo, foco de teclado). */
    force?: boolean;
    radius?: number;
    margin?: number;
    /**
     * Zona visible. Por defecto la ventana. El contenedor de la carta mide
     * `min-height: 100vh` más el contenido, así que acotar sólo a él permitía
     * empujar el botón por debajo del pliegue y perderlo de vista.
     */
    viewport?: Bounds;
}

function visibleBounds(container: Bounds, viewport?: Bounds): Bounds {
    const vp = viewport ?? (typeof window !== 'undefined'
        ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
        : { left: container.left, top: container.top, right: container.right, bottom: container.bottom });

    return {
        left: Math.max(container.left, vp.left),
        top: Math.max(container.top, vp.top),
        right: Math.min(container.right, vp.right),
        bottom: Math.min(container.bottom, vp.bottom),
    };
}

/**
 * Desplazamiento que hay que aplicar al botón para apartarlo del puntero.
 * Devuelve null si el puntero todavía está lejos y no hace falta moverse.
 */
export function fleeDelta({
    btn,
    container,
    pointerX,
    pointerY,
    force = false,
    radius = FLEE_RADIUS,
    margin = 12,
    viewport,
}: FleeOptions): { dx: number; dy: number } | null {
    const cx = btn.left + btn.width / 2;
    const cy = btn.top + btn.height / 2;

    let vx = cx - pointerX;
    let vy = cy - pointerY;
    const dist = Math.hypot(vx, vy);

    if (!force && dist > radius) return null;

    if (dist < 1) {
        // Puntero justo en el centro: cualquier dirección sirve.
        vx = 1;
        vy = 0;
    } else {
        vx /= dist;
        vy /= dist;
    }

    // Salto proporcional al botón, con un mínimo para que no quede al alcance.
    const jump = Math.max(btn.width, 120) * 0.9 + 80;

    // Dentro del contenedor y, sobre todo, dentro de lo que se ve.
    const bounds = visibleBounds(container, viewport);
    const minLeft = bounds.left + margin;
    const maxLeft = bounds.right - btn.width - margin;
    const minTop = bounds.top + margin;
    const maxTop = bounds.bottom - btn.height - margin;

    let nextLeft = btn.left + vx * jump;
    let nextTop = btn.top + vy * jump;

    // Contra un borde, huir hacia el lado contrario en vez de quedarse pegado
    // ahí (que es donde el cursor lo acorralaba).
    if (nextLeft < minLeft || nextLeft > maxLeft) nextLeft = btn.left - vx * jump;
    if (nextTop < minTop || nextTop > maxTop) nextTop = btn.top - vy * jump;

    // Si no cabe en la zona visible, se centra en ella en vez de asomar por un lado.
    nextLeft = maxLeft < minLeft
        ? (bounds.left + bounds.right - btn.width) / 2
        : clamp(nextLeft, minLeft, maxLeft);
    nextTop = maxTop < minTop
        ? (bounds.top + bounds.bottom - btn.height) / 2
        : clamp(nextTop, minTop, maxTop);

    return { dx: nextLeft - btn.left, dy: nextTop - btn.top };
}

/**
 * Desplazamiento mínimo para devolver el botón a la zona visible, sin huir.
 * Hace falta cuando la ventana cambia de tamaño (girar el móvil) después de
 * que el botón ya se haya apartado. Devuelve null si ya está a la vista.
 */
export function clampDelta({
    btn,
    container,
    margin = 12,
    viewport,
}: Pick<FleeOptions, 'btn' | 'container' | 'margin' | 'viewport'>): { dx: number; dy: number } | null {
    const bounds = visibleBounds(container, viewport);
    const minLeft = bounds.left + margin;
    const maxLeft = bounds.right - btn.width - margin;
    const minTop = bounds.top + margin;
    const maxTop = bounds.bottom - btn.height - margin;

    const left = maxLeft < minLeft
        ? (bounds.left + bounds.right - btn.width) / 2
        : clamp(btn.left, minLeft, maxLeft);
    const top = maxTop < minTop
        ? (bounds.top + bounds.bottom - btn.height) / 2
        : clamp(btn.top, minTop, maxTop);

    const dx = left - btn.left;
    const dy = top - btn.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return null;
    return { dx, dy };
}
