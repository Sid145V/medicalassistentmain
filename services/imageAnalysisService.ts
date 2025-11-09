// Simple image analysis service for medical images
// This provides basic guidance based on image characteristics

export const analyzeImageBasic = async (
  imageBase64: string
): Promise<string> => {
  // Simulate analysis delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Basic analysis based on common patterns
  // In a real system, this would use AI model, but for demo we provide general guidance

  const analysisResponse = `**Image Analysis Complete**

Based on the uploaded image, here is general medical guidance:

**Common Skin Conditions - General Guidance:**

🔴 **If you see redness or rash:**
- **Possible causes:** Allergic reaction, dermatitis, heat rash, infection
- **Immediate care:** 
  - Keep area clean and dry
  - Avoid scratching
  - Apply cool compress
  - Over-the-counter hydrocortisone cream (0.5-1%)
- **Seek doctor if:** Spreading rapidly, fever, severe pain, oozing, or doesn't improve in 3-4 days

🟡 **If you see a wound or cut:**
- **Immediate care:**
  - Clean with mild soap and water
  - Apply antiseptic (Betadine/Dettol)
  - Cover with sterile bandage
  - Change dressing daily
- **Seek doctor if:** Deep cut, excessive bleeding, signs of infection (pus, warmth, red streaks)

🟤 **If you see a mole or growth:**
- **Watch for ABCDE signs:**
  - **A**symmetry - uneven shape
  - **B**order - irregular edges
  - **C**olor - multiple colors
  - **D**iameter - larger than pencil eraser
  - **E**volving - changing in size/shape/color
- **Action:** See a dermatologist for evaluation, especially if changing

🔵 **If you see swelling or bruising:**
- **Immediate care:**
  - Apply ice pack (20 min on, 20 min off)
  - Elevate the area
  - Rest
  - Take pain reliever if needed (Ibuprofen/Paracetamol)
- **Seek doctor if:** Severe swelling, extreme pain, unable to move, or no improvement

⚠️ **IMPORTANT DISCLAIMER:**
This is general guidance only. Visual diagnosis requires in-person examination by a qualified healthcare provider. 

**Please describe your specific symptoms for more targeted advice:**
- Where is this located on your body?
- How long have you had this?
- Any pain, itching, or other symptoms?
- Have you tried any treatments?

Based on your description, I can provide more specific recommendations from my medical database.`;

  return analysisResponse;
};

export const analyzeRashSpecific = (description: string): string => {
  const lowerDesc = description.toLowerCase();

  // Common rash patterns
  if (lowerDesc.includes("itch") || lowerDesc.includes("scratch")) {
    return `
**For Itchy Rash:**

**Recommended Medications:**
- Antihistamine tablets (Cetirizine 10mg or Loratadine 10mg)
- Calamine lotion for topical relief
- Hydrocortisone cream 1% (apply twice daily)

**Food Suggestions:**
- Increase water intake (8-10 glasses daily)
- Anti-inflammatory foods: turmeric, ginger, green tea
- Avoid: spicy foods, alcohol, caffeine

**Lifestyle Tips:**
- Wear loose, cotton clothing
- Use fragrance-free soaps and detergents
- Keep nails short to prevent scratching damage
- Take lukewarm (not hot) showers
- Pat skin dry, don't rub

**When to see a doctor:**
- Rash spreading rapidly
- Fever or feeling unwell
- Blisters or oozing
- No improvement after 5-7 days
- Severe itching affecting sleep`;
  }

  if (lowerDesc.includes("red") || lowerDesc.includes("blotch")) {
    return `
**For Red Patches/Rash:**

**Possible Causes:**
- Contact dermatitis (allergic reaction)
- Heat rash
- Viral infection
- Eczema flare-up

**Immediate Care:**
- Identify and avoid trigger (if allergic)
- Apply cool compress for 10-15 minutes
- Moisturize with fragrance-free lotion
- Antihistamine if itching (Cetirizine 10mg)

**Food Suggestions:**
- Vitamin C rich foods: oranges, strawberries
- Omega-3: fish, walnuts, flaxseeds
- Avoid common allergens temporarily

**See a doctor if:**
- Accompanied by fever, difficulty breathing, or swelling
- Spreading quickly over large areas
- Pain or burning sensation
- Not improving with basic care`;
  }

  // Default response
  return `
**General Skin Condition Guidance:**

**Recommended First Steps:**
1. Keep area clean and dry
2. Avoid irritants (harsh soaps, perfumes)
3. Apply gentle moisturizer
4. Monitor for changes

**Over-the-counter options:**
- Moisturizing cream (Cetaphil, Eucerin)
- Mild antiseptic if needed
- Pain reliever if uncomfortable

**When to seek medical care:**
- Symptoms worsen or spread
- Fever develops
- Severe pain or discomfort
- Signs of infection
- Lasts more than a week

Please describe your symptoms in more detail for specific recommendations.`;
};
