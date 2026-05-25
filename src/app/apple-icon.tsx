import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const fontData = readFileSync(
    path.join(process.cwd(), 'src', 'assets', 'fonts', 'noto-sans-v27-latin-regular.ttf'),
);

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 180,
                    height: 180,
                    background: '#f5f0e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Riso red circle */}
                <div
                    style={{
                        position: 'absolute',
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: '#d94040',
                        top: -34,
                        right: -34,
                        opacity: 0.88,
                    }}
                />
                {/* Riso blue circle */}
                <div
                    style={{
                        position: 'absolute',
                        width: 136,
                        height: 136,
                        borderRadius: '50%',
                        background: '#3a5fcd',
                        top: -18,
                        right: -54,
                        opacity: 0.78,
                    }}
                />
                {/* Heart mark */}
                <div
                    style={{
                        fontSize: 80,
                        color: '#f5f0e8',
                        fontWeight: 900,
                        zIndex: 1,
                        lineHeight: 1,
                        marginTop: 8,
                    }}
                >
                    ♥
                </div>
                {/* Bottom wordmark */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: 13,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#1a1108',
                        fontFamily: 'sans',
                        fontWeight: 600,
                    }}
                >
                    lovepages
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [{ name: 'sans', data: fontData, weight: 400, style: 'normal' }],
        },
    );
}
