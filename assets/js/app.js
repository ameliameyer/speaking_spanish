import { authReady, getCurrentUser, getCompleted, onProfileChange, completeLesson, loginGoogle, loginEmail, registerEmail, logout, resetPassword, migrateLocal, hasLocalProgress, listPersonalWords, savePersonalWord, removePersonalWord } from "./firebase.js";
const root=document.querySelector('#app'),nav=document.querySelector('#nav');
const sections=['Home','Curriculum','Vocabulary','Verb Lab','Conversation','Practice Together','Practice'];
let curriculum,vocab,verbs,section='Home',lessonId=null;
const saved=()=>getCompleted();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a0=()=>curriculum.levels[0].lessons;
const lessonContent={
  "a0-01": {
    "intro": "Spanish has 27 letters, including ñ. Five vowel sounds are relatively stable: a /a/, e /e/, i /i/, o /o/, u /u/. In Mexico, c before e or i and z sound like s; h is silent; j is a strong breathy sound. G before e or i resembles j; gu before e or i usually has a silent u. R and rr contrast between vowels.",
    "examples": [
      [
        "casa",
        "house"
      ],
      [
        "queso",
        "cheese"
      ],
      [
        "guitarra",
        "guitar"
      ],
      [
        "niño",
        "child"
      ],
      [
        "pero / perro",
        "but / dog"
      ]
    ],
    "breakdown": "In queso, qu represents k and u is silent. In niño, ñ is a single sound. In perro, rr is trilled.",
    "mistake": "Do not pronounce the h in hola or give Spanish vowels English-style glides.",
    "vocabulary": [
      "hola — hello",
      "agua — water",
      "leche — milk"
    ],
    "partner": "Take turns spelling your names and reading the examples aloud.",
    "quiz": [
      [
        "Which letter is silent in hola?",
        [
          "h",
          "l",
          "a"
        ],
        0,
        "H is silent."
      ],
      [
        "Which word means dog?",
        [
          "pero",
          "perro",
          "pelo"
        ],
        1,
        "Perro has a trilled rr."
      ],
      [
        "Which vowel sounds closest to English ee?",
        [
          "e",
          "u",
          "i"
        ],
        2,
        "Spanish i is /i/."
      ]
    ]
  },
  "a0-02": {
    "intro": "Words ending in a vowel, n or s normally stress the penultimate syllable; other consonants normally take final stress. Written accents override these patterns and can distinguish words such as sí and si.",
    "examples": [
      [
        "casa",
        "CA-sa"
      ],
      [
        "papel",
        "pa-PEL"
      ],
      [
        "México",
        "MÉ-xi-co"
      ],
      [
        "café",
        "ca-FÉ"
      ]
    ],
    "breakdown": "Divide café into ca and fé. Its final vowel would normally suggest penultimate stress, but é marks final stress.",
    "mistake": "Do not ignore written accents or assume every word has final stress.",
    "vocabulary": [
      "sí — yes",
      "si — if",
      "té — tea"
    ],
    "partner": "Read the examples and have your partner identify the stressed syllable.",
    "quiz": [
      [
        "Stress in papel?",
        [
          "pa",
          "pel"
        ],
        1,
        "Final l normally signals final stress."
      ],
      [
        "Stress in México?",
        [
          "Mé",
          "xi",
          "co"
        ],
        0,
        "The accent marks Mé."
      ],
      [
        "Which means yes?",
        [
          "si",
          "sí"
        ],
        1,
        "Sí has a written accent."
      ]
    ]
  },
  "a0-03": {
    "intro": "Use hola at any time; buenos días in the morning, buenas tardes in the afternoon and buenas noches at night. Tú is familiar; usted is respectful or formal, depending on context. Me llamo introduces your name.",
    "examples": [
      [
        "¿Cómo estás?",
        "How are you? (familiar)"
      ],
      [
        "¿Cómo está?",
        "How are you? (formal)"
      ],
      [
        "Me llamo Ana.",
        "My name is Ana."
      ],
      [
        "Mucho gusto.",
        "Nice to meet you."
      ]
    ],
    "breakdown": "Start with Hola, ask ¿Cómo te llamas?, answer Me llamo + name, then respond Mucho gusto or Igualmente.",
    "mistake": "Do not mix te llamas with usted in the same question; use ¿Cómo se llama? for usted.",
    "vocabulary": [
      "gracias — thanks",
      "hasta luego — see you later",
      "bien — well"
    ],
    "partner": "Introduce yourselves as strangers, then repeat using usted.",
    "quiz": [
      [
        "Formal how are you?",
        [
          "¿Cómo estás?",
          "¿Cómo está?"
        ],
        1,
        "Está agrees with usted."
      ],
      [
        "Nice to meet you?",
        [
          "Mucho gusto",
          "Hasta luego",
          "Buenas noches"
        ],
        0,
        "Mucho gusto is a greeting response."
      ],
      [
        "My name is Ana?",
        [
          "Me llamo Ana",
          "Te llamas Ana"
        ],
        0,
        "Me llamo refers to yourself."
      ]
    ]
  },
  "a0-04": {
    "intro": "Yo means I; tú means familiar you; usted means respectful you; él and ella mean he and she; nosotros/nosotras means we; ellos/ellas means they; ustedes means plural you in Mexico. Usted and ustedes take third-person verb forms. Subject pronouns are often omitted when the verb makes the subject clear.",
    "examples": [
      [
        "Yo soy Ana.",
        "I am Ana."
      ],
      [
        "Tú eres Luis.",
        "You are Luis."
      ],
      [
        "Ustedes son amigos.",
        "You all are friends."
      ]
    ],
    "breakdown": "Identify the speaker, listener or third party; choose singular or plural; then select the matching verb form.",
    "mistake": "Do not use vosotros as the default plural you in Mexican Spanish.",
    "vocabulary": [
      "yo — I",
      "usted — you",
      "nosotros — we"
    ],
    "partner": "Point to yourself, your partner and both of you and say the corresponding pronouns.",
    "quiz": [
      [
        "Plural you in Mexico?",
        [
          "ellos",
          "ustedes",
          "nosotros"
        ],
        1,
        "Ustedes addresses multiple people."
      ],
      [
        "Which means we?",
        [
          "nosotros",
          "ellos",
          "yo"
        ],
        0,
        "Nosotros includes the speaker."
      ],
      [
        "Which is respectful singular you?",
        [
          "tú",
          "ella",
          "usted"
        ],
        2,
        "Usted is the respectful form."
      ]
    ]
  },
  "a0-05": {
    "intro": "Spanish nouns have grammatical gender. Many ending in -o are masculine and many ending in -a feminine, but exceptions include la mano and el día. Learn nouns with their articles. Add -s after most unstressed vowels and -es after most consonants; final z changes to c before -es.",
    "examples": [
      [
        "el libro / los libros",
        "book / books"
      ],
      [
        "la ciudad / las ciudades",
        "city / cities"
      ],
      [
        "la luz / las luces",
        "light / lights"
      ]
    ],
    "breakdown": "For ciudad, identify feminine gender, add -es for plural, then change la to las.",
    "mistake": "Gender is not always predictable from spelling; la mano is feminine.",
    "vocabulary": [
      "mesa — table",
      "día — day",
      "mano — hand"
    ],
    "partner": "Name objects around you with articles, then make them plural.",
    "quiz": [
      [
        "Plural of la luz?",
        [
          "las luzes",
          "las luces",
          "los luces"
        ],
        1,
        "Z changes to c before -es."
      ],
      [
        "Correct article for mano?",
        [
          "el",
          "la"
        ],
        1,
        "Mano is feminine."
      ],
      [
        "Plural of el libro?",
        [
          "los libros",
          "las libros"
        ],
        0,
        "Libro is masculine."
      ]
    ]
  },
  "a0-06": {
    "intro": "Definite articles el, la, los, las identify specific nouns. Indefinite articles un, una, unos, unas introduce nonspecific nouns or some items. Articles agree with noun gender and number.",
    "examples": [
      [
        "un libro",
        "a book"
      ],
      [
        "la mesa",
        "the table"
      ],
      [
        "unas casas",
        "some houses"
      ]
    ],
    "breakdown": "For some houses, casa is feminine and plural casas, so choose unas.",
    "mistake": "Do not use un with a feminine noun such as mesa.",
    "vocabulary": [
      "el — the",
      "una — a",
      "unos — some"
    ],
    "partner": "Ask your partner to identify a specific object and then an unspecified object.",
    "quiz": [
      [
        "A table?",
        [
          "un mesa",
          "una mesa",
          "la mesa"
        ],
        1,
        "Una is feminine indefinite singular."
      ],
      [
        "The books?",
        [
          "los libros",
          "unos libros"
        ],
        0,
        "Los is definite plural masculine."
      ],
      [
        "Some houses?",
        [
          "unos casas",
          "unas casas"
        ],
        1,
        "Unas agrees with casas."
      ]
    ]
  },
  "a0-07": {
    "intro": "Ser expresses identity, origin, profession, characteristics and clock time. Present forms: soy, eres, es, somos, son (ustedes/ellos/ellas). Use de for origin. Professions normally omit an article after ser when unmodified.",
    "examples": [
      [
        "Soy de México.",
        "I am from Mexico."
      ],
      [
        "Ella es médica.",
        "She is a doctor."
      ],
      [
        "Somos amigos.",
        "We are friends."
      ],
      [
        "Son las dos.",
        "It is two o’clock."
      ]
    ],
    "breakdown": "For I am from Mexico, choose yo, conjugate ser as soy, add de México. Yo can be omitted.",
    "mistake": "Do not translate every English be as ser; location and many states use estar.",
    "vocabulary": [
      "origen — origin",
      "amigo — friend",
      "médica — doctor"
    ],
    "partner": "Ask ¿De dónde eres? and answer with your actual hometown.",
    "quiz": [
      [
        "I am from Mexico?",
        [
          "Estoy de México",
          "Soy de México"
        ],
        1,
        "Origin uses ser."
      ],
      [
        "We are friends?",
        [
          "Somos amigos",
          "Son amigos"
        ],
        0,
        "Somos agrees with nosotros."
      ],
      [
        "Ustedes ___ estudiantes.",
        [
          "eres",
          "son",
          "soy"
        ],
        1,
        "Ustedes takes son."
      ]
    ]
  },
  "a0-08": {
    "intro": "Estar expresses location of people and objects, conditions and many emotional states. Present forms: estoy, estás, está, estamos, están. Ser versus estar is about meaning, not simply permanent versus temporary: Madrid está en España, and events use ser for location.",
    "examples": [
      [
        "Estoy cansada.",
        "I am tired."
      ],
      [
        "El libro está aquí.",
        "The book is here."
      ],
      [
        "Estamos en casa.",
        "We are at home."
      ]
    ],
    "breakdown": "Choose estar for your location; for we, use estamos; add en casa.",
    "mistake": "Do not use ser for a person's location. An event is different: La fiesta es en casa.",
    "vocabulary": [
      "aquí — here",
      "cansado — tired",
      "casa — home"
    ],
    "partner": "Ask ¿Dónde estás? and ¿Cómo estás? and answer both.",
    "quiz": [
      [
        "The book is here?",
        [
          "El libro es aquí",
          "El libro está aquí"
        ],
        1,
        "Object location uses estar."
      ],
      [
        "We are at home?",
        [
          "Estamos en casa",
          "Somos en casa"
        ],
        0,
        "Estamos is the nosotros form."
      ],
      [
        "I am tired?",
        [
          "Soy cansado",
          "Estoy cansado"
        ],
        1,
        "A current condition uses estar."
      ]
    ]
  },
  "a0-09": {
    "intro": "A basic Spanish sentence often follows subject + verb + complement. Subjects can be omitted. Adjectives commonly follow nouns and agree in gender and number; some adjectives precede nouns or change meaning by position.",
    "examples": [
      [
        "Ana habla español.",
        "Ana speaks Spanish."
      ],
      [
        "Tengo un libro rojo.",
        "I have a red book."
      ],
      [
        "Las casas son blancas.",
        "The houses are white."
      ]
    ],
    "breakdown": "Start with las casas, use son for plural subject, then blancas to match feminine plural.",
    "mistake": "Do not leave adjectives in masculine singular when describing feminine plural nouns.",
    "vocabulary": [
      "hablar — speak",
      "tener — have",
      "rojo — red"
    ],
    "partner": "Describe three objects using a noun, article and adjective.",
    "quiz": [
      [
        "The white houses?",
        [
          "las casas blancas",
          "las casas blanco"
        ],
        0,
        "Blancas agrees with casas."
      ],
      [
        "I have a book?",
        [
          "Tengo un libro",
          "Tiene un libro"
        ],
        0,
        "Tengo is first person."
      ],
      [
        "Ana speaks Spanish?",
        [
          "Ana habla español",
          "Ana hablan español"
        ],
        0,
        "Habla agrees with Ana."
      ]
    ]
  },
  "a0-10": {
    "intro": "Use opening and closing question marks. Yes/no questions can keep statement word order with questioning intonation. Question words carry accents: qué, quién, dónde, cuándo, cómo, cuánto, por qué. Put no before the conjugated verb to negate.",
    "examples": [
      [
        "¿Hablas español?",
        "Do you speak Spanish?"
      ],
      [
        "¿Dónde vives?",
        "Where do you live?"
      ],
      [
        "No hablo español.",
        "I do not speak Spanish."
      ],
      [
        "¿Por qué? / Porque…",
        "Why? / Because…"
      ]
    ],
    "breakdown": "Start with hablo español; place no before hablo to negate. For a question about location use dónde plus the appropriate verb.",
    "mistake": "Do not add an equivalent of English do to form ordinary Spanish questions.",
    "vocabulary": [
      "dónde — where",
      "cuándo — when",
      "qué — what"
    ],
    "partner": "Ask three questions and answer one negatively.",
    "quiz": [
      [
        "Where do you live?",
        [
          "¿Dónde vives?",
          "¿Cuándo vives?"
        ],
        0,
        "Dónde asks location."
      ],
      [
        "I do not speak Spanish?",
        [
          "Hablo no español",
          "No hablo español"
        ],
        1,
        "No precedes the verb."
      ],
      [
        "Why?",
        [
          "¿Porque?",
          "¿Por qué?"
        ],
        1,
        "Por qué is interrogative."
      ]
    ]
  },
  "a0-11": {
    "intro": "Learn cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez; eleven to fifteen are once, doce, trece, catorce, quince; sixteen to nineteen use dieci-; twenty is veinte, twenty-one veintiuno; thirty treinta, forty cuarenta, fifty cincuenta. From 31 use tens + y + units. Dates use day + de + month; months and weekdays are lowercase. Time uses es la una and son las dos, etc.",
    "examples": [
      [
        "treinta y dos",
        "32"
      ],
      [
        "el 5 de mayo",
        "May 5"
      ],
      [
        "Son las tres y media.",
        "It is 3:30."
      ],
      [
        "Es la una.",
        "It is 1:00."
      ]
    ],
    "breakdown": "For 32 combine treinta + y + dos. For 3:30 use son las tres + y media.",
    "mistake": "Use es la una for one o’clock, not son las una.",
    "vocabulary": [
      "lunes — Monday",
      "enero — January",
      "hora — hour"
    ],
    "partner": "Ask each other the time, birthday and a number between 1 and 50.",
    "quiz": [
      [
        "32?",
        [
          "treinta y dos",
          "veintidós",
          "trece"
        ],
        0,
        "Thirty plus two."
      ],
      [
        "1:00?",
        [
          "Son las una",
          "Es la una"
        ],
        1,
        "One uses singular es la."
      ],
      [
        "May 5?",
        [
          "el mayo de cinco",
          "el cinco de mayo"
        ],
        1,
        "Day precedes month."
      ]
    ]
  },
  "a0-12": {
    "intro": "Combine greetings, identity, origin, location and questions. Use polite phrases to manage misunderstandings: perdón, no entiendo, ¿puedes repetir?, más despacio, por favor. Use ¿puede repetir? with usted.",
    "examples": [
      [
        "Hola, ¿cómo te llamas?",
        "Hello, what is your name?"
      ],
      [
        "Soy Ana. ¿De dónde eres?",
        "I am Ana. Where are you from?"
      ],
      [
        "No entiendo. ¿Puedes repetir?",
        "I don’t understand. Can you repeat?"
      ],
      [
        "Hasta luego.",
        "See you later."
      ]
    ],
    "breakdown": "Greet, introduce yourself, ask a question, listen, request clarification if necessary, and close politely.",
    "mistake": "Do not switch to English immediately when confused; try a clarification phrase first.",
    "vocabulary": [
      "perdón — excuse me",
      "despacio — slowly",
      "por favor — please"
    ],
    "partner": "Have a two-minute conversation without reading; swap roles and repeat with usted.",
    "quiz": [
      [
        "I don’t understand?",
        [
          "No entiendo",
          "No estoy"
        ],
        0,
        "Entiendo means I understand."
      ],
      [
        "Can you repeat? (formal)",
        [
          "¿Puedes repetir?",
          "¿Puede repetir?"
        ],
        1,
        "Puede agrees with usted."
      ],
      [
        "Where are you from?",
        [
          "¿Dónde estás?",
          "¿De dónde eres?"
        ],
        1,
        "De dónde asks origin."
      ]
    ]
  }
};
function setSection(s){section=s;lessonId=null;render()}
function openLesson(id){lessonId=id;section='Curriculum';render();window.scrollTo(0,0)}
function render(){renderAccount();installDictionary();nav.innerHTML=sections.map(s=>`<button class="${section===s?'active':''}" data-section="${esc(s)}">${esc(s)}</button>`).join('');nav.querySelectorAll('button').forEach(b=>b.onclick=()=>setSection(b.dataset.section));root.innerHTML=lessonId?renderLesson(lessonId):({Home:home,Curriculum:course,Vocabulary:words,'Verb Lab':verbLab,Conversation:conversation,'Practice Together':partnerPractice,Practice:practice}[section])();root.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(b.dataset.lesson));root.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>setSection(b.dataset.goto));if(lessonId)wireLesson();if(section==='Vocabulary'&&!lessonId)wireVocabulary();if(section==='Practice Together'&&!lessonId)wirePartner()}
function home(){let done=saved().length,total=a0().length,next=a0().find(l=>!saved().includes(l.id));return `<div class="eyebrow">Mi centro de aprendizaje</div><h1>¡Vamos a aprender!</h1><p class="muted">Your Mexican Spanish learning center. Start from zero, learn the rules, and practice speaking naturally.</p><div class="grid"><div class="card"><div class="stat">A0</div>Current level</div><div class="card"><div class="stat">${done}/${total}</div>Foundation lessons complete</div><div class="card"><div class="stat">${vocab.length}</div>Starter vocabulary words</div></div><div class="card"><h2>Your progress</h2><div class="progress"><div style="width:${done/total*100}%"></div></div><p class="muted">${Math.round(done/total*100)}% of A0 complete</p>${next?`<h3>Up next: ${esc(next.title)}</h3><p>${esc(next.summary)}</p><button data-lesson="${next.id}">Open lesson →</button>`:'<p>¡Felicidades! You completed all A0 lessons.</p>'}</div><div class="grid">${sections.slice(1).map(s=>`<div class="card"><h3>${esc(s)}</h3><p class="muted">${({Curriculum:'Follow the learning path.',Vocabulary:'Explore useful Mexican Spanish words.','Verb Lab':'Study conjugation patterns.',Conversation:'Read realistic dialogues.','Practice Together':'Practice spoken Spanish with a partner.',Practice:'Review what you have learned.'})[s]}</p><button class="secondary" data-goto="${esc(s)}">Explore →</button></div>`).join('')}</div>`}
function course(){return `<div class="eyebrow">Structured learning</div><h1>Curriculum</h1><p class="muted">A0 foundations first. Higher-level courses are planned and will be developed progressively.</p>${curriculum.levels.map(level=>`<div class="card"><h2>${esc(level.title)}</h2>${level.description?`<p class="muted">${esc(level.description)}</p>`:''}${level.lessons.length?level.lessons.map((l,i)=>`<div class="lesson-row"><div><strong>${String(i+1).padStart(2,'0')} · ${esc(l.title)}</strong><div class="muted">${esc(l.summary)}</div></div><div><span class="pill">${saved().includes(l.id)?'Completed':lessonContent[l.id]?'Available':'Coming soon'}</span> ${lessonContent[l.id]?`<button data-lesson="${l.id}">Study</button>`:''}</div></div>`).join(''):'<p class="muted">Coming in a future curriculum release.</p>'}</div>`).join('')}`}
const studyGuides={
  "a0-01": {
    "objectives": [
      "Recognize the five vowels and common spelling patterns",
      "Distinguish r, rr and ñ"
    ],
    "reference": [
      [
        "a, e, i, o, u",
        "Keep each vowel steady: casa, mesa, vino, poco, luna."
      ],
      [
        "c / z / s",
        "In Mexico, cena, zapato and sopa use the same s sound for these letters in the relevant positions."
      ],
      [
        "qu / gu / gü",
        "queso has silent u; guerra has silent u; pingüino pronounces u."
      ],
      [
        "r / rr",
        "A single r between vowels is tapped; rr is trilled. Initial r is also strong."
      ],
      [
        "ll / y",
        "In most Mexican speech, llave and ya begin with the same consonant sound."
      ]
    ],
    "worked": [
      [
        "Read queso.",
        "Identify qu before e → k; pronounce e and o as steady vowels."
      ],
      [
        "Read guitarra.",
        "Identify gu before i → hard g; rr → trill."
      ]
    ],
    "written": [
      [
        "Which letter is silent in queso?",
        "u",
        "Qu before e or i has silent u."
      ],
      [
        "Write the Spanish word for dog (not but).",
        "perro",
        "The double r distinguishes perro from pero."
      ]
    ]
  },
  "a0-02": {
    "objectives": [
      "Find the stressed syllable",
      "Apply the default stress rules"
    ],
    "reference": [
      [
        "Vowel, n, s",
        "Normally stress the next-to-last syllable: casa, joven, lunes."
      ],
      [
        "Other consonants",
        "Normally stress the last syllable: papel, reloj."
      ],
      [
        "Written accent",
        "Overrides default stress: café, México, teléfono."
      ],
      [
        "Syllables",
        "A syllable has a vowel nucleus. Adjacent vowels may combine or separate: tierra (tie-rra), día (dí-a)."
      ]
    ],
    "worked": [
      [
        "Analyze teléfono.",
        "te-lé-fo-no; the accent explicitly marks lé."
      ],
      [
        "Analyze reloj.",
        "re-loj; final j triggers default final stress."
      ]
    ],
    "written": [
      [
        "Add the accent to cafe (coffee).",
        "café",
        "Final stress requires an accent."
      ],
      [
        "Write the stressed syllable in teléfono.",
        "lé",
        "The accent identifies lé."
      ]
    ]
  },
  "a0-03": {
    "objectives": [
      "Choose greetings by time and formality",
      "Introduce yourself and respond politely"
    ],
    "reference": [
      [
        "Morning / afternoon / night",
        "Buenos días / buenas tardes / buenas noches."
      ],
      [
        "Familiar / respectful",
        "¿Cómo estás? / ¿Cómo está?"
      ],
      [
        "Name",
        "¿Cómo te llamas? / ¿Cómo se llama?; Me llamo + name."
      ],
      [
        "Responses",
        "Bien, gracias. ¿Y tú? / ¿Y usted?; Igualmente."
      ]
    ],
    "worked": [
      [
        "Meet a new colleague.",
        "Buenos días. ¿Cómo se llama? — Me llamo Ana. Mucho gusto."
      ],
      [
        "Meet a friend.",
        "Hola, ¿cómo estás? — Bien, gracias. ¿Y tú?"
      ]
    ],
    "written": [
      [
        "Translate: Good morning.",
        "buenos días",
        "Días is masculine."
      ],
      [
        "Translate: Nice to meet you.",
        "mucho gusto",
        "A common Mexican greeting."
      ]
    ]
  },
  "a0-04": {
    "objectives": [
      "Identify person and number",
      "Select familiar or respectful address"
    ],
    "reference": [
      [
        "yo / tú / usted",
        "I / familiar you / respectful you"
      ],
      [
        "él / ella",
        "he / she"
      ],
      [
        "nosotros / nosotras",
        "we (mixed or masculine / all feminine)"
      ],
      [
        "ellos / ellas / ustedes",
        "they / they (all feminine) / you all"
      ],
      [
        "Omission",
        "Soy Ana is natural without yo; use pronouns for emphasis or clarity."
      ]
    ],
    "worked": [
      [
        "Address two friends.",
        "Choose ustedes, not ellos, because you are speaking to them."
      ],
      [
        "Refer to two women.",
        "Choose ellas when talking about them; nosotras if you are one of them."
      ]
    ],
    "written": [
      [
        "Translate: you all.",
        "ustedes",
        "Mexico uses ustedes for plural address."
      ],
      [
        "Translate: we (all women).",
        "nosotras",
        "Use feminine plural for an all-female group."
      ]
    ]
  },
  "a0-05": {
    "objectives": [
      "Identify noun gender",
      "Form regular plurals"
    ],
    "reference": [
      [
        "-o / -a",
        "Often masculine/feminine: el libro, la mesa."
      ],
      [
        "Exceptions",
        "el día, la mano; learn the article with each noun."
      ],
      [
        "Vowel endings",
        "Add -s: casa → casas."
      ],
      [
        "Consonant endings",
        "Usually add -es: ciudad → ciudades."
      ],
      [
        "Final z",
        "Change z to c before -es: luz → luces."
      ]
    ],
    "worked": [
      [
        "Pluralize la ciudad.",
        "ciudad + es → ciudades; la → las."
      ],
      [
        "Pluralize el día.",
        "día + s → días; el → los."
      ]
    ],
    "written": [
      [
        "Write the plural of la mesa, including article.",
        "las mesas",
        "Feminine plural."
      ],
      [
        "Write the plural of la luz, including article.",
        "las luces",
        "Z becomes c."
      ]
    ]
  },
  "a0-06": {
    "objectives": [
      "Distinguish definite and indefinite articles",
      "Match gender and number"
    ],
    "reference": [
      [
        "Masculine singular",
        "el = the; un = a"
      ],
      [
        "Feminine singular",
        "la = the; una = a"
      ],
      [
        "Masculine plural",
        "los = the; unos = some"
      ],
      [
        "Feminine plural",
        "las = the; unas = some"
      ],
      [
        "Context",
        "Tengo un libro introduces a book; El libro es rojo refers to the known book."
      ]
    ],
    "worked": [
      [
        "Translate some tables.",
        "Mesa is feminine; mesas is plural; choose unas mesas."
      ],
      [
        "Translate the days.",
        "Día is masculine; choose los días."
      ]
    ],
    "written": [
      [
        "Translate: a table.",
        "una mesa",
        "Feminine singular indefinite."
      ],
      [
        "Translate: the books.",
        "los libros",
        "Masculine plural definite."
      ]
    ]
  },
  "a0-07": {
    "objectives": [
      "Conjugate ser in the present",
      "Express identity, origin and characteristics"
    ],
    "reference": [
      [
        "yo / tú",
        "soy / eres"
      ],
      [
        "él, ella, usted",
        "es"
      ],
      [
        "nosotros/as",
        "somos"
      ],
      [
        "ellos, ellas, ustedes",
        "son"
      ],
      [
        "Uses",
        "Identity: Soy Ana. Origin: Soy de México. Profession: Soy estudiante. Time: Son las dos."
      ]
    ],
    "worked": [
      [
        "Translate we are students.",
        "We → nosotros; ser → somos; students → estudiantes: Somos estudiantes."
      ],
      [
        "Ask origin.",
        "¿De dónde eres? uses eres for tú."
      ]
    ],
    "written": [
      [
        "Translate: We are friends (masculine or mixed).",
        "somos amigos",
        "Somos agrees with we."
      ],
      [
        "Translate: I am from Mexico.",
        "soy de México",
        "Origin uses ser + de."
      ]
    ]
  },
  "a0-08": {
    "objectives": [
      "Conjugate estar",
      "Distinguish location and condition from identity"
    ],
    "reference": [
      [
        "yo / tú",
        "estoy / estás"
      ],
      [
        "él, ella, usted",
        "está"
      ],
      [
        "nosotros/as",
        "estamos"
      ],
      [
        "ellos, ellas, ustedes",
        "están"
      ],
      [
        "Location and condition",
        "Estoy en casa; Estoy bien. Event location uses ser: La fiesta es en casa."
      ],
      [
        "Contrast",
        "Es listo = clever; está listo = ready. Meaning matters more than duration."
      ]
    ],
    "worked": [
      [
        "Translate the book is here.",
        "El libro is singular; object location → está; here → aquí."
      ],
      [
        "Translate we are at home.",
        "We → estamos; at home → en casa."
      ]
    ],
    "written": [
      [
        "Translate: We are at home.",
        "estamos en casa",
        "Location uses estar."
      ],
      [
        "Translate: The book is here.",
        "el libro está aquí",
        "Object location uses está."
      ]
    ]
  },
  "a0-09": {
    "objectives": [
      "Construct subject–verb–complement sentences",
      "Match adjectives to nouns"
    ],
    "reference": [
      [
        "Basic order",
        "Ana habla español: subject + verb + object."
      ],
      [
        "Subject omission",
        "Tengo un libro: tengo identifies I."
      ],
      [
        "Adjective agreement",
        "rojo, roja, rojos, rojas; adjectives ending in -e often do not change gender: grande, grandes."
      ],
      [
        "Position",
        "Descriptive adjectives often follow nouns: un libro rojo."
      ],
      [
        "Useful forms",
        "hablo/hablas/habla; tengo/tienes/tiene."
      ]
    ],
    "worked": [
      [
        "Build the red books.",
        "libros is masculine plural → los libros rojos."
      ],
      [
        "Build I have a red book.",
        "Tengo + un libro + rojo → Tengo un libro rojo."
      ]
    ],
    "written": [
      [
        "Translate: the white houses.",
        "las casas blancas",
        "Feminine plural agreement."
      ],
      [
        "Translate: I have a red book.",
        "tengo un libro rojo",
        "Tengo identifies I."
      ]
    ]
  },
  "a0-10": {
    "objectives": [
      "Ask yes/no and information questions",
      "Negate a sentence"
    ],
    "reference": [
      [
        "Yes/no",
        "¿Hablas español? uses intonation and question marks."
      ],
      [
        "Information",
        "qué = what; dónde = where; cuándo = when; quién = who; cómo = how; por qué = why."
      ],
      [
        "Useful forms",
        "vivo = I live; vives = you live; vive = he/she/usted lives."
      ],
      [
        "Negation",
        "No + conjugated verb: No vivo aquí."
      ],
      [
        "Answer",
        "¿Por qué? — Porque… (because)."
      ]
    ],
    "worked": [
      [
        "Ask where someone lives.",
        "Dónde + vives → ¿Dónde vives?"
      ],
      [
        "Negate I speak Spanish.",
        "Hablo español → No hablo español."
      ]
    ],
    "written": [
      [
        "Translate: Where do you live? (tú)",
        "¿Dónde vives?",
        "Dónde asks location."
      ],
      [
        "Translate: I do not speak Spanish.",
        "no hablo español",
        "No precedes hablo."
      ]
    ]
  },
  "a0-11": {
    "objectives": [
      "Read numbers to 100",
      "Express dates and clock time"
    ],
    "reference": [
      [
        "0–15",
        "cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince"
      ],
      [
        "16–29",
        "dieciséis, diecisiete, dieciocho, diecinueve, veinte, veintiuno, veintidós, veintitrés, veinticuatro, veinticinco, veintiséis, veintisiete, veintiocho, veintinueve"
      ],
      [
        "Tens",
        "treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa, cien. Combine with y: cuarenta y dos."
      ],
      [
        "Months",
        "enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre"
      ],
      [
        "Weekdays",
        "lunes, martes, miércoles, jueves, viernes, sábado, domingo"
      ],
      [
        "Dates / time",
        "el cinco de mayo; es la una; son las dos; y cuarto = :15; y media = :30."
      ]
    ],
    "worked": [
      [
        "Write 42.",
        "cuarenta + y + dos."
      ],
      [
        "Say 2:15.",
        "Son las dos y cuarto."
      ]
    ],
    "written": [
      [
        "Write 42 in Spanish.",
        "cuarenta y dos",
        "Tens + y + units."
      ],
      [
        "Translate: It is 2:15.",
        "son las dos y cuarto",
        "Plural hour uses son las."
      ]
    ]
  },
  "a0-12": {
    "objectives": [
      "Combine the previous eleven lessons",
      "Request clarification politely"
    ],
    "reference": [
      [
        "Opening",
        "Hola, buenos días. ¿Cómo te llamas?"
      ],
      [
        "Identity / origin",
        "Me llamo Ana. Soy de México. ¿Y tú?"
      ],
      [
        "Location / state",
        "Estoy en casa. Estoy bien."
      ],
      [
        "Clarification",
        "No entiendo. ¿Puedes repetir? Más despacio, por favor."
      ],
      [
        "Closing",
        "Gracias. Hasta luego."
      ]
    ],
    "worked": [
      [
        "A: Hola, ¿cómo te llamas? B: Me llamo Ana. A: Mucho gusto.",
        "A opens, B introduces herself, A acknowledges."
      ],
      [
        "A: ¿De dónde eres? B: Soy de México. ¿Y tú?",
        "B answers using ser and returns the question."
      ]
    ],
    "written": [
      [
        "Translate: I do not understand.",
        "no entiendo",
        "Use no before entiendo."
      ],
      [
        "Translate: More slowly, please.",
        "más despacio, por favor",
        "A polite clarification request."
      ]
    ]
  }
};
function renderLesson(id){const l=a0().find(x=>x.id===id),c=lessonContent[id],g=studyGuides[id];if(!l||!c)return '<p>Lesson not available yet.</p>';return `<button class="secondary" id="back">← Curriculum</button><h1>${esc(l.title)}</h1><div class="card"><h2>Learning objectives</h2><ul>${g.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h2>1. Learn</h2><p>${esc(c.intro)}</p><h3>Reference guide</h3>${g.reference.map(x=>`<div class="lesson-row"><strong>${esc(x[0])}</strong><span>${esc(x[1])}</span></div>`).join('')}<h2>2. Examples</h2>${c.examples.map(x=>`<div class="example"><strong>${esc(x[0])}</strong><div>${esc(x[1])}</div></div>`).join('')}<h2>3. Step-by-step breakdown</h2><p>${esc(c.breakdown)}</p>${g.worked.map(x=>`<div class="example"><strong>${esc(x[0])}</strong><p>${esc(x[1])}</p></div>`).join('')}<h2>4. Common mistakes</h2><p>${esc(c.mistake)}</p><h2>5. Vocabulary</h2><ul>${c.vocabulary.map((x,i)=>`<li>${esc(x)} <button class="secondary" data-lesson-word="${i}">Save word</button></li>`).join('')}</ul><h2>6. Practice together</h2><p>${esc(c.partner)}</p><h2>7. Written practice</h2><p>Write your answer before revealing the model answer. Compare spelling and accents.</p>${g.written.map((q,i)=>`<div class="question"><label for="written-${i}">${esc(q[0])}</label><input type="text" id="written-${i}" autocomplete="off"><details><summary>Reveal model answer</summary><strong>${esc(q[1])}</strong><p>${esc(q[2])}</p></details></div>`).join('')}<h2>8. Knowledge check</h2>${c.quiz.map((q,i)=>`<div class="question"><strong>${i+1}. ${esc(q[0])}</strong><div>${q[1].map((o,j)=>`<label><input type="radio" name="quiz-${i}" value="${j}"> ${esc(o)}</label>`).join('')}</div><p id="feedback-${i}" role="status"></p></div>`).join('')}<button id="check">Check answers</button><p id="feedback" role="status"></p><button id="complete" disabled>Mark lesson complete</button></div>`}
function wireLesson(){document.querySelector('#back').onclick=()=>setSection('Curriculum');const c=lessonContent[lessonId];root.querySelectorAll('[data-lesson-word]').forEach(btn=>btn.onclick=()=>{const [es,en]=c.vocabulary[Number(btn.dataset.lessonWord)].split(' — ');openDictionary(es,en)});const b=document.querySelector('#complete'),f=document.querySelector('#feedback');document.querySelector('#check').onclick=()=>{let score=0;c.quiz.forEach((q,i)=>{const selected=document.querySelector('input[name="quiz-'+i+'"]:checked'),good=selected&&Number(selected.value)===q[2];if(good)score++;document.querySelector('#feedback-'+i).textContent=good?'¡Correcto! '+q[3]:selected?'Try again. '+q[3]:'Choose an answer.'});f.textContent=score+'/'+c.quiz.length+' correct';b.disabled=score!==c.quiz.length};root.querySelectorAll('input[type="radio"]').forEach(x=>x.onchange=()=>{b.disabled=true});b.onclick=async()=>{b.disabled=true;try{await completeLesson(lessonId);setSection('Curriculum')}catch(e){f.textContent=humanError(e);b.disabled=false}}}

let vocabTab="Course",flashIndex=0;
const masteryLevels=["New","Learning","Familiar","Mastered"];
function installDictionary(){if(document.querySelector('#dictionary-launch'))return;const bar=document.createElement('div');bar.className='dictionary-toolbar';bar.innerHTML='<button id="dictionary-launch" class="primary"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg> Dictionary</button>';document.querySelector('#account-bar').after(bar);bar.firstElementChild.onclick=()=>openDictionary();}
function openDictionary(es="",en="",note=""){let d=document.querySelector('#dictionary-dialog');if(d)d.remove();d=document.createElement('dialog');d.id='dictionary-dialog';d.style.cssText='width:min(92vw,540px);max-height:85vh;overflow:auto;border:1px solid #455b75;border-radius:12px;padding:24px;color:#1a222c';d.innerHTML=`<form id="dictionary-form"><h2>Dictionary & My Vocabulary</h2><label>Look up Spanish or English<input id="dict-query" type="search" value="${esc(es)}"></label><div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0"><button type="button" data-dict="spanish">SpanishDict</button><button type="button" data-dict="reference">WordReference</button><button type="button" data-dict="mexico">Mexican dictionary</button><button type="button" data-dict="rae">RAE</button></div><p>Look up a word, then enter its meaning below.</p><label>Spanish<input id="dict-es" required maxlength="150" value="${esc(es)}"></label><label>English<input id="dict-en" required maxlength="300" value="${esc(en)}"></label><label>Example or notes<textarea id="dict-note" maxlength="1000" rows="3">${esc(note)}</textarea></label><p id="dict-status" role="status"></p><button type="submit">Save to My Vocabulary</button> <button type="button" id="dict-close" class="secondary">Close</button></form>`;document.body.append(d);d.querySelectorAll('input,textarea').forEach(x=>x.style.cssText='display:block;width:100%;box-sizing:border-box;margin:6px 0 12px');d.querySelector('#dict-close').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());d.querySelectorAll('[data-dict]').forEach(btn=>btn.onclick=()=>{const q=d.querySelector('#dict-query').value.trim(),v=encodeURIComponent(q);if(!q){d.querySelector('#dict-status').textContent='Enter a word first.';return}const urls={spanish:'https://www.spanishdict.com/translate/'+v,reference:'https://www.wordreference.com/es/translation.asp?tranword='+v,mexico:'https://dem.colmex.mx/',rae:'https://dle.rae.es/'+v};window.open(urls[btn.dataset.dict],'_blank','noopener,noreferrer')});d.querySelector('form').onsubmit=async e=>{e.preventDefault();const status=d.querySelector('#dict-status'),btn=d.querySelector('[type=submit]');btn.disabled=true;try{await savePersonalWord({es:d.querySelector('#dict-es').value,en:d.querySelector('#dict-en').value,note:d.querySelector('#dict-note').value});status.textContent='Saved to your vocabulary.';if(section==='Vocabulary'&&!lessonId&&vocabTab!=='Course')wireVocabulary()}catch(err){status.textContent=humanError(err)}finally{btn.disabled=false}};d.showModal();}
function words(){return `<h1>Vocabulary</h1><div class="card" style="display:flex;gap:8px;flex-wrap:wrap">${["Course","My Vocabulary","Flashcards"].map(t=>`<button data-vtab="${t}" class="${t===vocabTab?'':'secondary'}">${t==='Course'?'Course Vocabulary':t}</button>`).join('')}<button id="add-word">+ Add word</button></div><div id="vocab-panel"></div>`}
async function wireVocabulary(){const panel=document.querySelector('#vocab-panel');if(!panel)return;document.querySelectorAll('[data-vtab]').forEach(b=>b.onclick=()=>{vocabTab=b.dataset.vtab;flashIndex=0;render()});document.querySelector('#add-word').onclick=()=>openDictionary();const tab=vocabTab;if(tab==='Course'){panel.innerHTML='<input type="search" id="search" placeholder="Search Spanish or English"><div id="results"></div>';const all=[...vocab,...Object.values(lessonContent).flatMap(c=>c.vocabulary.map(v=>{const [es,en]=v.split(' — ');return {es,en,note:"Lesson vocabulary"}}))];const input=panel.querySelector('#search');function update(){const q=input.value.toLowerCase(),matches=all.filter(w=>(w.es+' '+w.en).toLowerCase().includes(q));panel.querySelector('#results').innerHTML=matches.map((w,i)=>`<div class="card"><h3>${esc(w.es)}</h3><p>${esc(w.en)}</p><button class="secondary" data-add="${i}">Save word</button></div>`).join('')||'<p>No matches.</p>';panel.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const w=matches[Number(b.dataset.add)];openDictionary(w.es,w.en,w.note||"")})}input.oninput=update;update();return}if(!getCurrentUser()){panel.textContent='Sign in to access your personal vocabulary.';return}panel.textContent='Loading your words…';try{const entries=await listPersonalWords();if(!panel.isConnected||tab!==vocabTab)return;entries.sort((a,b)=>a.es.localeCompare(b.es,'es'));if(!entries.length){panel.textContent='No saved words yet. Add a word to get started.';return}if(tab==='Flashcards'){flashIndex%=entries.length;const w=entries[flashIndex];panel.innerHTML=`<div class="card"><p>${flashIndex+1} / ${entries.length}</p><h2>${esc(w.es)}</h2><button id="reveal">Reveal meaning</button><div id="answer" hidden><h3>${esc(w.en)}</h3><p>${esc(w.note)}</p></div><p>Mastery: ${esc(w.mastery)}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${masteryLevels.map(m=>`<button class="secondary" data-mastery="${m}">${m}</button>`).join('')}<button id="next-word">Next →</button></div></div>`;panel.querySelector('#reveal').onclick=()=>panel.querySelector('#answer').hidden=false;panel.querySelector('#next-word').onclick=()=>{flashIndex++;wireVocabulary()};panel.querySelectorAll('[data-mastery]').forEach(b=>b.onclick=async()=>{try{await savePersonalWord({...w,mastery:b.dataset.mastery});flashIndex++;wireVocabulary()}catch(e){alert(humanError(e))}});return}panel.innerHTML=entries.map((w,i)=>`<div class="card"><h3>${esc(w.es)}</h3><p>${esc(w.en)}</p><p>${esc(w.note)}</p><label>Mastery <select data-level="${i}">${masteryLevels.map(m=>`<option ${m===w.mastery?'selected':''}>${m}</option>`).join('')}</select></label> <button class="secondary" data-delete="${i}">Remove</button></div>`).join('');panel.querySelectorAll('[data-level]').forEach(el=>el.onchange=async()=>{try{await savePersonalWord({...entries[Number(el.dataset.level)],mastery:el.value})}catch(e){alert(humanError(e));wireVocabulary()}});panel.querySelectorAll('[data-delete]').forEach(el=>el.onclick=async()=>{if(!confirm('Remove this saved word?'))return;try{await removePersonalWord(entries[Number(el.dataset.delete)].id);wireVocabulary()}catch(e){alert(humanError(e))}})}catch(e){if(panel.isConnected)panel.textContent=humanError(e)}}
function verbLab(){return `<div class="eyebrow">Grammar reference</div><h1>Verb Lab</h1><p class="muted">Present-tense forms used in Mexican Spanish. Ustedes is the everyday plural “you” form.</p>${verbs.map(v=>`<div class="card"><h2>${esc(v.verb)} <small class="muted">— ${esc(v.meaning)}</small></h2>${Object.entries(v.present).map(([p,f])=>`<div class="lesson-row"><span>${esc(p)}</span><strong>${esc(f)}</strong></div>`).join('')}</div>`).join('')}`}
function conversation(){return `<div class="eyebrow">Real-life Spanish</div><h1>Conversation</h1><p class="muted">Starter dialogue: meeting someone in Mexico.</p><div class="card"><div class="example"><strong>A:</strong> ¡Hola! ¿Cómo te llamas?<div class="muted">Hi! What's your name?</div></div><div class="example"><strong>B:</strong> Me llamo Ana. ¿Y tú?<div class="muted">My name is Ana. And you?</div></div><div class="example"><strong>A:</strong> Soy Luis. Mucho gusto.<div class="muted">I'm Luis. Nice to meet you.</div></div><div class="example"><strong>B:</strong> ¡Igualmente!<div class="muted">Likewise!</div></div><p class="muted">Listening audio and speaking exercises are planned for a later release.</p></div>`}
function practice(){let done=saved();return `<div class="eyebrow">Review</div><h1>Practice</h1><p class="muted">Review the quizzes in your available study guides. A spaced-repetition scheduler and expanded exercise bank are planned.</p><div class="card"><h2>Review a lesson</h2>${a0().filter(l=>lessonContent[l.id]).map(l=>`<div class="lesson-row"><span>${esc(l.title)} ${done.includes(l.id)?'✓':''}</span><button data-lesson="${l.id}">Practice</button></div>`).join('')}</div>`}
async function init(){try{await authReady;let [c,v,b]=await Promise.all(['data/curriculum.json','data/vocabulary.json','data/verbs.json'].map(p=>fetch(p).then(r=>{if(!r.ok)throw Error(p);return r.json()})));curriculum=c;vocab=v;verbs=b;render()}catch(e){root.innerHTML='<div class="card"><h2>Unable to load lesson data</h2><p>Run the site through GitHub Pages or a local web server rather than opening index.html directly.</p></div>'}}onProfileChange(()=>{if(curriculum)render();else renderAccount()});window.addEventListener('ss-error',e=>showNotice(e.detail));init();

const partnerScenarios=[
 {title:"Presentaciones",subtitle:"Introduce yourselves",lines:[["Hola, ¿cómo te llamas?","Hi, what's your name?"],["Me llamo ___. ¿Y tú?","My name is ___. And you?"],["Soy ___. Mucho gusto.","I'm ___. Nice to meet you."],["¡Igualmente!","Likewise!"]]},
 {title:"En la taquería",subtitle:"Order food politely",lines:[["Buenas tardes. ¿Qué va a ordenar?","Good afternoon. What would you like to order?"],["Dos tacos, por favor.","Two tacos, please."],["¿Algo de tomar?","Anything to drink?"],["Un agua de jamaica, por favor.","A hibiscus drink, please."]]},
 {title:"¿De dónde eres?",subtitle:"Ask about hometowns",lines:[["¿De dónde eres?","Where are you from?"],["Soy de California. ¿Y tú?","I'm from California. And you?"],["Soy de México.","I'm from Mexico."],["¡Qué padre!","How cool!"]]}
];
let partnerIndex=0, partnerRole=0, partnerTranslate=false;
function partnerPractice(){
 const s=partnerScenarios[partnerIndex],lineNums=partnerRole===0?[0,2]:[1,3];
 return `<div class="eyebrow">Together · A0 Mexican Spanish</div><h1>Practice Together</h1><p class="muted">Study separately and take turns speaking together. Each account keeps its own progress. For these exercises, sit together or use a call — live partner syncing is planned for later.</p>
 <div class="card"><label for="scenario"><strong>Choose a conversation</strong></label><select id="scenario">${partnerScenarios.map((x,i)=>`<option value="${i}" ${i===partnerIndex?'selected':''}>${esc(x.title)} — ${esc(x.subtitle)}</option>`).join('')}</select>
 <h2>${esc(s.title)}</h2><p class="muted">Person A reads lines 1 and 3; Person B reads lines 2 and 4. Swap after each round.</p><div class="role-switch"><button id="role-a" class="${partnerRole===0?'':'secondary'}">I'm Person A</button><button id="role-b" class="${partnerRole===1?'':'secondary'}">I'm Person B</button></div>
 ${s.lines.map((line,i)=>`<div class="example ${lineNums.includes(i)?'your-line':''}"><strong>${i%2===0?'A':'B'}:</strong> ${esc(line[0])}${partnerTranslate?`<div class="muted">${esc(line[1])}</div>`:''}${lineNums.includes(i)?'<span class="pill">Your line</span>':''}</div>`).join('')}
 <div class="role-switch"><button class="secondary" id="translations">${partnerTranslate?'Hide':'Show'} translations</button><button id="swap">Switch roles ↔</button></div></div>`;
}
function wirePartner(){document.querySelector('#scenario').onchange=e=>{partnerIndex=Number(e.target.value);render()};document.querySelector('#role-a').onclick=()=>{partnerRole=0;render()};document.querySelector('#role-b').onclick=()=>{partnerRole=1;render()};document.querySelector('#translations').onclick=()=>{partnerTranslate=!partnerTranslate;render()};document.querySelector('#swap').onclick=()=>{partnerRole=1-partnerRole;render()}}
function humanError(error){const messages={'auth/invalid-email':'Enter a valid email address.','auth/invalid-credential':'Email or password is incorrect.','auth/email-already-in-use':'This email already has an account. Sign in instead.','auth/weak-password':'Choose a stronger password (at least 6 characters).','auth/popup-closed-by-user':'The Google window was closed. Try again.','permission-denied':'Firestore blocked progress saving. Check your published rules.'};return messages[error.code]||error.message||'Something went wrong. Try again.'}
function showNotice(message){const node=document.querySelector('#account-error');if(node)node.textContent=message;else alert(message)}
function renderAccount(){
 const el=document.querySelector('#account-bar');if(!el)return;
 const user=getCurrentUser();
 if(!user){el.innerHTML=`<div class="account-inner"><span class="account-status">Sign in to sync your personal progress</span><button id="google-sign-in" class="account-button">Continue with Google</button><button id="email-sign-in" class="account-button outline">Email sign-in</button><span id="account-error" role="status"></span></div><div class="account-form" id="account-form" hidden></div>`;
 el.querySelector('#google-sign-in').onclick=async()=>{try{await loginGoogle()}catch(e){showNotice(humanError(e))}};
 el.querySelector('#email-sign-in').onclick=()=>showEmailForm();return;
 }
 el.innerHTML=`<div class="account-inner"><span class="account-status">Signed in: <strong>${esc(user.displayName||user.email||'Learner')}</strong></span>${hasLocalProgress()?'<button id="import-progress" class="account-button outline">Import browser progress</button>':''}<button id="sign-out" class="account-button outline">Sign out</button><span id="account-error" role="status"></span></div>`;
 el.querySelector('#sign-out').onclick=async()=>{try{await logout()}catch(e){showNotice(humanError(e))}};
 const importButton=el.querySelector('#import-progress');
 if(importButton)importButton.onclick=async()=>{if(!confirm('Import old browser-only progress into this Google/Firebase account? Only choose this if the progress belongs to you.'))return;try{await migrateLocal()}catch(e){showNotice(humanError(e))}};
}
function showEmailForm(){
 const form=document.querySelector('#account-form');form.hidden=false;
 form.innerHTML=`<form id="email-auth-form"><label>Email <input name="email" autocomplete="email" type="email" required></label><label>Password <input name="password" autocomplete="current-password" type="password" minlength="6" required></label><div class="role-switch"><button type="submit">Sign in</button><button type="button" id="register-email" class="secondary">Create account</button><button type="button" id="reset-email" class="secondary">Reset password</button><button type="button" id="cancel-email" class="secondary">Cancel</button></div><p id="form-error" role="status"></p></form>`;
 const f=form.querySelector('#email-auth-form');const values=()=>({email:f.elements.namedItem('email').value,password:f.elements.namedItem('password').value});
 const err=e=>{form.querySelector('#form-error').textContent=humanError(e)};
 f.onsubmit=async e=>{e.preventDefault();try{const v=values();await loginEmail(v.email,v.password);form.hidden=true}catch(e){err(e)}};
 form.querySelector('#register-email').onclick=async()=>{try{const v=values();await registerEmail(v.email,v.password);form.hidden=true}catch(e){err(e)}};
 form.querySelector('#reset-email').onclick=async()=>{try{const v=values();if(!v.email)throw new Error('Enter your email address first.');await resetPassword(v.email);form.querySelector('#form-error').textContent='Password reset email sent.'}catch(e){err(e)}};
 form.querySelector('#cancel-email').onclick=()=>form.hidden=true;
}
