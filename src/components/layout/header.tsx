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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
                background: 'var(--paper)',
                borderBottom: '1.5px solid var(--ink-black)',
            }}
            className="px-5 py-3 sm:px-10 sm:py-4"
        >
            {/* Logo — riso misregistered */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <span className="serif-display mis-red" style={{ fontSize: 22 }}>love</span>
                <span style={{ width: 8, height: 8, background: 'var(--ink-blue)', display: 'inline-block', flexShrink: 0 }} />
                <span className="serif-display mis-blue" style={{ fontSize: 22 }}>pages</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex" style={{ gap: 0, alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {[
                    { href: '/templates', label: t.nav.templates },
                    { href: '/games', label: t.nav.games },
                    { href: '/contact', label: t.nav.contact },
                ].map(({ href, label }) => (
                    <Link key={href} href={href}
                        style={{ padding: '8px 14px', color: 'var(--ink-black)', textDecoration: 'none', fontWeight: 400 }}
                        className="hover:bg-black/5 transition-colors">
                        {label}
                    </Link>
                ))}
                {user && (
                    <Link href="/dashboard"
                        style={{ padding: '8px 14px', color: 'var(--ink-soft)', textDecoration: 'none' }}
                        className="hover:bg-black/5 transition-colors">
                        {t.nav.myPages}
                    </Link>
                )}
            </nav>

            {/* Desktop user actions */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
                <LanguageSwitcher compact />
                {user ? (
                    <>
                        <NotificationBell />
                        {!user.isPro && (
                            <Link href="/upgrade">
                                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-black)' }}>
                                    <Crown style={{ width: 11, height: 11 }} />
                                    {t.nav.upgradePro}
                                </button>
                            </Link>
                        )}
                        {user.isPro && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'var(--ink-blue)', border: '1.5px solid var(--ink-black)', fontSize: 11, fontWeight: 700, color: 'var(--paper)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                <Crown style={{ width: 11, height: 11 }} /> PRO
                            </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)' }}>
                            {firebaseUser?.photoURL ? (
                                <Image src={firebaseUser.photoURL} alt={user.displayName} width={22} height={22} style={{ borderRadius: '50%' }} />
                            ) : (
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--ink-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 11, color: 'var(--paper)', fontFamily: 'var(--display)', fontWeight: 700 }}>{user.displayName?.[0]?.toUpperCase()}</span>
                                </div>
                            )}
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-black)', fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{user.displayName}</span>
                        </div>
                        <button onClick={handleLogout}
                            style={{ width: 32, height: 32, border: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title={t.nav.closeSession}>
                            <LogOut style={{ width: 13, height: 13, color: 'var(--ink-soft)' }} />
                        </button>
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: 11, color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            <LoginButton />
                        </span>
                        <Link href="/create">
                            <button className="btn-accent" style={{ padding: '9px 16px', fontSize: 11 }}>
                                {t.nav.createPage}
                            </button>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile right side */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 8 }}>
                <LanguageSwitcher compact />
                {user && <NotificationBell />}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ width: 36, height: 36, border: '1.5px solid var(--ink-black)', background: 'var(--paper-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Menú"
                >
                    {mobileMenuOpen ? <X style={{ width: 16, height: 16 }} /> : <Menu style={{ width: 16, height: 16 }} />}
                </button>
            </div>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
            <div
                className="md:hidden"
                style={{
                    position: 'fixed',
                    top: headerRef.current ? headerRef.current.getBoundingClientRect().bottom : 60,
                    left: 0, right: 0, bottom: 0,
                    background: 'var(--paper)',
                    borderBottom: '1.5px solid var(--ink-black)',
                    padding: '16px 20px',
                    display: 'flex', flexDirection: 'column', gap: 0,
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
                        style={{ padding: '14px 0', fontSize: 12, fontWeight: 500, color: 'var(--ink-black)', textDecoration: 'none', display: 'block', borderBottom: '1px solid var(--rule)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {label}
                    </Link>
                ))}

                <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {user ? (
                        <>
                            {!user.isPro && (
                                <Link href="/upgrade" onClick={closeMobile}>
                                    <button style={{ width: '100%', padding: '12px 16px', fontSize: 11, fontWeight: 700, color: 'var(--ink-black)', background: 'var(--paper-2)', border: '1.5px solid var(--ink-black)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        <Crown style={{ width: 13, height: 13 }} /> {t.nav.upgradePro}
                                    </button>
                                </Link>
                            )}
                            <button onClick={() => { handleLogout(); closeMobile(); }}
                                style={{ width: '100%', padding: '12px 16px', fontSize: 11, fontWeight: 500, color: 'var(--ink-black)', background: 'var(--paper-soft)', border: '1.5px solid var(--ink-black)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                <LogOut style={{ width: 13, height: 13 }} />
                                {t.nav.closeSession}
                            </button>
                        </>
                    ) : (
                        <>
                            <LoginButton />
                            <Link href="/create" onClick={closeMobile}>
                                <button className="btn-accent" style={{ width: '100%', padding: '13px 20px', fontSize: 12 }}>
                                    {t.nav.createPageFree}
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
