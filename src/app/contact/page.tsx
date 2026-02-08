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

        // Validaciones
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

            // Reset form
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
                <main className="container py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            ¡Mensaje Enviado!
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Gracias por contactarnos. Te responderemos lo antes posible.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="gradient" size="lg">
                                    Ir al Dashboard
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setSuccess(false)}
                                variant="outline"
                                size="lg"
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

            <main className="container py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Contáctanos
                        </h1>
                        <p className="text-lg text-gray-600">
                            ¿Tienes una idea? ¿Necesitas ayuda? Estamos aquí para ti
                        </p>
                    </div>

                    {/* Type Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {contactTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() =>
                                        setFormData({ ...formData, type: type.value })
                                    }
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.type === type.value
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-200 bg-white hover:border-pink-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`p-2 rounded-lg ${formData.type === type.value
                                                    ? 'bg-pink-500 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {type.label}
                                            </h3>
                                            <p className="text-sm text-gray-600">
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
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>
                                Completa el formulario y te responderemos pronto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="¿En qué podemos ayudarte?"
                                        maxLength={200}
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Mensaje *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                                        placeholder="Cuéntanos más detalles..."
                                        maxLength={2000}
                                        required
                                    />
                                    <div className="mt-1 text-sm text-gray-500 text-right">
                                        {formData.message.length}/2000 caracteres
                                    </div>
                                </div>

                                {/* Special note for custom pages */}
                                {formData.type === 'custom_page' && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-amber-800">
                                                <p className="font-semibold mb-1">
                                                    Páginas Personalizadas Premium
                                                </p>
                                                <p>
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
                                    {!loading && <Send className="w-5 h-5 mr-2" />}
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            ¿Prefieres un contacto directo?
                        </p>
                        <a
                            href="mailto:soporte@lovepages.app"
                            className="text-pink-600 hover:text-pink-700 font-medium"
                        >
                            soporte@lovepages.app
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}