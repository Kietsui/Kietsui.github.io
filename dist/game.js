"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let characters = [];
let targetCharacter;
let guessedNames = new Set();
function loadCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('./onepiecedle/data/CharactersOnePiece.json');
            if (!response.ok)
                throw new Error('Failed to load characters JSON');
            const data = yield response.json();
            characters = data.characters;
            pickRandomCharacter();
        }
        catch (error) {
            alert('Error loading character data: ' + error);
            console.error(error);
        }
    });
}
function pickRandomCharacter() {
    const idx = Math.floor(Math.random() * characters.length);
    targetCharacter = characters[idx];
    console.log('Target character selected:', targetCharacter.name); // For debugging
}
function compareAttributes(guess, answer) {
    var _a, _b;
    return {
        gender: guess.gender === answer.gender ? "green" : "red",
        affiliation: guess.affiliation === answer.affiliation ? "green" : "red",
        origin: guess.origin === answer.origin ? "green" : "red",
        arc: guess.arc === answer.arc ? "green" : "red",
        bounty: guess.bounty === answer.bounty ? "green" : guess.bounty > answer.bounty ? "red-down" : "red-up",
        height: guess.height === answer.height ? "green" : guess.height > answer.height ? "red-down" : "red-up",
        haki: arraysEqual(guess.haki, answer.haki) ? "green" : "red",
        fruit: ((_a = guess.devilFruit) === null || _a === void 0 ? void 0 : _a.name) === ((_b = answer.devilFruit) === null || _b === void 0 ? void 0 : _b.name) ? "green" : "red",
    };
}
function arraysEqual(a, b) {
    return [...a].sort().join(",") === [...b].sort().join(",");
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
        // Optionally reset game or disable input here
    }
}
function renderComparisonRow(character, comparison) {
    var _a, _b;
    const row = document.createElement("div");
    row.className = "character-row";
    row.innerHTML = `
    <div class="cell name">${character.name}</div>
    <div class="cell ${comparison.gender}">${character.gender}</div>
    <div class="cell ${comparison.affiliation}">${character.affiliation}</div>
    <div class="cell ${comparison.fruit}">${((_a = character.devilFruit) === null || _a === void 0 ? void 0 : _a.name) || "None"}</div>
    <div class="cell ${comparison.haki}">${character.haki.length ? character.haki.join(", ") : "None"}</div>
    <div class="cell ${comparison.bounty}">₿ ${character.bounty.toLocaleString()}</div>
    <div class="cell ${comparison.height}">${character.height} cm</div>
    <div class="cell ${comparison.origin}">${character.origin}</div>
    <div class="cell ${comparison.arc}">${character.arc}</div>
  `;
    (_b = document.getElementById("guesses")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
}
function createDropdown(matches) {
    const dropdown = document.getElementById("autocomplete-list");
    if (!dropdown)
        return;
    dropdown.innerHTML = ""; // Clear previous suggestions
    matches.forEach(character => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = character.name;
        item.addEventListener("click", () => {
            const input = document.getElementById("guess-input");
            input.value = character.name;
            dropdown.innerHTML = ""; // Clear dropdown after selection
            input.focus();
        });
        dropdown.appendChild(item);
    });
}
window.addEventListener('DOMContentLoaded', () => {
    loadCharacters();
    const input = document.getElementById("guess-input");
    const submitBtn = document.getElementById("submit-guess");
    // Submit guess on button click
    submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener("click", () => {
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
        const matches = characters.filter(c => c.name.toLowerCase().includes(val)).slice(0, 10); // limit to 10 suggestions
        if (matches.length > 0) {
            createDropdown(matches);
        }
        else {
            clearDropdown();
        }
    });
    // Close dropdown if clicked outside input or dropdown
    document.addEventListener("click", (e) => {
        var _a;
        const target = e.target;
        if (target !== input && !((_a = document.getElementById("autocomplete-list")) === null || _a === void 0 ? void 0 : _a.contains(target))) {
            clearDropdown();
        }
    });
});
function clearDropdown() {
    const dropdown = document.getElementById("autocomplete-list");
    if (dropdown)
        dropdown.innerHTML = "";
}
