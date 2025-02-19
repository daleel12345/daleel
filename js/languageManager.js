class LanguageManager {
    constructor() {
        this.languages = ['fa', 'en', 'ar'];
        this.currentLang = localStorage.getItem('selectedLang') || 'ar';
        this.translations = {};
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            this.translations = await response.json();
            this.applyTranslations();
            this.setDocumentDirection();
            this.updateLanguageToggle();
            localStorage.setItem('selectedLang', lang);
            this.loadDynamicContent();
        } catch (error) {
            console.error('Error loading language:', error);
        }
    }

    applyTranslations() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const keys = element.dataset.lang.split('.');
            let value = this.translations;
            
            keys.forEach(key => {
                value = value?.[key];
            });

            if (value) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    setDocumentDirection() {
        document.documentElement.dir = this.currentLang === 'en' ? 'ltr' : 'rtl';
        document.documentElement.lang = this.currentLang;
    }

    updateLanguageToggle() {
        const langNames = {
            ar: 'English',
            fa: 'فارسی',
            en: 'العربية'
        };
        document.getElementById('languageToggle').textContent = langNames[this.currentLang];
    }

    loadDynamicContent() {
        // Load timeline events
        if (this.translations.history?.events) {
            const timelineContainer = document.getElementById('timelineContainer');
            timelineContainer.innerHTML = this.translations.history.events
                .map(event => `
                    <div class="timeline-item">
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                    </div>
                `).join('');
        }

        // Load gallery images
        if (this.translations.gallery?.images) {
            const galleryContainer = document.getElementById('galleryContainer');
            galleryContainer.innerHTML = this.translations.gallery.images
                .map(img => `<img src="${img.src}" alt="${img.alt}">`)
                .join('');
        }
    }

    switchLanguage() {
        const currentIndex = this.languages.indexOf(this.currentLang);
        this.currentLang = this.languages[(currentIndex + 1) % this.languages.length];
        this.loadLanguage(this.currentLang);
    }
}

// Initialize
const languageManager = new LanguageManager();
document.getElementById('languageToggle').addEventListener('click', () => languageManager.switchLanguage());
window.addEventListener('DOMContentLoaded', () => languageManager.loadLanguage(languageManager.currentLang));