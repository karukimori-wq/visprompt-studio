/* global VIS_PROMPT_TYPES */

const state = {
  activeType: null,
  activeCategory: null,
  selected: new Map(),
  searchQuery: "",
  promptExpanded: true
};

const elements = {
  typeSection: document.querySelector("#typeSection"),
  builderSection: document.querySelector("#builderSection"),
  typeGrid: document.querySelector("#typeGrid"),
  categoryTabs: document.querySelector("#categoryTabs"),
  categorySelect: document.querySelector("#categorySelect"),
  gallery: document.querySelector("#gallery"),
  activeTypeLabel: document.querySelector("#activeTypeLabel"),
  selectionCount: document.querySelector("#selectionCount"),
  selectedChips: document.querySelector("#selectedChips"),
  promptOutput: document.querySelector("#promptOutput"),
  subjectInput: document.querySelector("#subjectInput"),
  itemSearch: document.querySelector("#itemSearch"),
  charCount: document.querySelector("#charCount"),
  copyButton: document.querySelector("#copyButton"),
  resetButton: document.querySelector("#resetButton"),
  headerReset: document.querySelector("#headerReset"),
  backButton: document.querySelector("#backButton"),
  promptPanel: document.querySelector(".prompt-panel"),
  promptToggle: document.querySelector("#promptToggle"),
  toast: document.querySelector("#toast"),
  stepPill: document.querySelector("#stepPill")
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function renderItemCard(item, categoryName = "") {
  const selected = state.selected.has(item.id);
  const categoryBadge = categoryName
    ? `<span class="image-category">${categoryName}</span>`
    : "";

  if (!item.image) {
    return `
      <button class="image-card text-only ${selected ? "selected" : ""}"
        type="button" data-item="${item.id}" aria-pressed="${selected}">
        <span class="compact-choice">
          ${categoryBadge}
          <span class="compact-label">${item.label}</span>
          <span class="compact-status">画像未設定</span>
          <span class="checkmark">✓</span>
        </span>
      </button>
    `;
  }

  return `
    <button class="image-card ${selected ? "selected" : ""}"
      type="button" data-item="${item.id}" aria-pressed="${selected}">
      <span class="image-wrap">
        <img src="${item.image}" alt="${item.label}の参考イメージ" loading="lazy" />
        <span class="checkmark">✓</span>
      </span>
      ${categoryBadge}
      <span class="image-label">${item.label}</span>
    </button>
  `;
}

function renderTypes() {
  elements.typeGrid.innerHTML = VIS_PROMPT_TYPES.map(
    (type, index) => `
      <button class="type-card" type="button" data-type="${type.id}" aria-label="${type.name}">
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
  if (!state.activeType?.categories.length) return;
  state.activeCategory = state.activeType.categories[0].id;
  state.selected.clear();
  state.searchQuery = "";
  elements.subjectInput.value = "";
  elements.itemSearch.value = "";
  elements.typeSection.classList.add("hidden");
  elements.builderSection.classList.remove("hidden");
  elements.activeTypeLabel.textContent = state.activeType.name.toUpperCase();
  elements.stepPill.textContent = "STEP 2 / 3";
  setPromptExpanded(!window.matchMedia("(max-width: 760px)").matches);
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

  elements.categorySelect.innerHTML = state.activeType.categories.map((category) => `
    <option value="${category.id}" ${category.id === state.activeCategory ? "selected" : ""}>
      ${category.name}（${countCategorySelections(category.id)}）
    </option>
  `).join("");

  elements.categoryTabs.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => chooseCategory(button.dataset.category));
  });
}

function chooseCategory(categoryId) {
  state.activeCategory = categoryId;
  state.searchQuery = "";
  elements.itemSearch.value = "";
  renderCategories();
  renderGallery();
}

function renderGallery() {
  if (state.searchQuery) {
    renderSearchResults();
    return;
  }
  const category = state.activeType.categories.find((item) => item.id === state.activeCategory);
  const categoryIndex = state.activeType.categories.findIndex((item) => item.id === state.activeCategory);
  const previousCategory = state.activeType.categories[categoryIndex - 1] || null;
  const nextCategory = state.activeType.categories[categoryIndex + 1] || null;
  elements.gallery.innerHTML = `
    <div class="gallery-heading">
      <h2>${category.name}</h2>
      <p>${categoryIndex + 1} / ${state.activeType.categories.length} ・ 複数選択可</p>
    </div>
    <div class="image-grid">
      ${category.items.map((item) => renderItemCard(item)).join("")}
    </div>
    <nav class="category-navigation" aria-label="カテゴリーを順番に移動">
      <button type="button" class="category-move previous"
        ${previousCategory ? `data-category-jump="${previousCategory.id}"` : "disabled"}>
        <span aria-hidden="true">←</span>
        <span><small>前のカテゴリー</small>${previousCategory?.name || "先頭です"}</span>
      </button>
      <span class="category-position">${categoryIndex + 1} / ${state.activeType.categories.length}</span>
      <button type="button" class="category-move next"
        ${nextCategory ? `data-category-jump="${nextCategory.id}"` : "disabled"}>
        <span><small>次のカテゴリー</small>${nextCategory?.name || "最後です"}</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  `;

  bindGalleryInteractions();
  elements.gallery.querySelectorAll("[data-category-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      chooseCategory(button.dataset.categoryJump);
      elements.gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderSearchResults() {
  const query = state.searchQuery.toLocaleLowerCase("ja");
  const results = state.activeType.categories.flatMap((category) =>
    category.items
      .filter((item) => `${category.name} ${item.label}`.toLocaleLowerCase("ja").includes(query))
      .map((item) => ({ ...item, categoryName: category.name }))
  );

  elements.gallery.innerHTML = `
    <div class="gallery-heading">
      <h2>「${escapeHtml(state.searchQuery)}」の検索結果</h2>
      <p>${results.length}件</p>
    </div>
    ${results.length ? `
      <div class="image-grid">
        ${results.map((item) => renderItemCard(item, item.categoryName)).join("")}
      </div>
    ` : '<div class="search-empty">該当するアイテムがありません。別の言葉で検索してください。</div>'}
  `;

  bindGalleryInteractions();
}

function bindGalleryInteractions() {
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
  const selections = [...state.selected.values()];
  if (!subject && selections.length === 0) return "";

  const parts = [];
  if (subject) {
    parts.push(`「${subject}」を主題とした${state.activeType.name}`);
  } else {
    parts.push(`${state.activeType.name}を制作する`);
  }

  state.activeType.categories.forEach((category) => {
    const categoryTags = [...new Set(
      selections
        .filter((item) => item.categoryId === category.id)
        .flatMap((item) => item.tags)
    )];
    if (categoryTags.length) parts.push(`${category.name}：${categoryTags.join("、")}`);
  });

  parts.push("全体に統一感を持たせる", "高品質", "細部まで丁寧に表現する");
  return `${parts.join("。")}。`;
}

function setPromptExpanded(expanded) {
  state.promptExpanded = expanded;
  elements.promptPanel.classList.toggle("collapsed", !expanded);
  document.body.classList.toggle("prompt-collapsed", !expanded);
  elements.promptToggle.setAttribute("aria-expanded", String(expanded));
  elements.promptToggle.querySelector(".toggle-label").textContent = expanded ? "収納" : "プロンプトを見る";
  elements.promptToggle.querySelector(".toggle-icon").textContent = expanded ? "⌄" : "⌃";
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
  state.searchQuery = "";
  elements.itemSearch.value = "";
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
elements.itemSearch.addEventListener("input", () => {
  state.searchQuery = elements.itemSearch.value.trim();
  renderGallery();
});
elements.categorySelect.addEventListener("change", () => chooseCategory(elements.categorySelect.value));
elements.promptOutput.addEventListener("input", () => {
  elements.charCount.textContent = `${elements.promptOutput.value.length}文字`;
  elements.copyButton.disabled = !elements.promptOutput.value.trim();
});
elements.copyButton.addEventListener("click", copyPrompt);
elements.resetButton.addEventListener("click", resetSelections);
elements.headerReset.addEventListener("click", resetSelections);
elements.backButton.addEventListener("click", returnToTypes);
elements.promptToggle.addEventListener("click", () => setPromptExpanded(!state.promptExpanded));

window.matchMedia("(max-width: 760px)").addEventListener("change", (event) => {
  if (state.activeType) setPromptExpanded(!event.matches);
});

renderTypes();
updatePrompt();
