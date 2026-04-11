import { SECTIONS } from './sections';

// ── Coven data ────────────────────────────────────────────────────────────────

const COVEN_BY_TAG = {
  камерная: {
    name: 'Волшебница камерной магии',
    description: 'Вы работаете тихо, точно и глубоко. Ваша сила не в шуме, а в качестве влияния. Вы умеете менять состояние, возвращать человеку опору и создавать настоящую ценность без лишнего блеска. Ваш путь — не громкое завоевание пространства, а тонкое мастерство, которое хочется рекомендовать дальше.',
  },
  огонь: {
    name: 'Хранительница внутреннего огня',
    description: 'В вас живёт энергия пробуждения. Вы возвращаете человеку силу, смелость и желание снова двигаться. Там, где другие уговаривают, вы зажигаете. Ваш дар — оживлять внутренний импульс и напоминать: живое уже есть, его нужно не изобрести, а разжечь.',
  },
  слова: {
    name: 'Заклинательница смыслов',
    description: 'Вы умеете находить слова для тонкого и сложного. Там, где у человека путаница, у вас рождается ясность. Вы собираете смыслы, оформляете ценность и превращаете внутреннее знание в понятное послание. Ваше волшебство — в точных формулировках, которые меняют направление пути.',
  },
  путь: {
    name: 'Лоцман звёздных дорог',
    description: 'Вы помогаете не просто понять себя, а увидеть маршрут. Ваша сила — в направлении, выборе курса и движении через неопределённость. Вы умеете быть проводником там, где человек ещё не видит карту, но уже чувствует зов. С вами путь становится различимым.',
  },
  сопровождение: {
    name: 'Хранительница пути',
    description: 'Вы не только зажигаете и направляете, но и помогаете дойти. В вашей энергии есть устойчивость, верность процессу и спокойная глубина. Вы умеете удерживать движение без суеты, сопровождать перемены и превращать разовый порыв в настоящий путь. Ваше волшебство — в зрелом проведении через этапы.',
  },
};

const COVEN_TAG_PRIORITY = ['камерная', 'слова', 'путь', 'огонь', 'сопровождение'];

// ── Type data (full descriptions from spec) ───────────────────────────────────

const TYPE_BY_TAG = {
  искрящаяся: {
    name: 'Искрящаяся',
    description: 'В вас много внутреннего огня. Вы чувствуете свою ценность, вы смелы и вдохновляющи — но ваш свет ещё ищет точный язык, чтобы стать видимым для других. Ключевая тема: «Во мне уже есть свет, мне нужно позволить ему быть заметным».',
    risk: 'Много внутреннего огня, но мало упаковки.',
    nextStep: 'Учитесь формулировать ценность коротко и спокойно — так ваш внутренний огонь станет виден другим.',
  },
  лунная: {
    name: 'Лунная',
    description: 'Вы хотите проявляться — но без насилия над собой. Мягкость, безопасность и бережность — ваши ориентиры. Вы интуитивно выбираете шаги с низким сопротивлением, и в этом есть мудрость. Ключевая тема: «Я хочу проявляться без насилия над собой».',
    risk: 'Риск — затянуть подготовку и долго не выходить в действие.',
    nextStep: 'Выбирайте микро-шаги с низким эмоциональным сопротивлением — они двигают вперёд мягче всего.',
  },
  сердечная: {
    name: 'Сердечная',
    description: 'Для вас важно, чтобы проявление не разрушало вашу подлинность. Вы помогаете от сердца, цените человечность и хотите делать «по-своему». Забота о других — ваша настоящая сила. Ключевая тема: «Для меня важно, чтобы проявление не разрушало мою подлинность».',
    risk: 'Риск — растворяться в заботе о других и не оформлять собственную ценность.',
    nextStep: 'Называйте результат своей работы без стыда — это ваш вклад, а не хвастовство.',
  },
  ясная: {
    name: 'Ясная',
    description: 'Вы сильны там, где нужно распутать сложное. Ясность, структура, понятные формулировки — ваша территория. Вы умеете превращать путаницу в порядок и хаос в систему. Ключевая тема: «Я сильна там, где нужно распутать сложное».',
    risk: 'Риск — уйти в идеальную упаковку и не начать говорить с людьми.',
    nextStep: 'Раньше переходите от идеальной формулировки к реальному разговору с людьми.',
  },
  звёздная: {
    name: 'Звёздная',
    description: 'Вы помогаете увидеть, куда идти дальше. Путь, направление, следующий уровень — вот ваш язык. Вы чувствуете движение и помогаете другим найти свой маршрут. Ключевая тема: «Я помогаю увидеть, куда идти дальше».',
    risk: 'Риск — формулировка слишком широкая и абстрактная.',
    nextStep: 'Сузьте аудиторию и назовите конкретную точку результата — это усилит ваше послание.',
  },
  светлая: {
    name: 'Светлая',
    description: 'Вы собираете человека в целое. Соединять смыслы, собирать хаос в систему, превращать разрозненное в понятное — это ваш дар. Ключевая тема: «Я собираю человека в целое».',
    risk: 'Риск — сложно объяснить результат на простом языке.',
    nextStep: 'Замените абстрактные слова на наблюдаемый эффект — так клиент услышит вас быстрее.',
  },
  меняющая: {
    name: 'Меняющая мир',
    description: 'Вы рядом в моменты перехода. Там, где человек разворачивает жизнь или работу, вы — проводник и опора. Вы умеете поддержать движение через неопределённость. Ключевая тема: «Я рядом в моменты перехода».',
    risk: 'Риск — перегрузить человека глубиной и сложностью пути.',
    nextStep: 'Продавайте не весь путь, а первый ясный этап — это снижает порог входа.',
  },
  хранительница: {
    name: 'Хранительница',
    description: 'Со вами человек снова встаёт на свои ноги. Спокойствие, устойчивость, бережное сопровождение — вот ваша сила. Вы умеете удерживать пространство, где человек чувствует опору. Ключевая тема: «Со мной человек снова встаёт на свои ноги».',
    risk: 'Риск — недооценивать ценность своей работы, потому что она кажется "естественной".',
    nextStep: 'Фиксируйте конкретный результат, который получает клиент благодаря вашей опоре.',
  },
  мудрая: {
    name: 'Мудрая',
    description: 'Вы умеете дать имя тому, что человек чувствует, но не может сказать. Формулировки, ясное послание, смысл, оформление экспертности — ваша территория. Ключевая тема: «Я умею дать имя тому, что человек чувствует, но не может сказать».',
    risk: 'Риск — остаться "внутренним переводчиком", не сделав коммерческого предложения.',
    nextStep: 'Свяжите смысл с форматом, продуктом и стоимостью — ваш дар уже оформлен внутри.',
  },
  проявленная: {
    name: 'Проявленная',
    description: 'Вы не обязаны быть громкой, чтобы быть заметной. У вас сбалансированный подход: вы видите и ценность, и аудиторию, и результат, и следующий шаг. Ключевая тема: «Я не обязана быть громкой, чтобы быть заметной».',
    risk: 'Риск — двигаться слишком осторожно и не наращивать масштаб.',
    nextStep: 'После первого безопасного проявления переходите к повторяемой системе.',
  },
};

const TYPE_TAG_PRIORITY = [
  'ясная', 'мудрая', 'звёздная', 'хранительница',
  'искрящаяся', 'светлая', 'сердечная', 'меняющая', 'лунная',
];

// ── Tally helper ──────────────────────────────────────────────────────────────

function tallyTags(tags, priorityOrder) {
  const counts = {};
  for (const tag of tags) if (tag) counts[tag] = (counts[tag] || 0) + 1;
  let best = null, bestCount = 0;
  // Priority order resolves ties deterministically
  for (const tag of priorityOrder) {
    if ((counts[tag] || 0) > bestCount) { best = tag; bestCount = counts[tag]; }
  }
  // Pick any tag not in priority list if it has more votes
  for (const [tag, count] of Object.entries(counts)) {
    if (count > bestCount) { best = tag; bestCount = count; }
  }
  return best;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Resolve coven from chosenOptions = { symbolId: { covenTag, typeTag } }
 */
export function resolveCovenByOptions(chosenOptions) {
  const tags = Object.values(chosenOptions || {}).map(o => o?.covenTag).filter(Boolean);
  const tag = tallyTags(tags, COVEN_TAG_PRIORITY) || 'камерная';
  return COVEN_BY_TAG[tag] || COVEN_BY_TAG['камерная'];
}

/**
 * Resolve typology from chosenOptions = { symbolId: { covenTag, typeTag } }
 */
export function resolveTypeByOptions(chosenOptions) {
  const tags = Object.values(chosenOptions || {}).map(o => o?.typeTag).filter(Boolean);
  if (!tags.length) return TYPE_BY_TAG['проявленная'];
  const tag = tallyTags(tags, TYPE_TAG_PRIORITY);
  return TYPE_BY_TAG[tag] || TYPE_BY_TAG['проявленная'];
}

/**
 * Build manifest fields from scrollEntries.
 * scrollEntries = { symbolId: "question\nopt1, opt2, opt3" }
 * Finds the matching scenario by question text to get the correct manifestPrefix.
 */
export function buildManifestFields(scrollEntries) {
  const symbolOrder = ['spark', 'star', 'heart', 'key', 'moon'];
  return symbolOrder.map(symbolId => {
    const section = SECTIONS[symbolId];
    const raw = scrollEntries?.[symbolId];
    if (!raw) return { label: section.manifestLabel, value: null };

    const nlIdx = raw.indexOf('\n');
    if (nlIdx === -1) return { label: section.manifestLabel, value: raw.trim() };

    const questionText = raw.slice(0, nlIdx).trim();
    const answerText   = raw.slice(nlIdx + 1).trim();

    // Match scenario by question text to get the right prefix
    const scenario = section.scenarios.find(s => s.question === questionText);
    const prefix   = scenario?.manifestPrefix ?? '';

    const value = prefix
      ? `${prefix}${prefix.endsWith(' ') ? '' : ' '}${answerText}`
      : answerText;

    return { label: section.manifestLabel, value };
  });
}

/**
 * Generate a clean print-ready HTML string for a new-window PDF export.
 */
export function buildPrintHTML(fields, coven, type) {
  const fieldsHtml = fields.map(({ label, value }) => `
    <div class="section">
      <div class="label">${label}</div>
      <div class="value">${value || '<span class="empty">не заполнено</span>'}</div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Моя магия проявления</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1a1025;
         padding: 40px 48px; max-width: 580px; margin: 0 auto; }
  h1 { font-size: 22px; text-align: center; color: #7a5800; margin-bottom: 4px;
       letter-spacing: 0.06em; }
  .subtitle { text-align: center; font-size: 11px; color: #9a8050; margin-bottom: 28px;
              letter-spacing: 0.12em; text-transform: uppercase; }
  .section { border: 1px solid #c9a227; border-radius: 8px; padding: 13px 17px;
             margin-bottom: 10px; }
  .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em;
           color: #9a7a1a; font-weight: 700; margin-bottom: 5px; }
  .value { font-size: 15px; color: #1a1025; line-height: 1.5; }
  .empty { color: #bbb; font-style: italic; }
  hr { border: none; border-top: 1px solid #c9a227; margin: 22px 0; }
  .coven { background: #fdf8e8; border: 1.5px solid #c9a227; border-radius: 8px;
           padding: 15px 18px; margin-bottom: 12px; }
  .coven-name { font-size: 17px; font-weight: 700; color: #7a5800; margin-bottom: 8px; }
  .coven-desc { font-size: 13px; color: #4a3820; line-height: 1.55; font-style: italic; }
  .type { border: 1.5px solid #b0b8c8; border-radius: 8px; padding: 15px 18px; }
  .type-name { font-size: 17px; font-weight: 700; color: #2a3848; margin-bottom: 6px; }
  .type-desc { font-size: 13px; color: #3a4858; line-height: 1.55; font-style: italic;
               margin-bottom: 10px; }
  .type-risk { font-size: 12px; color: #7a6858; line-height: 1.4; margin-bottom: 8px; }
  .type-step { font-size: 13px; color: #1a2838; line-height: 1.5; }
  .type-step strong { color: #5a6878; }
  @media print { @page { margin: 15mm; } body { padding: 0; } }
</style>
</head>
<body>
<h1>✦ Моя магия проявления</h1>
<p class="subtitle">Личный профиль · Путь тихой магии</p>
${fieldsHtml}
<hr>
<div class="coven">
  <div class="label">Ваш ковен</div>
  <div class="coven-name">${coven.name}</div>
  <div class="coven-desc">${coven.description}</div>
</div>
<div class="type">
  <div class="label">Тип проявления</div>
  <div class="type-name">${type.name}</div>
  <div class="type-desc">${type.description}</div>
  <div class="type-risk"><em>Риск:</em> ${type.risk}</div>
  <div class="type-step"><strong>Следующий шаг:</strong> ${type.nextStep}</div>
</div>
</body>
</html>`;
}
