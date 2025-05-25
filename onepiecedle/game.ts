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

async function loadCharacters() {
  try {
    const response = await fetch('./onepiecedle/data/CharactersOnePiece.json');
    if (!response.ok) throw new Error('Failed to load characters JSON');
    const data = await response.json();
    characters = data.characters;
    pickRandomCharacter();
  } catch (error) {
    alert('Error loading character data: ' + console.log(error));
  }
}

function pickRandomCharacter() {
  const idx = Math.floor(Math.random() * characters.length);
  targetCharacter = characters[idx];
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
  const guess = characters.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (!guess) {
    alert("Character not found!");
    return;
  }

  const comparison = compareAttributes(guess, targetCharacter);
  renderComparisonRow(guess, comparison);
}

function renderComparisonRow(character: Character, comparison: Record<string, string>) {
  const row = document.createElement("div");
  row.className = "character-row";

  row.innerHTML = `
    <div class="cell name">${character.name}</div>
    <div class="cell ${comparison.gender}">${character.gender}</div>
    <div class="cell ${comparison.affiliation}">${character.affiliation}</div>
    <div class="cell ${comparison.fruit}">${character.devilFruit?.name || "None"}</div>
    <div class="cell ${comparison.haki}">${character.haki.join(", ") || "None"}</div>
    <div class="cell ${comparison.bounty}">₿ ${character.bounty.toLocaleString()}</div>
    <div class="cell ${comparison.height}">${character.height} cm</div>
    <div class="cell ${comparison.origin}">${character.origin}</div>
    <div class="cell ${comparison.arc}">${character.arc}</div>
  `;
  
  document.getElementById("guesses")?.appendChild(row);
}

// Load character data on page load and setup event listener
window.addEventListener('DOMContentLoaded', () => {
  loadCharacters();

  document.getElementById("submit-guess")?.addEventListener("click", () => {
    const val = (document.getElementById("guess-input") as HTMLInputElement).value;
    handleGuess(val);
  });
});
