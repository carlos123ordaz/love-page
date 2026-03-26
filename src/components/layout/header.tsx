'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, LogOut, User, Crown, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { NotificationBell } from '@/components/NotificationBell';
import { LoginButton } from '@/components/auth/login-page';

export function Header() {
    const { user, firebaseUser } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            if (!auth) {
                toast.error('Error de autenticación');
                return;
            }
            await signOut(auth);
            toast.success('Sesión cerrada');
            router.push('/');
        } catch (error) {
            toast.error('Error al cerrar sesión');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        Love Pages
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {user && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium transition-colors hover:text-pink-600"
                        >
                            Mis Páginas
                        </Link>
                    )}
                    <Link
                        href="/create"
                        className="text-sm font-medium transition-colors hover:text-pink-600"
                    >
                        Crear Nueva
                    </Link>
                    <Link
                        href="/templates"
                        className="text-sm font-medium transition-colors hover:text-pink-600"
                    >
                        Plantillas
                    </Link>
                    <Link
                        href="/games"
                        className="text-sm font-medium transition-colors hover:text-pink-600"
                    >
                        Juegos
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium transition-colors hover:text-pink-600"
                    >
                        Contacto
                    </Link>
                </nav>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <NotificationBell />
                            {!user.isPro && (
                                <Link href="/upgrade">
                                    <Button variant="gradient" size="sm" className="gap-1">
                                        <Crown className="w-4 h-4" />
                                        Upgrade PRO
                                    </Button>
                                </Link>
                            )}

                            {user.isPro && (
                                <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    PRO
                                </div>
                            )}

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                {firebaseUser?.photoURL ? (
                                    <Image
                                        src={firebaseUser.photoURL}
                                        alt={user.displayName}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-600" />
                                )}
                                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                            </div>

                            <Button onClick={handleLogout} variant="ghost" size="icon">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <LoginButton />
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <nav className="container py-4 space-y-3">
                        {user && (
                            <Link
                                href="/dashboard"
                                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Mis Páginas
                            </Link>
                        )}
                        <Link
                            href="/create"
                            className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Crear Nueva
                        </Link>
                        <Link
                            href="/templates"
                            className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Plantillas
                        </Link>
                        <Link
                            href="/games"
                            className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Juegos
                        </Link>
                        <Link
                            href="/contact"
                            className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contacto
                        </Link>
                        {user && (
                            <Link
                                href="/notifications"
                                className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <NotificationBell />
                            </Link>
                        )}
                        {user ? (
                            <>
                                <div className="border-t pt-3">
                                    <div className="px-4 py-2 flex items-center gap-2">
                                        {firebaseUser?.photoURL ? (
                                            <Image
                                                src={firebaseUser.photoURL}
                                                alt={user.displayName}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-600" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">{user.displayName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {!user.isPro && (
                                    <Link href="/upgrade" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="gradient" className="w-full">
                                            <Crown className="w-4 h-4 mr-2" />
                                            Upgrade a PRO
                                        </Button>
                                    </Link>
                                )}

                                <Button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <div className="border-t pt-3 px-4">
                                <LoginButton />
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
