/**
 * Borrador local del editor de páginas.
 *
 * El editor permite diseñar sin sesión iniciada, así que el trabajo tiene que
 * sobrevivir a una recarga, a un login por popup y a cerrar la pestaña.
 * Los File (imagen de fondo, decorativas, referencia) no son serializables:
 * se omiten y se avisa al restaurar.
 */

const DRAFT_KEY = 'love-pages:create:draft';
const DRAFT_VERSION = 1;

/** Campos que sí viajan al borrador. Los File quedan fuera a propósito. */
const PERSISTED_FIELDS = [
    'title',
    'recipientName',
    'message',
    'yesButtonText',
    'noButtonText',
    'noButtonEscapes',
    'pageType',
    'theme',
    'backgroundColor',
    'textColor',
    'accentColor',
    'titleFont',
    'bodyFont',
    'selectedStickers',
    'animation',
    'backgroundMusic',
    'videoUrl',
    'customSlug',
    'occasionDate',
] as const;

export type PersistedField = (typeof PERSISTED_FIELDS)[number];

export interface StoredDraft {
    version: number;
    savedAt: number;
    /** true si el usuario había subido imágenes que no se pudieron guardar */
    hadImages: boolean;
    values: Record<string, unknown>;
}

/** Extrae del formulario sólo lo serializable. */
export function pickPersistable(formData: Record<string, any>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const key of PERSISTED_FIELDS) {
        if (formData[key] !== undefined) out[key] = formData[key];
    }
    return out;
}

/** ¿El borrador tiene algo que valga la pena restaurar? */
export function isDraftWorthKeeping(values: Record<string, any>): boolean {
    return Boolean(
        String(values.title ?? '').trim() ||
        String(values.recipientName ?? '').trim() ||
        String(values.message ?? '').trim()
    );
}

export function saveDraft(formData: Record<string, any>): number | null {
    if (typeof window === 'undefined') return null;

    const values = pickPersistable(formData);

    // Un borrador sin texto no aporta nada y estorbaría al siguiente usuario
    // del navegador: mejor borrarlo que guardar un formulario vacío.
    if (!isDraftWorthKeeping(values)) {
        clearDraft();
        return null;
    }

    const savedAt = Date.now();
    const draft: StoredDraft = {
        version: DRAFT_VERSION,
        savedAt,
        hadImages: Boolean(
            formData.backgroundImage ||
            formData.referenceImage ||
            (formData.decorativeImages && formData.decorativeImages.length > 0)
        ),
        values,
    };

    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        return savedAt;
    } catch {
        // Cuota llena o modo privado: perder el autoguardado no debe romper la edición.
        return null;
    }
}

export function loadDraft(): StoredDraft | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as StoredDraft;
        if (parsed?.version !== DRAFT_VERSION || !parsed.values) return null;
        if (!isDraftWorthKeeping(parsed.values)) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function clearDraft(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch {
        /* nada que hacer */
    }
}
