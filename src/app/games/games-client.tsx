'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Gamepad2, LayoutGrid, List } from 'lucide-react';

const GAMES = [
    {
        id: 'tutifruti',
        name: 'Tutti Frutti',
        description: 'El clásico juego de palabras por categorías. ¡Compite con tus amigos en tiempo real!',
        url: 'https://tutifruti-game.vercel.app/',
        emoji: '🍓',
        tone: 'var(--mint)',
        badge: 'Nuevo',
    },
    {
        id: 'quiz-compatibilidad',
        name: '¿Qué tanto se conocen?',
        description: 'Respondan las mismas preguntas y descubran qué tan compatibles son. ¡Para parejas y amigos!',
        url: 'https://games-bay-rho.vercel.app/games/quiz',
        emoji: '💜',
        tone: 'var(--lila)',
        badge: 'Nuevo',
    },
    {
        id: 'would-you-rather',
        name: '¿Qué Prefieres?',
        description: 'Dilemas divertidos para descubrir qué tan parecidos piensan. Elige entre dos opciones y compara.',
        url: 'https://games-bay-rho.vercel.app/games/would-you-rather',
        emoji: '🤔',
        tone: 'var(--melocoton)',
        badge: 'Nuevo',
    },
    {
        id: 'pictionary',
        name: 'Pictionary',
        description: 'Dibuja, adivina y diviértete. Elige una palabra, haz tu mejor dibujo y mira si te adivinan.',
        url: 'https://games-bay-rho.vercel.app/games/pictionary',
        emoji: '🎨',
        tone: 'var(--mint)',
        badge: 'Nuevo',
    },
    {
        id: 'pixel-adventure',
        name: 'Pixel Adventure',
        description: 'Juego multijugador en tiempo real con dados, eventos, trampas y poderes especiales. ¡Llega primero a la meta y gana!',
        url: 'https://games-bay-rho.vercel.app/games/pixel-adventure',
        emoji: '👾',
        tone: 'var(--butter)',
        badge: 'Nuevo',
    },
    {
        id: 'minesweeper',
        name: 'Buscaminas Competitivo',
        description: 'Despejen el mismo tablero compitiendo por puntos. Revela celdas, coloca banderas y no pises las minas. 2-8 jugadores.',
        url: 'https://games-bay-rho.vercel.app/games/minesweeper',
        emoji: '💣',
        tone: 'var(--lila-soft)',
        badge: 'Nuevo',
    },
    {
        id: 'anonymous-questions',
        name: 'Preguntas Anónimas',
        description: 'Escribe preguntas en secreto, todos responden, y adivina quién preguntó qué. ¡El que más engaña gana!',
        url: 'https://games-bay-rho.vercel.app/games/anonymous-questions',
        emoji: '🎭',
        tone: 'var(--butter)',
        badge: 'Nuevo',
    },
    {
        id: 'puzzle',
        name: 'Rompecabezas',
        description: 'Compite armando el mismo rompecabezas contra tu oponente. ¡El más rápido gana! 3 dificultades con fotos reales.',
        url: 'https://games-bay-rho.vercel.app/games/puzzle',
        emoji: '🧩',
        tone: 'var(--lila)',
        badge: 'Nuevo',
    },
    {
        id: 'word-search',
        name: 'Sopa de letras',
        description: 'Encuentra las palabras ocultas antes que tus rivales. ¡Compite en tiempo real con hasta 8 jugadores!',
        url: 'https://games-bay-rho.vercel.app/games/word-search',
        emoji: '🔤',
        tone: 'var(--melocoton)',
        badge: 'Nuevo',
    },
    {
        id: 'ludo',
        name: 'Ludo',
        description: 'El clásico juego de mesa. Lleva tus 4 fichas a casa antes que nadie. 2-4 jugadores.',
        url: 'https://games-bay-rho.vercel.app/games/ludo',
        emoji: '🎲',
        tone: 'var(--butter)',
        badge: 'Nuevo',
    },
];

export default function GamesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }} className="max-sm:px-4">
                {/* Hero */}
                <section style={{ padding: '40px 0 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <span className="sticker-badge" style={{ background: 'var(--melocoton)', marginBottom: 12 }}>
                                <Gamepad2 style={{ width: 14, height: 14 }} /> juegos
                            </span>
                            <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 8px', color: 'var(--ink)', lineHeight: 0.95 }}>
                                juega con <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>quien amas</em> 🎮
                            </h1>
                            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                                Diviértete con tus amigos y tu pareja 🎉
                            </p>
                        </div>

                        {/* View toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '2px solid var(--ink)', borderRadius: 'var(--r-sm)', background: 'white', padding: 4, boxShadow: '2px 2px 0 var(--ink)' }}>
                            <button onClick={() => setViewMode('grid')}
                                style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: viewMode === 'grid' ? 'var(--ink)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title="Vista mosaico">
                                <LayoutGrid style={{ width: 16, height: 16 }} />
                            </button>
                            <button onClick={() => setViewMode('list')}
                                style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: viewMode === 'list' ? 'var(--ink)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title="Vista lista">
                                <List style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Count */}
                <div className="mono-eyebrow" style={{ marginBottom: 20, fontSize: 12 }}>
                    {GAMES.length} juego{GAMES.length !== 1 ? 's' : ''}
                </div>

                {/* Grid */}
                {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }} className="max-sm:grid-cols-1">
                        {GAMES.map((game) => (
                            <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer"
                                style={{ border: '2px solid var(--ink)', borderRadius: 24, background: 'white', overflow: 'hidden', boxShadow: '5px 5px 0 var(--ink)', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'transform 120ms' }}
                                className="hover:-translate-y-0.5 transition-transform">

                                {/* Banner */}
                                <div style={{ height: 160, background: game.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '2px solid var(--ink)' }}>
                                    <span style={{ fontSize: 64, userSelect: 'none' }}>{game.emoji}</span>
                                    {game.badge && (
                                        <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', background: 'white', border: '2px solid var(--ink)', borderRadius: 999, fontSize: 10, fontWeight: 700, color: 'var(--ink)', boxShadow: '2px 2px 0 var(--ink)' }}>
                                            {game.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '16px 20px' }}>
                                    <h2 className="serif-display" style={{ fontSize: 20, margin: '0 0 8px', color: 'var(--ink)', lineHeight: 1.1 }}>
                                        {game.name}
                                    </h2>
                                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {game.description}
                                    </p>
                                    <span className="btn-accent" style={{ padding: '8px 18px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        jugar →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {GAMES.map((game) => (
                            <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer"
                                style={{ border: '2px solid var(--ink)', borderRadius: 'var(--r-md)', background: 'white', overflow: 'hidden', boxShadow: '3px 3px 0 var(--ink)', textDecoration: 'none', display: 'block', transition: 'transform 120ms' }}
                                className="hover:-translate-y-0.5 transition-transform">
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {/* Side banner */}
                                    <div style={{ width: 100, flexShrink: 0, background: game.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--ink)', position: 'relative' }}>
                                        <span style={{ fontSize: 40, userSelect: 'none' }}>{game.emoji}</span>
                                        {game.badge && (
                                            <span style={{ position: 'absolute', top: 6, right: 6, padding: '2px 7px', background: 'white', border: '1.5px solid var(--ink)', borderRadius: 999, fontSize: 9, fontWeight: 700, color: 'var(--ink)' }}>
                                                {game.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 16 }}>
                                        <div>
                                            <h2 className="serif-display" style={{ fontSize: 18, margin: '0 0 4px', color: 'var(--ink)', lineHeight: 1.1 }}>
                                                {game.name}
                                            </h2>
                                            <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {game.description}
                                            </p>
                                        </div>
                                        <span style={{ flexShrink: 0, padding: '8px 16px', border: '2px solid var(--ink)', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'white', boxShadow: '2px 2px 0 var(--ink)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                                            jugar →
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
