'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fundido de entrada entre rutas.
 *
 * App Router vuelve a montar `template.tsx` en cada navegación, así que basta
 * con animar la entrada aquí para suavizar todos los saltos de la app.
 *
 * Sólo se anima la opacidad, a propósito: un `transform` activo convierte el
 * elemento en el bloque contenedor de sus descendientes `position: fixed`, y
 * el editor tiene barra inferior fija en móvil, modales y toasts que se
 * descolocarían mientras dura la animación.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion();

    if (reduce) return <>{children}</>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    );
}
