class ZEngine {
    constructor() {
        this.dicts = { es: [], en: [] };
        this.charPool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    }

    async init() {
        const load = async (lang, file) => {
            try {
                const r = await fetch(file);
                if (!r.ok) return;
                this.dicts[lang] = await r.json();
                document.getElementById(`st-${lang}`).classList.add('ready');
                document.getElementById(`st-${lang}`).innerText = `${lang.toUpperCase()}_DB: ${this.dicts[lang].length}`;
            } catch (e) { console.warn(`Error en DB ${lang}`); }
        };
        await Promise.allSettled([
            load('es', './diccionario_es.json'),
            load('en', './dictionary_en.json')
        ]);
    }

    // Shannon
    calculateShannon(val) {
    if (!val) return 0;
    const len = val.length;
    const freq = {};
    for (let char of val) freq[char] = (freq[char] || 0) + 1;

    let h = 0;
    for (let char in freq) {
        let p = freq[char] / len;
        h -= p * Math.log2(p);
    }

    // Retornamos solo la entropía de información real
    return (h * len).toFixed(2);
}

    generate(mode, lang) {
        const rnd = (max) => window.crypto.getRandomValues(new Uint32Array(1))[0] % max;
        if (mode === 'phrase') {
            const d = this.dicts[lang].length ? this.dicts[lang] : this.dicts.es;
            return Array.from({length: 6}, () => d[rnd(d.length)]).join('-');
        }
        return Array.from({length: 24}, () => this.charPool[rnd(this.charPool.length)]).join('');
    }
}

// Ini
const core = new ZEngine();
core.init();