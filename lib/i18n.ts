export type Locale = "ar" | "fr";

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "btr-locale";

const translations = {
  ar: {
    home: "الرئيسية",
    categories: "الفئات",
    products: "المنتجات",
    discover: "اكتشف",
    discoverProducts: "اكتشف منتجاتنا",
    whatsappQuote: "اطلب عرضاً عبر واتساب",
    customFurnitureCasablanca: "أثاث حسب الطلب · الدار البيضاء",
    interiorDesigned: "مساحتك الداخلية، مصممة حسب",
    yourDimensions: "أبعادك.",
    heroDescription: "طاولات وخزائن ووحدات تلفاز ومكاتب ومطابخ مصنوعة حسب الطلب. صمّم منتجك عبر الإنترنت واحصل على عرضك عبر واتساب.",
    madeToMeasure: "مصمم 100% حسب الطلب",
    madeToMeasureText: "كل قطعة مصممة وفق أبعادك الدقيقة.",
    freeQuote: "عرض مجاني",
    freeQuoteText: "صف مشروعك وسنجيبك بسرعة عبر واتساب.",
    chosenMaterials: "مواد حسب اختيارك",
    chosenMaterialsText: "ألوان وتشطيبات وتكوينات مخصصة.",
    directFollowUp: "متابعة مباشرة",
    directFollowUpText: "جهة اتصال واحدة من العرض إلى التسليم.",
    ourWorlds: "عوالمنا",
    exploreCategories: "اكتشف فئاتنا",
    categoriesDescription: "كل قطعة مصنوعة حسب احتياجاتك، من غرفة المعيشة إلى المطبخ.",
    fullCatalog: "كل المنتجات",
    selection: "مختارات",
    popularProducts: "المنتجات الأكثر طلباً",
    seeAll: "عرض الكل",
    simpleFast: "بسيط وسريع",
    howItWorks: "كيف يعمل؟",
    chooseConfigure: "اختر وصمّم",
    chooseConfigureText: "تصفح الكتالوج واضبط الأبعاد والألوان والتشطيبات.",
    sendRequest: "أرسل طلبك",
    sendRequestText: "بنقرة واحدة، يصل إعدادك مباشرة إلى واتساب.",
    receiveQuote: "استلم عرضك",
    receiveQuoteText: "سيجيبك فريقنا بسرعة بسعر مخصص.",
    btrDifference: "ما يميز BTR",
    whyChooseUs: "لماذا تختارنا؟",
    projectQuestion: "لديك مشروع؟",
    projectDescription: "حدثنا عن فكرتك وسنجيبك بسرعة بعرض مجاني.",
    contactWhatsApp: "تواصل معنا عبر واتساب",
    discoverCategory: "اكتشف",
    noImage: "لا توجد صورة",
    seeDetails: "عرض التفاصيل",
    navigation: "التنقل",
    contact: "تواصل",
    casablancaMorocco: "الدار البيضاء، المغرب",
    freeQuoteWhatsApp: "عرض مجاني عبر واتساب",
    allRightsReserved: "جميع الحقوق محفوظة.",
    category: "الفئة",
    categoryNotFound: "الفئة غير موجودة",
    categoryUnavailable: "هذه الفئة غير موجودة أو لم تعد متاحة.",
    noProducts: "لم يتم العثور على منتجات.",
    comingSoon: "عد لاحقاً، هناك أعمال جديدة قادمة.",
    ourProducts: "منتجاتنا",
    productsDescription: "كل منتجاتنا مصنوعة حسب الطلب. اختر منتجاً لضبط أبعاده وطلب عرض سعر.",
    all: "الكل",
    productNotFound: "المنتج غير موجود",
    customManufacturing: "تصنيع حسب الطلب — عرض مجاني",
    orderThisFurniture: "اطلب هذا المنتج",
    orderDescription: "صمّم منتجك، اترك بياناتك وأرسل طلبك مباشرة عبر واتساب. سيجيبك فريقنا بعرض مخصص.",
    dimensionsOnRequest: "الأبعاد حسب الطلب",
    colorFinishChoice: "اللون والتشطيب حسب اختيارك",
    quickWhatsAppReply: "رد سريع عبر واتساب",
    description: "الوصف",
    customization: "التخصيص",
    customizationDescription: "أدخل أبعادك وتفضيلاتك.",
    choose: "اختر…",
    yourInformation: "بياناتك",
    name: "الاسم",
    phone: "الهاتف",
    city: "المدينة",
    note: "ملاحظة",
    sending: "جارٍ الإرسال…",
    sendWhatsAppRequest: "إرسال الطلب عبر واتساب",
    onRequest: "السعر عند الطلب — إعداد مخصص دون التزام.",
    requestSaved: "تم تسجيل طلبك.",
    whatsappPopup: "إذا لم يفتح واتساب تلقائياً، تحقق من أن متصفحك يسمح بالنوافذ المنبثقة.",
    anotherRequest: "طلب آخر",
    language: "اللغة",
    switchToFrench: "Français",
    switchToArabic: "العربية",
    dashboard: "لوحة التحكم",
    orders: "الطلبات",
    logout: "تسجيل الخروج",
    admin: "الإدارة",
    login: "تسجيل الدخول",
    adminLogin: "تسجيل دخول المسؤول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    incorrectLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    signIn: "دخول",
    addProduct: "+ إضافة منتج",
  },
  fr: {
    home: "Accueil", categories: "Catégories", products: "Produits", discover: "Découvrir",
    discoverProducts: "Découvrir nos produits", whatsappQuote: "Devis sur WhatsApp",
    customFurnitureCasablanca: "Mobilier sur mesure · Casablanca",
    interiorDesigned: "Votre intérieur, conçu selon", yourDimensions: "vos dimensions.",
    heroDescription: "Tables, placards, meubles TV, bureaux et cuisines fabriqués sur mesure. Configurez en ligne, recevez votre devis sur WhatsApp.",
    madeToMeasure: "100% sur mesure", madeToMeasureText: "Chaque pièce est conçue selon vos dimensions exactes.",
    freeQuote: "Devis gratuit", freeQuoteText: "Décrivez votre projet, réponse rapide par WhatsApp.",
    chosenMaterials: "Matériaux au choix", chosenMaterialsText: "Couleurs, finitions et configurations personnalisées.",
    directFollowUp: "Suivi direct", directFollowUpText: "Un interlocuteur unique du devis à la livraison.",
    ourWorlds: "Nos univers", exploreCategories: "Explorez nos catégories",
    categoriesDescription: "Chaque pièce est fabriquée sur mesure selon vos besoins — du salon à la cuisine.",
    fullCatalog: "Tout le catalogue", selection: "Sélection", popularProducts: "Produits populaires", seeAll: "Tout voir",
    simpleFast: "Simple & rapide", howItWorks: "Comment ça marche ?",
    chooseConfigure: "Choisissez & configurez", chooseConfigureText: "Parcourez le catalogue et réglez dimensions, couleurs et finitions.",
    sendRequest: "Envoyez votre demande", sendRequestText: "Un clic, votre configuration part directement sur WhatsApp.",
    receiveQuote: "Recevez votre devis", receiveQuoteText: "Notre équipe vous répond rapidement avec un prix personnalisé.",
    btrDifference: "La différence BTR", whyChooseUs: "Pourquoi nous choisir ?", projectQuestion: "Vous avez un projet ?",
    projectDescription: "Parlez-nous de votre idée — nous vous répondons rapidement avec un devis gratuit.", contactWhatsApp: "Nous contacter sur WhatsApp",
    discoverCategory: "Découvrir", noImage: "Pas d'image", seeDetails: "Voir détails", navigation: "Navigation", contact: "Contact",
    casablancaMorocco: "Casablanca, Maroc", freeQuoteWhatsApp: "Devis gratuit via WhatsApp", allRightsReserved: "Tous droits réservés.",
    category: "Catégorie", categoryNotFound: "Catégorie introuvable", categoryUnavailable: "Cette catégorie n'existe pas ou n'est plus disponible.",
    noProducts: "Aucun produit trouvé.", comingSoon: "Revenez bientôt, de nouvelles réalisations arrivent.", ourProducts: "Nos produits",
    productsDescription: "Tout est fabriqué sur mesure. Sélectionnez un produit pour configurer vos dimensions et demander un devis.", all: "Tous",
    productNotFound: "Produit introuvable", customManufacturing: "Fabrication sur mesure — devis gratuit", orderThisFurniture: "Commander ce meuble",
    orderDescription: "Configurez votre produit, laissez vos coordonnées et envoyez votre demande directement via WhatsApp. Notre équipe vous répond avec un devis personnalisé.",
    dimensionsOnRequest: "Dimensions à la demande", colorFinishChoice: "Couleur et finition au choix", quickWhatsAppReply: "Réponse rapide par WhatsApp",
    description: "Description", customization: "Personnalisation", customizationDescription: "Renseignez vos dimensions et préférences.", choose: "Choisir…",
    yourInformation: "Vos informations", name: "Nom", phone: "Téléphone", city: "Ville", note: "Note", sending: "Envoi en cours…",
    sendWhatsAppRequest: "Envoyer la demande sur WhatsApp", onRequest: "Prix sur demande — configuration personnalisée sans engagement.",
    requestSaved: "Votre demande a été enregistrée.", whatsappPopup: "Si WhatsApp ne s'est pas ouvert automatiquement, vérifiez que votre navigateur autorise les pop-ups.", anotherRequest: "Faire une autre demande",
    language: "Langue", switchToFrench: "Français", switchToArabic: "العربية",
    dashboard: "Dashboard", orders: "Commandes", logout: "Déconnexion", admin: "Admin",
    login: "Connexion", adminLogin: "Connexion admin", email: "Email", password: "Mot de passe",
    incorrectLogin: "Email ou mot de passe incorrect.", signIn: "Se connecter", addProduct: "+ Ajouter un produit",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function translate(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}

const arabicCategories: Record<string, { name: string; description: string }> = {
  tables: { name: "طاولات", description: "طاولات حسب الطلب لغرفة الطعام أو الصالون أو المكتب." },
  placards: { name: "خزائن", description: "خزائن وغرف ملابس ملائمة لمساحتك." },
  "meubles-tv": { name: "وحدات التلفاز", description: "وحدات تلفاز عصرية وعملية." },
  bureaux: { name: "مكاتب", description: "مكاتب مريحة مصممة حسب مساحتك." },
  cuisine: { name: "مطابخ", description: "مطابخ مجهزة حسب الطلب." },
  autres: { name: "أخرى", description: "أثاث وتجهيزات مخصصة." },
  "meubles-a-chaussures": { name: "خزائن الأحذية", description: "خزائن أحذية بأبواب مائلة وأدراج، مصنوعة حسب الطلب." },
  "buffets-commodes": { name: "خزائن جانبية وأدراج", description: "خزائن جانبية وخزائن أدراج لكل غرف المنزل." },
};

const productNameReplacements: [RegExp, string][] = [
  [/Meuble TV/gi, "وحدة تلفاز"],
  [/Meuble à chaussures/gi, "خزانة أحذية"],
  [/Table de chevet/gi, "طاولة سرير"],
  [/Table basse/gi, "طاولة قهوة"],
  [/Table à Manger/gi, "طاولة طعام"],
  [/Table Console/gi, "طاولة كونسول"],
  [/Table/gi, "طاولة"],
  [/Placard/gi, "خزانة"],
  [/Armoire/gi, "خزانة ملابس"],
  [/Bureau/gi, "مكتب"],
  [/Bibliothèque/gi, "مكتبة"],
  [/Étagère/gi, "رفوف"],
  [/Buffet/gi, "خزانة جانبية"],
  [/Commode/gi, "خزانة أدراج"],
  [/Cabinet d'angle/gi, "خزانة زاوية"],
  [/Meuble d'entrée/gi, "خزانة مدخل"],
  [/Petit meuble/gi, "خزانة صغيرة"],
  [/Tête de lit/gi, "لوح رأس السرير"],
  [/Cuisine/gi, "مطبخ"],
  [/noyer/gi, "جوز"],
  [/chêne/gi, "بلوط"],
  [/blanc/gi, "أبيض"],
  [/noir/gi, "أسود"],
  [/crème/gi, "كريمي"],
  [/bois/gi, "خشب"],
  [/naturel/gi, "طبيعي"],
  [/moderne/gi, "عصري"],
  [/design/gi, "بتصميم أنيق"],
  [/suspendu/gi, "معلق"],
  [/flottant/gi, "معلق"],
  [/avec/gi, "مع"],
];

export function catalogCategory(locale: Locale, slug: string, fallback: string): string {
  return locale === "ar" ? arabicCategories[slug]?.name ?? fallback : fallback;
}

export function catalogCategoryDescription(locale: Locale, slug: string, fallback: string | null): string | null {
  return locale === "ar" ? arabicCategories[slug]?.description ?? "أثاث وتجهيزات مصممة حسب الطلب." : fallback;
}

export function catalogProductName(locale: Locale, name: string): string {
  if (locale !== "ar") return name;
  return productNameReplacements.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), name);
}

export function catalogProductDescription(locale: Locale, description: string): string {
  return locale === "ar"
    ? "منتج مصنوع حسب الطلب بتصميم عملي وأنيق، مع إمكانية تخصيص الأبعاد والألوان والتشطيبات وفق احتياجاتك."
    : description;
}

