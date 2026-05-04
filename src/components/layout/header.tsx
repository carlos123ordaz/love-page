'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Menu, X, LogOut, Crown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { NotificationBell } from '@/components/NotificationBell';
import { LoginButton } from '@/components/auth/login-page';
import { useTranslation } from '@/i18n';

export function Header() {
    const { user, firebaseUser } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            if (!auth) { toast.error(t.nav.authError); return; }
            await signOut(auth);
            toast.success(t.nav.sessionClosed);
            router.push('/');
        } catch {
            toast.error(t.nav.sessionCloseError);
        }
    };

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <>
        <header
            ref={headerRef}
            style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(254,243,238,0.94)', backdropFilter: 'blur(12px)',
                borderBottom: '1.5px solid var(--rule)',
            }}
            className="px-5 py-3 sm:px-10 sm:py-4"
        >
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'white', borderRadius: 999, border: '2px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)', textDecoration: 'none' }}>
                <span className="serif-display" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--ink)' }}>love</span>
                <span style={{ fontSize: 15 }}>💗</span>
                <span className="serif-display" style={{ fontSize: 18, color: 'var(--ink)' }}>pages</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex" style={{ gap: 4, alignItems: 'center' }}>
                {[
                    { href: '/templates', label: t.nav.templates },
                    { href: '/games', label: t.nav.games },
                    { href: '/contact', label: t.nav.contact },
                ].map(({ href, label }) => (
                    <Link key={href} href={href}
                        style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}
                        className="hover:bg-white/70 transition-colors">
                        {label}
                    </Link>
                ))}
                {user && (
                    <Link href="/dashboard"
                        style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}
                        className="hover:bg-white/70 transition-colors">
                        {t.nav.myPages}
                    </Link>
                )}
            </nav>

            {/* Desktop user actions */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10 }}>
                {user ? (
                    <>
                        <NotificationBell />
                        {!user.isPro && (
                            <Link href="/upgrade">
                                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--butter)', border: '2px solid var(--ink)', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)', color: 'var(--ink)' }}>
                                    <Crown style={{ width: 14, height: 14 }} />
                                    {t.nav.upgradePro}
                                </button>
                            </Link>
                        )}
                        {user.isPro && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'var(--butter)', border: '2px solid var(--ink)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: 'var(--ink)', boxShadow: '2px 2px 0 var(--ink)' }}>
                                <Crown style={{ width: 12, height: 12 }} /> PRO
                            </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'white', borderRadius: 999, border: '2px solid var(--ink)', boxShadow: '2px 2px 0 var(--ink)' }}>
                            {firebaseUser?.photoURL ? (
                                <Image src={firebaseUser.photoURL} alt={user.displayName} width={24} height={24} style={{ borderRadius: '50%' }} />
                            ) : (
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--lila)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="serif-display" style={{ fontSize: 13, color: 'var(--ink)' }}>{user.displayName?.[0]?.toUpperCase()}</span>
                                </div>
                            )}
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{user.displayName}</span>
                        </div>
                        <button onClick={handleLogout}
                            style={{ width: 36, height: 36, borderRadius: 999, border: '2px solid var(--rule)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title={t.nav.closeSession}>
                            <LogOut style={{ width: 14, height: 14, color: 'var(--ink-soft)' }} />
                        </button>
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                            <LoginButton />
                        </span>
                        <Link href="/create">
                            <button className="btn-accent" style={{ padding: '10px 18px', fontSize: 13 }}>
                                crear página ✨
                            </button>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile right side */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 8 }}>
                {user && <NotificationBell />}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ width: 40, height: 40, borderRadius: 999, border: '2px solid var(--ink)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 var(--ink)' }}
                    aria-label="Menú"
                >
                    {mobileMenuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
                </button>
            </div>
        </header>

        {/* Mobile menu — rendered as a sibling so it naturally appears below the sticky header */}
        {mobileMenuOpen && (
            <div
                className="md:hidden"
                style={{
                    position: 'fixed', top: headerRef.current ? headerRef.current.getBoundingClientRect().bottom : 60,
                    left: 0, right: 0, bottom: 0,
                    background: 'var(--paper)', borderBottom: '2px solid var(--ink)',
                    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8,
                    zIndex: 49, overflowY: 'auto',
                    maxHeight: 'calc(100vh - 60px)',
                }}
            >
                {[
                    { href: '/templates', label: t.nav.templates },
                    { href: '/games', label: t.nav.games },
                    { href: '/contact', label: t.nav.contact },
                    ...(user ? [{ href: '/dashboard', label: t.nav.myPages }] : []),
                ].map(({ href, label }) => (
                    <Link key={href} href={href} onClick={closeMobile}
                        style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: 15, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', background: 'white', border: '1.5px solid var(--rule)', display: 'block' }}>
                        {label}
                    </Link>
                ))}

                <div style={{ paddingTop: 8, borderTop: '1.5px dashed var(--rule)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {user ? (
                        <>
                            {!user.isPro && (
                                <Link href="/upgrade" onClick={closeMobile}>
                                    <button style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', background: 'var(--butter)', border: '2px solid var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '2px 2px 0 var(--ink)' }}>
                                        <Crown style={{ width: 16, height: 16 }} /> {t.nav.upgradePro}
                                    </button>
                                </Link>
                            )}
                            <button onClick={() => { handleLogout(); closeMobile(); }}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: 15, fontWeight: 500, color: 'var(--ink)', background: 'white', border: '1.5px solid var(--rule)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <LogOut style={{ width: 14, height: 14 }} />
                                {t.nav.closeSession}
                            </button>
                        </>
                    ) : (
                        <>
                            <LoginButton />
                            <Link href="/create" onClick={closeMobile}>
                                <button className="btn-accent" style={{ width: '100%', padding: '13px 20px', fontSize: 15 }}>
                                    crear página gratis ✨
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )}
        </>
    );
}
