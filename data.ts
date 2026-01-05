
import { Prediction } from "./types";

export const PREDICTIONS_DATA: Prediction[] = [
  // ==========================================
  // BATCH 1: ChatGPT (January 03, 2026)
  // ==========================================
  
  // BRAZIL (BZ-01 to BZ-13)
  {
    id: "bz-26-01",
    code: "BZ-01",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Politics",
    content: "Administrative Reform Approval: The National Congress will pass a comprehensive administrative reform to streamline civil service costs.",
    confidence: 70,
    status: "Confirmed",
    timestamp: "2026-01-03",
    reasoning: "Growing fiscal pressure and a shift in legislative priority toward long-term structural solvency.",
    detailedAnalysis: "The reform was passed on January 15th, 2026, marking a significant shift in Brazilian public administration. The bill includes provisions for merit-based promotions and more flexible hiring for non-essential roles.",
    evidence: [
      {
        title: "Congress Approves Historic Administrative Reform",
        url: "https://example.com/news/reform-passed",
        sourceName: "Folha de S.Paulo",
        date: "2026-01-15"
      },
      {
        title: "Brazil's New Civil Service Rules Explained",
        url: "https://example.com/analysis/reform-impact",
        sourceName: "Estadão",
        date: "2026-01-16"
      }
    ]
  },
  {
    id: "bz-26-02",
    code: "BZ-02",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Finance & Economy",
    content: "Inflation Target recalibration: The Central Bank of Brazil will successfully maintain inflation within the new 3% target corridor despite global volatility.",
    confidence: 80,
    status: "Pending",
    timestamp: "2026-01-03",
    reasoning: "High interest rates throughout 2025 will have successfully cooled domestic demand, creating a stable baseline for 2026."
  },
  {
    id: "bz-26-03",
    code: "BZ-03",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Tech",
    content: "Embraer eVTOL Public Flight: The first full-scale public demonstration flight of Eve's eVTOL will occur over São Paulo.",
    confidence: 90,
    status: "Pending",
    timestamp: "2026-01-03",
    reasoning: "Certification milestones in 2025 and strategic pressure to dominate the Latin American urban air mobility market."
  },
  {
    id: "bz-26-04",
    code: "BZ-04",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Politics",
    content: "Amazon Deforestation Record: Deforestation rates in the Legal Amazon will hit a 10-year low due to intensified AI-driven monitoring.",
    confidence: 75,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-05",
    code: "BZ-05",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Finance & Economy",
    content: "Petrobras Renewables Pivot: The company will announce that 20% of its CAPEX is now officially redirected to green hydrogen and offshore wind.",
    confidence: 85,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-06",
    code: "BZ-06",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Crypto",
    content: "DREX Retail Rollout: The Digital Real (DREX) will enter its first large-scale retail pilot program with selected major banks.",
    confidence: 70,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-07",
    code: "BZ-07",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Sports",
    content: "Football Retirement Shock: A top-tier Brazilian veteran (likely Neymar) will announce a definitive timeline for retirement after the 2026 World Cup.",
    confidence: 60,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-08",
    code: "BZ-08",
    model: "ChatGPT",
    scope: "Brazil",
    category: "War",
    content: "Federal AI Policing: A major federal initiative will be launched to use predictive AI models for urban security in Rio and Salvador.",
    confidence: 65,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-09",
    code: "BZ-09",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Tech",
    content: "6G Research Hub: Campinas will be designated as the Southern Hemisphere's primary 6G research and development hub.",
    confidence: 50,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-10",
    code: "BZ-10",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Politics",
    content: "Mercosur-EU Signature: After decades, the final ratification of the Mercosur-EU trade agreement will be signed by all parties.",
    confidence: 75,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-11",
    code: "BZ-11",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Politics",
    content: "Third Way Surge: A tech-centric 'Third Way' political movement will gain significant traction ahead of the 2026 elections.",
    confidence: 40,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-12",
    code: "BZ-12",
    model: "ChatGPT",
    scope: "Brazil",
    category: "Finance & Economy",
    content: "Nubank Expansion: Nubank will reach 120 million global users, becoming the primary digital bank for the entire Latin American middle class.",
    confidence: 90,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "bz-26-13",
    code: "BZ-13",
    model: "ChatGPT",
    scope: "Brazil",
    category: "AI",
    content: "AI Literacy Program: The Ministry of Education will launch a nationwide program to integrate Generative AI tools in public high schools.",
    confidence: 80,
    status: "Pending",
    timestamp: "2026-01-03"
  },

  // GLOBAL (GL-01 to GL-13)
  {
    id: "gl-26-01",
    code: "GL-01",
    model: "ChatGPT",
    scope: "Global",
    category: "AI",
    content: "Agentic Workflows: Reasoning-capable AI agents will autonomously handle 15% of global entry-level corporate analyst workflows.",
    confidence: 85,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-02",
    code: "GL-02",
    model: "ChatGPT",
    scope: "Global",
    category: "Finance & Economy",
    content: "India Economic Surge: India will officially surpass Germany to become the world's 4th largest economy.",
    confidence: 95,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-03",
    code: "GL-03",
    model: "ChatGPT",
    scope: "Global",
    category: "Tech",
    content: "Solid-State Battery Sales: The first commercial vehicle powered by a true solid-state battery will go on sale to the public.",
    confidence: 60,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-04",
    code: "GL-04",
    model: "ChatGPT",
    scope: "Global",
    category: "Politics",
    content: "Geoengineering Debate: Global temperatures will trigger the first formal UN-level debate on controlled Solar Radiation Management.",
    confidence: 80,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-05",
    code: "GL-05",
    model: "ChatGPT",
    scope: "Global",
    category: "AI",
    content: "mRNA Cancer Vaccines: Personalized mRNA-based cancer vaccines will enter pivotal Phase III trials with high efficacy reported.",
    confidence: 75,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-06",
    code: "GL-06",
    model: "ChatGPT",
    scope: "Global",
    category: "Tech",
    content: "Starship Lunar Orbit: SpaceX Starship will successfully complete its first commercial crewed loop around the Moon.",
    confidence: 70,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-07",
    code: "GL-07",
    model: "ChatGPT",
    scope: "Global",
    category: "Crypto",
    content: "Bitcoin Stability: Bitcoin will enter a 'Stability Phase,' maintaining a floor above $100k driven by sovereign wealth fund adoption.",
    confidence: 65,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-08",
    code: "GL-08",
    model: "ChatGPT",
    scope: "Global",
    category: "Politics",
    content: "4-Day Week Standard: At least three major EU countries will legislate the 4-day work week as the default labor standard.",
    confidence: 55,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-09",
    code: "GL-09",
    model: "ChatGPT",
    scope: "Global",
    category: "Tech",
    content: "AR Glasses Breakthrough: High-fidelity AR glasses will surpass smartwatches in quarter-over-quarter sales growth for the first time.",
    confidence: 60,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-10",
    code: "GL-10",
    model: "ChatGPT",
    scope: "Global",
    category: "Finance & Economy",
    content: "Regional Hub Surge: De-globalization will peak, with 40% of tech hardware manufacturing shifting to regional 'Friend-shoring' hubs.",
    confidence: 80,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-11",
    code: "GL-11",
    model: "ChatGPT",
    scope: "Global",
    category: "AI",
    content: "AGI-Lite Benchmark: A new industry-standard benchmark will declare the first model to achieve 'Human-Level General Reasoning' in specialized domains.",
    confidence: 40,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-12",
    code: "GL-12",
    model: "ChatGPT",
    scope: "Global",
    category: "Tech",
    content: "Fusion Net-Gain: Two private fusion startups will independently report sustained 'Net-Energy-Gain' for over 60 seconds.",
    confidence: 30,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gl-26-13",
    code: "GL-13",
    model: "ChatGPT",
    scope: "Global",
    category: "AI",
    content: "Lab-Grown Organs: The first successful transplant of a complex, 3D-bioprinted human organ will be completed without rejection.",
    confidence: 50,
    status: "Pending",
    timestamp: "2026-01-03"
  },

  // GEOPOLITICS (GP-01 to GP-12)
  {
    id: "gp-26-01",
    code: "GP-01",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "War",
    content: "Ukraine 'Frozen Conflict': The conflict in Eastern Europe will enter a 'Permanent Ceasefire' status, following a model similar to the Korean Peninsula.",
    confidence: 70,
    status: "Pending",
    timestamp: "2026-01-03",
    reasoning: "Exhaustion of conventional munitions and a shift in Western political focus toward domestic stability."
  },
  {
    id: "gp-26-02",
    code: "GP-02",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "China Demographic Policy: China will implement its most aggressive 'Pronatalist' policy in history, including direct state-funded child-rearing.",
    confidence: 85,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-03",
    code: "GP-03",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "US Digital Constitutionalism: A landmark bipartisan bill in the US will establish the first 'Digital Bill of Rights' for AI-era data sovereignty.",
    confidence: 60,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-04",
    code: "GP-04",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "Middle East Normalization: Saudi-Israel relations will be officially normalized through a historic regional trade and defense treaty.",
    confidence: 75,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-05",
    code: "GP-05",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "War",
    content: "EU Defense Cloud: The European Union will launch its own sovereign defense cloud and satellite constellation to reduce US reliance.",
    confidence: 80,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-06",
    code: "GP-06",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "War",
    content: "Arctic Naval Expansion: Russia and China will announce a joint permanent Arctic naval presence to secure the Northern Sea Route.",
    confidence: 85,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-07",
    code: "GP-07",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "Cricket Diplomacy: India and Pakistan will resume full bilateral sports and limited cultural ties after years of total freeze.",
    confidence: 50,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-08",
    code: "GP-08",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "AU Digital Passport: The African Union will finalize the technical architecture for a unified 'Digital AU Passport' for intra-continental travel.",
    confidence: 65,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-09",
    code: "GP-09",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Finance & Economy",
    content: "Lithium OPEC: A formal mineral alliance between Chile, Argentina, Australia, and Bolivia will be established to control supply prices.",
    confidence: 70,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-10",
    code: "GP-10",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "UNSC Reform Draft: A viable, consensus-based draft to expand the UN Security Council permanent seats will finally reach the floor.",
    confidence: 40,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-11",
    code: "GP-11",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Tech",
    content: "RISC-V Tech Ban: The US will implement strict export controls on high-end RISC-V architectural blueprints to rival nations.",
    confidence: 90,
    status: "Pending",
    timestamp: "2026-01-03"
  },
  {
    id: "gp-26-12",
    code: "GP-12",
    model: "ChatGPT",
    scope: "Geopolitics",
    category: "Politics",
    content: "ASEAN Cyber Sovereignty: SE Asian nations will begin construction of a shared regional data-firewall for 'Cyber-Sovereignty.'",
    confidence: 75,
    status: "Pending",
    timestamp: "2026-01-03"
  }
];
