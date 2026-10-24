/* =====================================================================
   FREE PRACTICE QUESTIONS
   ---------------------------------------------------------------------
   The free sample draws `practice.freeCount` (10) of these at random.
   To add a question, copy one { ... } block and edit it:
     q        – the question
     options  – the answer choices (any number)
     answer   – index of the correct option, counting from 0
     explain  – shown after answering
     topic    – short label shown as a pill
   Keep premium questions OUT of this file — anything here is public.
   ===================================================================== */

window.FREE_QUESTIONS = [
  {
    topic: "Hazard control",
    q: "Which control is the most effective according to the hierarchy of controls?",
    options: ["Personal protective equipment", "Administrative controls", "Elimination", "Engineering controls"],
    answer: 2,
    explain: "Elimination removes the hazard entirely, so it sits at the top of the hierarchy. PPE is the least effective because it relies on the worker and protects only that person.",
  },
  {
    topic: "Incident rates",
    q: "A site recorded 4 recordable injuries in 400,000 hours worked. What is the OSHA recordable incident rate?",
    options: ["1.0", "2.0", "4.0", "0.5"],
    answer: 1,
    explain: "Rate = (cases × 200,000) ÷ hours worked = (4 × 200,000) ÷ 400,000 = 2.0 per 100 full-time workers.",
  },
  {
    topic: "Noise",
    q: "Two identical machines each produce 90 dBA at a worker’s position. What is the combined level?",
    options: ["180 dBA", "93 dBA", "96 dBA", "90 dBA"],
    answer: 1,
    explain: "Decibels add logarithmically. Doubling the sound energy of two equal sources adds about 3 dB, so 90 + 3 = 93 dBA.",
  },
  {
    topic: "Noise",
    q: "Under OSHA’s general industry noise standard, what exchange rate is used?",
    options: ["3 dB", "5 dB", "6 dB", "10 dB"],
    answer: 1,
    explain: "OSHA uses a 5 dB exchange rate: each 5 dB increase halves the allowed exposure time. NIOSH recommends 3 dB.",
  },
  {
    topic: "Confined spaces",
    q: "Under OSHA, what oxygen range is considered acceptable for confined space entry?",
    options: ["16.0% – 21.0%", "19.5% – 23.5%", "18.0% – 25.0%", "20.9% – 25.0%"],
    answer: 1,
    explain: "Below 19.5% is oxygen-deficient and above 23.5% is oxygen-enriched (increased fire risk). Both are hazardous atmospheres.",
  },
  {
    topic: "Fire protection",
    q: "A fire involving flammable liquids such as diesel is classified (U.S. system) as:",
    options: ["Class A", "Class B", "Class C", "Class D"],
    answer: 1,
    explain: "Class B fires involve flammable liquids and gases. Class A is ordinary combustibles, Class C is energised electrical equipment and Class D is combustible metals.",
  },
  {
    topic: "Fire protection",
    q: "The fire tetrahedron adds which element to heat, fuel and oxygen?",
    options: ["Smoke", "Ignition source", "Uninhibited chemical chain reaction", "Pressure"],
    answer: 2,
    explain: "Removing any one of the four elements extinguishes the fire. Agents such as dry chemicals and halon alternatives work by interrupting the chain reaction.",
  },
  {
    topic: "Flammability",
    q: "What does the lower explosive limit (LEL) describe?",
    options: [
      "The lowest temperature at which a liquid gives off ignitable vapour",
      "The minimum concentration of a gas or vapour in air that can ignite",
      "The temperature at which a substance ignites without a spark",
      "The maximum safe exposure limit for workers",
    ],
    answer: 1,
    explain: "Below the LEL the mixture is too lean to burn. The flash point is a temperature, not a concentration, and autoignition needs no ignition source.",
  },
  {
    topic: "Toxic gases",
    q: "Why should workers never rely on smell to detect hydrogen sulfide (H2S)?",
    options: [
      "H2S has no odour at any concentration",
      "At higher concentrations it rapidly paralyses the sense of smell",
      "Its odour is identical to natural gas odorant",
      "It is only detectable below 0.1 ppm",
    ],
    answer: 1,
    explain: "H2S smells of rotten eggs at very low levels, but olfactory paralysis sets in quickly at higher concentrations — so the danger can increase while the smell disappears. Use calibrated gas detectors.",
  },
  {
    topic: "Hazardous energy",
    q: "What is the main purpose of a lockout/tagout programme?",
    options: [
      "To record who last used a machine",
      "To prevent the unexpected start-up or release of hazardous energy during servicing",
      "To stop unauthorised people entering a site",
      "To meet insurance documentation requirements",
    ],
    answer: 1,
    explain: "Lockout/tagout isolates and secures energy sources — electrical, mechanical, hydraulic, pneumatic, chemical and thermal — before people work on equipment.",
  },
  {
    topic: "Work at height",
    q: "A portable straight ladder that reaches 8 m up a wall should have its base about how far from the wall?",
    options: ["1 m", "2 m", "3 m", "4 m"],
    answer: 1,
    explain: "Use the 4-to-1 rule: one unit out for every four units up. 8 m ÷ 4 = 2 m.",
  },
  {
    topic: "Physics of hazards",
    q: "For a point source, doubling your distance from it reduces the radiation intensity to:",
    options: ["One half", "One third", "One quarter", "One eighth"],
    answer: 2,
    explain: "The inverse square law: intensity ∝ 1/d². Doubling distance gives 1/2² = 1/4 of the original intensity.",
  },
  {
    topic: "Heat stress",
    q: "Which instrument readings combine to give the Wet Bulb Globe Temperature (WBGT) outdoors in sunlight?",
    options: [
      "Dry bulb and relative humidity only",
      "Natural wet bulb, globe and dry bulb temperatures",
      "Globe temperature and wind speed",
      "Wet bulb and dew point",
    ],
    answer: 1,
    explain: "Outdoor WBGT = 0.7 × natural wet bulb + 0.2 × globe + 0.1 × dry bulb. Indoors or without sun load, the dry bulb term is dropped.",
  },
  {
    topic: "Industrial hygiene",
    q: "What does a TLV-TWA represent?",
    options: [
      "A concentration that must never be exceeded, even briefly",
      "A 15-minute exposure limit",
      "The average concentration nearly all workers can be exposed to over an 8-hour day, 40-hour week without adverse effect",
      "The concentration immediately dangerous to life or health",
    ],
    answer: 2,
    explain: "The TWA is a time-weighted average for a normal workday. Short-term (STEL) and ceiling limits cover brief peaks; IDLH is an emergency-escape concept.",
  },
  {
    topic: "Risk assessment",
    q: "What is the first step in a job hazard analysis (JHA)?",
    options: [
      "Select personal protective equipment",
      "Break the job down into its basic steps",
      "Calculate the risk rating",
      "Write the safe work procedure",
    ],
    answer: 1,
    explain: "You can only identify hazards reliably once the task is broken into sequential steps. Hazards and controls are then assigned to each step.",
  },
  {
    topic: "Permit to Work",
    q: "In a permit-to-work system, who is normally responsible for confirming the work area is safe before issuing the permit?",
    options: ["The performing authority’s crew", "The issuing (area) authority", "The client’s finance department", "Any worker on site"],
    answer: 1,
    explain: "The issuing authority controls the area and confirms isolations, gas tests and conditions are in place before authorising the work. The performing authority accepts and works within those conditions.",
  },
  {
    topic: "Incident investigation",
    q: "Which tool helps investigators group possible causes into categories such as people, methods, equipment and environment?",
    options: ["Gantt chart", "Fishbone (Ishikawa) diagram", "Pareto chart", "Control chart"],
    answer: 1,
    explain: "A fishbone diagram organises contributing causes by category. A Pareto chart ranks causes by frequency once you have data.",
  },
  {
    topic: "Management systems",
    q: "ISO 45001 is built on which management cycle?",
    options: ["DMAIC", "Plan-Do-Check-Act", "SWOT", "Observe-Orient-Decide-Act"],
    answer: 1,
    explain: "ISO 45001, like ISO 14001 and ISO 9001, follows the Plan-Do-Check-Act cycle to drive continual improvement.",
  },
  {
    topic: "Electrical safety",
    q: "A ground-fault circuit interrupter (GFCI) primarily protects people against:",
    options: ["Overloaded circuits", "Electric shock from current leaking to ground", "Lightning strikes", "Arc flash burns"],
    answer: 1,
    explain: "A GFCI trips when it detects a small imbalance between live and neutral current, cutting power before a shock becomes lethal. Breakers and fuses protect circuits from overload.",
  },
  {
    topic: "Ergonomics",
    q: "Under the revised NIOSH lifting equation, what is the load constant (maximum recommended load under ideal conditions)?",
    options: ["15 kg (33 lb)", "23 kg (51 lb)", "30 kg (66 lb)", "40 kg (88 lb)"],
    answer: 1,
    explain: "The load constant is 23 kg (51 lb). Multipliers for distance, height, frequency, asymmetry and coupling reduce it to the recommended weight limit for the actual task.",
  },
];
