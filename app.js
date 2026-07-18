/* global VIS_PROMPT_TYPES */

const state = {
  activeType: null,
  activeCategory: null,
  selected: new Map()
};

const elements = {
  typeSection: document.querySelector("#typeSection"),
  builderSection: document.querySelector("#builderSection"),
  typeGrid: document.querySelector("#typeGrid"),
  categoryTabs: document.querySelector("#categoryTabs"),
  gallery: document.querySelector("#gallery"),
  activeTypeLabel: document.querySelector("#activeTypeLabel"),
  selectionCount: document.querySelector("#selectionCount"),
  selectedChips: document.querySelector("#selectedChips"),
  promptOutput: document.querySelector("#promptOutput"),
  subjectInput: document.querySelector("#subjectInput"),
  charCount: document.querySelector("#charCount"),
  copyButton: document.querySelector("#copyButton"),
  resetButton: document.querySelector("#resetButton"),
  headerReset: document.querySelector("#headerReset"),
  backButton: document.querySelector("#backButton"),
  toast: document.querySelector("#toast"),
  stepPill: document.querySelector("#stepPill")
};

function renderTypes() {
  elements.typeGrid.innerHTML = VIS_PROMPT_TYPES.map(
    (type, index) => `
      <button class="type-card" type="button" data-type="${type.id}">
        <span class="type-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="type-icon" aria-hidden="true">${type.icon}</span>
        <span class="type-name">${type.name}</span>
        <span class="type-description">${type.description}</span>
        <span class="type-arrow" aria-hidden="true">↗</span>
      </button>
    `
  ).join("");

  elements.typeGrid.querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => chooseType(button.dataset.type));
  });
}

function chooseType(typeId) {
  state.activeType = VIS_PROMPT_TYPES.find((type) => type.id === typeId);
  state.activeCategory = state.activeType.categories[0].id;
  state.selected.clear();
  elements.subjectInput.value = "";
  elements.typeSection.classList.add("hidden");
  elements.builderSection.classList.remove("hidden");
  elements.activeTypeLabel.textContent = state.activeType.name.toUpperCase();
  elements.stepPill.textContent = "STEP 2 / 3";
  renderCategories();
  renderGallery();
  updatePrompt();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCategories() {
  elements.categoryTabs.innerHTML = state.activeType.categories.map((category) => `
    <button class="category-tab ${category.id === state.activeCategory ? "active" : ""}"
      type="button" data-category="${category.id}">
      ${category.name}
      <span>${countCategorySelections(category.id)}</span>
    </button>
  `).join("");

  elements.categoryTabs.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategories();
      renderGallery();
    });
  });
}

function renderGallery() {
  const category = state.activeType.categories.find((item) => item.id === state.activeCategory);
  elements.gallery.innerHTML = `
    <div class="gallery-heading">
      <h2>${category.name}</h2>
      <p>複数選択できます</p>
    </div>
    <div class="image-grid">
      ${category.items.map((item) => `
        <button class="image-card ${state.selected.has(item.id) ? "selected" : ""}"
          type="button" data-item="${item.id}" aria-pressed="${state.selected.has(item.id)}">
          <span class="image-wrap">
            <img src="${item.image}" alt="${item.label}の参考イメージ" loading="lazy" />
            <span class="checkmark">✓</span>
          </span>
          <span class="image-label">${item.label}</span>
        </button>
      `).join("")}
    </div>
  `;

  elements.gallery.querySelectorAll("[data-item]").forEach((button) => {
    button.addEventListener("click", () => toggleItem(button.dataset.item));
  });
  elements.gallery.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => image.closest(".image-wrap").classList.add("image-error"));
  });
}

function findItem(itemId) {
  for (const category of state.activeType.categories) {
    const item = category.items.find((entry) => entry.id === itemId);
    if (item) return { ...item, categoryId: category.id, categoryName: category.name };
  }
  return null;
}

function toggleItem(itemId) {
  if (state.selected.has(itemId)) {
    state.selected.delete(itemId);
  } else {
    const item = findItem(itemId);
    if (item) state.selected.set(itemId, item);
  }
  renderCategories();
  renderGallery();
  updatePrompt();
}

function countCategorySelections(categoryId) {
  return [...state.selected.values()].filter((item) => item.categoryId === categoryId).length;
}

function compilePrompt() {
  const subject = elements.subjectInput.value.trim();
  const tags = [...new Set([...state.selected.values()].flatMap((item) => item.tags))];
  if (!subject && tags.length === 0) return "";
  const parts = [];
  if (subject) parts.push(subject);
  parts.push(...tags);
  return `${parts.join("、")}。高品質で、細部まで丁寧に表現する。`;
}

function updatePrompt() {
  const prompt = compilePrompt();
  const count = state.selected.size;
  elements.selectionCount.textContent = count;
  elements.promptOutput.value = prompt;
  elements.charCount.textContent = `${prompt.length}文字`;
  elements.copyButton.disabled = !prompt;
  elements.stepPill.textContent = count || elements.subjectInput.value.trim() ? "STEP 3 / 3" : "STEP 2 / 3";

  if (!count) {
    elements.selectedChips.innerHTML = '<span class="empty-selection">選択したイメージがここに表示されます</span>';
    return;
  }
  elements.selectedChips.innerHTML = [...state.selected.values()].map((item) => `
    <button type="button" class="selected-chip" data-remove="${item.id}" title="選択解除">
      ${item.label}<span>×</span>
    </button>
  `).join("");
  elements.selectedChips.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => toggleItem(button.dataset.remove));
  });
}

function resetSelections() {
  state.selected.clear();
  elements.subjectInput.value = "";
  if (state.activeType) {
    renderCategories();
    renderGallery();
  }
  updatePrompt();
}

async function copyPrompt() {
  const prompt = elements.promptOutput.value.trim();
  if (!prompt) return;
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    elements.promptOutput.select();
    document.execCommand("copy");
  }
  elements.toast.classList.add("show");
  elements.copyButton.innerHTML = '<span aria-hidden="true">✓</span> コピーしました';
  window.setTimeout(() => {
    elements.toast.classList.remove("show");
    elements.copyButton.innerHTML = '<span aria-hidden="true">▣</span> プロンプトをコピー';
  }, 1800);
}

function returnToTypes() {
  resetSelections();
  state.activeType = null;
  state.activeCategory = null;
  elements.builderSection.classList.add("hidden");
  elements.typeSection.classList.remove("hidden");
  elements.stepPill.textContent = "STEP 1 / 3";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

elements.subjectInput.addEventListener("input", updatePrompt);
elements.promptOutput.addEventListener("input", () => {
  elements.charCount.textContent = `${elements.promptOutput.value.length}文字`;
  elements.copyButton.disabled = !elements.promptOutput.value.trim();
});
elements.copyButton.addEventListener("click", copyPrompt);
elements.resetButton.addEventListener("click", resetSelections);
elements.headerReset.addEventListener("click", resetSelections);
elements.backButton.addEventListener("click", returnToTypes);

renderTypes();
updatePrompt();
