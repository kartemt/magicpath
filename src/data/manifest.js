import { SECTIONS } from './sections';

// ── Lookup helpers ────────────────────────────────────────────────────────────

// Find option entry by matching chosen text against all scenarios of a symbol
function findOption(symbolId, optionText) {
  const section = SECTIONS[symbolId];
  if (!section) return null;
  for (const scenario of section.scenarios) {
    const opt = scenario.options.find(o => o.text === optionText);
    if (opt) return { opt, scenario };
  }
  return null;
}

// Extract the chosen option text from a scroll entry ("question\noptionText")
function extractOptionText(raw) {
  if (!raw) return null;
  const idx = raw.indexOf('\n');
  return idx === -1 ? raw.trim() : raw.slice(idx + 1).trim();
}

// ── Coven resolution ──────────────────────────────────────────────────────────

const COVEN_BY_TAG = {
  камерная:       { name: 'Волшебница камерной магии',       description: 'Вы работаете тихо, точно и глубоко. Ваша сила не в шуме, а в качестве влияния. Вы умеете менять состояние, возвращать человеку опору и создавать настоящую ценность без лишнего блеска. Ваш путь — не громкое завоевание пространства, а тонкое мастерство, которое хочется рекомендовать дальше.' },
  огонь:          { name: 'Хранительница внутреннего огня',  description: 'В вас живёт энергия пробуждения. Вы возвращаете человеку силу, смелость и желание снова двигаться. Там, где другие уговаривают, вы зажигаете. Ваш дар — оживлять внутренний импульс и напоминать: живое уже есть, его нужно не изобрести, а разжечь.' },
  слова:          { name: 'Заклинательница смыслов',          description: 'Вы умеете находить слова для тонкого и сложного. Там, где у человека путаница, у вас рождается ясность. Вы собираете смыслы, оформляете ценность и превращаете внутреннее знание в понятное послание. Ваше волшебство — в точных формулировках, которые меняют направление пути.' },
  путь:           { name: 'Лоцман звёздных дорог',            description: 'Вы помогаете не просто понять себя, а увидеть маршрут. Ваша сила — в направлении, выборе курса и движении через неопределённость. Вы умеете быть проводником там, где человек ещё не видит карту, но уже чувствует зов. С вами путь становится различимым.' },
  сопровождение:  { name: 'Хранительница пути',               description: 'Вы не только зажигаете и направляете, но и помогаете дойти. В вашей энергии есть устойчивость, верность процессу и спокойная глубина. Вы умеете удерживать движение без суеты, сопровождать перемены и превращать разовый порыв в настоящий путь. Ваше волшебство — в зрелом проведении через этапы.' },
};

const COVEN_TAG_PRIORITY = ['камерная', 'слова', 'путь', 'огонь', 'сопровождение'];

// ── Type resolution ───────────────────────────────────────────────────────────

const TYPE_BY_TAG = {
  искрящаяся:   { name: 'Искрящаяся',    nextStep: 'Учитесь формулировать ценность коротко и спокойно — так внутренний огонь станет виден другим.' },
  лунная:       { name: 'Лунная',         nextStep: 'Выбирайте микро-шаги с низким эмоциональным сопротивлением — они двигают вперёд мягче всего.' },
  сердечная:    { name: 'Сердечная',      nextStep: 'Называйте результат своей работы без стыда — это ваш вклад, а не хвастовство.' },
  ясная:        { name: 'Ясная',          nextStep: 'Раньше переходите от идеальной формулировки к реальному разговору с людьми.' },
  звёздная:     { name: 'Звёздная',       nextStep: 'Сузьте аудиторию и назовите конкретную точку результата — это усилит послание.' },
  светлая:      { name: 'Светлая',        nextStep: 'Замените абстрактные слова на наблюдаемый эффект — так клиент услышит вас быстрее.' },
  меняющая:     { name: 'Меняющая мир',   nextStep: 'Продавайте не весь путь, а первый ясный этап — это снижает порог входа.' },
  хранительница:{ name: 'Хранительница',  nextStep: 'Фиксируйте конкретный результат, который получает клиент благодаря вашей опоре.' },
  мудрая:       { name: 'Мудрая',         nextStep: 'Свяжите смысл с форматом, продуктом и стоимостью — ваш дар уже оформлен внутри.' },
  проявленная:  { name: 'Проявленная',    nextStep: 'После первого безопасного проявления переходите к повторяемой системе.' },
};

const TYPE_TAG_PRIORITY = ['ясная', 'мудрая', 'звёздная', 'хранительница', 'искрящаяся', 'светлая', 'сердечная', 'меняющая', 'лунная'];

// ── Tally helper ──────────────────────────────────────────────────────────────

function tallyTags(tags, priorityOrder) {
  const counts = {};
  for (const tag of tags) counts[tag] = (counts[tag] || 0) + 1;
  let best = null, bestCount = 0;
  for (const tag of priorityOrder) {
    if ((counts[tag] || 0) > bestCount) { best = tag; bestCount = counts[tag]; }
  }
  // Also check any tags not in priority list
  for (const [tag, count] of Object.entries(counts)) {
    if (count > bestCount) { best = tag; bestCount = count; }
  }
  return best;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Given chosenOptions = {symbolId: {covenTag, typeTag}}, resolve coven.
 */
export function resolveCovenByOptions(chosenOptions) {
  const tags = Object.values(chosenOptions).map(o => o.covenTag).filter(Boolean);
  const tag = tallyTags(tags, COVEN_TAG_PRIORITY) || 'камерная';
  return COVEN_BY_TAG[tag] || COVEN_BY_TAG['камерная'];
}

/**
 * Given chosenOptions = {symbolId: {covenTag, typeTag}}, resolve type.
 */
export function resolveTypeByOptions(chosenOptions) {
  const tags = Object.values(chosenOptions).map(o => o.typeTag).filter(Boolean);
  if (!tags.length) return TYPE_BY_TAG['проявленная'];
  const tag = tallyTags(tags, TYPE_TAG_PRIORITY);
  if (!tag) return TYPE_BY_TAG['проявленная'];
  return TYPE_BY_TAG[tag] || TYPE_BY_TAG['проявленная'];
}

/**
 * Build manifest fields from scrollEntries + sections data.
 * Returns array of {label, value} for each of the 5 symbols.
 */
export function buildManifestFields(scrollEntries) {
  const symbolOrder = ['spark', 'star', 'heart', 'key', 'moon'];
  return symbolOrder.map(symbolId => {
    const section = SECTIONS[symbolId];
    const raw = scrollEntries?.[symbolId];
    const optionText = extractOptionText(raw);
    if (!optionText) {
      return { label: section.manifestLabel, value: null };
    }
    const found = findOption(symbolId, optionText);
    const prefix = found ? found.scenario.manifestPrefix : '';
    return { label: section.manifestLabel, value: prefix + optionText };
  });
}
