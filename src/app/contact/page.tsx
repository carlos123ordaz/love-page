'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store';
import { Header } from '@/components/layout/header';
import { api } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { Mail, MessageCircle, Send, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--ink)', background: 'white',
    borderRadius: 'var(--r-sm)', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)',
    boxShadow: '2px 2px 0 var(--ink)', outline: 'none', boxSizing: 'border-box',
};

export default function ContactPage() {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: user?.displayName || '', email: user?.email || '', type: 'comment', subject: '', message: '' });

    const contactTypes = useMemo(() => [
        { value: 'comment', label: t.contact.typeGeneral, icon: MessageCircle, tone: 'var(--lila)' },
        { value: 'custom_page', label: t.contact.typeCustomPage, icon: Sparkles, tone: 'var(--butter)' },
        { value: 'support', label: t.contact.typeSupport, icon: HelpCircle, tone: 'var(--mint)' },
        { value: 'other', label: t.contact.typeOther, icon: Mail, tone: 'var(--melocoton)' },
    ], [t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) { toast.error(t.contact.fillAllFields); return; }
        if (formData.message.length > 2000) { toast.error(t.contact.messageTooLong); return; }
        setLoading(true);
        try {
            await api.contact.create(formData);
            setSuccess(true);
            toast.success(t.contact.sentToast);
            setFormData({ name: user?.displayName || '', email: user?.email || '', type: 'comment', subject: '', message: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || t.common.error);
        } finally { setLoading(false); }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
                <Header />
                <main style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <span style={{ fontSize: 72 }}>✅</span>
                    <h1 className="serif-display" style={{ fontSize: 48, margin: '16px 0 12px', color: 'var(--ink)', lineHeight: 0.95 }}>
                        <em style={{ color: 'var(--accent-hex)', fontStyle: 'italic' }}>mensaje</em> enviado 💌
                    </h1>
                    <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 32 }}>{t.contact.thankYou}</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/dashboard">
                            <button className="btn-accent" style={{ padding: '14px 24px', fontSize: 14 }}>{t.contact.goToDashboard}</button>
                        </Link>
                        <button onClick={() => setSuccess(false)}
                            style={{ background: 'white', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)' }}>
                            {t.contact.sendAnother}
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}>
            <Header />

            <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 48px 80px' }} className="max-sm:px-4">
                {/* Hero */}
                <section style={{ marginBottom: 36 }}>
                    <span className="sticker-badge" style={{ background: 'var(--lila)', marginBottom: 16 }}>✉️ contacto</span>
                    <h1 className="serif-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '12px 0 8px', color: 'var(--ink)', lineHeight: 0.95 }}>
                        {t.contact.title}
                    </h1>
                    <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.55 }}>{t.contact.subtitle}</p>
                </section>

                {/* Type selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }} className="max-sm:grid-cols-2">
                    {contactTypes.map((type) => {
                        const Icon = type.icon;
                        const selected = formData.type === type.value;
                        return (
                            <button key={type.value} onClick={() => setFormData({ ...formData, type: type.value })}
                                style={{ padding: '14px 16px', border: '2px solid var(--ink)', borderRadius: 'var(--r-md)', background: selected ? type.tone : 'white', cursor: 'pointer', textAlign: 'left', boxShadow: selected ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)', transition: 'all 120ms', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: selected ? 'white' : 'var(--lila-soft)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon style={{ width: 14, height: 14, color: 'var(--ink)' }} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{type.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form */}
                <div style={{ border: '2px solid var(--ink)', background: 'white', padding: 32, boxShadow: '5px 5px 0 var(--ink)' }}>
                    <div className="mono-eyebrow" style={{ marginBottom: 20 }}>{t.contact.formTitle}</div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="max-sm:grid-cols-1">
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: 8, textTransform: 'lowercase' }}>{t.contact.nameLabel}</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t.contact.namePlaceholder} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: 8, textTransform: 'lowercase' }}>{t.contact.emailLabel}</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.contact.emailPlaceholder} required style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', marginBottom: 8, textTransform: 'lowercase' }}>{t.contact.subjectLabel}</label>
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={t.contact.subjectPlaceholder} maxLength={200} required style={inputStyle} />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', textTransform: 'lowercase' }}>{t.contact.messageLabel}</label>
                                <span style={{ fontSize: 10, color: 'var(--ink-soft)' }}>{formData.message.length}/2000</span>
                            </div>
                            <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder={t.contact.messagePlaceholder} maxLength={2000} required style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />
                        </div>

                        {formData.type === 'custom_page' && (
                            <div style={{ padding: '14px 16px', background: 'var(--butter)', border: '2px solid var(--ink)', borderRadius: 'var(--r-md)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <Sparkles style={{ width: 16, height: 16, color: 'var(--ink)', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.contact.customPageTitle}</div>
                                    <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{t.contact.customPageDesc}</div>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="btn-accent" style={{ padding: '14px 24px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                            <Send style={{ width: 16, height: 16 }} />
                            {loading ? 'enviando...' : t.contact.submitButton}
                        </button>
                    </form>
                </div>

                {/* Direct email */}
                <div style={{ textAlign: 'center', marginTop: 28 }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>{t.contact.directContact}</p>
                    <a href="mailto:soporte@lovepages.ink" style={{ fontSize: 15, color: 'var(--accent-hex)', fontWeight: 600, textDecoration: 'none' }}>
                        soporte@lovepages.ink
                    </a>
                </div>
            </main>
        </div>
    );
}
