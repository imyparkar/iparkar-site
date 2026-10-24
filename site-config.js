/* =====================================================================
   iParkar HSE Academy — SITE CONTENT
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit for day-to-day changes:
   text, links, certifications, prices and buttons all live here.
   Layout and styling live in styles.css; behaviour lives in app.js.

   Tips
   - Keep the quotes and commas exactly as they are around your text.
   - To add a list item, copy an existing line ("...",) and edit it.
   - To add a certification, copy a whole { id: ... } block in
     `certifications.items` and change its values.
   - Free practice questions live in questions-free.js.
   ===================================================================== */

window.SITE = {

  /* ---------- Brand & global ---------- */
  brand: {
    name: "iParkar",
    fullName: "iParkar HSE Academy",
    logo: "assets/iparkar-mark-primary.svg",
    contactEmail: "imran@iparkar.com",          // <-- change to your real address
    linkedin: "https://www.linkedin.com/in/imran-parkar-181745160/",      // <-- your LinkedIn profile URL
  },

  /* Top-right button in the nav bar (the one blue button on the page). */
  navAction: { label: "Sign in", href: "https://app.iparkar.com/login" },

  /* ---------- Tabs (order = order on the page) ----------
     id must match a section below. Set show:false to hide a tab. */
  tabs: [
    { id: "about",          label: "About me",               show: true },
    { id: "certifications", label: "Certification pathways", show: true },
    { id: "courses",        label: "Certificate courses",    show: true },
    { id: "quiz",           label: "Live quiz",              show: true },
    { id: "practice",       label: "Practice exam",          show: true },
  ],

  /* ---------- Tab 1: About me ---------- */
  about: {
    // Hero line. The word in `highlight` gets the marigold pill.
    heroBefore: "Learn safety.",
    highlight: "Pass",
    heroAfter: "with confidence.",
    lead: "Practical HSE training, quizzes and exam practice from a working HSE Manager in the oil and gas sector.",
    heroButtons: [
      { label: "Try 10 free questions", href: "#practice", style: "ghost" },
      { label: "See certification pathways", href: "#certifications", style: "text" },
    ],

    name: "Imran Parkar",
    role: "HSE Professional",
    paragraphs: [
      "I’m Imran Parkar, an HSE Professional based in Kuwait with 16 years of experience in health, safety and environmental management across the oil and gas sector. I currently lead HSE for NBTC on Kuwait Oil Company’s gas facilities maintenance and operations contract, covering sites in North Kuwait, West Kuwait and CNT Subiya. My work spans HSE compliance, Permit to Work, fleet safety, heat stress management and building practical documentation that keeps people safe on site.",
      "I hold the CSP, CIH, CIT, CFPS and PMP credentials and am a Chartered Member of IOSH. I believe that safety is learned best through clear, practical training. That’s why I built this site: to share HSE training materials, quizzes and resources that help emerging safety professionals build their knowledge and confidence.",
    ],
    closing: "If you’re starting out in HSE or preparing for a certification, you’re in the right place.",

    credentials: ["CSP", "CIH", "CIT", "CFPS", "PMP", "CMIOSH"],

    // Feature cards under the bio. color: marigold | coral | sky | dark | white
    highlights: [
      { title: "16 years in HSE",        body: "Oil and gas operations, maintenance and contractor safety.", color: "marigold" },
      { title: "Permit to Work",         body: "Compliance, audits and awareness sessions that change behaviour on site.", color: "sky" },
      { title: "Heat stress & fleet safety", body: "Practical programmes built for Gulf working conditions.", color: "dark" },
    ],
  },

  /* ---------- Tab 2: Certification pathways ----------
     Each certification has three sections. Every list item is plain text;
     `links` become buttons. Content summarised from the official pages on
     the date in `lastChecked` — always confirm on the official site. */
  certifications: {
    title: "Certification pathways",
    lead: "What each credential asks of you, how to apply, and how to prepare.",
    disclaimer: "iParkar is independent and is not affiliated with, endorsed by or sponsored by BCSP, BGC or NFPA. ASP®, CSP®, CIH®, QEP, CFPS® and related marks belong to their owners. Requirements and fees change — always confirm on the official site before you apply.",
    items: [
      {
        id: "asp",
        short: "ASP",
        name: "Associate Safety Professional®",
        body: "BCSP",
        officialUrl: "https://www.bcsp.org/associate-safety-professional-asp",
        lastChecked: "24 Oct 2026",
        summary: "The foundation BCSP credential for safety practitioners — and a qualifying credential on the road to the CSP.",
        requirements: [
          "At least a bachelor’s degree in any field, or an associate degree in safety, health or environment (with at least four SH&E courses — 12 semester / 18 quarter hours — in ASP blueprint domains).",
          "One year of safety, health and environment experience, at least half of it preventive, professional-level work with breadth and depth of safety duties.",
          "Pass the ASP examination.",
          "Keep the credential active: annual renewal fee plus recertification points every five years.",
          "Degrees from outside the United States are evaluated for U.S. equivalency during the application.",
          "You must disclose any criminal convictions or actions against a professional licence or credential.",
        ],
        application: [
          "Create an account in BCSP’s “My Profile” portal and start a new application from the Applications menu.",
          "Submit the application and pay the application fee; BCSP then reviews your eligibility.",
          "Once approved, you have one year to take and pass the exam.",
          "Buy the exam (US$350 for a single attempt at the time of checking — see BCSP’s Credentials At-A-Glance for current fees), either bundled with the application or afterwards.",
          "Schedule through the single sign-on link to Pearson VUE and sit the computer-based exam at a test centre. Results are available as soon as you submit.",
          "If you need a retake, the next attempt must be at least six weeks after the last one.",
        ],
        prep: [
          "Download the ASP exam blueprint and build your study plan around its domain weightings.",
          "Work through the ASP reference list — focus on calculations, toxicology, ergonomics and management systems.",
          "Practise timed, mixed-topic questions until you consistently score well above your target.",
          "Use the free 10-question sample here, then the full premium bank for timed mock exams.",
        ],
        links: [
          { label: "ASP blueprint (PDF)",  href: "https://www.bcsp.org/hubfs/Website/Blueprints-References/ASP-Blueprint.pdf" },
          { label: "ASP references (PDF)", href: "https://www.bcsp.org/hubfs/Website/Blueprints-References/ASP-References.pdf" },
          { label: "Fees: At-A-Glance (PDF)", href: "https://www.bcsp.org/hubfs/Website/Downloads-PDFs-and-PPTs/BCSP-At-A-Glance.pdf" },
          { label: "Official ASP page", href: "https://www.bcsp.org/associate-safety-professional-asp" },
        ],
      },
      {
        id: "csp",
        short: "CSP",
        name: "Certified Safety Professional®",
        body: "BCSP",
        officialUrl: "https://www.bcsp.org/certified-safety-professional-csp",
        lastChecked: "24 Oct 2026",
        summary: "BCSP’s flagship credential for safety leaders who run safety management systems and shape culture.",
        requirements: [
          "At least a bachelor’s degree.",
          "Four years of safety, health and environment experience, at least half of it preventive, professional-level work with breadth and depth of safety duties.",
          "A BCSP qualified credential — for example ASP, GSP, TSP, CIH, CMIOSH/CFIOSH, CRSP, NEBOSH National or International Diploma, or an AICTE-recognised Diploma/Certificate in Industrial Safety (India). See BCSP’s page for the full list.",
          "Pass the CSP examination.",
          "Keep the credential active: annual renewal fee plus recertification points every five years.",
          "Degrees from outside the United States are evaluated for U.S. equivalency; all education requirements must be met.",
        ],
        application: [
          "Log in to BCSP’s “My Profile” portal and start a CSP application from the Applications menu.",
          "Upload evidence of your degree, experience and qualified credential, then pay the application fee.",
          "Once approved, you have one year to take and pass the exam.",
          "Buy the exam (US$350 for a single attempt at the time of checking — confirm current fees on BCSP’s At-A-Glance).",
          "Schedule with Pearson VUE through single sign-on and sit the computer-based exam; results are immediate.",
          "Retakes must be at least six weeks after your previous attempt.",
        ],
        prep: [
          "Map your study plan to the CSP blueprint domains and their weightings.",
          "Expect scenario-based questions on safety management systems, risk assessment and leadership — not just recall.",
          "Refresh the maths: rates, statistics, ventilation, noise and engineering economics.",
          "Finish with full-length timed mocks to build exam stamina.",
        ],
        links: [
          { label: "CSP blueprint (PDF)",  href: "https://www.bcsp.org/hubfs/Website/Blueprints-References/CSP-Blueprint.pdf" },
          { label: "CSP references (PDF)", href: "https://www.bcsp.org/hubfs/Website/Blueprints-References/CSP-References.pdf" },
          { label: "Fees: At-A-Glance (PDF)", href: "https://www.bcsp.org/hubfs/Website/Downloads-PDFs-and-PPTs/BCSP-At-A-Glance.pdf" },
          { label: "Official CSP page", href: "https://www.bcsp.org/certified-safety-professional-csp" },
        ],
      },
      {
        id: "cfps",
        short: "CFPS",
        name: "Certified Fire Protection Specialist®",
        body: "NFPA",
        officialUrl: "https://www.nfpa.org/en/for-professionals/certification/cfps",
        lastChecked: "24 Oct 2026",
        summary: "NFPA’s credential for professionals who reduce fire loss through applied fire protection knowledge.",
        requirements: [
          "Eligibility combines education and fire-protection work experience. The exact routes are set out in NFPA’s CFPS Candidate Handbook — read it before you apply.",
        ],
        application: [
          "The application steps, fees and exam rules are set out in the CFPS Candidate Handbook.",
          "Applications are made online through NFPA’s certification portal.",
        ],
        prep: [
          "Follow NFPA’s official CFPS learning path.",
          "The exam is built on the NFPA Fire Protection Handbook — know its structure well.",
          "Practise mixed questions across fire science, detection, suppression and life safety.",
        ],
        links: [
          // Paste the direct PDF link to the current handbook here when you have it:
          { label: "CFPS Candidate Handbook", href: "https://www.nfpa.org/en/for-professionals/certification/cfps" },
          { label: "NFPA learning path", href: "https://www.nfpa.org/en/for-professionals/certification/cfps#learning-path" },
        ],
      },
      {
        id: "cih",
        short: "CIH",
        name: "Certified Industrial Hygienist®",
        body: "BGC (Board for Global EHS Credentialing)",
        officialUrl: "https://gobgc.org/cih/",
        lastChecked: "24 Oct 2026",
        summary: "The leading credential for industrial hygiene and occupational and environmental health and safety (OEHS) professionals who anticipate, recognise, evaluate and control workplace health hazards.",
        requirements: [
          "A bachelor’s or higher degree from an accredited institution, including 60 semester hours in science, maths, engineering or science-based technology — at least 15 of them at junior, senior or graduate level.",
          "Industrial hygiene coursework: 180 academic hours or 240 continuing-education contact hours, at least half covering IH/OEHS fundamentals, toxicology, measurements and controls.",
          "At least two contact hours of ethics coursework.",
          "Four years (48 months) of professional-level industrial hygiene experience, and active practice at the time you apply. An ABET-accredited IH degree can reduce this by up to one year.",
          "Agree to the BGC Code of Ethics and Ethics Case Procedures.",
          "Keep the credential active with an annual maintenance fee and BGC’s certification maintenance (recertification) process.",
        ],
        application: [
          "Read the CIH Candidate Handbook in full before you start.",
          "Create an account in the BGC Portal and submit your application: transcripts (unofficial copies are accepted at first), coursework, and a description of your IH experience.",
          "Degrees from outside the U.S. or Canada need a credential evaluation.",
          "Pay the application fee (US$160 at the time of checking).",
          "Once approved, pay the exam fee (US$370 at the time of checking) and schedule at a Pearson VUE test centre.",
          "Exams run in two windows a year — spring (April–May, apply by 1 February) and fall (October–November, apply by 1 August). Approval stays active for four windows (two years).",
          "The exam has 180 multiple-choice questions (150 scored) in two 2.5-hour sections, with an on-screen calculator.",
        ],
        prep: [
          "Study across all the tested areas: air sampling and instrumentation, toxicology, ventilation and engineering controls, noise, radiation, thermal stress, ergonomics, biohazards, biostatistics and epidemiology, and IH program management.",
          "Drill the calculations — ventilation, sampling volumes, noise, radiation and exposure averaging — until they’re fast and reliable.",
          "Practise with the on-screen calculator only; personal calculators aren’t allowed.",
          "Book your exam window early and plan around the 1 February / 1 August deadlines.",
        ],
        links: [
          { label: "CIH Candidate Handbook", href: "https://gobgc.org/updated-applicant-cih-handbook/" },
          { label: "Official CIH page", href: "https://gobgc.org/cih/" },
        ],
      },
      {
        id: "qep",
        short: "QEP",
        name: "Qualified Environmental Professional",
        body: "BGC (Board for Global EHS Credentialing)",
        officialUrl: "https://gobgc.org/qep/",
        lastChecked: "24 Oct 2026",
        summary: "An international, multi-media, multidisciplinary credential for environmental professionals. The exams contain no country-specific regulations.",
        requirements: [
          "Route 1: a bachelor’s degree in environmental, physical, earth or natural sciences, engineering or mathematics, plus at least five years of professional environmental experience. An EHAC-accredited environmental master’s counts for one year of experience.",
          "Or a bachelor’s degree in any discipline plus at least eight years of professional environmental experience.",
          "Route 2 (under five years’ experience): earn the EPI designation first, then complete the QEP once you have five years of experience.",
          "Three professional references from environmental professionals (supervisors, co-workers, clients).",
          "Agree to the BGC Code of Ethics and Ethics Case Procedures.",
        ],
        application: [
          "Submit the QEP application form (there is a separate form if you already hold the CIH).",
          "Arrange for at least three environmental professionals to complete the Professional Reference Questionnaire — it’s your job to make sure all three arrive.",
          "Pass the General Environmental Science (GES) exam and the QEP exam. EPI holders don’t retake the GES.",
          "Pay fees by the due date — see the QEP Candidate Handbook for current amounts and exam details.",
        ],
        prep: [
          "Download the 2024 GES and QEP exam blueprints from the official page and map your study plan to them.",
          "Expect broad, multi-media coverage — air, water, waste, remediation, environmental management systems — rather than local law.",
          "If you hold the CIH, check the CIH-holder route in the handbook.",
        ],
        links: [
          { label: "QEP Candidate Handbook", href: "https://gobgc.org/updated-qep-handbook/" },
          { label: "Official QEP page", href: "https://gobgc.org/qep/" },
        ],
      },
      {
        id: "epi",
        short: "EPI",
        name: "Environmental Professional In-training",
        body: "BGC (Board for Global EHS Credentialing)",
        officialUrl: "https://gobgc.org/qep/",
        lastChecked: "24 Oct 2026",
        note: "EPI is an interim designation, not a credential. It is a stepping stone for students and early-career professionals working towards the QEP.",
        summary: "An in-training designation for final-year students and early-career environmental professionals, valid for up to seven years on the way to the QEP.",
        requirements: [
          "Be in the final (senior) year of a bachelor’s programme in environmental, physical, earth or natural sciences, engineering or mathematics — or an early-career professional who already holds such a degree.",
          "At least three references who know your academic work, such as professors or course instructors.",
          "Pass the General Environmental Science (GES) exam.",
        ],
        application: [
          "Confirm you meet the education requirement.",
          "Submit the EPI application form.",
          "Have at least three referees complete the Professional Reference Questionnaire.",
          "Pass the GES exam — passing awards the EPI designation.",
          "Within seven years, gain five years of professional environmental experience and pass the QEP exam to become a QEP (no GES retake needed).",
        ],
        prep: [
          "Use the GES exam blueprint on the official QEP page as your syllabus.",
          "Revise core environmental science from your degree — chemistry, biology, earth science and basic engineering maths.",
        ],
        links: [
          { label: "EPI Candidate Handbook", href: "https://gobgc.org/updated-practitioners-epi-handbook/" },
          { label: "Official QEP / EPI page", href: "https://gobgc.org/qep/" },
        ],
      },
    ],
  },

  /* ---------- Tab: Certificate courses ----------
     Taught qualifications you study with an approved provider.
     Copy a { id: ... } block to add another course. */
  courses: {
    title: "Certificate courses",
    lead: "Recognised IOSH and NEBOSH qualifications, what they involve, and where they lead.",
    note: "IOSH & NEBOSH courses can be only enrolled through Learning Partners only.",
    disclaimer: "iParkar is independent and is not affiliated with IOSH or NEBOSH. Course details summarised from the official pages on the date shown — always confirm with the awarding body or your Learning Partner.",
    items: [
      {
        id: "iosh-diploma",
        provider: "IOSH",
        name: "IOSH Level 6 Diploma",
        level: "Level 6 · degree level",
        color: "dark",
        officialUrl: "https://iosh.com/qualifications-and-courses/qualifications/iosh-diploma",
        lastChecked: "24 Oct 2026",
        summary: "A business-focused qualification for OSH professionals who lead and manage safety at senior level.",
        facts: [
          { label: "Entry", value: "No mandatory entry requirements. IOSH strongly recommends the IOSH Level 3 Certificate (or equivalent) and/or relevant experience. English at IELTS 7.0 or equivalent where English isn’t widely spoken. You must join IOSH as a member before starting." },
          { label: "Units", value: "1. Advanced OSH management principles · 2. OSH integration within an organisation · 3. Leading and influencing in OSH." },
          { label: "Assessment", value: "No written exams. One workplace-based assignment per unit — a management-system self-critique, a strategic proposal with presentation and assessor questioning, and a reflective statement." },
          { label: "Duration", value: "Typically 18–24 months." },
          { label: "Leads to", value: "Certified membership (CertIOSH) — one step from Chartered membership (CMIOSH)." },
        ],
      },
      {
        id: "iosh-certificate",
        provider: "IOSH",
        name: "IOSH Level 3 Certificate",
        level: "Level 3",
        color: "sky",
        officialUrl: "https://iosh.com/qualifications-and-courses/qualifications/iosh-certificate",
        lastChecked: "24 Oct 2026",
        summary: "For new and aspiring OSH professionals, and supervisors and managers with safety responsibilities.",
        facts: [
          { label: "Entry", value: "No formal entry requirements stated." },
          { label: "Units", value: "1. OSH principles and management systems · 2. Risk management · 3. Incident management · 4. Improving OSH performance and culture." },
          { label: "Assessment", value: "An 80-question multiple-choice exam (2 hours, 70% pass mark) and a scenario-based assessment (2 hours, 50% pass mark) covering an inspection, a risk assessment, an incident investigation and a toolbox talk. Both online with remote invigilation." },
          { label: "Leads to", value: "Technical membership of IOSH (TechIOSH), and a strong base for the IOSH Diploma." },
        ],
      },
      {
        id: "nebosh-diploma",
        provider: "NEBOSH",
        name: "NEBOSH Level 6 International Diploma for Occupational Health and Safety Management Professionals",
        level: "RQF Level 6 · 42 credits",
        color: "marigold",
        officialUrl: "https://www.nebosh.org.uk/qualifications/international-diploma-for-health-and-safety-management-professionals/",
        lastChecked: "24 Oct 2026",
        summary: "For health and safety professionals, and those aiming to become one, who need in-depth knowledge.",
        facts: [
          { label: "Entry", value: "None mandatory. The NEBOSH General Certificate is strongly recommended, and IELTS 7.0+ is recommended." },
          { label: "Units", value: "DI1 Workplace health and safety principles (assignment, about 4 weeks) · DI2 Controlling workplace health issues (case study, about 2 weeks) · DI3 Controlling workplace safety issues (case study, about 2 weeks). Each is followed by a closing interview." },
          { label: "Study time", value: "Minimum 185 taught hours, about 144 self-study hours and 80 assessment hours. Five years to complete all units." },
          { label: "Leads to", value: "Meets the academic requirements for IOSH membership at the appropriate grade, and is a BCSP-recognised qualified credential towards the CSP." },
        ],
      },
      {
        id: "nebosh-env-diploma",
        provider: "NEBOSH",
        name: "NEBOSH International Diploma in Environmental Management",
        level: "SCQF Level 10 · comparable to RQF Level 6",
        color: "coral",
        officialUrl: "https://www.nebosh.org.uk/qualifications/international-diploma-in-environmental-management/",
        lastChecked: "24 Oct 2026",
        summary: "For aspiring environmental managers and safety practitioners who also manage environmental responsibilities.",
        facts: [
          { label: "Entry", value: "No formal requirements. The NEBOSH Certificate in Environmental Management (or equivalent) is highly recommended, and IELTS 7.0+ is recommended." },
          { label: "Units", value: "ED1 Controlling environmental aspects (3-hour written exam, 5 of 8 questions) · IDEM2 Environmental regulation (about 8,000-word assignment)." },
          { label: "Study time", value: "Minimum 119 taught hours and about 112 hours of private study. Complete both units within five years." },
          { label: "Leads to", value: "Specialist membership of IIRSM (SIIRSM) and the letters IEnvDipNEBOSH. Some UK universities accept it for MSc entry." },
        ],
      },
    ],
  },

  /* ---------- Tab 3: Live quiz ----------
     embed:true shows the quiz inside the page. Note: quiz.iparkar.com is
     currently behind Cloudflare Access (login wall), so public visitors
     can't open it until that policy is removed or set to "Bypass". */
  quiz: {
    title: "Live HSE quiz",
    lead: "Join a live session, answer in real time and see how you compare.",
    url: "https://quiz.iparkar.com/",
    embed: false,
    buttonLabel: "Open the live quiz",
    howItWorks: [
      { title: "Join",   body: "Open the quiz on your phone or laptop when a session starts." },
      { title: "Answer", body: "Questions appear one at a time — answer before the timer runs out." },
      { title: "Learn",  body: "See the correct answer and a short explanation after each question." },
    ],
    topics: ["Permit to Work", "Heat stress", "Fleet safety", "Hazard identification", "Fire protection", "Confined spaces"],
  },

    /* ---------- Tab 4: Practice exam ----------
     The premium exams run in the iParkar LMS at app.iparkar.com
     (sign-in, timed blueprint-weighted exams, calculator, analytics).
     Each premium button opens that course in the LMS; the LMS shows the
     checkout or the exams depending on the student's access. */
  practice: {
    title: "Practice exam",
    lead: "Start free with 10 random questions. Unlock a full course bank for timed, blueprint-weighted mock exams.",
    freeCount: 10,
    appUrl: "https://app.iparkar.com",
    member: { text: "Already enrolled?", label: "Sign in to your dashboard", href: "https://app.iparkar.com/login" },
    plans: [
      {
        name: "Free sample",
        price: "Free",
        period: "",
        status: "Open now",
        features: ["10 random questions each attempt", "Answer explanations", "No account needed"],
        button: { label: "Start free sample", action: "start-free" },
        color: "white",
      },
      {
        name: "ASP premium",
        price: "US$99",
        period: "90 days",
        status: "Available",
        features: [
          "Full ASP bank, weighted to the 9 blueprint domains",
          "100-question / 150-minute mock exams",
          "20-question domain exams (30 minutes)",
          "On-screen scientific calculator, flagging and review",
          "Score history and domain-by-domain analytics",
        ],
        button: { label: "Get ASP access", href: "https://app.iparkar.com/courses/ASP" },
        color: "marigold",
      },
      {
        name: "CSP & CIH",
        price: "US$99",
        period: "90 days each",
        status: "Coming soon",
        features: [
          "Separate CSP and CIH banks — never mixed",
          "CIH: 50 / 35 / 15 domain weighting with task-level analytics",
          "Same timed exams, calculator and analytics as ASP",
        ],
        button: { label: "Coming soon", href: "#", disabled: true },
        color: "sky",
      },
    ],
    note: "Practice questions are original and written for study only. They are not actual exam questions, and practice scores do not guarantee a pass.",
  },
  /* ---------- Footer ---------- */
  footer: {
    links: [
      { label: "Terms",          href: "terms.html" },
      { label: "Privacy",        href: "privacy.html" },
      { label: "Refund policy",  href: "refunds.html" },
    ],
    copyright: "© 2026 iParkar HSE Academy",
  },
};
