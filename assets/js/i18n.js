(function () {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  var PAGE_TITLES = {
    en: {
      '/': 'Ezequiel Amador, Staff Engineer',
      '/about/': 'About — Ezequiel Amador',
      '/experience/': 'Experience — Ezequiel Amador',
      '/projects/': 'Projects — Ezequiel Amador',
      '/education/': 'Education — Ezequiel Amador',
      '/contact/': 'Contact — Ezequiel Amador',
    },
    es: {
      '/': 'Ezequiel Amador, Staff Engineer',
      '/about/': 'Sobre mí — Ezequiel Amador',
      '/experience/': 'Experiencia — Ezequiel Amador',
      '/projects/': 'Proyectos — Ezequiel Amador',
      '/education/': 'Educación — Ezequiel Amador',
      '/contact/': 'Contacto — Ezequiel Amador',
    },
  };

  function detectLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && window.translations && window.translations[stored]) return stored;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('es')) return 'es';
    return DEFAULT_LANG;
  }

  document.addEventListener('alpine:init', function () {
    var initialLang = detectLang();
    document.documentElement.lang = initialLang;

    Alpine.store('i18n', {
      lang: initialLang,
      path: window.location.pathname,

      t: function (key) {
        var parts = key.split('.');
        var val = window.translations[this.lang];
        for (var i = 0; i < parts.length; i++) {
          if (val == null) return key;
          val = val[parts[i]];
        }
        return val != null ? val : key;
      },

      set: function (lang) {
        if (!window.translations || !window.translations[lang]) return;
        this.lang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        this.syncTitle();
      },

      syncPath: function () {
        this.path = window.location.pathname;
        this.syncTitle();
      },

      syncTitle: function () {
        var titles = PAGE_TITLES[this.lang] || PAGE_TITLES[DEFAULT_LANG];
        document.title = titles[window.location.pathname] || 'Ezequiel Amador';
      },
    });

    Alpine.store('i18n').syncTitle();
  });
})();
