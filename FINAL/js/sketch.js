let gameState = "title";
let startButton;
let restartButton;

let bgMusic;
let rawDialogue;
let dialogue = [];
let dialogueKeys = [];
let originalDialogue68 = null;
let currentLine = 0;
let pendingLine = null;
let musicStarted = false;
let audioRetryCount = 0;
let maxAudioRetries = 5;

let displayedText = "";
let typingSpeed = 1; // Base typing speed
let typeStartFrame = 0;
let isTyping = true;
let typingTimeout = 90; // Auto-skip after 3 seconds (90 frames at 30 fps)

let activeChoices = [];
let buttons = [];
let lastClickTime = 0;
let clickDebounce = 750; // Debounce clicks (ms)

let expressionsJSON;
let characterExpressions = {};

let fadeAlpha = 0;
let fading = false;
let fadeDirection = 1;
let backgrounds = {};
let defaultBg = "street.png";
let currentBackground = "street.png";
let fallbackBackground = null;

let trust = {
  kael: 0,
  vira: 0
};

let particleSystem;
let flashAlpha = 0;
let flashColor = [255, 255, 255];
let hackLines = [10, 12, 23, 28, 38, 55];
let flashTimer = 0;
let flashCount = 0;
let maxFlashes = 1;
let flashInterval = 3; // Frames per flash (~0.1s at 30 fps)

let sfxFiles = [
  { key: "drone_hum", file: "drone_hum.wav" },
  { key: "gunfire", file: "gunfire.wav" },
  { key: "rain", file: "rain.ogg" },
  { key: "typing", file: "typing.wav" },
  { key: "siren", file: "siren.mp3" },
  { key: "sparks", file: "sparks.wav" },
  { key: "explosion", file: "explosion.mp3" },
  { key: "alarm", file: "alarm.wav" }
];

let sfxLibrary = {};

let validNextLines = { //trouble keeping dilogue straight
  0: 1, 1: 2, 2: 3, 3: null, 4: 7, 5: 7, 6: 7, 7: 8, 8: 9, 9: 10,
  10: null, 11: 12, 12: 15, 13: 15, 14: 15, 15: 16, 16: 17, 17: 18, 18: 19, 19: 20,
  20: 21, 21: 22, 22: 23, 23: null, 24: 25, 25: 31, 26: 31, 27: 28, 28: 31, 29: 31,
  30: 31, 31: 32, 32: 33, 33: 34, 34: null, 35: 38, 36: 38, 37: 39, 38: 40, 39: 40,
  40: 41, 41: 42, 42: 43, 43: 44, 44: null, 45: 48, 46: 48, 47: 48, 48: 49, 49: 50,
  50: 51, 51: 52, 52: 53, 53: null, 54: 56, 55: 56, 56: 57, 57: 58, 58: 59, 59: 63,
  63: null, 64: 67, 65: 67, 66: 67, 67: 68, 68: 69, 69: 70, 70: 71, 71: 72, 72: null
};

// Fallback dialogue for lines 0–72, 
const fallbackDialogue = {
  "0": {
    "name": "Narration",
    "text": "Neon rain falls over the Underdistrict. You are Cipher: a courier with a dangerous job tonight.",
    "background": "street.png",
    "sfx": "rain",
    "next": 1
  },
  "1": {
    "name": "Kael",
    "text": "You're late. Got the guts for this run, or are you gonna freeze again?",
    "expression": "cainneutral",
    "background": "street.png",
    "next": 2
  },
  "2": {
    "name": "Vira",
    "text": "NexCorp tightened security. We need a clean entry, no fireworks.",
    "expression": "viraneutral",
    "background": "street.png",
    "next": 3
  },
  "3": {
    "name": "You",
    "text": "Who do you trust to get you in?",
    "background": "street.png",
    "choices": [
      {
        "text": "Trust Kael’s tech skills",
        "next": 4,
        "trust": { "kael": 10 }
      },
      {
        "text": "Trust Vira’s inside knowledge",
        "next": 5,
        "trust": { "vira": 10 }
      },
      {
        "text": "Go in alone",
        "next": 6,
        "trust": { "kael": -10, "vira": -10 }
      }
    ]
  },
  "4": {
    "name": "Kael",
    "text": "I'll short out their sensors. You just move when I say.",
    "expression": "cainsmile",
    "background": "street.png",
    "next": 7
  },
  "5": {
    "name": "Vira",
    "text": "Follow my pathing exactly. One misstep and we fry.",
    "expression": "viratense",
    "background": "street.png",
    "next": 7
  },
  "6": {
    "name": "Narration",
    "text": "You decide to slip in solo, trusting your instincts.",
    "background": "street.png",
    "next": 7
  },
  "7": {
    "name": "Narration",
    "text": "Inside NexCorp's outer perimeter, drones buzz overhead.",
    "background": "street.png",
    "sfx": "drone_hum",
    "next": 8
  },
  "8": {
    "name": "Narration",
    "text": "You spot the data terminal. The chip's within reach.",
    "background": "street.png",
    "next": 9
  },
  "9": {
    "name": "You",
    "text": "Time to work.",
    "background": "street.png",
    "next": 10
  },
  "10": {
    "name": "Narration",
    "text": "Hack the security systems?",
    "background": "street.png",
    "sfx": "sparks",
    "choices": [
      {
        "text": "Start hacking",
        "next": 12
      },
      {
        "text": "Sneak past manually",
        "next": 14
      }
    ]
  },
  "11": {
    "name": "Narration",
    "text": "You boot your cyberdeck, running bypass scripts.",
    "background": "street.png",
    "next": 12
  },
  "12": {
    "name": "Narration",
    "text": "The systems blink out. Smooth as synth-butter.",
    "background": "street.png",
    "sfx": "sparks",
    "next": 15
  },
  "13": {
    "name": "Narration",
    "text": "Your hack triggers an alarm. Time to improvise.",
    "background": "street.png",
    "sfx": "alarm",
    "next": 15
  },
  "14": {
    "name": "Narration",
    "text": "You slip through shadows, barely avoiding patrols.",
    "background": "street.png",
    "next": 15
  },
  "15": {
    "name": "Narration",
    "text": "You snag the chip. Data pulses in your palm.",
    "background": "street.png",
    "next": 16
  },
  "16": {
    "name": "Kael",
    "text": "Got it? Good. Get out. Fast.",
    "expression": "cainneutral",
    "background": "street.png",
    "next": 17
  },
  "17": {
    "name": "Narration",
    "text": "You sprint into the night, chip secured.",
    "background": "street.png",
    "sfx": "rain",
    "next": 18
  },
  "18": {
    "name": "Narration",
    "text": "Warehouse 17. Time for the handoff.",
    "background": "warehouse.png",
    "next": 19
  },
  "19": {
    "name": "Client",
    "text": "The chip. Hand it over.",
    "background": "warehouse.png",
    "expression": "hooded_neutral",
    "next": 20
  },
  "20": {
    "name": "Narration",
    "text": "Something's wrong. Footsteps. Drone buzz.",
    "background": "warehouse.png",
    "sfx": "drone_hum",
    "next": 21
  },
  "21": {
    "name": "Kael",
    "text": "Ambush! Get down!",
    "expression": "cainangry",
    "background": "warehouse.png",
    "sfx": "gunfire",
    "next": 22
  },
  "22": {
    "name": "Narration",
    "text": "The Client was bait. NexCorp drones flood the room.",
    "background": "warehouse.png",
    "sfx": "drone_hum",
    "next": 23
  },
  "23": {
    "name": "You",
    "text": "What's the move?",
    "background": "warehouse.png",
    "sfx": "sparks",
    "choices": [
      {
        "text": "Fight through",
        "next": 25,
        "trust": { "vira": 10 }
      },
      {
        "text": "Hack the drones",
        "next": 28,
        "trust": { "kael": 10 }
      },
      {
        "text": "Run for it",
        "next": 30,
        "trust": { "kael": -10, "vira": -10 }
      }
    ]
  },
  "24": {
    "name": "Narration",
    "text": "You dive into the firefight.",
    "background": "warehouse.png",
    "sfx": "gunfire",
    "next": 25
  },
  "25": {
    "name": "Vira",
    "text": "Good moves. Let's get out!",
    "expression": "viraconfident",
    "background": "warehouse.png",
    "next": 31
  },
  "26": {
    "name": "Narration",
    "text": "You're wounded. Vira drags you out under fire.",
    "background": "warehouse.png",
    "sfx": "gunfire",
    "next": 31
  },
  "27": {
    "name": "Narration",
    "text": "You plug into the net, scrambling the drones.",
    "background": "warehouse.png",
    "sfx": "sparks",
    "next": 28
  },
  "28": {
    "name": "Kael",
    "text": "Nice hack. Let's vanish.",
    "expression": "cainsmile",
    "background": "warehouse.png",
    "sfx": "sparks",
    "next": 31
  },
  "29": {
    "name": "Narration",
    "text": "Your hack backfires. More drones join the fight.",
    "background": "warehouse.png",
    "sfx": "alarm",
    "next": 31
  },
  "30": {
    "name": "Narration",
    "text": "You bolt into the streets, alone. The others barely keep up.",
    "background": "street.png",
    "sfx": "rain",
    "next": 31
  },
  "31": {
    "name": "Narration",
    "text": "You regroup in an alley. The chip hums with encrypted power.",
    "background": "street.png",
    "sfx": "rain",
    "next": 32
  },
  "32": {
    "name": "Kael",
    "text": "Whatever's on that chip... it's not just blackmail data.",
    "expression": "cainneutral",
    "background": "street.png",
    "next": 33
  },
  "33": {
    "name": "Vira",
    "text": "It’s worse. I recognize the encryption signature.",
    "expression": "viratense",
    "background": "street.png",
    "next": 34
  },
  "34": {
    "name": "You",
    "text": "Decrypt it?",
    "background": "street.png",
    "choices": [
      {
        "text": "Ask Kael to crack it",
        "next": 35,
        "trust": { "kael": 10 }
      },
      {
        "text": "Let Vira handle it",
        "next": 36,
        "trust": { "vira": 10 }
      },
      {
        "text": "Contact Zero (hacker-for-hire)",
        "next": 37
      }
    ]
  },
  "35": {
    "name": "Kael",
    "text": "Alright. Cover me.",
    "expression": "cainneutral",
    "background": "street.png",
    "next": 38
  },
  "36": {
    "name": "Vira",
    "text": "I know NexCorp architecture. I’ll take point.",
    "expression": "viratense",
    "background": "street.png",
    "next": 38
  },
  "37": {
    "name": "Narration",
    "text": "You route a call through the darknet. A masked figure answers.",
    "background": "street.png",
    "next": 39
  },
  "38": {
    "name": "Narration",
    "text": "You jack in, cracking the encrypted layers...",
    "background": "street.png",
    "sfx": "sparks",
    "next": 40
  },
  "39": {
    "name": "Zero",
    "text": "Zero here. Upload the fragment. Fast.",
    "expression": "zero_neutral",
    "background": "street.png",
    "next": 40
  },
  "40": {
    "name": "Narration",
    "text": "Bit by bit, the secrets of the chip unfold.",
    "background": "street.png",
    "next": 41
  },
  "41": {
    "name": "Narration",
    "text": "It’s not a bribe file. It's **Project Echelon** AI tech designed to control human thought.",
    "background": "street.png",
    "next": 42
  },
  "42": {
    "name": "Kael",
    "text": "They could make people slaves... without them even knowing.",
    "expression": "cainangry",
    "background": "street.png",
    "next": 43
  },
  "43": {
    "name": "Vira",
    "text": "We have to stop this. Before Solas activates Echelon.",
    "expression": "viratense",
    "background": "street.png",
    "next": 44
  },
  "44": {
    "name": "You",
    "text": "What’s the move?",
    "background": "street.png",
    "choices": [
      {
        "text": "Leak Echelon to the public",
        "next": 45,
        "trust": { "kael": 15 }
      },
      {
        "text": "Destroy Echelon completely",
        "next": 46,
        "trust": { "vira": 15 }
      },
      {
        "text": "Sell it back to NexCorp",
        "next": 47,
        "trust": { "kael": -15, "vira": -15 }
      }
    ]
  },
  "45": {
    "name": "Kael",
    "text": "Smart. Light a fire under the whole city.",
    "expression": "cainsmile",
    "background": "street.png",
    "next": 48
  },
  "46": {
    "name": "Vira",
    "text": "We erase it. Wipe them clean.",
    "expression": "viraconfident",
    "background": "street.png",
    "next": 48
  },
  "47": {
    "name": "Narration",
    "text": "You prepare a deal with NexCorp's dark ops division.",
    "background": "warehouse.png",
    "next": 48
  },
  "48": {
    "name": "Narration",
    "text": "You approach the Underdistrict hub. It's time to end this...",
    "background": "street.png",
    "next": 49
  },
  "49": {
    "name": "Narration",
    "text": "A shadow blocks your path.",
    "background": "street.png",
    "next": 50
  },
  "50": {
    "name": "Wisp",
    "text": "Got a message. You’re not alone in this fight.",
    "expression": "wisp_neutral",
    "background": "street.png",
    "next": 51
  },
  "51": {
    "name": "Narration",
    "text": "Wisp hands you a datashard You have the rebels and my support...",
    "background": "street.png",
    "next": 52
  },
  "52": {
    "name": "Narration",
    "text": "But NexCorp forces are closing fast.",
    "background": "street.png",
    "sfx": "drone_hum",
    "next": 53
  },
  "53": {
    "name": "You",
    "text": "One last choice...",
    "background": "street.png",
    "choices": [
      {
        "text": "Confront Director Solas directly",
        "next": 54
      },
      {
        "text": "Sabotage Echelon remotely",
        "next": 55
      }
    ]
  },
  "54": {
    "name": "Narration",
    "text": "You storm the NexCorp tower.",
    "background": "energyplant.png",
    "sfx": "gunfire",
    "next": 56
  },
  "55": {
    "name": "Narration",
    "text": "You jack into the Nexus grid, ready to fry the system.",
    "background": "energyplant.png",
    "sfx": "sparks",
    "next": 56
  },
  "56": {
    "name": "Narration",
    "text": "Inside NexCorp's heart, Director Solas waits.",
    "background": "energyplant.png",
    "next": 57
  },
  "57": {
    "name": "Director Solas",
    "text": "You're too late. Humanity needs order! Not chaos...",
    "expression": "solasneutral",
    "background": "energyplant.png",
    "next": 58
  },
  "58": {
    "name": "You",
    "text": "Wrong. Humanity needs freedom.",
    "background": "energyplant.png",
    "next": 59
  },
  "59": {
    "name": "Narration",
    "text": "You make your final move...",
    "background": "energyplant.png",
    "next": 63
  },
  "63": {
    "name": "Narration",
    "text": "Your trust in Kael and Vira—or lack thereof—has sealed the city's fate. Their guidance, or your defiance, now shapes the neon horizon.",
    "background": "street.png",
    "sfx": "rain",
    "next": null
  },
  "64": {
    "name": "Freedom Requiem",
    "text": "The lights of NexCorp blink out, one tower at a time. In the distance, a neon dawn rises over a city finally free.",
    "background": "street.png",
    "sfx": "rain",
    "next": 67
  },
  "65": {
    "name": "Ghost in the Circuit",
    "text": "You vanish into the net, leaving your old life behind. Power hums at your fingertips. Was it worth the cost?",
    "background": "street.png",
    "sfx": "rain",
    "next": 67
  },
  "66": {
    "name": "City of Chains",
    "text": "The city falls silent under NexCorp’s iron code. Thought, freedom, and rebellion...erased in a blink...",
    "background": "street.png",
    "sfx": "drone_hum",
    "next": 67
  },
  "67": {
    "name": "Narration",
    "text": "Years later, legends of the Courier spark whispered hope in the backstreets.",
    "background": "street.png",
    "sfx": "rain",
    "next": 68
  },
  "68": {
    "name": "Narration",
    "text": "Some say Cipher fought for freedom.",
    "background": "street.png",
    "next": 69
  },
  "69": {
    "name": "Narration",
    "text": "Some say Cipher seized power in secret.",
    "background": "street.png",
    "next": 70
  },
  "70": {
    "name": "Narration",
    "text": "Others say Cipher fell, and NexCorp rules without challenge.",
    "background": "street.png",
    "sfx": "drone_hum",
    "next": 71
  },
  "71": {
    "name": "Narration",
    "text": "But the neon flickers. And rebellion...like light... never dies...",
    "background": "street.png",
    "sfx": "rain",
    "next": 72
  },
  "72": {
    "name": "The End",
    "text": "Thank you for playing Neon Requiem.",
    "background": "street.png",
    "isEnding": true,
    "instant": true,
    "next": null
  }
};

function preload() {
  // Initialize dialogue as empty array
  dialogue = new Array(73).fill(null);

  // fallback background 
  fallbackBackground = createGraphics(800, 600);
  for (let y = 0; y < 600; y++) {
    let c = lerpColor(color(20, 20, 50), color(0, 0, 20), y / 600);
    fallbackBackground.stroke(c);
    fallbackBackground.line(0, y, 800, y);
  }

  // Load backgrounds with error handling idk why it keeps showing image not available but it is??
  const bgFiles = ["street.png", "rooftop.png", "energyplant.png", "warehouse.png", "safehouse.png"];
  let failedAssets = [];
  bgFiles.forEach(file => {
    backgrounds[file] = loadImage(`assets/imgs/${file}`, 
      () => console.log(`Loaded ${file}`), 
      () => {
        console.error(`Failed to load ${file} - check path: assets/imgs/${file}`);
        failedAssets.push(file);
      }
    );
  });
  if (failedAssets.length > 0) {
    console.warn(`Failed to load assets: ${failedAssets.join(", ")}. Create 800x600 PNG placeholders in assets/imgs/`);
  }

  bgMusic = loadSound("assets/sounds/Cyberpunk Music Asset Pack/Main Menu - End Credits/Main Menu [Full Loop].wav", 
    () => console.log("Loaded bgMusic"), 
    () => console.error("Failed to load bgMusic - check path: assets/sounds/Cyberpunk Music Asset Pack/Main Menu - End Credits/Main Menu [Full Loop].wav")
  );

  for (let sfx of sfxFiles) {
    sfxLibrary[sfx.key] = loadSound(`assets/sfx/${sfx.file}`, 
      () => console.log(`Loaded ${sfx.key}`), 
      () => console.error(`Failed to load ${sfx.key}`)
    );
  }

  expressionsJSON = loadJSON("json/expressions.json?cachebust=" + Date.now(), 
    () => console.log("Loaded expressions.json"), 
    () => console.error("Failed to load expressions.json")
  );
  
  let loadAttempts = 0;
  function loadDialogue() {
    try {
      rawDialogue = loadJSON("json/dialogue.json?cachebust=" + Date.now(), () => {
        console.log("Loaded dialogue.json:", Object.keys(rawDialogue).length, "entries");
        console.log("Sample dialogue:", JSON.stringify(Object.values(rawDialogue).slice(0, 2)));
        dialogueKeys = Object.keys(rawDialogue).filter(k => !isNaN(parseInt(k))).sort((a, b) => parseInt(a) - parseInt(b));
        dialogue = dialogueKeys.map(k => rawDialogue[k]);
        if (dialogue[68]) {
          originalDialogue68 = JSON.parse(JSON.stringify(dialogue[68]));
        }
        console.log("Dialogue initialized with length:", dialogue.length);
        if (dialogue.length !== 73) {
          console.error("Unexpected dialogue length:", dialogue.length, "expected 73");
          if (loadAttempts < 1) {
            loadAttempts++;
            console.log(`Retrying dialogue load (attempt ${loadAttempts + 1})...`);
            loadDialogue();
          } else {
            console.warn("All load attempts failed. Using fallback dialogue for lines 0–72.");
            for (let i = 0; i <= 72; i++) {
              dialogue[i] = fallbackDialogue[i.toString()];
            }
          }
        }
        Object.freeze(dialogue);
        debugDialogue(0, 72);
      }, () => {
        console.error("Failed to load dialogue.json. Check file path: json/dialogue.json");
        if (loadAttempts < 1) {
          loadAttempts++;
          console.log(`Retrying dialogue load (attempt ${loadAttempts + 1})...`);
          loadDialogue();
        } else {
          console.warn("All load attempts failed. Using fallback dialogue for lines 0–72.");
          for (let i = 0; i <= 72; i++) {
            dialogue[i] = fallbackDialogue[i.toString()];
          }
          Object.freeze(dialogue);
          debugDialogue(0, 72);
        }
      });
    } catch (e) {
      console.error("Failed to parse dialogue.json:", e.message);
      if (loadAttempts < 1) {
        loadAttempts++;
        console.log(`Retrying dialogue load (attempt ${loadAttempts + 1})...`);
        loadDialogue();
      } else {
        console.warn("All load attempts failed. Using fallback dialogue for lines 0–72.");
        for (let i = 0; i <= 72; i++) {
          dialogue[i] = fallbackDialogue[i.toString()];
        }
        Object.freeze(dialogue);
        debugDialogue(0, 72);
      }
    }
  }
  loadDialogue();
}

function traceState(action) {
  console.log(`State trace [${action}]: currentLine=${currentLine}, pendingLine=${pendingLine}, gameState=${gameState}`);
}

function debugDialogue(start, end) {
  console.log(`Debugging dialogue lines ${start}–${end}:`);
  for (let i = start; i <= end && i < dialogue.length; i++) {
    console.log(`Line ${i}:`, JSON.stringify(dialogue[i] || 'undefined'));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  textSize(18 * min(width / 800, height / 600));
  frameRate(30);

  for (let expression in expressionsJSON) {
    characterExpressions[expression] = loadImage(expressionsJSON[expression], 
      () => console.log(`Loaded sprite ${expression}`), 
      () => console.error(`Failed to load sprite ${expression}`)
    );
  }

  particleSystem = new ParticleSystem(); //gunshots!
  setupButtons();

  startButton = createButton("Start");
  startButton.style("font-size", `${20 * min(width / 800, height / 600)}px`);
  startButton.style("padding", "10px 20px");
  startButton.style("width", `${120 * min(width / 800, height / 600)}px`);
  startButton.style("background-color", "#333");
  startButton.style("color", "#00FFFF");
  startButton.style("border", "2px solid #00FFFF");
  startButton.position(width / 2 - 60 * min(width / 800, height / 600), height / 2 + 20 * (height / 600));
  startButton.style('z-index', '1000');
  startButton.mouseOver(() => startButton.style("background-color", "#444"));
  startButton.mouseOut(() => startButton.style("background-color", "#333"));
  startButton.mousePressed(() => {
    console.log("Start button clicked");
    startButton.hide();
    gameState = "scene1";
    pendingLine = 0;
    currentLine = 0;
    traceState("startButton");
    resetTyping();
    initAudio();
    setTimeout(() => initAudio(), 100); // Retry audio
    select('canvas').elt.focus();
  });

  restartButton = createButton("Jack In Again, Courier?");
  restartButton.style("font-size", `${16 * min(width / 800, height / 600)}px`);
  restartButton.style("padding", "10px 20px");
  restartButton.style("width", `${300 * min(width / 800, height / 600)}px`);
  restartButton.style("text-align", "center");
  restartButton.style("background-color", "#333");
  restartButton.style("color", "#00FFFF");
  restartButton.style("border", "2px solid #00FFFF");
  restartButton.style("cursor", "pointer");
  restartButton.style("z-index", "2000");
  restartButton.mouseOver(() => restartButton.style("background-color", "#444"));
  restartButton.mouseOut(() => restartButton.style("background-color", "#333"));
  restartButton.position(width / 2 - 150 * min(width / 800, height / 600), height / 2 + 50 * (height / 600));
  restartButton.mousePressed(() => {
    let now = millis();
    if (now - lastClickTime < clickDebounce) return;
    lastClickTime = now;
    console.log("Restart button clicked");
    pendingLine = 0;
    currentLine = 0;
    trust.kael = 0;
    trust.vira = 0;
    gameState = "scene1";
    traceState("restartButton");
    resetTyping();
    initAudio();
    select('canvas').elt.focus();
    restartButton.hide();
  });
  restartButton.hide();

  select('canvas').mousePressed(() => {
    select('canvas').elt.focus();
    initAudio();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textSize(18 * min(width / 800, height / 600));
  startButton.position(width / 2 - 60 * min(width / 800, height / 600), height / 2 + 20 * (height / 600));
  restartButton.position(width / 2 - 150 * min(width / 800, height / 600), height / 2 + 50 * (height / 600));
  setupButtons();
}

function initAudio() {
  userStartAudio();
  let context = getAudioContext();
  if (!musicStarted && bgMusic.isLoaded() && context.state === 'running') {
    console.log("Starting background music");
    bgMusic.loop();
    musicStarted = true;
    audioRetryCount = 0;
  } else if (audioRetryCount < maxAudioRetries) {
    audioRetryCount++;
    console.warn(`AudioContext not ready or bgMusic not loaded. Retrying (${audioRetryCount}/${maxAudioRetries})...`);
    setTimeout(initAudio, 500 * audioRetryCount);
  } else {
    console.error("Failed to start background music after retries.");
  }
}

function draw() {
  background(0);

  if (gameState === "title") {
    drawTitleScreen();
    return;
  }

  if (gameState === "scene1") {
    drawGameScene();
  } else {
    console.error(`Invalid gameState: ${gameState}`);
  }

  particleSystem.update();
  particleSystem.display();

  if (flashAlpha > 0) {
    fill(flashColor[0], flashColor[1], flashColor[2], flashAlpha);
    rect(0, 0, width, height);
    flashAlpha -= 50 * min(width / 800, height / 600);
    if (flashAlpha < 0) flashAlpha = 0;
  }
}

function drawTitleScreen() {
  fill(0);
  rect(0, 0, width, height);
  drawingContext.shadowBlur = 30 * min(width / 800, height / 600);
  drawingContext.shadowColor = color(255, 0, 200);
  fill(255, 0, 200);
  textAlign(CENTER);
  textSize(48 * min(width / 800, height / 600));
  text("NEON REQUIEM", width / 2, height / 2 - 100 * (height / 600));
  drawingContext.shadowBlur = 0;
  fill(180);
  textSize(20 * min(width / 800, height / 600));
  text("A Cyberpunk Visual Novel", width / 2, height / 2 - 60 * (height / 600));
  text("Click 'Start' to begin", width / 2, height / 2 - 30 * (height / 600));
  if (!dialogue[0]) {
    textSize(14 * min(width / 800, height / 600));
    fill(255, 0, 0);
    text("Error: Dialogue failed to load", width / 2, height / 2 + 70 * (height / 600));
  }
  startButton.show();
}

function drawGameScene() {
  if (!dialogue || dialogue.length === 0 || !dialogue[currentLine]) {
    console.error(`Dialogue line undefined at index: ${currentLine}`);
    gameState = "title";
    pendingLine = 0;
    currentLine = 0;
    traceState("drawGameScene");
    resetTyping();
    return;
  }

  let current = dialogue[currentLine];
  let bgFile = current.background || currentBackground;
  let bgImg = backgrounds[bgFile] || fallbackBackground;

  if (!bgImg) {
    fill(20, 20, 50);
    rect(0, 0, width, height);
    console.warn(`Background ${bgFile} not loaded, using solid fallback`);
  } else {
    image(bgImg, 0, 0, width, height);
  }
  currentBackground = bgFile;

  if (current.sfx && sfxLibrary[current.sfx] && sfxLibrary[current.sfx].isLoaded() && !sfxLibrary[current.sfx].isPlaying()) {
    sfxLibrary[current.sfx].play();
  }

  if (["explosion"].includes(current.sfx)) {
    particleSystem.addParticles(10, width / 2, height / 2, "spark");
    flashAlpha = 255;
  } else if (["gunfire", "alarm", "sparks"].includes(current.sfx)) {
    particleSystem.addParticles(3, width / 2, height / 2, "spark");
    flashAlpha = 255;
  }

  fill(0, 200);
  rect(40 * (width / 800), 450 * (height / 600), 720 * (width / 800), 150 * (height / 600), 12 * min(width / 800, height / 600));
  fill(255);
  textStyle(BOLD);
  text(current.name, 60 * (width / 800), 470 * (height / 600));
  textStyle(NORMAL);

  let expression = current.expression || `${current.name.toLowerCase().replace(" ", "_")}_neutral`;
  let characterImage = characterExpressions[expression];

  if (characterImage && 
      current.name !== "You" && 
      current.name !== "Narration" && 
      current.name !== "Freedom Requiem" && 
      current.name !== "Ghost in the Circuit" && 
      current.name !== "City of Chains" && 
      current.name !== "The End") {
    let spriteWidth = 200 * min(width / 800, height / 600);
    let spriteHeight = 280 * min(width / 800, height / 600);
    image(characterImage, width - spriteWidth - 20 * (width / 800), 300 * (height / 600), spriteWidth, spriteHeight);
  }

  if (hackLines.includes(currentLine) || current.instant) {
    isTyping = false;
    displayedText = current.text;
    if (hackLines.includes(currentLine)) {
      flashTimer++;
      if (flashTimer >= flashInterval) {
        flashTimer = 0;
        flashCount++;
        flashAlpha = flashAlpha === 0 ? 255 : 0;
        flashColor = flashCount % 2 === 0 ? [255, 255, 255] : [0, 255, 100];
        particleSystem.addParticles(5, width / 2, height / 2, "spark");
        if (flashCount >= maxFlashes * 2) {
          flashCount = 0;
          flashAlpha = 0;
        }
      }
    } else {
      flashTimer = 0;
      flashCount = 0;
      flashAlpha = 0;
    }
  } else {
    if (isTyping) {
      let charsToShow = floor((frameCount - typeStartFrame) / typingSpeed);
      displayedText = current.text.substring(0, charsToShow);
      if (charsToShow >= current.text.length || (frameCount - typeStartFrame) > typingTimeout && !current.choices) {
        displayedText = current.text;
        isTyping = false;
      }
    } else {
      displayedText = current.text;
    }
    flashTimer = 0;
    flashCount = 0;
    flashAlpha = 0;
  }

  text(displayedText, 60 * (width / 800), 500 * (height / 600), 680 * (width / 800));
  textSize(14 * min(width / 800, height / 600));
  textAlign(LEFT);
  text(`Kael Trust: ${trust.kael} | Vira Trust: ${trust.vira}`, 60 * (width / 800), 40 * (height / 600));
  textAlign(CENTER);

  if (current.choices && activeChoices.length > 0 && !isTyping) {
    for (let i = 0; i < buttons.length; i++) {
      if (activeChoices[i]) {
        buttons[i].position(width / 2 - 150 * min(width / 800, height / 600), height - 100 * (height / 600) + i * 40 * (height / 600));
        buttons[i].html(activeChoices[i].dialogue || activeChoices[i].text);
        buttons[i].show();
      } else {
        buttons[i].hide();
      }
    }
  } else {
    for (let btn of buttons) {
      btn.hide();
    }
  }

  if (currentLine === 72 && !fading) {
    isTyping = false;
    restartButton.position(width / 2 - 150 * min(width / 800, height / 600), height / 2 + 50 * (height / 600));
    restartButton.show();
  } else {
    restartButton.hide();
  }

  if (fading) {
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
    fadeAlpha += fadeDirection * 15 * min(width / 800, height / 600);
    if (fadeAlpha >= 255) {
      fadeAlpha = 255;
      fadeDirection = -1;
    }
    if (fadeAlpha <= 0 && fadeDirection === -1) {
      fadeAlpha = 0;
      fading = false;
    }
  }

  if (currentLine === 63) {
    if (trust.kael >= 15 && trust.vira >= 15) {
      pendingLine = 64; // Freedom Requiem
      console.log("Selected Freedom Requiem (line 64)");
    } else if (trust.kael < 0 || trust.vira < 0) {
      pendingLine = 65; // Ghost in the Circuit
      console.log("Selected Ghost in the Circuit (line 65)");
    } else {
      pendingLine = 66; // City of Chains
      console.log("Selected City of Chains (line 66)");
    }
    currentLine = pendingLine;
    traceState("trustEvaluation");
    resetTyping();
  }
}

function setupButtons() {
  console.log("Setting up buttons");
  buttons.forEach(btn => btn.remove()); // Clear existing buttons
  buttons = [];

  for (let i = 0; i < 4; i++) {
    let btn = createButton("");
    btn.style('font-size', `${16 * min(width / 800, height / 600)}px`);
    btn.style('padding', '10px 20px');
    btn.style('width', `${300 * min(width / 800, height / 600)}px`);
    btn.style('text-align', 'center');
    btn.style('background-color', '#333');
    btn.style('color', '#00FFFF');
    btn.style('border', '2px solid #00FFFF');
    btn.style('cursor', 'pointer');
    btn.style('z-index', '1000');
    btn.mouseOver(() => btn.style('background-color', '#444; border-color: #00FFFF'));
    btn.mouseOut(() => btn.style('background-color', '#333'));
    btn.mousePressed(() => {
      let now = millis();
      if (now - lastClickTime < clickDebounce) return;
      lastClickTime = now;
      if (activeChoices[i]) {
        let choice = activeChoices[i];
        if (choice.trust) {
          if (choice.trust.kael) trust.kael += choice.trust.kael;
          if (choice.trust.vira) trust.vira += choice.trust.vira;
        }
        pendingLine = choice.next;
        if (validNextLines[currentLine] && pendingLine !== validNextLines[currentLine]) {
          console.error(`Invalid pendingLine ${pendingLine} for line ${currentLine}`);
          pendingLine = validNextLines[currentLine];
        }
        currentLine = pendingLine;
        activeChoices = [];
        debugDialogue(64, 72);
        traceState("buttonPress");
        resetTyping();
      }
    });
    btn.hide();
    buttons.push(btn);
  }
}

function resetTyping() {
  displayedText = "";
  isTyping = true;
  typeStartFrame = frameCount;
  typingSpeed = random(0.8, 1.2);
  activeChoices = dialogue[currentLine]?.choices || [];
  flashTimer = 0;
  flashCount = 0;
  flashAlpha = 0;
  debugDialogue(64, 72);
  traceState("resetTyping");
}

function mousePressed() {
  let now = millis();
  if (now - lastClickTime < clickDebounce) return;
  lastClickTime = now;
  debugDialogue(64, 72);
  traceState("mousePressed");
  if (!dialogue[currentLine]) {
    console.error(`Dialogue undefined at line ${currentLine}`);
    gameState = "title";
    pendingLine = 0;
    currentLine = 0;
    resetTyping();
    return;
  }
  if (!dialogue[currentLine]?.choices) {
    if (isTyping && !hackLines.includes(currentLine) && !dialogue[currentLine]?.instant) {
      isTyping = false;
      displayedText = dialogue[currentLine].text;
    } else if (dialogue[currentLine]?.next !== undefined && dialogue[currentLine]?.next !== null) {
      let nextLine = dialogue[currentLine].next;
      if (validNextLines[currentLine] && nextLine !== validNextLines[currentLine]) {
        console.error(`Invalid next line ${nextLine} for line ${currentLine}`);
        nextLine = validNextLines[currentLine];
      }
      if (nextLine >= 0 && nextLine < dialogue.length && dialogue[nextLine]) {
        pendingLine = nextLine;
        currentLine = pendingLine;
        resetTyping();
      } else {
        console.error(`Invalid next line ${nextLine} at line ${currentLine}`);
        nextLine = validNextLines[currentLine] || currentLine + 1;
        if (nextLine < dialogue.length && dialogue[nextLine]) {
          pendingLine = nextLine;
          currentLine = pendingLine;
          resetTyping();
        }
      }
    }
  }
}