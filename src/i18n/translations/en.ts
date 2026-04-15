import type { Translations } from './es';

const en: Translations = {
  // ============================================================
  // COMMON / SHARED
  // ============================================================
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    copy: 'Copy',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Continue',
    create: 'Create',
    pro: 'PRO',
    free: 'Free',
    yes: 'Yes',
    no: 'No',
    none: 'None',
    total: 'Total',
    name: 'Name',
    or: 'or',
    and: 'and',
  },

  // ============================================================
  // HEADER / NAVIGATION
  // ============================================================
  nav: {
    myPages: 'My Pages',
    createNew: 'Create New',
    templates: 'Templates',
    games: 'Games',
    contact: 'Contact',
    upgradePro: 'Upgrade PRO',
    upgradeAPro: 'Upgrade to PRO',
    closeSession: 'Log Out',
    authError: 'Authentication error',
    sessionClosed: 'Logged out',
    sessionCloseError: 'Error logging out',
  },

  // ============================================================
  // AUTH / LOGIN
  // ============================================================
  auth: {
    continueWithGoogle: 'Continue with Google',
    firebaseNotInitialized: 'Error: Firebase is not initialized',
    welcome: 'Welcome!',
    loginError: 'Error logging in',
    loginToSave: 'Sign in with Google to save your page',
  },

  // ============================================================
  // LANDING PAGE
  // ============================================================
  landing: {
    badge: '+2,000 pages created this month',
    heroTitle1: 'Tell them how you feel',
    heroTitle2: 'in a unique way',
    heroDescription: 'Create personalized pages with animations, stickers and the escape button. Share a unique link and see their response in real time.',
    ctaCreate: 'Create my page for free',
    ctaDemo: 'See demo',
    unlimitedPages: 'Unlimited pages',
    proPrice: 'PRO for only $1.39',
    aiDesign: 'AI Design',

    // Showcase
    showcaseTitle: 'See what you can create',
    showcaseDesc: 'From love declarations to invitations. Every page is unique.',
    tryPressNo: '👆 Try pressing "No"!',

    // How it works
    howItWorksTitle: 'It\'s this easy',
    howItWorksDesc: 'In less than 2 minutes your page is ready',
    step1Title: 'Customize your page',
    step1Desc: 'Write your message, choose a theme, stickers, animations and button text.',
    step2Title: 'Share the link',
    step2Desc: 'Send the unique URL via WhatsApp, Instagram, or wherever you prefer.',
    step3Title: 'See the response',
    step3Desc: 'When they respond, you\'ll get a notification with their answer in real time.',

    // Features
    featuresTitle: 'Everything you need',
    feature1Title: '8+ Themes',
    feature1Desc: 'Romantic, ocean, elegant and more',
    feature2Title: 'Animations',
    feature2Desc: 'Hearts, confetti, snow...',
    feature3Title: 'Escape button',
    feature3Desc: 'The "No" runs from the cursor!',
    feature4Title: '16 Stickers',
    feature4Desc: 'Hearts, roses, rings...',
    feature5Title: 'Fonts',
    feature5Desc: '16 fonts to customize',
    feature6Title: 'Statistics',
    feature6Desc: 'Live views and responses',

    // PRO upsell
    proUpsellTitle: 'Want something even more special?',
    proUpsellDesc: 'With PRO you unlock AI design, personalized URL with their name, background music, premium animations and unlimited pages. All for just <strong>$1.39 USD</strong> — one-time payment.',
    getPro: 'Get PRO',

    // Demo
    demoInteractive: 'Interactive demo',
    demoTitle: 'Try how your page will look',
    demoDesc: 'Customize the content below and see changes in real time. No account needed!',

    // Testimonials
    testimonialsTitle: 'What our users say',
    testimonial1: 'I sent the page to my girlfriend and she said yes! The escape button was the best part 😂💕',
    testimonial2: 'Super easy to use and it looked beautiful. I used it for Valentine\'s Day.',
    testimonial3: 'The AI design in the PRO version is incredible. Totally worth it.',
    testimonial4: 'I created one to propose to my boyfriend. He said yes! 💍',

    // Final CTA
    finalCtaTitle1: 'Ready to tell them',
    finalCtaTitle2: 'how you feel?',
    finalCtaDesc: 'Create your first page for free in less than 2 minutes. No credit card required.',
    goToMyPages: 'Go to My Pages',
    createPageFree: 'Create Free Page',
    freeLimitReached: 'You already used your 1 free page. Upgrade to PRO for unlimited pages.',

    // Demo builder
    demoPageTitle: 'Your page title',
    demoPageTitlePlaceholder: 'Will you be my Valentine?',
    demoFor: 'For',
    demoNamePlaceholder: 'Name',
    demoAnimation: 'Animation',
    demoNoAnimation: 'No animation',
    demoHearts: '💕 Hearts',
    demoConfetti: '🎊 Confetti',
    demoMessage: 'Message',
    demoMessagePlaceholder: 'Your special message...',
    demoTheme: 'Theme',
    demoStickers: 'Stickers',
    demoYesButton: '"Yes" Button',
    demoNoButton: '"No" Button',
    demoNoEscapes: 'The "No" button escapes the cursor 😄',
    demoLikeIt: 'Like how it looks? Create your real page for free 👇',
    demoLivePreview: 'Live preview',

    // Mini preview
    thanks: 'Thank you!',
    understood: 'Understood',
    restartDemo: 'Restart demo',
    madeWith: 'Made with Love Pages 💕',

    // Showcase pages
    showcasePage1Title: 'Will you be my Valentine?',
    showcasePage1Message: 'Every moment with you is special...',
    showcasePage2Title: 'Dinner tonight?',
    showcasePage2Message: 'I have something special planned 🌹',
    showcasePage3Title: 'Will you forgive me?',
    showcasePage3Message: 'I promise it won\'t happen again...',

    // Demo theme names
    themeRomantic: 'Romantic',
    themeSunset: 'Sunset',
    themeOcean: 'Ocean',
    themeElegant: 'Elegant',
    themeGarden: 'Garden',
    themeDark: 'Dark',

    // Demo defaults
    defaultTitle: 'Will you be my Valentine?',
    defaultRecipient: 'Maria',
    defaultMessage: 'Every day by your side is a gift... 💕',
    defaultYesText: 'Yes, I do! 💖',
    defaultNoText: 'Let me think about it',
  },

  // ============================================================
  // DASHBOARD
  // ============================================================
  dashboard: {
    hello: 'Hello, {name}! 👋',
    proUser: 'PRO User - Premium features unlocked',
    pagesCreated: 'You\'ve created {count} page{plural}',
    createPage: 'Create Page',
    viewTemplates: 'View Templates',
    pages: 'Pages',
    views: 'Views',
    responses: 'Responses',
    created: 'Created',
    myPages: 'My Pages',
    noPages: 'You haven\'t created any pages yet',
    noPagesDesc: 'Create your first personalized page for a special occasion',
    createFirstPage: 'Create My First Page',
    useTemplate: 'Use a Template',
    forRecipient: 'For: {name}',
    viewsCount: '{count} views',
    responsesCount: '{count} responses',
    activate: 'Activate',
    deactivate: 'Deactivate',
    active: 'Active',
    inactive: 'Deactivated',

    // Dashboard page (not logged in)
    heroTitle: 'Create personalized pages for special occasions',
    heroDesc: 'Design unique pages with animations, stickers and the escape button. Share a unique link and see the response in real time.',
    createPageFree: 'Create Free Page',

    // Toasts
    loadError: 'Error loading pages',
    linkCopied: 'Link copied!',
    pageDeactivated: 'Page deactivated',
    pageActivated: 'Page activated',
    statusChangeError: 'Error changing status',
    confirmDelete: 'Are you sure you want to delete this page?',
    pageDeleted: 'Page deleted',
    deleteError: 'Error deleting page',
  },

  // ============================================================
  // CREATE PAGE
  // ============================================================
  create: {
    title: 'Create New Page',
    subtitle: 'Customize every detail of your page',
    proActive: 'PRO active',

    // Steps
    stepContent: 'Content',
    stepDesign: 'Design',
    stepMedia: 'Images',
    stepEffects: 'Effects',
    stepPublish: 'Publish',

    // Content step
    contentTitle: 'Content',
    contentDesc: 'Write the message for that special person',
    titleLabel: 'Title *',
    titlePlaceholder: 'Will you be my Valentine?',
    recipientLabel: 'Recipient name *',
    recipientPlaceholder: 'Maria',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'Every day by your side is a gift...',
    yesButtonLabel: '"Yes" button text',
    yesButtonPlaceholder: 'Yes, I do!',
    noButtonLabel: '"No" button text',
    noButtonPlaceholder: 'Let me think about it',
    noEscapes: 'The "No" button escapes the cursor 😄',
    useAI: 'Generate complete design with AI',
    useAIDesc: 'Upload a reference image and AI will create a unique design',
    requiredFields: 'Please fill in the required fields',

    // Design step
    designTitle: 'Design',
    designDesc: 'Choose theme, colors and typography',
    themeLabel: 'Theme',
    colorsLabel: 'Colors',
    colorBg: 'Background',
    colorText: 'Text',
    colorAccent: 'Accent',
    titleFontLabel: 'Title font',

    // Media step
    mediaTitle: 'Images & Stickers',
    mediaDesc: 'Add images and decorations to your page',
    bgImageLabel: 'Background image (optional)',
    bgImageDrop: 'Drag or select a background image',
    bgImageFormat: 'PNG, JPG, GIF, WEBP (max. 5MB)',
    bgImageChange: 'Click to change',
    bgImageRemove: 'Remove background',
    decorativeLabel: 'Decorative images',
    decorativeProHint: 'PRO: up to 5',
    decorativeAdd: 'Add image',
    stickersLabel: 'Stickers',
    stickersProHint: 'PRO: more stickers',

    // Effects step
    effectsTitle: 'Effects & Animations',
    effectsDesc: 'Bring your page to life with animations and music',
    animationLabel: 'Background animation',
    musicLabel: 'Background music',

    // Watermark
    watermarkNote: 'Your page will include "Made with Love Pages"',
    watermarkUpgrade: 'Upgrade to PRO to remove the watermark and unlock all features',

    // Preview / Publish step
    readyTitle: 'All set!',
    readyDesc: 'Review your page and publish it',
    customUrl: 'Custom URL',
    recipientWillSee: '{name} will see this first!',
    wantNameInLink: 'Want their name in the link? 💕',
    yourPageWillHave: 'Your page will have:',
    withProCouldBe: 'With PRO it could be:',
    makeMoreSpecial: 'Make it more special – $1.75',
    summaryTitle: 'Title',
    summaryFor: 'For',
    summaryMessage: 'Message',
    summaryTheme: 'Theme',
    summaryFont: 'Font',
    summaryAnimation: 'Animation',
    summaryStickers: 'Stickers',
    summaryBgImage: 'Background image',
    summaryIncluded: '✓ Included',
    summaryDecorativeImages: 'Decorative images',
    summaryImageCount: '✓ {count} image(s)',
    aiNote: 'AI will generate a unique design based on your reference image',
    publishPage: '🚀 Publish Page',
    livePreview: 'Preview',
    yourTitleHere: 'Your title here',

    // Toasts
    titleRequired: 'Title is required',
    recipientRequired: 'Recipient name is required',
    needProPlan: 'You need the PRO plan',
    freeLimitReached: 'You already used your 1 free page. Upgrade to PRO for unlimited pages.',
    pageCreated: 'Page created successfully!',
    createError: 'Error creating page',
    imageTooLarge: 'Image must not exceed 5MB',
    maxStickers: 'Maximum {count} stickers',
    maxStickersProHint: ' (PRO: up to 10)',
    maxDecorativeImages: 'Maximum {count} decorative image{plural}{plural2}',
    maxDecorativeProHint: ' (PRO: up to 5)',
    refImageChange: 'Click to change image',
    refImageUpload: 'Upload reference image for AI',
    refImageFormat: 'PNG, JPG, GIF or WEBP (max. 5MB)',

    // Upgrade modal
    unlockPro: 'Unlock Love Pages PRO',
    unlockProDesc: 'Take your pages to the next level',
    proFeature1: 'Exclusive themes (Neon, Aurora, Vintage...)',
    proFeature2: 'Premium fonts',
    proFeature3: 'Up to 5 decorative images',
    proFeature4: 'Up to 10 stickers',
    proFeature5: 'Premium animations (confetti, fireworks...)',
    proFeature6: 'Background music',
    proFeature7: 'No watermark',
    proFeature8: 'AI-generated design',
    proFeature9: 'Unlimited pages',
    viewProPlans: 'View PRO plans',
    stayFree: 'Stay with free plan',
    unlockProBadge: 'Unlock PRO',
  },

  // ============================================================
  // THEMES & ANIMATIONS
  // ============================================================
  themes: {
    romantic: 'Romantic',
    sunset: 'Sunset',
    ocean: 'Ocean',
    garden: 'Garden',
    playful: 'Playful',
    elegant: 'Elegant',
    minimal: 'Minimal',
    dark: 'Dark',
    neon: 'Neon',
    vintage: 'Vintage',
    aurora: 'Aurora',
    cherry: 'Cherry Blossom',
  },

  animations: {
    none: 'No animation',
    'hearts-falling': 'Falling hearts',
    'fade-in': 'Fade in',
    'float-up': 'Float up',
    confetti: 'Confetti',
    particles: 'Particles',
    fireworks: 'Fireworks',
    snow: 'Snow',
    petals: 'Petals',
    bubbles: 'Bubbles',
  },

  music: {
    none: 'No music',
    'romantic-piano': '🎹 Romantic piano',
    'acoustic-guitar': '🎸 Acoustic guitar',
    'love-song': '🎵 Love song',
    'music-box': '🎶 Music box',
    orchestra: '🎻 Soft orchestra',
  },

  // ============================================================
  // TEMPLATES
  // ============================================================
  templates: {
    title: 'Templates',
    searchPlaceholder: 'Search templates...',
    categoryAll: 'All',
    categoryValentine: "Valentine's Day",
    categoryDeclaration: 'Declaration',
    categoryBirthday: 'Birthday',
    categoryAnniversary: 'Anniversary',
    categoryFriendship: 'Friendship',
    categoryChristmas: 'Christmas',
    categoryOther: 'Other',
    templateCount: '{count} template{plural}',
    gridView: 'Grid view',
    listView: 'List view',
    noTemplates: 'No templates available',
    tryOtherSearch: 'Try a different search',
    moreComingSoon: 'More templates coming soon',
    viewTemplate: 'View template',
    requiresPro: 'Requires PRO',
    uses: 'uses',
    loadError: 'Error loading templates',
  },

  // ============================================================
  // GAMES
  // ============================================================
  games: {
    title: 'Games',
    subtitle: 'Have fun with your friends and partner 🎉',
    gameCount: '{count} game{plural}',
    gridView: 'Grid view',
    listView: 'List view',
    playNow: 'Play now',
    open: 'Open',
    new: 'New',

    // Game names
    tuttiFrutti: 'Tutti Frutti',
    tuttiFruttiDesc: 'The classic word game by categories. Compete with your friends in real time!',
    howWellKnow: 'How well do you know each other?',
    howWellKnowDesc: 'Answer the same questions and discover how compatible you are. For couples and friends!',
    wouldYouRather: 'Would You Rather?',
    wouldYouRatherDesc: 'Fun dilemmas to discover how alike you think. Choose between two options and compare.',
    drawGuess: 'Draw & Guess',
    drawGuessDesc: 'Draw, guess and have fun. Pick a word, make your best drawing and see if they can guess it.',
    pixelAdventure: 'Pixel Adventure',
    pixelAdventureDesc: 'Real-time multiplayer game with dice, events, traps and special powers. Reach the finish line first and win!',
    minesweeper: 'Competitive Minesweeper',
    minesweeperDesc: 'Clear the same board competing for points. Reveal cells, place flags and don\'t step on mines. 2-8 players.',
    anonQuestions: 'Anonymous Questions',
    anonQuestionsDesc: 'Write questions secretly, everyone answers, and guess who asked what. The best deceiver wins!',
    puzzle: 'Puzzle',
    puzzleDesc: 'Compete solving the same puzzle against your opponent. The fastest wins! 3 difficulty levels with real photos.',
    wordSearch: 'Word Search',
    wordSearchDesc: 'Find hidden words before your rivals. Compete in real time with up to 8 players!',
    ludo: 'Ludo',
    ludoDesc: 'The classic board game. Get your 4 pieces home before anyone else. 2-4 players.',
  },

  // ============================================================
  // UPGRADE
  // ============================================================
  upgrade: {
    title: 'Unlock PRO Features',
    subtitle: 'Take your pages to the next level with premium tools',
    specialOffer: 'Special Offer!',
    oneTimePayment: 'One-time payment',
    featuresProTitle: 'PRO Features',
    permanentAccess: 'One-time payment • Permanent access',

    feature1Title: 'Premium Themes & Animations',
    feature1Desc: 'Neon, Aurora, Vintage, confetti, fireworks, snow and more',
    feature2Title: 'AI Design',
    feature2Desc: 'Upload an image and AI will create a unique personalized design',
    feature3Title: 'Personalized URL with their name 💕',
    feature3Desc: 'Instead of a random link, it will be something like:',
    feature4Title: 'Background music',
    feature4Desc: 'Romantic piano, acoustic guitar, music box and more',
    feature5Title: 'Premium templates + No watermark',
    feature5Desc: 'Access professionally designed templates and remove the "Made with Love Pages"',
    feature6Title: 'More stickers & images',
    feature6Desc: 'Up to 10 stickers and 5 decorative images per page',

    selectPayment: 'Select your payment method:',
    mercadoPagoDesc: 'Cards, cash and more',
    paypalDesc: 'PayPal, cards',
    unlockProPrice: 'Unlock PRO for $1.75 USD',
    securePayment: 'Secure payment processed by',

    // Comparison
    freePlan: 'Free Plan',
    currentPlan: 'What you currently have',
    freeFeature1: '1 free page',
    freeFeature2: '8 basic themes',
    freeFeature3: '4 basic animations',
    freeFeature4: '3 stickers, 1 decorative image',
    freeFeature5: 'No AI design',
    freeFeature6: 'No custom URL',
    freeFeature7: 'No background music',
    freeFeature8: 'Includes watermark',
    recommended: 'Recommended',
    proFeaturesTitle: 'PRO Features',
    unlockPotential: 'Unlock the full potential',
    proIncludes: 'Everything in the free plan',
    proFeature1: 'Premium themes and animations',
    proFeature2: 'AI design',
    proFeature3: 'Custom URL',
    proFeature4: '10 stickers, 5 images',
    proFeature5: 'Background music',
    proFeature6: 'No watermark',
  },

  // ============================================================
  // CONTACT
  // ============================================================
  contact: {
    title: 'Contact Us',
    subtitle: 'Have an idea? Need help? We\'re here for you',
    formTitle: 'Send us a message',
    formDesc: 'Fill out the form and we\'ll get back to you soon',

    // Contact types
    typeGeneral: 'General Comment',
    typeGeneralDesc: 'Share your opinion or suggestions',
    typeCustomPage: 'Custom Page',
    typeCustomPageDesc: 'Request a unique and special page',
    typeSupport: 'Technical Support',
    typeSupportDesc: 'Help with technical issues',
    typeOther: 'Other',
    typeOtherDesc: 'Any other inquiry',

    // Form fields
    nameLabel: 'Name *',
    namePlaceholder: 'Your name',
    emailLabel: 'Email *',
    emailPlaceholder: 'you@email.com',
    subjectLabel: 'Subject *',
    subjectPlaceholder: 'How can we help you?',
    messageLabel: 'Message *',
    messagePlaceholder: 'Tell us more details...',
    submitButton: 'Send Message',
    directContact: 'Prefer direct contact?',

    // Validation
    fillAllFields: 'Please fill in all fields',
    messageTooLong: 'Message cannot exceed 2000 characters',

    // Success
    messageSent: 'Message Sent!',
    thankYou: 'Thank you for contacting us. We\'ll respond as soon as possible.',
    goToDashboard: 'Go to Dashboard',
    sendAnother: 'Send Another Message',
    sentToast: 'Message sent! We\'ll get back to you soon.',

    // Custom page note
    customPageTitle: 'Premium Custom Pages',
    customPageDesc: 'Describe your vision and we\'ll create a unique page for that special occasion. Includes: custom design, exclusive animations, and everything you need.',
  },

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all as read',
    readAll: 'Read all',
    allUpToDate: 'All caught up!',
    noNotifications: 'No notifications',
    noPending: 'You have no pending notifications',
    willAppearHere: 'Your notifications will appear here',
    loadMore: 'Load more',
    loadError: 'Error loading notifications',
    markError: 'Error marking notification',
    markAllError: 'Error marking notifications',
    allMarkedRead: 'All marked as read',
    noNotificationsShort: 'You have no notifications',
    viewAll: 'View all notifications',
    markAll: 'Mark all',

    // Types
    typeInfo: 'Info',
    typeSuccess: 'Success',
    typeWarning: 'Warning',
    typePromo: 'Promo',
    typeUpdate: 'Update',
    typeResponse: 'Response',
    typeSystem: 'System',

    // Filters
    filterAll: 'All',
    filterUnread: 'Unread',
    filterPromos: 'Promos',
    filterUpdates: 'Updates',
    filterResponses: 'Responses',
  },

  // ============================================================
  // PAYMENT
  // ============================================================
  payment: {
    successTitle: 'Payment Successful! 🎉',
    nowProMember: 'You are now a PRO member',
    benefitsActivated: 'Benefits Activated',
    benefit1: 'Unlimited pages available',
    benefit2: 'AI design activated',
    benefit3: 'Full customization unlocked',
    createProPage: 'Create PRO Page',
    goToDashboard: 'Go to Dashboard',
    closeNote: 'You can close this window or continue exploring',

    // PayPal processing
    processing: 'Processing your payment...',
    confirmingPaypal: 'We\'re confirming your payment with PayPal',
    dontCloseWindow: 'Don\'t close this window',
  },

  // ============================================================
  // PUBLIC PAGE
  // ============================================================
  publicPage: {
    joyResponse: 'How wonderful! 💕',
    responseRegistered: 'Response registered',
    responseError: 'Error sending response',
    pageNotFound: 'Page not found',
    pageNotFoundDesc: 'This page doesn\'t exist or has been deleted',
    thanks: 'Thank you!',
    understood: 'Understood',
    responseRecorded: 'Your response has been recorded',
    madeWith: 'Made with Love Pages 💕',
  },

  // ============================================================
  // PAGE DETAIL
  // ============================================================
  pageDetail: {
    pageNotFound: 'Page not found',
    loadError: 'Error loading details',
    linkCopied: 'Link copied!',
    qrCode: 'QR Code',
    qrDesc: 'Generate and download a QR to share your page',
    qrShareDesc: 'Share your page with a printable QR code',
    generateQR: 'Generate QR',
    unlock: 'Unlock',
    proExclusive: 'PRO exclusive feature',
    generatingQR: 'Generating QR code...',
    scanToOpen: 'Scan this code to open',
    download: 'Download',

    // Stats
    views: 'Views',
    responses: 'Responses',
    yesLabel: 'Yes',
    noLabel: 'No',

    // QR Modal
    qrProDesc: 'With PRO you can generate a QR code for your page to print on cards, gifts or invitations 💌',
    getProPrice: 'Get PRO — $1.75 USD',
    notNow: 'Not now',

    // Page info
    pageInfo: 'Page information',
    messageLabel: 'Message:',
    yesButton: 'Yes button:',
    noButton: 'No button:',
    escapeButton: 'Escape button:',
    status: 'Status:',
    active: 'Active',
    inactive: 'Inactive',
    createdAt: 'Created:',

    // Responses section
    responsesTitle: 'Responses',
    noResponses: 'No responses yet',
    shareToGetResponses: 'Share the link to receive responses',
    yesResponse: 'Yes! 💕',
    noResponse: 'No 😢',

    // Buttons
    copyLink: 'Copy link',
    viewPage: 'View page',

    // QR toasts
    qrDownloaded: 'QR downloaded!',
    qrCopied: 'QR copied to clipboard!',
    qrCopyError: 'Could not copy. Download it instead.',
  },

  // ============================================================
  // CUSTOM SLUG
  // ============================================================
  customSlug: {
    title: 'Custom URL',
    titleOptional: 'Custom URL (optional)',
    preview: 'Your page will be:',
    minChars: 'Minimum 3 characters',
    maxChars: 'Maximum 30 characters',
    onlyLowercase: 'Only lowercase, numbers and hyphens',
    noStartEndHyphen: 'Cannot start or end with hyphen',
    noConsecutiveHyphens: 'Cannot have consecutive hyphens',
    available: '✓ Available',
    verifyError: 'Error verifying',
    wantNameInLink: 'Want their name in the link? 😍',
    firstImpression: 'It\'s the first thing they\'ll see when they receive your page. Make it more special and personal.',
    genericUrl: 'Generic URL:',
    hardToRemember: 'Hard to remember 😕',
    customUrlLabel: 'Custom URL:',
    memorableSpecial: 'Memorable and special!',
    benefit1: '💕 More personal and romantic',
    benefit2: '✨ Easy to remember and share',
    benefit3: '🎯 Professional and unique',
    benefit4: '💌 Makes a better impression',
    unlockCustomUrls: 'Unlock Custom URLs',
    includedInPro: 'Included in the PRO plan with all premium features',
    testimonial: 'When she saw the link had her name, she got excited before even opening it. The PRO was totally worth it!',
    rules: 'Only lowercase letters, numbers and hyphens',
    charRange: 'Between 3 and 30 characters',
    autoGenerate: 'If left empty, an automatic URL will be generated',
    perfectUrl: 'Perfect! Your URL will be:',
    easyToShare: 'Easy to remember and share!',
    suggestion: 'Suggestion: use',
  },

  // ============================================================
  // REWARDED ADS
  // ============================================================
  rewardedAds: {
    dailyLimitReached: 'You\'ve used your 3 daily rewards. Come back tomorrow or upgrade to PRO for unlimited pages.',
    wantAnotherPage: 'Want another free page?',
    watchAdForPage: 'Watch a short ad and earn 1 extra page',
    watchAd: 'Watch ad',
    earnExtraPage: 'Earn a free extra page! 🎁',
    usedFreePage: 'You\'ve used your free page. Watch a short ad and unlock 1 additional page instantly.',
    watchAd15s: 'Watch ad (~15 sec)',
    loadingAd: 'Loading ad...',
    rewardsAvailable: 'rewards available today',
    preferNoAds: 'Prefer no ads?',
    goProUnlimited: 'Go PRO for $1.75 — Unlimited pages',
    watchAdToEarn: 'Watch the ad to earn 1 page',
    waitSeconds: 'Wait {seconds} seconds to claim your reward',
    adCompleted: 'Ad completed!',
    claimReward: 'Claim 1 extra page',
    wonExtraPage: '🎉 You earned 1 extra page!',
    rewardError: 'Error processing reward',
    confirmError: 'Error confirming reward',
    adNotCompleted: 'Ad not completed. No reward granted.',
    extraPageUnlocked: 'Extra page unlocked!',
    canCreateNewPage: 'You can now create a new page',
  },

  // ============================================================
  // LANGUAGE
  // ============================================================
  language: {
    es: 'Español',
    en: 'English',
    switchLanguage: 'Language',
  },
};

export default en;
