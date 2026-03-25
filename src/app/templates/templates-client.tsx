'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    Crown,
    Sparkles,
    Lock,
    Heart,
    Gift,
    PartyPopper,
    Star,
    Snowflake,
    Users,
    LayoutTemplate,
    Eye,
    Search,
    LayoutGrid,
    List,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Template {
    _id: string;
    name: string;
    description: string;
    previewImageUrl: string;
    category: string;
    isPro: boolean;
    tags: string[];
    usageCount: number;
    editableFields: {
        key: string;
        label: string;
        type: string;
        defaultValue: string;
    }[];
}

const CATEGORIES = [
    { id: 'all', name: 'Todas', emoji: '✨' },
    { id: 'san-valentin', name: 'San Valentín', emoji: '💕' },
    { id: 'declaracion', name: 'Declaración', emoji: '💘' },
    { id: 'cumpleanos', name: 'Cumpleaños', emoji: '🎂' },
    { id: 'aniversario', name: 'Aniversario', emoji: '💍' },
    { id: 'amistad', name: 'Amistad', emoji: '🤝' },
    { id: 'navidad', name: 'Navidad', emoji: '🎄' },
    { id: 'otro', name: 'Otros', emoji: '🎁' },
];

export default function TemplatesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuthStore();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadTemplates();
    }, [activeCategory]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const { data } = await api.templates.getAll(
                activeCategory !== 'all' ? activeCategory : undefined
            );
            setTemplates(data.data);
        } catch (error) {
            console.error('Error loading templates:', error);
            toast.error('Error al cargar plantillas');
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = templates.filter((t) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
    });

    const handleTemplateClick = (template: Template) => {
        router.push(`/templates/${template._id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">

                <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-start sm:justify-center">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                                : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
                                }`}
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-gray-500">
                        {!loading && `${filteredTemplates.length} plantilla${filteredTemplates.length !== 1 ? 's' : ''}`}
                    </p>
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-pink-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            title="Vista mosaico"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-pink-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            title="Vista lista"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Templates Grid/List */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
                    </div>
                ) : filteredTemplates.length === 0 ? (
                    <div className="text-center py-16">
                        <LayoutTemplate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No hay plantillas disponibles
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {searchQuery
                                ? 'Intenta con otra búsqueda'
                                : 'Pronto agregaremos más plantillas'}
                        </p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5 lg:gap-6'
                        : 'flex flex-col gap-2 sm:gap-3'
                    }>
                        {filteredTemplates.map((template) => (
                            viewMode === 'grid' ? (
                                <Card
                                    key={template._id}
                                    className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
                                    onClick={() => handleTemplateClick(template)}
                                >
                                    {/* Preview Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img
                                            src={template.previewImageUrl}
                                            alt={template.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                                                <Eye className="w-4 h-4" />
                                                Ver plantilla
                                            </div>
                                        </div>

                                        {/* PRO badge */}
                                        {template.isPro && (
                                            <div className="absolute top-1 right-1 sm:top-3 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-0.5 sm:gap-1 shadow-lg">
                                                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                PRO
                                            </div>
                                        )}

                                        {/* Category badge */}
                                        <div className="absolute top-1 left-1 sm:top-3 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-[10px] sm:text-xs font-medium rounded-full">
                                            {CATEGORIES.find((c) => c.id === template.category)?.emoji}
                                            <span className="hidden sm:inline">
                                                {' '}{CATEGORIES.find((c) => c.id === template.category)?.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <CardContent className="p-2 sm:p-4">
                                        <h3 className="font-bold text-gray-900 text-xs sm:text-base mb-0.5 sm:mb-1 group-hover:text-pink-600 transition-colors line-clamp-1">
                                            {template.name}
                                        </h3>
                                        <p className="hidden sm:block text-sm text-gray-500 line-clamp-2 mb-3">
                                            {template.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                                                <Users className="w-3.5 h-3.5" />
                                                {template.usageCount} usos
                                            </div>

                                            {template.isPro ? (
                                                <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium text-amber-600">
                                                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    <span className="hidden sm:inline">Requiere</span> PRO
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium text-green-600">
                                                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    Gratis
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                /* List View */
                                <Card
                                    key={template._id}
                                    className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
                                    onClick={() => handleTemplateClick(template)}
                                >
                                    <div className="flex flex-row">
                                        <div className="relative w-24 h-20 sm:w-48 md:w-56 sm:h-36 overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={template.previewImageUrl}
                                                alt={template.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            {template.isPro && (
                                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                                    <Crown className="w-3 h-3" />
                                                    PRO
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-2.5 sm:p-4 flex flex-col justify-center flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                                        <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-pink-600 transition-colors truncate">
                                                            {template.name}
                                                        </h3>
                                                        <span className="hidden sm:inline-flex text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                                                            {CATEGORIES.find((c) => c.id === template.category)?.emoji}{' '}
                                                            {CATEGORIES.find((c) => c.id === template.category)?.name}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-2">
                                                        {template.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 sm:gap-4">
                                                        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {template.usageCount} usos
                                                        </div>
                                                        {template.isPro ? (
                                                            <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium text-amber-600">
                                                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                PRO
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium text-green-600">
                                                                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                Gratis
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                    <Eye className="w-4 h-4" />
                                                    Ver
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            )
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}