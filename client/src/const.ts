export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "WIN WIN Finance Group";

export const APP_LOGO = "/logo-winwin-official.jpg";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// WIN WIN Brand Colors
export const BRAND_COLORS = {
  primary: "#3176A6", // Bleu WIN WIN
  secondary: "#8CB4D2", // Bleu clair
  accent: "#D4AF37", // Doré
  dark: "#1A2332",
  light: "#F8FAFC",
} as const;

// Contact Information
export const CONTACT_INFO = {
  email: "contact@winwin.swiss",
  phone: "032 466 11 00",
  mobile: "079 579 25 00",
  whatsapp: "032 466 11 00",
  address: {
    street: "Bellevue 7",
    postalCode: "2950",
    city: "Courgenay",
    country: "Suisse",
  },
  website: "www.winwin.swiss",
  profile: "https://paa.ge/winwin",
} as const;

// Company Information
export const COMPANY_INFO = {
  name: "WIN WIN Finance Group",
  legalName: "WW Finance Group Sàrl",
  finma: "F01042365",
  director: {
    name: "Olivier Neukomm",
    finma: "F01106918",
    cicero: "30101",
  },
  stats: {
    clients: "500+",
    experience: "30 ans",
    satisfaction: "98%",
  },
  insurance: {
    provider: "AXA",
    policy: "14.401.478",
    coverage: "10 millions CHF",
  },
} as const;

// Services Links
export const SERVICES_LINKS = {
  talentis: "https://gamma.app/docs/Fidelisez-vos-Talents-Cles-et-Boostez-la-Croissance-de-votre-Entr-fk5evlthz6inbea?mode=doc",
  durabilis: "https://gamma.app/docs/Durabilis-Anticipez-Protegez-et-Perennisez-votre-entreprise-vc33u0xgshpbadd",
  parentsEnfants: "https://gamma.app/docs/Securisez-lavenir-de-vos-enfants-Notre-solution-unique-a-partir-d-j23lr0vrn1ejl20?mode=doc",
  lppSearch: "https://winwin.recherche-libre-passage.ch",
  airtableClient: "https://airtable.com/appZTQkRJ7PwOtdQ3O/tblWPclpGmB23ASGI/viw3oNghavPmO9cP?blocks=hide",
} as const;

// Grille Tarifaire (pour affichage uniquement, calcul côté serveur)
export const PRICING_DISPLAY = {
  private: {
    under18: { label: "Moins de 18 ans", price: "Gratuit" },
    age18_22: { label: "18-22 ans", price: "CHF 85.-/an" },
    age22Plus: { label: "Plus de 22 ans", price: "CHF 185.-/an" },
  },
  business: {
    employee0: { label: "Indépendant (0 employé)", price: "CHF 160.-/an" },
    employee1: { label: "1 employé", price: "CHF 260.-/an" },
    employee2: { label: "2 employés", price: "CHF 360.-/an" },
    employee3_5: { label: "3-5 employés", price: "CHF 460.-/an" },
    employee6_10: { label: "6-10 employés", price: "CHF 560.-/an" },
    employee11_20: { label: "11-20 employés", price: "CHF 660.-/an" },
    employee21_30: { label: "21-30 employés", price: "CHF 760.-/an" },
    employee31Plus: { label: "31+ employés", price: "CHF 860.-/an" },
  },
} as const;

// Grille Tarifaire (pour calculs)
export const PRICING = {
  prive: [
    { label: "Moins de 18 ans", price: 0, ageMin: 0, ageMax: 17 },
    { label: "18-22 ans", price: 85, ageMin: 18, ageMax: 22 },
    { label: "Plus de 22 ans", price: 185, ageMin: 23, ageMax: 999 },
  ],
  entreprise: [
    { label: "0 employé (Indépendant)", price: 160, employees: 0 },
    { label: "1 employé", price: 260, employees: 1 },
    { label: "2 employés", price: 360, employees: 2 },
    { label: "3-5 employés", price: 460, employeesMin: 3, employeesMax: 5 },
    { label: "6-10 employés", price: 560, employeesMin: 6, employeesMax: 10 },
    { label: "11-20 employés", price: 660, employeesMin: 11, employeesMax: 20 },
    { label: "21-30 employés", price: 760, employeesMin: 21, employeesMax: 30 },
    { label: "31+ employés", price: 860, employeesMin: 31, employeesMax: 9999 },
  ],
} as const;

// Routes internes
export const ROUTES = {
  home: "/",
  services: "/services",
  librePassage: "/libre-passage",
  talentis: "/concepts/talentis",
  durabilis: "/concepts/durabilis",
  synergis: "/concepts/synergis",
  about: "/a-propos",
  contact: "/contact",
  pricing: "/tarifs",
  questionnaire: "/questionnaire",
  questionnaireInfo: "/questionnaire-info",
  signature: "/signature",
  payment: "/paiement",
  thankYou: "/merci",
  clientSpace: "/espace-client",
} as const;
