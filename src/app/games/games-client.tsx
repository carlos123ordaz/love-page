'use client';

import { Header } from '@/components/layout/header';
import { Gamepad2, ExternalLink } from 'lucide-react';

const GAMES = [
    {
        id: 'tutifruti',
        name: 'Tutti Frutti',
        description:
            'El clásico juego de palabras por categorías. ¡Compite con tus amigos en tiempo real!',
        url: 'https://tutifruti-game.vercel.app/',
        emoji: '🍓',
        color: 'from-green-400 to-emerald-500',
        badge: 'Nuevo',
    },
    {
        id: 'quiz-compatibilidad',
        name: '¿Qué tanto se conocen?',
        description:
            'Respondan las mismas preguntas y descubran qué tan compatibles son. ¡Para parejas y amigos!',
        url: 'https://games-bay-rho.vercel.app/games/quiz',
        emoji: '💜',
        color: 'from-purple-400 to-indigo-500',
        badge: 'Nuevo',
    },
    {
        id: 'would-you-rather',
        name: '¿Qué Prefieres?',
        description:
            'Dilemas divertidos para descubrir qué tan parecidos piensan. Elige entre dos opciones y compara.',
        url: 'https://games-bay-rho.vercel.app/games/would-you-rather',
        emoji: '🤔',
        color: 'from-orange-400 to-amber-500',
        badge: 'Nuevo',
    },
    {
        id: 'pictionary',
        name: 'Pictionary',
        description:
            'Dibuja, adivina y diviértete. Elige una palabra, haz tu mejor dibujo y mira si te adivinan.',
        url: 'https://games-bay-rho.vercel.app/games/pictionary',
        emoji: '🎨',
        color: 'from-emerald-400 to-teal-500',
        badge: 'Nuevo',
    },
    {
        id: 'pixel-adventure',
        name: 'Pixel Adventure',
        description:
            'Juego multijugador en tiempo real con dados, eventos, trampas y poderes especiales. ¡Llega primero a la meta y gana!',
        url: 'https://games-bay-rho.vercel.app/games/pixel-adventure',
        emoji: '👾',
        color: 'from-blue-400 to-cyan-500',
        badge: 'Nuevo',
    },
    {
        id: 'minesweeper',
        name: 'Buscaminas Competitivo',
        description:
            'Despejen el mismo tablero compitiendo por puntos. Revela celdas, coloca banderas y no pises las minas. 2-8 jugadores.',
        url: 'https://games-bay-rho.vercel.app/games/minesweeper',
        emoji: '💣',
        color: 'from-sky-400 to-blue-500',
        badge: 'Nuevo',
    },
    {
        id: 'anonymous-questions',
        name: 'Preguntas Anónimas',
        description:
            'Escribe preguntas en secreto, todos responden, y adivina quién preguntó qué. ¡El que más engaña gana!',
        url: 'https://games-bay-rho.vercel.app/games/anonymous-questions',
        emoji: '🎭',
        color: 'from-amber-400 to-yellow-500',
        badge: 'Nuevo',
    },
    {
        id: 'puzzle',
        name: 'Rompecabezas',
        description:
            'Compite armando el mismo rompecabezas contra tu oponente. ¡El más rápido gana! 3 dificultades con fotos reales.',
        url: 'https://games-bay-rho.vercel.app/games/puzzle',
        emoji: '🧩',
        color: 'from-violet-400 to-purple-500',
        badge: 'Nuevo',
    },
    {
        id: 'word-search',
        name: 'Sopa de letras',
        description:
            'Encuentra palabras ocultas en una cuadrícula antes que los demás. ¡2-8 jugadores!',
        url: 'https://games-bay-rho.vercel.app/games/word-search',
        emoji: '🔎',
        color: 'from-rose-400 to-pink-500',
        badge: 'Nuevo',
    },
    {
        id: 'ludo',
        name: 'Ludo',
        description:
            'El clásico juego de mesa. Lleva tus 4 fichas a casa antes que nadie. 2-4 jugadores.',
        url: 'https://games-bay-rho.vercel.app/games/ludo',
        emoji: '🎲',
        color: 'from-yellow-400 to-orange-500',
        badge: 'Nuevo',
    },
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
                {/* Page header */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-100 rounded-xl">
                            <Gamepad2 className="w-6 h-6 text-pink-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Juegos</h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 ml-0 sm:ml-1">
                        Diviértete con tus amigos y tu pareja 🎉
                    </p>
                </div>

                {/* Games grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {GAMES.map((game) => (
                        <a
                            key={game.id}
                            href={game.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100"
                        >
                            {/* Banner */}
                            <div
                                className={`h-36 sm:h-44 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}
                            >
                                <span className="text-6xl sm:text-7xl select-none drop-shadow-sm">
                                    {game.emoji}
                                </span>
                                {game.badge && (
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[11px] font-bold text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
                                        {game.badge}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                        {game.name}
                                    </h2>
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-pink-500 transition-colors flex-shrink-0 mt-1" />
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    {game.description}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full group-hover:from-pink-600 group-hover:to-rose-600 transition-all shadow-sm">
                                    Jugar ahora
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
}