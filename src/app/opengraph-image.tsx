import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Love Pages — cartas de amor que responden';

const fontData = readFileSync(
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'noto-sans-v27-latin-regular.ttf'),
);

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 1200,
                    height: 630,
                    background: '#f5f0e8',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '56px 80px',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'Georgia, serif',
                }}
            >
                {/* ── Decorative riso circles ── */}
                <div
                    style={{
                        position: 'absolute',
                        width: 560,
                        height: 560,
                        borderRadius: '50%',
                        background: '#d94040',
                        top: -220,
                        right: -120,
                        opacity: 0.18,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: 520,
                        height: 520,
                        borderRadius: '50%',
                        background: '#3a5fcd',
                        top: -170,
                        right: -190,
                        opacity: 0.16,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: 280,
                        height: 280,
                        borderRadius: '50%',
                        background: '#d94040',
                        bottom: -120,
                        left: -80,
                        opacity: 0.1,
                    }}
                />

                {/* ── Top row: URL badge ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
                    <div
                        style={{
                            padding: '8px 18px',
                            border: '2px solid #1a1108',
                            fontSize: 18,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontFamily: 'sans',
                            color: '#1a1108',
                            fontWeight: 600,
                            display: 'flex',
                        }}
                    >
                        lovepages.ink
                    </div>
                    <div
                        style={{
                            padding: '8px 14px',
                            background: '#d94040',
                            border: '2px solid #1a1108',
                            fontSize: 14,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontFamily: 'sans',
                            color: '#f5f0e8',
                            fontWeight: 700,
                            display: 'flex',
                        }}
                    >
                        ★ gratis
                    </div>
                </div>

                {/* ── Main headline ── */}
                <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1, gap: 0 }}>
                    <div
                        style={{
                            fontSize: 108,
                            fontWeight: 900,
                            lineHeight: 0.88,
                            color: '#d94040',
                            fontFamily: 'sans',
                            display: 'flex',
                        }}
                    >
                        cartas de amor
                    </div>
                    <div
                        style={{
                            fontSize: 90,
                            fontWeight: 400,
                            lineHeight: 0.92,
                            color: '#3a5fcd',
                            fontFamily: 'sans',
                            fontStyle: 'italic',
                            display: 'flex',
                            marginTop: 8,
                        }}
                    >
                        que responden.
                    </div>
                </div>

                {/* ── Bottom row ── */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            fontSize: 20,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#6b5744',
                            fontFamily: 'sans',
                            display: 'flex',
                        }}
                    >
                        CREA · COMPARTE · SORPRENDE
                    </div>

                    {/* Right: mini phone mock */}
                    <div
                        style={{
                            width: 110,
                            height: 190,
                            background: '#1a1108',
                            borderRadius: 22,
                            padding: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                flex: 1,
                                background: '#f5f0e8',
                                borderRadius: 17,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Mini riso circles */}
                            <div
                                style={{
                                    position: 'absolute',
                                    width: 52,
                                    height: 52,
                                    borderRadius: '50%',
                                    background: '#d94040',
                                    top: -16,
                                    right: -14,
                                    opacity: 0.8,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: '#3a5fcd',
                                    top: -10,
                                    right: -22,
                                    opacity: 0.7,
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 9,
                                    color: '#1a1108',
                                    fontFamily: 'sans',
                                    letterSpacing: '0.06em',
                                    display: 'flex',
                                }}
                            >
                                para ti
                            </div>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 900,
                                    color: '#d94040',
                                    fontFamily: 'sans',
                                    display: 'flex',
                                    lineHeight: 1,
                                }}
                            >
                                mi carta
                            </div>
                            <div
                                style={{
                                    fontSize: 7,
                                    color: '#3a5fcd',
                                    fontFamily: 'sans',
                                    fontStyle: 'italic',
                                    display: 'flex',
                                    marginTop: 4,
                                }}
                            >
                                con amor ♥
                            </div>
                            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                                <div
                                    style={{
                                        padding: '3px 8px',
                                        background: '#d94040',
                                        fontSize: 7,
                                        color: '#f5f0e8',
                                        fontFamily: 'sans',
                                        fontWeight: 700,
                                        display: 'flex',
                                    }}
                                >
                                    ¡Sí!
                                </div>
                                <div
                                    style={{
                                        padding: '3px 8px',
                                        border: '1px solid #3a5fcd',
                                        fontSize: 7,
                                        color: '#3a5fcd',
                                        fontFamily: 'sans',
                                        display: 'flex',
                                    }}
                                >
                                    No
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [{ name: 'sans', data: fontData, weight: 400, style: 'normal' }],
        },
    );
}
