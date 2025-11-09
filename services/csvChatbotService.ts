/// <reference types="vite/client" />

interface MedicalRecord {
  symptom: string;
  keywords: string[];
  variations: {
    description: string;
    medicine: string;
    doctor_consult: string;
    food_suggestions: string;
    lifestyle_suggestions: string;
  }[];
}

interface ChatHistory {
  query: string;
  response: string;
  timestamp: string;
}
// Emergency symptoms that require immediate medical attention
const emergencySymptoms = [
  {
    keywords: [
      "chest pain",
      "chest hurt",
      "heart pain",
      "heart attack",
      "chest pressure",
      "chest tightness",
      "crushing chest",
      "squeezing chest",
      "chest discomfort",
      "angina",
    ],
    message:
      "⚠️ **URGENT: This could be a medical emergency!**\n\nChest pain can indicate serious conditions like a heart attack. Please seek immediate medical attention by calling emergency services or visiting the nearest emergency room right away. Do not delay or try to treat this at home.",
  },
  {
    keywords: [
      "difficulty breathing",
      "can't breathe",
      "cannot breathe",
      "breathless",
      "choking",
      "gasping",
      "shortness of breath",
      "hard to breathe",
      "suffocating",
      "struggling to breathe",
      "breath trouble",
      "breathing problem",
    ],
    message:
      "⚠️ **URGENT: This is a medical emergency!**\n\nDifficulty breathing requires immediate medical attention. Please call emergency services or go to the nearest emergency room immediately. This could indicate a serious respiratory or cardiac condition that needs urgent care.",
  },
  {
    keywords: [
      "pregnancy pain",
      "pregnant pain",
      "pregnant bleeding",
      "pregnancy bleeding",
      "miscarriage",
      "pregnancy cramps",
      "severe pregnancy pain",
      "pregnancy emergency",
      "bleeding while pregnant",
      "pregnancy complications",
    ],
    message:
      "⚠️ **URGENT: Seek immediate medical care!**\n\nAny unusual pain or bleeding during pregnancy should be evaluated immediately by a healthcare professional. Please contact your obstetrician or visit the emergency room right away to ensure the safety of both you and your baby.",
  },
  {
    keywords: [
      "severe headache",
      "worst headache",
      "thunderclap headache",
      "sudden headache",
      "explosive headache",
      "headache worst ever",
      "sudden severe head pain",
      "head bursting",
    ],
    message:
      "⚠️ **URGENT: This requires immediate attention!**\n\nA sudden severe headache (especially if it's the worst headache you've ever experienced) could indicate a serious condition like a stroke or aneurysm or brain bleed. Please seek emergency medical care immediately.",
  },
  {
    keywords: [
      "numbness",
      "tingling one side",
      "face drooping",
      "slurred speech",
      "weakness one side",
      "stroke",
      "paralysis",
      "arm weakness",
      "leg weakness",
      "face paralysis",
      "one side weak",
      "droopy face",
      "speech slurred",
    ],
    message:
      "⚠️ **URGENT: Possible stroke symptoms!**\n\nThese symptoms could indicate a stroke which is a medical emergency. Remember: TIME IS CRITICAL. Call emergency services immediately. Every minute counts in stroke treatment.",
  },
  {
    keywords: [
      "suicidal",
      "want to die",
      "kill myself",
      "end my life",
      "suicide",
      "no reason to live",
      "self harm",
      "hurt myself",
      "thoughts of suicide",
      "suicidal thoughts",
    ],
    message:
      "⚠️ **URGENT: Please seek help immediately!**\n\nYour life matters and help is available. Please reach out to a mental health professional or call a suicide prevention hotline or go to the nearest emergency room. You don't have to face this alone. National Suicide Prevention Lifeline: 1-800-273-8255",
  },
  {
    keywords: [
      "unconscious",
      "passed out",
      "fainted",
      "not responding",
      "unresponsive",
      "collapsed",
      "blacked out",
      "lost consciousness",
      "syncope",
    ],
    message:
      "⚠️ **CALL EMERGENCY SERVICES NOW!**\n\nIf someone is unconscious or unresponsive this is a critical emergency. Call emergency services immediately and follow their instructions while waiting for help to arrive.",
  },
  {
    keywords: [
      "severe bleeding",
      "heavy bleeding",
      "blood won't stop",
      "bleeding profusely",
      "lots of blood",
      "hemorrhage",
      "uncontrolled bleeding",
      "bleeding heavily",
      "massive bleeding",
    ],
    message:
      "⚠️ **URGENT: This is an emergency!**\n\nSevere bleeding that won't stop requires immediate medical attention. Apply pressure to the wound if possible and call emergency services or go to the emergency room immediately.",
  },
  {
    keywords: [
      "severe abdominal pain",
      "intense stomach pain",
      "sharp abdominal pain",
      "stabbing stomach pain",
      "appendix pain",
      "lower right pain",
      "acute abdomen",
      "unbearable stomach pain",
    ],
    message:
      "⚠️ **URGENT: Seek immediate medical care!**\n\nSevere abdominal pain could indicate serious conditions like appendicitis, ruptured organs, or internal bleeding. Please go to the emergency room immediately, especially if the pain is sudden, severe, or accompanied by fever, vomiting, or inability to pass stool.",
  },
  {
    keywords: [
      "seizure",
      "convulsion",
      "fitting",
      "epileptic fit",
      "having seizure",
      "shaking uncontrollably",
      "convulsing",
      "epilepsy attack",
    ],
    message:
      "⚠️ **URGENT: Medical emergency!**\n\nSeizures require immediate medical attention. If someone is having a seizure, call emergency services. Keep the person safe, turn them on their side, and do not put anything in their mouth. If the seizure lasts more than 5 minutes or if it's their first seizure, seek emergency care immediately.",
  },
  {
    keywords: [
      "severe burn",
      "third degree burn",
      "deep burn",
      "major burn",
      "burn injury",
      "scalding",
      "electrical burn",
      "chemical burn",
    ],
    message:
      "⚠️ **URGENT: Seek emergency care!**\n\nSevere burns require immediate medical attention. Run cool (not cold) water over the burn for 10-20 minutes, cover with a clean cloth, and go to the emergency room. Do not apply ice, butter, or ointments. For electrical or chemical burns, seek help immediately.",
  },
  {
    keywords: [
      "broken bone",
      "fracture",
      "bone sticking out",
      "compound fracture",
      "bone break",
      "snapped bone",
      "limb deformed",
      "can't move limb",
    ],
    message:
      "⚠️ **URGENT: This needs immediate medical attention!**\n\nA suspected fracture or broken bone requires emergency care. Do not try to realign the bone. Immobilize the injured area if possible and go to the emergency room immediately. If the bone is protruding through the skin, this is a medical emergency.",
  },
  {
    keywords: [
      "severe allergic reaction",
      "anaphylaxis",
      "throat swelling",
      "tongue swelling",
      "allergic shock",
      "hives all over",
      "face swelling",
      "allergic emergency",
      "can't breathe allergic",
    ],
    message:
      "⚠️ **URGENT: Anaphylaxis is life-threatening!**\n\nSevere allergic reactions can be fatal. If experiencing throat swelling, difficulty breathing, or widespread hives after exposure to an allergen, use an EpiPen if available and call emergency services immediately. Go to the ER even if symptoms seem to improve.",
  },
  {
    keywords: [
      "coughing blood",
      "vomiting blood",
      "blood in vomit",
      "hemoptysis",
      "throwing up blood",
      "spitting blood",
      "blood cough",
    ],
    message:
      "⚠️ **URGENT: This is a medical emergency!**\n\nCoughing up or vomiting blood requires immediate medical attention. This could indicate serious conditions affecting your lungs, stomach, or esophagus. Go to the emergency room immediately or call emergency services.",
  },
  {
    keywords: [
      "severe head injury",
      "head trauma",
      "hit head hard",
      "skull injury",
      "concussion",
      "head wound",
      "blow to head",
      "head bleeding",
    ],
    message:
      "⚠️ **URGENT: Seek immediate medical care!**\n\nHead injuries can be serious and may cause internal bleeding or brain damage. If you've experienced a significant blow to the head, especially with symptoms like confusion, vomiting, loss of consciousness, or severe headache, go to the emergency room immediately.",
  },
  {
    keywords: [
      "sudden vision loss",
      "can't see",
      "blind suddenly",
      "lost vision",
      "vision gone",
      "eye emergency",
      "sudden blindness",
      "seeing flashes",
      "curtain over vision",
    ],
    message:
      "⚠️ **URGENT: This is an eye emergency!**\n\nSudden vision loss or significant vision changes require immediate medical attention. This could indicate stroke, retinal detachment, or other serious conditions. Go to the emergency room or an eye emergency clinic immediately. Time is critical to prevent permanent vision loss.",
  },
  {
    keywords: [
      "severe dehydration",
      "extremely dehydrated",
      "no urine",
      "dark urine",
      "dizzy standing",
      "fainting dehydrated",
      "severe thirst",
      "dry mouth extreme",
    ],
    message:
      "⚠️ **URGENT: Severe dehydration needs immediate care!**\n\nSevere dehydration can be life-threatening, especially with symptoms like no urination, extreme dizziness, rapid heartbeat, or confusion. Seek immediate medical attention. You may need IV fluids. This is especially critical for children, elderly, or those with chronic conditions.",
  },
  {
    keywords: [
      "diabetic emergency",
      "blood sugar very high",
      "blood sugar very low",
      "diabetic coma",
      "insulin shock",
      "hyperglycemia severe",
      "hypoglycemia severe",
      "diabetic crisis",
    ],
    message:
      "⚠️ **URGENT: Diabetic emergency!**\n\nExtremely high or low blood sugar can be life-threatening. If experiencing confusion, loss of consciousness, severe weakness, rapid breathing, or fruity breath odor, seek emergency care immediately. If you have diabetes and feel something is seriously wrong, don't wait.",
  },
  {
    keywords: [
      "poisoning",
      "swallowed poison",
      "toxic ingestion",
      "overdose",
      "drug overdose",
      "chemical poisoning",
      "ate poison",
      "poisoned",
    ],
    message:
      "⚠️ **URGENT: Call Poison Control and Emergency Services!**\n\nPoisoning or overdose is a medical emergency. Call your local Poison Control Center (in US: 1-800-222-1222) and emergency services immediately. Do not induce vomiting unless instructed. Bring the substance container to the hospital if possible.",
  },
  {
    keywords: [
      "sudden paralysis",
      "can't move body",
      "body not moving",
      "paralyzed",
      "complete weakness",
      "lost movement",
      "unable to move",
    ],
    message:
      "⚠️ **URGENT: This is a critical emergency!**\n\nSudden paralysis or inability to move parts of your body could indicate a stroke, spinal injury, or other serious neurological emergency. Call emergency services immediately. Do not attempt to move if you suspect spinal injury.",
  },
  {
    keywords: [
      "severe asthma attack",
      "can't breathe asthma",
      "asthma emergency",
      "inhaler not working",
      "blue lips",
      "gasping for air",
      "severe wheezing",
    ],
    message:
      "⚠️ **URGENT: Severe asthma attack!**\n\nA severe asthma attack is life-threatening. If your inhaler isn't working, you're struggling to breathe, lips are turning blue, or you can't speak in full sentences, call emergency services immediately. Use your rescue inhaler while waiting for help.",
  },
  {
    keywords: [
      "heart attack",
      "cardiac arrest",
      "heart stopped",
      "heart failure",
      "chest crushing pain",
      "pain radiating arm",
      "jaw pain heart",
    ],
    message:
      "⚠️ **URGENT: Possible heart attack!**\n\nHeart attack symptoms include chest pain, pain radiating to arms/jaw/back, shortness of breath, nausea, and cold sweats. This is a life-threatening emergency. Call emergency services immediately. Chew an aspirin (if not allergic) while waiting for help. Every second counts!",
  },
];

// Load medical data from CSV
let medicalDatabase: MedicalRecord[] = [];
let isDataLoaded = false;

const loadMedicalData = async () => {
  if (isDataLoaded) return;

  try {
    const response = await fetch("/medicalData.csv");
    const csvText = await response.text();

    // Parse CSV
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      // Parse CSV line (handling quoted fields)
      const values = parseCSVLine(lines[i]);

      if (values.length < 17) continue; // Skip incomplete rows

      const record: MedicalRecord = {
        symptom: cleanValue(values[0]),
        keywords: cleanValue(values[1])
          .split(";")
          .map((k) => k.trim().toLowerCase()),
        variations: [
          {
            description: cleanValue(values[2]),
            medicine: cleanValue(values[3]),
            doctor_consult: cleanValue(values[4]),
            food_suggestions: cleanValue(values[5]),
            lifestyle_suggestions: cleanValue(values[6]),
          },
          {
            description: cleanValue(values[7]),
            medicine: cleanValue(values[8]),
            doctor_consult: cleanValue(values[9]),
            food_suggestions: cleanValue(values[10]),
            lifestyle_suggestions: cleanValue(values[11]),
          },
          {
            description: cleanValue(values[12]),
            medicine: cleanValue(values[13]),
            doctor_consult: cleanValue(values[14]),
            food_suggestions: cleanValue(values[15]),
            lifestyle_suggestions: cleanValue(values[16]),
          },
        ],
      };

      medicalDatabase.push(record);
    }

    isDataLoaded = true;
    console.log(
      `✅ Loaded ${medicalDatabase.length} medical conditions from CSV`
    );
  } catch (error) {
    console.error("❌ Error loading medical data:", error);
  }
};

// Helper function to parse CSV line with quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
};

// Helper function to clean values
const cleanValue = (value: string): string => {
  return value.replace(/^"|"$/g, "").trim();
};

// Check for emergency symptoms
const checkEmergency = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  for (const emergency of emergencySymptoms) {
    for (const keyword of emergency.keywords) {
      if (lowerMessage.includes(keyword)) {
        return emergency.message;
      }
    }
  }
  return null;
};

// Find matching symptoms (returns ONLY the best match)
const findBestMatch = (message: string): MedicalRecord | null => {
  const lowerMessage = message.toLowerCase();
  let bestMatch: MedicalRecord | null = null;
  let longestKeywordMatch = 0;

  for (const record of medicalDatabase) {
    for (const keyword of record.keywords) {
      if (lowerMessage.includes(keyword)) {
        // Prioritize longer keyword matches (more specific)
        if (keyword.length > longestKeywordMatch) {
          longestKeywordMatch = keyword.length;
          bestMatch = record;
        }
      }
    }
  }

  return bestMatch;
};

// Determine which variation to use based on message context
const selectVariation = (message: string): number => {
  const lowerMessage = message.toLowerCase();

  // Keywords that indicate duration/severity
  const durationKeywords = [
    "days",
    "weeks",
    "long time",
    "since",
    "for",
    "from",
  ];
  const severityKeywords = [
    "severe",
    "bad",
    "terrible",
    "worst",
    "intense",
    "unbearable",
    "very",
    "really",
    "extremely",
  ];
  const mildKeywords = ["mild", "little", "slight", "bit of", "small"];

  // Count indicators
  const hasDuration = durationKeywords.some((word) =>
    lowerMessage.includes(word)
  );
  const hasSeverity = severityKeywords.some((word) =>
    lowerMessage.includes(word)
  );
  const hasMild = mildKeywords.some((word) => lowerMessage.includes(word));

  // Select variation based on context
  if (hasDuration || hasSeverity) {
    return 2; // More detailed, concerned response (variation 3)
  } else if (hasMild) {
    return 0; // Standard response (variation 1)
  } else {
    return 1; // Middle variation (variation 2)
  }
};

// Chat history management (stored in localStorage)
const HISTORY_KEY = "medical-chatbot-history";

export const saveChatHistory = (query: string, response: string) => {
  try {
    const history = getChatHistory();
    const newEntry: ChatHistory = {
      query,
      response,
      timestamp: new Date().toISOString(),
    };
    history.unshift(newEntry); // Add to beginning

    // Keep only last 50 conversations
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

export const getChatHistory = (): ChatHistory[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
};

export const clearChatHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// Main chatbot response function
export const getCsvChatbotResponse = async (
  message: string
): Promise<string> => {
  // Load data if not already loaded
  if (!isDataLoaded) {
    await loadMedicalData();
  }

  // Simulate thinking delay for natural feel
  await new Promise((resolve) => setTimeout(resolve, 800));

  // First check for emergencies
  const emergencyResponse = checkEmergency(message);
  if (emergencyResponse) {
    saveChatHistory(message, emergencyResponse);
    return emergencyResponse;
  }

  // Look for the BEST matching symptom (only one)
  const match = findBestMatch(message);

  if (!match) {
    const noMatchResponse = `I understand you're not feeling well. While I can provide guidance for common symptoms I don't have specific information about what you're experiencing right now.

I'd recommend:
1. **Describing your symptoms more specifically** - mention the exact discomfort you're feeling
2. **Consulting a healthcare professional** who can properly evaluate your condition
3. **Not ignoring persistent symptoms** - it's always better to get checked

Feel free to describe your symptoms in more detail and I'll do my best to help!`;

    saveChatHistory(message, noMatchResponse);
    return noMatchResponse;
  }

  // Select appropriate variation based on message context (only ONE)
  const variationIndex = selectVariation(message);
  const variation = match.variations[variationIndex];

  // Generate natural, professional response
  const response = `Thank you for sharing your symptoms. Let me provide you with some helpful information:

**Understanding What You're Experiencing:**
${variation.description}

**Recommended Medications:**
${variation.medicine}

**When to Seek Medical Attention:**
${variation.doctor_consult}

**Dietary Recommendations:**
${variation.food_suggestions}

**Lifestyle and Self-Care Tips:**
${variation.lifestyle_suggestions}

**Important Note:** While this information is based on general medical knowledge and can help you manage mild symptoms it should not replace professional medical advice. If you're concerned about your symptoms or if they persist or worsen please consult a healthcare provider for proper evaluation and treatment.

Is there anything specific about your condition you'd like to know more about?`;

  // Save to history
  saveChatHistory(message, response);

  return response;
};
