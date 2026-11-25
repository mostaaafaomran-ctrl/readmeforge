const UI = {
 ar:{title:"اعمل README احترافي بضغطة",sub:"حط رابط الريبو وهنقرأ الكود ونكتبلك README جاهز. من غير تسجيل.",go:"ولّد",try:"جرّب:",manual:"أو اكتب بنفسك",
  tpl:"القالب",t_min:"مختصر",t_std:"عادي",t_det:"مفصّل",outlang:"لغة الـ README",both:"الاتنين",details:"التفاصيل",
  f_name:"اسم المشروع",f_desc:"الوصف",f_install:"أوامر التثبيت",f_usage:"أوامر التشغيل",f_features:"المميزات (سطر لكل ميزة)",f_license:"الرخصة",
  sections:"الأقسام",preview:"معاينة",raw:"Markdown",copy:"نسخ",dl:"تحميل README.md",copied:"اتنسخ ✓",
  foot:"ReadmeForge · مفتوح المصدر · كل حاجة بتحصل في متصفحك",loading:"بقرا الريبو...",done:"تمام، اتولّد. عدّل في الشمال أو في الـ Markdown.",
  nf:"الريبو مش موجود أو خاص.",rl:"وصلت لحد الطلبات من GitHub. جرب بعد شوية أو اكتب بنفسك.",bad:"اكتب رابط زي github.com/owner/repo"},
 en:{title:"A pro README in one click",sub:"Paste a repo link. We read the code and write a ready README. No sign-up.",go:"Generate",try:"Try:",manual:"or write manually",
  tpl:"Template",t_min:"Minimal",t_std:"Standard",t_det:"Detailed",outlang:"README language",both:"Both",details:"Details",
  f_name:"Project name",f_desc:"Description",f_install:"Install commands",f_usage:"Run commands",f_features:"Features (one per line)",f_license:"License",
  sections:"Sections",preview:"Preview",raw:"Markdown",copy:"Copy",dl:"Download README.md",copied:"Copied ✓",
  foot:"ReadmeForge · open source · everything runs in your browser",loading:"Reading the repo...",done:"Done. Edit on the side or in the Markdown.",
  nf:"Repo not found or private.",rl:"GitHub rate limit hit. Try later or write manually.",bad:"Enter a link like github.com/owner/repo"}
};
const S = { // README strings
 en:{features:"Features",demo:"Demo",tech:"Tech stack",install:"Installation",usage:"Usage",contrib:"Contributing",license:"License",about:"About",
  contribTxt:"Contributions are welcome. Fork the repo, create a branch, and open a pull request.",licTxt:l=>`Distributed under the ${l} license.`,
  demoTxt:"Add a screenshot or GIF here.",star:"If this project helps you, give it a ⭐"},
 ar:{features:"المميزات",demo:"الديمو",tech:"التقنيات",install:"التثبيت",usage:"الاستخدام",contrib:"المساهمة",license:"الرخصة",about:"عن المشروع",
  contribTxt:"المساهمات مرحب بيها. اعمل Fork وافتح فرع وابعت Pull Request.",licTxt:l=>`المشروع مرخص برخصة ${l}.`,
  demoTxt:"ضيف هنا صورة أو GIF للمشروع.",star:"لو المشروع فادك، سيب ⭐"}
};
const SECS=["badges","features","demo","tech","install","usage","contrib","license"];
const SECNAME={en:{badges:"Badges",features:"Features",demo:"Demo",tech:"Tech stack",install:"Installation",usage:"Usage",contrib:"Contributing",license:"License"},
 ar:{badges:"بادجات",features:"المميزات",demo:"الديمو",tech:"التقنيات",install:"التثبيت",usage:"الاستخدام",contrib:"المساهمة",license:"الرخصة"}};
const st={ui:"ar",tpl:"standard",out:"en",view:"preview",info:null,sec:Object.fromEntries(SECS.map(s=>[s,true]))};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function setUI(l){st.ui=l;document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";
 $$("[data-i]").forEach(e=>e.textContent=UI[l][e.dataset.i]);$("#langBtn").textContent=l==="ar"?"English":"العربية";
 renderChecks();}
function renderChecks(){$("#sections").innerHTML=SECS.map(s=>`<label><input type="checkbox" data-s="${s}" ${st.sec[s]?"checked":""}>${SECNAME[st.ui][s]}</label>`).join("");
 $$("#sections input").forEach(c=>c.onchange=()=>{st.sec[c.dataset.s]=c.checked;render()});}

const gh=async(path,raw)=>{const r=await fetch("https://api.github.com"+path,{headers:raw?{Accept:"application/vnd.github.raw"}:{}});
 if(r.status===404)throw new Error("nf");if(r.status===403||r.status===429)throw new Error("rl");if(!r.ok)throw new Error("nf");return raw?r.text():r.json();};
const tryGet=p=>gh(p,true).catch(()=>null);

function parseRepo(v){const m=v.trim().replace(/\.git$/,"").match(/^(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?([\w.-]+)\/([\w.-]+)/);return m?{owner:m[1],repo:m[2]}:null;}

async function analyze({owner,repo}){
 const [meta,langs,files]=await Promise.all([gh(`/repos/${owner}/${repo}`),gh(`/repos/${owner}/${repo}/languages`).catch(()=>({})),gh(`/repos/${owner}/${repo}/contents`).catch(()=>[])]);
 const names=new Set((Array.isArray(files)?files:[]).map(f=>f.name));
 const has=n=>names.has(n);
 const info={owner,repo,name:meta.name,desc:meta.description||"",url:meta.html_url,branch:meta.default_branch,homepage:meta.homepage||"",
  license:meta.license&&meta.license.spdx_id&&meta.license.spdx_id!=="NOASSERTION"?meta.license.spdx_id:"",topics:meta.topics||[],
  languages:Object.keys(langs).slice(0,4),tech:[],install:"",usage:"",features:[]};
 const clone=`git clone https://github.com/${owner}/${repo}.git\ncd ${repo}`;
 let tech=[...info.languages];
 if(has("package.json")){
  const p=JSON.parse(await tryGet(`/repos/${owner}/${repo}/contents/package.json`)||"{}");
  const deps={...p.dependencies,...p.devDependencies};const sc=p.scripts||{};
  const pm=has("pnpm-lock.yaml")?"pnpm":has("yarn.lock")?"yarn":"npm";
  const run=s=>pm==="npm"?`npm run ${s}`:`${pm} ${s}`;
  for(const [k,n] of [["react","React"],["vue","Vue"],["svelte","Svelte"],["next","Next.js"],["vite","Vite"],["express","Express"],["typescript","TypeScript"],["tailwindcss","Tailwind CSS"],["electron","Electron"]])if(deps[k])tech.push(n);
  info.install=`${clone}\n${pm} install`;
  const first=["dev","start","serve"].find(s=>sc[s]);
  info.usage=first?run(first):"";
  if(p.bin&&p.name){info.install=`npm install -g ${p.name}`;info.usage=typeof p.bin==="string"?p.name:Object.keys(p.bin)[0];}
  else if(p.main&&p.name&&!first)info.usage=`const lib = require("${p.name}");`;
  if(sc.build&&!p.bin)info.usage+=(info.usage?"\n":"")+run("build");
  if(!info.desc&&p.description)info.desc=p.description;
 }else if(has("requirements.txt")||has("pyproject.toml")||has("setup.py")){
  tech.push("Python");
  info.install=has("requirements.txt")?`${clone}\npip install -r requirements.txt`:`${clone}\npip install .`;
  info.usage=`python -m ${repo.replace(/-/g,"_")}`;
 }else if(has("Cargo.toml")){tech.push("Rust");info.install=`${clone}\ncargo build --release`;info.usage=`cargo run`;}
 else if(has("go.mod")){tech.push("Go");info.install=`${clone}\ngo build ./...`;info.usage=`go run .`;}
 else if(has("pom.xml")){tech.push("Java","Maven");info.install=`${clone}\nmvn install`;info.usage=`mvn exec:java`;}
 else info.install=clone;
 if(has("Dockerfile")){tech.push("Docker");info.usage+=(info.usage?"\n":"")+`docker build -t ${repo} .`;}
 info.tech=[...new Set(tech)];
 info.features=[];
 if(has("tests")||has("test")||has("__tests__"))info.features.push("Tested");
 if(has("Dockerfile"))info.features.push("Docker support");
 if(has("docs")||has("docs"))info.features.push("Documentation included");
 if(has("LICENSE")||info.license)info.features.push(`${info.license||"Open"} license`.trim());
 info.features.push(...info.topics.slice(0,4).map(t=>t.replace(/-/g," ")));
 return info;
}

function fillForm(i){$("#f_name").value=i.name;$("#f_desc").value=i.desc;$("#f_install").value=i.install;$("#f_usage").value=i.usage;
 $("#f_features").value=i.features.join("\n");$("#f_license").value=i.license;}
function readForm(){const i=st.info;i.name=$("#f_name").value;i.desc=$("#f_desc").value;i.install=$("#f_install").value.trim();i.usage=$("#f_usage").value.trim();
 i.features=$("#f_features").value.split("\n").map(s=>s.trim()).filter(Boolean);i.license=$("#f_license").value.trim();}

const enc=encodeURIComponent;
function build(l,i,tpl){
 const t=S[l],o=[],on=s=>st.sec[s];
 const min=tpl==="minimal",det=tpl==="detailed";
 o.push(`# ${i.name}`);
 if(on("badges")&&!min&&i.owner){
  const b=[];
  if(i.license)b.push(`![License](https://img.shields.io/badge/license-${enc(i.license).replace(/-/g,"--")}-blue)`);
  b.push(`![Stars](https://img.shields.io/github/stars/${i.owner}/${i.repo}?style=flat)`);
  if(det)b.push(`![Last commit](https://img.shields.io/github/last-commit/${i.owner}/${i.repo})`,`![Issues](https://img.shields.io/github/issues/${i.owner}/${i.repo})`);
  o.push(b.join(" "));}
 if(i.desc)o.push(`> ${i.desc}`);
 if(on("demo")&&!min)o.push(`## ${t.demo}\n\n${i.homepage?`Live: ${i.homepage}\n\n`:""}<!-- ${t.demoTxt} ![Screenshot](docs/screenshot.png) -->`);
 if(on("features")&&i.features.length)o.push(`## ${t.features}\n\n${i.features.map(f=>`- ${f}`).join("\n")}`);
 if(on("tech")&&i.tech&&i.tech.length&&!min)o.push(`## ${t.tech}\n\n${i.tech.map(x=>`\`${x}\``).join(" · ")}`);
 if(on("install")&&i.install)o.push(`## ${t.install}\n\n\`\`\`bash\n${i.install}\n\`\`\``);
 if(on("usage")&&i.usage)o.push(`## ${t.usage}\n\n\`\`\`bash\n${i.usage}\n\`\`\``);
 if(on("contrib")&&!min)o.push(`## ${t.contrib}\n\n${t.contribTxt}`+(det?`\n\n1. Fork the project\n2. \`git checkout -b feature/my-feature\`\n3. \`git commit -m "Add my feature"\`\n4. \`git push origin feature/my-feature\`\n5. Open a Pull Request`:""));
 if(on("license")&&i.license)o.push(`## ${t.license}\n\n${t.licTxt(i.license)}`);
 if(!min)o.push(`---\n${t.star}`);
 return o.join("\n\n")+"\n";
}
function generate(){
 const i=st.info;if(!i)return"";
 if(st.out==="both"){return build("en",i,st.tpl)+"\n---\n\n<div dir=\"rtl\">\n\n"+build("ar",i,st.tpl)+"\n</div>\n";}
 return build(st.out,i,st.tpl);
}
function render(preserveRaw){
 if(!st.info)return;readForm();const md=generate();
 if(!preserveRaw)$("#raw").value=md;
 $("#preview").innerHTML=marked.parse(md);
 if(st.out==="ar")$("#preview").dir="rtl";else $("#preview").dir="ltr";
}
function seg(id,key,after){$$(`#${id} button`).forEach(b=>b.onclick=()=>{$$(`#${id} button`).forEach(x=>x.classList.remove("on"));b.classList.add("on");st[key]=b.dataset.v;after&&after();});}
seg("tpl","tpl",()=>render());seg("outlang","out",()=>render());
seg("view","view",()=>{const raw=st.view==="raw";$("#raw").classList.toggle("hidden",!raw);$("#preview").classList.toggle("hidden",raw);});
$("#raw").oninput=()=>{$("#preview").innerHTML=marked.parse($("#raw").value)};
["f_name","f_desc","f_install","f_usage","f_features","f_license"].forEach(id=>$("#"+id).oninput=()=>render());
$("#langBtn").onclick=()=>setUI(st.ui==="ar"?"en":"ar");
function msg(k,err){const s=$("#status");s.textContent=UI[st.ui][k]||k;s.className="status"+(err?" err":"");}
function show(){$("#work").classList.remove("hidden");fillForm(st.info);render();}
async function run(v){
 const r=parseRepo(v);if(!r){msg("bad",1);return;}
 msg("loading");
 try{st.info=await analyze(r);show();msg("done");}catch(e){msg(e.message==="rl"?"rl":"nf",1);}
}
$("#form").onsubmit=e=>{e.preventDefault();run($("#repo").value);};
$$("[data-ex]").forEach(a=>a.onclick=e=>{e.preventDefault();$("#repo").value=a.dataset.ex;run(a.dataset.ex);});
$("#manual").onclick=e=>{e.preventDefault();st.info={owner:"",repo:"",name:"My Project",desc:"",homepage:"",license:"MIT",tech:[],install:"",usage:"",features:[]};show();msg("");};
$("#copy").onclick=async()=>{await navigator.clipboard.writeText($("#raw").value);const b=$("#copy"),t=b.textContent;b.textContent=UI[st.ui].copied;setTimeout(()=>b.textContent=t,1500);};
$("#dl").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("#raw").value],{type:"text/markdown"}));a.download="README.md";a.click();};
setUI("ar");
const h=new URLSearchParams(location.hash.slice(1));
if(h.get("lang"))setUI(h.get("lang"));
if(h.get("repo")){$("#repo").value=h.get("repo");run(h.get("repo"));}
