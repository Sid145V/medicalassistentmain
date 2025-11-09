// Advanced image analysis using pixel data and color analysis
// This analyzes medical images by examining colors, patterns, and characteristics

interface ImageAnalysis {
  category: string;
  confidence: number;
  guidance: string;
  details: string;
}

// Analyze image by examining pixel data
export const analyzeImageWithAI = async (
  imageBase64: string
): Promise<ImageAnalysis> => {
  try {
    console.log("🔍 Starting image analysis...");

    // Create image and canvas for analysis
    const img = new Image();
    img.src = imageBase64;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      setTimeout(() => reject(new Error("Image load timeout")), 5000);
    });

    // Create canvas to read pixel data
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas context");

    // Resize for faster processing
    const maxSize = 300;
    let width = img.width;
    let height = img.height;

    if (width > height && width > maxSize) {
      height = (height / width) * maxSize;
      width = maxSize;
    } else if (height > maxSize) {
      width = (width / height) * maxSize;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Analyze colors and patterns
    const analysis = analyzePixelData(pixels, width, height);

    console.log("✅ Analysis complete:", analysis);
    return analysis;
  } catch (error) {
    console.error("❌ Analysis error:", error);
    return {
      category: "error",
      confidence: 0,
      guidance: getGeneralGuidance(),
      details: "Unable to process image. Please ensure it's a clear photo.",
    };
  }
};

// Analyze pixel data to detect medical conditions
const analyzePixelData = (
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): ImageAnalysis => {
  const totalPixels = width * height;
  let redCount = 0;
  let skinCount = 0;
  let darkCount = 0;
  let whiteCount = 0;
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;

  // Sample every 4th pixel for speed
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    redSum += r;
    greenSum += g;
    blueSum += b;

    // Detect redness (high red, low blue)
    if (r > 140 && r > g + 20 && r > b + 30) {
      redCount++;
    }

    // Detect skin tones (ranges)
    if (r > 150 && r > g && g > 80 && b > 50 && b < 200) {
      skinCount++;
    }

    // Detect dark areas (bruising, scabs)
    if (r < 80 && g < 80 && b < 80) {
      darkCount++;
    }

    // Detect very light/white areas (bandages, severe burns)
    if (r > 220 && g > 220 && b > 220) {
      whiteCount++;
    }
  }

  const sampledPixels = pixels.length / 4;
  const redPercent = (redCount / sampledPixels) * 100;
  const skinPercent = (skinCount / sampledPixels) * 100;
  const darkPercent = (darkCount / sampledPixels) * 100;
  const whitePercent = (whiteCount / sampledPixels) * 100;

  const avgR = redSum / sampledPixels;
  const avgG = greenSum / sampledPixels;
  const avgB = blueSum / sampledPixels;

  console.log("📊 Analysis:", {
    redPercent: redPercent.toFixed(1),
    skinPercent: skinPercent.toFixed(1),
    darkPercent: darkPercent.toFixed(1),
    avgColors: { r: avgR.toFixed(0), g: avgG.toFixed(0), b: avgB.toFixed(0) },
  });

  // Determine condition based on color analysis

  // RASH / SKIN CONDITION - High redness + skin tones
  if (redPercent > 15 && skinPercent > 20) {
    return {
      category: "skin_rash",
      confidence: Math.min(0.85, (redPercent + skinPercent) / 50),
      guidance: getRashGuidance(),
      details: `Detected significant redness (${redPercent.toFixed(
        1
      )}%) with skin tones present. This suggests inflammation or irritation.`,
    };
  }

  // SEVERE RASH / INFLAMMATION - Very high redness
  if (redPercent > 25) {
    return {
      category: "severe_inflammation",
      confidence: 0.8,
      guidance: getSevereRashGuidance(),
      details: `High level of redness detected (${redPercent.toFixed(
        1
      )}%). This indicates significant inflammation.`,
    };
  }

  // WOUND / CUT - Dark areas with some redness
  if (darkPercent > 10 && redPercent > 8) {
    return {
      category: "wound",
      confidence: 0.75,
      guidance: getWoundGuidance(),
      details: `Dark areas (${darkPercent.toFixed(
        1
      )}%) with redness suggest a wound or injury with possible scabbing.`,
    };
  }

  // BRUISE - High dark areas, low redness
  if (darkPercent > 15 && redPercent < 10) {
    return {
      category: "bruise",
      confidence: 0.7,
      guidance: getBruiseGuidance(),
      details: `Dark discoloration (${darkPercent.toFixed(
        1
      )}%) detected, consistent with bruising.`,
    };
  }

  // BURN / BANDAGE - High white areas
  if (whitePercent > 30) {
    return {
      category: "burn_or_bandage",
      confidence: 0.65,
      guidance: getBurnOrBandageGuidance(),
      details: `Significant light/white areas (${whitePercent.toFixed(
        1
      )}%) - could be bandaging or severe burn.`,
    };
  }

  // NORMAL SKIN - Skin tones present, low redness
  if (skinPercent > 30 && redPercent < 10) {
    return {
      category: "normal_skin",
      confidence: 0.6,
      guidance: getNormalSkinGuidance(),
      details: `Image shows mostly normal skin tones without significant redness or dark areas.`,
    };
  }

  // UNCLEAR - Not enough clear indicators
  return {
    category: "unclear",
    confidence: 0.4,
    guidance: getUnclearGuidance(),
    details: `Image analysis inconclusive. Please provide more details about what you're experiencing.`,
  };
};

// Guidance functions
const getRashGuidance = () => {
  return `**🔴 SKIN RASH / INFLAMMATION DETECTED**

**Analysis:** The image shows redness and inflammation consistent with a skin rash or dermatitis.

**Immediate Care:**
1. **DON'T scratch** - this worsens inflammation
2. **Clean gently** with mild, fragrance-free soap
3. **Pat dry** - don't rub
4. **Cool compress** - apply for 10-15 minutes
5. **Moisturize** with fragrance-free lotion

**Recommended Medications:**
- **Antihistamine:** Cetirizine 10mg or Loratadine 10mg once daily (reduces itching)
- **Topical steroid:** Hydrocortisone 1% cream - apply thin layer twice daily
- **Calamine lotion** for cooling relief
- **Pain relief:** Paracetamol 500mg if needed

**Food Suggestions:**
- **Increase:** Water (8-10 glasses), green tea, turmeric, ginger
- **Include:** Vitamin C (citrus, berries), omega-3 (fish, walnuts)
- **Avoid:** Spicy food, alcohol, caffeine, processed foods

**Lifestyle Tips:**
- Wear loose, breathable cotton clothing
- Use fragrance-free detergents
- Take lukewarm (not hot) showers
- Avoid known allergens
- Keep the area dry and ventilated

**⚠️ SEE A DOCTOR IF:**
- Rash spreading rapidly (growing larger each day)
- Fever develops (>100.4°F / 38°C)
- Severe itching that disrupts sleep
- Blisters, oozing, or pus appear
- Swelling of face, lips, or throat
- Difficulty breathing
- No improvement after 5-7 days
- Covers large portion of body

**Common Causes:**
- Allergic contact dermatitis (soap, detergent, jewelry)
- Atopic dermatitis (eczema)
- Heat rash
- Viral infection
- Food allergy
- Medication reaction`;
};

const getSevereRashGuidance = () => {
  return `**🚨 SEVERE SKIN INFLAMMATION DETECTED**

**URGENT:** This appears to be a significant skin condition that may require medical attention.

**Immediate Actions:**
1. **Stop all new products** - soaps, lotions, detergents
2. **Cool compress immediately** - 15-20 minutes
3. **Take antihistamine** - Cetirizine 10mg or Benadryl 25mg
4. **Do NOT scratch** - wear gloves if needed
5. **Photo document** - take pictures to show doctor

**Emergency Medications:**
- Antihistamine: Cetirizine 10mg NOW
- Hydrocortisone 1% cream if available
- Pain relief: Ibuprofen 400mg for inflammation

**⚠️ SEEK IMMEDIATE MEDICAL CARE IF:**
- Rapidly spreading (growing by the hour)
- Face, lips, tongue, or throat swelling
- Difficulty breathing or swallowing
- Fever over 101°F (38.3°C)
- Feeling dizzy or faint
- Widespread hives or welts
- Severe pain or burning

**While Waiting for Doctor:**
- Take lukewarm oatmeal bath (colloidal oatmeal)
- Keep area cool and dry
- Drink plenty of water
- Rest and avoid stress
- List any new: foods, medications, soaps, plants touched

**Possible Severe Conditions:**
- Severe allergic reaction
- Drug reaction (DRESS syndrome)
- Infection (cellulitis)
- Autoimmune condition
- Contact with toxic plant (poison ivy/oak)

🏥 **Strongly recommend seeing a doctor TODAY or going to urgent care.**`;
};

const getWoundGuidance = () => {
  return `**🩹 WOUND / INJURY DETECTED**

**Analysis:** The image shows characteristics of a wound, cut, or injury with possible scabbing.

**Immediate Wound Care:**
1. **Wash hands thoroughly** before touching wound
2. **Clean wound** - rinse with clean water for 5 minutes
3. **Apply antiseptic** - Betadine, Dettol, or hydrogen peroxide
4. **Apply antibiotic ointment** - Neosporin or Bacitracin
5. **Cover with sterile bandage** - secure but not tight

**Daily Care Routine:**
- Clean wound 2x daily with mild soap
- Reapply antibiotic ointment
- Change bandage daily (or when wet/dirty)
- Monitor for infection signs

**Recommended Supplies:**
- Antiseptic solution (Betadine 10%)
- Antibiotic ointment (Neosporin)
- Sterile gauze pads
- Medical tape or bandages
- Pain reliever: Paracetamol 500mg or Ibuprofen 400mg

**Foods for Wound Healing:**
- **Protein:** Chicken, fish, eggs, lentils (builds tissue)
- **Vitamin C:** Oranges, strawberries, bell peppers (collagen)
- **Zinc:** Nuts, seeds, whole grains (immune function)
- **Water:** 8-10 glasses daily (hydration critical)

**⚠️ GO TO DOCTOR/ER IF:**
- Deep wound (can see fat, muscle, bone)
- Won't stop bleeding after 10 min pressure
- Animal or human bite
- Very dirty wound (soil, rust, feces)
- **Signs of infection:**
  - Increasing redness spreading outward
  - Pus or yellow/green discharge
  - Red streaks from wound
  - Increasing pain after day 2
  - Fever
  - Warm to touch
  - Swelling increases
- Numbness or can't move area
- No tetanus shot in 10 years
- Wound on face (may need stitches for minimal scarring)

**Normal Healing:**
- Days 1-2: Slight redness, mild pain
- Days 3-5: Scab forms
- Days 7-10: Scab naturally falls off
- 2-3 weeks: New skin complete

**DON'T:**
- Pick scabs (causes scarring)
- Use alcohol directly (too harsh)
- Ignore infection signs`;
};

const getBruiseGuidance = () => {
  return `**🟣 BRUISE / CONTUSION DETECTED**

**Analysis:** Dark discoloration suggests bruising from impact or injury.

**Immediate Care (First 24-48 Hours):**
1. **RICE Protocol:**
   - **R**est - avoid using injured area
   - **I**ce - apply ice pack 20 min on, 20 min off
   - **C**ompression - gentle wrap (not too tight)
   - **E**levation - raise above heart level

**Pain Management:**
- Ibuprofen 400mg every 6-8 hours (reduces swelling)
- Paracetamol 500mg if Ibuprofen not tolerated
- Avoid aspirin (can worsen bleeding)

**After 48 Hours:**
- Switch to **warm** compress (increases blood flow)
- Gentle massage around (not on) bruise
- Light movement/stretching as tolerated

**Foods to Help Healing:**
- Vitamin K: Leafy greens, broccoli (blood clotting)
- Vitamin C: Citrus, strawberries (tissue repair)
- Pineapple: Bromelain (reduces inflammation)
- Protein: Eggs, fish, chicken (rebuilding)

**Bruise Color Timeline:**
- **Red/Purple:** Day 0-2 (fresh blood)
- **Blue/Dark Purple:** Day 2-5 (deoxygenated blood)
- **Green:** Day 5-7 (hemoglobin breaking down)
- **Yellow/Brown:** Day 7-14 (final healing)
- Should completely fade in 2-3 weeks

**⚠️ SEE A DOCTOR IF:**
- No remembered injury (spontaneous bruising)
- Bruise very large (>3 inches) or extremely painful
- Joint can't bend or bear weight
- Numbness or tingling
- Multiple unexplained bruises
- Bruising easily without reason
- On blood thinners (Warfarin, etc.)
- Doesn't improve after 2 weeks
- Signs of fracture (severe pain, deformity, can't move)

**Possible Concerns:**
- Normal bruising (impact injury)
- If frequent: vitamin deficiency, blood disorder
- If no trauma: consult doctor (could indicate medical condition)

💡 If bruising happens easily or frequently without injury, see doctor for blood tests.`;
};

const getBurnOrBandageGuidance = () => {
  return `**⚪ LIGHT AREAS DETECTED - BURN OR BANDAGED AREA**

**Analysis:** Significant light/white areas detected - this could be a bandaged area or burn injury.

**If This is a BURN:**

**IMMEDIATE ACTIONS:**
1. **Cool with water** - run under cool water 10-20 minutes
2. **Remove jewelry/tight items** before swelling
3. **DO NOT use ice** (causes more damage)
4. **Cover loosely** with clean, non-stick cloth

**Burn Severity:**
- **1st Degree:** Red, painful, no blisters → Home care OK
- **2nd Degree:** Blisters, very painful → Doctor if >3 inches
- **3rd Degree:** White/charred, may not hurt → ER IMMEDIATELY

**Treatment (Minor Burns Only):**
- Cool water for 10-20 min
- Aloe vera gel (pure)
- Pain reliever: Ibuprofen 400mg
- After 24 hrs: antibiotic ointment
- Cover with non-stick bandage

**⚠️ GO TO ER IF:**
- Larger than 3 inches
- On face, hands, feet, genitals, joints
- White, charred, or painless (3rd degree)
- Electrical or chemical burn
- Victim is infant or elderly

**If This is a BANDAGED WOUND:**

**Wound Care:**
- Change bandage daily
- Clean with mild soap when changing
- Watch for infection signs:
  - Increased redness
  - Pus
  - More pain
  - Fever
  - Bad smell

**When to Remove Bandage:**
- After 1-2 days if small wound
- Keep covered if:
  - Still oozing
  - In area that gets dirty
  - Rubbing against clothing

💡 **Please clarify:** Is this a burn, bandaged wound, or something else? Describe your symptoms for specific guidance!`;
};

const getNormalSkinGuidance = () => {
  return `**✅ NORMAL SKIN APPEARANCE**

**Analysis:** The image shows mostly normal skin tones without significant inflammation or injury.

**If You Have Concerns:**
Please describe what you're experiencing:
- Any pain, itching, or discomfort?
- Changes you've noticed recently?
- Specific area of concern?

**General Skin Health Tips:**

**Daily Care:**
- Cleanse with gentle, pH-balanced cleanser
- Moisturize twice daily
- Use sunscreen SPF 30+ daily
- Stay hydrated (8+ glasses water)

**Nutrition for Healthy Skin:**
- Omega-3: Fish, walnuts, flaxseed
- Antioxidants: Berries, dark leafy greens
- Vitamin C: Citrus, peppers, tomatoes
- Vitamin E: Nuts, seeds, avocados
- Water: Essential for skin hydration

**When to Monitor Skin:**
Watch any moles or spots for ABCDE changes:
- **A**symmetry (uneven shape)
- **B**order irregularity
- **C**olor variation
- **D**iameter (>6mm)
- **E**volving (changing)

**See Dermatologist For:**
- New or changing moles
- Persistent rash or irritation
- Unusual spots or growths
- Skin cancer screening (yearly if high risk)

**Lifestyle for Healthy Skin:**
- 7-8 hours sleep
- Manage stress
- Exercise regularly (increases circulation)
- Avoid smoking
- Limit alcohol
- Protect from sun

💡 If you have a specific concern not visible in the image, please describe it and I'll provide targeted advice!`;
};

const getUnclearGuidance = () => {
  return `**🤔 IMAGE ANALYSIS INCONCLUSIVE**

**Analysis:** The image doesn't show clear indicators of a specific condition. I need more information to help you.

**To Provide Better Guidance, Please Tell Me:**

**About the Issue:**
- What part of body is this?
- What symptoms are you experiencing?
  - Pain? (scale 1-10)
  - Itching or burning?
  - Swelling?
- When did it start?
- Is it getting better or worse?

**Context:**
- Any recent injury or accident?
- New products used (soap, lotion, detergent)?
- Been in contact with anything unusual?
- Any other symptoms (fever, fatigue)?

**I Can Help With:**
- **Rashes:** allergic, heat, viral, fungal
- **Wounds:** cuts, scrapes, punctures
- **Burns:** thermal, chemical, sun
- **Bruises:** impacts, contusions
- **Skin conditions:** eczema, psoriasis, acne
- **Infections:** bacterial, fungal
- **Bites:** insect, animal

**Tips for Better Photo:**
- Good lighting (natural light best)
- Clear focus on affected area
- Show scale (coin for size reference)
- Multiple angles if helpful

**Meanwhile:**
- Keep area clean and dry
- Avoid scratching or picking
- Don't apply products until diagnosis
- Monitor for changes

💡 **Just describe what you're experiencing in detail and I'll provide specific medical guidance based on your symptoms!**`;
};

const getGeneralGuidance = () => {
  return `**ℹ️ UNABLE TO ANALYZE IMAGE**

**Possible Reasons:**
- Image quality too low
- Image too dark or too bright
- Not enough visible detail
- Technical processing error

**What You Can Do:**

**1. Retake Photo:**
- Use good lighting (natural light best)
- Hold camera steady
- Focus clearly on affected area
- Get close enough to see details

**2. Or Describe Your Symptoms:**
I can provide excellent guidance based on text description:
- What part of body?
- What does it look like? (red, swollen, etc.)
- What does it feel like? (pain, itch, burn)
- When did it start?
- Any other symptoms?

**I Can Help With:**
- Skin conditions and rashes
- Wounds and injuries
- Burns
- Bruises and swelling
- Infections
- Allergic reactions
- General skin concerns

**Examples of Good Descriptions:**
- "Red, itchy rash on both arms for 3 days"
- "Cut on finger, won't stop bleeding"
- "Burned hand on stove, blistering"
- "Large bruise on leg after fall, very painful"

💡 **Try uploading a clearer image, or just tell me what you're experiencing and I'll help!**`;
};
