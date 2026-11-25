# ReadmeForge

> Paste a GitHub repo link and get a professional README in one click. No sign-up, no server.

> الصق رابط أي ريبو على GitHub واحصل على README احترافي بضغطة. من غير تسجيل ومن غير سيرفر.

**Live demo / الديمو:** https://mostaaafaomran-ctrl.github.io/readmeforge/

![Home](screenshot-home-ar.png)

## Features / المميزات

- Reads the repo through the public GitHub API, right in your browser.
- Detects the stack (Node, Python, Rust, Go, Java, Docker, React, Vue, Vite and more) and the install and run commands.
- Three templates: minimal, standard, detailed.
- Output in English, Arabic, or both.
- Editable fields, section toggles, live preview, raw Markdown, copy and download.
- Manual mode: write a README without a repo.
- Arabic RTL interface with an English toggle.

---

- بيقرا الريبو من GitHub API مباشرة في المتصفح.
- بيكتشف التقنيات (Node وPython وRust وGo وJava وDocker وReact وVue وVite وغيرها) وأوامر التثبيت والتشغيل.
- ثلاث قوالب: مختصر وعادي ومفصّل.
- الناتج بالإنجليزي أو العربي أو الاتنين.
- حقول قابلة للتعديل، وإخفاء الأقسام، ومعاينة مباشرة، ونسخ وتحميل.
- وضع يدوي: اكتب README من غير ريبو.
- واجهة عربي بالكامل مع زرار إنجليزي.

## Screenshots / الصور

![Result in Arabic UI](screenshot-result-ar.png)
![Result in English UI](screenshot-result-en.png)

## Run locally / التشغيل محلياً

```bash
git clone https://github.com/mostaaafaomran-ctrl/readmeforge.git
cd readmeforge
python3 -m http.server 8000
```

Open http://localhost:8000. There is no build step.

افتح http://localhost:8000. مفيش خطوة build.

## Limits / ملاحظات

The GitHub API allows 60 requests per hour per IP without a token. If you hit it, wait a bit or use manual mode.

GitHub API بيسمح بـ 60 طلب في الساعة لكل IP من غير توكن. لو وصلت للحد استنى شوية أو استخدم الوضع اليدوي.

## Contributing / المساهمة

Contributions are welcome. Fork the repo, create a branch, and open a pull request. Ideas: more stack detection, more templates, badges.

المساهمات مرحب بيها. اعمل Fork وافتح فرع وابعت Pull Request.

## License / الرخصة

MIT. See [LICENSE](LICENSE).

---
If this project helps you, give it a star. لو المشروع فادك، سيب ⭐
