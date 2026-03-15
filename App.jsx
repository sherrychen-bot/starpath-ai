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
    brand: "STARPATH AI", byLine: "by StarWise",
    tagline: "发现你真正的方向",
    subtitle: "不是考试，不是评分\n15 分钟，生成专属于你的美本升学画像",
    start: "开始免费测评",
    startNote: "完全免费 · 约 15 分钟 · 无需注册",
    next: "下一题 →", generate: "生成我的升学画像 ✦",
    charLeft: (n, min) => n > 0 ? `✓` : ``,
    loading: ["分析你的学习特质…","识别你的核心优势…","匹配专业方向…","规划背景提升路径…","生成升学画像…"],
    errTitle: "生成遇到了问题", errDesc: "你的答案都还在，直接重试就好",
    retry: "重新生成", backQ: "返回检查答案", lang: "EN",
    // email gate
    gateTitle: "你的画像已生成！",
    gateDesc:  "输入邮箱保存完整报告，并可一键发送给升学顾问。",
    namePH: "你的名字（可选）", emailPH: "your@email.com",
    gateBtn: "查看完整报告 →", gateSkip: "先跳过",
    gateNote: "不会收到垃圾邮件。数据安全加密保存。",
    // report
    rptTitle: "升学画像报告",
    t0:"📋 总览", t1:"📚 学术", t2:"🏆 活动", t3:"🎓 选校", t4:"📤 发送顾问",
    // summary labels
    lInsight:"核心洞察", lGrowth:"成长提示", lStyle:"思维风格", lRadar:"能力画像",
    rAxes:["学术深度","创造力","领导力","执行力","表达力","同理心"],
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
    sendBtn:"发送邮件 →", sending:"打开邮件中…",
    sentTitle:"邮件已打开 📧", sentDesc:"邮件已在你的邮件客户端打开，报告内容已预填，确认发送即可。",
    copyLink:"复制报告内容", copied:"✓ 已复制到剪贴板",
    shareLink:"分享报告链接", shareCopied:"✓ 链接已复制",
    downloadPdf:"下载 PDF 报告", downloading:"准备中…",
    shareDesc:"把这个链接发给家长或好友，他们直接打开就能看到你的报告，无需登录。",
    restart:"重新测评", back:"← 返回",
    inviteBtn:"邀请好友测评", inviteDesc:"把测评工具分享给朋友或同学",
    switchLang:"切换为英文版（重新生成）", switching:"正在切换…",
    grade: g=>`${g}年级`,
    school: s=>{const m={us_public:"美国公立高中",us_private:"美国私立高中",ib:"IB课程",ap:"AP课程",intl:"国际学校",boarding:"寄宿学校",other:"其他"};return Array.isArray(s)?s.map(v=>m[v]||v).join(" · "):(m[s]||s);},
  },
  en: {
    brand: "STARPATH AI", byLine: "by StarWise",
    tagline: "Discover your true direction",
    subtitle: "Not a test. Not a score.\n15 minutes to your personalized US college profile.",
    start: "Start Free Assessment",
    startNote: "Free · ~15 min · No account needed",
    next: "Next →", generate: "Generate My Profile ✦",
    charLeft: (n, min) => n > 0 ? `✓` : ``,
    loading: ["Analyzing your learning style…","Identifying core strengths…","Matching academic directions…","Planning activity strategy…","Building your profile…"],
    errTitle: "Something went wrong", errDesc: "Your answers are saved — just retry",
    retry: "Try Again", backQ: "Review answers", lang: "中文",
    gateTitle: "Your profile is ready!",
    gateDesc:  "Enter your email to save the full report and send it to a counselor.",
    namePH: "Your name (optional)", emailPH: "your@email.com",
    gateBtn: "View Full Report →", gateSkip: "Skip for now",
    gateNote: "No spam. Your data is encrypted and private.",
    rptTitle: "College Profile Report",
    t0:"📋 Summary", t1:"📚 Academics", t2:"🏆 Activities", t3:"🎓 Colleges", t4:"📤 Send",
    lInsight:"Key Insight", lGrowth:"Growth Area", lStyle:"Thinking Style", lRadar:"Capability Profile",
    rAxes:["Academic Depth","Creativity","Leadership","Execution","Communication","Empathy"],
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
    sendBtn:"Send Email →", sending:"Opening…",
    sentTitle:"Email Opened 📧", sentDesc:"Your email client opened with the report pre-filled. Hit send!",
    copyLink:"Copy Report Text", copied:"✓ Copied to clipboard",
    shareLink:"Share Report Link", shareCopied:"✓ Link copied!",
    downloadPdf:"Download PDF", downloading:"Preparing…",
    shareDesc:"Share this link with parents or friends — they can view your report without any account.",
    restart:"Start Over", back:"← Back",
    inviteBtn:"Invite a Friend", inviteDesc:"Share the assessment tool with friends",
    switchLang:"Switch to Chinese (regenerate)", switching:"Switching…",
    grade: g=>`Grade ${g}`,
    school: s=>{const m={us_public:"US Public",us_private:"US Private",ib:"IB Track",ap:"AP Track",intl:"Intl School",boarding:"Boarding",other:"Other"};return Array.isArray(s)?s.map(v=>m[v]||v).join(" · "):(m[s]||s);},
  },
};

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const buildQ = (lang) => {
  const zh = lang === "zh";
  return [
    // ── Section 1: Profile
    { id:"pr1", sec:"profile", secLabel:zh?"基本定位":"Your Profile", secEmoji:"📋", secColor:G.blue,
      type:"choice", text:zh?"你目前在几年级？":"What grade are you in?",
      opts:[{l:zh?"7年级":"Grade 7",v:"7",e:"🌱"},{l:zh?"8年级":"Grade 8",v:"8",e:"🌿"},
            {l:zh?"9年级":"Grade 9",v:"9",e:"🔥"},{l:zh?"10年级":"Grade 10",v:"10",e:"⚡"},
            {l:zh?"11年级":"Grade 11",v:"11",e:"🚀"},{l:zh?"12年级":"Grade 12",v:"12",e:"🎓"}]},
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
    // ── Section 2: Academic
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
    // ── Section 3: Strengths
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
      text:zh?"描述一件让你感觉「我真的很擅长这个」的事。具体说你做了什么，结果是什么。":"Describe something where you felt \"I'm genuinely good at this.\" What did you do and what happened?",
      ph:zh?"可以是学校里的，也可以是课外的任何事…":"Academic or extracurricular — anything real…"},
    // ── Section 4: Values
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
    // ── Section 5: Activities
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
};

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
const buildPrompt = (lang) => {
  const zh = lang === "zh";
  return `You are StarPath AI, a college admissions expert at StarWise International Education. Analyze student responses and return ONLY valid JSON — no markdown, no backticks.

Return this exact structure:
{
  "snap": {
    "grade": "string",
    "schoolType": "string key",
    "personality": "${zh?"3-4字人格类型":"3-5 word type e.g. Systems Builder"}",
    "tagline": "${zh?"1句话，让学生感到被深度看见，15字内":"1 line under 12 words, make student feel truly seen"}",
    "strengths": ["${zh?"3个核心才干，4字内":"3 strengths, 3-4 words"}"],
    "motivation": "${zh?"核心驱动，1句话":"Core drive, one sentence"}",
    "thinkingStyle": "${zh?"分析型/创造型/表达型/实践型/人文型":"Analytical/Creative/Expressive/Applied/Humanistic"}"
  },
  "radar": {
    "academicDepth": 75,
    "creativity": 68,
    "leadership": 82,
    "execution": 71,
    "communication": 88,
    "empathy": 79
  },
  "summary": {
    "headline": "${zh?"2-3句综合画像，温暖有洞察，让学生感到被深度理解":"2-3 warm insightful sentences — student feels truly understood"}",
    "keyInsight": "${zh?"最重要洞察——最特别、最值得发展的地方，2句":"Single most important insight, 2 sentences, specific to answers"}",
    "watchOut": "${zh?"一个成长点，友善直接，1-2句":"One gentle growth area, 1-2 sentences"}",
    "counselorNote": "${zh?"给顾问的专业备注，1-2句，帮助顾问快速了解这个学生":"Professional note for counselor, 1-2 sentences"}"
  },
  "academic": {
    "curiosity": "${zh?"基于回答的真实兴趣，2句":"True curiosity from answers, 2 sentences"}",
    "domains": ["${zh?"2-3个强势学科域":"2-3 strongest domains"}"],
    "learningStyle": "${zh?"学习风格，结合课堂偏好，2句":"Learning style, 2 sentences"}"
  },
  "majors": [
    {"name":"","fit":90,"why":"${zh?"为什么适合，结合具体回答，2句":"Why it fits with specific evidence, 2 sentences"}","courses":["",""],"careers":["",""]}
  ],
  "courses": {
    "apib": ["${zh?"3-4门推荐AP/IB，附简短理由":"3-4 AP/IB with rationale"}"],
    "note": "${zh?"选课策略总建议，2句":"Overall strategy, 2 sentences"}"
  },
  "ec": {
    "assessment": "${zh?"活动现状评估，2句":"Activity assessment, 2 sentences"}",
    "narrative": "${zh?"活动主线叙事，2句":"Narrative theme, 2 sentences"}",
    "gaps": ["${zh?"1-2个需要补强":"1-2 gaps"}"],
    "activities": [
      {"type":"","action":"${zh?"具体可操作":"Specific actionable"}","why":"${zh?"1句":"1 sentence"}","when":"${zh?"时间":"When"}"}
    ]
  },

  "essay": {
    "coreNarrative": "${zh?"核心故事主题，2句":"Core narrative, 2 sentences"}",
    "ideas": ["${zh?"2个Common App文书方向":"2 essay angles"}"],
    "angle": "${zh?"最独特的申请角度，2句":"Most unique angle, 2 sentences"}"
  },
  "next": {
    "month": ["${zh?"本月2-3件具体事":"2-3 actions this month"}"],
    "year": ["${zh?"今年2-3个里程碑":"2-3 milestones this year"}"],
    "key": "${zh?"申请前最关键一件事":"Single most important thing before applying"}"
  }
}

Rules:
- majors: exactly 4, sorted by fit desc
- ec.activities: exactly 3
- Do NOT include a colleges key
- radar: all 6 values must be integers 40-95, derived from specific answers
- Every insight MUST cite specific answers — zero generic advice
- Tone: warm mentor who truly sees the student
- Pure JSON only`;
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&family=Noto+Serif+SC:wght@400;500;600&display=swap');
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
textarea,input{font-family:'DM Sans',sans-serif;outline:none;}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:rgba(106,175,61,.18);border-radius:4px}

.choice{background:#fff;border:2px solid rgba(26,58,42,.09);border-radius:13px;padding:14px 16px;cursor:pointer;transition:all .17s cubic-bezier(.16,1,.3,1);display:flex;align-items:center;gap:10px;}
.choice:hover{transform:translateY(-2px);border-color:rgba(106,175,61,.35);box-shadow:0 4px 16px rgba(106,175,61,.1);}
.choice.on{border-color:#6AAF3D;background:rgba(106,175,61,.06);}

.mtag{background:#fff;border:2px solid rgba(26,58,42,.08);border-radius:10px;padding:9px 13px;cursor:pointer;transition:all .15s ease;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;}
.mtag:hover{border-color:rgba(106,175,61,.3);background:rgba(106,175,61,.04);}
.mtag.on{border-color:#6AAF3D;background:rgba(106,175,61,.07);}
.mtag.dim{opacity:.28;cursor:not-allowed;}

.gbtn{font-family:'DM Sans',sans-serif;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all .2s cubic-bezier(.16,1,.3,1);letter-spacing:.2px;}
.gbtn:hover:not(:disabled){transform:translateY(-2px);}
.gbtn:active:not(:disabled){transform:translateY(0);}
.gbtn:disabled{opacity:.22;cursor:not-allowed;}

.tbtn{padding:8px 15px;border-radius:20px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .16s;border:2px solid transparent;font-weight:700;background:transparent;white-space:nowrap;}

.card{background:#fff;border:1px solid rgba(26,58,42,.08);border-radius:16px;padding:22px 22px;margin-bottom:14px;}
.sl{font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-bottom:11px;font-weight:800;font-family:'DM Sans',sans-serif;opacity:.4;color:#1A3A2A;}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:20px;font-size:11px;font-weight:700;}
.bar-wrap{height:5px;border-radius:3px;background:rgba(26,58,42,.07);overflow:hidden;margin-top:7px;}
.bar-fill{height:100%;border-radius:3px;transform-origin:left;animation:barIn 1s cubic-bezier(.16,1,.3,1) .2s both;}

.ifield{width:100%;padding:12px 15px;border:1.5px solid rgba(26,58,42,.14);border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;color:#1E2B1E;background:#F5F9F3;transition:border-color .2s,background .2s;}
.ifield:focus{border-color:#6AAF3D;background:#fff;}

.lbtn{position:fixed;top:16px;right:16px;z-index:200;padding:6px 14px;border-radius:20px;font-size:11px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;background:rgba(26,58,42,.06);border:1px solid rgba(26,58,42,.12);color:rgba(26,58,42,.45);transition:all .2s;}
.lbtn:hover{background:rgba(26,58,42,.1);color:rgba(26,58,42,.8);}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
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
  const [note, setNote]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [copied, setCopied]   = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const t    = T[lang];
  const QS   = buildQ(lang);
  const SECS_ = SECS(lang);
  const TOTAL = QS.length;
  const cq   = QS[qi];
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

  // Load shared report from URL hash on mount
  useEffect(() => {
    (async () => { try {
      const hash = window.location.hash;
      const isV2 = hash.startsWith('#v2=');
      const isLegacy = hash.startsWith('#report=');
      if (isV2 || isLegacy) {
        const encoded = hash.slice(isV2 ? 4 : 8);
        let payload;
        try {
          // Try gzip decompress first (v2 format)
          if (isV2 && typeof DecompressionStream !== 'undefined') {
            const binary = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();
            writer.write(binary); writer.close();
            const text = await new Response(stream.readable).text();
            const slim = JSON.parse(text);
            payload = { s2: slim };
          } else {
            payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
          }
        } catch(_) {
          payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        }
        if (payload.p) {
          // Legacy full format
          setProfile(payload.p);
          if (payload.n) setName(payload.n);
          if (payload.e) setEmail(payload.e);
          if (payload.l) setLang(payload.l);
          setPhase('result'); setTab('summary');
        } else if (payload.s) {
          setProfile({ snap:payload.s, radar:payload.r, summary:payload.su, majors:payload.m, next:payload.nx });
          if (payload.n) setName(payload.n);
          if (payload.l) setLang(payload.l);
          setPhase('result'); setTab('summary');
        } else if (payload.s2) {
          // V2 ultra-compact format
          const s = payload.s2;
          setProfile({
            snap:{ personality:s.a, tagline:s.b, strengths:s.c, motivation:s.d, thinkingStyle:s.e, grade:s.f, schoolType:s.g },
            radar: s.h,
            summary:{ headline:s.i, keyInsight:s.j, watchOut:s.k, counselorNote:s.l2 },
            majors: (s.m||[]).map(([n,f])=>({name:n,fit:f})),
            next:{ month:s.o, key:s.p2 }
          });
          if (s.q) setName(s.q);
          if (s.r2) setLang(s.r2);
          setPhase('result'); setTab('summary');
        }
      }
    } catch(e) { /* invalid hash, ignore */ } })();
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:4000,
          system:buildPrompt(lang),
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
    if (email && !email.includes("@")) {
      setEmailErr(lang==="zh" ? "请输入有效邮箱" : "Please enter a valid email");
      return;
    }
    setEmailErr("");
    setPhase("result");
    setTab("summary");
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
    lines.push(`Generated by StarPath AI · by StarWise`);
    return lines.join("\n");
  };

  const doSend = () => {
    if (!profile) return;
    if (sendMode === "own" && !cEmail.includes("@")) return;
    setSending(true);
    const reportText = buildReportText(profile, t, lang);
    const subject = encodeURIComponent(
      `StarPath AI Report — ${profile.snap?.personality||""}${name ? " · " + name : ""}`
    );
    const body = encodeURIComponent((note ? note + "\n\n" : "") + reportText);
    const to = sendMode === "own" ? encodeURIComponent(cEmail) : "";
    // Use anchor click — most reliable, avoids browser popup blocking
    const a = document.createElement("a");
    a.href = `mailto:${to}?subject=${subject}&body=${body}`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => { setSending(false); setSent(true); }, 300);
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

  const shareReport = async () => {
    if (!profile) return;
    try {
      // Ultra-compact: only the fields needed to render summary view
      const slim = {
        a: profile.snap?.personality,
        b: profile.snap?.tagline,
        c: profile.snap?.strengths,
        d: profile.snap?.motivation,
        e: profile.snap?.thinkingStyle,
        f: profile.snap?.grade,
        g: profile.snap?.schoolType,
        h: profile.radar,
        i: profile.summary?.headline,
        j: profile.summary?.keyInsight,
        k: profile.summary?.watchOut,
        l2: profile.summary?.counselorNote,
        m: (profile.majors||[]).map(x=>[x.name,x.fit]),
        o: profile.next?.month,
        p2: profile.next?.key,
        q: name, r2: lang
      };
      // Compress via gzip if available (modern browsers), fallback to btoa
      let encoded;
      if (typeof CompressionStream !== 'undefined') {
        const json = JSON.stringify(slim);
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        writer.write(new TextEncoder().encode(json));
        writer.close();
        const compressed = await new Response(stream.readable).arrayBuffer();
        encoded = btoa(String.fromCharCode(...new Uint8Array(compressed)));
      } else {
        encoded = btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
      }
      const shareUrl = window.location.href.split('#')[0] + '#v2=' + encoded;
      const doWrite = (url) => {
        navigator.clipboard.writeText(url).then(() => {
          setShareCopied(true); setTimeout(() => setShareCopied(false), 3000);
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = url; ta.style.position='fixed'; ta.style.opacity='0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
          setShareCopied(true); setTimeout(() => setShareCopied(false), 3000);
        });
      };
      doWrite(shareUrl);
    } catch(e) { console.error(e); }
  };

  const downloadPDF = () => {
    if (!profile) return;
    setDownloading(true);
    const P = profile;
    const zh = lang === "zh";
    const studentName = name || (zh ? "学生" : "Student");
    const docTitle = `${studentName}-${zh?"升学画像":"College Profile"}`;

    const html = `<!DOCTYPE html>
<html lang="${zh?"zh":"en"}">
<head>
<meta charset="UTF-8"/>
<title>${docTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Serif+Display&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#fff;color:#1E2B1E;padding:0;}
  @page{margin:16mm;size:A4;}
  .page{max-width:100%;padding:0;}
  .header{background:#1A3A2A;color:#fff;padding:28px 32px;display:flex;align-items:center;gap:16px;}
  .logo{width:40px;height:40px;}
  .brand{font-size:13px;font-weight:800;letter-spacing:2px;}
  .byline{font-size:9px;opacity:.5;letter-spacing:2px;margin-top:2px;}
  .hero{padding:28px 32px 20px;border-bottom:2px solid #EAF2E5;}
  .student-name{font-size:11px;color:#6AAF3D;font-weight:700;letter-spacing:1px;margin-bottom:6px;}
  .personality{font-family:'DM Serif Display',serif;font-size:28px;color:#1A3A2A;margin-bottom:6px;}
  .tagline{font-size:13px;color:#6B7B6B;font-style:italic;margin-bottom:12px;}
  .pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}
  .pill{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(106,175,61,.1);border:1px solid rgba(106,175,61,.25);color:#2D5A3D;}
  .motivation{font-size:11px;color:#6B7B6B;line-height:1.7;}
  .section{padding:20px 32px;border-bottom:1px solid #EAF2E5;break-inside:avoid;}
  .sec-label{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#6AAF3D;font-weight:800;margin-bottom:10px;}
  .body-text{font-size:12px;line-height:1.85;color:#1E2B1E;}
  .highlight{background:#F5F9F3;border-left:3px solid #6AAF3D;padding:10px 14px;border-radius:0 8px 8px 0;margin-top:8px;font-size:12px;line-height:1.8;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .card{background:#F5F9F3;border-radius:8px;padding:12px 14px;}
  .card-label{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#6B7B6B;font-weight:700;margin-bottom:6px;}
  .major-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(26,58,42,.06);}
  .major-name{font-size:12px;font-weight:700;flex:1;}
  .bar{height:4px;width:80px;background:rgba(26,58,42,.08);border-radius:2px;overflow:hidden;}
  .bar-fill{height:100%;background:#6AAF3D;border-radius:2px;}
  .pct{font-size:11px;font-weight:800;color:#6AAF3D;min-width:28px;text-align:right;}
  .arrow-item{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start;font-size:12px;line-height:1.7;}
  .arrow{color:#6AAF3D;font-weight:900;flex-shrink:0;}
  .footer{padding:16px 32px;background:#F5F9F3;text-align:center;font-size:9px;color:#6B7B6B;letter-spacing:1px;}
  .radar-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;}
  .radar-item{background:#fff;border:1px solid rgba(106,175,61,.2);border-radius:8px;padding:8px 12px;text-align:center;}
  .radar-val{font-size:20px;font-weight:800;color:#6AAF3D;line-height:1;}
  .radar-lbl{font-size:9px;color:#6B7B6B;margin-top:3px;}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#6AAF3D"/>
      <polygon points="50,20 84,35 50,50 16,35" fill="white"/>
      <path d="M30,40 L30,59 C30,68 39,74 50,74 C61,74 70,68 70,59 L70,40 L50,50 Z" fill="white"/>
      <rect x="80" y="35" width="3.5" height="22" rx="1.5" fill="white"/>
      <polygon points="81.5,60 84,66 90,66 85,70 87,76 81.5,72 76,76 78,70 73,66 79,66" fill="white"/>
    </svg>
    <div>
      <div class="brand">STARPATH AI</div>
      <div class="byline">BY STARWISE INTERNATIONAL EDUCATION</div>
    </div>
  </div>

  <div class="hero">
    ${name ? `<div class="student-name">${name} · ${zh?"升学画像报告":"College Profile Report"}</div>` : ''}
    <div class="personality">${P.snap?.personality||''}</div>
    <div class="tagline">${P.snap?.tagline||''}</div>
    <div class="pills">
      ${(P.snap?.strengths||[]).map(s=>`<span class="pill">⚡ ${s}</span>`).join('')}
    </div>
    <div class="motivation">${P.snap?.motivation||''}</div>
  </div>

  ${P.radar ? `
  <div class="section">
    <div class="sec-label">${zh?"能力画像":"Capability Profile"}</div>
    <div class="radar-grid">
      ${[
        [P.radar.academicDepth, zh?"学术深度":"Academic Depth"],
        [P.radar.creativity,    zh?"创造力":"Creativity"],
        [P.radar.leadership,    zh?"领导力":"Leadership"],
        [P.radar.execution,     zh?"执行力":"Execution"],
        [P.radar.communication, zh?"表达力":"Communication"],
        [P.radar.empathy,       zh?"同理心":"Empathy"],
      ].map(([v,l])=>`<div class="radar-item"><div class="radar-val">${v}</div><div class="radar-lbl">${l}</div></div>`).join('')}
    </div>
  </div>` : ''}

  <div class="section">
    <div class="sec-label">${zh?"核心洞察":"Key Insight"}</div>
    <div class="body-text">${P.summary?.headline||''}</div>
    <div class="highlight">${P.summary?.keyInsight||''}</div>
  </div>

  <div class="section">
    <div class="sec-label">${zh?"专业方向匹配":"Major Matches"}</div>
    ${(P.majors||[]).map(m=>`
      <div class="major-row">
        <span class="major-name">${m.name}</span>
        <div class="bar"><div class="bar-fill" style="width:${m.fit}%"></div></div>
        <span class="pct">${m.fit}%</span>
      </div>`).join('')}
  </div>

  <div class="section">
    <div class="sec-label">${zh?"近期行动计划":"Action Plan"}</div>
    ${(P.next?.month||[]).map(s=>`<div class="arrow-item"><span class="arrow">→</span><span>${s}</span></div>`).join('')}
    <div class="highlight"><strong>${P.next?.key||''}</strong></div>
  </div>

  <div class="section">
    <div class="sec-label">${zh?"思维风格":"Thinking Style"}</div>
    <div class="grid">
      <div class="card">
        <div class="card-label">${zh?"认知风格":"Style"}</div>
        <div style="font-size:15px;font-weight:800;color:#6AAF3D;">${P.snap?.thinkingStyle||''}</div>
      </div>
      <div class="card">
        <div class="card-label">${zh?"成长提示":"Growth Area"}</div>
        <div style="font-size:11px;line-height:1.7;">${P.summary?.watchOut||''}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="sec-label">${zh?"活动现状评估":"Activity Assessment"}</div>
    <div class="body-text">${P.ec?.assessment||''}</div>
    ${P.ec?.narrative ? `<div class="highlight"><strong>${zh?"叙事主线":"Narrative"}:</strong> ${P.ec.narrative}</div>` : ''}
    ${(P.ec?.activities||[]).length ? `
    <div style="margin-top:12px;">
      ${(P.ec.activities||[]).map(a=>`
        <div style="margin-bottom:10px;padding:10px 12px;background:#F5F9F3;border-radius:8px;">
          <div style="font-size:10px;font-weight:800;color:#D97706;letter-spacing:1px;margin-bottom:4px;">${a.type||''}</div>
          <div style="font-size:12px;font-weight:700;color:#1A3A2A;margin-bottom:3px;">${a.action||''}</div>
          <div style="font-size:11px;color:#6B7B6B;">${a.when||''}</div>
        </div>`).join('')}
    </div>` : ''}
  </div>

  ${P.essay ? `
  <div class="section">
    <div class="sec-label">${zh?"文书方向":"Essay Strategy"}</div>
    <div class="body-text">${P.essay.coreNarrative||''}</div>
    ${(P.essay.ideas||[]).map(d=>`<div class="arrow-item"><span class="arrow">✦</span><span>${d}</span></div>`).join('')}
    ${P.essay.angle ? `<div class="highlight"><strong>${zh?"独特角度":"Unique Angle"}:</strong> ${P.essay.angle}</div>` : ''}
  </div>` : ''}

  <div class="footer">
    STARPATH AI · by StarWise International Education · ${new Date().toLocaleDateString(zh?'zh-CN':'en-US')}
  </div>
</div>
<script>
  document.title = "${docTitle}";
  window.onload = function() { window.print(); }
</script>
</body></html>`;

    const blob = new Blob([html], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onafterprint = () => { URL.revokeObjectURL(url); };
    }
    setTimeout(() => setDownloading(false), 500);
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: buildPrompt(newLang),
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
    <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <button className="lbtn" onClick={()=>setLang(l=>l==="zh"?"en":"zh")}>{t.lang}</button>

      {/* BG blobs */}
      {[[G.green,"−10%","−10%"],[G.greenLt,"80%","5%"],[G.sage,"35%","88%"]].map(([c,x,y],i)=>(
        <div key={i} style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:c,opacity:.04,filter:"blur(120px)",left:x,top:y,pointerEvents:"none"}}/>
      ))}

      <div className="anim-float" style={{marginBottom:22}}>
        <div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",boxShadow:`0 14px 36px ${G.green}45`}}><StarWiseLogo size={64}/></div>
      </div>

      <p style={{fontSize:10,letterSpacing:4,color:G.green,fontWeight:800,marginBottom:3,textTransform:"uppercase"}}>{t.brand}</p>
      <p style={{fontSize:9,letterSpacing:3,color:G.sage,fontWeight:700,marginBottom:24,opacity:.65,textTransform:"uppercase"}}>{t.byLine}</p>

      <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(28px,5.5vw,52px)",fontWeight:400,textAlign:"center",lineHeight:1.18,marginBottom:14,color:G.greenDk}}>
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
    const progress = (qi / TOTAL) * 100;
    return (
      <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column"}}>
        <style>{CSS}</style>
        <button className="lbtn" onClick={()=>{setLang(l=>l==="zh"?"en":"zh");resetAll();}}>{t.lang}</button>

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
            {/* Progress bar */}
            <div style={{height:3,background:"rgba(26,58,42,.07)",borderRadius:2,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,${G.green},${G.greenLt})`,width:`${progress}%`,transition:"width .4s cubic-bezier(.16,1,.3,1)",borderRadius:2}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",paddingBottom:12}}>
              <span style={{fontSize:12,color:secColor,fontWeight:700}}>{cq.secEmoji} {cq.secLabel}</span>
              <span style={{fontSize:12,opacity:.3,fontWeight:600}}>{qi+1} / {TOTAL}</span>
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
                    onClick={()=>setAns(p=>({...p,[cq.id]:o.v}))}>
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
                  <span style={{fontFamily:"'DM Serif Display',serif",fontSize:56,color:secColor,lineHeight:1}}>{ans[cq.id]||5}</span>
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

        {/* Fixed bottom button */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"linear-gradient(to top,#F5F9F3 72%,transparent)",padding:"20px 20px 24px"}}>
          <div style={{maxWidth:580,margin:"0 auto"}}>
            <button className="gbtn" disabled={!ok()} onClick={next}
              style={{width:"100%",padding:"14px",fontSize:14,background:ok()?G.green:"rgba(26,58,42,.06)",color:ok()?"#fff":"rgba(26,58,42,.18)",boxShadow:ok()?`0 8px 28px ${G.green}38`:"none"}}>
              {qi===TOTAL-1 ? t.generate : t.next}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GENERATING ─────────────────────────────────────────────────────────────
  if (phase === "gen") return (
    <div style={{minHeight:"100vh",background:G.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <style>{CSS}</style>
      <div style={{position:"relative",width:88,height:88}}>
        {[88,62,38].map((s,i)=>(
          <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:s,height:s,margin:`${-s/2}px 0 0 ${-s/2}px`,borderRadius:"50%",border:`2px solid ${[G.green,G.greenLt,G.sage][i]}`,borderTopColor:"transparent",animation:`spin ${1.7+i*.6}s linear infinite ${i%2?"reverse":""}` }}/>
        ))}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:G.green,fontSize:22}}>✦</div>
      </div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:G.greenDk}}>{t.loading[loadI]}{dots}</div>
      <div style={{fontSize:9,opacity:.22,letterSpacing:3,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>STARPATH AI</div>
    </div>
  );

  // ── EMAIL GATE ─────────────────────────────────────────────────────────────
  if (phase === "gate") {
    // launch confetti here too
    if (conf.length===0) {
      const items = Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,color:[G.green,G.greenLt,G.sage,"#A5D873"][i%4],sz:Math.random()*7+4,del:Math.random()*1.2,dur:Math.random()*2+1}));
      setConf(items);
      setTimeout(()=>setConf([]),4000);
    }
    return (
      <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
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
              <div style={{fontSize:8,fontWeight:700,color:G.sage,letterSpacing:2.5,textTransform:"uppercase",opacity:.7}}>{t.byLine}</div>
            </div>
          </div>

          <div style={{fontSize:32,marginBottom:10}}>🎉</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:24,fontWeight:400,color:G.greenDk,marginBottom:8,lineHeight:1.25}}>{t.gateTitle}</h2>
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
          <button onClick={submitGate}
            style={{width:"100%",background:"transparent",border:"none",padding:"8px",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
            {t.gateSkip}
          </button>
          <p style={{fontSize:10,color:G.muted,opacity:.45,textAlign:"center",marginTop:12,lineHeight:1.7}}>{t.gateNote}</p>
        </div>
      </div>
    );
  }

  // ── ERROR ───────────────────────────────────────────────────────────────────
  if (phase === "error") return (
    <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
      <style>{CSS}</style>
      <div style={{fontSize:48,marginBottom:16}}>😵</div>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,color:G.greenDk,marginBottom:8}}>{t.errTitle}</h2>
      <p style={{fontSize:13,color:G.muted,marginBottom:28,lineHeight:1.85,maxWidth:300}}>{t.errDesc}</p>
      <button className="gbtn" onClick={generate}
        style={{background:G.green,color:"#fff",padding:"12px 32px",fontSize:14,marginBottom:12}}>
        {t.retry}
      </button>
      <button onClick={()=>{setPhase("quiz");setQi(TOTAL-1);}}
        style={{background:"transparent",border:"none",color:G.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
        {t.backQ}
      </button>
    </div>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result" && profile) {
    const P  = profile;
    const zh = lang === "zh";
    const TABS = [
      {id:"summary",    label:t.t0, color:G.green},
      {id:"academic",   label:t.t1, color:G.blue},
      {id:"activities", label:t.t2, color:G.amber},
      {id:"send",       label:t.t4, color:G.sage},
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
      <div style={{minHeight:"100vh",background:G.cream,fontFamily:"'DM Sans',sans-serif",color:G.text}}>
        <style>{CSS}</style>
        <button className="lbtn" onClick={switchLang} style={{right:16,top:16,background:"rgba(26,58,42,.06)",border:"1px solid rgba(26,58,42,.12)",color:"rgba(26,58,42,.5)",padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:.3,position:"fixed",zIndex:200,transition:"all .2s",whiteSpace:"nowrap"}} title={t.switchLang}>{switching?t.switching:t.lang}</button>
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
              <span style={{fontSize:8,color:G.sage,fontWeight:700,letterSpacing:2,opacity:.55}}>· {t.byLine.toUpperCase()}</span>
            </div>

            {name && (
              <p style={{fontSize:12,color:G.muted,marginBottom:6,fontWeight:600}}>
                {name} · {t.rptTitle}
              </p>
            )}

            <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(26px,5vw,44px)",fontWeight:400,lineHeight:1.18,color:G.greenDk,marginBottom:10}}>
              {P.snap?.personality}
            </h1>
            <p style={{fontSize:15,color:G.muted,fontStyle:"italic",marginBottom:18,lineHeight:1.75,maxWidth:480,margin:"0 auto 18px"}}>{P.snap?.tagline}</p>

            <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
              <Pill>{t.grade(P.snap?.grade)}</Pill>
              <Pill>{t.school(P.snap?.schoolType)}</Pill>
              {(P.snap?.strengths||[]).map((s,i)=>(
                <Pill key={i} color={[G.green,G.blue,G.amber][i%3]}>⚡ {s}</Pill>
              ))}
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

          {/* ═══ SUMMARY ═══ */}
          {tab === "summary" && (
            <div className="anim-fade">
              {/* Headline insight */}
              <div className="card" style={{borderLeft:`4px solid ${G.green}`}}>
                <div className="sl">{t.lInsight}</div>
                <p style={{fontSize:15,lineHeight:1.9,color:G.greenDk,fontWeight:600,marginBottom:14}}>{P.summary?.headline}</p>
                <div style={{padding:"13px 16px",borderRadius:10,background:"rgba(106,175,61,.05)",border:"1px solid rgba(106,175,61,.15)"}}>
                  <p style={{fontSize:13,lineHeight:1.85,color:G.text}}>{P.summary?.keyInsight}</p>
                </div>
              </div>


              {/* ── Radar Chart ── */}
              {P.radar && (() => {
                const axes = t.rAxes;
                const vals = [P.radar.academicDepth, P.radar.creativity, P.radar.leadership, P.radar.execution, P.radar.communication, P.radar.empathy];
                const data = axes.map((a,i) => ({ subject: a, value: vals[i], fullMark: 100 }));
                const CustomDot = (props) => {
                  const { cx, cy, value } = props;
                  return <circle cx={cx} cy={cy} r={4} fill={G.green} stroke="#fff" strokeWidth={2} />;
                };
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
                      <RadarChart data={data} margin={{top:10,right:28,bottom:10,left:28}}>
                        <defs>
                          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={G.green} stopOpacity={0.25}/>
                            <stop offset="100%" stopColor={G.green} stopOpacity={0.05}/>
                          </radialGradient>
                        </defs>
                        <PolarGrid
                          gridType="polygon"
                          stroke="rgba(26,58,42,.08)"
                        />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={({ x, y, payload, cx, cy }) => {
                            const dx = x - cx;
                            const dy = y - cy;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            const nx = x + (dx/dist)*10;
                            const ny = y + (dy/dist)*10;
                            const val = data.find(d=>d.subject===payload.value)?.value;
                            return (
                              <g>
                                <text x={nx} y={ny-7} textAnchor="middle" dominantBaseline="middle"
                                  style={{fontSize:10,fontWeight:700,fill:"rgba(26,58,42,.5)",fontFamily:"'DM Sans',sans-serif"}}>
                                  {payload.value}
                                </text>
                                <text x={nx} y={ny+8} textAnchor="middle" dominantBaseline="middle"
                                  style={{fontSize:11,fontWeight:800,fill:G.green,fontFamily:"'DM Sans',sans-serif"}}>
                                  {val}
                                </text>
                              </g>
                            );
                          }}
                        />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Radar
                          dataKey="value"
                          stroke={G.green}
                          strokeWidth={2}
                          fill="url(#radarFill)"
                          dot={<CustomDot/>}
                          activeDot={{r:6, fill:G.greenDk, stroke:"#fff", strokeWidth:2}}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    {/* Score badges */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginTop:4}}>
                      {data.map((d,i)=>{
                        const clr = d.value>=80 ? G.green : d.value>=65 ? G.blue : G.amber;
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

              {/* 2-col: style + growth */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div className="card" style={{background:"rgba(106,175,61,.04)",borderColor:"rgba(106,175,61,.15)",marginBottom:0}}>
                  <div className="sl">{t.lStyle}</div>
                  <div style={{fontSize:17,fontWeight:800,color:G.green,marginBottom:8}}>{P.snap?.thinkingStyle}</div>
                  <p style={{fontSize:12,color:G.muted,lineHeight:1.75}}>{P.academic?.learningStyle}</p>
                </div>
                <div className="card" style={{background:"rgba(212,119,6,.04)",borderColor:"rgba(212,119,6,.12)",marginBottom:0}}>
                  <div className="sl">{t.lGrowth}</div>
                  <p style={{fontSize:13,color:G.text,lineHeight:1.75}}>{P.summary?.watchOut}</p>
                </div>
              </div>

              {/* Majors preview */}
              <div className="card">
                <div className="sl">{t.lMajors}</div>
                {(P.majors||[]).map((m,i)=>(
                  <div key={i} style={{paddingBottom:11,marginBottom:11,borderBottom:i<(P.majors.length-1)?"1px solid rgba(26,58,42,.05)":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:13,fontWeight:700,color:G.greenDk}}>{m.name}</span>
                    </div>
                    <Bar score={m.fit}/>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div className="card" style={{background:"rgba(106,175,61,.03)",borderColor:"rgba(106,175,61,.12)"}}>
                <div className="sl">{t.lNextMonth}</div>
                {(P.next?.month||[]).map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <span style={{color:G.green,fontWeight:900,flexShrink:0,marginTop:2}}>→</span>
                    <span style={{fontSize:13,lineHeight:1.7,color:G.text}}>{s}</span>
                  </div>
                ))}
                <div style={{marginTop:14,padding:"12px 15px",borderRadius:10,background:"rgba(106,175,61,.07)",border:"1px solid rgba(106,175,61,.2)"}}>
                  <div style={{fontSize:9,fontWeight:800,color:G.green,letterSpacing:2,marginBottom:6}}>✦ {t.lNextKey.toUpperCase()}</div>
                  <p style={{fontSize:13,fontWeight:700,color:G.greenDk,lineHeight:1.75}}>{P.next?.key}</p>
                </div>
              </div>

              {/* Send CTA banner */}
              <div className="card" style={{background:G.greenDk,border:"none",textAlign:"center",padding:"28px 24px"}}>
                <div style={{fontSize:22,marginBottom:10}}>📤</div>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,fontWeight:400,color:"#fff",marginBottom:8}}>{t.sendTitle}</h3>
                <p style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.85,marginBottom:18,maxWidth:320,margin:"0 auto 18px"}}>{t.sendDesc}</p>
                <button className="gbtn" onClick={()=>setTab("send")}
                  style={{background:G.green,color:"#fff",padding:"11px 26px",fontSize:13,boxShadow:`0 6px 20px ${G.green}55`}}>
                  {t.sendBtn} →
                </button>
              </div>
            </div>
          )}

          {/* ═══ ACADEMICS ═══ */}
          {tab === "academic" && (
            <div className="anim-fade">
              <div className="card">
                <div className="sl">{t.lCurriosity}</div>
                <p style={{fontSize:14,color:G.text,lineHeight:1.9,marginBottom:16}}>{P.academic?.curiosity}</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {(P.academic?.domains||[]).map((d,i)=>(
                    <div key={i} style={{padding:"9px 15px",borderRadius:10,background:"rgba(106,175,61,.07)",border:"1px solid rgba(106,175,61,.18)",fontSize:13,fontWeight:700,color:G.greenDk}}>{d}</div>
                  ))}
                </div>
              </div>

              {/* Major detail */}
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
                        {(m.courses||[]).map((c,i)=><div key={i} style={{fontSize:12,color:G.muted,marginBottom:5,paddingLeft:8,borderLeft:"2px solid rgba(59,130,246,.25)",lineHeight:1.5}}>{c}</div>)}
                      </div>
                      <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(106,175,61,.05)",border:"1px solid rgba(106,175,61,.12)"}}>
                        <div style={{fontSize:8,fontWeight:800,color:G.green,marginBottom:8,letterSpacing:2}}>{t.lCareers.toUpperCase()}</div>
                        {(m.careers||[]).map((c,i)=><div key={i} style={{fontSize:12,color:G.muted,marginBottom:5,paddingLeft:8,borderLeft:"2px solid rgba(106,175,61,.25)",lineHeight:1.5}}>{c}</div>)}
                      </div>
                    </div>
                  </div>
                );})()}
              </div>

              {/* Course strategy */}
              <div className="card">
                <div className="sl">{t.lCourseStrat}</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.9,marginBottom:16}}>{P.courses?.note}</p>
                <div style={{fontSize:8,fontWeight:800,color:G.green,letterSpacing:2,marginBottom:10}}>{t.lApIb.toUpperCase()}</div>
                {(P.courses?.apib||[]).map((c,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",borderRadius:9,background:"rgba(106,175,61,.04)",border:"1px solid rgba(106,175,61,.1)",marginBottom:7,alignItems:"flex-start"}}>
                    <span style={{color:G.green,fontWeight:800,fontSize:11,minWidth:18,flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
                    <span style={{fontSize:13,color:G.text,lineHeight:1.65}}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ ACTIVITIES ═══ */}
          {tab === "activities" && (
            <div className="anim-fade">
              <div className="card">
                <div className="sl">{t.lEcAssess}</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.9,marginBottom:14}}>{P.ec?.assessment}</p>
                <div style={{padding:"12px 15px",borderRadius:10,background:"rgba(212,119,6,.05)",border:"1px solid rgba(212,119,6,.15)"}}>
                  <div style={{fontSize:8,fontWeight:800,color:G.amber,letterSpacing:2,marginBottom:7}}>{t.lNarrative.toUpperCase()}</div>
                  <p style={{fontSize:13,color:G.text,fontWeight:600,lineHeight:1.8}}>{P.ec?.narrative}</p>
                </div>
                {(P.ec?.gaps||[]).length>0 && (
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:14,alignItems:"center"}}>
                    <span style={{fontSize:10,color:G.muted,fontWeight:700}}>{t.lGaps}:</span>
                    {P.ec.gaps.map((g,i)=><Pill key={i} color={G.rose}>⚠ {g}</Pill>)}
                  </div>
                )}
              </div>

              {/* Recommended activities */}
              <div className="card">
                <div className="sl">{t.lRec}</div>
                <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
                  {(P.ec?.activities||[]).map((a,i)=>(
                    <button key={i} className="tbtn" onClick={()=>setEcI(i)}
                      style={{borderColor:ecI===i?`${G.amber}40`:"rgba(26,58,42,.08)",color:ecI===i?G.amber:"rgba(26,58,42,.35)",background:ecI===i?`${G.amber}09`:"transparent",fontSize:11}}>
                      {a.type}
                    </button>
                  ))}
                </div>
                {(P.ec?.activities||[])[ecI] && (()=>{const a=P.ec.activities[ecI];return(
                  <div key={ecI} className="anim-fade" style={{borderRadius:12,border:"1px solid rgba(212,119,6,.15)",overflow:"hidden"}}>
                    <div style={{padding:"15px 18px",borderBottom:"1px solid rgba(26,58,42,.05)"}}>
                      <div style={{fontSize:8,fontWeight:800,color:G.amber,letterSpacing:2,marginBottom:7}}>{t.lAction.toUpperCase()}</div>
                      <p style={{fontSize:14,fontWeight:700,color:G.greenDk,lineHeight:1.7}}>{a.action}</p>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                      <div style={{padding:"12px 15px",borderRight:"1px solid rgba(26,58,42,.05)"}}>
                        <div style={{fontSize:8,color:G.muted,fontWeight:800,marginBottom:6,letterSpacing:1}}>{t.lWhy.toUpperCase()}</div>
                        <p style={{fontSize:12,color:G.muted,lineHeight:1.7}}>{a.why}</p>
                      </div>
                      <div style={{padding:"12px 15px"}}>
                        <div style={{fontSize:8,color:G.muted,fontWeight:800,marginBottom:6,letterSpacing:1}}>{t.lTimeline.toUpperCase()}</div>
                        <p style={{fontSize:12,color:G.muted,lineHeight:1.7}}>{a.when}</p>
                      </div>
                    </div>
                  </div>
                );})()}
              </div>

              {/* Essay */}
              <div className="card" style={{background:"rgba(124,58,237,.03)",borderColor:"rgba(124,58,237,.12)"}}>
                <div className="sl">{t.lEssay}</div>
                <p style={{fontSize:13,color:G.text,lineHeight:1.9,marginBottom:14}}>{P.essay?.coreNarrative}</p>
                {(P.essay?.ideas||[]).map((d,i)=>(
                  <div key={i} style={{display:"flex",gap:9,marginBottom:9,alignItems:"flex-start"}}>
                    <span style={{color:G.purple,fontWeight:900,flexShrink:0}}>✦</span>
                    <span style={{fontSize:13,color:G.text,lineHeight:1.75}}>{d}</span>
                  </div>
                ))}
                <div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)"}}>
                  <div style={{fontSize:8,fontWeight:800,color:G.purple,letterSpacing:2,marginBottom:7}}>{t.lAngle.toUpperCase()}</div>
                  <p style={{fontSize:13,color:G.text,fontWeight:600,lineHeight:1.75}}>{P.essay?.angle}</p>
                </div>
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
                          style={{padding:"20px 16px",borderRadius:14,background:"#fff",border:`2px solid rgba(26,58,42,.09)`,cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}
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
                      <textarea className="ifield" rows={3} value={note} onChange={e=>setNote(e.target.value)}
                        placeholder={t.notePH} style={{resize:"none",lineHeight:1.75,marginBottom:14}}/>
                      <button className="gbtn" onClick={doSend} disabled={sending}
                        style={{width:"100%",padding:"13px",fontSize:14,background:G.green,color:"#fff",boxShadow:`0 6px 22px ${G.green}30`,marginBottom:10}}>
                        {sending ? t.sending : t.sendBtn}
                      </button>
                      <button onClick={()=>setSendMode(null)} style={{width:"100%",background:"transparent",border:"none",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,padding:"6px"}}>{t.back}</button>
                    </div>
                  )}

                  {/* Own counselor form */}
                  {sendMode === "own" && (
                    <div className="card anim-pop">
                      <div className="sl">{t.optOwn.toUpperCase()}</div>
                      <input className="ifield" type="email" value={cEmail} onChange={e=>setCEmail(e.target.value)}
                        placeholder={t.counselorEmail} style={{marginBottom:10}}/>
                      <textarea className="ifield" rows={3} value={note} onChange={e=>setNote(e.target.value)}
                        placeholder={t.notePH} style={{resize:"none",lineHeight:1.75,marginBottom:14}}/>
                      <button className="gbtn" onClick={doSend} disabled={!cEmail.includes("@")||sending}
                        style={{width:"100%",padding:"13px",fontSize:14,background:G.sage,color:"#fff",marginBottom:10}}>
                        {sending ? t.sending : t.sendBtn}
                      </button>
                      <button onClick={()=>setSendMode(null)} style={{width:"100%",background:"transparent",border:"none",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,padding:"6px"}}>{t.back}</button>
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
                          navigator.clipboard.writeText(baseUrl).then(()=>{
                            setShareCopied(true); setTimeout(()=>setShareCopied(false),3000);
                          });
                        }}
                          style={{width:"100%",padding:"11px 16px",borderRadius:10,background:`${G.green}10`,border:`1.5px solid ${G.green}30`,fontSize:13,fontWeight:700,color:G.green,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16,transition:"all .2s"}}>
                          🌟 {t.inviteBtn} {shareCopied?"✓":"→"}
                        </button>
                      </div>

                      {/* Share report link */}
                      <div style={{marginBottom:14}}>
                        <p style={{fontSize:12,color:G.muted,lineHeight:1.75,marginBottom:10}}>{t.shareDesc}</p>
                        <button onClick={shareReport}
                          style={{width:"100%",padding:"11px 16px",borderRadius:10,background:shareCopied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1.5px solid ${shareCopied?G.green+"50":"rgba(26,58,42,.1)"}`,fontSize:13,fontWeight:700,color:shareCopied?G.green:G.greenDk,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                          {shareCopied ? <>✓ {t.shareCopied}</> : <>🔗 {t.shareLink}</>}
                        </button>
                      </div>

                      {/* Download PDF */}
                      <button onClick={downloadPDF} disabled={downloading}
                        style={{width:"100%",padding:"11px 16px",borderRadius:10,background:"rgba(26,58,42,.04)",border:"1.5px solid rgba(26,58,42,.1)",fontSize:13,fontWeight:700,color:G.greenDk,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,transition:"all .2s"}}>
                        {downloading ? `⏳ ${t.downloading}` : `📄 ${t.downloadPdf}`}
                      </button>

                      {/* Copy text + Restart */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <button onClick={copyLink}
                          style={{flex:1,padding:"9px 14px",borderRadius:9,background:copied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1px solid ${copied?G.green+"40":"rgba(26,58,42,.09)"}`,fontSize:12,fontWeight:700,color:copied?G.green:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}>
                          {copied ? t.copied : `📋 ${t.copyLink}`}
                        </button>
                        <button onClick={resetAll}
                          style={{padding:"9px 14px",borderRadius:9,background:"rgba(26,58,42,.04)",border:"1px solid rgba(26,58,42,.09)",fontSize:12,fontWeight:700,color:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
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
                    <div style={{fontSize:44,marginBottom:12}}>📧</div>
                    <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:22,fontWeight:400,color:G.greenDk,marginBottom:8}}>{t.sentTitle}</h3>
                    <p style={{fontSize:13,color:G.muted,lineHeight:1.85,maxWidth:300,margin:"0 auto"}}>{t.sentDesc}</p>
                  </div>
                  <div style={{borderTop:"1px solid rgba(26,58,42,.07)",paddingTop:20}}>
                    <div className="sl">{zh?"同时分享给家长或好友":"ALSO SHARE WITH PARENTS OR FRIENDS"}</div>
                    <button onClick={shareReport}
                      style={{width:"100%",padding:"11px 16px",borderRadius:10,background:shareCopied?`${G.green}08`:"rgba(26,58,42,.04)",border:`1.5px solid ${shareCopied?G.green+"50":"rgba(26,58,42,.1)"}`,fontSize:13,fontWeight:700,color:shareCopied?G.green:G.greenDk,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
                      {shareCopied ? <>✓ {t.shareCopied}</> : <>🔗 {t.shareLink}</>}
                    </button>
                    <button onClick={downloadPDF}
                      style={{width:"100%",padding:"11px 16px",borderRadius:10,background:"rgba(26,58,42,.04)",border:"1.5px solid rgba(26,58,42,.1)",fontSize:13,fontWeight:700,color:G.greenDk,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
                      📄 {t.downloadPdf}
                    </button>
                    <button onClick={resetAll}
                      style={{width:"100%",padding:"9px",borderRadius:9,background:"transparent",border:"none",fontSize:12,fontWeight:700,color:G.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      🔄 {t.restart}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Bottom restart (non-send tabs) ── */}
          {tab !== "send" && (
            <div style={{textAlign:"center",marginTop:36,paddingTop:24,borderTop:"1px solid rgba(26,58,42,.06)"}}>
              <button className="gbtn" onClick={resetAll}
                style={{background:"transparent",border:"2px solid rgba(26,58,42,.1)",color:"rgba(26,58,42,.28)",padding:"9px 22px",fontSize:12}}>
                {t.restart}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
