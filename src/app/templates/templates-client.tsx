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
                {/* Hero Section */}
                {/* <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg shadow-pink-500/20">
                        <LayoutTemplate className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Plantillas
                    </h1>
                     <p className="text-gray-600 max-w-lg mx-auto">
                        Elige un diseño profesional, personaliza el contenido y compártelo.
                        Cada plantilla tiene un estilo único creado a mano.
                    </p> 
                </div> */}

                {/* Search bar */}
                {/* <div className="max-w-md mx-auto mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar plantillas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div> */}

                {/* Category filters */}
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

                {/* Templates Grid */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {filteredTemplates.map((template) => (
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
                                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                            <Crown className="w-3 h-3" />
                                            PRO
                                        </div>
                                    )}

                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                                        {CATEGORIES.find((c) => c.id === template.category)?.emoji}{' '}
                                        {CATEGORIES.find((c) => c.id === template.category)?.name}
                                    </div>
                                </div>

                                {/* Info */}
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                        {template.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Users className="w-3.5 h-3.5" />
                                            {template.usageCount} usos
                                        </div>

                                        {template.isPro ? (
                                            <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Requiere PRO
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                                <Heart className="w-3.5 h-3.5" />
                                                Gratis
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}