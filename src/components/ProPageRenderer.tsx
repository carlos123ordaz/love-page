'use client';

import { useEffect, useRef, useState } from 'react';
import { fleeDelta, clampDelta } from '@/lib/escape-button';

interface ProPageRendererProps {
    html: string;
    css: string;
    noButtonEscapes: boolean;
    onYesClick: () => void;
    onNoClick: () => void;
}

export function ProPageRenderer({ html, css, noButtonEscapes, onYesClick, onNoClick }: ProPageRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Usar refs para las callbacks para evitar re-ejecución del useEffect principal
    const onYesClickRef = useRef(onYesClick);
    const onNoClickRef = useRef(onNoClick);

    useEffect(() => {
        onYesClickRef.current = onYesClick;
    }, [onYesClick]);

    useEffect(() => {
        onNoClickRef.current = onNoClick;
    }, [onNoClick]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        // Limpiar contenido previo antes de inyectar
        containerRef.current.innerHTML = '';

        // Inyectar CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        containerRef.current.appendChild(styleElement);

        // Inyectar HTML (sin scripts primero)
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = html;
        containerRef.current.appendChild(contentDiv);

        // ============================================
        // EJECUTAR SCRIPTS MANUALMENTE
        // innerHTML NO ejecuta <script> tags por seguridad del navegador.
        // Necesitamos extraerlos y re-crearlos como elementos nuevos.
        // ============================================
        const scripts = contentDiv.querySelectorAll('script');
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');

            // Copiar atributos (src, type, etc.)
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copiar contenido inline del script
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }

            // Reemplazar el viejo script con el nuevo (esto lo ejecuta)
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        // Agregar event listeners a los botones
        const yesButton = containerRef.current.querySelector('#yes-button');
        const noButton = containerRef.current.querySelector('#no-button');

        const container = containerRef.current;
        const handleYesClick = () => onYesClickRef.current();

        // Mientras el botón huye, el click no debe registrar respuesta: antes
        // se apuntaba el "no" igualmente, así que bastaba con alcanzarlo una vez.
        const handleNoClick = (e: Event) => {
            if (noButtonEscapes) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            onNoClickRef.current();
        };

        if (yesButton) yesButton.addEventListener('click', handleYesClick);
        if (noButton) noButton.addEventListener('click', handleNoClick);

        if (!noButton || !noButtonEscapes || !container) {
            return () => {
                if (yesButton) yesButton.removeEventListener('click', handleYesClick);
                if (noButton) noButton.removeEventListener('click', handleNoClick);
            };
        }

        const button = noButton as HTMLElement;
        // Se desplaza con transform en vez de conmutar a position:absolute, que
        // rompía la maquetación de la plantilla.
        let tx = 0;
        let ty = 0;
        button.style.transition = 'transform 180ms cubic-bezier(.2,.9,.3,1.1)';
        button.style.touchAction = 'manipulation';

        // Posición natural en coordenadas de página, para poder calcular siempre
        // la posición *de destino*: `getBoundingClientRect()` durante la
        // transición devuelve la intermedia, y acotar contra ella dejaba que
        // cada movimiento del ratón se pasara del límite.
        let home: { left: number; top: number } | null = null;
        const measureHome = () => {
            const r = button.getBoundingClientRect();
            home = { left: r.left + window.scrollX - tx, top: r.top + window.scrollY - ty };
        };
        measureHome();

        const targetRect = () => {
            if (!home) return null;
            const r = button.getBoundingClientRect();
            return {
                left: home.left - window.scrollX + tx,
                top: home.top - window.scrollY + ty,
                width: r.width,
                height: r.height,
            };
        };

        const flee = (pointerX: number, pointerY: number, force: boolean) => {
            const target = targetRect();
            if (!target) return;
            const delta = fleeDelta({
                btn: target,
                container: container.getBoundingClientRect(),
                pointerX,
                pointerY,
                force,
            });
            if (!delta) return;
            tx += delta.dx;
            ty += delta.dy;
            button.style.transform = `translate(${tx}px, ${ty}px)`;
        };

        // `pointermove` cubre ratón, dedo y lápiz; el `mousemove` anterior no
        // llegaba a existir en táctil, donde el botón nunca se apartaba.
        const onPointerMove = (e: PointerEvent) => flee(e.clientX, e.clientY, false);
        // El toque va directo al click: apartarlo en pointerdown y cancelar.
        const onPointerDown = (e: PointerEvent) => {
            e.preventDefault();
            flee(e.clientX, e.clientY, true);
        };

        // Girar el móvil no debe dejar el botón fuera de la pantalla.
        const onResize = () => {
            measureHome();
            const target = targetRect();
            if (!target) return;
            const delta = clampDelta({
                btn: target,
                container: container.getBoundingClientRect(),
            });
            if (!delta) return;
            tx += delta.dx;
            ty += delta.dy;
            button.style.transform = `translate(${tx}px, ${ty}px)`;
        };

        container.addEventListener('pointermove', onPointerMove, { passive: true });
        button.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('resize', onResize);

        return () => {
            container.removeEventListener('pointermove', onPointerMove);
            button.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', onResize);
            if (yesButton) yesButton.removeEventListener('click', handleYesClick);
            button.removeEventListener('click', handleNoClick);
        };
    }, [mounted, html, css, noButtonEscapes]);

    return (
        <div
            ref={containerRef}
            className="pro-page-container"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        />
    );
}