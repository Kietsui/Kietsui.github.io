//store the characters and game state
let characters = [];
let targetCharacter;
let guessedNames = new Set();

//list of arcs in order for comparison
const arcOrder = [
  "Romance Dawn",
  "Orange Town",
  "Syrup Village",
  "Baratie",
  "Arlong Park",
  "Loguetown",
  "Reverse Mountain",
  "Whiskey Peak",
  "Little Garden",
  "Drum Island",
  "Alabasta",
  "Jaya",
  "Skypiea",
  "Water 7",
  "Enies Lobby",
  "Thriller Bark",
  "Sabaody Archipelago",
  "Amazon Lily",
  "Impel Down",
  "Marineford",
  "Post-War",
  "Fishman Island",
  "Punk Hazard",
  "Dressrosa",
  "Zhou",
  "Whole Cake Island",
  "Wano Country",
  "Reverie",
  "Egghead",
];

//loads the characters from json and initializes the game
async function loadCharacters() {
  try {
    const response = await fetch('./data/CharactersOnePiece.json');
    if (!response.ok) throw new Error('Failed to load characters JSON');
    const data = await response.json();
    characters = data.characters;
    pickRandomCharacter(); // selects a random character from the JSON file
  } catch (error) {
    alert('Error loading character data: ' + error);
    console.error(error);
  }
}

// selects a random character to be the target
function pickRandomCharacter() {
  const idx = Math.floor(Math.random() * characters.length);
  targetCharacter = characters[idx];
  console.log('Target character selected:', targetCharacter.name);
}

// checks if 2 arrays are equal regardless of order
function arraysEqual(a, b) {
  return [...a].sort().join(",") === [...b].sort().join(",");
}

// comparares all relevant attributes bteween the guess and the target
function compareAttributes(guess, answer) {
  const guessArcIndex = arcOrder.indexOf(guess.arc);
  const answerArcIndex = arcOrder.indexOf(answer.arc);

  let arcComparison = "red"; // default arc comparison color

  if (guess.arc === answer.arc) {
    arcComparison = "green"; // exact match color
  } else if (guessArcIndex !== -1 && answerArcIndex !== -1) {
    arcComparison = answerArcIndex > guessArcIndex ? "red-up" : "red-down";
  }

  // Haki comparison helper. checks if guess and target hakies match
  function isSubset(subset, set) {
    return subset.every(x => set.includes(x));
  }

    // Haki comparison
  let hakiComparison = "red"; // default - no match

  const guessHaki = guess.haki || [];
  const answerHaki = answer.haki || [];

  const bothEmpty = guessHaki.length === 0 && answerHaki.length === 0;
  const exactMatch = arraysEqual(guessHaki, answerHaki);
  const anyShared = guessHaki.some(h => answerHaki.includes(h));

  if (bothEmpty || exactMatch) {
    hakiComparison = "green";   // perfect match, or both the guess and the target have no haki
  } else if (anyShared) {
    hakiComparison = "yellow";  // has at least one matching haki
  } else {
    hakiComparison = "red";     // no shared haki at all
  }


    // Fruit comparison logic
  let fruitComparison = "red";
  const guessFruitName = guess.devilFruit?.name || "None";
  const guessFruitType = guess.devilFruit?.type || "None";
  const answerFruitName = answer.devilFruit?.name || "None";
  const answerFruitType = answer.devilFruit?.type || "None";

  if (guessFruitName === answerFruitName) {
    fruitComparison = "green"; // exact fruit match
  } else if (guessFruitType === answerFruitType && guessFruitType !== "None") {
    fruitComparison = "yellow"; // same fruit type but different fruit
  } else if (
    (guessFruitType === "Zoan" && answerFruitType === "Mythical Zoan") ||
    (guessFruitType === "Mythical Zoan" && answerFruitType === "Zoan")
  ) {
    fruitComparison = "yellow"; // special case: Zoan and Mythical Zoan
  } else if (guessFruitType === "None" && answerFruitType === "None") {
    fruitComparison = "green"; // both have no fruit
  }


  // return object with comparsion result of each attribute
  return {
    name: guess.name === answer.name ? "green" : "red",
    gender: guess.gender === answer.gender ? "green" : "red",
    affiliation: guess.affiliation === answer.affiliation ? "green" : "red",
    origin: guess.origin.trim().toLowerCase() === answer.origin.trim().toLowerCase() ? "green" : "red",
    arc: arcComparison,
    bounty: guess.bounty === answer.bounty ? "green" : guess.bounty > answer.bounty ? "red-down" : "red-up",
    height: guess.height === answer.height ? "green" : guess.height > answer.height ? "red-down" : "red-up",
    haki: hakiComparison,
    fruit: fruitComparison,
  };
}

  // handles the logic when the user submits a guessw
  function handleGuess(name) {
    const normalized = name.trim().toLowerCase();
    if (guessedNames.has(normalized)) {
      alert("You already guessed that character!");
      return;
    }

    const guess = characters.find(c => c.name.toLowerCase() === normalized);
    if (!guess) {
      alert("Character not found!");
      return;
    }

    guessedNames.add(normalized);
    const comparison = compareAttributes(guess, targetCharacter);
    renderComparisonRow(guess, comparison);

    // correct guess logic
    if (guess.name === targetCharacter.name) {
    localStorage.setItem('lastCharacter', targetCharacter.name);

    // play again button
    const footer = document.querySelector(".footer");
    const existingBtn = footer.querySelector(".play-again-btn");
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement("button");
    btn.textContent = "Play Again";
    btn.className = "play-again-btn";
    btn.addEventListener("click", () => {
      location.reload();
    });
    footer.appendChild(btn);
  }
}

// adds the guessed characters on a list
function renderComparisonRow(character, comparison) {
  const row = document.createElement("div");
  row.className = "character-row";
  row.innerHTML = `
    <div class="cell name ${comparison.name}">${character.name}</div>
    <div class="cell ${comparison.gender}">${character.gender}</div>
    <div class="cell ${comparison.affiliation}">${character.affiliation}</div>
    <div class="cell ${comparison.fruit}">${character.devilFruit?.type || "None"}</div>
    <div class="cell ${comparison.haki}">${character.haki.length ? character.haki.join(", ") : "None"}</div>
    <div class="cell bounty ${comparison.bounty}">₿ ${character.bounty.toLocaleString()} ${comparison.bounty.includes('red') ? (comparison.bounty === 'red-up' ? '↑' : '↓') : ''}</div>
    <div class="cell ${comparison.height}">${character.height} cm ${comparison.height.includes('red') ? (comparison.height === 'red-up' ? '↑' : '↓') : ''}</div>
    <div class="cell ${comparison.origin}">${character.origin}</div>
    <div class="cell ${comparison.arc}">
      ${character.arc} 
      ${comparison.arc.includes('red') ? (comparison.arc === 'red-up' ? '↑' : '↓') : ''}
    </div>

  `;

  const guessesContainer = document.getElementById("guesses");

  guessesContainer?.insertBefore(row, guessesContainer.firstChild);
}

// displays a dropdown to show suggestions
function createDropdown(matches) {
  const dropdown = document.getElementById("autocomplete-list");
  if (!dropdown) return;
  dropdown.innerHTML = "";
  matches.forEach(character => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.textContent = character.name;
    item.addEventListener("click", () => {
      const input = document.getElementById("guess-input");
      input.value = character.name;
      dropdown.innerHTML = "";
      input.focus();
    });
    dropdown.appendChild(item);
  });
}

// clear teh dropdown
function clearDropdown() {
  const dropdown = document.getElementById("autocomplete-list");
  if (dropdown) dropdown.innerHTML = "";
}

// Main Init on page load
window.addEventListener('DOMContentLoaded', () => {
  loadCharacters();

  const input = document.getElementById("guess-input");
  const submitBtn = document.getElementById("submit-guess");

  // handle guess button click
  submitBtn?.addEventListener("click", () => {
    if (input.value.trim()) {
      handleGuess(input.value);
      input.value = "";
      clearDropdown();
    }
  });

  // handle enter jey press
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      handleGuess(input.value);
      input.value = "";
      clearDropdown();
    }
  });

  // show dropdown as user types
  input.addEventListener("input", () => {
    const val = input.value.trim().toLowerCase();
    if (!val) {
      clearDropdown();
      return;
    }

    const matches = characters.filter(c => c.name.toLowerCase().includes(val)).slice(0, 10);
    if (matches.length > 0) {
      createDropdown(matches);
    } else {
      clearDropdown();
    }
  });

  // unfocusing input field closes the dropdown
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target !== input && !document.getElementById("autocomplete-list")?.contains(target)) {
      clearDropdown();
    }

    const lastCharSpan = document.getElementById('yesterday-character');
    const lastCharName = localStorage.getItem('lastCharacter');
    if (lastCharSpan) {
        lastCharSpan.textContent = lastCharName ? lastCharName : '???';
    }
  });
});
