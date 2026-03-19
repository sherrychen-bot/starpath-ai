import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const G = {
  green:     "#6AAF3D",
  greenLt:   "#82C455",
  greenDk:   "#1A3A2A",
  greenMd:   "#2D5A3D",
  sage:      "#4A8C5C",
  cream:     "#F5F9F3",
  creamDk:   "#EAF2E5",
  text:      "#1E2B1E",
  muted:     "#6B7B6B",
  white:     "#FFFFFF",
  blue:      "#3B82F6",
  amber:     "#D97706",
  purple:    "#7C3AED",
  rose:      "#E11D48",
};

// ─── STRINGS ──────────────────────────────────────────────────────────────────
const T = {
  zh: {
    brand: "STARPATH FINDER", byLine: "星途潜能测试",
    tagline: "发现你的成长方向",
    subtitle: "不是考试，不是评分\n15 分钟，发现你的成长方向",
    start: "开始免费测评",
    startNote: "完全免费 · 约 15 分钟 · 无需注册",
    next: "下一题 →", generate: "生成我的升学画像 ✦",
    charLeft: (n, min) => n > 0 ? `✓` : ``,
    loading: ["分析你的学习特质…","识别你的核心优势…","匹配专业方向…","规划背景提升路径…","生成升学画像…"],
    errTitle: "生成遇到了问题", errDesc: "你的答案都还在，直接重试就好",
    retry: "重新生成", backQ: "返回检查答案", lang: "EN",
    // email gate
    gateTitle: "最后一步，获取你的完整报告",
    gateDesc:  "填写姓名和邮箱，即可查看你的专属成长画像，并保存报告链接。",
    namePH: "你的名字（可选）", emailPH: "your@email.com",
    gateBtn: "查看完整报告 →", gateSkip: "先跳过",
    gateNote: "不会收到垃圾邮件。数据安全加密保存。",
    // report
    rptTitle: "星途成长报告",
    t0:"✦ 成长画像", t1:"📚 学术方向", t2:"🌱 成长路径", t3:"📤 获取规划",
    // summary labels
    lArchetype:"成长原型", lInsight:"核心洞察", lGrowth:"成长提示", lStyle:"思维风格", lRadar:"五维能力画像",
    lStrengths3:"你的三大核心优势", lAcadDirs:"潜在学术方向", lGrowthPath:"推荐成长路径",
    lProjIdeas:"项目创意", lSugActs:"推荐活动", lCtaTitle:"想要个性化路径规划？", lCtaDesc:"预约1对1策略咨询，把你的成长画像转化为真实的升学路线图。", lCtaBtn:"获取我的个性化规划",
    rAxes:["学术好奇心","分析能力","创造力","社会影响力","领导力"],
    lMajors:"专业方向匹配", lNextMonth:"近期行动计划", lNextKey:"申请前最关键",
    lCurriosity:"自然好奇心", lDomains:"强势学科域", lLearning:"学习风格",
    lMajorDetail:"专业方向详情", lCourses:"代表课程", lCareers:"职业方向",
    lCourseStrat:"选课策略", lApIb:"推荐 AP / IB",
    lEcAssess:"活动现状评估", lNarrative:"叙事主线", lGaps:"待补强",
    lRec:"推荐背景提升活动", lAction:"具体行动", lWhy:"为什么适合",
    lTimeline:"建议时间", lEssay:"文书方向", lAngle:"你的独特角度",
    lSchoolType:"学校类型匹配", lEdea:"ED/EA 策略",
    lReach:"冲刺", lMatch:"匹配", lSafety:"保底",
    // send
    sendTitle:"发送给升学顾问",
    sendDesc:"将这份画像发送给顾问，他们在第一次见面前就全面了解你。",
    optStarwise:"预约 StarWise 免费咨询", optStarwiseSub:"30分钟策略咨询，完全免费",
    optOwn:"发送给我已有的顾问", optOwnSub:"将报告发到顾问邮箱",
    yourInfo:"你的信息", counselorEmail:"顾问邮箱",
    note:"附言（可选）", notePH:"想跟顾问说的话…",
    sendBtn:"发送给顾问 →", sending:"打开邮件中…",
    sentTitle:"邮件已打开 📧", sentDesc:"邮件客户端已打开，报告内容已预填，确认发送即可。",
    copyLink:"复制报告内容", copied:"✓ 已复制到剪贴板",
    shareLink:"分享我的报告链接", shareCopied:"✓ 链接已复制！",
    downloadPdf:"下载报告", downloading:"准备中…",
    shareDesc:"生成专属链接，家长或老师打开即可在线查看你的完整报告，无需登录。",
    restart:"重新测评", back:"← 返回",
    inviteBtn:"邀请好友测评", inviteDesc:"把测评工具分享给朋友或同学",
    switchLang:"切换为英文版（重新生成）", switching:"正在切换…",
    grade: g=>g==="5under"?"5年级及以下":`${g}年级`,
    school: s=>{const m={us_public:"美国公立高中",us_private:"美国私立高中",ib:"IB课程",ap:"AP课程",intl:"国际学校",boarding:"寄宿学校",other:"其他"};return Array.isArray(s)?s.map(v=>m[v]||v).join(" · "):(m[s]||s);},
  },
  en: {
    brand: "STARPATH FINDER", byLine: "星途潜能测试",
    tagline: "Discover Your True Direction",
    subtitle: "Not a test. Not a score.\n15 minutes to discover your true direction.",
    start: "Start Your Free Assessment",
    startNote: "Free · ~15 min · No signup required",
    next: "Next →", generate: "Generate My Profile ✦",
    charLeft: (n, min) => n > 0 ? `✓` : ``,
    loading: ["Analyzing your learning style…","Identifying core strengths…","Matching academic directions…","Planning activity strategy…","Building your profile…"],
    errTitle: "Something went wrong", errDesc: "Your answers are saved — just retry",
    retry: "Try Again", backQ: "Review answers", lang: "中文",
    gateTitle: "Your profile is ready!",
    gateDesc:  "Fill in your info to save your full report.",
    namePH: "Your name (optional)", emailPH: "your@email.com",
    gateBtn: "View Full Report →", gateSkip: "Skip for now",
    gateNote: "No spam. Your data is encrypted and private.",
    rptTitle: "StarPath Profile Report",
    t0:"✦ Your Profile", t1:"📚 Academic Directions", t2:"🌱 Growth Pathway", t3:"📤 Get Your Plan",
    lArchetype:"Growth Archetype", lInsight:"Key Insight", lGrowth:"Growth Area", lStyle:"Thinking Style", lRadar:"Capability Profile",
    lStrengths3:"Your Core Strengths", lAcadDirs:"Potential Academic Directions", lGrowthPath:"Suggested Growth Pathway",
    lProjIdeas:"Project Ideas", lSugActs:"Suggested Activities", lCtaTitle:"Want a personalized pathway plan?", lCtaDesc:"Book a 1-on-1 strategy session to turn your profile into a real academic roadmap.", lCtaBtn:"Get My Personalized Plan",
    rAxes:["Academic Curiosity","Analytical Strength","Creativity","Social Impact Drive","Leadership"],
    lMajors:"Top Major Matches", lNextMonth:"Action Plan", lNextKey:"Before Applications",
    lCurriosity:"Natural Curiosity", lDomains:"Strongest Domains", lLearning:"Learning Style",
    lMajorDetail:"Major Matches Detail", lCourses:"Sample Courses", lCareers:"Career Paths",
    lCourseStrat:"Course Strategy", lApIb:"Recommended AP / IB",
    lEcAssess:"Activity Assessment", lNarrative:"Narrative Theme", lGaps:"Gaps",
    lRec:"Recommended Activities", lAction:"Specific Action", lWhy:"Why This Fits",
    lTimeline:"Timeline", lEssay:"Essay Strategy", lAngle:"Your Unique Angle",
    lSchoolType:"School Type Fit", lEdea:"ED/EA Strategy",
    lReach:"Reach", lMatch:"Match", lSafety:"Safety",
    sendTitle:"Send to a Counselor",
    sendDesc:"Send this profile so your counselor truly knows you before your first meeting.",
    optStarwise:"Book free StarWise consultation", optStarwiseSub:"Free 30-min strategy session",
    optOwn:"Send to my own counselor", optOwnSub:"Email the report to your existing counselor",
    yourInfo:"Your info", counselorEmail:"Counselor's email",
    note:"Note (optional)", notePH:"Any message for the counselor…",
    sendBtn:"Send to Counselor →", sending:"Opening…",
    sentTitle:"Email Opened 📧", sentDesc:"Your email client is open with the report pre-filled. Just hit send!",
    copyLink:"Copy Report Text", copied:"✓ Copied to clipboard",
    shareLink:"Share My Report Link", shareCopied:"✓ Link copied!",
    downloadPdf:"Download Report", downloading:"Preparing…",
    shareDesc:"Generate a link so parents or teachers can view your full report online — no login needed.",
    restart:"Start Over", back:"← Back",
    inviteBtn:"Invite a Friend", inviteDesc:"Share the assessment tool with friends",
    switchLang:"Switch to Chinese (regenerate)", switching:"Switching…",
    grade: g=>g==="5under"?"Grade 5 & Under":`Grade ${g}`,
    school: s=>{const m={us_public:"US Public",us_private:"US Private",ib:"IB Track",ap:"AP Track",intl:"Intl School",boarding:"Boarding",other:"Other"};return Array.isArray(s)?s.map(v=>m[v]||v).join(" · "):(m[s]||s);},
  },
};

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
// 根据年级选题库: G5及以下 / G6-8 / G9-12


// ─── SECTIONS META
// ─── SECTIONS META ────────────────────────────────────────────────────────────
const SECS = (lang) => {
  const zh = lang === "zh";
  return [
    {id:"profile",    label:zh?"基本定位":"Your Profile",  emoji:"📋", color:G.blue},
    {id:"academic",   label:zh?"学科兴趣":"Academics",      emoji:"🔬", color:G.green},
    {id:"strengths",  label:zh?"优势才干":"Strengths",      emoji:"⚡", color:G.amber},
    {id:"values",     label:zh?"价值观":"Values & Drive",   emoji:"🧭", color:G.purple},
    {id:"activities", label:zh?"经历与活动":"Experience",   emoji:"🏆", color:G.rose},
  ];
};

// ─── AI PROMPT ────────────────────────────────────────────────────────────────
const buildPrompt = (lang, ageGroup = 'high') => {
  const zh = lang === "zh";
  return `You are StarPath AI, an expert educational advisor at StarWise International Education. Analyze student responses and return ONLY valid JSON — no markdown, no backticks.

STUDENT AGE GROUP: ${ageGroup === 'elementary' ? 'Elementary (Grade 5 & under)' : ageGroup === 'middle' ? 'Middle School (Grade 6-8)' : 'High School (Grade 9-12)'}

REPORTING ANGLE BASED ON AGE GROUP:
- Elementary (G5 under): Focus on curiosity, play-based strengths, early interest sparks. Use simple, encouraging language. Avoid college/career specifics. Emphasize "what lights you up" and "how you like to learn". Report sections: growth archetype, top interest areas, learning style, 2-3 fun next steps.
- Middle School (G6-8): Focus on emerging strengths, subject interests, early identity formation. Use friendly, forward-looking language. Light mention of future directions. Report sections: growth archetype, core strengths, interest clusters, 3-4 activity/exploration recommendations for middle school.  
- High School (G9-12): Full college-focused analysis. Academic directions, major matches, EC strategy, counselor notes, application narrative. Use professional but warm language.

Return this exact structure:
{
  "snap": {
    "grade": "string",
    "schoolType": "string key",
    "archetype": "${zh?"从10种成长原型中选最匹配的一种：系统探索者/分析型战略者/创造型建造者/影响力领导者/全球思考者/科学探索者/叙事表达者/跨界创新者/共情行动者/独立开拓者":"One of: Systems Explorer / Analytical Strategist / Creative Builder / Impact Leader / Global Thinker / Scientific Investigator / Storytelling Communicator / Interdisciplinary Innovator / Empathy Advocate / Independent Pioneer"}",
    "personality": "${zh?"3-4字人格标签，如：分析型探索者":"3-5 word label, e.g. Analytical Explorer"}",
    "tagline": "${zh?"2句话画像，让学生感到被深度看见":"2 sentences, warm, make student feel truly seen"}",
    "strengths": [
      {"name":"${zh?"优势名称，4字内":"3-4 word name"}","desc":"${zh?"一句话说明，结合具体回答":"1 sentence with specific evidence"}"},
      {"name":"","desc":""},
      {"name":"","desc":""}
    ],
    "motivation": "${zh?"核心驱动，1句话":"Core drive, one sentence"}"
  },
  "radar": {
    "academicCuriosity": 75,
    "analyticalStrength": 80,
    "creativity": 68,
    "socialImpactDrive": 72,
    "leadership": 65
  },
  "summary": {
    "headline": "${zh?"2-3句综合画像，温暖有洞察":"2-3 warm insightful sentences"}",
    "keyInsight": "${zh?"最重要洞察，2句，必须引用具体回答":"Single most important insight, 2 sentences, cite specific answers"}",
    "watchOut": "${zh?"一个成长点，友善直接":"One gentle growth area"}",
    "counselorNote": "${zh?"给顾问的专业备注，1-2句":"Professional note for counselor, 1-2 sentences"}"
  },
  "academic": {
    "directions": ["${zh?"4-5个潜在学术方向，如 Environmental Science":"4-5 academic directions, e.g. Environmental Science"}"],
    "curiosity": "${zh?"基于回答的真实兴趣，2句":"True intellectual curiosity, 2 sentences"}",
    "learningStyle": "${zh?"学习风格，结合课堂偏好，1-2句":"Learning style, 1-2 sentences"}"
  },
  "majors": [
    {"name":"","fit":90,"why":"${zh?"为什么适合，2句":"Why it fits, 2 sentences"}","courses":["",""],"careers":["",""]}
  ],
  "growth": {
    "projects": ["${zh?"3个具体项目创意，可操作":"3 specific actionable project ideas"}"],
    "activities": ["${zh?"4-5个推荐活动类型":"4-5 suggested activity types"}"],
    "narrative": "${zh?"活动主线叙事建议，2句":"Activity narrative theme, 2 sentences"}"
  },
  "ec": {
    "assessment": "${zh?"活动现状评估，2句":"Activity assessment, 2 sentences"}",
    "gaps": ["${zh?"1-2个需要补强":"1-2 gaps"}"],
    "activities": [
      {"type":"","action":"${zh?"具体可操作":"Specific actionable"}","why":"${zh?"1句":"1 sentence"}","when":"${zh?"时间":"When"}"}
    ]
  },
  "next": {
    "month": ["${zh?"近期2-3件具体行动":"2-3 specific near-term actions"}"],
    "key": "${zh?"最关键一件事":"Single most important thing"}"
  }
}

Rules:
- snap.strengths: exactly 3 objects with name+desc, desc must cite specific answers
- radar: exactly these 5 keys, integers 40-95
- academic.directions: exactly 4-5 items
- growth.projects: exactly 3 specific actionable ideas
- majors: exactly 4, sorted by fit desc
- ec.activities: exactly 3
- Every insight MUST reference specific student answers — zero generic advice
- Tone: warm encouraging mentor who truly sees this student
- Pure JSON only`;
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:ital@0;1&family=Noto+Serif+SC:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#F5F9F3;-webkit-font-smoothing:antialiased;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{0%{transform:scale(.88);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes barIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes confDrop{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.anim-fade{animation:fadeUp .4s cubic-bezier(.16,1,.3,1) both}
.anim-pop{animation:pop .32s cubic-bezier(.16,1,.3,1) both}
.anim-float{animation:float 3.5s ease-in-out infinite}
textarea,input{font-family:'Nunito',sans-serif;outline:none;}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:rgba(106,175,61,.18);border-radius:4px}

.choice{background:#fff;border:2px solid rgba(26,58,42,.09);border-radius:13px;padding:14px 16px;cursor:pointer;transition:all .17s cubic-bezier(.16,1,.3,1);display:flex;align-items:center;gap:10px;}
.choice:hover{transform:translateY(-2px);border-color:rgba(106,175,61,.35);box-shadow:0 4px 16px rgba(106,175,61,.1);}
.choice.on{border-color:#6AAF3D;background:rgba(106,175,61,.06);}

.mtag{background:#fff;border:2px solid rgba(26,58,42,.08);border-radius:10px;padding:9px 13px;cursor:pointer;transition:all .15s ease;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;}
.mtag:hover{border-color:rgba(106,175,61,.3);background:rgba(106,175,61,.04);}
.mtag.on{border-color:#6AAF3D;background:rgba(106,175,61,.07);}
.mtag.dim{opacity:.28;cursor:not-allowed;}

.gbtn{font-family:'Nunito',sans-serif;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all .2s cubic-bezier(.16,1,.3,1);letter-spacing:.2px;}
.gbtn:hover:not(:disabled){transform:translateY(-2px);}
.gbtn:active:not(:disabled){transform:translateY(0);}
.gbtn:disabled{opacity:.22;cursor:not-allowed;}

.tbtn{padding:8px 15px;border-radius:20px;font-size:12px;font-family:'Nunito',sans-serif;cursor:pointer;transition:all .16s;border:2px solid transparent;font-weight:700;background:transparent;white-space:nowrap;}

.card{background:#fff;border:1px solid rgba(26,58,42,.08);border-radius:16px;padding:22px 22px;margin-bottom:14px;}
.sl{font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-bottom:11px;font-weight:800;font-family:'Nunito',sans-serif;opacity:.4;color:#1A3A2A;}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:20px;font-size:11px;font-weight:700;}
.bar-wrap{height:5px;border-radius:3px;background:rgba(26,58,42,.07);overflow:hidden;margin-top:7px;}
.bar-fill{height:100%;border-radius:3px;transform-origin:left;animation:barIn 1s cubic-bezier(.16,1,.3,1) .2s both;}

.ifield{width:100%;padding:12px 15px;border:1.5px solid rgba(26,58,42,.14);border-radius:10px;font-size:14px;font-family:'Nunito',sans-serif;color:#1E2B1E;background:#F5F9F3;transition:border-color .2s,background .2s;}
.ifield:focus{border-color:#6AAF3D;background:#fff;}

.lbtn{position:fixed;top:16px;right:16px;z-index:200;padding:6px 14px;border-radius:20px;font-size:11px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;background:rgba(26,58,42,.06);border:1px solid rgba(26,58,42,.12);color:rgba(26,58,42,.45);transition:all .2s;}
.lbtn:hover{background:rgba(26,58,42,.1);color:rgba(26,58,42,.8);}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// ─── AGE GROUP & QUESTION BANK ─────────────────────────────────────────────
const getAgeGroup = (gradeVal) => {
  const g = parseInt(gradeVal) || 0;
  if (gradeVal === '5under' || g <= 5) return 'elementary';  // G5及以下
  if (g <= 8) return 'middle';                               // G6-G8
  return 'high';                                              // G9-12
};

const buildQ = (lang, ageGroup) => {
  const zh = lang === "zh";
  const ag = ageGroup || 'high'; // 默认高中组

  // ── 公共 Profile 题 (所有年级都有)
  const profileQ = [
    { id:"pr1", sec:"profile", secLabel:zh?"基本定位":"Your Profile", secEmoji:"📋", secColor:G.blue,
      type:"choice", text:zh?"你目前在几年级？":"What grade are you in?",
      opts:[{l:zh?"5年级及以下":"Grade 5 & Under",v:"5under",e:"🌱"},{l:zh?"6年级":"Grade 6",v:"6",e:"🌿"},
            {l:zh?"7年级":"Grade 7",v:"7",e:"🔥"},{l:zh?"8年级":"Grade 8",v:"8",e:"⚡"},
            {l:zh?"9年级":"Grade 9",v:"9",e:"🚀"},{l:zh?"10年级":"Grade 10",v:"10",e:"⭐"},
            {l:zh?"11年级":"Grade 11",v:"11",e:"💫"},{l:zh?"12年级":"Grade 12",v:"12",e:"🎓"}]},
  ];

  // ── G5及以下 题库（简单、图像化、探索导向）
  const elementaryQ = [
    { id:"el1", sec:"academic", secLabel:zh?"我的兴趣":"My Interests", secEmoji:"🔬", secColor:G.green,
      type:"multi", max:3, text:zh?"你最喜欢做哪些事？（选最多3个）":"What do you love doing most? (pick up to 3)",
      opts:[{l:zh?"画画/手工":"Drawing & Crafts",v:"arts",e:"🎨"},{l:zh?"搭积木/乐高":"Building & LEGO",v:"build",e:"🧱"},
            {l:zh?"看书/讲故事":"Reading & Stories",v:"read",e:"📚"},{l:zh?"做实验/探索":"Experiments",v:"sci",e:"🔬"},
            {l:zh?"唱歌/跳舞/表演":"Music & Performing",v:"perf",e:"🎵"},{l:zh?"玩游戏/解谜":"Games & Puzzles",v:"game",e:"🎮"},
            {l:zh?"帮助他人":"Helping Others",v:"help",e:"🤝"},{l:zh?"大自然/动植物":"Nature & Animals",v:"nat",e:"🌿"}]},
    { id:"el2", sec:"academic", secLabel:zh?"我的兴趣":"My Interests", secEmoji:"🔬", secColor:G.green,
      type:"choice", text:zh?"你最喜欢哪种课？":"Which class do you enjoy most?",
      opts:[{l:zh?"数学":"Math",v:"math",e:"🔢"},{l:zh?"科学":"Science",v:"sci",e:"🧪"},
            {l:zh?"语文/英文":"Language Arts",v:"lang",e:"📝"},{l:zh?"美术/音乐":"Art & Music",v:"art",e:"🎨"},
            {l:zh?"体育":"PE",v:"pe",e:"⚽"},{l:zh?"社会/历史":"Social Studies",v:"soc",e:"🌍"}]},
    { id:"el3", sec:"strengths", secLabel:zh?"我的特点":"My Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"你的朋友会怎么描述你？":"How would your friends describe you?",
      opts:[{l:zh?"很有创意，总有新想法":"Creative & full of ideas",v:"creative",e:"💡"},
            {l:zh?"做事认真，很负责":"Responsible & careful",v:"careful",e:"⭐"},
            {l:zh?"喜欢帮助别人":"Kind & helpful",v:"kind",e:"💛"},
            {l:zh?"爱问问题，好奇心强":"Curious & asks lots of questions",v:"curious",e:"🔍"},
            {l:zh?"天生领袖，喜欢组织大家":"Natural leader",v:"leader",e:"👑"}]},
    { id:"el4", sec:"strengths", secLabel:zh?"我的特点":"My Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"你喜欢怎么完成作业或项目？":"How do you like to work?",
      opts:[{l:zh?"自己独立完成":"By myself",v:"solo",e:"🦅"},
            {l:zh?"和好朋友一起":"With close friends",v:"small",e:"👫"},
            {l:zh?"大家一起合作":"In a big group",v:"group",e:"👥"}]},
    { id:"el5", sec:"values", secLabel:zh?"我的梦想":"My Dreams", secEmoji:"🧭", secColor:G.purple,
      type:"multi", max:3, text:zh?"长大后你想做什么样的事？（选最多3个）":"What kind of work excites you for the future? (up to 3)",
      opts:[{l:zh?"帮助生病的人":"Help sick people",v:"med",e:"🏥"},{l:zh?"发明新东西":"Invent new things",v:"inv",e:"🔧"},
            {l:zh?"保护地球环境":"Protect the Earth",v:"env",e:"🌍"},{l:zh?"创作艺术/音乐":"Create art or music",v:"art",e:"🎨"},
            {l:zh?"教书/帮助孩子":"Teach or help kids",v:"edu",e:"📚"},{l:zh?"探索太空或科学":"Explore space or science",v:"sci",e:"🚀"},
            {l:zh?"让社区变得更好":"Make community better",v:"comm",e:"🤝"},{l:zh?"建造房子或城市":"Build things",v:"build",e:"🏗"}]},
    { id:"el6", sec:"values", secLabel:zh?"我的梦想":"My Dreams", secEmoji:"🧭", secColor:G.purple,
      type:"open", minChars:1,
      text:zh?"你最近做过一件让你特别开心或骄傲的事，是什么？":"Tell me about something you did recently that made you really happy or proud.",
      ph:zh?"可以是学校里的，也可以是家里的任何事…":"School or home — anything that made you smile…"},
    { id:"el7", sec:"strengths", secLabel:zh?"我的特点":"My Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"你觉得自己学新东西的时候，哪种方式最容易懂？":"How do you learn new things best?",
      opts:[{l:zh?"看老师演示，然后自己试":"Watch first, then try",v:"visual",e:"👀"},
            {l:zh?"直接动手做做看":"Just dive in and do it",v:"hands",e:"🙌"},
            {l:zh?"听别人讲解和解释":"Listen to explanations",v:"listen",e:"👂"},
            {l:zh?"先自己琢磨，再问问题":"Think first, then ask",v:"think",e:"🤔"}]},
    { id:"el8", sec:"academic", secLabel:zh?"我的兴趣":"My Interests", secEmoji:"🔬", secColor:G.green,
      type:"choice", text:zh?"如果学校有一整天让你自由做任何事，你最想做什么？":"If you had a whole free day at school, what would you choose to do?",
      opts:[{l:zh?"做一个发明或创作":"Build or create something",v:"make",e:"🔧"},
            {l:zh?"读书或研究一个有趣的话题":"Read or research something cool",v:"read",e:"📚"},
            {l:zh?"和朋友合作完成一个任务":"Work on a challenge with friends",v:"collab",e:"🤝"},
            {l:zh?"在外面运动或探索自然":"Play outside or explore nature",v:"outside",e:"🌿"},
            {l:zh?"画画、写故事或做音乐":"Draw, write stories, or make music",v:"create",e:"🎨"}]},
    { id:"el9", sec:"values", secLabel:zh?"我的梦想":"My Dreams", secEmoji:"🧭", secColor:G.purple,
      type:"multi", max:2, text:zh?"你觉得做什么事情最让你有满足感？（选2个）":"What makes you feel most proud of yourself? (pick 2)",
      opts:[{l:zh?"学会了很难的东西":"Learning something really hard",v:"master",e:"🏆"},
            {l:zh?"帮助了身边的人":"Helping someone around me",v:"help",e:"💛"},
            {l:zh?"做出了独特的创作":"Creating something unique",v:"create",e:"🌟"},
            {l:zh?"解决了一个难题":"Solving a tough problem",v:"solve",e:"🧩"},
            {l:zh?"大家一起完成了一件事":"Achieving something as a team",v:"team",e:"🤝"}]},
  ];

  // ── G6-G8 题库（探索+自我发现）
  const middleQ = [
    { id:"ms1", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"multi", max:3, text:zh?"你最喜欢哪些课？（最多3个）":"Your favorite subjects? (up to 3)",
      opts:[{l:zh?"数学":"Math",v:"math",e:"🔢"},{l:zh?"科学/实验":"Science & Lab",v:"sci",e:"🔬"},
            {l:zh?"计算机/编程":"CS & Coding",v:"cs",e:"💻"},{l:zh?"语文/写作":"Language & Writing",v:"eng",e:"✍️"},
            {l:zh?"历史/社会":"History & Social",v:"hist",e:"📜"},{l:zh?"艺术/音乐":"Arts & Music",v:"arts",e:"🎨"},
            {l:zh?"体育":"PE & Sports",v:"pe",e:"⚽"},{l:zh?"外语":"Foreign Language",v:"lang",e:"🗣"}]},
    { id:"ms2", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"choice", text:zh?"课外你会主动去了解什么？":"What do you voluntarily explore outside school?",
      opts:[{l:zh?"科技/游戏/编程":"Tech, games & coding",v:"tech",e:"🤖"},
            {l:zh?"艺术/音乐/动漫":"Art, music & animation",v:"art",e:"🎨"},
            {l:zh?"运动/健身":"Sports & fitness",v:"sports",e:"⚽"},
            {l:zh?"动物/自然/环境":"Nature & environment",v:"nat",e:"🌿"},
            {l:zh?"历史故事/人物传记":"History & biographies",v:"hist",e:"📖"},
            {l:zh?"社会问题/新闻":"Current events & news",v:"news",e:"🌍"}]},
    { id:"ms3", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"multi", max:3, text:zh?"同学最常来找你帮什么？":"What do classmates come to you for? (up to 3)",
      opts:[{l:zh?"讲解题目/知识":"Explaining & teaching",v:"teach",e:"📖"},
            {l:zh?"出创意/想方案":"Ideas & creativity",v:"idea",e:"💡"},
            {l:zh?"帮忙写作/改文章":"Writing & editing",v:"write",e:"✍️"},
            {l:zh?"技术/电脑问题":"Tech help",v:"tech",e:"💻"},
            {l:zh?"组织活动":"Organizing events",v:"org",e:"📋"},
            {l:zh?"倾听与支持":"Listening & support",v:"emp",e:"💛"},
            {l:zh?"设计/美化":"Design & visuals",v:"des",e:"🎨"}]},
    { id:"ms4", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"小组项目里，你通常做什么？":"In group projects, what do you naturally do?",
      opts:[{l:zh?"提出点子和方向":"Come up with ideas",v:"vis",e:"🌟"},
            {l:zh?"做计划和分工":"Plan & organize",v:"exe",e:"⚙️"},
            {l:zh?"负责研究和收集资料":"Research & gather info",v:"res",e:"🔬"},
            {l:zh?"协调大家、解决矛盾":"Keep the team together",v:"med",e:"🤝"},
            {l:zh?"最后打磨成品":"Polish & perfect the final product",v:"fin",e:"✨"}]},
    { id:"ms5", sec:"values", secLabel:zh?"价值观":"Values", secEmoji:"🧭", secColor:G.purple,
      type:"multi", max:3, text:zh?"做事情，什么让你最有动力？（选3个）":"What motivates you most? (pick 3)",
      opts:[{l:zh?"真正搞懂一件事":"Understanding things deeply",v:"mas",e:"🔍"},
            {l:zh?"帮助到别人":"Making a difference for others",v:"imp",e:"🌍"},
            {l:zh?"被表扬和认可":"Recognition & praise",v:"rec",e:"⭐"},
            {l:zh?"挑战自己，突破极限":"Pushing my limits",v:"chal",e:"🔥"},
            {l:zh?"和好朋友一起做事":"Working with friends",v:"col",e:"🤝"},
            {l:zh?"自己做主，不被约束":"Freedom to do things my way",v:"aut",e:"🦅"},
            {l:zh?"解决真实的问题":"Solving real problems",v:"sol",e:"🧩"},
            {l:zh?"创作出独特的东西":"Creating something unique",v:"exp",e:"🎨"}]},
    { id:"ms6", sec:"values", secLabel:zh?"价值观":"Values", secEmoji:"🧭", secColor:G.purple,
      type:"choice", text:zh?"你在课外有没有认真投入过一件事？":"Have you seriously committed to something outside school?",
      opts:[{l:zh?"有，坚持很久了":"Yes — for a long time",v:"yes",e:"🏆"},
            {l:zh?"有，但还在起步阶段":"Yes — just getting started",v:"start",e:"🌱"},
            {l:zh?"有想法但还没开始":"Have ideas but haven't started",v:"idea",e:"💭"},
            {l:zh?"还没有，在探索中":"Not yet — still exploring",v:"no",e:"🔍"}]},
    { id:"ms7", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"open", minChars:1,
      text:zh?"描述一件你最近做过的、让你感觉特别投入或骄傲的事。":"Tell me about something you did recently that you were really into or proud of.",
      ph:zh?"学校里或课外都可以，说说你做了什么…":"School or outside — what did you do?"},
    { id:"ms8", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"你通常怎么学新东西学得最快？":"How do you learn new things most effectively?",
      opts:[{l:zh?"看视频、图表或演示":"Videos, visuals & demos",v:"visual",e:"👀"},
            {l:zh?"直接动手做、边做边学":"Hands-on, learn by doing",v:"hands",e:"🙌"},
            {l:zh?"听讲解、记笔记":"Listening & note-taking",v:"listen",e:"📝"},
            {l:zh?"自己研究、独立思考":"Self-study & independent thinking",v:"solo",e:"🔍"},
            {l:zh?"和别人讨论、互相解释":"Discussion & peer learning",v:"discuss",e:"💬"}]},
    { id:"ms9", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"multi", max:3, text:zh?"你在学校外面有没有认真做过以下任何事？（选所有符合的）":"Have you seriously done any of these outside school? (select all that apply)",
      opts:[{l:zh?"自学一门技能（编程、乐器等）":"Self-taught a skill (coding, instrument, etc.)",v:"self",e:"💡"},
            {l:zh?"参加过比赛或考级":"Competed or tested in something",v:"comp",e:"🏆"},
            {l:zh?"做过义工或社区服务":"Volunteered or served community",v:"vol",e:"🌍"},
            {l:zh?"创作过作品（绘画、写作、视频等）":"Created original work",v:"create",e:"🎨"},
            {l:zh?"参加过夏令营或特殊课程":"Attended camps or special programs",v:"camp",e:"🏕"},
            {l:zh?"以上都没有，还在探索":"None yet — still exploring",v:"none",e:"🌱"}]},
    { id:"ms10", sec:"values", secLabel:zh?"价值观":"Values", secEmoji:"🧭", secColor:G.purple,
      type:"choice", text:zh?"你觉得上高中最重要的事是什么？":"What do you think matters most in high school?",
      opts:[{l:zh?"成绩好，为大学做准备":"Good grades & college prep",v:"grades",e:"📊"},
            {l:zh?"找到真正感兴趣的方向":"Finding what genuinely interests me",v:"passion",e:"🔍"},
            {l:zh?"建立友谊和社交圈":"Building friendships & connections",v:"social",e:"🤝"},
            {l:zh?"发展一项特别擅长的技能":"Developing a standout skill",v:"skill",e:"⚡"},
            {l:zh?"有意义的经历和成长":"Meaningful experiences & growth",v:"growth",e:"🌱"}]},
    { id:"ms11", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"multi", max:3, text:zh?"你最希望在初高中阶段尝试什么？（最多3个）":"What would you most like to try in middle/high school? (up to 3)",
      opts:[{l:zh?"学习编程或科技技能":"Learn coding or tech skills",v:"tech",e:"💻"},
            {l:zh?"参加体育队或运动":"Join a sports team",v:"sports",e:"⚽"},
            {l:zh?"参与艺术或表演":"Arts or performing",v:"arts",e:"🎭"},
            {l:zh?"做科学实验或研究":"Science experiments or research",v:"sci",e:"🔬"},
            {l:zh?"组织或参与社区活动":"Organize or join community projects",v:"comm",e:"🌍"},
            {l:zh?"创业或做一个自己的项目":"Start my own project or business",v:"own",e:"🚀"},
            {l:zh?"写作、出版或创作内容":"Writing, publishing, or content creation",v:"write",e:"✍️"}]},
  ];

  // ── G9-12 题库（完整版，原有题库）
  const highQ = [
    { id:"pr2", sec:"profile", secLabel:zh?"基本定位":"Your Profile", secEmoji:"📋", secColor:G.blue,
      type:"multi", max:3, text:zh?"你就读的学校类型？（可多选）":"What describes your school? (select all that apply)",
      opts:[{l:zh?"美国公立高中":"US Public School",v:"us_public",e:"🏫"},
            {l:zh?"美国私立高中":"US Private School",v:"us_private",e:"🏛"},
            {l:zh?"提供 IB 课程":"Offers IB Track",v:"ib",e:"🌍"},
            {l:zh?"提供 AP 课程":"Offers AP Track",v:"ap",e:"📘"},
            {l:zh?"国际学校（海外）":"International School (Overseas)",v:"intl",e:"🌏"},
            {l:zh?"寄宿学校":"Boarding School",v:"boarding",e:"🏰"},
            {l:zh?"其他":"Other",v:"other",e:"🌐"}]},
    { id:"pr3", sec:"profile", secLabel:zh?"基本定位":"Your Profile", secEmoji:"📋", secColor:G.blue,
      type:"multi", max:3, text:zh?"你感觉比较强的科目？（最多3个）":"Your strongest subjects? (up to 3)",
      opts:[{l:zh?"数学":"Math",v:"math",e:"🔢"},{l:zh?"理科":"Sciences",v:"sci",e:"🔬"},
            {l:zh?"计算机/编程":"CS / Coding",v:"cs",e:"💻"},{l:zh?"英语/写作":"English / Writing",v:"eng",e:"✍️"},
            {l:zh?"历史/社会":"History / Social",v:"hist",e:"📜"},{l:zh?"经济学":"Economics",v:"econ",e:"📊"},
            {l:zh?"艺术/设计/音乐":"Arts / Music",v:"arts",e:"🎨"},{l:zh?"外语":"Foreign Language",v:"lang",e:"🗣"}]},
    { id:"pr4", sec:"profile", secLabel:zh?"基本定位":"Your Profile", secEmoji:"📋", secColor:G.blue,
      type:"multi", max:2, text:zh?"你目前参加的课外活动？（选你真正在做的）":"Your current extracurriculars? (pick what you actually do)",
      opts:[{l:zh?"体育运动":"Sports",v:"sports",e:"⚽"},{l:zh?"学术竞赛":"Competitions",v:"comp",e:"🏆"},
            {l:zh?"艺术/音乐/戏剧":"Arts / Music",v:"arts",e:"🎭"},{l:zh?"社区服务":"Community Service",v:"comm",e:"🤝"},
            {l:zh?"学生会/领导":"Student Leadership",v:"lead",e:"🎤"},{l:zh?"科研/实验室":"Research / Lab",v:"res",e:"🔭"},
            {l:zh?"创业/商业":"Entrepreneurship",v:"biz",e:"💡"},{l:zh?"暂时没有固定活动":"Nothing formal yet",v:"none",e:"🌱"}]},
    { id:"ac1", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"choice", text:zh?"你最想深入研究哪类问题？":"What kind of problems fascinate you most?",
      opts:[{l:zh?"探索规律和原理（为什么）":"Why — patterns & principles",v:"analytical",e:"🔍"},
            {l:zh?"设计方案，动手实现（怎么做）":"How — design & build",v:"applied",e:"🛠"},
            {l:zh?"理解人类行为和社会":"Human behavior & society",v:"humanistic",e:"🧠"},
            {l:zh?"探讨价值观和公平正义":"Ethics, values & justice",v:"normative",e:"⚖️"},
            {l:zh?"用创意和艺术表达想法":"Creative & artistic expression",v:"creative",e:"🎨"}]},
    { id:"ac2", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"multi", max:3, text:zh?"你课外会主动去了解的话题？（最多3个）":"Topics you voluntarily explore outside school? (up to 3)",
      opts:[{l:zh?"AI / 科技":"AI / Tech",v:"tech",e:"🤖"},{l:zh?"气候 / 环境":"Climate",v:"env",e:"🌍"},
            {l:zh?"心理学":"Psychology",v:"psych",e:"🧠"},{l:zh?"商业 / 金融":"Business",v:"biz",e:"📈"},
            {l:zh?"政治 / 国际关系":"Politics / IR",v:"pol",e:"🌐"},{l:zh?"医学 / 生命科学":"Medicine",v:"bio",e:"🏥"},
            {l:zh?"数学 / 物理 / 工程":"STEM",v:"stem",e:"⚙️"},{l:zh?"文学 / 哲学":"Humanities",v:"hum",e:"📚"},
            {l:zh?"艺术 / 设计":"Art / Design",v:"des",e:"🏛"},{l:zh?"社会议题 / 公益":"Social Justice",v:"soc",e:"✊"}]},
    { id:"ac3", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"choice", text:zh?"什么样的课堂让你最投入？":"What kind of class engages you most?",
      opts:[{l:zh?"讨论课——辩论观点":"Discussion & debate",v:"disc",e:"💬"},
            {l:zh?"实验课——动手操作":"Lab & hands-on",v:"lab",e:"🧪"},
            {l:zh?"讲座课——深度知识":"Lecture & deep knowledge",v:"lec",e:"📖"},
            {l:zh?"项目课——做完整作品":"Project-based",v:"proj",e:"🚀"}]},
    { id:"ac4", sec:"academic", secLabel:zh?"学科兴趣":"Academics", secEmoji:"🔬", secColor:G.green,
      type:"open", minChars:1,
      text:zh?"有没有一个问题或话题，是你课外会自己去深挖的？是什么，为什么让你着迷？":"Is there a topic you explore on your own outside school? What and why does it fascinate you?",
      ph:zh?"可以是任何领域，不一定和学校课程有关…":"Anything — doesn't need to be school-related…"},
    { id:"st1", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"multi", max:4, text:zh?"同学最常来找你帮什么忙？（最多4个，选真实做过的）":"What do classmates most often ask you for? (up to 4, be honest)",
      opts:[{l:zh?"解题/讲知识点":"Explaining / tutoring",v:"teach",e:"📖"},
            {l:zh?"出主意/想创意":"Ideas & creative solutions",v:"idea",e:"💡"},
            {l:zh?"写作/改文章":"Writing & editing",v:"write",e:"✍️"},
            {l:zh?"分析/逻辑推理":"Analysis & logic",v:"anal",e:"📊"},
            {l:zh?"组织活动/推项目":"Organizing & managing",v:"org",e:"📋"},
            {l:zh?"倾听和情感支持":"Listening & support",v:"emp",e:"💛"},
            {l:zh?"编程/技术":"Coding & tech",v:"code",e:"💻"},
            {l:zh?"设计/视觉":"Design & visuals",v:"des",e:"🎨"}]},
    { id:"st2", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"choice", text:zh?"团队项目里，你自然承担什么角色？":"In group projects, what role do you naturally take?",
      opts:[{l:zh?"提出方向和创意":"Visionary / idea-setter",v:"vis",e:"🌟"},
            {l:zh?"做计划、推进执行":"Planner & executor",v:"exe",e:"⚙️"},
            {l:zh?"协调成员、解决矛盾":"Mediator & team glue",v:"med",e:"🤝"},
            {l:zh?"深度研究、知识支撑":"Deep researcher & expert",v:"res",e:"🔬"},
            {l:zh?"打磨成品、注重细节":"Finisher & detail person",v:"fin",e:"✨"}]},
    { id:"st3", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"scale", leftLabel:zh?"独立深度专注":"Solo deep focus", rightLabel:zh?"多线并行推进":"Juggling many things"},
    { id:"st4", sec:"strengths", secLabel:zh?"优势与才干":"Strengths", secEmoji:"⚡", secColor:G.amber,
      type:"open", minChars:1,
      text:zh?"描述一件让你感觉「我真的很擅长这个」的事。具体说你做了什么，结果是什么。":"Describe something where you felt 'I\'m genuinely good at this.' What did you do and what happened?",
      ph:zh?"可以是学校里的，也可以是课外的任何事…":"Academic or extracurricular — anything real…"},
    { id:"va1", sec:"values", secLabel:zh?"价值观":"Values & Drive", secEmoji:"🧭", secColor:G.purple,
      type:"multi", max:3, text:zh?"你学习和做事的核心驱动力？（选3个最真实的）":"Your core motivators? (pick the 3 most honest)",
      opts:[{l:zh?"真正搞懂深层原理":"Deep understanding",v:"mas",e:"🔍"},
            {l:zh?"做出能帮助他人的东西":"Creating impact",v:"imp",e:"🌍"},
            {l:zh?"被认可，证明自己":"Recognition & validation",v:"rec",e:"⭐"},
            {l:zh?"挑战极限，突破自己":"Pushing my limits",v:"chal",e:"🔥"},
            {l:zh?"和志同道合的人协作":"Collaborating with great people",v:"col",e:"🤝"},
            {l:zh?"掌控自己的时间和选择":"Autonomy & freedom",v:"aut",e:"🦅"},
            {l:zh?"解决真实存在的问题":"Solving real problems",v:"sol",e:"🧩"},
            {l:zh?"创造美的东西，表达自己":"Creating & expressing",v:"exp",e:"🎨"}]},
    { id:"va2", sec:"values", secLabel:zh?"价值观":"Values & Drive", secEmoji:"🧭", secColor:G.purple,
      type:"choice", text:zh?"你希望大学4年能带给你什么？":"What do you most want from 4 years of college?",
      opts:[{l:zh?"在某个领域打下深厚基础":"Deep expertise in one field",v:"depth",e:"🏆"},
            {l:zh?"广泛探索，找到热爱":"Broad exploration to find passion",v:"expl",e:"🗺"},
            {l:zh?"建立人脉和资源":"Network & opportunities",v:"net",e:"🤝"},
            {l:zh?"做真正有价值的项目":"Producing meaningful work",v:"cre",e:"🚀"}]},
    { id:"va3", sec:"values", secLabel:zh?"价值观":"Values & Drive", secEmoji:"🧭", secColor:G.purple,
      type:"open", minChars:1,
      text:zh?"如果你可以用大学4年做一件对世界有意义的事，你会做什么？":"If you could use 4 years of college to do one meaningful thing for the world, what would it be?",
      ph:zh?"不用考虑现不现实，说说你真正在意的事…":"Dream big — what genuinely matters to you?"},
    { id:"act1", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"choice", text:zh?"你在课外活动中通常处于什么位置？":"In your extracurriculars, what position do you usually hold?",
      opts:[{l:zh?"领导或负责人":"Leader / organizer",v:"lead",e:"👑"},
            {l:zh?"核心成员，承担重要任务":"Core member with key responsibilities",v:"core",e:"⭐"},
            {l:zh?"普通参与者，认真投入":"Regular participant, genuinely committed",v:"part",e:"🙋"},
            {l:zh?"刚开始，还在找方向":"Just starting, exploring",v:"new",e:"🌱"}]},
    { id:"act2", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"choice", text:zh?"你有没有独立发起过或主导过一个项目/活动？":"Have you independently started or led a project?",
      opts:[{l:zh?"有，做出了真实成果":"Yes — with real outcomes",v:"yes",e:"🚀"},
            {l:zh?"有，还在进行中":"Yes — still in progress",v:"wip",e:"⚡"},
            {l:zh?"有想法，还没行动":"Have an idea, haven't started",v:"idea",e:"💭"},
            {l:zh?"还没有":"Not yet",v:"no",e:"🌱"}]},
    { id:"act3", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"multi", max:3, text:zh?"你希望在高中尝试哪类背景提升？（最多3个）":"Which activities genuinely interest you? (up to 3)",
      opts:[{l:zh?"学术科研":"Research",v:"res",e:"🔬"},{l:zh?"学术竞赛":"Competitions",v:"comp",e:"🏆"},
            {l:zh?"创业/社会企业":"Startup / social enterprise",v:"start",e:"💡"},
            {l:zh?"公益/社会影响":"Community impact",v:"serv",e:"🌍"},
            {l:zh?"艺术/创意作品集":"Arts portfolio",v:"arts",e:"🎨"},
            {l:zh?"夏校或学术项目":"Summer programs",v:"sum",e:"🏫"},
            {l:zh?"写作出版":"Writing & publishing",v:"write",e:"✍️"},
            {l:zh?"技术项目":"Tech project",v:"tech",e:"💻"}]},
    { id:"act4", sec:"activities", secLabel:zh?"经历与活动":"Experience", secEmoji:"🏆", secColor:G.rose,
      type:"open", minChars:1,
      text:zh?"描述你做过的一件课外事——你真正在乎过、投入过时间的。是什么，你做了什么，为什么重要？":"Describe one thing outside school you genuinely cared about and put real time into.",
      ph:zh?"不管大小，只要是真实投入的…":"Big or small — just something real…"},
  ];

  if (ag === 'elementary') return [...profileQ, ...elementaryQ];
  if (ag === 'middle') return [...profileQ, ...middleQ];
  return [...profileQ, ...highQ];
}

export default function StarPathC() {
  // StarWise Logo Component
  const StarWiseLogo = ({size=32}) => (
    <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,display:"flex"}}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",display:"block"}}>
        <circle cx="50" cy="50" r="50" fill="#6AAF3D"/>
        <polygon points="50,20 84,35 50,50 16,35" fill="white"/>
        <path d="M30,40 L30,59 C30,68 39,74 50,74 C61,74 70,68 70,59 L70,40 L50,50 Z" fill="white"/>
        <rect x="80" y="35" width="3.5" height="22" rx="1.5" fill="white"/>
        <polygon points="81.5,60 84,66 90,66 85,70 87,76 81.5,72 76,76 78,70 73,66 79,66" fill="white"/>
      </svg>
    </div>
  );

  const [lang, setLang]       = useState("zh");
  const [phase, setPhase]     = useState("intro"); // intro|quiz|gen|gate|result|error
  const [qi, setQi]           = useState(0);
  const [ans, setAns]         = useState({});
  const [profile, setProfile] = useState(null);
  const [tab, setTab]         = useState("summary");
  const [majI, setMajI]       = useState(0);
  const [ecI, setEcI]         = useState(0);
  const [animK, setAnimK]     = useState(0);
  const [loadI, setLoadI]     = useState(0);
  const [dots, setDots]       = useState("");
  const [conf, setConf]       = useState([]);
  // email gate
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [emailErr, setEmailErr] = useState("");
  // send
  const [sendMode, setSendMode] = useState(null); // null|starwise|own
  const [cEmail, setCEmail]   = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [note, setNote]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [copied, setCopied]   = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const t    = T[lang];
  const ageGroup = ans['pr1'] ? getAgeGroup(ans['pr1']) : 'high';
  const QS   = buildQ(lang, ageGroup);
  const SECS_ = SECS(lang);
  const TOTAL = QS.length;
  const safeQi = Math.min(qi, TOTAL - 1);
  const cq   = QS[safeQi];
  const taRef = useRef(null);

  // loading animation
  useEffect(() => {
    if (phase !== "gen") return;
    const i1 = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 380);
    const i2 = setInterval(() => setLoadI(i => (i+1) % t.loading.length), 2000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, [phase, lang]);

  // auto-focus textarea
  useEffect(() => {
    if (cq?.type === "open" && taRef.current) setTimeout(() => taRef.current?.focus(), 60);
  }, [qi]);

  // 年级切换时 qi 越界保护
  useEffect(() => {
    if (qi >= TOTAL) setQi(TOTAL - 1);
  }, [ageGroup]);

  // base64 解码（对应 toB64）
  const fromB64 = (str) => {
    try {
      const b = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
      const bytes = new Uint8Array(b.length);
      for (let i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch(e) { return null; }
  };

  // 加载分享报告（从 URL hash）
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // 短链接格式 #id=xxxxxxxx → 从 GAS 读取完整报告
    if (hash.startsWith('#id=')) {
      const id = hash.slice(4);
      jsonpCall("https://script.google.com/macros/s/AKfycbxfX4wPoLml4SffUSibaL63thjje2ykdXU0B358-ROjFmBOku-fm1wOA3yktFHeWTIL/exec?id=" + id)
        .then(json => {
          if (json.ok && json.payload && json.payload.p) {
            setProfile(json.payload.p);
            if (json.payload.n) setName(json.payload.n);
            if (json.payload.l) setLang(json.payload.l);
            setPhase('result'); setTab('summary');
          }
        })
        .catch(e => console.warn('Load report failed:', e));
      return;
    }

    // 降级格式 #r=... (v3 slim UTF-8 base64)
    if (hash.startsWith('#r=')) {
      try {
        const json = fromB64(hash.slice(3));
        if (!json) return;
        const d = JSON.parse(json);
        if (d.v === 3) {
          setProfile({
            snap: { archetype: d.a, personality: d.p, tagline: '', strengths: [], motivation: '' },
            radar: { academicCuriosity:d.r[0], analyticalStrength:d.r[1], creativity:d.r[2], socialImpactDrive:d.r[3], leadership:d.r[4] },
            summary: { headline: d.h, keyInsight: '', watchOut: '' },
            academic: { directions: [] },
            majors: (d.mj||[]).map(m => ({ name:m[0], fit:m[1], why:'', courses:[], careers:[] })),
            next: { month: [], key: '' },
          });
          if (d.nm) setName(d.nm);
          if (d.ln) setLang(d.ln);
          setPhase('result'); setTab('summary');
        }
      } catch(e) { console.warn('Slim hash decode failed:', e); }
      return;
    }

    // 旧格式 #report=... 向下兼容
    if (hash.startsWith('#report=')) {
      try {
        const raw = hash.slice(8).replace(/-/g, '+').replace(/_/g, '/');
        const padded = raw + '=' .repeat((4 - raw.length % 4) % 4);
        const payload = JSON.parse(decodeURIComponent(escape(atob(padded))));
        if (payload.p) {
          setProfile(payload.p);
          if (payload.n) setName(payload.n);
          if (payload.l) setLang(payload.l);
          setPhase('result'); setTab('summary');
        }
      } catch(e) { console.warn('Legacy hash decode failed:', e); }
    }
  }, []);


  // confetti on result
  useEffect(() => {
    if (phase !== "result") return;
    const items = Array.from({length:22}, (_,i) => ({
      id:i, x:Math.random()*100,
      color:[G.green,G.greenLt,G.sage,"#A5D873","#D1F0A8"][i%5],
      sz:Math.random()*7+4, del:Math.random()*1.5, dur:Math.random()*2+1.2,
    }));
    setConf(items);
    setTimeout(() => setConf([]), 4000);
  }, [phase]);

  const charN = cq?.type === "open" ? (lang === "zh" ? (ans[cq.id]||"").replace(/\s/g,"").length : (ans[cq.id]||"").length) : 0;

  const ok = () => {
    if (!cq) return false;
    if (cq.type === "choice") return !!ans[cq.id];
    if (cq.type === "multi")  return (ans[cq.id]||[]).length >= 1;
    if (cq.type === "scale")  return ans[cq.id] !== undefined;
    if (cq.type === "open")   return (ans[cq.id]||"").replace(/\s/g,"").length >= (cq.minChars||20);
    return false;
  };

  const next = () => {
    if (!ok()) return;
    if (qi < TOTAL-1) { setAnimK(k=>k+1); setQi(qi+1); }
    else generate();
  };

  const generate = async () => {
    setPhase("gen");
    const lines = [];
    const secsSeen = new Set();
    for (const q of QS) {
      const a = ans[q.id];
      if (!a) continue;
      if (!secsSeen.has(q.sec)) { lines.push(`\n[${q.secLabel}]`); secsSeen.add(q.sec); }
      lines.push(`Q: ${q.text}`);
      if (q.type === "choice") lines.push(`A: ${q.opts?.find(o=>o.v===a)?.l||a}`);
      else if (q.type === "multi") lines.push(`A: ${(a||[]).map(v=>q.opts?.find(o=>o.v===v)?.l||v).join(", ")}`);
      else if (q.type === "scale") lines.push(`A: ${a}/10 (${q.leftLabel} ←→ ${q.rightLabel})`);
      else lines.push(`A: ${a}`);
    }
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:4000,
          temperature:0.3,
          system:buildPrompt(lang, ageGroup),
          messages:[{role:"user",content:`Student assessment responses:\n${lines.join("\n")}`}],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content||[]).map(b=>b.text||"").join("");
      const m = raw.replace(/```json|```/g,"").match(/\{[\s\S]*\}/);
      if (!m) throw new Error("No JSON found");
      setProfile(JSON.parse(m[0]));
      setPhase("gate");
    } catch(e) {
      console.error(e);
      setPhase("error");
    }
  };

  const submitGate = () => {
    const zh = lang === "zh";
    if (!name.trim()) {
      setEmailErr(zh ? "请输入你的名字" : "Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setEmailErr(zh ? "请输入有效邮箱" : "Please enter a valid email");
      return;
    }
    setEmailErr("");
    // Auto-notify counselor via EmailJS
    sendLeadNotification(name, email, profile, lang);
    setPhase("result");
    setTab("summary");
  };

  const sendLeadNotification = (studentName, studentEmail, P, lang) => {
    if (!P) return;
    const zh = lang === "zh";
    const summary = [
      `新学生测评完成 — ${new Date().toLocaleString("zh-CN")}`,
      ``,
      `姓名: ${studentName}`,
      `邮箱: ${studentEmail}`,
      ``,
      `【${P.snap?.personality || ""}】`,
      `${P.snap?.tagline || ""}`,
      ``,
      `思维风格: ${P.snap?.thinkingStyle || ""}`,
      `核心驱动: ${P.snap?.motivation || ""}`,
      ``,
      `核心洞察:`,
      P.summary?.headline || "",
      ``,
      `专业方向匹配:`,
      ...(P.majors||[]).map(m => `  ${m.name} — ${m.fit}%`),
      ``,
      `近期行动计划:`,
      ...(P.next?.month||[]).map(s => `  → ${s}`),
      ``,
      `顾问备注:`,
      P.summary?.counselorNote || "",
      ``,
      `—— StarPath AI · by StarWise`,
    ].join("\n");

    // Lead 写入 Sheets：no-cors fetch，不受 CORS 限制
    const params = new URLSearchParams({
      name:          studentName,
      email:         studentEmail,
      grade:         P.snap?.grade || "",
      school:        P.snap?.schoolType || "",
      archetype:     P.snap?.archetype || "",
      motivation:    (P.snap?.motivation || "").slice(0, 200),
      major1:        P.majors?.[0]?.name || "",
      major2:        P.majors?.[1]?.name || "",
      counselorNote: (P.summary?.counselorNote || "").slice(0, 300),
      parentPhone:   parentPhone || "",
    });
    fetch("https://script.google.com/macros/s/AKfycbxfX4wPoLml4SffUSibaL63thjje2ykdXU0B358-ROjFmBOku-fm1wOA3yktFHeWTIL/exec?" + params.toString(), { method: "GET", mode: "no-cors" }).catch(() => {});
  };

  // Build plain-text report summary for clipboard / email
  const buildReportText = (P, t, lang) => {
    if (!P) return "";
    const zh = lang === "zh";
    const lines = [];
    lines.push("═══════════════════════════════");
    lines.push(`STARPATH AI — ${t.rptTitle}`);
    if (name) lines.push(`${zh?"学生":"Student"}: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (parentPhone) lines.push(`${zh?"家长手机":"Parent Phone"}: ${parentPhone}`);
    lines.push("═══════════════════════════════");
    lines.push("");
    lines.push(`【${P.snap?.personality}】`);
    lines.push(P.snap?.tagline || "");
    lines.push(`${zh?"思维风格":"Thinking Style"}: ${P.snap?.thinkingStyle}`);
    lines.push(`${zh?"核心驱动":"Motivation"}: ${P.snap?.motivation}`);
    lines.push("");
    lines.push(`▌${t.lInsight}`);
    lines.push(P.summary?.headline || "");
    lines.push(P.summary?.keyInsight || "");
    lines.push("");
    lines.push(`▌${t.lMajors}`);
    (P.majors||[]).forEach(m => lines.push(`  ${m.name} — ${m.fit}%`));
    lines.push("");
    lines.push(`▌${t.lNextMonth}`);
    (P.next?.month||[]).forEach(s => lines.push(`  → ${s}`));
    lines.push("");
    lines.push(`▌${zh?"申请前最关键":"Key Priority"}`);
    lines.push(`  ${P.next?.key || ""}`);
    lines.push("");
    lines.push(`▌${t.lEcAssess}`);
    lines.push(P.ec?.assessment || "");
    lines.push(`${zh?"叙事主线":"Narrative"}: ${P.ec?.narrative || ""}`);
    lines.push("");
    lines.push(`▌${zh?"顾问备注":"Counselor Note"}`);
    lines.push(P.summary?.counselorNote || "");
    lines.push("");
    lines.push("───────────────────────────────");
    lines.push(`Generated by StarWise International`);
    return lines.join("\n");
  };

  const doSend = () => {
    if (!profile) return;
    if (sendMode === "own" && !cEmail.includes("@")) return;
    if (sending) return;
    setSending(true);
    const reportText = buildReportText(profile, t, lang);
    const subject = encodeURIComponent(`[StarPath] ${profile.snap?.personality||""}${name ? " · " + name : ""}`);
    const body = encodeURIComponent((note ? note + "\n\n" : "") + reportText);
    const to = sendMode === "own" ? encodeURIComponent(cEmail) : encodeURIComponent("info@starwise-edu.com");
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;
    // window.location.href works on both desktop and mobile
    window.open(mailtoUrl, '_self');
    setTimeout(() => { setSending(false); setSent(true); }, 1000);
  };

  const copyLink = () => {
    if (!profile) return;
    const reportText = buildReportText(profile, t, lang);
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback: create textarea
      const ta = document.createElement("textarea");
      ta.value = reportText;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // JSONP — script标签加载，Safari/Chrome/手机全兼容，无CORS问题
  const jsonpCall = (url) => new Promise((resolve, reject) => {
    const cbName = 'cb' + Date.now();
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timeout'));
    }, 15000);
    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }
    window[cbName] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('load error')); };
    script.src = url + '&callback=' + cbName;
    document.head.appendChild(script);
  });

  const shareReport = async () => {
    if (!profile || shareLoading) return;
    setShareLoading(true);
    const zh2 = lang === "zh";
    const archetype = profile.snap?.archetype || profile.snap?.personality || "";
    const top1 = profile.majors?.[0]?.name || "";
    const baseUrl = window.location.href.split('#')[0].split('?')[0];

    // 保存完整报告到 GAS → 返回 8 字符 ID → 链接约 42 字符
    let reportUrl;
    try {
      const payload = JSON.stringify({ p: profile, n: name, l: lang });
      const url = "https://script.google.com/macros/s/AKfycbxfX4wPoLml4SffUSibaL63thjje2ykdXU0B358-ROjFmBOku-fm1wOA3yktFHeWTIL/exec?action=save&data=" + encodeURIComponent(payload);
      const json = await jsonpCall(url);
      if (json.ok && json.id) {
        reportUrl = baseUrl + '#id=' + json.id;
      } else {
        throw new Error('no id');
      }
    } catch(e) {
      setShareLoading(false);
      alert(zh2 ? '生成链接失败，请下载报告后分享。' : 'Failed to generate link, please download the report to share.');
      return;
    }

    const msg = zh2
      ? '我的星途成长报告 🌟\n成长原型：「' + archetype + '」｜最匹配方向：' + top1 + '\n\n👇 点击查看完整报告\n' + reportUrl
      : 'My StarPath Report 🌟\nArchetype: ' + archetype + ' | Top match: ' + top1 + '\n\n👇 View full report\n' + reportUrl;

    // Safari 在 async/await 后无法自动写剪贴板
    // 直接显示弹窗，用户点"复制"按钮（真实用户手势）100% 可靠
    setShareLoading(false);
    showCopyModal(msg, zh2);
  };

  // 页面内复制弹窗（手机无法自动复制时显示）
  const showCopyModal = (text, isZh) => {
    // 从 text 里提取 URL（最后一行）
    const lines = text.trim().split('\n');
    const url = lines[lines.length - 1].trim();

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

    const box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:20px;padding:28px 24px;width:100%;max-width:380px;font-family:Nunito,sans-serif;';

    const title = document.createElement('div');
    title.style.cssText = 'font-size:16px;font-weight:800;color:#1A3A2A;margin-bottom:4px;';
    title.textContent = isZh ? '分享我的成长报告' : 'Share My Report';

    const subtitle = document.createElement('div');
    subtitle.style.cssText = 'font-size:12px;color:rgba(26,58,42,.45);margin-bottom:20px;';
    subtitle.textContent = isZh ? '扫码或复制链接，无需登录即可查看' : 'Scan QR or copy link — no login needed';

    // 二维码容器
    const qrWrap = document.createElement('div');
    qrWrap.style.cssText = 'display:flex;justify-content:center;margin-bottom:16px;';
    const qrDiv = document.createElement('div');
    qrDiv.id = 'qr-canvas-wrap';
    qrDiv.style.cssText = 'background:#f8f8f4;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;width:160px;height:160px;';
    qrDiv.innerHTML = '<div style="font-size:11px;color:rgba(26,58,42,.3);">生成中…</div>';
    qrWrap.appendChild(qrDiv);

    // 链接显示
    const urlBox = document.createElement('div');
    urlBox.style.cssText = 'background:#f5f9f3;border:1px solid rgba(45,90,61,.15);border-radius:10px;padding:10px 14px;font-size:11px;color:#2D5A3D;font-weight:700;word-break:break-all;margin-bottom:14px;text-align:center;font-family:monospace;';
    urlBox.textContent = url;

    // 文字内容（隐藏的 textarea 用于复制）
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';

    // 按钮行
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;';

    const copyBtn = document.createElement('button');
    copyBtn.style.cssText = 'flex:1;background:#2D5A3D;color:#fff;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:Nunito,sans-serif;transition:background .2s;';
    copyBtn.textContent = isZh ? '📋 复制链接' : '📋 Copy Link';
    copyBtn.onclick = () => {
      document.body.appendChild(textarea);
      textarea.select(); textarea.setSelectionRange(0, 999999);
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(textarea);
      copyBtn.style.background = '#4A8C5C';
      copyBtn.textContent = isZh ? '✓ 已复制！' : '✓ Copied!';
      setTimeout(() => {
        copyBtn.style.background = '#2D5A3D';
        copyBtn.textContent = isZh ? '📋 复制链接' : '📋 Copy Link';
      }, 2500);
    };

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'padding:13px 16px;background:#f5f5f0;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:Nunito,sans-serif;color:#555;';
    closeBtn.textContent = isZh ? '关闭' : 'Close';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    btnRow.appendChild(copyBtn);
    btnRow.appendChild(closeBtn);

    box.appendChild(title);
    box.appendChild(subtitle);
    box.appendChild(qrWrap);
    box.appendChild(urlBox);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    overlay.onclick = (e) => { if (e.target === overlay) document.body.removeChild(overlay); };
    document.body.appendChild(overlay);

    // 加载 qrcode.js 并生成二维码
    const loadQR = () => {
      if (window.QRCode) {
        qrDiv.innerHTML = '';
        new window.QRCode(qrDiv, {
          text: url,
          width: 136,
          height: 136,
          colorDark: '#1A3A2A',
          colorLight: '#f8f8f4',
          correctLevel: window.QRCode.CorrectLevel.M,
        });
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => {
          qrDiv.innerHTML = '';
          new window.QRCode(qrDiv, {
            text: url,
            width: 136,
            height: 136,
            colorDark: '#1A3A2A',
            colorLight: '#f8f8f4',
            correctLevel: window.QRCode.CorrectLevel.M,
          });
        };
        document.head.appendChild(script);
      }
    };
    loadQR();
  };

  const downloadPDF = () => {
    if (!profile) return;
    setDownloading(true);
    const P = profile;
    const zh = lang === "zh";
    const studentName = name || (zh ? "学生" : "Student");
    const docTitle = `${studentName}-StarPath-Report`;

    // Build SVG radar chart
    const radarData = P.radar ? [
      { label: zh?"学术好奇心":"Academic Curiosity", val: P.radar.academicCuriosity||0 },
      { label: zh?"分析能力":"Analytical Strength",  val: P.radar.analyticalStrength||0 },
      { label: zh?"创造力":"Creativity",             val: P.radar.creativity||0 },
      { label: zh?"社会影响力":"Social Impact",       val: P.radar.socialImpactDrive||0 },
      { label: zh?"领导力":"Leadership",             val: P.radar.leadership||0 },
    ] : [];

    const buildRadarSVG = (items) => {
      const cx=200, cy=185, r=110, n=items.length;
      const angle = (i) => (Math.PI*2*i/n) - Math.PI/2;
      const pt = (i, scale) => [
        cx + Math.cos(angle(i)) * r * scale,
        cy + Math.sin(angle(i)) * r * scale
      ];
      const rings = [0.25,0.5,0.75,1].map(s =>
        items.map((_,i)=>pt(i,s)).map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+'Z'
      );
      const poly = items.map((d,i)=>pt(i,d.val/100)).map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+'Z';
      const axes = items.map((_,i) => {
        const [x,y] = pt(i,1);
        return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(26,58,42,0.12)" stroke-width="1"/>`;
      });
      const dots = items.map((d,i) => {
        const [x,y] = pt(i,d.val/100);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#6AAF3D" stroke="white" stroke-width="2"/>`;
      });
      const labels = items.map((d,i) => {
        const [x,y] = pt(i,1.32);
        const anchor = x < cx-8 ? 'end' : x > cx+8 ? 'start' : 'middle';
        return `<text x="${x.toFixed(1)}" y="${(y-6).toFixed(1)}" text-anchor="${anchor}" font-size="10" font-weight="700" fill="rgba(26,58,42,0.55)" font-family="sans-serif">${d.label}</text>
                <text x="${x.toFixed(1)}" y="${(y+8).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="800" fill="#6AAF3D" font-family="sans-serif">${d.val}</text>`;
      });
      return `<svg width="400" height="370" viewBox="0 0 400 370" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#6AAF3D" stop-opacity="0.2"/><stop offset="100%" stop-color="#6AAF3D" stop-opacity="0.03"/></radialGradient></defs>
        ${rings.map(d=>`<path d="${d}" fill="none" stroke="rgba(26,58,42,0.08)" stroke-width="1"/>`).join('')}
        ${axes.join('')}
        <path d="${poly}" fill="url(#rg)" stroke="#6AAF3D" stroke-width="2"/>
        ${dots.join('')}
        ${labels.join('')}
      </svg>`;
    };

    // Build bar chart SVG for majors
    const buildBarSVG = (majors) => {
      const w=340, barH=22, gap=10, padL=140, padR=60;
      const totalH = majors.length * (barH+gap) + 20;
      const bars = majors.map((m,i) => {
        const y = 10 + i*(barH+gap);
        const barW = ((w-padL-padR) * m.fit/100);
        const clr = m.fit>=85 ? '#6AAF3D' : m.fit>=75 ? '#82C455' : '#A3C97A';
        return `
          <text x="${padL-8}" y="${y+barH*0.7}" text-anchor="end" font-size="11" font-weight="700" fill="#1A3A2A" font-family="sans-serif">${m.name}</text>
          <rect x="${padL}" y="${y}" width="${w-padL-padR}" height="${barH}" rx="4" fill="rgba(26,58,42,0.06)"/>
          <rect x="${padL}" y="${y}" width="${barW.toFixed(1)}" height="${barH}" rx="4" fill="${clr}"/>
          <text x="${padL+barW+6}" y="${y+barH*0.7}" font-size="11" font-weight="800" fill="${clr}" font-family="sans-serif">${m.fit}%</text>
        `;
      });
      return `<svg width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}" xmlns="http://www.w3.org/2000/svg">${bars.join('')}</svg>`;
    };

    const strengths = (P.snap?.strengths||[]).map(s => typeof s === 'object' ? s : {name:s,desc:''});
    const radarSVG = buildRadarSVG(radarData);
    const barSVG = buildBarSVG(P.majors||[]);

    const html = `<!DOCTYPE html>
<html lang="${zh?"zh":"en"}">
<head>
<meta charset="UTF-8"/>
<title>${docTitle}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Nunito',sans-serif;background:#fff;color:#1E2B1E;}
@page{margin:${zh?'11mm 13mm':'12mm 15mm'};size:A4;}

/* HEADER */
.header{background:#1A3A2A;padding:11px 22px;display:flex;align-items:center;gap:11px;}
.logo{width:30px;height:30px;flex-shrink:0;}
.brand{font-size:12px;font-weight:800;letter-spacing:3px;color:#fff;flex:1;}
.report-date{font-size:8px;color:rgba(255,255,255,.4);letter-spacing:1px;}

/* HERO */
.hero{padding:${zh?'10px 22px 9px':'12px 22px 10px'};border-bottom:2px solid #EAF2E5;}
.badge{display:inline-block;padding:2px 9px;border-radius:20px;background:rgba(106,175,61,.1);border:1px solid rgba(106,175,61,.28);font-size:${zh?'8px':'7.5px'};font-weight:800;color:#2D5A3D;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:${zh?'4px':'5px'};}
.meta{font-size:9px;color:#6AAF3D;font-weight:700;letter-spacing:1px;margin-bottom:3px;}
.personality{font-family:'Playfair Display',serif;font-size:${zh?'19px':'18px'};color:#1A3A2A;margin-bottom:4px;line-height:1.2;}
.tagline{font-size:${zh?'10px':'9.5px'};color:#6B7B6B;line-height:${zh?'1.65':'1.7'};margin-bottom:3px;}
.motivation{font-size:${zh?'9.5px':'9px'};color:#6B7B6B;font-style:italic;line-height:1.55;}

/* SECTIONS */
.S{padding:${zh?'8px 22px':'9px 22px'};border-bottom:1px solid #EAF2E5;break-inside:avoid;page-break-inside:avoid;}
.lbl{font-size:7px;letter-spacing:2.5px;text-transform:uppercase;color:#6AAF3D;font-weight:800;margin-bottom:7px;}
.body{font-size:${zh?'10.5px':'10px'};line-height:${zh?'1.8':'1.85'};color:#1E2B1E;}
.hi{background:#F5F9F3;border-left:3px solid #6AAF3D;padding:7px 11px;margin-top:7px;font-size:${zh?'10px':'9.5px'};line-height:1.75;color:#1E2B1E;border-radius:0 5px 5px 0;}

/* RADAR + STRENGTHS — Chinese: side by side, English: radar full then strengths */
.rc{display:grid;grid-template-columns:${zh?'185px 1fr':'175px 1fr'};gap:14px;padding:${zh?'8px 22px':'9px 22px'};border-bottom:1px solid #EAF2E5;break-inside:avoid;page-break-inside:avoid;align-items:start;}
.sr{display:flex;gap:7px;padding:4px 0;border-bottom:1px solid rgba(26,58,42,.05);align-items:flex-start;}
.si{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;font-weight:900;}
.sn{font-size:${zh?'10px':'9.5px'};font-weight:800;color:#1A3A2A;margin-bottom:1px;}
.sd{font-size:${zh?'9px':'8.5px'};color:#6B7B6B;line-height:1.5;}
.gbox{padding:7px 9px;background:rgba(212,119,6,.04);border-radius:5px;border:1px solid rgba(212,119,6,.1);font-size:${zh?'9.5px':'9px'};color:#6B7B6B;line-height:1.6;margin-top:7px;}

/* 2-COL EQUAL */
.eq2{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:${zh?'8px 22px':'9px 22px'};border-bottom:1px solid #EAF2E5;break-inside:avoid;page-break-inside:avoid;}
.di{padding:4px 7px;border-radius:5px;background:rgba(59,130,246,.05);border:1px solid rgba(59,130,246,.12);font-size:${zh?'10px':'9.5px'};font-weight:700;color:#1A3A2A;display:flex;align-items:center;gap:5px;margin-bottom:3px;}
.br{margin-bottom:5px;}
.bl{font-size:${zh?'10px':'9.5px'};font-weight:700;color:#1A3A2A;margin-bottom:2px;}
.bt{height:4px;border-radius:2px;background:rgba(26,58,42,.07);overflow:hidden;}
.bf{height:100%;border-radius:2px;}
.bp{font-size:8.5px;font-weight:800;color:#6AAF3D;text-align:right;margin-top:1px;}

/* ACTIONS */
.ar{display:flex;gap:5px;margin-bottom:4px;align-items:flex-start;}
.aw{color:#6AAF3D;font-weight:900;font-size:10px;flex-shrink:0;margin-top:1px;}
.kb{background:rgba(106,175,61,.07);border:1px solid rgba(106,175,61,.18);border-radius:5px;padding:6px 9px;margin-top:6px;}
.kl{font-size:6.5px;font-weight:800;color:#6AAF3D;letter-spacing:2px;margin-bottom:3px;}
.kt{font-size:${zh?'10px':'9.5px'};font-weight:700;color:#1A3A2A;line-height:1.6;}

/* COUNSELOR */
.cb{background:#1A3A2A;border-radius:7px;padding:9px 13px;}
.cl{font-size:6.5px;font-weight:800;color:#82C455;letter-spacing:2px;margin-bottom:4px;}
.ct{font-size:${zh?'10px':'9.5px'};color:rgba(255,255,255,.8);line-height:1.75;}

.footer{padding:9px 22px;background:#F5F9F3;display:flex;align-items:center;justify-content:space-between;}
.fb{font-size:9px;font-weight:800;color:#1A3A2A;letter-spacing:2px;}
.fi{font-size:7.5px;color:#6B7B6B;}
</style>
</head>
<body>

<div class="header">
  <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#6AAF3D"/>
    <polygon points="50,20 84,35 50,50 16,35" fill="white"/>
    <path d="M30,40 L30,59 C30,68 39,74 50,74 C61,74 70,68 70,59 L70,40 L50,50 Z" fill="white"/>
    <rect x="80" y="35" width="3.5" height="22" rx="1.5" fill="white"/>
    <polygon points="81.5,60 84,66 90,66 85,70 87,76 81.5,72 76,76 78,70 73,66 79,66" fill="white"/>
  </svg>
  <div class="brand">STARPATH FINDER</div>
  <div class="report-date">${zh?"星途成长报告":"Growth Profile Report"} · ${new Date().toLocaleDateString(zh?'zh-CN':'en-US')}</div>
</div>

<div class="hero">
  ${P.snap?.archetype?`<div class="badge">${P.snap.archetype}</div>`:''}
  ${name?`<div class="meta">${name} · ${t.grade(P.snap?.grade||'')} · ${t.school(P.snap?.schoolType||'')}</div>`:''}
  <div class="personality">${P.snap?.personality||''}</div>
  <div class="tagline">${P.snap?.tagline||''}</div>
  <div class="motivation">${P.snap?.motivation||''}</div>
</div>

<!-- RADAR + STRENGTHS -->
<div class="rc">
  <div>
    <div class="lbl">${zh?"五维能力画像":"Capability Profile"}</div>
    ${(()=>{
      const W=zh?175:165, H=zh?185:175;
      const cx=W/2, cy=H/2-5, r=zh?68:62;
      const items=radarData, n=items.length;
      const angle=(i)=>(Math.PI*2*i/n)-Math.PI/2;
      const pt=(i,s)=>[cx+Math.cos(angle(i))*r*s, cy+Math.sin(angle(i))*r*s];
      const rings=[0.33,0.67,1].map(s=>items.map((_,i)=>pt(i,s)).map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+'Z');
      const poly=items.map((d,i)=>pt(i,d.val/100)).map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')+'Z';
      const axes=items.map((_,i)=>{const[x,y]=pt(i,1);return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(26,58,42,0.1)" stroke-width="0.8"/>`;});
      const dots=items.map((d,i)=>{const[x,y]=pt(i,d.val/100);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#6AAF3D" stroke="white" stroke-width="1.2"/>`;});
      const lblSize=zh?8:7.5;
      const lblScale=1.42;
      const labels=items.map((d,i)=>{
        const[x,y]=pt(i,lblScale);
        const anchor=x<cx-5?'end':x>cx+5?'start':'middle';
        return `<text x="${x.toFixed(1)}" y="${(y-4).toFixed(1)}" text-anchor="${anchor}" font-size="${lblSize}" font-weight="700" fill="rgba(26,58,42,0.5)" font-family="sans-serif">${d.label}</text>
                <text x="${x.toFixed(1)}" y="${(y+7).toFixed(1)}" text-anchor="${anchor}" font-size="${lblSize+1.5}" font-weight="800" fill="#6AAF3D" font-family="sans-serif">${d.val}</text>`;
      });
      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="rg3"><stop offset="0%" stop-color="#6AAF3D" stop-opacity="0.18"/><stop offset="100%" stop-color="#6AAF3D" stop-opacity="0.03"/></radialGradient></defs>
        ${rings.map(d=>`<path d="${d}" fill="none" stroke="rgba(26,58,42,0.07)" stroke-width="0.8"/>`).join('')}
        ${axes.join('')}
        <path d="${poly}" fill="url(#rg3)" stroke="#6AAF3D" stroke-width="1.5"/>
        ${dots.join('')}${labels.join('')}
      </svg>`;
    })()}
  </div>
  <div>
    <div class="lbl">${zh?"三大核心优势":"Core Strengths"}</div>
    ${strengths.map((s,i)=>`
      <div class="sr">
        <div class="si" style="background:${['rgba(106,175,61,.12)','rgba(59,130,246,.12)','rgba(212,119,6,.12)'][i%3]};color:${['#6AAF3D','#3B82F6','#D97706'][i%3]};">${['✦','◈','◉'][i]}</div>
        <div><div class="sn">${s.name||s}</div><div class="sd">${s.desc||''}</div></div>
      </div>`).join('')}
    <div class="lbl" style="margin-top:9px;">${zh?"成长提示":"Growth Area"}</div>
    <div class="gbox">${P.summary?.watchOut||''}</div>
  </div>
</div>

<!-- KEY INSIGHT -->
<div class="S">
  <div class="lbl">${zh?"核心洞察":"Key Insight"}</div>
  <div class="body">${P.summary?.headline||''}</div>
  <div class="hi">${P.summary?.keyInsight||''}</div>
</div>

<!-- ACADEMIC DIRECTIONS + MAJOR MATCHES -->
<div class="eq2">
  <div>
    <div class="lbl">${zh?"潜在学术方向":"Academic Directions"}</div>
    ${(P.academic?.directions||P.academic?.domains||[]).map(d=>`<div class="di"><span style="color:#3B82F6;font-size:9px;">◈</span>${d}</div>`).join('')}
  </div>
  <div>
    <div class="lbl">${zh?"专业方向匹配":"Major Matches"}</div>
    ${(P.majors||[]).map(m=>`
      <div class="br">
        <div class="bl">${m.name}</div>
        <div class="bt"><div class="bf" style="width:${m.fit}%;background:${m.fit>=85?'#6AAF3D':m.fit>=75?'#82C455':'#A3C97A'};"></div></div>
        <div class="bp">${m.fit}%</div>
      </div>`).join('')}
  </div>
</div>

<!-- ACTION PLAN -->
<div class="S">
  <div class="lbl">${zh?"近期行动计划":"Action Plan"}</div>
  ${(P.next?.month||[]).map(s=>`<div class="ar"><span class="aw">→</span><span style="font-size:${zh?'10px':'9.5px'};line-height:1.7;color:#1E2B1E;">${s}</span></div>`).join('')}
  ${P.next?.key?`<div class="kb"><div class="kl">✦ ${zh?"最关键一步":"KEY PRIORITY"}</div><div class="kt">${P.next.key}</div></div>`:''}
</div>

<!-- COUNSELOR NOTE -->
<div class="S">
  <div class="lbl">${zh?"顾问专属备注":"Counselor Note"}</div>
  <div class="cb">
    <div class="cl">${zh?"学生画像摘要":"STUDENT PROFILE SUMMARY"}</div>
    <div class="ct">${P.summary?.counselorNote||''}</div>
  </div>
</div>

<div class="footer">
  <div class="fb">STARPATH FINDER</div>
  <div class="fi">Generated by StarWise International · +1 (626) 725-6474 · ${new Date().toLocaleDateString(zh?'zh-CN':'en-US')}</div>
</div>

<div id="pbar" style="position:fixed;bottom:0;left:0;right:0;background:#1A3A2A;padding:9px 20px;display:flex;align-items:center;justify-content:space-between;z-index:999;">
  <span style="color:rgba(255,255,255,.5);font-size:10px;font-family:sans-serif;">${docTitle}</span>
  <div style="display:flex;gap:7px;">
    <button onclick="window.print()" style="background:#6AAF3D;color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:11px;font-weight:700;cursor:pointer;font-family:sans-serif;">${zh ? '下载 / 打印 PDF' : 'Download / Print PDF'}</button>
    <button id="pdfShareBtn" onclick="
      var btn = this;
      var url = window._reportUrl || (window.opener && window.opener.location && window.opener.location.href) || '';
      if (!url) { btn.textContent = '${zh ? "生成中…" : "Generating…"}'; return; }
      var prefix = '${zh ? "我的星途成长报告 🌟\n点击查看完整报告：" : "My StarPath Report 🌟\nView here: "}';
      var ta = document.createElement('textarea');
      ta.value = prefix + url;
      ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
      document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, 99999);
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta);
      btn.style.background = '#4A8C5C';
      btn.textContent = '${zh ? "✓ 已复制" : "✓ Copied"}';
      setTimeout(function(){ btn.style.background = 'rgba(255,255,255,.1)'; btn.textContent = '${zh ? "🔗 分享" : "🔗 Share"}'; }, 2500);
    " style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.25);border-radius:6px;padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:sans-serif;">${zh ? '🔗 分享' : '🔗 Share'}</button>
    <button onclick="document.getElementById('pbar').style.display='none'" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);border:none;border-radius:6px;padding:7px 11px;font-size:11px;cursor:pointer;font-family:sans-serif;">✕</button>
  </div>
</div>
<style>@media print{#pbar{display:none!important;}}body{padding-bottom:48px;}</style>
<script>document.title="${docTitle}";</script>
</body></html>`;

    // 用 iframe 在当前页面内全屏显示报告 — Safari 100% 兼容，不需要弹窗权限
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    const overlay = document.createElement('div');
    overlay.id = 'pdf-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff;display:flex;flex-direction:column;';

    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'background:#1A3A2A;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
    toolbar.innerHTML = '<span style="color:rgba(255,255,255,.6);font-size:12px;font-family:sans-serif;">' + docTitle + '</span>'
      + '<div style="display:flex;gap:8px;">'
      + '<button onclick="window.frames[\'pdf-frame\'].print()" style="background:#6AAF3D;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:sans-serif;">'
      + (zh ? '打印 / 保存 PDF' : 'Print / Save PDF') + '</button>'
      + '<button onclick="document.getElementById(\'pdf-overlay\').remove();URL.revokeObjectURL(\''+blobUrl+'\');" style="background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:6px;padding:7px 12px;font-size:12px;cursor:pointer;font-family:sans-serif;">✕ ' + (zh ? '关闭' : 'Close') + '</button>'
      + '</div>';

    const iframe = document.createElement('iframe');
    iframe.name = 'pdf-frame';
    iframe.src = blobUrl;
    iframe.style.cssText = 'flex:1;border:none;width:100%;';

    overlay.appendChild(toolbar);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
    setDownloading(false);
  };

  const resetAll = () => {
    setPhase("intro"); setQi(0); setAns({}); setProfile(null);
    setTab("summary"); setMajI(0); setEcI(0);
    setSendMode(null); setSent(false); setCEmail(""); setNote("");
  };

  const [switching, setSwitching] = useState(false);

  const switchLang = async () => {
    const newLang = lang === "zh" ? "en" : "zh";
    setSwitching(true);
    setLang(newLang);
    setPhase("gen");
    setTab("summary");
    setProfile(null);
    const lines = [];
    const QSnew = buildQ(newLang);
    const secsSeen = new Set();
    for (const q of QSnew) {
      const a = ans[q.id];
      if (!a) continue;
      if (!secsSeen.has(q.sec)) { lines.push("\n[" + q.secLabel + "]"); secsSeen.add(q.sec); }
      lines.push("Q: " + q.text);
      if (q.type === "choice") lines.push("A: " + (q.opts?.find(o=>o.v===a)?.l||a));
      else if (q.type === "multi") lines.push("A: " + (a||[]).map(v=>q.opts?.find(o=>o.v===v)?.l||v).join(", "));
      else if (q.type === "scale") lines.push("A: " + a + "/10");
      else lines.push("A: " + a);
    }
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          temperature: 0.3,
          system: buildPrompt(newLang, getAgeGroup(ans['pr1'])),
          messages: [{role:"user", content:"Student assessment responses:\n" + lines.join("\n")}],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content||[]).map(b=>b.text||"").join("");
      const clean = raw.replace(/```json|```/g, "");
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON");
      setProfile(JSON.parse(jsonMatch[0]));
      setPhase("result");
    } catch(e) {
      console.error(e);
      setPhase("error");
    } finally {
      setSwitching(false);
    }
  };

  const secColor = cq?.secColor || G.green;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <button className="lbtn" onClick={()=>setLang(l=>l==="zh"?"en":"zh")}>{t.lang}</button>

      {/* BG blobs */}
      {[[G.green,"−10%","−10%"],[G.greenLt,"80%","5%"],[G.sage,"35%","88%"]].map(([c,x,y],i)=>(
        <div key={i} style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:c,opacity:.04,filter:"blur(120px)",left:x,top:y,pointerEvents:"none"}}/>
      ))}

      <div className="anim-float" style={{marginBottom:22}}>
        <div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",boxShadow:`0 14px 36px ${G.green}45`}}><StarWiseLogo size={64}/></div>
      </div>

      <p style={{fontSize:10,letterSpacing:4,color:G.green,fontWeight:800,marginBottom:22,textTransform:"uppercase"}}>{t.brand}</p>
      

      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5.5vw,52px)",fontWeight:400,textAlign:"center",lineHeight:1.18,marginBottom:14,color:G.greenDk}}>
        {t.tagline}
      </h1>
      <p style={{fontSize:14,color:G.muted,maxWidth:360,textAlign:"center",lineHeight:2,marginBottom:36,whiteSpace:"pre-line"}}>{t.subtitle}</p>

      {/* Section pills */}
      <div style={{display:"flex",gap:7,marginBottom:36,flexWrap:"wrap",justifyContent:"center"}}>
        {SECS_.map(s=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:20,background:`${s.color}0D`,border:`1px solid ${s.color}22`,fontSize:11,color:G.greenDk,fontWeight:700}}>
            {s.emoji} {s.label}
          </div>
        ))}
      </div>

      <button className="gbtn" onClick={()=>setPhase("quiz")}
        style={{background:G.green,color:"#fff",padding:"14px 40px",fontSize:15,boxShadow:`0 10px 32px ${G.green}38`,marginBottom:12}}>
        {t.start}
      </button>
      <p style={{fontSize:11,opacity:.3,letterSpacing:.5,fontWeight:600}}>{t.startNote}</p>
    </div>
  );

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (phase === "quiz" && cq) {
    const progress = (safeQi / TOTAL) * 100;
    const handleTouchStart = (e) => { window._touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - (window._touchStartX||0);
      if (Math.abs(dx) < 50) return;
      if (dx < 0 && ok()) { next(); }
      else if (dx > 0 && qi > 0) { setAnimK(k=>k+1); setQi(qi-1); }
    };
    return (
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
        style={{minHeight:"100vh",background:G.cream,fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS}</style>
        <button className="lbtn" onClick={()=>setLang(l=>l==="zh"?"en":"zh")}>{t.lang}</button>

        {/* Sticky header */}
        <div style={{position:"sticky",top:0,background:"rgba(245,249,243,.96)",backdropFilter:"blur(14px)",zIndex:10,borderBottom:"1px solid rgba(26,58,42,.06)"}}>
          <div style={{maxWidth:580,margin:"0 auto",padding:"14px 20px 0"}}>
            {/* Section tabs */}
            <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:10}}>
              {SECS_.map(s=>{
                const qs = QS.filter(q=>q.sec===s.id);
                const firstI = QS.findIndex(q=>q.sec===s.id);
                const lastI  = firstI + qs.length - 1;
                const isActive = qi >= firstI && qi <= lastI;
                const isDone   = qi > lastI;
                return (
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:20,background:isDone?"rgba(106,175,61,.1)":isActive?`${s.color}10`:"rgba(26,58,42,.04)",border:`1px solid ${isDone?G.green+"44":isActive?s.color+"30":"transparent"}`,fontSize:11,fontWeight:700,color:isDone?G.green:isActive?s.color:"rgba(26,58,42,.28)",whiteSpace:"nowrap",transition:"all .3s"}}>
                    {isDone?"✓":s.emoji} {s.label}
                  </div>
                );
              })}
            </div>
            {/* Progress bar + 数字 */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{flex:1,height:5,background:"rgba(26,58,42,.07)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",background:`linear-gradient(90deg,${G.green},${G.greenLt})`,width:`${progress}%`,transition:"width .4s cubic-bezier(.16,1,.3,1)",borderRadius:3}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:G.green,minWidth:36,textAlign:"right"}}>{qi+1}/{TOTAL}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12}}>
              <span style={{fontSize:12,color:secColor,fontWeight:700}}>{cq.secEmoji} {cq.secLabel}</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(26,58,42,.06)",color:"rgba(26,58,42,.4)",fontWeight:600}}>
                {ageGroup==="elementary"?(zh?"小学组":"Elementary"):ageGroup==="middle"?(zh?"初中组":"Middle"):zh?"高中组":"High School"}
              </span>
            </div>
          </div>
        </div>

        {/* Question area */}
        <div style={{flex:1,padding:"28px 20px 130px",overflowY:"auto"}}>
          <div key={`q${qi}-${animK}`} className="anim-fade" style={{maxWidth:580,margin:"0 auto"}}>
            <h2 style={{fontSize:"clamp(16px,2.8vw,22px)",fontWeight:700,lineHeight:1.55,marginBottom:24,color:G.greenDk}}>
              {cq.text}
            </h2>

            {/* CHOICE */}
            {cq.type === "choice" && (
              <div style={{display:"grid",gridTemplateColumns:cq.opts.length>=5?"1fr 1fr":"1fr",gap:9}}>
                {cq.opts.map(o=>(
                  <div key={o.v} className={`choice ${ans[cq.id]===o.v?"on":""}`}
                    onClick={()=>{
                      const newAns = {...ans, [cq.id]:o.v};
                      // 年级切换时清空后续答案，防止题库变了但答案不匹配
                      if (cq.id === 'pr1') {
                        const onlyGrade = {pr1: o.v};
                        setAns(onlyGrade);
                      } else {
                        setAns(newAns);
                      }
                    }}>
                    <span style={{fontSize:20}}>{o.e}</span>
                    <span style={{fontSize:13,fontWeight:600,color:ans[cq.id]===o.v?secColor:G.text,flex:1}}>{o.l}</span>
                    {ans[cq.id]===o.v && <span style={{color:secColor,fontWeight:900,fontSize:14}}>✓</span>}
                  </div>
                ))}
              </div>
            )}

            {/* MULTI */}
            {cq.type === "multi" && (
              <div>
                <p style={{fontSize:11,color:secColor,marginBottom:12,fontWeight:800,letterSpacing:.5}}>
                  {(ans[cq.id]||[]).length} / {cq.max} {lang==="zh"?"已选":"selected"}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {cq.opts.map(o=>{
                    const sel = (ans[cq.id]||[]).includes(o.v);
                    const dim = (ans[cq.id]||[]).length >= cq.max && !sel;
                    return (
                      <div key={o.v} className={`mtag ${sel?"on":""} ${dim?"dim":""}`}
                        onClick={()=>{
                          if(dim) return;
                          const cur = ans[cq.id]||[];
                          setAns(p=>({...p,[cq.id]:sel?cur.filter(v=>v!==o.v):[...cur,o.v]}));
                        }}>
                        <span style={{fontSize:16}}>{o.e}</span>
                        <span style={{color:sel?secColor:G.text,flex:1}}>{o.l}</span>
                        {sel && <span style={{color:secColor,fontSize:11,fontWeight:900}}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCALE */}
            {cq.type === "scale" && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:22,gap:16}}>
                  <span style={{fontSize:12,color:G.muted,maxWidth:"44%",lineHeight:1.6,fontWeight:600}}>{cq.leftLabel}</span>
                  <span style={{fontSize:12,color:G.muted,maxWidth:"44%",textAlign:"right",lineHeight:1.6,fontWeight:600}}>{cq.rightLabel}</span>
                </div>
                <div style={{height:5,background:"rgba(26,58,42,.08)",borderRadius:3,position:"relative",cursor:"pointer",margin:"0 6px"}}
                  onClick={e=>{const r=e.currentTarget.getBoundingClientRect();const v=Math.round(((e.clientX-r.left)/r.width)*9)+1;setAns(p=>({...p,[cq.id]:Math.min(10,Math.max(1,v))}));}}>
                  <div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${secColor}55,${secColor})`,width:`${((ans[cq.id]||5)-1)/9*100}%`,transition:"width .1s"}}/>
                  <div style={{width:22,height:22,borderRadius:"50%",background:secColor,position:"absolute",top:"50%",left:`${((ans[cq.id]||5)-1)/9*100}%`,transform:"translate(-50%,-50%)",border:"3px solid #F5F9F3",boxShadow:`0 2px 12px ${secColor}55`,transition:"left .1s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:14,padding:"0 6px"}}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                    <span key={n} onClick={()=>setAns(p=>({...p,[cq.id]:n}))}
                      style={{fontSize:11,fontWeight:800,color:(ans[cq.id]||5)===n?secColor:"rgba(26,58,42,.18)",cursor:"pointer",transition:"color .15s"}}>{n}</span>
                  ))}
                </div>
                <div style={{textAlign:"center",marginTop:12}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:56,color:secColor,lineHeight:1}}>{ans[cq.id]||5}</span>
                  <span style={{fontSize:14,opacity:.25,marginLeft:4}}>/10</span>
                </div>
              </div>
            )}

            {/* OPEN */}
            {cq.type === "open" && (
              <div>
                <div style={{borderRadius:"0 12px 12px 0",background:"#fff",border:`1.5px solid rgba(26,58,42,.1)`,borderLeft:`3px solid ${secColor}`,overflow:"hidden"}}>
                  <textarea ref={taRef} value={ans[cq.id]||""} rows={5}
                    onChange={e=>setAns(p=>({...p,[cq.id]:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&(e.metaKey||e.ctrlKey)&&ok()&&next()}
                    placeholder={cq.ph}
                    style={{width:"100%",background:"transparent",border:"none",color:G.text,fontSize:14,lineHeight:1.9,padding:"15px 17px",resize:"none",outline:"none"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
                  <span style={{fontSize:11,opacity:.18,fontWeight:600}}>⌘↵</span>
                  <span style={{fontSize:11,fontWeight:800,color:charN>=(cq.minChars||20)?G.green:G.muted}}>
                    {t.charLeft(charN, cq.minChars||20)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom nav: 返回 + 进度 + 下一题 */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"linear-gradient(to top,#F5F9F3 80%,transparent)",padding:"16px 20px 24px"}}>
          <div style={{maxWidth:580,margin:"0 auto"}}>
            {/* 进度文字 */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,padding:"0 2px"}}>
              <span style={{fontSize:11,color:safeQi>0?"rgba(26,58,42,.4)":"transparent",fontWeight:600}}>
                {safeQi>0 ? `← ${t.back||"返回"}` : ""}
              </span>
              <span style={{fontSize:11,color:"rgba(26,58,42,.3)",fontWeight:600}}>
                {safeQi+1} / {TOTAL}
              </span>
            </div>
            {/* 按钮行 */}
            <div style={{display:"flex",gap:10}}>
              {safeQi > 0 && (
                <button className="gbtn" onClick={()=>{setAnimK(k=>k+1);setQi(safeQi-1);}}
                  style={{padding:"14px 20px",fontSize:14,background:"rgba(26,58,42,.06)",color:"rgba(26,58,42,.45)",boxShadow:"none",flexShrink:0}}>
                  ←
                </button>
              )}
              <button className="gbtn" disabled={!ok()} onClick={next}
                style={{flex:1,padding:"14px",fontSize:14,background:ok()?G.green:"rgba(26,58,42,.06)",color:ok()?"#fff":"rgba(26,58,42,.18)",boxShadow:ok()?`0 8px 28px ${G.green}38`:"none"}}>
                {safeQi===TOTAL-1 ? t.generate : t.next}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── GENERATING ─────────────────────────────────────────────────────────────
  if (phase === "gen") {
    const genTips = lang==="zh" ? [
      "🔍 正在分析你的兴趣特质…",
      "📊 计算五维能力画像…",
      "🧠 匹配最适合你的成长原型…",
      "🎯 生成专业方向匹配度…",
      "✍️ 撰写你的个性化洞察…",
      "🌟 报告即将完成，稍等片刻…",
    ] : [
      "🔍 Analyzing your interests & traits…",
      "📊 Building your 5-dimension profile…",
      "🧠 Matching your growth archetype…",
      "🎯 Calculating major fit scores…",
      "✍️ Writing your personalized insights…",
      "🌟 Almost done, just a moment…",
    ];
    return (
    <div style={{minHeight:"100vh",background:G.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:"40px 24px"}}>
      <style>{CSS}</style>

      {/* 旋转动画 */}
      <div style={{position:"relative",width:88,height:88}}>
        {[88,62,38].map((s,i)=>(
          <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:s,height:s,margin:`${-s/2}px 0 0 ${-s/2}px`,borderRadius:"50%",border:`2px solid ${[G.green,G.greenLt,G.sage][i]}`,borderTopColor:"transparent",animation:`spin ${1.7+i*.6}s linear infinite ${i%2?"reverse":""}` }}/>
        ))}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:G.green,fontSize:22}}>✦</div>
      </div>

      {/* 当前步骤提示 */}
      <div style={{textAlign:"center",maxWidth:280}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:700,color:G.greenDk,marginBottom:6,minHeight:24}}>
          {genTips[Math.min(loadI, genTips.length-1)]}
        </div>
        <div style={{fontSize:11,color:G.muted,fontFamily:"'Nunito',sans-serif"}}>
          {lang==="zh" ? `AI 正在为你生成个性化报告，通常需要 20–30 秒` : `AI is generating your personalized report, usually 20–30 seconds`}
        </div>
      </div>

      {/* 进度条 */}
      <div style={{width:240,height:4,background:"rgba(26,58,42,.08)",borderRadius:2,overflow:"hidden"}}>
        <div style={{
          height:"100%",
          background:`linear-gradient(90deg,${G.green},${G.greenLt})`,
          borderRadius:2,
          width:`${Math.min((loadI/Math.max(t.loading.length-1,1))*100, 92)}%`,
          transition:"width 1.5s ease"
        }}/>
      </div>

      {/* 步骤点 */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {genTips.map((_,i)=>(
          <div key={i} style={{
            width: i===Math.min(loadI,genTips.length-1) ? 18 : 6,
            height:6,
            borderRadius:3,
            background: i<=loadI ? G.green : "rgba(26,58,42,.12)",
            transition:"all .3s"
          }}/>
        ))}
      </div>

      <div style={{fontSize:9,opacity:.2,letterSpacing:3,fontWeight:800,fontFamily:"'Nunito',sans-serif"}}>STARPATH AI</div>
    </div>
  );
  }

  // ── EMAIL GATE ─────────────────────────────────────────────────────────────
  if (phase === "gate") {
    // launch confetti here too
    if (conf.length===0) {
      const items = Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,color:[G.green,G.greenLt,G.sage,"#A5D873"][i%4],sz:Math.random()*7+4,del:Math.random()*1.2,dur:Math.random()*2+1}));
      setConf(items);
      setTimeout(()=>setConf([]),4000);
    }
    return (
      <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
        <style>{CSS}</style>
        {conf.map(c=>(
          <div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:-10,width:c.sz,height:c.sz,background:c.color,borderRadius:2,animation:`confDrop ${c.dur}s ${c.del}s ease-in both`,zIndex:300,pointerEvents:"none"}}/>
        ))}

        <div className="anim-pop" style={{background:"#fff",borderRadius:22,padding:"36px 32px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(26,58,42,.12)",border:"1px solid rgba(106,175,61,.18)"}}>
          {/* Logo row */}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:22}}>
            <StarWiseLogo size={34}/>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:G.greenDk,letterSpacing:1.5}}>{t.brand}</div>
              
            </div>
          </div>

          <div style={{fontSize:32,marginBottom:10}}>🎉</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:400,color:G.greenDk,marginBottom:8,lineHeight:1.25}}>{t.gateTitle}</h2>
          <p style={{fontSize:13,color:G.muted,lineHeight:1.85,marginBottom:26}}>{t.gateDesc}</p>

          <input className="ifield" type="text" value={name} onChange={e=>setName(e.target.value)}
            placeholder={t.namePH} style={{marginBottom:10}}/>
          <input className="ifield" type="email" value={email}
            onChange={e=>{setEmail(e.target.value);setEmailErr("");}}
            placeholder={t.emailPH} style={{marginBottom:emailErr?4:14}}/>
          {emailErr && <p style={{fontSize:11,color:"#dc2626",marginBottom:10}}>{emailErr}</p>}

          <button className="gbtn" onClick={submitGate}
            style={{width:"100%",padding:"13px",fontSize:14,background:G.green,color:"#fff",marginBottom:10,boxShadow:`0 6px 22px ${G.green}30`}}>
            {t.gateBtn}
          </button>

          <p style={{fontSize:10,color:G.muted,opacity:.45,textAlign:"center",marginTop:12,lineHeight:1.7}}>{t.gateNote}</p>
        </div>
      </div>
    );
  }

  // ── ERROR ───────────────────────────────────────────────────────────────────
  if (phase === "error") return (
    <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
      <style>{CSS}</style>
      <div style={{fontSize:48,marginBottom:16}}>😵</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:400,color:G.greenDk,marginBottom:8}}>{t.errTitle}</h2>
      <p style={{fontSize:13,color:G.muted,marginBottom:28,lineHeight:1.85,maxWidth:300}}>{t.errDesc}</p>
      <button className="gbtn" onClick={generate}
        style={{background:G.green,color:"#fff",padding:"12px 32px",fontSize:14,marginBottom:12}}>
        {t.retry}
      </button>
      <button onClick={()=>{setPhase("quiz");setQi(TOTAL-1);}}
        style={{background:"transparent",border:"none",color:G.muted,fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
        {t.backQ}
      </button>
    </div>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result" && profile) {
    const P  = profile;
    const zh = lang === "zh";
    const TABS = [
      {id:"summary",  label:t.t0, color:G.green},
      {id:"academic", label:t.t1, color:G.blue},
      {id:"growth",   label:t.t2, color:G.amber},
      {id:"send",     label:t.t3, color:G.sage},
    ];

    const Pill = ({children,color=G.green}) => (
      <span className="pill" style={{background:`${color}12`,border:`1px solid ${color}28`,color}}>{children}</span>
    );
    const Bar = ({score,color=G.green}) => (
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div className="bar-wrap" style={{flex:1}}>
          <div className="bar-fill" style={{width:`${score}%`,background:`linear-gradient(90deg,${color}70,${color})`}}/>
        </div>
        <span style={{fontWeight:800,fontSize:12,color,minWidth:30}}>{score}%</span>
      </div>
    );

    return (
      <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'Nunito',sans-serif",color:G.text}}>
        <style>{CSS}</style>
        <button className="lbtn" onClick={switchLang} style={{right:16,top:16,background:"rgba(26,58,42,.06)",border:"1px solid rgba(26,58,42,.12)",color:"rgba(26,58,42,.5)",padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",letterSpacing:.3,position:"fixed",zIndex:200,transition:"all .2s",whiteSpace:"nowrap"}} title={t.switchLang}>{switching?t.switching:t.lang}</button>
        {conf.map(c=>(
          <div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:-10,width:c.sz,height:c.sz,background:c.color,borderRadius:2,animation:`confDrop ${c.dur}s ${c.del}s ease-in both`,zIndex:300,pointerEvents:"none"}}/>
        ))}

        {/* ── Report Hero ── */}
        <div style={{background:"linear-gradient(180deg,rgba(106,175,61,.07) 0%,transparent 100%)",borderBottom:"1px solid rgba(26,58,42,.07)",padding:"52px 20px 30px"}}>
          <div style={{maxWidth:680,margin:"0 auto",textAlign:"center"}}>
            {/* Brand */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}>
              <StarWiseLogo size={28}/>
              <span style={{fontSize:10,fontWeight:800,color:G.greenDk,letterSpacing:2}}>{t.brand}</span>
              <span style={{fontSize:8,color:G.sage,fontWeight:700,letterSpacing:2,opacity:.55}}></span>
            </div>

            {name && (
              <p style={{fontSize:12,color:G.muted,marginBottom:6,fontWeight:600}}>
                {name} · {t.rptTitle}
              </p>
            )}

            {P.snap?.archetype && (
              <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,background:"rgba(106,175,61,.1)",border:"1px solid rgba(106,175,61,.25)",fontSize:11,fontWeight:800,color:G.sage,letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>
                {P.snap.archetype}
              </div>
            )}
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,5vw,44px)",fontWeight:400,lineHeight:1.18,color:G.greenDk,marginBottom:12}}>
              {P.snap?.personality}
            </h1>
            <p style={{fontSize:14,color:G.muted,lineHeight:1.9,maxWidth:500,margin:"0 auto 18px"}}>{P.snap?.tagline}</p>
            <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
              <Pill>{t.grade(P.snap?.grade)}</Pill>
              <Pill>{t.school(P.snap?.schoolType)}</Pill>
            </div>
            <p style={{fontSize:12,color:G.muted,maxWidth:460,margin:"0 auto",lineHeight:1.8,fontWeight:500}}>{P.snap?.motivation}</p>
          </div>
        </div>

        {/* ── Sticky Tabs ── */}
        <div style={{position:"sticky",top:0,background:"rgba(245,249,243,.97)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(26,58,42,.06)",zIndex:50}}>
          <div style={{maxWidth:680,margin:"0 auto",padding:"10px 16px",display:"flex",gap:5,overflowX:"auto"}}>
            {TABS.map(tb=>(
              <button key={tb.id} className="tbtn" onClick={()=>setTab(tb.id)}
                style={{borderColor:tab===tb.id?`${tb.color}40`:"transparent",color:tab===tb.id?tb.color:"rgba(26,58,42,.32)",background:tab===tb.id?`${tb.color}09`:"transparent"}}>
                {tb.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div style={{maxWidth:680,margin:"0 auto",padding:"26px 16px 80px"}}>

          {/* ═══ TAB 1: YOUR PROFILE (Summary) ═══ */}
          {tab === "summary" && (
            <div className="anim-fade">

              {/* 1. Key Insight */}
              <div className="card" style={{borderLeft:`4px solid ${G.green}`}}>
                <div className="sl">{t.lInsight}</div>
                <p style={{fontSize:15,lineHeight:1.9,color:G.greenDk,fontWeight:600,marginBottom:14}}>{P.summary?.headline}</p>
                <div style={{padding:"13px 16px",borderRadius:10,background:"rgba(106,175,61,.05)",border:"1px solid rgba(106,175,61,.15)"}}>
                  <p style={{fontSize:13,lineHeight:1.85,color:G.text}}>{P.summary?.keyInsight}</p>
                </div>
              </div>

              {/* 2. Radar Chart */}
              {P.radar && (() => {
                const axes = t.rAxes;
                const radarKeys = ["academicCuriosity","analyticalStrength","creativity","socialImpactDrive","leadership"];
                const vals = radarKeys.map(k => P.radar[k] || 0);
                const data = axes.map((a,i) => ({ subject: a, value: vals[i], fullMark: 100 }));
                const CustomTooltip = ({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{background:"#fff",border:`1px solid ${G.green}30`,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,color:G.greenDk,boxShadow:"0 4px 16px rgba(26,58,42,.1)"}}>
                      {payload[0].payload.subject}: <span style={{color:G.green}}>{payload[0].value}</span>
                    </div>
                  );
                };
                return (
                  <div className="card" style={{padding:"24px 20px 16px"}}>
                    <div className="sl">{t.lRadar}</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={data} margin={{top:16,right:50,bottom:16,left:50}}>
                        <defs>
                          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={G.green} stopOpacity={0.25}/>
                            <stop offset="100%" stopColor={G.green} stopOpacity={0.05}/>
                          </radialGradient>
                        </defs>
                        <PolarGrid gridType="polygon" stroke="rgba(26,58,42,.08)"/>
                        <PolarAngleAxis dataKey="subject" tick={({ x, y, payload, cx, cy }) => {
                          const dx = x-cx, dy = y-cy;
                          const dist = Math.sqrt(dx*dx+dy*dy);
                          const nx = x+(dx/dist)*10, ny = y+(dy/dist)*10;
                          const val = data.find(d=>d.subject===payload.value)?.value;
                          return (
                            <g>
                              <text x={nx} y={ny-7} textAnchor="middle" dominantBaseline="middle" style={{fontSize:10,fontWeight:700,fill:"rgba(26,58,42,.5)",fontFamily:"'Nunito',sans-serif"}}>{payload.value}</text>
                              <text x={nx} y={ny+8} textAnchor="middle" dominantBaseline="middle" style={{fontSize:11,fontWeight:800,fill:G.green,fontFamily:"'Nunito',sans-serif"}}>{val}</text>
                            </g>
                          );
                        }}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Radar dataKey="value" stroke={G.green} strokeWidth={2} fill="url(#radarFill)"
                          dot={(props)=><circle cx={props.cx} cy={props.cy} r={4} fill={G.green} stroke="#fff" strokeWidth={2}/>}
                          activeDot={{r:6,fill:G.greenDk,stroke:"#fff",strokeWidth:2}}/>
                      </RadarChart>
                    </ResponsiveContainer>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginTop:4}}>
                      {data.map((d,i)=>{
                        const clr = d.value>=80?G.green:d.value>=65?G.blue:G.amber;
                        return (
                          <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:20,background:`${clr}0D`,border:`1px solid ${clr}25`}}>
                            <span style={{fontSize:10,fontWeight:800,color:clr}}>{d.value}</span>
                            <span style={{fontSize:10,fontWeight:600,color:"rgba(26,58,42,.45)"}}>{d.subject}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* 3. Core Strengths */}
              <div className="card">
                <div className="sl">{t.lStrengths3}</div>
                {(P.snap?.strengths||[]).map((s,i)=>{
                  const strength = typeof s === "object" ? s : {name:s, desc:""};
                  const colors = [G.green, G.blue, G.amber];
                  return (
                    <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:i<(P.snap.strengths.length-1)?"1px solid rgba(26,58,42,.05)":"none",alignItems:"flex-start"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:`${colors[i%3]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                        {["✦","◈","◉"][i]}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:800,color:G.greenDk,marginBottom:3}}>{strength.name}</div>
                        <div style={{fontSize:12,color:G.muted,lineHeight:1.7}}>{strength.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 4. Growth tip */}
              <div className="card" style={{background:"rgba(212,119,6,.04)",borderColor:"rgba(212,119,6,.12)"}}>
                <div className="sl">{t.lGrowth}</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.75}}>{P.summary?.watchOut}</p>
              </div>

              {/* CTA */}
              <div className="card" style={{background:G.greenDk,border:"none",textAlign:"center",padding:"32px 24px"}}>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:400,color:"#fff",marginBottom:10}}>{t.lCtaTitle}</h3>
                <p style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.85,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>{t.lCtaDesc}</p>
                <button className="gbtn" onClick={()=>setTab("send")}
                  style={{background:G.green,color:"#fff",padding:"13px 30px",fontSize:14,boxShadow:`0 6px 20px ${G.green}55`}}>
                  {t.lCtaBtn}
                </button>
              </div>
            </div>
          )}

          {/* ═══ TAB 2: ACADEMIC DIRECTIONS ═══ */}
          {tab === "academic" && (
            <div className="anim-fade">

              {/* Curiosity + Directions */}
              <div className="card">
                <div className="sl">{t.lCurriosity}</div>
                <p style={{fontSize:14,color:G.text,lineHeight:1.9,marginBottom:16}}>{P.academic?.curiosity}</p>
                <div className="sl">{t.lAcadDirs}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {(P.academic?.directions||P.academic?.domains||[]).map((d,i)=>(
                    <div key={i} style={{padding:"12px 14px",borderRadius:10,background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.15)",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:G.blue,fontWeight:900,fontSize:14}}>◈</span>
                      <span style={{fontSize:13,fontWeight:700,color:G.greenDk}}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major matches detail */}
              <div className="card">
                <div className="sl">{t.lMajorDetail}</div>
                <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
                  {(P.majors||[]).map((m,i)=>(
                    <button key={i} className="tbtn" onClick={()=>setMajI(i)}
                      style={{borderColor:majI===i?`${G.blue}40`:"rgba(26,58,42,.08)",color:majI===i?G.blue:"rgba(26,58,42,.38)",background:majI===i?`${G.blue}09`:"transparent",fontSize:11}}>
                      {m.name}
                    </button>
                  ))}
                </div>
                {(P.majors||[])[majI] && (()=>{const m=P.majors[majI];return(
                  <div key={majI} className="anim-fade">
                    <Bar score={m.fit} color={G.blue}/>
                    <p style={{fontSize:13,color:G.text,lineHeight:1.9,margin:"14px 0 16px"}}>{m.why}</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.12)"}}>
                        <div style={{fontSize:8,fontWeight:800,color:G.blue,marginBottom:8,letterSpacing:2}}>{t.lCourses.toUpperCase()}</div>
                        {(m.courses||[]).map((c,ci)=><div key={ci} style={{fontSize:12,color:G.muted,marginBottom:5,paddingLeft:8,borderLeft:"2px solid rgba(59,130,246,.25)",lineHeight:1.5}}>{c}</div>)}
                      </div>
                      <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(106,175,61,.05)",border:"1px solid rgba(106,175,61,.12)"}}>
                        <div style={{fontSize:8,fontWeight:800,color:G.green,marginBottom:8,letterSpacing:2}}>{t.lCareers.toUpperCase()}</div>
                        {(m.careers||[]).map((c,ci)=><div key={ci} style={{fontSize:12,color:G.muted,marginBottom:5,paddingLeft:8,borderLeft:"2px solid rgba(106,175,61,.25)",lineHeight:1.5}}>{c}</div>)}
                      </div>
                    </div>
                  </div>
                );})()}
              </div>

              {/* Learning style */}
              <div className="card" style={{background:"rgba(106,175,61,.03)",borderColor:"rgba(106,175,61,.12)"}}>
                <div className="sl">{t.lStyle}</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.85}}>{P.academic?.learningStyle}</p>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: GROWTH PATHWAY ═══ */}
          {tab === "growth" && (
            <div className="anim-fade">

              {/* Growth Direction Overview - teaser only */}
              <div className="card">
                <div className="sl">{t.lGrowthPath}</div>
                <p style={{fontSize:13,color:G.muted,lineHeight:1.85,marginBottom:16,fontStyle:"italic"}}>{t.lGrowthTeaser}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {(P.growth?.activities || (P.ec?.activities||[]).map(a=>a.type) || []).slice(0,4).map((act,i)=>(
                    <div key={i} style={{padding:"12px 14px",borderRadius:10,background:"rgba(106,175,61,.04)",border:"1px solid rgba(106,175,61,.12)",fontSize:13,fontWeight:700,color:G.greenDk,display:"flex",alignItems:"center",gap:8,filter:i>=2?"blur(3px)":"none",userSelect:i>=2?"none":"auto"}}>
                      <span style={{color:G.green,fontSize:14,flexShrink:0}}>◈</span>
                      {i>=2 ? "···" : act}
                    </div>
                  ))}
                </div>
                {/* Lock overlay hint */}
                <div style={{marginTop:14,padding:"10px 14px",borderRadius:10,background:"rgba(26,58,42,.04)",border:"1px dashed rgba(26,58,42,.15)",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>🔒</span>
                  <span style={{fontSize:12,color:G.muted,lineHeight:1.6}}>{zh?"完整成长路径规划（项目创意、竞赛建议、背景提升方向）需预约1对1咨询后解锁。":"Full pathway plan (project ideas, competitions, activity strategy) unlocked after 1-on-1 consultation."}</span>
                </div>
              </div>

              {/* Near-term Actions */}
              <div className="card" style={{background:"rgba(106,175,61,.03)",borderColor:"rgba(106,175,61,.12)"}}>
                <div className="sl">{t.lNextMonth}</div>
                {(P.next?.month||[]).map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <span style={{color:G.green,fontWeight:900,flexShrink:0,marginTop:2}}>→</span>
                    <span style={{fontSize:13,lineHeight:1.7,color:G.text}}>{s}</span>
                  </div>
                ))}
                {P.next?.key && (
                  <div style={{marginTop:14,padding:"12px 15px",borderRadius:10,background:"rgba(106,175,61,.08)",border:"1px solid rgba(106,175,61,.2)"}}>
                    <div style={{fontSize:9,fontWeight:800,color:G.green,letterSpacing:2,marginBottom:6}}>✦ {zh?"最关键":"KEY PRIORITY"}</div>
                    <p style={{fontSize:13,fontWeight:700,color:G.greenDk,lineHeight:1.75}}>{P.next.key}</p>
                  </div>
                )}
              </div>

              {/* Gaps */}
              {(P.ec?.gaps||[]).length>0 && (
                <div className="card" style={{background:"rgba(225,29,72,.03)",borderColor:"rgba(225,29,72,.1)"}}>
                  <div className="sl">{t.lGaps}</div>
                  {P.ec.gaps.map((g,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                      <span style={{color:G.rose,fontWeight:900,flexShrink:0}}>⚠</span>
                      <span style={{fontSize:13,color:G.text,lineHeight:1.7}}>{g}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="card" style={{background:G.greenDk,border:"none",textAlign:"center",padding:"32px 24px"}}>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:400,color:"#fff",marginBottom:10}}>{t.lCtaTitle}</h3>
                <p style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.85,marginBottom:20,maxWidth:340,margin:"0 auto 20px"}}>{t.lCtaDesc}</p>
                <button className="gbtn" onClick={()=>setTab("send")}
                  style={{background:G.green,color:"#fff",padding:"13px 30px",fontSize:14,boxShadow:`0 6px 20px ${G.green}55`}}>
                  {t.lCtaBtn}
                </button>
              </div>
            </div>
          )}



          {/* ═══ SEND TO COUNSELOR ═══ */}
          {tab === "send" && (
            <div className="anim-fade">
              {!sent ? (
                <>
                  {/* Counselor summary preview */}
                  <div className="card" style={{background:G.greenDk,border:"none",marginBottom:14}}>
                    <div style={{fontSize:8,fontWeight:800,color:"rgba(255,255,255,.35)",letterSpacing:3,marginBottom:14}}>
                      {zh?"顾问专属摘要预览 — 发送后顾问将看到以下内容":"COUNSELOR PREVIEW — This is what your counselor receives"}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div style={{padding:"13px 15px",borderRadius:10,background:"rgba(255,255,255,.06)"}}>
                        <div style={{fontSize:8,color:G.greenLt,fontWeight:800,letterSpacing:2,marginBottom:7}}>{zh?"学生画像":"STUDENT PROFILE"}</div>
                        <p style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.8,fontWeight:500}}>{P.summary?.headline}</p>
                      </div>
                      <div style={{padding:"13px 15px",borderRadius:10,background:"rgba(255,255,255,.06)"}}>
                        <div style={{fontSize:8,color:G.greenLt,fontWeight:800,letterSpacing:2,marginBottom:7}}>{zh?"顾问备注":"COUNSELOR NOTE"}</div>
                        <p style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.8,fontWeight:500}}>{P.summary?.counselorNote}</p>
                      </div>
                    </div>
                    <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)"}}>
                      <div style={{fontSize:8,color:G.greenLt,fontWeight:800,letterSpacing:2,marginBottom:7}}>{zh?"核心洞察":"KEY INSIGHT"}</div>
                      <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.8}}>{P.summary?.keyInsight}</p>
                    </div>
                  </div>

                  {/* Student info row */}
                  {(name||email) && (
                    <div className="card" style={{marginBottom:14}}>
                      <div className="sl">{t.yourInfo}</div>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        {name && <Pill color={G.green}>👤 {name}</Pill>}
                        {email && <Pill color={G.blue}>✉ {email}</Pill>}
                      </div>
                    </div>
                  )}

                  {/* Mode select */}
                  {sendMode === null && (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:14}}>
                      {[
                        {mode:"starwise",icon:"🎓",title:t.optStarwise,sub:t.optStarwiseSub,color:G.green},
                        {mode:"own",     icon:"📧",title:t.optOwn,      sub:t.optOwnSub,      color:G.sage},
                      ].map(opt=>(
                        <button key={opt.mode} onClick={()=>setSendMode(opt.mode)}
                          style={{padding:"20px 16px",borderRadius:14,background:"#fff",border:`2px solid rgba(26,58,42,.09)`,cursor:"pointer",textAlign:"left",fontFamily:"'Nunito',sans-serif",transition:"all .2s"}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=opt.color}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(26,58,42,.09)"}>
                          <div style={{fontSize:24,marginBottom:10}}>{opt.icon}</div>
                          <div style={{fontSize:13,fontWeight:700,color:G.greenDk,marginBottom:5,lineHeight:1.4}}>{opt.title}</div>
                          <div style={{fontSize:11,color:G.muted,lineHeight:1.6}}>{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* StarWise form */}
                  {sendMode === "starwise" && (
                    <div className="card anim-pop">
                      <div className="sl">{t.optStarwise.toUpperCase()}</div>
                      <input className="ifield" value={name||""} readOnly placeholder={t.namePH} style={{marginBottom:8,opacity:.6,background:"rgba(26,58,42,.03)"}}/>
                      <input className="ifield" value={email||""} readOnly placeholder={t.emailPH} style={{marginBottom:10,opacity:.6,background:"rgba(26,58,42,.03)"}}/>
                      <input className="ifield" value="info@starwise-edu.com" readOnly style={{marginBottom:10,opacity:.6,background:"rgba(26,58,42,.03)",color:G.green,fontWeight:700}}/>
                      <input className="ifield" type="tel" value={parentPhone} onChange={e=>setParentPhone(e.target.value)}
                        placeholder={t.parentPhonePH} style={{marginBottom:4}}/>
                      <p style={{fontSize:11,color:G.green,marginBottom:10,fontWeight:600}}>📱 {t.parentPhone}</p>
                      <textarea className="ifield" rows={3} value={note} onChange={e=>setNote(e.target.value)}
                        placeholder={t.notePH} style={{resize:"none",lineHeight:1.75,marginBottom:14}}/>
                      <button className="gbtn" onClick={doSend} disabled={sending}
                        style={{width:"100%",padding:"13px",fontSize:14,background:G.green,color:"#fff",boxShadow:`0 6px 22px ${G.green}30`,marginBottom:10}}>
                        {sending ? t.sending : t.sendBtn}
                      </button>
                      <button onClick={()=>setSendMode(null)} style={{width:"100%",background:"transparent",border:"none",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:600,padding:"6px"}}>{t.back}</button>
                    </div>
                  )}

                  {/* Own counselor form */}
                  {sendMode === "own" && (
                    <div className="card anim-pop">
                      <div className="sl">{t.optOwn.toUpperCase()}</div>
                      <input className="ifield" type="email" value={cEmail} onChange={e=>setCEmail(e.target.value)}
                        placeholder={t.counselorEmail} style={{marginBottom:10}}/>
                      <input className="ifield" type="tel" value={parentPhone} onChange={e=>setParentPhone(e.target.value)}
                        placeholder={t.parentPhonePH} style={{marginBottom:4}}/>
                      <p style={{fontSize:11,color:G.green,marginBottom:10,fontWeight:600}}>📱 {t.parentPhone}</p>
                      <textarea className="ifield" rows={3} value={note} onChange={e=>setNote(e.target.value)}
                        placeholder={t.notePH} style={{resize:"none",lineHeight:1.75,marginBottom:14}}/>
                      <button className="gbtn" onClick={doSend} disabled={!cEmail.includes("@")||sending}
                        style={{width:"100%",padding:"13px",fontSize:14,background:G.sage,color:"#fff",marginBottom:10}}>
                        {sending ? t.sending : t.sendBtn}
                      </button>
                      <button onClick={()=>setSendMode(null)} style={{width:"100%",background:"transparent",border:"none",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:600,padding:"6px"}}>{t.back}</button>
                    </div>
                  )}

                  {/* Share / Download */}
                  {sendMode === null && (
                    <div className="card">
                      <div className="sl">{zh?"分享与保存":"SHARE & SAVE"}</div>

                      {/* Invite friend */}
                      <div style={{marginBottom:14}}>
                        <div className="sl">{zh?"邀请好友测评":"INVITE A FRIEND"}</div>
                        <p style={{fontSize:12,color:G.muted,lineHeight:1.75,marginBottom:10}}>{t.inviteDesc}</p>
                        <button onClick={()=>{
                          const baseUrl = window.location.href.split('#')[0];
                          const zh2 = lang==='zh';
                          const archetype2 = profile?.snap?.archetype || profile?.snap?.personality || "";
                          const inviteMsg = zh2
                            ? `嗨！我刚做了一个很有意思的成长测评，${archetype2 ? `我的成长原型是「${archetype2}」` : "快来试试"}！\n你也来测测看吧 👇\n${baseUrl}`
                            : `Hey! I took this awesome free assessment — ${archetype2 ? `my archetype is "${archetype2}"` : "you should try it"}!\nFind out yours here 👇\n${baseUrl}`;
                          navigator.clipboard.writeText(inviteMsg).then(()=>{
                            setInviteCopied(true); setTimeout(()=>setInviteCopied(false),3000);
                          }).catch(()=>{
                            const ta=document.createElement('textarea');ta.value=inviteMsg;
                            ta.style.position='fixed';ta.style.opacity='0';
                            document.body.appendChild(ta);ta.select();document.execCommand('copy');
                            document.body.removeChild(ta);
                            setInviteCopied(true); setTimeout(()=>setInviteCopied(false),3000);
                          });
                        }}
                          style={{width:"100%",padding:"11px 16px",borderRadius:10,background:inviteCopied?`${G.green}10`:`${G.green}10`,border:`1.5px solid ${G.green}30`,fontSize:13,fontWeight:700,color:G.green,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16,transition:"all .2s"}}>
                          {inviteCopied ? <>✓ {zh?"已复制！去发给朋友吧":"Copied! Send to friends"}</> : <>🌟 {t.inviteBtn} →</>}
                        </button>
                      </div>

                      {/* Share report link */}
                      <div style={{marginBottom:14}}>
                        <p style={{fontSize:12,color:G.muted,lineHeight:1.75,marginBottom:10}}>{t.shareDesc}</p>
                        <button onClick={shareReport}
                          style={{width:"100%",padding:"11px 16px",borderRadius:10,background:shareCopied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1.5px solid ${shareCopied?G.green+"50":"rgba(26,58,42,.1)"}`,fontSize:13,fontWeight:700,color:shareCopied?G.green:G.greenDk,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                          {shareCopied ? <>✓ {t.shareCopied}</> : shareLoading ? (zh?"生成中…":"Generating…") : <>🔗 {t.shareLink}</>}
                        </button>
                      </div>

                      {/* Download PDF */}
                      <button onClick={downloadPDF} disabled={downloading}
                        style={{width:"100%",padding:"11px 16px",borderRadius:10,background:"rgba(26,58,42,.04)",border:"1.5px solid rgba(26,58,42,.1)",fontSize:13,fontWeight:700,color:G.greenDk,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,transition:"all .2s"}}>
                        {downloading ? `⏳ ${t.downloading}` : `📄 ${t.downloadPdf}`}
                      </button>

                      {/* Copy text + Restart */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <button onClick={copyLink}
                          style={{flex:1,padding:"9px 14px",borderRadius:9,background:copied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1px solid ${copied?G.green+"40":"rgba(26,58,42,.09)"}`,fontSize:12,fontWeight:700,color:copied?G.green:G.muted,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s"}}>
                          {copied ? t.copied : `📋 ${t.copyLink}`}
                        </button>
                        <button onClick={resetAll}
                          style={{padding:"9px 14px",borderRadius:9,background:"rgba(26,58,42,.04)",border:"1px solid rgba(26,58,42,.09)",fontSize:12,fontWeight:700,color:G.muted,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                          🔄 {t.restart}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ── SENT SUCCESS ── */
                <div className="card anim-pop" style={{padding:"32px 24px"}}>
                  <div style={{textAlign:"center",marginBottom:24}}>
                    <div style={{fontSize:44,marginBottom:12}}>✅</div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:400,color:G.greenDk,marginBottom:8}}>{t.sentTitle}</h3>
                    <p style={{fontSize:13,color:G.muted,lineHeight:1.85,maxWidth:300,margin:"0 auto",marginBottom:cEmail?12:0}}>{t.sentDesc}</p>
                    {cEmail && <div style={{padding:"8px 14px",borderRadius:8,background:"rgba(106,175,61,.08)",border:"1px solid rgba(106,175,61,.2)",fontSize:12,fontWeight:700,color:G.green,display:"inline-block"}}>{cEmail}</div>}
                  </div>
                  <div style={{borderTop:"1px solid rgba(26,58,42,.07)",paddingTop:20}}>
                    <div className="sl">{zh?"同时分享给家长或好友":"ALSO SHARE WITH PARENTS OR FRIENDS"}</div>
                    <button onClick={shareReport}
                      style={{width:"100%",padding:"11px 16px",borderRadius:10,background:shareCopied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1.5px solid ${shareCopied?G.green+"50":"rgba(26,58,42,.1)"}`,fontSize:13,fontWeight:700,color:shareCopied?G.green:G.greenDk,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
                      {shareCopied ? <>✓ {t.shareCopied}</> : shareLoading ? (zh?"生成中…":"Generating…") : <>🔗 {t.shareLink}</>}
                    </button>
                    <button onClick={downloadPDF}
                      style={{width:"100%",padding:"11px 16px",borderRadius:10,background:"rgba(26,58,42,.04)",border:"1.5px solid rgba(26,58,42,.1)",fontSize:13,fontWeight:700,color:G.greenDk,cursor:"pointer",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
                      📄 {t.downloadPdf}
                    </button>
                    <button onClick={resetAll}
                      style={{width:"100%",padding:"9px",borderRadius:9,background:"transparent",border:"none",fontSize:12,fontWeight:700,color:G.muted,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                      🔄 {t.restart}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Bottom restart (non-send tabs) ── */}
          {tab !== "send" && tab !== "growth" && (
            <div style={{textAlign:"center",marginTop:36,paddingTop:24,borderTop:"1px solid rgba(26,58,42,.06)"}}>
              <button className="gbtn" onClick={resetAll}
                style={{background:"transparent",border:"2px solid rgba(26,58,42,.1)",color:"rgba(26,58,42,.28)",padding:"9px 22px",fontSize:12}}>
                {t.restart}
              </button>
            </div>
          )}
          {/* ── Page Footer ── */}
          <div style={{textAlign:"center",marginTop:40,paddingTop:20,borderTop:"1px solid rgba(26,58,42,.05)"}}>
            <p style={{fontSize:10,color:"rgba(26,58,42,.3)",fontWeight:700,letterSpacing:1}}>STARPATH FINDER · StarWise International</p>
            <p style={{fontSize:10,color:"rgba(26,58,42,.25)",marginTop:3}}>+1 (626) 725-6474</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── AGE GROUP & QUESTION BANK ──────────────────────────────────────────────

// ─── AGE GROUP & QUESTION BANK (module level) ───────────────────────────────

