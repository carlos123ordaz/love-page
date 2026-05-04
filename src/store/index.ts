import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
    _id: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    isPro: boolean;
    pagesCreated: number;
    canCreatePage: boolean;
    remainingPages: number | 'unlimited';
    dailyAdViews: number,
    bonusPages: number,
}

interface AuthStore {
    firebaseUser: FirebaseUser | null;
    user: User | null;
    loading: boolean;
    setFirebaseUser: (user: FirebaseUser | null) => void;
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    firebaseUser: null,
    user: null,
    loading: true,
    setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
    setUser: (user) => set({ user }),
    updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ firebaseUser: null, user: null }),
}));

interface Page {
    _id: string;
    shortId: string;
    url: string;
    title: string;
    recipientName: string;
    pageType: 'free' | 'pro';
    views: number;
    totalResponses: number;
    yesCount: number;
    noCount: number;
    createdAt: string;
    isActive: boolean;
    expiresAt: string | null;
}

interface PageStore {
    pages: Page[];
    currentPage: any | null;
    loading: boolean;
    setPages: (pages: Page[]) => void;
    setCurrentPage: (page: any) => void;
    setLoading: (loading: boolean) => void;
    addPage: (page: Page) => void;
    updatePage: (pageId: string, updates: Partial<Page>) => void;
    removePage: (pageId: string) => void;
}

export const usePageStore = create<PageStore>((set) => ({
    pages: [],
    currentPage: null,
    loading: false,
    setPages: (pages) => set({ pages }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setLoading: (loading) => set({ loading }),
    addPage: (page) => set((state) => ({ pages: [page, ...state.pages] })),
    updatePage: (pageId, updates) =>
        set((state) => ({
            pages: state.pages.map((p) => (p._id === pageId ? { ...p, ...updates } : p)),
        })),
    removePage: (pageId) =>
        set((state) => ({
            pages: state.pages.filter((p) => p._id !== pageId),
        })),
}));

interface UIStore {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
    sidebarOpen: true,
    theme: 'light',
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setTheme: (theme) => set({ theme }),
}));