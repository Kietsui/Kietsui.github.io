let characters = [];
let targetCharacter;
let guessedNames = new Set();

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
  "Zou",
  "Whole Cake Island",
  "Wano Country",
  "Reverie",
  "Egghead",
];

async function loadCharacters() {
  try {
    const response = await fetch('./data/CharactersOnePiece.json');
    if (!response.ok) throw new Error('Failed to load characters JSON');
    const data = await response.json();
    characters = data.characters;
    pickRandomCharacter();
  } catch (error) {
    alert('Error loading character data: ' + error);
    console.error(error);
  }
}

function pickRandomCharacter() {
  const idx = Math.floor(Math.random() * characters.length);
  targetCharacter = characters[idx];
  console.log('Target character selected:', targetCharacter.name);
}

function arraysEqual(a, b) {
  return [...a].sort().join(",") === [...b].sort().join(",");
}

function compareAttributes(guess, answer) {
  const guessArcIndex = arcOrder.indexOf(guess.arc);
  const answerArcIndex = arcOrder.indexOf(answer.arc);

  let arcComparison = "red"; // default to red if arcs not found or different

  if (guess.arc === answer.arc) {
    arcComparison = "green";
  } else if (guessArcIndex !== -1 && answerArcIndex !== -1) {
    if (answerArcIndex > guessArcIndex) {
      arcComparison = "red-up";   // answer arc is later (higher index)
    } else if (answerArcIndex < guessArcIndex) {
      arcComparison = "red-down"; // answer arc is earlier (lower index)
    }
  }

  return {
    // other attributes...
    name: guess.name === answer.name ? "green" : "red",
    gender: guess.gender === answer.gender ? "green" : "red",
    affiliation: guess.affiliation === answer.affiliation ? "green" : "red",
    origin: guess.origin.trim().toLowerCase() === answer.origin.trim().toLowerCase() ? "green" : "red",
    arc: arcComparison,
    bounty: guess.bounty === answer.bounty ? "green" : guess.bounty > answer.bounty ? "red-down" : "red-up",
    height: guess.height === answer.height ? "green" : guess.height > answer.height ? "red-down" : "red-up",
    haki: (guess.haki.length === 0 && answer.haki.length === 0) || arraysEqual(guess.haki, answer.haki) ? "green" : "red",
    fruit: ((guess.devilFruit?.type || "None") === (answer.devilFruit?.type || "None")) ? "green" : "red",
  };
}



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

  if (guess.name === targetCharacter.name) {
  alert(`🎉 Congratulations! You guessed the character correctly: ${targetCharacter.name}`);

  localStorage.setItem('lastCharacter', targetCharacter.name);

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

function clearDropdown() {
  const dropdown = document.getElementById("autocomplete-list");
  if (dropdown) dropdown.innerHTML = "";
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  loadCharacters();

  const input = document.getElementById("guess-input");
  const submitBtn = document.getElementById("submit-guess");

  submitBtn?.addEventListener("click", () => {
    if (input.value.trim()) {
      handleGuess(input.value);
      input.value = "";
      clearDropdown();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      handleGuess(input.value);
      input.value = "";
      clearDropdown();
    }
  });

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
