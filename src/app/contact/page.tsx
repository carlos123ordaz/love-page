'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
    Mail,
    MessageCircle,
    Heart,
    Send,
    CheckCircle,
    Sparkles,
    HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const contactTypes = [
    {
        value: 'comment',
        label: 'Comentario General',
        icon: MessageCircle,
        description: 'Comparte tu opinión o sugerencias',
    },
    {
        value: 'custom_page',
        label: 'Página Personalizada',
        icon: Sparkles,
        description: 'Solicita una página única y especial',
    },
    {
        value: 'support',
        label: 'Soporte Técnico',
        icon: HelpCircle,
        description: 'Ayuda con problemas técnicos',
    },
    {
        value: 'other',
        label: 'Otro',
        icon: Mail,
        description: 'Cualquier otra consulta',
    },
];

export default function ContactPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        type: 'comment',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (formData.message.length > 2000) {
            toast.error('El mensaje no puede exceder 2000 caracteres');
            return;
        }

        setLoading(true);

        try {
            await api.contact.create(formData);
            setSuccess(true);
            toast.success('¡Mensaje enviado! Te responderemos pronto.');

            setFormData({
                name: user?.displayName || '',
                email: user?.email || '',
                type: 'comment',
                subject: '',
                message: '',
            });
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Error al enviar el mensaje');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
                <Header />
                <main className="container px-4 sm:px-6 py-10 sm:py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            ¡Mensaje Enviado!
                        </h1>
                        <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
                            Gracias por contactarnos. Te responderemos lo antes posible.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                                    Ir al Dashboard
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setSuccess(false)}
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                Enviar Otro Mensaje
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />

            <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-3 sm:mb-4">
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Contáctanos
                        </h1>
                        <p className="text-sm sm:text-lg text-gray-600 px-2">
                            ¿Tienes una idea? ¿Necesitas ayuda? Estamos aquí para ti
                        </p>
                    </div>

                    {/* Type Selection Cards - 2x2 grid en móvil */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
                        {contactTypes.map((type) => {
                            const Icon = type.icon;
                            const isSelected = formData.type === type.value;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() =>
                                        setFormData({ ...formData, type: type.value })
                                    }
                                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-200 bg-white hover:border-pink-300'
                                        }`}
                                >
                                    {/* Layout vertical en móvil, horizontal en desktop */}
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                                        <div
                                            className={`p-1.5 sm:p-2 rounded-lg w-fit ${isSelected
                                                    ? 'bg-pink-500 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-xs sm:text-base mb-0.5 sm:mb-1 leading-tight">
                                                {type.label}
                                            </h3>
                                            <p className="text-[11px] sm:text-sm text-gray-600 leading-tight line-clamp-2">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-base sm:text-lg">Envíanos un mensaje</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Completa el formulario y te responderemos pronto
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                                        >
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                                        >
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                                    >
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                                        placeholder="¿En qué podemos ayudarte?"
                                        maxLength={200}
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                                    >
                                        Mensaje *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm sm:text-base"
                                        placeholder="Cuéntanos más detalles..."
                                        maxLength={2000}
                                        required
                                    />
                                    <div className="mt-1 text-xs sm:text-sm text-gray-500 text-right">
                                        {formData.message.length}/2000
                                    </div>
                                </div>

                                {/* Special note for custom pages */}
                                {formData.type === 'custom_page' && (
                                    <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs sm:text-sm text-amber-800">
                                                <p className="font-semibold mb-0.5 sm:mb-1">
                                                    Páginas Personalizadas Premium
                                                </p>
                                                <p className="leading-relaxed">
                                                    Describe tu visión y crearemos una página única
                                                    para esa ocasión especial. Incluye: diseño
                                                    personalizado, animaciones exclusivas, y todo lo
                                                    que necesites.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="gradient"
                                    size="lg"
                                    className="w-full"
                                    loading={loading}
                                >
                                    {!loading && <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <div className="mt-6 sm:mt-8 text-center pb-6 sm:pb-0">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                            ¿Prefieres un contacto directo?
                        </p>
                        <a
                            href="mailto:soporte@lovepages.app"
                            className="text-sm sm:text-base text-pink-600 hover:text-pink-700 font-medium"
                        >
                            soporte@lovepages.app
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}