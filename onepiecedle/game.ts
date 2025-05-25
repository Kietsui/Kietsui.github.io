type DevilFruit = {
  name: string;
  type: string;
};

type Character = {
  Id: number;
  name: string;
  gender: string;
  affiliation: string;
  devilFruit: DevilFruit | null;
  haki: string[];
  bounty: number;
  height: number;
  origin: string;
  arc: string;
};

let characters: Character[] = [];
let targetCharacter: Character;
let guessedNames = new Set<string>();

async function loadCharacters() {
  try {
    const response = await fetch('./onepiecedle/data/CharactersOnePiece.json');
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
  console.log('Target character selected:', targetCharacter.name); // For debugging
}

function compareAttributes(guess: Character, answer: Character): Record<string, string> {
  return {
    gender: guess.gender === answer.gender ? "green" : "red",
    affiliation: guess.affiliation === answer.affiliation ? "green" : "red",
    origin: guess.origin === answer.origin ? "green" : "red",
    arc: guess.arc === answer.arc ? "green" : "red",
    bounty: guess.bounty === answer.bounty ? "green" : guess.bounty > answer.bounty ? "red-down" : "red-up",
    height: guess.height === answer.height ? "green" : guess.height > answer.height ? "red-down" : "red-up",
    haki: arraysEqual(guess.haki, answer.haki) ? "green" : "red",
    fruit: guess.devilFruit?.name === answer.devilFruit?.name ? "green" : "red",
  };
}

function arraysEqual(a: string[], b: string[]) {
  return [...a].sort().join(",") === [...b].sort().join(",");
}

function handleGuess(name: string) {
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
    // Optionally reset game or disable input here
  }
}

function renderComparisonRow(character: Character, comparison: Record<string, string>) {
  const row = document.createElement("div");
  row.className = "character-row";

  row.innerHTML = `
    <div class="cell name">${character.name}</div>
    <div class="cell ${comparison.gender}">${character.gender}</div>
    <div class="cell ${comparison.affiliation}">${character.affiliation}</div>
    <div class="cell ${comparison.fruit}">${character.devilFruit?.name || "None"}</div>
    <div class="cell ${comparison.haki}">${character.haki.length ? character.haki.join(", ") : "None"}</div>
    <div class="cell ${comparison.bounty}">₿ ${character.bounty.toLocaleString()}</div>
    <div class="cell ${comparison.height}">${character.height} cm</div>
    <div class="cell ${comparison.origin}">${character.origin}</div>
    <div class="cell ${comparison.arc}">${character.arc}</div>
  `;

  document.getElementById("guesses")?.appendChild(row);
}

function createDropdown(matches: Character[]) {
  const dropdown = document.getElementById("autocomplete-list");
  if (!dropdown) return;

  dropdown.innerHTML = ""; // Clear previous suggestions

  matches.forEach(character => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.textContent = character.name;
    item.addEventListener("click", () => {
      const input = document.getElementById("guess-input") as HTMLInputElement;
      input.value = character.name;
      dropdown.innerHTML = ""; // Clear dropdown after selection
      input.focus();
    });
    dropdown.appendChild(item);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadCharacters();

  const input = document.getElementById("guess-input") as HTMLInputElement;
  const submitBtn = document.getElementById("submit-guess");

  // Submit guess on button click
  submitBtn?.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      handleGuess(input.value);
      input.value = "";
      clearDropdown();
    }
  });

  // Submit guess on Enter key press
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.value.trim() !== "") {
        handleGuess(input.value);
        input.value = "";
        clearDropdown();
      }
    }
  });

  // Show dropdown suggestions on input
  input.addEventListener("input", () => {
    const val = input.value.trim().toLowerCase();
    if (!val) {
      clearDropdown();
      return;
    }

    const matches = characters.filter(c =>
      c.name.toLowerCase().includes(val)
    ).slice(0, 10); // limit to 10 suggestions

    if (matches.length > 0) {
      createDropdown(matches);
    } else {
      clearDropdown();
    }
  });

  // Close dropdown if clicked outside input or dropdown
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target !== input && !document.getElementById("autocomplete-list")?.contains(target)) {
      clearDropdown();
    }
  });
});

function clearDropdown() {
  const dropdown = document.getElementById("autocomplete-list");
  if (dropdown) dropdown.innerHTML = "";
}
