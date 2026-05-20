import en from "./i18n/en.js";
import zhTW from "./i18n/zh-TW.js";

const TRANSLATIONS = {
    en,
    "zh-TW": zhTW
};

export const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
export const LANGUAGE_STORAGE_KEY = "thumbnailGrabber_language";

let currentLanguage = "en";

function getNestedValue(obj, keyPath) {
    return keyPath.split(".").reduce((acc, key) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
            return acc[key];
        }
        return undefined;
    }, obj);
}

function normalizeLanguage(language) {
    if (!language) {
        return null;
    }

    const exact = SUPPORTED_LANGUAGES.find((supported) => supported.toLowerCase() === language.toLowerCase());
    if (exact) {
        return exact;
    }

    const baseLanguage = language.toLowerCase().split("-")[0];
    if (baseLanguage === "zh") {
        return "zh-TW";
    }

    if (baseLanguage === "en") {
        return "en";
    }

    return null;
}

function resolveLanguage() {
    const savedLanguage = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (savedLanguage) {
        return savedLanguage;
    }

    const browserCandidates = [
        ...(navigator.languages || []),
        navigator.language
    ];

    for (const candidate of browserCandidates) {
        const normalized = normalizeLanguage(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return "en";
}

export function t(key) {
    const activeLanguageValue = getNestedValue(TRANSLATIONS[currentLanguage], key);
    if (typeof activeLanguageValue === "string") {
        return activeLanguageValue;
    }

    const fallbackValue = getNestedValue(TRANSLATIONS.en, key);
    if (typeof fallbackValue === "string") {
        return fallbackValue;
    }

    return key;
}

export function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
        const translationKey = element.getAttribute("data-i18n");
        element.textContent = t(translationKey);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const translationKey = element.getAttribute("data-i18n-placeholder");
        element.setAttribute("placeholder", t(translationKey));
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        const translationKey = element.getAttribute("data-i18n-aria-label");
        element.setAttribute("aria-label", t(translationKey));
        if (!element.getAttribute("alt")) {
            return;
        }
        element.setAttribute("alt", t(translationKey));
    });

    document.documentElement.lang = currentLanguage;
}

export function setLanguage(language, options = {}) {
    const { persist = true } = options;
    const normalizedLanguage = normalizeLanguage(language);

    if (!normalizedLanguage) {
        return;
    }

    currentLanguage = normalizedLanguage;

    if (persist) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    }

    applyTranslations();

    window.dispatchEvent(new CustomEvent("thumbnail-grabber-language-change", {
        detail: { language: normalizedLanguage }
    }));
}

export function getLanguage() {
    return currentLanguage;
}

export function initI18n(selectElementId = "languageSelect") {
    currentLanguage = resolveLanguage();

    const languageSelect = document.getElementById(selectElementId);
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener("change", (event) => {
            setLanguage(event.target.value, { persist: true });
        });
    }

    applyTranslations();
}
