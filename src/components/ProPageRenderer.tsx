'use client';

import { useEffect, useRef, useState } from 'react';

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

        const handleYesClick = () => onYesClickRef.current();
        const handleNoClick = () => onNoClickRef.current();

        if (yesButton) {
            yesButton.addEventListener('click', handleYesClick);
        }

        if (noButton) {
            noButton.addEventListener('click', handleNoClick);

            // Si el botón "No" debe escapar
            if (noButtonEscapes) {
                let isEscaping = false;

                const handleMouseMove = (e: MouseEvent) => {
                    if (isEscaping) return;

                    const button = noButton as HTMLElement;
                    const rect = button.getBoundingClientRect();
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;

                    // Calcular distancia del cursor al botón
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distanceX = mouseX - centerX;
                    const distanceY = mouseY - centerY;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                    // Si el cursor está cerca (dentro de 100px), mover el botón
                    if (distance < 100) {
                        isEscaping = true;

                        // Calcular nueva posición aleatoria
                        const container = button.parentElement;
                        if (container) {
                            const containerRect = container.getBoundingClientRect();
                            const maxX = containerRect.width - rect.width - 20;
                            const maxY = containerRect.height - rect.height - 20;

                            // Generar posición aleatoria lejos del cursor
                            let newX, newY;
                            do {
                                newX = Math.random() * maxX;
                                newY = Math.random() * maxY;
                                const newCenterX = newX + rect.width / 2;
                                const newCenterY = newY + rect.height / 2;
                                const newDistanceX = mouseX - newCenterX;
                                const newDistanceY = mouseY - newCenterY;
                                const newDistance = Math.sqrt(newDistanceX * newDistanceX + newDistanceY * newDistanceY);

                                // Asegurar que la nueva posición esté lejos del cursor
                                if (newDistance > 200) break;
                            } while (true);

                            // Aplicar nueva posición con transición suave
                            button.style.position = 'absolute';
                            button.style.transition = 'all 0.3s ease';
                            button.style.left = `${newX}px`;
                            button.style.top = `${newY}px`;

                            // Resetear flag después de la animación
                            setTimeout(() => {
                                isEscaping = false;
                            }, 400);
                        }
                    }
                };

                // Agregar listener de mousemove al documento
                document.addEventListener('mousemove', handleMouseMove);

                // Cleanup
                return () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    if (yesButton) yesButton.removeEventListener('click', handleYesClick);
                    if (noButton) noButton.removeEventListener('click', handleNoClick);
                };
            }
        }

        // Cleanup al desmontar
        return () => {
            if (yesButton) yesButton.removeEventListener('click', handleYesClick);
            if (noButton) noButton.removeEventListener('click', handleNoClick);
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