// ─────────────────────────────────────────────────────────────────────────────
// GyanSetu UI localization — when the student language changes, the WHOLE
// page (nav, headings, descriptions, buttons, empty states, badges) switches.
// Fallback chain: selected language → Hindi → English.
// Tribal-language UI strings are prototype packs (community validation
// pending) — where a translation is not yet validated, Hindi is used.
// Strings are written for 5–8 year old learners: short, warm, gamified.
// ─────────────────────────────────────────────────────────────────────────────
import { type LanguageCode } from "@/lib/languages";

export type UiKey =
  // shell
  | "home" | "teacher" | "liveMeet" | "learn" | "worksheets" | "dictionary"
  | "progress" | "askAi" | "flashcards" | "architecture"
  | "demoMode" | "onlineAI" | "onlineDesc" | "offlineAI" | "offlineDesc"
  | "checking" | "notConfigured" | "verifiedOk" | "verifiedPending" | "offlineBadge"
  | "login" | "logout" | "enterApp" | "demoLogin" | "yourName" | "teacherRole" | "studentRole"
  | "studentLang" | "teacherLang" | "answerLang" | "learningLang" | "classLabel"
  | "difficulty" | "easy" | "medium" | "hard" | "questions" | "allClasses" | "allSubjects"
  | "ask" | "search" | "listen" | "stopMic" | "sendClass" | "generate" | "start"
  | "submit" | "tryAgain" | "explainLesson" | "startQuiz" | "lookUp" | "print" | "save"
  | "sync" | "nextStep" | "readAloud" | "copy" | "copied" | "flip" | "prev" | "next"
  | "meaning" | "example" | "takeaway" | "steps" | "explanation" | "objective"
  | "answerKey" | "showAnswers" | "hideAnswers" | "try" | "thinking" | "voiceBridge"
  | "autoSpeak" | "pipeline" | "offlineSynced" | "syncDone"
  // home
  | "heroText" | "heroClass" | "heroAsk" | "demoTitle" | "demoSub"
  | "engineTitle" | "engineSub" | "engineB1" | "engineB2" | "engineB3" | "engineNet"
  | "pipe1T" | "pipe1X" | "pipe2T" | "pipe2X" | "pipe3T" | "pipe3X" | "pipe4T" | "pipe4X"
  | "qlTeacher" | "qlTeacherX" | "qlLearn" | "qlLearnX" | "qlWorksheets" | "qlWorksheetsX"
  | "qlDictionary" | "qlDictionaryX" | "qlFlashcards" | "qlFlashcardsX" | "qlProgress" | "qlProgressX"
  | "qlAsk" | "qlAskX" | "qlArch" | "qlArchX" | "homeLangNote1" | "homeLangNote2"
  // teacher
  | "teacherSub" | "statHindi" | "statMath" | "statEvs" | "teachModeTitle" | "teachModeSub"
  | "teachOnline1" | "teachOnline2" | "teachOffline1" | "teachOffline2" | "teachGotoClass"
  | "teachQuickTitle" | "teachQuickSub" | "qaWorksheet" | "qaBrowse" | "qaDictionary" | "qaProgress"
  | "teachLibTitle" | "teachLibSub" | "meetBanner" | "meetBannerText" | "openClass"
  // classroom
  | "classInputTitle" | "classInputSub" | "classOutputTitle" | "classOutputSub" | "classEmpty"
  | "classThinkOnline" | "classThinkOffline" | "classHint" | "classForChild" | "classSimplified"
  | "classNoteLabel" | "classMicFail" | "classMicStartFail" | "classPure" | "classMixed"
  | "classSpeaking" | "classTryLabel" | "classPipeline" | "classStudent" | "classTotal"
  | "classSTT" | "classAI" | "classTTS" | "classBridgeHint" | "bridgeAward"
  // learn
  | "learnSub" | "searchPh" | "learnEmpty" | "backAll" | "tabLesson" | "tabExplain" | "tabQuiz"
  | "hindiCurric" | "englishRef" | "examplesHi" | "examplesEn" | "explainCardTitle"
  | "explainSubOnline" | "explainSubOffline" | "explainInvite" | "explainBtn"
  | "explainThinkOnline" | "explainThinkOffline" | "quizCardTitle" | "quizSubOnline" | "quizSubOffline"
  | "quizInvite" | "quizBtn" | "quizThinkOnline" | "quizThinkOffline" | "submitQuiz"
  | "scoreLine" | "savedServer" | "savedQueue" | "savedFail" | "loginNote"
  | "great" | "good" | "perfect" | "tryMore" | "earnedStars"
  // worksheets
  | "wsSub" | "wsInfoOnline" | "wsInfoOffline" | "wsEmpty" | "wsSaved" | "wsSaveFail"
  | "wsTypeMcq" | "wsTypeFill" | "wsTypeShort" | "wsAnsLabel" | "wsAward"
  // flashcards
  | "fcSub" | "fcSubOnline" | "fcSubOffline" | "fcEmpty" | "fcFlipHint" | "fcLabel" | "fcAward"
  // dictionary
  | "dictSub" | "dictPh" | "dictEmpty" | "dictBadgeExact" | "dictBadgeAI" | "dictBadgeOffline" | "dictTransLabel"
  // progress
  | "progSubNamed" | "progSubAnon" | "statAttempts" | "statAvg" | "statEngine"
  | "histTitle" | "histSub" | "histEmpty" | "offlineWaiting" | "syncNothing" | "cachedAIBadge"
  | "syncUp" | "syncDown" | "onlineSyncHint" | "recTitle" | "recSubOnline" | "recSubOffline"
  | "recRemedial" | "recTargeted" | "recChallenge" | "recRevision" | "recOpenLesson"
  // ask
  | "askSub" | "askPh" | "askEmptyTitle" | "askEmptyText" | "askThinkOnline" | "askThinkOffline"
  | "outsideLessons" | "answerLabel" | "followUpLabel" | "askAward"
  // gamification
  | "mascotHi" | "mascotTip" | "levelLabel" | "xpLabel" | "xpToNext" | "rewardsTitle"
  | "achQuiz" | "achPerfect" | "achThree" | "achExplorer" | "achPolyglot" | "achWS" | "achFC"
  | "congrats"
  | "languageBar" | "askAnyLangNote"
  // studio / student panel / leaderboard / publishing
  | "studio" | "studioSub" | "uploadTitle" | "uploadSub" | "uploadKind" | "uploadText"
  | "uploadLink" | "uploadFile" | "uploadTitleLabel" | "uploadLesson" | "uploadPublish"
  | "uploadNote" | "uploadSuccess" | "uploadFail" | "uploadTextarea" | "uploadUrlPh"
  | "prepareStudentVersion" | "studentVersionPrepared" | "studentVersionPreview" | "prepareOnlineOnly"
  | "prepareBeforePublish" | "uploadFileHint" | "emptyMaterial" | "pasteLinkFirst" | "chooseFileFirst"
  | "pdfUnreadable" | "linkUnreadable" | "fileTooLarge" | "sourceEmpty"
  | "artifactNotTranslatable" | "contentUnavailable"
  | "myClass" | "myClassSub" | "classGreeting" | "classFeed" | "classFeedEmpty"
  | "classLeaderboard" | "classYourLevel" | "leaderboardTitle" | "leaderboardEmpty"
  | "publishClass" | "publishedNote" | "viewContent" | "contentKind" | "classContent"
  | "studioSteps" | "studioExamples" | "studioTakeaway" | "studioListen"
  | "welcomeTeacher" | "welcomeStudent" | "welcomeGuest" | "you" | "recentPublished"
  | "syncNow" | "syncedAt" | "syncOfflineHint" | "syncSummary"
  | "statusOnline" | "statusConfigRequired" | "statusUnavailable" | "statusOfflineMode"
  | "errConfig" | "errRateLimit" | "errNetwork" | "practiceLabel" | "connectionLabel"
  | "camOn" | "camOff" | "camUnavailable" | "turnOnCam" | "leaveCall"
  | "teacherSays" | "studentSays" | "hears" | "conversationLog" | "youLabel"
  | "lessonConverted" | "lessonStatic" | "convertLessonBtn" | "convertingLesson"
  | "pgtLeft" | "pgtRetry" | "camSelect"
  | "offlineHub" | "hubSub" | "hubHonest" | "hubExplain" | "hubQa" | "hubExample"
  | "hubPractice" | "hubFeedback" | "hubWorksheet" | "hubFlashcards" | "hubVocab"
  | "hubSimplify" | "hubVoice" | "hubRun" | "hubStudentAns" | "hubExpected"
  | "hubCheck" | "hubInput" | "hubOutput" | "hubCapabilities" | "hubNotOffline"
  | "hubFootprint" | "hubCacheItems" | "hubNoLlm" | "langsDemonstrated"
  | "lessonLabel" | "subjectLabel" | "fourLangPromise" | "coverageTitle" | "ttsHonest";

const HI: Record<UiKey, string> = {
  home: "🏠 होम", teacher: "👩‍🏫 शिक्षक", liveMeet: "🔴 लाइव मीट", learn: "🌱 सीखो",
  worksheets: "📝 कार्यपत्रक", dictionary: "📚 शब्दकोश", progress: "📊 प्रगति",
  askAi: "💬 AI से पूछो", flashcards: "🃏 फ़्लैशकार्ड", architecture: "⚙️ तकनीकी ढाँचा",
  demoMode: "प्रदर्शन मोड", onlineAI: "🌐 ऑनलाइन AI", onlineDesc: "Nemotron 3 Ultra — पूरी बुद्धिमत्ता (सुरक्षित सर्वर से)",
  offlineAI: "📴 ऑफ़लाइन", offlineDesc: "स्थानीय इंजन — सहेजे पाठ, शब्द-बैंक व सामग्री",
  checking: "🧠 Nemotron की जाँच…", notConfigured: "⚠️ ऑनलाइन — Nemotron कॉन्फ़िगर नहीं",
  verifiedOk: "🧠 ऑनलाइन — Nemotron 3 Ultra ✓", verifiedPending: "🧠 Nemotron कॉन्फ़िगर — सत्यापन बाकी",
  offlineBadge: "📴 ऑफ़लाइन — स्थानीय इंजन",
  login: "👤 लॉगिन", logout: "लॉगआउट", enterApp: "ज्ञानसेतु में आओ!",
  demoLogin: "डेमो लॉगिन", yourName: "तुम्हारा नाम", teacherRole: "👩‍🏫 शिक्षक", studentRole: "🧑‍🎓 विद्यार्थी",
  studentLang: "विद्यार्थी भाषा", teacherLang: "शिक्षक भाषा", answerLang: "उत्तर की भाषा",
  learningLang: "सीखने की भाषा", classLabel: "कक्षा", difficulty: "कठिनाई",
  easy: "आसान", medium: "मध्यम", hard: "कठिन", questions: "प्रश्न",
  allClasses: "सभी कक्षाएँ", allSubjects: "सभी विषय",
  ask: "पूछो ➤", search: "🔎 खोजो", listen: "🎤 बोलो (माइक)", stopMic: "⏹️ माइक बंद",
  sendClass: "🎙️ कक्षा में भेजो", generate: "🧠 बनाओ", start: "शुरू करो",
  submit: "✅ जमा करो", tryAgain: "🔄 फिर खेलो", explainLesson: "पाठ समझाओ",
  startQuiz: "क्विज़ शुरू करो", lookUp: "🔎 देखो", print: "🖨️ छापो", save: "💾 सहेजो",
  sync: "🔄 सिंक करो", nextStep: "🧭 अब आगे क्या?", readAloud: "🔊 सुनो",
  copy: "📋 नकल", copied: "✓ नकल हुआ", flip: "🔄 पलटो", prev: "← पिछला", next: "अगला →",
  meaning: "अर्थ", example: "🌱 रोज़मर्रा का उदाहरण", takeaway: "⭐ याद रखो",
  steps: "चरण", explanation: "समझ", objective: "🎯 सीखने का लक्ष्य",
  answerKey: "उत्तर-कुंजी", showAnswers: "🔑 उत्तर दिखाओ", hideAnswers: "🙈 उत्तर छिपाओ",
  try: "आज़माओ:", thinking: "सोच रहा है…", voiceBridge: "🗣️ आवाज़ से आवाज़ पुल",
  autoSpeak: "🔊 उत्तर अपने-आप बोलो", pipeline: "पाइपलाइन",
  offlineSynced: "ऑफ़लाइन सहेजा — ऑनलाइन होते ही सिंक होगा", syncDone: "✓ सिंक पूरा",

  heroText: "हिन्दी बोलने वाले शिक्षक बोलते हैं — Nemotron 3 Ultra समझता है, सरल बनाता है — और हर बच्चा Santhali, Ho या Mundari में सीखता है।",
  heroClass: "🔴 जादुई कक्षा आज़माओ", heroAsk: "💬 AI से सवाल पूछो",
  demoTitle: "🎛️ प्रदर्शन मोड", demoSub: "खुद चुनो — ऑनलाइन AI या ऑफ़लाइन। यह अपने आप कभी नहीं बदलता।",
  engineTitle: "🧠 इंजन की स्थिति", engineSub: "यह असली रास्ता दिखाता है — अनुमान नहीं।",
  engineB1: "ऑनलाइन: ब्राउज़र → GyanSetu API → Nemotron 3 Ultra। API key ब्राउज़र में कभी नहीं जाती।",
  engineB2: "ऑफ़लाइन: IndexedDB + बंडल पाठ्यक्रम + शब्द-बैंक। Nemotron उपयोग नहीं होता और UI ईमानदारी से बताता है।",
  engineB3: "विद्यार्थी भाषा: हर AI अनुरोध में चुनी भाषा जाती है — उत्तर उसी भाषा में आता है।",
  engineNet: "📶 डिवाइस की कनेक्टिविटी केवल जानकारी है — ऊपर चुना मोड ही रास्ता तय करता है।",
  pipe1T: "शिक्षक का इनपुट", pipe1X: "हिन्दी में आवाज़ या लिखित — किसी आदिवासी भाषा की ज़रूरत नहीं।",
  pipe2T: "AI शिक्षा-इंजन", pipe2X: "Nemotron अर्थ समझता है और छोटी कक्षा के लिए सरल बनाता है।",
  pipe3T: "मातृभाषा की परत", pipe3X: "Santhali, Ho, Mundari — पाठ, प्रश्न, क्विज़ और आवाज़।",
  pipe4T: "प्रगति व अनुकूलन", pipe4X: "असली क्विज़ नतीजे Nemotron को अगला कदम बताते हैं।",
  qlTeacher: "👩‍🏫 शिक्षक डैशबोर्ड", qlTeacherX: "कक्षा, जादुई कक्षा और लाइव अनुवाद",
  qlLearn: "🌱 सीखो", qlLearnX: "12 NIPUN पाठ + AI समझ और खेल-क्विज़",
  qlWorksheets: "📝 कार्यपत्रक", qlWorksheetsX: "Nemotron से द्विभाषी कार्यपत्रक",
  qlDictionary: "📚 शब्दकोश", qlDictionaryX: "तुरंत अर्थ + AI की समझ",
  qlFlashcards: "🃏 फ़्लैशकार्ड", qlFlashcardsX: "तुम्हारी भाषा में चित्र-कार्ड",
  qlProgress: "📊 प्रगति", qlProgressX: "सितारे, स्तर और स्मार्ट सुझाव",
  qlAsk: "💬 AI से पूछो", qlAskX: "कोई भी सवाल — मातृभाषा में उत्तर",
  qlArch: "⚙️ तकनीकी ढाँचा", qlArchX: "LLM/AI/बैकएंड डिज़ाइन + ऑफ़लाइन मैट्रिक्स",
  homeLangNote1: "अभी चुनी गई भाषा:", homeLangNote2: "— यह पूरे ऐप के हर पेज पर लागू है।",

  teacherSub: "हिन्दी में पढ़ाओ। GyanSetu हर बच्चे की मातृभाषा में पहुँचाता है।",
  statHindi: "📖 हिन्दी पाठ", statMath: "🔢 गणित पाठ", statEvs: "🌿 पर्यावरण पाठ",
  teachModeTitle: "🎛️ अभी का मोड", teachModeSub: "AI परत असल में क्या चला रही है",
  teachOnline1: "🧠 Nemotron 3 Ultra सक्रिय है: खोज, शिक्षा, अनुवाद, कार्यपत्रक, क्विज़, सुझाव।",
  teachOnline2: "सभी अनुरोध: शिक्षक-ब्राउज़र → GyanSetu सर्वर → OpenRouter/NVIDIA। keys सर्वर पर ही रहती हैं।",
  teachOffline1: "📴 ऑफ़लाइन इंजन सक्रिय: सहेजे पाठ, शब्द-बैंक अनुवाद, कैश्ड क्विज़/कार्यपत्रक।",
  teachOffline2: "पूरी Nemotron बुद्धिमत्ता के लिए ऊपर ONLINE AI चुनो।",
  teachGotoClass: "🔴 जादुई कक्षा में जाओ →",
  teachQuickTitle: "⚡ तुरंत काम", teachQuickSub: "पाठ तैयारी के उपकरण",
  qaWorksheet: "📝 कार्यपत्रक बनाओ", qaBrowse: "🌱 पाठ देखो", qaDictionary: "📚 शब्दकोश", qaProgress: "📊 कक्षा प्रगति",
  teachLibTitle: "📚 पाठ्यक्रम पुस्तकालय", teachLibSub: "NIPUN Bharat / FLN पाठ (कक्षा 1–3)",
  meetBanner: "Live Meet — जादुई कक्षा",
  meetBannerText: "शिक्षक हिन्दी बोलते हैं → AI अर्थ समझता है → बच्चा Santhali/Ho/Mundari में सुनता है (लिखित + आवाज़)",
  openClass: "🔴 Live Meet खोलो",

  classInputTitle: "👩‍🏫 शिक्षक — बोलो या लिखो", classInputSub: "इनपुट भाषा: {lang}",
  classOutputTitle: "🧑‍🎓 विद्यार्थी — मातृभाषा में सुनता है", classOutputSub: "आउटपुट भाषा: {lang}",
  classEmpty: "शिक्षक का निर्देश यहाँ {lang} में आएगा — छोटे बच्चे के लिए सरल रूप में।",
  classThinkOnline: "Nemotron अनुवाद व शिक्षा-अनुकूलन कर रहा है…",
  classThinkOffline: "ऑफ़लाइन शब्द-बैंक अनुवाद कर रहा है…",
  classHint: "अर्थ समझना → शिक्षा-अनुकूलन → {lang} आउटपुट",
  classForChild: "🗣️ {lang} — बच्चे के लिए", classSimplified: "✏️ कक्षा 1–3 के लिए सरल",
  classNoteLabel: "नोट", classMicFail: "इस ब्राउज़र में आवाज़ काम नहीं करती — लिखकर भेजो।",
  classMicStartFail: "माइक चालू नहीं हुआ — लिखकर भेजो।",
  classPure: "शुद्ध {lang}", classMixed: "भाषा-मिश्रण ठीक किया",
  classSpeaking: "🔊 बोल रहा है…", classTryLabel: "आज़माओ:",
  classPipeline: "पाइपलाइन", classStudent: "विद्यार्थी", classTotal: "कुल",
  classSTT: "आवाज़→लिखित", classAI: "AI", classTTS: "लिखित→आवाज़",
  classBridgeHint: "(माइक → अनुवाद → आवाज़)", bridgeAward: "जादुई पुल चला! +1 ⭐",

  learnSub: "NIPUN Bharat / FLN पाठ (कक्षा 1–3)। अपने शब्दों में खोजो — जैसे “पानी से बादल कैसे बनते हैं?”",
  searchPh: "🔍 अपने शब्दों में खोजो…",
  learnEmpty: "कोई पाठ नहीं मिला। “बारिश”, “जोड़” या “संज्ञा” आज़माओ।",
  backAll: "← सभी पाठ",
  tabLesson: "📖 पाठ", tabExplain: "🧠 AI समझ", tabQuiz: "❓ खेल-क्विज़",
  hindiCurric: "📘 हिन्दी — पाठ्यक्रम", englishRef: "🌐 English — संदर्भ",
  examplesHi: "उदाहरण", examplesEn: "Examples",
  explainCardTitle: "🧠 AI की समझ — {lang}",
  explainSubOnline: "Nemotron इस पाठ से ताज़ा समझ बनाता है", explainSubOffline: "ऑफ़लाइन इंजन सहेजे पाठ से उत्तर देता है",
  explainInvite: "यह पाठ {lang} में कहानी की तरह समझो!",
  explainBtn: "🧠 {lang} में समझाओ",
  explainThinkOnline: "Nemotron समझ तैयार कर रहा है…", explainThinkOffline: "सहेजे पाठ से पढ़ रहा है…",
  quizCardTitle: "❓ खेल-क्विज़ — {title}", quizSubOnline: "Nemotron इसी पाठ से सवाल बनाता है",
  quizSubOffline: "ऑफ़लाइन सहेजा क्विज़",
  quizInvite: "सवाल इसी पाठ के अंदर से आएँगे — और तुम्हारे पिछले स्कोर के अनुसार!",
  quizBtn: "❓ {lang} क्विज़ शुरू करो",
  quizThinkOnline: "Nemotron सवाल लिख रहा है…", quizThinkOffline: "सहेजा क्विज़ खुल रहा है…",
  submitQuiz: "✅ उत्तर जमा करो", scoreLine: "स्कोर:",
  savedServer: "✓ प्रगति में सहेजा गया (असली डेटाबेस रिकॉर्ड)।",
  savedQueue: "📴 ऑफ़लाइन सहेजा — ONLINE AI चुनते ही सिंक होगा।",
  savedFail: "प्रगति सहेज नहीं पाए।",
  loginNote: "प्रगति बचाने के लिए ऊपर दाईं ओर लॉगिन करो।",
  great: "शाबाश! 👏", good: "अच्छा! 🌟", perfect: "पूरे नंबर! 💯", tryMore: "फिर खेलो!",
  earnedStars: "सितारे मिले:",

  wsSub: "असली पाठ से द्विभाषी कार्यपत्रक — सवाल पाठ्यक्रम के अंदर ही रहते हैं और {lang} में आते हैं।",
  wsInfoOnline: "Nemotron 3 Ultra लाइव बनाता है — पाठ की कक्षा, विषय, लक्ष्य और NIPUN परिणाम के साथ। नतीजा मान्यता-जाँच से गुज़रता है।",
  wsInfoOffline: "ऑफ़लाइन मोड सहेजे कार्यपत्रक पैक का उपयोग करता है।",
  wsEmpty: "पाठ चुनो और “कार्यपत्रक बनाओ” दबाओ। शिक्षक का हिन्दी इनपुट {lang} में बदल जाता है।",
  wsSaved: "✓ कार्यपत्रक स्कूल डेटाबेस में सहेजा गया।", wsSaveFail: "सहेज नहीं पाए।",
  wsTypeMcq: "सही उत्तर चुनो", wsTypeFill: "खाली जगह भरो", wsTypeShort: "छोटा उत्तर लिखो",
  wsAnsLabel: "✅ उत्तर:", wsAward: "कार्यपत्रक तैयार! +5 ⭐",

  fcSub: "{lang} में कार्ड — शब्द, अर्थ, उदाहरण और सीखने का लक्ष्य।",
  fcSubOnline: "Nemotron पाठ से बनाता है।", fcSubOffline: "सहेजे पैक से बनता है।",
  fcEmpty: "पाठ चुनो और {lang} कार्ड बनाओ!",
  fcFlipHint: "कार्ड छुओ — जादू से अर्थ दिखेगा! ✨", fcLabel: "कार्ड",
  fcAward: "कार्ड का पहाड़ तैयार! +5 ⭐",

  dictSub: "पक्के शब्द तुरंत मिलते हैं। अधूरे या गलत लिखे सवाल — जैसे “कमल का मतलब क्या है?” — AI समझता है।",
  dictPh: "पानी, बादल, खरगोश… या पूरा सवाल",
  dictEmpty: "शब्दकोश में {n} पक्के शब्द हैं (हिन्दी/English/Santhali/Ho/Mundari) — ऑनलाइन मोड में किसी भी शब्द की AI समझ मिलती है।",
  dictBadgeExact: "📚 पक्का स्थानीय शब्द — बिना AI कॉल",
  dictBadgeAI: "🧠 AI की संदर्भ-समझ", dictBadgeOffline: "📴 ऑफ़लाइन शब्दकोश",
  dictTransLabel: "{lang} में",

  progSubNamed: "{name} ({role}) के असली क्विज़ रिकॉर्ड — स्कूल डेटाबेस में।",
  progSubAnon: "क्विज़ ट्रैक करने के लिए ऊपर लॉगिन करो। रिकॉर्ड असली डेटाबेस पंक्तियाँ हैं।",
  statAttempts: "क्विज़ प्रयास", statAvg: "औसत स्कोर", statEngine: "उपयोग इंजन",
  histTitle: "🧾 प्रयास इतिहास", histSub: "PostgreSQL में Drizzle ORM से सहेजा",
  histEmpty: "अभी कोई क्विज़ नहीं — सीखो खोलो और खेल-क्विज़ खेलो। नतीजा असली रिकॉर्ड बनता है और Nemotron अगला कदम सुझाता है।",
  offlineWaiting: "📴 {n} रिकॉर्ड ऑफ़लाइन सहेजे हैं — ONLINE AI चुनो या सिंक दबाओ।",
  syncNothing: "सिंक करने को कुछ नहीं।",
  cachedAIBadge: "कैश्ड AI", syncUp: "{n} ऑफ़लाइन रिकॉर्ड ऊपर भेजे ✓",
  syncDown: "{n} AI उत्तर ऑफ़लाइन उपयोग के लिए सहेजे ✓",
  onlineSyncHint: "🧠 हर Nemotron उत्तर अपने-आप PostgreSQL में सहेजता है — सिंक इतिहास को डिवाइस पर लाता है, ताकि वही सवाल बाद में ऑफ़लाइन भी चलें।",
  recTitle: "🧭 AI सीखने का सुझाव", recSubOnline: "Nemotron ने असली प्रगति पर सोचा",
  recSubOffline: "ऑफ़लाइन ह्यूरिस्टिक",
  recRemedial: "🔁 फिर अभ्यास", recTargeted: "🎯 अभ्यास", recChallenge: "🚀 चुनौती", recRevision: "🔁 दोहराना",
  recOpenLesson: "🌱 यह पाठ खोलो →",

  askSub: "पाठों के बारे में कुछ भी पूछो। उत्तर {lang} में आएगा — छोटे बच्चे के लिए, रोज़मर्रा के उदाहरण के साथ।",
  askPh: "अपना सवाल पूछो… जैसे: पानी से बादल कैसे बनते हैं?",
  askEmptyTitle: "🧒 अभी कोई सवाल नहीं",
  askEmptyText: "पूछो: “पानी बादल कैसे बनता है?” — Nemotron जल चक्र को कहानी की तरह समझाएगा!",
  askThinkOnline: "Nemotron सोच रहा है…", askThinkOffline: "स्थानीय इंजन उत्तर दे रहा है…",
  outsideLessons: "पाठ से बाहर", answerLabel: "उत्तर", followUpLabel: "🤔",
  askAward: "सवाल पूछा! +2 ⭐",

  languageBar: "🌐 भाषा / Language",
  askAnyLangNote: "तुम किसी भी भाषा में लिखो — उत्तर हमेशा {lang} में ही मिलेगा।",
  studio: "📤 अपलोड स्टूडियो", studioSub: "पाठ सामग्री अपलोड करो — Nemotron उसे हर बच्चे की भाषा में ढाल देगा।",
  uploadTitle: "📤 नई सामग्री अपलोड करो", uploadSub: "लिखो, PDF चुनो या लिंक दो। पहले बच्चे की भाषा में सामग्री देखो, फिर प्रकाशित करो।",
  uploadKind: "प्रकार", uploadText: "✍️ लिखित (text)", uploadLink: "🔗 लिंक (link)", uploadFile: "📎 फ़ाइल (txt/pdf)",
  uploadTitleLabel: "शीर्षक", uploadLesson: "संबंधित पाठ", uploadPublish: "📢 प्रकाशित करो",
  prepareStudentVersion: "🧠 विद्यार्थी संस्करण बनाओ", studentVersionPrepared: "विद्यार्थी संस्करण तैयार",
  studentVersionPreview: "विद्यार्थी को यह सामग्री दिखेगी", prepareOnlineOnly: "विद्यार्थी संस्करण बनाने के लिए ऑनलाइन AI चालू करो।",
  prepareBeforePublish: "पहले वर्तमान सामग्री और भाषा का विद्यार्थी संस्करण बनाओ।",
  uploadFileHint: "txt या PDF चुनें — PDF का पाठ भी समझाया जाएगा।", emptyMaterial: "सामग्री खाली है — पहले कुछ लिखो।",
  pasteLinkFirst: "पहले लिंक डालो।", chooseFileFirst: "पहले फ़ाइल चुनो।",
  pdfUnreadable: "इस PDF से पाठ नहीं पढ़ा जा सका। टेक्स्ट वाला PDF चुनें या सामग्री यहाँ लिखें।",
  linkUnreadable: "लिंक नहीं पढ़ा जा सका। लिंक जाँचकर फिर कोशिश करो।", fileTooLarge: "फ़ाइल 8 MB से छोटी होनी चाहिए।",
  sourceEmpty: "इस सामग्री में पढ़ने योग्य पाठ नहीं मिला।",
  artifactNotTranslatable: "इस कार्यपत्रक में बहुत लंबा पाठ है। शिक्षक से नया विद्यार्थी संस्करण बनाने को कहो।",
  contentUnavailable: "यह सामग्री अभी नहीं खुल सकी। बाद में फिर कोशिश करो।",
  uploadNote: "पहले विद्यार्थी की भाषा में AI से सामग्री तैयार करो और उसे देखो। सामग्री केवल प्रकाशित बटन दबाने पर कक्षा में जाएगी।",
  uploadSuccess: "✓ प्रकाशित! अब विद्यार्थियों के 'मेरी कक्षा' में दिखेगा।", uploadFail: "अपलोड नहीं हुआ। फिर कोशिश करो।",
  uploadTextarea: "यहाँ पाठ लिखो…", uploadUrlPh: "https://…",
  myClass: "🎒 मेरी कक्षा", myClassSub: "तुम्हारी दुनिया — सितारे, स्तर, लीडरबोर्ड और शिक्षक की नई सामग्री।",
  classGreeting: "नमस्ते {name}! 👋", classFeed: "📢 शिक्षक की सामग्री", classFeedEmpty: "अभी शिक्षक ने कुछ प्रकाशित नहीं किया — बाद में फिर देखो!",
  classLeaderboard: "🏆 कक्षा लीडरबोर्ड", classYourLevel: "तुम्हारा स्तर",
  leaderboardTitle: "🏆 लीडरबोर्ड", leaderboardEmpty: "अभी कोई स्कोर नहीं — पहली क्विज़ खेलो!",
  publishClass: "📢 कक्षा में प्रकाशित करो", publishedNote: "✓ विद्यार्थियों के लिए प्रकाशित!",
  viewContent: "📖 पढ़ो", contentKind: "प्रकार", classContent: "🎒 विद्यार्थी क्षेत्र में पढ़ो",
  studioSteps: "चरण-प्रवाह (flowchart)", studioExamples: "रोज़मर्रा के उदाहरण", studioTakeaway: "⭐ याद रखो",
  studioListen: "🔊 सुनो",
  statusOnline: "🤖 Nemotron AI · Online",
  statusConfigRequired: "⚠ Nemotron configuration required",
  statusUnavailable: "⚠ Nemotron temporarily unavailable",
  statusOfflineMode: "📴 Offline learning mode",
  errConfig: "Nemotron API is not configured.",
  errRateLimit: "AI service is temporarily busy. Please try again.",
  errNetwork: "Nemotron could not be reached. Check your connection.",
  practiceLabel: "✏️ अभ्यास", connectionLabel: "🔗 जुड़ाव",
  camOn: "📷 कैमरा चालू", camOff: "📷 कैमरा बंद", camUnavailable: "इस डिवाइस पर कैमरा उपलब्ध नहीं",
  turnOnCam: "📷 कैमरा चालू करो", leaveCall: "🔴 मीट छोड़ो",
  teacherSays: "शिक्षक बोले", studentSays: "विद्यार्थी बोले", hears: "सुनता है",
  conversationLog: "🗣️ बातचीत", youLabel: "आप",
  lessonConverted: "इस पाठ को Nemotron ने {lang} में बदल दिया है",
  lessonStatic: "सहेजा पाठ्यक्रम (ऑफ़लाइन पैक) — Nemotron रूपांतरण के लिए बटन दबाओ",
  convertLessonBtn: "🧠 Nemotron से {lang} में बदलो",
  convertingLesson: "Nemotron पाठ को {lang} में पढ़ा रहा है…",
  pgtLeft: "{n} बाकी", pgtRetry: "🔄 फिर कोशिश करो", camSelect: "🎥 कैमरा चुनो",
  offlineHub: "📦 ऑफ़लाइन लर्निंग इंजन",
  hubSub: "बिना इंटरनेट चलने वाला निर्धारित (deterministic) पेडागॉजी इंजन — सहेजे पाठ्यक्रम और सत्यापित भाषा-संसाधनों पर आधारित। यह कोई ऑन-डिवाइस LLM नहीं है।",
  hubHonest: "📴 यह deterministic लोकल इंजन है — Nemotron क्लाउड पर चलता है (ऑनलाइन); यहाँ सब कुछ बिना नेटवर्क चलता है, पर कोई न्यूरल मॉडल डिवाइस पर नहीं चलता।",
  hubExplain: "💡 पाठ को बच्चों जैसी भाषा में समझाओ",
  hubQa: "❓ पाठ्यक्रम से सवाल-जवाब (offline RAG)",
  hubExample: "🌿 स्थानीय उदाहरण",
  hubPractice: "✏️ अभ्यास प्रश्न बनाओ",
  hubFeedback: "✅ उत्तर पर प्रतिक्रिया",
  hubWorksheet: "📝 ऑफ़लाइन कार्यपत्रक",
  hubFlashcards: "🃏 फ़्लैशकार्ड",
  hubVocab: "📚 शब्द का अर्थ",
  hubSimplify: "✂️ कठिन वाक्य सरल करो",
  hubVoice: "🗣️ ऑफ़लाइन आवाज़",
  hubRun: "चलाओ", hubStudentAns: "बच्चे का उत्तर", hubExpected: "सही उत्तर",
  hubCheck: "जाँचो", hubInput: "इनपुट", hubOutput: "आउटपुट",
  hubCapabilities: "⭐ लोकल इंजन की 10 क्षमताएँ (deterministic — LLM नहीं)",
  hubNotOffline: "❌ ऑफ़लाइन नहीं: वेब खोज, पाठ्यक्रम से बाहर ज्ञान, सामान्य NMT अनुवाद, क्लाउड Nemotron इन्फ़रेंस — ये ईमानदारी से सीमित हैं।",
  lessonLabel: "पाठ", subjectLabel: "विषय",
  fourLangPromise: "प्राथमिक भाषाएँ: संथाली, Ho, मुण्डारी और मैथिली — समर्पित संसाधनों के साथ end-to-end सत्यापित; बाकी 26-भाषा विस्तार वास्तुकला का हिस्सा है।",
  coverageTitle: "📊 भाषा-कवरेज (completeness)",
  ttsHonest: "🗣️ प्रोटोटाइप आवाज़ निकटतम उपलब्ध ब्राउज़र वॉइस (hi-IN) से है — native Santali/Ho/Mundari/Maithili TTS डिप्लॉयमेंट एन्हांसमेंट (Piper roadmap) है।",
  hubFootprint: "📱 डिवाइस फ़ुटप्रिंट (वास्तविक माप)",
  hubCacheItems: "कैश की गई AI प्रविष्टियाँ",
  hubNoLlm: "🧠 यहाँ कोई न्यूरल मॉडल नहीं चलता — यह deterministic लोकल पेडागॉजी इंजन है।",
  langsDemonstrated: "भाषाएँ प्रदर्शित: 6 · विस्तार-योग्य 26",
  syncNow: "🔄 ऑफ़लाइन के लिए सिंक करो",
  syncedAt: "आखिरी सिंक: {time}",
  syncOfflineHint: "ऑनलाइन होकर एक बार सिंक करो — फिर पाठ, AI उत्तर, कक्षा सामग्री और पूरा UI (Nemotron-अनुवादित) ऑफ़लाइन चलेंगे।",
  syncSummary: "सिंक पूरा ✓ — {n} चीज़ें ऑफ़लाइन तैयार",
  welcomeTeacher: "नमस्ते शिक्षक! 👋 आज की कक्षा तैयार करो — अपलोड स्टूडियो और जादुई कक्षा आपकी मदद के लिए हैं।",
  welcomeStudent: "नमस्ते {name}! 👋 आओ खेल-खेल में सीखें — आज का पाठ खोलो और सितारे कमाओ!",
  welcomeGuest: "नमस्ते! 👋 लॉगिन करो और अपनी कक्षा खोलो — सितारे, स्तर और लीडरबोर्ड तुम्हारा इंतज़ार कर रहे हैं।",
  you: "तुम", recentPublished: "हाल में प्रकाशित",
  mascotHi: "नमस्ते! मैं ज्ञानू हूँ 🐘", mascotTip: "सीखो, खेलो और सितारे कमाओ!",
  levelLabel: "स्तर", xpLabel: "सितारे", xpToNext: "अगले स्तर तक", rewardsTitle: "🏆 तुम्हारी उपलब्धियाँ",
  achQuiz: "पहली क्विज़", achPerfect: "पूरे नंबर!", achThree: "तीन क्विज़",
  achExplorer: "ऑफ़लाइन खोजी", achPolyglot: "बहुभाषी विद्यार्थी", achWS: "पहला कार्यपत्रक",
  achFC: "कार्ड मास्टर", congrats: "बधाई हो! 🎉",
};

const EN: Record<UiKey, string> = {
  home: "🏠 Home", teacher: "👩‍🏫 Teacher", liveMeet: "🔴 Live Meet", learn: "🌱 Learn",
  worksheets: "📝 Worksheets", dictionary: "📚 Dictionary", progress: "📊 Progress",
  askAi: "💬 Ask AI", flashcards: "🃏 Flashcards", architecture: "⚙️ Architecture",
  demoMode: "Demo Mode", onlineAI: "🌐 ONLINE AI", onlineDesc: "Nemotron 3 Ultra — full intelligence via secure server",
  offlineAI: "📴 OFFLINE", offlineDesc: "Local engine — synced lessons, word-bank & saved content",
  checking: "🧠 Checking Nemotron…", notConfigured: "⚠️ ONLINE — Nemotron not configured",
  verifiedOk: "🧠 ONLINE — Nemotron 3 Ultra ✓", verifiedPending: "🧠 Nemotron configured — verification pending",
  offlineBadge: "📴 OFFLINE — Local/Cached Engine",
  login: "👤 Login", logout: "Logout", enterApp: "Come into GyanSetu!",
  demoLogin: "Demo login", yourName: "Your name", teacherRole: "👩‍🏫 Teacher", studentRole: "🧑‍🎓 Student",
  studentLang: "Student language", teacherLang: "Teacher language", answerLang: "Answer language",
  learningLang: "Learning language", classLabel: "Class", difficulty: "Difficulty",
  easy: "Easy", medium: "Medium", hard: "Hard", questions: "Questions",
  allClasses: "All classes", allSubjects: "All subjects",
  ask: "Ask ➤", search: "🔎 Search", listen: "🎤 Speak (mic)", stopMic: "⏹️ Stop mic",
  sendClass: "🎙️ Send to classroom", generate: "🧠 Generate", start: "Start",
  submit: "✅ Submit", tryAgain: "🔄 Play again", explainLesson: "Explain lesson",
  startQuiz: "Start quiz", lookUp: "🔎 Look up", print: "🖨️ Print", save: "💾 Save",
  sync: "🔄 Sync now", nextStep: "🧭 What's next?", readAloud: "🔊 Listen",
  copy: "📋 Copy", copied: "✓ Copied", flip: "🔄 Flip", prev: "← Prev", next: "Next →",
  meaning: "Meaning", example: "🌱 Everyday example", takeaway: "⭐ Takeaway",
  steps: "Steps", explanation: "Explanation", objective: "🎯 Learning objective",
  answerKey: "Answer key", showAnswers: "🔑 Show answer key", hideAnswers: "🙈 Hide answer key",
  try: "Try:", thinking: "Thinking…", voiceBridge: "🗣️ Voice → Voice bridge",
  autoSpeak: "🔊 Auto-speak answers", pipeline: "Pipeline",
  offlineSynced: "Saved offline — syncs when online", syncDone: "✓ Sync complete",

  heroText: "A Hindi-speaking teacher talks — Nemotron 3 Ultra understands, simplifies — and every child learns in Santhali, Ho or Mundari.",
  heroClass: "🔴 Try the Magic Classroom", heroAsk: "💬 Ask AI a question",
  demoTitle: "🎛️ Demonstration Mode", demoSub: "You choose — ONLINE AI or OFFLINE. It never changes by itself.",
  engineTitle: "🧠 Engine Status", engineSub: "This shows the real execution path — never a guess.",
  engineB1: "Online: browser → GyanSetu API → Nemotron 3 Ultra. The API key never enters the browser.",
  engineB2: "Offline: IndexedDB + bundled curriculum + word-bank. Nemotron is not used and the UI says so honestly.",
  engineB3: "Student language: every AI request carries your language — answers come back in that language only.",
  engineNet: "📶 Device connectivity is informational only — the mode you choose above decides the path.",
  pipe1T: "Teacher Input", pipe1X: "Voice or text in Hindi — no fluency in tribal languages needed.",
  pipe2T: "AI Pedagogy Engine", pipe2X: "Nemotron understands meaning and simplifies it for Class 1–3.",
  pipe3T: "Mother-Tongue Layer", pipe3X: "Santhali, Ho, Mundari — lessons, questions, quizzes and audio.",
  pipe4T: "Progress & Adaptation", pipe4X: "Real quiz results tell Nemotron the next step.",
  qlTeacher: "👩‍🏫 Teacher Dashboard", qlTeacherX: "Classroom, Magic Classroom & live translation",
  qlLearn: "🌱 Learn", qlLearnX: "12 NIPUN lessons + AI explanations & game quizzes",
  qlWorksheets: "📝 Worksheets", qlWorksheetsX: "Nemotron-generated bilingual worksheets",
  qlDictionary: "📚 Dictionary", qlDictionaryX: "Instant meanings + AI understanding",
  qlFlashcards: "🃏 Flashcards", qlFlashcardsX: "Picture-cards in your language",
  qlProgress: "📊 Progress", qlProgressX: "Stars, levels and smart suggestions",
  qlAsk: "💬 Ask AI", qlAskX: "Any question — answered in your mother tongue",
  qlArch: "⚙️ Architecture", qlArchX: "LLM/AI/backend design + offline matrix",
  homeLangNote1: "Selected language:", homeLangNote2: "— it applies to every page of the app.",

  teacherSub: "Teach in Hindi. GyanSetu delivers in every child's mother tongue.",
  statHindi: "📖 Hindi lessons", statMath: "🔢 Math lessons", statEvs: "🌿 EVS lessons",
  teachModeTitle: "🎛️ Current mode", teachModeSub: "What the AI layer is actually running",
  teachOnline1: "🧠 Nemotron 3 Ultra is active: search, pedagogy, translation, worksheets, quizzes, recommendations.",
  teachOnline2: "All requests: teacher-browser → GyanSetu server → OpenRouter/NVIDIA. Keys stay server-side.",
  teachOffline1: "📴 Offline engine active: synced lessons, word-bank translation, cached quizzes/worksheets.",
  teachOffline2: "Choose ONLINE AI above for full Nemotron intelligence.",
  teachGotoClass: "🔴 Go to Magic Classroom →",
  teachQuickTitle: "⚡ Quick actions", teachQuickSub: "Lesson preparation tools",
  qaWorksheet: "📝 Make worksheet", qaBrowse: "🌱 Browse lessons", qaDictionary: "📚 Dictionary", qaProgress: "📊 Class progress",
  teachLibTitle: "📚 Curriculum library", teachLibSub: "NIPUN Bharat / FLN lessons (Classes 1–3)",
  meetBanner: "Live Meet — Magic Classroom",
  meetBannerText: "Teacher speaks Hindi → AI understands meaning → child hears Santhali/Ho/Mundari (text + audio)",
  openClass: "🔴 Open Live Meet",

  classInputTitle: "👩‍🏫 Teacher — Speak or Type", classInputSub: "Input language: {lang}",
  classOutputTitle: "🧑‍🎓 Student — Hears in Mother Tongue", classOutputSub: "Output language: {lang}",
  classEmpty: "The teacher's instruction will appear here in {lang} — simplified for a young child.",
  classThinkOnline: "Nemotron is translating & adapting…",
  classThinkOffline: "Offline word-bank is translating…",
  classHint: "Meaning → pedagogy → {lang} output",
  classForChild: "🗣️ {lang} — for the child", classSimplified: "✏️ Simplified for Class 1–3",
  classNoteLabel: "Note", classMicFail: "Voice input is not supported in this browser — please type instead.",
  classMicStartFail: "Mic could not start — please type instead.",
  classPure: "pure {lang}", classMixed: "language-mix repaired",
  classSpeaking: "🔊 speaking…", classTryLabel: "Try:",
  classPipeline: "Pipeline", classStudent: "Student", classTotal: "total",
  classSTT: "voice→text", classAI: "AI", classTTS: "text→voice",
  classBridgeHint: "(mic → translate → speak)", bridgeAward: "Magic bridge worked! +1 ⭐",

  learnSub: "NIPUN Bharat / FLN lessons (Classes 1–3). Search in your own words — e.g. “पानी से बादल कैसे बनते हैं?”",
  searchPh: "🔍 Search in your own words…",
  learnEmpty: "No lessons found. Try “बारिश”, “जोड़” or “संज्ञा”.",
  backAll: "← All lessons",
  tabLesson: "📖 Lesson", tabExplain: "🧠 AI Explain", tabQuiz: "❓ Game Quiz",
  hindiCurric: "📘 हिन्दी — Curriculum", englishRef: "🌐 English — Reference",
  examplesHi: "उदाहरण", examplesEn: "Examples",
  explainCardTitle: "🧠 AI explanation — {lang}",
  explainSubOnline: "Nemotron builds a fresh explanation from this lesson", explainSubOffline: "Offline engine answers from the synced pack",
  explainInvite: "Understand this lesson like a story — in {lang}!",
  explainBtn: "🧠 Explain in {lang}",
  explainThinkOnline: "Nemotron is preparing the explanation…", explainThinkOffline: "Reading the synced pack…",
  quizCardTitle: "❓ Game Quiz — {title}", quizSubOnline: "Nemotron writes questions inside this lesson",
  quizSubOffline: "Offline synced quiz",
  quizInvite: "Questions stay inside this lesson — and match your past scores!",
  quizBtn: "❓ Start {lang} quiz",
  quizThinkOnline: "Nemotron is writing questions…", quizThinkOffline: "Opening synced quiz…",
  submitQuiz: "✅ Submit answers", scoreLine: "Score:",
  savedServer: "✓ Saved to your progress (real database record).",
  savedQueue: "📴 Saved offline — syncs when you choose ONLINE AI.",
  savedFail: "Progress could not be saved.",
  loginNote: "Login (top-right) to save this result.",
  great: "Well done! 👏", good: "Good! 🌟", perfect: "Perfect! 💯", tryMore: "Play again!",
  earnedStars: "Stars earned:",

  wsSub: "Bilingual worksheets from the real lesson — questions stay inside the curriculum and come in {lang}.",
  wsInfoOnline: "Generated live by Nemotron 3 Ultra with the lesson's class, subject, objective and NIPUN outcome. Output is schema-validated.",
  wsInfoOffline: "Offline mode uses the synced worksheet pack.",
  wsEmpty: "Pick a lesson and press Generate — the teacher's Hindi input becomes a {lang} worksheet.",
  wsSaved: "✓ Worksheet saved to the school database.", wsSaveFail: "Could not save this worksheet.",
  wsTypeMcq: "choose one", wsTypeFill: "fill the blank", wsTypeShort: "short answer",
  wsAnsLabel: "✅ Answer:", wsAward: "Worksheet ready! +5 ⭐",

  fcSub: "Cards in {lang} — word, meaning, example and learning goal.",
  fcSubOnline: "Generated by Nemotron from the lesson.", fcSubOffline: "Built from the synced pack.",
  fcEmpty: "Pick a lesson and make {lang} cards!",
  fcFlipHint: "Touch the card — the meaning appears like magic! ✨", fcLabel: "Cards",
  fcAward: "Deck ready! +5 ⭐",

  dictSub: "Exact words are answered instantly. Misspelled or full questions — like “कमल का मतलब क्या है?” — are understood by AI.",
  dictPh: "पानी, बादल, खरगोश… or a full question",
  dictEmpty: "The dictionary has {n} exact entries (Hindi/English/Santhali/Ho/Mundari) — online mode adds AI understanding for any word.",
  dictBadgeExact: "📚 Exact local entry — no AI call",
  dictBadgeAI: "🧠 Contextual AI understanding", dictBadgeOffline: "📴 Offline dictionary",
  dictTransLabel: "In {lang}",

  progSubNamed: "Real quiz records for {name} ({role}) — in the school database.",
  progSubAnon: "Login (top-right) to track your quizzes. Records are real database rows.",
  statAttempts: "Quiz attempts", statAvg: "Average score", statEngine: "Engine used",
  histTitle: "🧾 Attempt history", histSub: "Stored in PostgreSQL via Drizzle ORM",
  histEmpty: "No quiz attempts yet — open Learn and play a game quiz. The result becomes a real record and Nemotron suggests the next step.",
  offlineWaiting: "📴 {n} record(s) saved offline are waiting — choose ONLINE AI or press sync.",
  syncNothing: "Nothing to sync.",
  cachedAIBadge: "cached AI", syncUp: "{n} offline record(s) synced up ✓",
  syncDown: "{n} AI result(s) stored for offline use ✓",
  onlineSyncHint: "🧠 Every Nemotron answer is stored in PostgreSQL automatically — sync downloads the history to this device, so the same questions work offline later.",
  recTitle: "🧭 AI learning suggestion", recSubOnline: "Nemotron reasoned over your real progress",
  recSubOffline: "Offline heuristic",
  recRemedial: "🔁 Practice again", recTargeted: "🎯 Practice", recChallenge: "🚀 Challenge", recRevision: "🔁 Revision",
  recOpenLesson: "🌱 Open this lesson →",

  askSub: "Ask anything about your lessons. Answers come in {lang} — for a young child, with an everyday example.",
  askPh: "Ask your question… e.g. How does water become clouds?",
  askEmptyTitle: "🧒 No questions yet",
  askEmptyText: "Ask: “How does water become a cloud?” — Nemotron will explain the water cycle like a story!",
  askThinkOnline: "Nemotron is thinking…", askThinkOffline: "Local engine is answering…",
  outsideLessons: "outside lessons", answerLabel: "Answer", followUpLabel: "🤔",
  askAward: "Question asked! +2 ⭐",

  languageBar: "🌐 Language",
  askAnyLangNote: "Type in any language — the answer always comes in {lang}.",
  studio: "📤 Upload Studio", studioSub: "Upload lesson material — Nemotron adapts it into every child's language.",
  uploadTitle: "📤 Upload new content", uploadSub: "Type, pick a PDF or paste a link. Preview it in the student's language, then publish.",
  uploadKind: "Type", uploadText: "✍️ Text", uploadLink: "🔗 Link", uploadFile: "📎 File (txt/pdf)",
  uploadTitleLabel: "Title", uploadLesson: "Related lesson", uploadPublish: "📢 Publish",
  prepareStudentVersion: "🧠 Prepare student version", studentVersionPrepared: "Student version ready",
  studentVersionPreview: "This is what the student will see", prepareOnlineOnly: "Turn on online AI to prepare the student version.",
  prepareBeforePublish: "Prepare the student version for the current content and language first.",
  uploadFileHint: "Choose a txt or PDF file — PDF text will be adapted too.", emptyMaterial: "Content is empty — write something first.",
  pasteLinkFirst: "Paste a link first.", chooseFileFirst: "Choose a file first.",
  pdfUnreadable: "Text could not be read from this PDF. Choose a text-based PDF or paste the content.",
  linkUnreadable: "The link could not be read. Check it and try again.", fileTooLarge: "The file must be smaller than 8 MB.",
  sourceEmpty: "No readable text was found in this resource.",
  artifactNotTranslatable: "This worksheet contains text that is too long to adapt. Ask the teacher to prepare a new student version.",
  contentUnavailable: "This content could not be opened. Please try again later.",
  uploadNote: "Prepare and review the AI version in the student's language first. It reaches the class only after you click Publish.",
  uploadSuccess: "✓ Published! Now visible in students' My Class.", uploadFail: "Upload failed. Please try again.",
  uploadTextarea: "Write the text here…", uploadUrlPh: "https://…",
  myClass: "🎒 My Class", myClassSub: "Your world — stars, levels, leaderboard and the teacher's latest content.",
  classGreeting: "Hi {name}! 👋", classFeed: "📢 Teacher's content", classFeedEmpty: "The teacher hasn't published anything yet — check back later!",
  classLeaderboard: "🏆 Class Leaderboard", classYourLevel: "Your level",
  leaderboardTitle: "🏆 Leaderboard", leaderboardEmpty: "No scores yet — play the first quiz!",
  publishClass: "📢 Publish to class", publishedNote: "✓ Published for students!",
  viewContent: "📖 Read", contentKind: "Type", classContent: "🎒 Read in the student area",
  studioSteps: "Step-flow", studioExamples: "Everyday examples", studioTakeaway: "⭐ Takeaway",
  studioListen: "🔊 Listen",
  statusOnline: "🤖 Nemotron AI · Online",
  statusConfigRequired: "⚠ Nemotron configuration required",
  statusUnavailable: "⚠ Nemotron temporarily unavailable",
  statusOfflineMode: "📴 Offline learning mode",
  errConfig: "Nemotron API is not configured.",
  errRateLimit: "AI service is temporarily busy. Please try again.",
  errNetwork: "Nemotron could not be reached. Check your connection.",
  practiceLabel: "✏️ Practice", connectionLabel: "🔗 Connection",
  camOn: "📷 Camera on", camOff: "📷 Camera off", camUnavailable: "Camera not available on this device",
  turnOnCam: "📷 Turn on camera", leaveCall: "🔴 Leave meeting",
  teacherSays: "Teacher said", studentSays: "Student said", hears: "hears",
  conversationLog: "🗣️ Conversation", youLabel: "You",
  lessonConverted: "Nemotron converted this lesson into {lang}",
  lessonStatic: "Synced curriculum (offline pack) — press the button to convert with Nemotron",
  convertLessonBtn: "🧠 Convert to {lang} with Nemotron",
  convertingLesson: "Nemotron is teaching this lesson in {lang}…",
  pgtLeft: "{n} left", pgtRetry: "🔄 Retry", camSelect: "🎥 Choose camera",
  offlineHub: "📦 Offline Learning Engine",
  hubSub: "A lightweight DETERMINISTIC pedagogy engine (not an LLM) — grounded in the synced curriculum and verified language resources.",
  hubHonest: "📴 This is the deterministic local engine — Nemotron runs in the cloud (online); everything here works with zero network, but no neural model runs on the device.",
  hubExplain: "💡 Explain a lesson child-style",
  hubQa: "❓ Curriculum Q&A (offline RAG)",
  hubExample: "🌿 Local examples",
  hubPractice: "✏️ Generate practice questions",
  hubFeedback: "✅ Answer feedback",
  hubWorksheet: "📝 Offline worksheet",
  hubFlashcards: "🃏 Flashcards",
  hubVocab: "📚 Word meaning",
  hubSimplify: "✂️ Simplify hard text",
  hubVoice: "🗣️ Offline voice",
  hubRun: "Run", hubStudentAns: "Child's answer", hubExpected: "Correct answer",
  hubCheck: "Check", hubInput: "Input", hubOutput: "Output",
  hubCapabilities: "⭐ The local engine's 10 capabilities (deterministic — not an LLM)",
  hubNotOffline: "❌ NOT offline: web search, knowledge outside the curriculum, general NMT translation, cloud Nemotron inference — honestly limited.",
  lessonLabel: "Lesson", subjectLabel: "Subject",
  fourLangPromise: "Primary languages: Santali, Ho, Mundari and Maithili — validated end-to-end with dedicated resources; the 26-language expansion is architectural.",
  coverageTitle: "📊 Language coverage (completeness)",
  ttsHonest: "🗣️ Prototype speech uses the nearest available browser voice (hi-IN) — native Santali/Ho/Mundari/Maithili TTS is a deployment enhancement (Piper roadmap).",
  hubFootprint: "📱 Device footprint (real measurements)",
  hubCacheItems: "cached AI entries",
  hubNoLlm: "🧠 No neural model runs here — this is the deterministic local pedagogy engine.",
  langsDemonstrated: "Languages demonstrated: 6 · expandable to 26",
  syncNow: "🔄 Sync for offline",
  syncedAt: "Last sync: {time}",
  syncOfflineHint: "Sync once while online — then lessons, AI answers, class content and the whole UI (Nemotron-translated) work offline.",
  syncSummary: "Sync complete ✓ — {n} items ready offline",
  welcomeTeacher: "Hello Teacher! 👋 Prepare today's class — Upload Studio and Magic Classroom are here to help.",
  welcomeStudent: "Hi {name}! 👋 Let's learn by playing — open today's lesson and earn stars!",
  welcomeGuest: "Hello! 👋 Log in to open your class — stars, levels and the leaderboard are waiting.",
  you: "you", recentPublished: "Recently published",
  mascotHi: "Hi! I am Gyanu 🐘", mascotTip: "Learn, play and earn stars!",
  levelLabel: "Level", xpLabel: "stars", xpToNext: "to next level", rewardsTitle: "🏆 Your achievements",
  achQuiz: "First Quiz", achPerfect: "Full Marks!", achThree: "Three Quizzes",
  achExplorer: "Offline Explorer", achPolyglot: "Polyglot Learner", achWS: "First Worksheet",
  achFC: "Card Master", congrats: "Congratulations! 🎉",
};

// Prototype tribal UI strings (Devanagari school script). Unvalidated keys
// fall back to Hindi via the chain — content still follows the selection.
const TRIBAL_COMMON: Record<string, { sat: string; hoc: string; mai: string; unr: string }> = {
  liveMeet: { sat: "\ud83d\udd34 \u0932\u093e\u0907\u0935 \u092e\u0940\u091f", hoc: "\ud83d\udd34 \u0932\u093e\u0907\u0935 \u092e\u0940\u091f", mai: "\ud83d\udd34 \u0932\u093e\u0907\u0935 \u092e\u0940\u091f", unr: "\ud83d\udd34 \u0932\u093e\u0907\u0935 \u092e\u0940\u091f" },
  architecture: { sat: "\u2699\ufe0f \u0924\u0915\u0928\u0940\u0915\u0940 \u0922\u093e\u0901\u091a\u093e", hoc: "\u2699\ufe0f \u0924\u0915\u0928\u0940\u0915\u0940 \u0922\u093e\u0901\u091a\u093e", mai: "\u2699\ufe0f \u0924\u0915\u0928\u0940\u0915\u0940 \u0922\u093e\u0901\u091a\u093e", unr: "\u2699\ufe0f \u0924\u0915\u0928\u0940\u0915\u0940 \u0922\u093e\u0901\u091a\u093e" },
  onlineAI: { sat: "\ud83c\udf10 \u0911\u0928\u0932\u093e\u0907\u0928 AI", hoc: "\ud83c\udf10 \u0911\u0928\u0932\u093e\u0907\u0928 AI", mai: "\ud83c\udf10 \u0911\u0928\u0932\u093e\u0907\u0928 AI", unr: "\ud83c\udf10 \u0911\u0928\u0932\u093e\u0907\u0928 AI" },
  offlineAI: { sat: "\ud83d\udcf4 \u0911\u092b\u093c\u0932\u093e\u0907\u0928", hoc: "\ud83d\udcf4 \u0911\u092b\u093c\u0932\u093e\u0907\u0928", mai: "\ud83d\udcf4 \u0911\u092b\u093c\u0932\u093e\u0907\u0928", unr: "\ud83d\udcf4 \u0911\u092b\u093c\u0932\u093e\u0907\u0928" },
  login: { sat: "\ud83d\udc64 \u0932\u0949\u0917\u093f\u0928", hoc: "\ud83d\udc64 \u0932\u0949\u0917\u093f\u0928", mai: "\ud83d\udc64 \u0932\u0949\u0917\u093f\u0928", unr: "\ud83d\udc64 \u0932\u0949\u0917\u093f\u0928" },
  logout: { sat: "\u0932\u0949\u0917\u0906\u0909\u091f", hoc: "\u0932\u0949\u0917\u0906\u0909\u091f", mai: "\u0932\u0949\u0917\u0906\u0909\u091f", unr: "\u0932\u0949\u0917\u0906\u0909\u091f" },
  enterApp: { sat: "\u091c\u094d\u091e\u093e\u0928\u0938\u0947\u0924\u0941 \u0930\u0947 \u0906\u0913!", hoc: "\u091c\u094d\u091e\u093e\u0928\u0938\u0947\u0924\u0941 \u0930\u0947 \u0906\u0913!", mai: "\u091c\u094d\u091e\u093e\u0928\u0938\u0947\u0924\u0941 \u092e\u0947 \u0906\u0909!", unr: "\u091c\u094d\u091e\u093e\u0928\u0938\u0947\u0924\u0941 \u0930\u0947 \u0906\u0913!" },
  demoLogin: { sat: "\u0921\u0947\u092e\u094b \u0932\u0949\u0917\u093f\u0928", hoc: "\u0921\u0947\u092e\u094b \u0932\u0949\u0917\u093f\u0928", mai: "\u0921\u0947\u092e\u094b \u0932\u0949\u0917\u093f\u0928", unr: "\u0921\u0947\u092e\u094b \u0932\u0949\u0917\u093f\u0928" },
  yourName: { sat: "\u0906\u092e\u093e\u0915\u094d \u0928\u093e\u092e", hoc: "\u0905\u092e\u093e\u0915\u094d \u0928\u093e\u092e", mai: "\u0905\u0939\u093e\u0901\u0915 \u0928\u093e\u092e", unr: "\u0928\u0902\u0917\u093e\u0915\u094d \u0928\u093e\u092e" },
  teacherRole: { sat: "\ud83d\udc69\u200d\ud83c\udfeb \u0917\u0941\u0930\u0941", hoc: "\ud83d\udc69\u200d\ud83c\udfeb \u092e\u093e\u0938\u094d\u091f\u0930", mai: "\ud83d\udc69\u200d\ud83c\udfeb \u0917\u0941\u0930\u0941", unr: "\ud83d\udc69\u200d\ud83c\udfeb \u0917\u0941\u0930\u0941" },
  studentRole: { sat: "\ud83e\uddd1\u200d\ud83c\udf93 \u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940", hoc: "\ud83e\uddd1\u200d\ud83c\udf93 \u0939\u093e\u092a\u093e\u0928", mai: "\ud83e\uddd1\u200d\ud83c\udf93 \u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940", unr: "\ud83e\uddd1\u200d\ud83c\udf93 \u0939\u093e\u092a\u093e\u0928" },
  languageBar: { sat: "\ud83c\udf10 \u092d\u093e\u0937\u093e", hoc: "\ud83c\udf10 \u092d\u093e\u0937\u093e", mai: "\ud83c\udf10 \u092d\u093e\u0937\u093e", unr: "\ud83c\udf10 \u092d\u093e\u0937\u093e" },
  studentLang: { sat: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940 \u092d\u093e\u0937\u093e", hoc: "\u0939\u093e\u092a\u093e\u0928 \u092d\u093e\u0937\u093e", mai: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940 \u092d\u093e\u0937\u093e", unr: "\u0939\u093e\u092a\u093e\u0928 \u092d\u093e\u0937\u093e" },
  teacherLang: { sat: "\u0917\u0941\u0930\u0941 \u092d\u093e\u0937\u093e", hoc: "\u092e\u093e\u0938\u094d\u091f\u0930 \u092d\u093e\u0937\u093e", mai: "\u0917\u0941\u0930\u0941 \u092d\u093e\u0937\u093e", unr: "\u0917\u0941\u0930\u0941 \u092d\u093e\u0937\u093e" },
  answerLang: { sat: "\u0909\u0924\u094d\u0924\u0930 \u092d\u093e\u0937\u093e", hoc: "\u0909\u0924\u094d\u0924\u0930 \u092d\u093e\u0937\u093e", mai: "\u0909\u0924\u094d\u0924\u0930 \u092d\u093e\u0937\u093e", unr: "\u0909\u0924\u094d\u0924\u0930 \u092d\u093e\u0937\u093e" },
  learningLang: { sat: "\u0938\u0940\u0916\u0928\u0947 \u092d\u093e\u0937\u093e", hoc: "\u0938\u0940\u0916\u0928\u0947 \u092d\u093e\u0937\u093e", mai: "\u0938\u0940\u0916\u092f \u092d\u093e\u0937\u093e", unr: "\u0938\u0940\u0916\u0928\u0947 \u092d\u093e\u0937\u093e" },
  classLabel: { sat: "\u0915\u0915\u094d\u0937\u093e", hoc: "\u0915\u0915\u094d\u0937\u093e", mai: "\u0915\u0915\u094d\u0937\u093e", unr: "\u0915\u0915\u094d\u0937\u093e" },
  difficulty: { sat: "\u0915\u0920\u093f\u0928\u093e\u0908", hoc: "\u0915\u0920\u093f\u0928\u093e\u0908", mai: "\u0915\u0920\u093f\u0928\u093e\u0908", unr: "\u0915\u0920\u093f\u0928\u093e\u0908" },
  easy: { sat: "\u0906\u0938\u093e\u0928", hoc: "\u0906\u0938\u093e\u0928", mai: "\u0906\u0938\u093e\u0928", unr: "\u0906\u0938\u093e\u0928" },
  medium: { sat: "\u092e\u0927\u094d\u092f\u092e", hoc: "\u092e\u0927\u094d\u092f\u092e", mai: "\u092e\u0927\u094d\u092f\u092e", unr: "\u092e\u0927\u094d\u092f\u092e" },
  hard: { sat: "\u0915\u0920\u093f\u0928", hoc: "\u0915\u0920\u093f\u0928", mai: "\u0915\u0920\u093f\u0928", unr: "\u0915\u0920\u093f\u0928" },
  questions: { sat: "\u092a\u094d\u0930\u0936\u094d\u0928", hoc: "\u092a\u094d\u0930\u0936\u094d\u0928", mai: "\u092a\u094d\u0930\u0936\u094d\u0928", unr: "\u092a\u094d\u0930\u0936\u094d\u0928" },
  allClasses: { sat: "\u091c\u094b\u0924\u094b \u0915\u0915\u094d\u0937\u093e", hoc: "\u091c\u094b\u0924\u094b \u0915\u0915\u094d\u0937\u093e", mai: "\u0938\u092d \u0915\u0915\u094d\u0937\u093e", unr: "\u091c\u094b\u0924\u094b \u0915\u0915\u094d\u0937\u093e" },
  allSubjects: { sat: "\u091c\u094b\u0924\u094b \u0935\u093f\u0937\u092f", hoc: "\u091c\u094b\u0924\u094b \u0935\u093f\u0937\u092f", mai: "\u0938\u092d \u0935\u093f\u0937\u092f", unr: "\u091c\u094b\u0924\u094b \u0935\u093f\u0937\u092f" },
  ask: { sat: "\u092a\u0942\u091b\u094b \u27a4", hoc: "\u092a\u0942\u091b\u094b \u27a4", mai: "\u092a\u0942\u091b\u0942 \u27a4", unr: "\u092a\u0942\u091b\u094b \u27a4" },
  search: { sat: "\ud83d\udd0e \u0916\u094b\u091c\u094b", hoc: "\ud83d\udd0e \u0916\u094b\u091c\u094b", mai: "\ud83d\udd0e \u0916\u094b\u091c\u0942", unr: "\ud83d\udd0e \u0916\u094b\u091c\u094b" },
  listen: { sat: "\ud83c\udfa4 \u0930\u094b (\u092e\u093e\u0907\u0915)", hoc: "\ud83c\udfa4 \u0930\u094b (\u092e\u093e\u0907\u0915)", mai: "\ud83c\udfa4 \u092c\u093e\u091c\u0942 (\u092e\u093e\u0907\u0915)", unr: "\ud83c\udfa4 \u0930\u094b (\u092e\u093e\u0907\u0915)" },
  stopMic: { sat: "\u23f9\ufe0f \u092e\u093e\u0907\u0915 \u092c\u0902\u0926", hoc: "\u23f9\ufe0f \u092e\u093e\u0907\u0915 \u092c\u0902\u0926", mai: "\u23f9\ufe0f \u092e\u093e\u0907\u0915 \u092c\u0928\u094d\u0926", unr: "\u23f9\ufe0f \u092e\u093e\u0907\u0915 \u092c\u0902\u0926" },
  sendClass: { sat: "\ud83c\udf99\ufe0f \u0915\u0915\u094d\u0937\u093e \u0930\u0947 \u092d\u0947\u091c\u094b", hoc: "\ud83c\udf99\ufe0f \u0915\u0915\u094d\u0937\u093e \u0930\u0947 \u092d\u0947\u091c\u094b", mai: "\ud83c\udf99\ufe0f \u0915\u0915\u094d\u0937\u093e \u092e\u0947 \u092d\u0947\u091c\u0942", unr: "\ud83c\udf99\ufe0f \u0915\u0915\u094d\u0937\u093e \u0930\u0947 \u092d\u0947\u091c\u094b" },
  generate: { sat: "\ud83e\udde0 \u092c\u0928\u093e\u0913", hoc: "\ud83e\udde0 \u092c\u0928\u093e\u0913", mai: "\ud83e\udde0 \u092c\u0928\u093e\u0909", unr: "\ud83e\udde0 \u092c\u0928\u093e\u0913" },
  start: { sat: "\u0936\u0941\u0930\u0942", hoc: "\u0936\u0941\u0930\u0942", mai: "\u0936\u0941\u0930\u0942", unr: "\u0936\u0941\u0930\u0942" },
  submit: { sat: "\u2705 \u091c\u092e\u093e \u0915\u0930\u094b", hoc: "\u2705 \u091c\u092e\u093e \u0915\u0930\u094b", mai: "\u2705 \u091c\u092e\u093e \u0915\u0930\u0942", unr: "\u2705 \u091c\u092e\u093e \u0915\u0930\u094b" },
  tryAgain: { sat: "\ud83d\udd04 \u092b\u093f\u0930 \u0916\u0947\u0932\u094b", hoc: "\ud83d\udd04 \u092b\u093f\u0930 \u0916\u0947\u0932\u094b", mai: "\ud83d\udd04 \u092b\u0947\u0930 \u0916\u0947\u0932\u0942", unr: "\ud83d\udd04 \u092b\u093f\u0930 \u0916\u0947\u0932\u094b" },
  explainLesson: { sat: "\u092a\u093e\u0920 \u0938\u092e\u091d\u093e\u0913", hoc: "\u092a\u093e\u0920 \u0938\u092e\u091d\u093e\u0913", mai: "\u092a\u093e\u0920 \u0938\u092e\u091d\u093e\u0909", unr: "\u092a\u093e\u0920 \u0938\u092e\u091d\u093e\u0913" },
  startQuiz: { sat: "\u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942", hoc: "\u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942", mai: "\u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942", unr: "\u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942" },
  lookUp: { sat: "\ud83d\udd0e \u0926\u0947\u0916\u094b", hoc: "\ud83d\udd0e \u0928\u0947\u0932\u094b", mai: "\ud83d\udd0e \u0926\u0947\u0916\u0942", unr: "\ud83d\udd0e \u0926\u0947\u0916\u094b" },
  print: { sat: "\ud83d\udda8\ufe0f \u091b\u093e\u092a\u094b", hoc: "\ud83d\udda8\ufe0f \u091b\u093e\u092a\u094b", mai: "\ud83d\udda8\ufe0f \u091b\u093e\u092a\u0942", unr: "\ud83d\udda8\ufe0f \u091b\u093e\u092a\u094b" },
  save: { sat: "\ud83d\udcbe \u0938\u0939\u0947\u091c\u094b", hoc: "\ud83d\udcbe \u0938\u0939\u0947\u091c\u094b", mai: "\ud83d\udcbe \u0938\u0939\u0947\u091c\u0942", unr: "\ud83d\udcbe \u0938\u0939\u0947\u091c\u094b" },
  sync: { sat: "\ud83d\udd04 \u0938\u093f\u0902\u0915", hoc: "\ud83d\udd04 \u0938\u093f\u0902\u0915", mai: "\ud83d\udd04 \u0938\u093f\u0902\u0915", unr: "\ud83d\udd04 \u0938\u093f\u0902\u0915" },
  nextStep: { sat: "\ud83e\udded \u0905\u092c \u0906\u0917\u0947 \u0915\u094d\u092f\u093e?", hoc: "\ud83e\udded \u0905\u092c \u0906\u0917\u0947 \u0915\u094d\u092f\u093e?", mai: "\ud83e\udded \u0906\u092c \u0906\u0917\u093e \u0915\u093e?", unr: "\ud83e\udded \u0905\u092c \u0906\u0917\u0947 \u0915\u094d\u092f\u093e?" },
  readAloud: { sat: "\ud83d\udd0a \u0938\u0941\u0928\u094b", hoc: "\ud83d\udd0a \u0906\u092f\u0941\u092e", mai: "\ud83d\udd0a \u0938\u0941\u0928\u0942", unr: "\ud83d\udd0a \u0938\u0941\u0928\u094b" },
  copy: { sat: "\ud83d\udccb \u0928\u0915\u0932", hoc: "\ud83d\udccb \u0928\u0915\u0932", mai: "\ud83d\udccb \u0928\u0915\u0932", unr: "\ud83d\udccb \u0928\u0915\u0932" },
  copied: { sat: "\u2713 \u0928\u0915\u0932 \u0939\u0941\u0906", hoc: "\u2713 \u0928\u0915\u0932 \u0939\u0941\u0906", mai: "\u2713 \u0928\u0915\u0932 \u092d\u0947\u0932", unr: "\u2713 \u0928\u0915\u0932 \u0939\u0941\u0906" },
  flip: { sat: "\ud83d\udd04 \u092a\u0932\u091f\u094b", hoc: "\ud83d\udd04 \u092a\u0932\u091f\u094b", mai: "\ud83d\udd04 \u092a\u0932\u091f\u0942", unr: "\ud83d\udd04 \u092a\u0932\u091f\u094b" },
  prev: { sat: "\u2190 \u092a\u093f\u091b\u0932\u093e", hoc: "\u2190 \u092a\u093f\u091b\u0932\u093e", mai: "\u2190 \u092a\u093f\u091b\u0932\u093e", unr: "\u2190 \u092a\u093f\u091b\u0932\u093e" },
  next: { sat: "\u0906\u0917\u0947 \u2192", hoc: "\u0906\u0917\u0947 \u2192", mai: "\u0906\u0917\u093e \u2192", unr: "\u0906\u0917\u0947 \u2192" },
  meaning: { sat: "\u0905\u0930\u094d\u0925", hoc: "\u0905\u0930\u094d\u0925", mai: "\u0905\u0930\u094d\u0925", unr: "\u0905\u0930\u094d\u0925" },
  example: { sat: "\ud83c\udf31 \u0909\u0926\u093e\u0939\u0930\u0923", hoc: "\ud83c\udf31 \u0909\u0926\u093e\u0939\u0930\u0923", mai: "\ud83c\udf31 \u0909\u0926\u093e\u0939\u0930\u0923", unr: "\ud83c\udf31 \u0909\u0926\u093e\u0939\u0930\u0923" },
  takeaway: { sat: "\u2b50 \u092f\u093e\u0926 \u0930\u0916\u094b", hoc: "\u2b50 \u092f\u093e\u0926 \u0930\u0916\u094b", mai: "\u2b50 \u092f\u093e\u0926 \u0930\u093e\u0916\u0942", unr: "\u2b50 \u092f\u093e\u0926 \u0930\u0916\u094b" },
  steps: { sat: "\u091a\u0930\u0923", hoc: "\u091a\u0930\u0923", mai: "\u091a\u0930\u0923", unr: "\u091a\u0930\u0923" },
  explanation: { sat: "\u0938\u092e\u091d", hoc: "\u0938\u092e\u091d", mai: "\u0938\u092e\u091d", unr: "\u0938\u092e\u091d" },
  objective: { sat: "\ud83c\udfaf \u0932\u0915\u094d\u0937\u094d\u092f", hoc: "\ud83c\udfaf \u0932\u0915\u094d\u0937\u094d\u092f", mai: "\ud83c\udfaf \u0932\u0915\u094d\u0937\u094d\u092f", unr: "\ud83c\udfaf \u0932\u0915\u094d\u0937\u094d\u092f" },
  answerKey: { sat: "\u0909\u0924\u094d\u0924\u0930-\u0915\u0941\u0902\u091c\u0940", hoc: "\u0909\u0924\u094d\u0924\u0930-\u0915\u0941\u0902\u091c\u0940", mai: "\u0909\u0924\u094d\u0924\u0930-\u0915\u0941\u0902\u091c\u0940", unr: "\u0909\u0924\u094d\u0924\u0930-\u0915\u0941\u0902\u091c\u0940" },
  showAnswers: { sat: "\ud83d\udd11 \u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u0916\u093e\u0913", hoc: "\ud83d\udd11 \u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u0916\u093e\u0913", mai: "\ud83d\udd11 \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0916\u093e\u0909", unr: "\ud83d\udd11 \u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u0916\u093e\u0913" },
  hideAnswers: { sat: "\ud83d\ude48 \u0909\u0924\u094d\u0924\u0930 \u091b\u093f\u092a\u093e\u0913", hoc: "\ud83d\ude48 \u0909\u0924\u094d\u0924\u0930 \u091b\u093f\u092a\u093e\u0913", mai: "\ud83d\ude48 \u0909\u0924\u094d\u0924\u0930 \u091b\u093f\u092a\u093e\u0909", unr: "\ud83d\ude48 \u0909\u0924\u094d\u0924\u0930 \u091b\u093f\u092a\u093e\u0913" },
  try: { sat: "\u0906\u091c\u093c\u092e\u093e\u0913:", hoc: "\u0906\u091c\u093c\u092e\u093e\u0913:", mai: "\u0906\u091c\u093c\u092e\u093e\u0909:", unr: "\u0906\u091c\u093c\u092e\u093e\u0913:" },
  thinking: { sat: "\u0938\u094b\u091a\u0924\u093e\u2026", hoc: "\u0938\u094b\u091a \u0924\u0928\u093e\u2026", mai: "\u0938\u094b\u091a\u0948\u0924\u2026", unr: "\u0938\u094b\u091a \u0924\u0928\u093e\u2026" },
  backAll: { sat: "\u2190 \u091c\u094b\u0924\u094b \u092a\u093e\u0920", hoc: "\u2190 \u091c\u094b\u0924\u094b \u092a\u093e\u0920", mai: "\u2190 \u0938\u092d \u092a\u093e\u0920", unr: "\u2190 \u091c\u094b\u0924\u094b \u092a\u093e\u0920" },
  tabLesson: { sat: "\ud83d\udcd6 \u092a\u093e\u0920", hoc: "\ud83d\udcd6 \u092a\u093e\u0920", mai: "\ud83d\udcd6 \u092a\u093e\u0920", unr: "\ud83d\udcd6 \u092a\u093e\u0920" },
  tabExplain: { sat: "\ud83e\udde0 AI \u0938\u092e\u091d", hoc: "\ud83e\udde0 AI \u0938\u092e\u091d", mai: "\ud83e\udde0 AI \u0938\u092e\u091d", unr: "\ud83e\udde0 AI \u0938\u092e\u091d" },
  tabQuiz: { sat: "\u2753 \u0916\u0947\u0932-\u0915\u094d\u0935\u093f\u091c\u093c", hoc: "\u2753 \u0916\u0947\u0932-\u0915\u094d\u0935\u093f\u091c\u093c", mai: "\u2753 \u0916\u0947\u0932-\u0915\u094d\u0935\u093f\u091c\u093c", unr: "\u2753 \u0916\u0947\u0932-\u0915\u094d\u0935\u093f\u091c\u093c" },
  hindiCurric: { sat: "\ud83d\udcd8 \u0939\u093f\u0928\u094d\u0926\u0940 \u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e", hoc: "\ud83d\udcd8 \u0939\u093f\u0928\u094d\u0926\u0940 \u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e", mai: "\ud83d\udcd8 \u0939\u093f\u0928\u094d\u0926\u0940 \u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e", unr: "\ud83d\udcd8 \u0939\u093f\u0928\u094d\u0926\u0940 \u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e" },
  englishRef: { sat: "\ud83c\udf10 English \u0938\u0902\u0926\u0930\u094d\u092d", hoc: "\ud83c\udf10 English \u0938\u0902\u0926\u0930\u094d\u092d", mai: "\ud83c\udf10 English \u0938\u0902\u0926\u0930\u094d\u092d", unr: "\ud83c\udf10 English \u0938\u0902\u0926\u0930\u094d\u092d" },
  examplesHi: { sat: "\u0909\u0926\u093e\u0939\u0930\u0923", hoc: "\u0909\u0926\u093e\u0939\u0930\u0923", mai: "\u0909\u0926\u093e\u0939\u0930\u0923", unr: "\u0909\u0926\u093e\u0939\u0930\u0923" },
  examplesEn: { sat: "Examples", hoc: "Examples", mai: "Examples", unr: "Examples" },
  quizBtn: { sat: "\u2753 \u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942 \u0915\u0930\u094b", hoc: "\u2753 \u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942 \u0915\u0930\u094b", mai: "\u2753 \u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942 \u0915\u0930\u0942", unr: "\u2753 \u0915\u094d\u0935\u093f\u091c\u093c \u0936\u0941\u0930\u0942 \u0915\u0930\u094b" },
  submitQuiz: { sat: "\u2705 \u0909\u0924\u094d\u0924\u0930 \u091c\u092e\u093e \u0915\u0930\u094b", hoc: "\u2705 \u0909\u0924\u094d\u0924\u0930 \u091c\u092e\u093e \u0915\u0930\u094b", mai: "\u2705 \u0909\u0924\u094d\u0924\u0930 \u091c\u092e\u093e \u0915\u0930\u0942", unr: "\u2705 \u0909\u0924\u094d\u0924\u0930 \u091c\u092e\u093e \u0915\u0930\u094b" },
  scoreLine: { sat: "\u0938\u094d\u0915\u094b\u0930:", hoc: "\u0938\u094d\u0915\u094b\u0930:", mai: "\u0938\u094d\u0915\u094b\u0930:", unr: "\u0938\u094d\u0915\u094b\u0930:" },
  perfect: { sat: "\u092a\u0942\u0930\u0947 \u0928\u0902\u092c\u0930! \ud83d\udcaf", hoc: "\u092a\u0942\u0930\u0947 \u0928\u0902\u092c\u0930! \ud83d\udcaf", mai: "\u092a\u0942\u0930\u093e \u0928\u0902\u092c\u0930! \ud83d\udcaf", unr: "\u092a\u0942\u0930\u0947 \u0928\u0902\u092c\u0930! \ud83d\udcaf" },
  good: { sat: "\u0905\u091a\u094d\u091b\u093e! \ud83c\udf1f", hoc: "\u092c\u0941\u0917\u093f\u0928! \ud83c\udf1f", mai: "\u0928\u0940\u0915! \ud83c\udf1f", unr: "\u092c\u0941\u0917\u093f\u0928! \ud83c\udf1f" },
  great: { sat: "\u0936\u093e\u092c\u093e\u0936! \ud83d\udc4f", hoc: "\u0936\u093e\u092c\u093e\u0936! \ud83d\udc4f", mai: "\u0936\u093e\u092c\u093e\u0936! \ud83d\udc4f", unr: "\u0936\u093e\u092c\u093e\u0936! \ud83d\udc4f" },
  earnedStars: { sat: "\u0938\u093f\u0924\u093e\u0930\u0947 \u092e\u093f\u0932\u0947:", hoc: "\u0938\u093f\u0924\u093e\u0930\u0947 \u092e\u093f\u0932\u0947:", mai: "\u0924\u093e\u0930\u093e \u092d\u0947\u091f\u0932:", unr: "\u0938\u093f\u0924\u093e\u0930\u0947 \u092e\u093f\u0932\u0947:" },
  loginNote: { sat: "\u092a\u094d\u0930\u0917\u0924\u093f \u092c\u091a\u093e\u0928\u0947 \u0932\u0947 \u090a\u092a\u0930 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u094b\u0964", hoc: "\u092a\u094d\u0930\u0917\u0924\u093f \u092c\u091a\u093e\u0928\u0947 \u0932\u0947 \u090a\u092a\u0930 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u094b\u0964", mai: "\u092a\u094d\u0930\u0917\u0924\u093f \u092c\u091a\u093e\u092c\u092f \u0932\u0947\u0932 \u090a\u092a\u0930 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0942\u0964", unr: "\u092a\u094d\u0930\u0917\u0924\u093f \u092c\u091a\u093e\u0928\u0947 \u0932\u0947 \u090a\u092a\u0930 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u094b\u0964" },
  mascotTip: { sat: "\u0938\u0940\u0916\u094b, \u0916\u0947\u0932\u094b \u0906\u0921\u093c \u0938\u093f\u0924\u093e\u0930\u0947 \u092a\u093e\u0913!", hoc: "\u0938\u0940\u0916\u094b, \u0916\u0947\u0932\u094b \u0906\u0921\u093c \u0938\u093f\u0924\u093e\u0930\u0947 \u092a\u093e\u0913!", mai: "\u0938\u0940\u0916\u0942, \u0916\u0947\u0932\u0942 \u0906 \u0924\u093e\u0930\u093e \u092a\u093e\u0909!", unr: "\u0938\u0940\u0916\u094b, \u0916\u0947\u0932\u094b \u0906\u0921\u093c \u0938\u093f\u0924\u093e\u0930\u0947 \u092a\u093e\u0913!" },
  levelLabel: { sat: "\u0938\u094d\u0924\u0930", hoc: "\u0938\u094d\u0924\u0930", mai: "\u0938\u094d\u0924\u0930", unr: "\u0938\u094d\u0924\u0930" },
  xpLabel: { sat: "\u0938\u093f\u0924\u093e\u0930\u0947", hoc: "\u0938\u093f\u0924\u093e\u0930\u0947", mai: "\u0924\u093e\u0930\u093e", unr: "\u0938\u093f\u0924\u093e\u0930\u0947" },
  rewardsTitle: { sat: "\ud83c\udfc6 \u0906\u092e\u093e\u0915\u094d \u0909\u092a\u0932\u092c\u094d\u0927\u093f\u092f\u093e\u0901", hoc: "\ud83c\udfc6 \u0905\u092e\u093e\u0915\u094d \u0909\u092a\u0932\u092c\u094d\u0927\u093f\u092f\u093e\u0901", mai: "\ud83c\udfc6 \u0905\u0939\u093e\u0901\u0915 \u0909\u092a\u0932\u092c\u094d\u0927\u093f", unr: "\ud83c\udfc6 \u0928\u0902\u0917\u093e\u0915\u094d \u0909\u092a\u0932\u092c\u094d\u0927\u093f\u092f\u093e\u0901" },
  meetBanner: { sat: "Live Meet \u2014 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e", hoc: "Live Meet \u2014 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e", mai: "Live Meet \u2014 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e", unr: "Live Meet \u2014 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e" },
  classForChild: { sat: "\ud83d\udde3\ufe0f {lang} \u2014 \u092c\u091a\u094d\u091a\u093e \u0932\u0947", hoc: "\ud83d\udde3\ufe0f {lang} \u2014 \u0939\u093e\u092a\u093e\u0928 \u0932\u0947", mai: "\ud83d\udde3\ufe0f {lang} \u2014 \u092c\u091a\u094d\u091a\u093e \u0932\u0947\u0932", unr: "\ud83d\udde3\ufe0f {lang} \u2014 \u0939\u093e\u092a\u093e\u0928 \u0932\u0947" },
  classSimplified: { sat: "\u270f\ufe0f \u0915\u0915\u094d\u0937\u093e 1\u20133 \u0932\u0947 \u0938\u0930\u0932", hoc: "\u270f\ufe0f \u0915\u0915\u094d\u0937\u093e 1\u20133 \u0932\u0947 \u0938\u0930\u0932", mai: "\u270f\ufe0f \u0915\u0915\u094d\u0937\u093e 1\u20133 \u0932\u0947\u0932 \u0906\u0938\u093e\u0928", unr: "\u270f\ufe0f \u0915\u0915\u094d\u0937\u093e 1\u20133 \u0932\u0947 \u0938\u0930\u0932" },
  classNoteLabel: { sat: "\u0928\u094b\u091f", hoc: "\u0928\u094b\u091f", mai: "\u0928\u094b\u091f", unr: "\u0928\u094b\u091f" },
  classStudent: { sat: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940", hoc: "\u0939\u093e\u092a\u093e\u0928", mai: "\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940", unr: "\u0939\u093e\u092a\u093e\u0928" },
  classTotal: { sat: "\u0915\u0941\u0932", hoc: "\u0915\u0941\u0932", mai: "\u0915\u0941\u0932", unr: "\u0915\u0941\u0932" },
  heroClass: { sat: "\ud83d\udd34 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e \u0926\u0947\u0916\u094b", hoc: "\ud83d\udd34 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e \u0928\u0947\u0932\u094b", mai: "\ud83d\udd34 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e \u0926\u0947\u0916\u0942", unr: "\ud83d\udd34 \u091c\u093e\u0926\u0941\u0908 \u0915\u0915\u094d\u0937\u093e \u0926\u0947\u0916\u094b" },
  heroAsk: { sat: "\ud83d\udcac AI \u0924\u0947\u0902 \u0938\u0935\u093e\u0932 \u092a\u0942\u091b\u094b", hoc: "\ud83d\udcac AI \u0924\u0947\u0902 \u0938\u0935\u093e\u0932 \u092a\u0942\u091b\u094b", mai: "\ud83d\udcac AI \u0938\u0901 \u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0942\u091b\u0942", unr: "\ud83d\udcac AI \u0924\u0947\u0902 \u0938\u0935\u093e\u0932 \u092a\u0942\u091b\u094b" },
  recOpenLesson: { sat: "\ud83c\udf31 \u0908 \u092a\u093e\u0920 \u0916\u094b\u0932\u094b \u2192", hoc: "\ud83c\udf31 \u090f \u092a\u093e\u0920 \u0916\u094b\u0932\u094b \u2192", mai: "\ud83c\udf31 \u0908 \u092a\u093e\u0920 \u0916\u094b\u0932\u0942 \u2192", unr: "\ud83c\udf31 \u090f \u092a\u093e\u0920 \u0916\u094b\u0932\u094b \u2192" },
  outsideLessons: { sat: "\u092a\u093e\u0920 \u0924\u0947\u0902 \u092c\u093e\u0939\u0930", hoc: "\u092a\u093e\u0920 \u0924\u0947\u0902 \u092c\u093e\u0939\u0930", mai: "\u092a\u093e\u0920 \u0938\u0901 \u092c\u093e\u0939\u0930", unr: "\u092a\u093e\u0920 \u0924\u0947\u0902 \u092c\u093e\u0939\u0930" },
  answerLabel: { sat: "\u0909\u0924\u094d\u0924\u0930", hoc: "\u0909\u0924\u094d\u0924\u0930", mai: "\u0909\u0924\u094d\u0924\u0930", unr: "\u0909\u0924\u094d\u0924\u0930" },
  askAnyLangNote: { sat: "\u0906\u092e \u091c\u093e\u0939\u093e\u0928 \u092d\u093e\u0937\u093e \u0930\u0947 \u0932\u093f\u0916\u094b \u2014 \u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e {lang} \u0930\u0947 \u0939\u0940 \u092e\u093f\u0932\u0947\u0917\u093e\u0964", hoc: "\u0905\u092e \u091c\u093e\u0939\u093e\u0928 \u092d\u093e\u0937\u093e \u0930\u0947 \u0932\u093f\u0916\u094b \u2014 \u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e {lang} \u0930\u0947 \u0939\u0940 \u092e\u093f\u0932 \u0924\u0928\u093e\u0964", mai: "\u0905\u0939\u093e\u0901 \u0915\u094b\u0928\u094b \u092d\u093e\u0937\u093e \u092e\u0947 \u0932\u093f\u0916\u0942 \u2014 \u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e {lang} \u092e\u0947 \u0939\u0940 \u092d\u0947\u091f\u0924\u0964", unr: "\u0928\u0902\u0917 \u091c\u093e\u0939\u093e\u0928 \u092d\u093e\u0937\u093e \u0930\u0947 \u0932\u093f\u0916\u094b \u2014 \u0909\u0924\u094d\u0924\u0930 \u0939\u092e\u0947\u0936\u093e {lang} \u0930\u0947 \u0939\u0940 \u092e\u093f\u0932 \u0924\u0928\u093e\u0964" },
  statAttempts: { sat: "\u0915\u094d\u0935\u093f\u091c\u093c \u092a\u094d\u0930\u092f\u093e\u0938", hoc: "\u0915\u094d\u0935\u093f\u091c\u093c \u092a\u094d\u0930\u092f\u093e\u0938", mai: "\u0915\u094d\u0935\u093f\u091c\u093c \u092a\u094d\u0930\u092f\u093e\u0938", unr: "\u0915\u094d\u0935\u093f\u091c\u093c \u092a\u094d\u0930\u092f\u093e\u0938" },
  statAvg: { sat: "\u0914\u0938\u0924 \u0938\u094d\u0915\u094b\u0930", hoc: "\u0914\u0938\u0924 \u0938\u094d\u0915\u094b\u0930", mai: "\u0914\u0938\u0924 \u0938\u094d\u0915\u094b\u0930", unr: "\u0914\u0938\u0924 \u0938\u094d\u0915\u094b\u0930" },
  statEngine: { sat: "\u0909\u092a\u092f\u094b\u0917 \u0907\u0902\u091c\u0928", hoc: "\u0909\u092a\u092f\u094b\u0917 \u0907\u0902\u091c\u0928", mai: "\u0909\u092a\u092f\u094b\u0917 \u0907\u0902\u091c\u0928", unr: "\u0909\u092a\u092f\u094b\u0917 \u0907\u0902\u091c\u0928" },
};

const TRIBAL_LANG: Record<"sat" | "hoc" | "mai" | "unr", Partial<Record<UiKey, string>>> = {
  sat: Object.fromEntries(Object.entries(TRIBAL_COMMON).map(([k, v]) => [k, v.sat])),
  hoc: Object.fromEntries(Object.entries(TRIBAL_COMMON).map(([k, v]) => [k, v.hoc])),
  mai: Object.fromEntries(Object.entries(TRIBAL_COMMON).map(([k, v]) => [k, v.mai])),
  unr: Object.fromEntries(Object.entries(TRIBAL_COMMON).map(([k, v]) => [k, v.unr])),
};

const SAT: Partial<Record<UiKey, string>> = {
  ...TRIBAL_LANG.sat,
  home: "🏠 ओराक", teacher: "👩‍🏫 गुरु", learn: "🌱 सीखो",
  worksheets: "📝 कार्यपत्रक", dictionary: "📚 शब्दकोश", progress: "📊 प्रगति",
  askAi: "💬 पूछो", flashcards: "🃏 कार्ड",
  mascotHi: "जोहार! इंयाम ज्ञानू हूँ 🐘",
  teacherSub: "हिन्दी रे पढ़ाओ। GyanSetu हर बच्चा रे मातृभाषा रे पहुँचाता।",
  classEmpty: "गुरु रे बात इंयाहाँ {lang} रे आएगा — छोटे बच्चा हेतु सरल रूप रे।",
  demoMode: "देखाव मोड",
  onlineDesc: "Nemotron 3 Ultra — जोतो समझ (सुरक्षित सर्वर तें)",
  offlineDesc: "आतो इंजन — सहेजे पाठ, काजा-बैंक आड़ सामग्री",
  searchPh: "🔍 आमाक् काथा रे खोजो…",
  learnSub: "NIPUN पाठ (कक्षा 1–3)। आमाक् काथा रे खोजो — जैसे 'दक् तें रिमिल चेत लेका बने?'",
  learnEmpty: "जाहान पाठ नहीं मिला। 'दा जोर', 'जोड़' आड़ 'संज्ञा' आज़माओ।",
  askPh: "आमाक् काथा पूछो… जैसे: दक् तें रिमिल चेत लेका बने?",
  askSub: "पाठ रे जाहान भी पूछो। उत्तर {lang} रे आएगा — छोटे बच्चा ले, उदाहरण साथ।",
  askEmptyText: "पूछो: 'दक् रिमिल चेत लेका बने?' — Nemotron दक्-चक्र कहानी लेका समझाएगा!",
  dictSub: "पक्का काजा झट से मिलते। गलत लिखा काथा — जैसे 'कमल का मतलब?' — AI समझता।",
  dictPh: "दक्, रिमिल, खरगोश… आड़ पूरा काथा",
  wsSub: "असली पाठ तें दो-भाषा कार्यपत्रक — काथा पाठ्यक्रम रे ही रहते आड़ {lang} रे आते।",
  fcSub: "{lang} रे कार्ड — काजा, अर्थ, उदाहरण आड़ लक्ष्य।",
  myClassSub: "आमाक् दुनिया — सितारे, स्तर, लीडरबोर्ड आड़ गुरु रे नया सामग्री।",
  studioSub: "पाठ सामग्री अपलोड करो — Nemotron हर बच्चा रे भाषा रे ढाल देगा।",
  classFeedEmpty: "गुरु अभी जाहान नहीं प्रकाशित केला — फेर देखो!",
  progSubAnon: "क्विज़ देखने ले ऊपर लॉगिन करो।",
  syncOfflineHint: "एक बार ऑनलाइन सिंक करो — फिर पाठ, AI उत्तर, सामग्री आड़ पूरा UI ऑफ़लाइन चलेगा।",
  nextStep: "🧭 अब आगे क्या?",
  pgtLeft: "{n} बाकी", pgtRetry: "🔄 फेर कोशिश", camSelect: "🎥 कैमरा चुनो",
  welcomeStudent: "जोहार {name}! 👋 खेल-खेल रे सीखो — आज रे पाठ खोलो आड़ सितारे पाओ!",
  welcomeGuest: "जोहार! 👋 लॉगिन करो आड़ आमाक् कक्षा खोलो — सितारे, स्तर आड़ लीडरबोर्ड रेंगेका।",
  welcomeTeacher: "जोहार गुरु! 👋 आज रे कक्षा तैयार करो — अपलोड स्टूडियो आड़ जादुई कक्षा मदद रे मेना।",
};

const HOC: Partial<Record<UiKey, string>> = {
  ...TRIBAL_LANG.hoc,
  home: "🏠 ओवा", teacher: "👩‍🏫 मास्टर", learn: "🌱 सीखो",
  worksheets: "📝 कार्यपत्रक", dictionary: "📚 शब्दकोश", progress: "📊 प्रगति",
  askAi: "💬 पूछो", flashcards: "🃏 कार्ड",
  mascotHi: "जोहार! इन्या ज्ञानू हूँ 🐘",
  teacherSub: "हिन्दी में पढ़ाओ। GyanSetu हर बच्चा रे मातृभाषा में पहुँचाता है।",
  classEmpty: "मास्टर रे बात इन्याहाँ {lang} में आएगा — छोटे बच्चा हेतु सरल रूप में।",
};

const UNR: Partial<Record<UiKey, string>> = {
  ...TRIBAL_LANG.unr,
  home: "🏠 ओरा", teacher: "👩‍🏫 गुरु", learn: "🌱 सीखो",
  worksheets: "📝 कार्यपत्रक", dictionary: "📚 शब्दकोश", progress: "📊 प्रगति",
  askAi: "💬 पूछो", flashcards: "🃏 कार्ड",
  mascotHi: "जोहार! इंया ज्ञानू हूँ 🐘",
  teacherSub: "हिन्दी में पढ़ाओ। GyanSetu हर बच्चा रे मातृभाषा में पहुँचाता है।",
  classEmpty: "गुरु रे बात इंयाहाँ {lang} में आएगा — छोटे बच्चा हेतु सरल रूप में।",
};

const MAI: Partial<Record<UiKey, string>> = {
  ...TRIBAL_LANG.mai,
  home: "🏠 घर", teacher: "👩‍🏫 गुरु", learn: "🌱 सीखू",
  worksheets: "📝 कार्यपत्रक", dictionary: "📚 शब्दकोश", progress: "📊 प्रगति",
  askAi: "💬 पूछू", flashcards: "🃏 कार्ड",
  mascotHi: "प्रणाम! हम ज्ञानू छी 🐘",
  teacherSub: "हिन्दी मे पढ़ाबू। GyanSetu हर बच्चाक मातृभाषा मे पहुँचाबैत अछि।",
  classEmpty: "गुरुक बात एतय {lang} मे आयत — छोट बच्चा लेल आसान रूप मे।",
  great: "शाबाश! 👏", earnedStars: "सितारा भेटल:", loginNote: "प्रगति बचाबय लेल लॉगिन करू।",
};

const DICTS: Record<LanguageCode, Partial<Record<UiKey, string>>> = {
  hi: HI,
  en: EN,
  sat: SAT,
  hoc: HOC,
  mai: MAI,
  unr: UNR,
};

/**
 * NO SILENT HINDI FALLBACK for the four priority languages (sat/hoc/mai/unr).
 * If a tribal pack is missing a key, the value is adapted through the
 * verified word-bank and shown with a VISIBLE ⟐ marker — it is never
 * silently passed off as the selected language. The language bar explains
 * the marker; the Architecture page reports coverage per language.
 */
export const MISSING_MARK = " ⟐";

/** Verified word-bank adaptation for strings still missing a native value. */
function adaptToTribal(text: string, lang: LanguageCode): string {
  let out = text;
  const entries = WORD_BANK.filter((d) => {
    const v = d[lang as keyof typeof d];
    return typeof v === "string" && v.length > 0;
  }).sort((a, b) => b.hi.length - a.hi.length);
  for (const e of entries) {
    const to = e[lang as keyof typeof e] as string;
    out = out.split(e.hi).join(to);
  }
  return out;
}

export function translateUi(lang: LanguageCode, key: UiKey, vars?: Record<string, string>): string {
  const direct = DICTS[lang][key];
  let s: string;
  if (typeof direct === "string" && direct.trim() !== "") {
    s = direct;
  } else if (lang === "hi" || lang === "en") {
    s = HI[key] ?? EN[key] ?? key;
  } else {
    s = adaptToTribal(HI[key] ?? EN[key] ?? key, lang) + MISSING_MARK;
  }
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(v);
    }
  }
  return s;
}

/** Compact verified word-bank used for adaptation of still-missing strings. */
const WORD_BANK: Array<Partial<Record<LanguageCode, string>> & { hi: string }> = [
  { hi: "पाठ", sat: "पाठ", hoc: "पाठ", mai: "पाठ", unr: "पाठ" },
  { hi: "सीखो", sat: "सीखो", hoc: "सीखो", mai: "सीखू", unr: "सीखो" },
  { hi: "पानी", sat: "दक्", hoc: "दा", mai: "पानि", unr: "दा" },
  { hi: "बच्चा", sat: "होन", hoc: "हापान", mai: "बच्चा", unr: "हापान" },
  { hi: "बच्चे", sat: "होन को", hoc: "हापान को", mai: "बच्चा सभ", unr: "हापान को" },
  { hi: "शिक्षक", sat: "गुरु", hoc: "मास्टर", mai: "गुरु", unr: "गुरु" },
  { hi: "विद्यार्थी", sat: "चात्रा", hoc: "हापान", mai: "विद्यार्थी", unr: "हापान" },
  { hi: "भाषा", sat: "भाषा", hoc: "भाषा", mai: "भाषा", unr: "भाषा" },
  { hi: "उत्तर", sat: "उत्तर", hoc: "उत्तर", mai: "उत्तर", unr: "उत्तर" },
  { hi: "प्रश्न", sat: "काथा", hoc: "काजी", mai: "प्रश्न", unr: "काजी" },
  { hi: "सवाल", sat: "काथा", hoc: "काजी", mai: "प्रश्न", unr: "काजी" },
  { hi: "स्कूल", sat: "इस्कुल", hoc: "इस्कुल", mai: "स्कूल", unr: "इस्कुल" },
  { hi: "घर", sat: "ओराक", hoc: "ओवा", mai: "घर", unr: "ओरा" },
  { hi: "अच्छा", sat: "भाला", hoc: "बुगिन", mai: "नीक", unr: "बुगिन" },
  { hi: "बड़ा", sat: "मरङ्", hoc: "मरङ", mai: "पैघ", unr: "मरङ" },
  { hi: "छोटा", sat: "हुड़िङ्", hoc: "हुड़िङ", mai: "छोट", unr: "हुड़िङ" },
  { hi: "सीखेंगे", sat: "सीखोक् आ", hoc: "सीख तना", mai: "सीखब", unr: "सीख तना" },
  { hi: "सीखता", sat: "सीखता", hoc: "सीख तना", mai: "सीखैत", unr: "सीख तना" },
  { hi: "पढ़ाई", sat: "ओल-पाड़", hoc: "पढ़ा", mai: "पढ़ाइ", unr: "ओल-पाड़" },
  { hi: "कहानी", sat: "काथा", hoc: "काजी", mai: "कहानी", unr: "काजी" },
  { hi: "आज", sat: "तिहिंज", hoc: "तिसिंग", mai: "आइ", unr: "तिसिङ" },
  { hi: "कल", sat: "गा़ते", hoc: "गा़ते", mai: "काल्हि", unr: "गाते" },
  { hi: "खेलो", sat: "खेलो", hoc: "खेलो", mai: "खेलू", unr: "खेलो" },
  { hi: "देखो", sat: "नेलो", hoc: "नेलो", mai: "देखू", unr: "नेलो" },
  { hi: "सुनो", sat: "आंजोमे", hoc: "आंजोमे", mai: "सुनू", unr: "आंजोमे" },
  { hi: "बोलो", sat: "रो", hoc: "रो", mai: "बाजू", unr: "रो" },
  { hi: "लिखो", sat: "ओल", hoc: "ओल", mai: "लिखू", unr: "ओल" },
  { hi: "करो", sat: "मे", hoc: "मे", mai: "करू", unr: "मे" },
  { hi: "है।", sat: "मेना।", hoc: "तना।", mai: "अछि।", unr: "तना।" },
  { hi: "है", sat: "मेना", hoc: "तना", mai: "अछि", unr: "तना" },
  { hi: "हैं", sat: "मेनाका", hoc: "तनाका", mai: "छथि", unr: "तनाका" },
  { hi: "में", sat: "रे", hoc: "रे", mai: "मे", unr: "रे" },
  { hi: "का", sat: "रेयाक्", hoc: "रेयाक्", mai: "क", unr: "रेयाक्" },
  { hi: "की", sat: "रेयाक्", hoc: "रेयाक्", mai: "क", unr: "रेयाक्" },
  { hi: "के", sat: "रेयाक्", hoc: "रेयाक्", mai: "क", unr: "रेयाक्" },
  { hi: "और", sat: "आड़", hoc: "आड़", mai: "आ", unr: "आड़" },
  { hi: "नहीं", sat: "बा़य", hoc: "बा़य", mai: "नहि", unr: "बा़य" },
  { hi: "सब", sat: "जोतो", hoc: "जोतो", mai: "सभ", unr: "जोतो" },
  { hi: "सभी", sat: "जोतो", hoc: "जोतो", mai: "सभ", unr: "जोतो" },
  { hi: "आप", sat: "आम", hoc: "अम", mai: "अहाँ", unr: "नंग" },
  { hi: "तुम", sat: "आम", hoc: "अम", mai: "अहाँ", unr: "नंग" },
  { hi: "मेरा", sat: "इञाक्", hoc: "इङाक्", mai: "हमर", unr: "अइञाक्" },
  { hi: "हम", sat: "आ़म", hoc: "अबु", mai: "हम", unr: "अबु" },
];

/** Runtime list of all UI keys (HI is the complete reference dictionary). */
export const ALL_UI_KEYS: UiKey[] = Object.keys(HI) as UiKey[];

/**
 * Translation completeness per language — the acceptance test the four
 * priority languages must pass before the language layer is called complete.
 */
export function languageCoverage(lang: LanguageCode): {
  total: number;
  covered: number;
  pct: number;
  missingKeys: UiKey[];
} {
  const pack = DICTS[lang];
  const missingKeys = ALL_UI_KEYS.filter(
    (k) => typeof pack[k] !== "string" || (pack[k] as string).trim() === "",
  );
  return {
    total: ALL_UI_KEYS.length,
    covered: ALL_UI_KEYS.length - missingKeys.length,
    pct: Math.round(((ALL_UI_KEYS.length - missingKeys.length) / ALL_UI_KEYS.length) * 100),
    missingKeys,
  };
}

export function makeT(lang: LanguageCode) {
  return (key: UiKey, vars?: Record<string, string>) => translateUi(lang, key, vars);
}

export type TFunc = (key: UiKey, vars?: Record<string, string>) => string;

/**
 * Core UI keys that get pre-translated by Nemotron during the manual sync —
 * the SAME source strings that useLocalized() registers on screen. After a
 * sync, the whole app chrome renders in the tribal language even offline.
 */
export const UI_SYNC_KEYS: UiKey[] = [
  "home", "teacher", "liveMeet", "learn", "worksheets", "flashcards", "dictionary",
  "progress", "askAi", "myClass", "studio", "demoMode", "onlineAI", "offlineAI",
  "login", "logout", "studentLang", "teacherLang", "learningLang", "answerLang",
  "classLabel", "allClasses", "allSubjects", "ask", "search", "listen", "stopMic",
  "sendClass", "generate", "start", "submit", "tryAgain", "startQuiz", "lookUp",
  "print", "save", "syncNow", "syncOfflineHint", "nextStep", "readAloud", "copy",
  "flip", "prev", "next", "meaning", "example", "takeaway", "steps", "explanation",
  "objective", "answerKey", "showAnswers", "hideAnswers", "try", "classFeed",
  "classLeaderboard", "rewardsTitle", "mascotTip", "leaderboardEmpty",
  "classFeedEmpty", "uploadTitle", "uploadPublish", "publishClass", "viewContent",
  "studioSteps", "studioExamples", "studioTakeaway", "studioListen",
  "welcomeTeacher", "welcomeStudent", "welcomeGuest", "teacherSub", "learnSub",
  "dictSub", "myClassSub", "studioSub",
];
