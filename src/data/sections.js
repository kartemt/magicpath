// ── Section data ──────────────────────────────────────────────────────────────
// Each symbol maps to a section with 3 scenarios.
// Each scenario has a question, a manifestPrefix (prepended to chosen option text
// to form the manifest field value), and options with covenTag + typeTag.
//
// covenTags: камерная | огонь | слова | путь | сопровождение
// typeTags:  искрящаяся | лунная | сердечная | ясная | звёздная |
//            светлая | меняющая | хранительница | мудрая | проявленная

export const SECTIONS = {
  spark: {
    sectionTitle: 'Моя ценность',
    manifestLabel: 'Моя ценность',
    scenarios: [
      {
        id: 'spark_1',
        question: 'Мне проще всего признать, что моя сила в том, что я…',
        manifestPrefix: 'я ',
        options: [
          { text: 'помогаю увидеть суть',           covenTag: 'слова',          typeTag: 'мудрая' },
          { text: 'помогаю навести порядок',         covenTag: 'сопровождение',  typeTag: 'ясная' },
          { text: 'помогаю принять решение',         covenTag: 'путь',           typeTag: 'звёздная' },
          { text: 'помогаю почувствовать опору',     covenTag: 'камерная',       typeTag: 'хранительница' },
          { text: 'помогаю дойти до результата',     covenTag: 'сопровождение',  typeTag: 'хранительница' },
        ],
      },
      {
        id: 'spark_2',
        question: 'После работы со мной у людей чаще всего появляется…',
        manifestPrefix: 'после работы со мной появляется ',
        options: [
          { text: 'ясность',         covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'спокойствие',     covenTag: 'камерная',      typeTag: 'лунная' },
          { text: 'уверенность',     covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'структура',       covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'движение вперёд', covenTag: 'путь',          typeTag: 'звёздная' },
        ],
      },
      {
        id: 'spark_3',
        question: 'Во мне особенно ценно то, что я умею…',
        manifestPrefix: 'я умею ',
        options: [
          { text: 'слушать глубже слов',          covenTag: 'камерная',      typeTag: 'сердечная' },
          { text: 'замечать скрытое',              covenTag: 'камерная',      typeTag: 'мудрая' },
          { text: 'соединять разрозненное',        covenTag: 'слова',         typeTag: 'светлая' },
          { text: 'превращать хаос в систему',     covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'поддерживать без давления',     covenTag: 'камерная',      typeTag: 'хранительница' },
        ],
      },
    ],
  },

  star: {
    sectionTitle: 'Для кого я полезна',
    manifestLabel: 'Для кого я полезна',
    scenarios: [
      {
        id: 'star_1',
        question: 'Мне легче всего помогать тем, кто сейчас…',
        manifestPrefix: 'для тех, кто ',
        options: [
          { text: 'застрял и не может сдвинуться',          covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'устал и потерял опору',                   covenTag: 'камерная',      typeTag: 'сердечная' },
          { text: 'вырос, но не понимает следующий шаг',     covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'сомневается в себе',                      covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'хочет изменений, но боится начать',       covenTag: 'огонь',         typeTag: 'меняющая' },
        ],
      },
      {
        id: 'star_2',
        question: 'Ко мне чаще всего тянутся люди, которым важно…',
        manifestPrefix: 'для людей, которым важно ',
        options: [
          { text: 'разобраться в себе',               covenTag: 'слова',         typeTag: 'мудрая' },
          { text: 'навести порядок в делах',           covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'выйти на новый уровень',            covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'мягко пройти перемены',             covenTag: 'камерная',      typeTag: 'меняющая' },
          { text: 'собрать себя и свои смыслы',        covenTag: 'слова',         typeTag: 'светлая' },
        ],
      },
      {
        id: 'star_3',
        question: 'Мой человек — это тот, кто…',
        manifestPrefix: 'мой человек — тот, кто ',
        options: [
          { text: 'много знает, но не может собраться',              covenTag: 'слова',    typeTag: 'светлая' },
          { text: 'давно помогает другим, но не проявляется сам',    covenTag: 'огонь',    typeTag: 'искрящаяся' },
          { text: 'чувствует потенциал, но не оформил его',          covenTag: 'слова',    typeTag: 'мудрая' },
          { text: 'хочет системности без жёсткости',                 covenTag: 'камерная', typeTag: 'ясная' },
          { text: 'ищет свой способ проявляться',                    covenTag: 'огонь',    typeTag: 'искрящаяся' },
        ],
      },
    ],
  },

  heart: {
    sectionTitle: 'Как я называю свой результат',
    manifestLabel: 'Мой результат',
    scenarios: [
      {
        id: 'heart_1',
        question: 'После работы со мной человек приходит к…',
        manifestPrefix: 'привожу к ',
        options: [
          { text: 'ясности в следующем шаге',                   covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'внутренней опоре',                            covenTag: 'камерная',      typeTag: 'хранительница' },
          { text: 'собранному плану действий',                   covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'более смелому проявлению',                    covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'ощущению «теперь я знаю, как идти»',         covenTag: 'путь',          typeTag: 'звёздная' },
        ],
      },
      {
        id: 'heart_2',
        question: 'Я бы назвала свой результат так:',
        manifestPrefix: '',
        options: [
          { text: 'ясность',       covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'опора',         covenTag: 'камерная',      typeTag: 'хранительница' },
          { text: 'собранность',   covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'проявленность', covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'движение',      covenTag: 'путь',          typeTag: 'звёздная' },
        ],
      },
      {
        id: 'heart_3',
        question: 'Ближе всего мне такая формулировка:',
        manifestPrefix: 'я ',
        options: [
          { text: 'помогаю увидеть путь',                        covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'помогаю собрать сильную основу',               covenTag: 'сопровождение', typeTag: 'хранительница' },
          { text: 'помогаю перейти от сомнений к действию',       covenTag: 'огонь',         typeTag: 'меняющая' },
          { text: 'помогаю оформить ценность в ясный результат',  covenTag: 'слова',         typeTag: 'мудрая' },
          { text: 'помогаю мягко проявиться в мире',              covenTag: 'камерная',      typeTag: 'лунная' },
        ],
      },
    ],
  },

  key: {
    sectionTitle: 'Как я говорю о деньгах',
    manifestLabel: 'О деньгах я говорю так',
    scenarios: [
      {
        id: 'key_1',
        question: 'Мне легче говорить не «цена», а…',
        manifestPrefix: '',
        options: [
          { text: 'стоимость работы',        covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'формат сотрудничества',   covenTag: 'камерная',      typeTag: 'лунная' },
          { text: 'инвестиция в результат',  covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'условия моей работы',      covenTag: 'сопровождение', typeTag: 'хранительница' },
          { text: 'вклад в ваш путь',         covenTag: 'путь',          typeTag: 'мудрая' },
        ],
      },
      {
        id: 'key_2',
        question: 'Мне комфортнее всего такая фраза:',
        manifestPrefix: '',
        options: [
          { text: 'я работаю в платном формате',                        covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'у меня есть бережный рабочий формат',                covenTag: 'камерная',      typeTag: 'лунная' },
          { text: 'если вам откликается, мы можем обсудить условия',    covenTag: 'камерная',      typeTag: 'сердечная' },
          { text: 'я могу предложить вам индивидуальную работу',         covenTag: 'камерная',      typeTag: 'хранительница' },
          { text: 'это формат с понятной стоимостью и результатом',      covenTag: 'слова',         typeTag: 'ясная' },
        ],
      },
      {
        id: 'key_3',
        question: 'Когда я говорю о деньгах, я хочу опираться на…',
        manifestPrefix: 'через ',
        options: [
          { text: 'уважение к своему труду', covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'ясные границы',            covenTag: 'сопровождение', typeTag: 'ясная' },
          { text: 'ценность результата',      covenTag: 'слова',         typeTag: 'мудрая' },
          { text: 'честный обмен',             covenTag: 'камерная',      typeTag: 'сердечная' },
          { text: 'спокойную уверенность',     covenTag: 'камерная',      typeTag: 'хранительница' },
        ],
      },
    ],
  },

  moon: {
    sectionTitle: 'Какой мой следующий шаг',
    manifestLabel: 'Мой следующий шаг',
    scenarios: [
      {
        id: 'moon_1',
        question: 'Мой самый безопасный следующий шаг — это…',
        manifestPrefix: '',
        options: [
          { text: 'записать свою формулировку ценности',           covenTag: 'слова',         typeTag: 'мудрая' },
          { text: 'рассказать о своей работе одному человеку',     covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'обновить описание профиля',                      covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'предложить один пробный формат',                 covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'составить список тем, с которыми я могу помочь', covenTag: 'сопровождение', typeTag: 'ясная' },
        ],
      },
      {
        id: 'moon_2',
        question: 'За ближайшие 24 часа я готова…',
        manifestPrefix: 'в ближайшие 24 часа: ',
        options: [
          { text: 'написать одну фразу о том, чем я полезна',   covenTag: 'слова',         typeTag: 'мудрая' },
          { text: 'выбрать, кому я полезна в первую очередь',   covenTag: 'путь',          typeTag: 'звёздная' },
          { text: 'сформулировать свой результат в 3–5 словах', covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'подготовить спокойную фразу о стоимости',    covenTag: 'камерная',      typeTag: 'лунная' },
          { text: 'сделать одно проявленное действие',           covenTag: 'огонь',         typeTag: 'искрящаяся' },
        ],
      },
      {
        id: 'moon_3',
        question: 'Чтобы двинуться дальше, мне сейчас важнее…',
        manifestPrefix: 'строится через ',
        options: [
          { text: 'больше ясности',                    covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'меньше страха',                     covenTag: 'огонь',         typeTag: 'лунная' },
          { text: 'простая формулировка',              covenTag: 'слова',         typeTag: 'ясная' },
          { text: 'разрешение себе проявляться',       covenTag: 'огонь',         typeTag: 'искрящаяся' },
          { text: 'один конкретный шаг без перегруза', covenTag: 'сопровождение', typeTag: 'хранительница' },
        ],
      },
    ],
  },
};
