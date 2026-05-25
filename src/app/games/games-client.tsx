'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Gamepad2, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from '@/i18n';

const GAME_URLS: Record<string, string> = {
    tutifruti: 'https://tutifruti-game.vercel.app/',
    'quiz-compatibilidad': 'https://games-bay-rho.vercel.app/games/quiz',
    'would-you-rather': 'https://games-bay-rho.vercel.app/games/would-you-rather',
    pictionary: 'https://games-bay-rho.vercel.app/games/pictionary',
    'pixel-adventure': 'https://games-bay-rho.vercel.app/games/pixel-adventure',
    minesweeper: 'https://games-bay-rho.vercel.app/games/minesweeper',
    'anonymous-questions': 'https://games-bay-rho.vercel.app/games/anonymous-questions',
    puzzle: 'https://games-bay-rho.vercel.app/games/puzzle',
    'word-search': 'https://games-bay-rho.vercel.app/games/word-search',
    ludo: 'https://games-bay-rho.vercel.app/games/ludo',
};

const GAME_META: { id: string; emoji: string; tone: string }[] = [
    { id: 'tutifruti', emoji: '🍓', tone: 'var(--mint)' },
    { id: 'quiz-compatibilidad', emoji: '💜', tone: 'var(--lila)' },
    { id: 'would-you-rather', emoji: '🤔', tone: 'var(--melocoton)' },
    { id: 'pictionary', emoji: '🎨', tone: 'var(--mint)' },
    { id: 'pixel-adventure', emoji: '👾', tone: 'var(--butter)' },
    { id: 'minesweeper', emoji: '💣', tone: 'var(--lila-soft)' },
    { id: 'anonymous-questions', emoji: '🎭', tone: 'var(--butter)' },
    { id: 'puzzle', emoji: '🧩', tone: 'var(--lila)' },
    { id: 'word-search', emoji: '🔤', tone: 'var(--melocoton)' },
    { id: 'ludo', emoji: '🎲', tone: 'var(--butter)' },
];

export default function GamesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { t } = useTranslation();

    const GAMES = [
        { id: 'tutifruti', name: t.games.tuttiFrutti, description: t.games.tuttiFruttiDesc },
        { id: 'quiz-compatibilidad', name: t.games.howWellKnow, description: t.games.howWellKnowDesc },
        { id: 'would-you-rather', name: t.games.wouldYouRather, description: t.games.wouldYouRatherDesc },
        { id: 'pictionary', name: t.games.drawGuess, description: t.games.drawGuessDesc },
        { id: 'pixel-adventure', name: t.games.pixelAdventure, description: t.games.pixelAdventureDesc },
        { id: 'minesweeper', name: t.games.minesweeper, description: t.games.minesweeperDesc },
        { id: 'anonymous-questions', name: t.games.anonQuestions, description: t.games.anonQuestionsDesc },
        { id: 'puzzle', name: t.games.puzzle, description: t.games.puzzleDesc },
        { id: 'word-search', name: t.games.wordSearch, description: t.games.wordSearchDesc },
        { id: 'ludo', name: t.games.ludo, description: t.games.ludoDesc },
    ].map((g) => ({
        ...g,
        url: GAME_URLS[g.id],
        emoji: GAME_META.find((m) => m.id === g.id)!.emoji,
        tone: GAME_META.find((m) => m.id === g.id)!.tone,
        badge: t.games.new,
    }));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }} className="max-sm:px-4">
                {/* Hero */}
                <section style={{ padding: '40px 0 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <span className="sticker-badge" style={{ background: 'var(--melocoton)', marginBottom: 12 }}>
                                <Gamepad2 style={{ width: 14, height: 14 }} /> {t.games.badgeLabel}
                            </span>
                            <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 8px', color: 'var(--ink)', lineHeight: 0.95 }}>
                                {t.games.heroTitle}
                            </h1>
                            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                                {t.games.subtitle}
                            </p>
                        </div>

                        {/* View toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '2px solid var(--ink)', borderRadius: 'var(--r-sm)', background: 'white', padding: 4, boxShadow: '2px 2px 0 var(--ink)' }}>
                            <button onClick={() => setViewMode('grid')}
                                style={{ padding: '6px 10px', borderRadius: 0, border: 'none', background: viewMode === 'grid' ? 'var(--ink)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title={t.games.gridView}>
                                <LayoutGrid style={{ width: 16, height: 16 }} />
                            </button>
                            <button onClick={() => setViewMode('list')}
                                style={{ padding: '6px 10px', borderRadius: 0, border: 'none', background: viewMode === 'list' ? 'var(--ink)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 120ms' }}
                                title={t.games.listView}>
                                <List style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Count */}
                <div className="mono-eyebrow" style={{ marginBottom: 20, fontSize: 12 }}>
                    {t.games.gameCount.replace('{count}', String(GAMES.length)).replace('{plural}', GAMES.length !== 1 ? 's' : '')}
                </div>

                {/* Grid */}
                {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }} className="max-sm:grid-cols-1">
                        {GAMES.map((game) => (
                            <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer"
                                style={{ border: '2px solid var(--ink)', borderRadius: 0, background: 'white', overflow: 'hidden', boxShadow: '5px 5px 0 var(--ink)', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'transform 120ms' }}
                                className="hover:-translate-y-0.5 transition-transform">

                                {/* Banner */}
                                <div style={{ height: 160, background: game.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '2px solid var(--ink)' }}>
                                    <span style={{ fontSize: 64, userSelect: 'none' }}>{game.emoji}</span>
                                    {game.badge && (
                                        <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', background: 'white', border: '2px solid var(--ink)', borderRadius: 0, fontSize: 10, fontWeight: 700, color: 'var(--ink)', boxShadow: '2px 2px 0 var(--ink)' }}>
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
                                        {t.games.playNow}
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
                                            <span style={{ position: 'absolute', top: 6, right: 6, padding: '2px 7px', background: 'white', border: '1.5px solid var(--ink)', borderRadius: 0, fontSize: 9, fontWeight: 700, color: 'var(--ink)' }}>
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
                                        <span style={{ flexShrink: 0, padding: '8px 16px', border: '2px solid var(--ink)', borderRadius: 0, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'white', boxShadow: '2px 2px 0 var(--ink)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                                            {t.games.playNow}
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
