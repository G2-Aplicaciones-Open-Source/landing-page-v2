/**
 * Módulo de internacionalización
 * Maneja la carga y cambio de idiomas usando i18next
 */

const I18nManager = {
    // Configuración
    config: {
        defaultLanguage: 'es',
        debug: false, // Cambiar a true para debugging
        localesPath: 'locales'
    },

    // Estado
    isInitialized: false,
    loadedLanguages: new Set(),

    async init() {
        try {
            await this.loadResources();
            await this.initializeI18next();
            this.setupLanguageSwitcher();
            this.isInitialized = true;

            console.log('i18n inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando i18n:', error);
        }
    },

    async loadResources() {
        const languages = ['en', 'es'];
        const resources = {};

        for (const lang of languages) {
            try {
                const data = await this.loadLocale(lang);
                resources[lang] = { translation: data };
                this.loadedLanguages.add(lang);
            } catch (error) {
                console.warn(`No se pudo cargar el idioma ${lang}:`, error);
            }
        }

        this.resources = resources;
    },

    async loadLocale(lang) {
        const response = await fetch(`${this.config.localesPath}/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    async initializeI18next() {
        return new Promise((resolve, reject) => {
            i18next.init({
                lng: this.config.defaultLanguage,
                debug: this.config.debug,
                resources: this.resources,
                fallbackLng: 'es',
                interpolation: {
                    escapeValue: false // React ya escapa por defecto
                }
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.translatePage();
                    resolve();
                }
            });
        });
    },

    setupLanguageSwitcher() {
        // Conectar con el módulo LanguageSwitcher si está disponible
        if (window.AppModules && window.AppModules.LanguageSwitcher) {
            window.AppModules.LanguageSwitcher.onLanguageSelected = (lang) => {
                this.changeLanguage(lang);
            };
        }
    },

    async changeLanguage(lang) {
        try {
            // Cargar idioma si no está disponible
            if (!this.loadedLanguages.has(lang)) {
                await this.loadAndAddLanguage(lang);
            }

            // Cambiar idioma
            i18next.changeLanguage(lang, (err) => {
                if (err) {
                    console.error('Error cambiando idioma:', err);
                    return;
                }

                this.translatePage();
                this.updateLanguageButton(lang);
                console.log(`Idioma cambiado a: ${lang}`);
            });
        } catch (error) {
            console.error('Error en changeLanguage:', error);
        }
    },

    async loadAndAddLanguage(lang) {
        try {
            const data = await this.loadLocale(lang);
            i18next.addResourceBundle(lang, 'translation', data);
            this.loadedLanguages.add(lang);
        } catch (error) {
            console.error(`Error cargando idioma ${lang}:`, error);
            throw error;
        }
    },

    translatePage() {
        // Traducir título de la página
        if (i18next.exists('header.title')) {
            document.title = i18next.t('header.title');
        }

        // Traducir todos los elementos con data-i18n
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");

            if (i18next.exists(key)) {
                // Manejar diferentes tipos de contenido
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'email')) {
                    el.placeholder = i18next.t(key);
                } else if (el.hasAttribute('title')) {
                    el.title = i18next.t(key);
                } else {
                    el.textContent = i18next.t(key);
                }
            } else {
                console.warn(`Clave de traducción no encontrada: ${key}`);
            }
        });

        // Traducir elementos con data-i18n-html (para contenido HTML)
        document.querySelectorAll("[data-i18n-html]").forEach(el => {
            const key = el.getAttribute("data-i18n-html");
            if (i18next.exists(key)) {
                el.innerHTML = i18next.t(key);
            }
        });
    },

    updateLanguageButton(lang) {
        const button = document.querySelector('.language-button');
        if (button) {
            // Actualizar texto del botón con el idioma actual
            const langTexts = {
                'es': 'ES',
                'en': 'EN'
            };
            button.textContent = langTexts[lang] || lang.toUpperCase();
        }
    },

    // Método público para obtener traducción
    t(key, options = {}) {
        if (!this.isInitialized) {
            console.warn('i18n no inicializado aún');
            return key;
        }
        return i18next.t(key, options);
    },

    // Método para obtener el idioma actual
    getCurrentLanguage() {
        return i18next.language || this.config.defaultLanguage;
    },

    // Método para verificar si un idioma está disponible
    isLanguageAvailable(lang) {
        return this.loadedLanguages.has(lang);
    }
};

// Inicialización automática cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    I18nManager.init();
});

// Exportar para uso global
window.I18nManager = I18nManager;