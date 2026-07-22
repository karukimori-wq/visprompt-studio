/* global VIS_PROMPT_TYPES */

const state = {
  activeType: null,
  activeCategory: null,
  selected: new Map(),
  searchQuery: "",
  showSelectedOnly: false,
  promptMode: "standard",
  promptFormat: "yaml",
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
  mainSelectedChips: document.querySelector("#mainSelectedChips"),
  selectedOnlyToggle: document.querySelector("#selectedOnlyToggle"),
  selectedChips: document.querySelector("#selectedChips"),
  promptOutput: document.querySelector("#promptOutput"),
  subjectInput: document.querySelector("#subjectInput"),
  promptMode: document.querySelector("#promptMode"),
  promptFormat: document.querySelector("#promptFormat"),
  promptFormatLabel: document.querySelector("#promptFormatLabel"),
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

const promptFormatLabels = {
  text: "文章プロンプト",
  yaml: "YAMLプロンプト",
  json: "JSONプロンプト"
};

const showMappedImages = false;

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

  if (!showMappedImages || !item.image) {
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
  state.showSelectedOnly = false;
  state.promptMode = "standard";
  state.promptFormat = "yaml";
  elements.subjectInput.value = "";
  elements.promptMode.value = state.promptMode;
  elements.promptFormat.value = state.promptFormat;
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
  state.showSelectedOnly = false;
  elements.itemSearch.value = "";
  renderCategories();
  renderGallery();
}

function renderGallery() {
  if (state.showSelectedOnly) {
    renderSelectedOnlyGallery();
    return;
  }

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

function renderSelectedOnlyGallery() {
  const selections = [...state.selected.values()];
  elements.gallery.innerHTML = `
    <div class="gallery-heading">
      <h2>選択済みアイテム</h2>
      <p>${selections.length}件 ・ タップで解除</p>
    </div>
    ${selections.length ? `
      <div class="image-grid">
        ${selections.map((item) => renderItemCard(item, item.categoryName)).join("")}
      </div>
    ` : '<div class="search-empty">まだアイテムが選択されていません。</div>'}
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
  if (!state.selected.size) state.showSelectedOnly = false;
  renderCategories();
  renderGallery();
  updatePrompt();
}

function countCategorySelections(categoryId) {
  return [...state.selected.values()].filter((item) => item.categoryId === categoryId).length;
}

function getPromptGroups(selections) {
  return state.activeType.categories.map((category) => {
    const tags = [...new Set(
      selections
        .filter((item) => item.categoryId === category.id)
        .flatMap((item) => item.tags)
    )];
    const items = selections
      .filter((item) => item.categoryId === category.id)
      .map((item) => item.label);
    return { category, tags, items };
  }).filter((group) => group.tags.length || group.items.length);
}

function getQualityDirectives() {
  if (state.promptMode === "short") return ["高品質"];
  if (state.promptMode === "detailed") {
    return [
      "選択した要素同士が自然につながるように構成する",
      "主題が一目で伝わる構図にする",
      "色・質感・余白・視線誘導まで丁寧に整える",
      "完成度の高い商用品質に仕上げる"
    ];
  }
  return ["全体に統一感を持たせる", "高品質", "細部まで丁寧に表現する"];
}

function getNegativeDirectives() {
  return state.promptMode === "detailed"
    ? ["低品質", "歪み", "不自然な文字", "過度な装飾"]
    : [];
}

function buildPromptData(subject, groups) {
  const prompt = {};
  groups.forEach(({ category, tags }) => {
    prompt[category.name] = tags;
  });

  return {
    type: state.activeType.name,
    subject: subject || null,
    style: state.promptMode,
    prompt,
    quality: getQualityDirectives(),
    negative: getNegativeDirectives()
  };
}

function yamlScalar(value) {
  if (value === null || value === undefined || value === "") return "null";
  return JSON.stringify(value);
}

function yamlList(values, indent = "  ") {
  if (!values.length) return `${indent}[]`;
  return values.map((value) => `${indent}- ${yamlScalar(value)}`).join("\n");
}

function formatYaml(data) {
  const lines = [
    `type: ${yamlScalar(data.type)}`,
    `subject: ${yamlScalar(data.subject)}`,
    `style: ${yamlScalar(data.style)}`,
    "prompt:"
  ];

  const promptEntries = Object.entries(data.prompt);
  if (!promptEntries.length) {
    lines.push("  []");
  } else {
    promptEntries.forEach(([categoryName, tags]) => {
      lines.push(`  ${categoryName}:`);
      lines.push(yamlList(tags, "    "));
    });
  }

  lines.push("quality:");
  lines.push(yamlList(data.quality, "  "));
  lines.push("negative:");
  lines.push(yamlList(data.negative, "  "));
  return lines.join("\n");
}

function formatTextPrompt(data, groups) {
  if (state.promptMode === "short") {
    const base = data.subject
      ? `「${data.subject}」の${data.type}`
      : `${data.type}`;
    const tags = groups.flatMap((group) => group.tags);
    return [base, ...tags, ...data.quality].join("、");
  }

  const parts = [];
  if (data.subject) {
    parts.push(`「${data.subject}」を主題とした${data.type}`);
  } else {
    parts.push(`${data.type}を制作する`);
  }

  groups.forEach(({ category, tags }) => {
    parts.push(`${category.name}：${tags.join("、")}`);
  });

  parts.push(...data.quality);
  if (data.negative.length) parts.push(`避ける要素：${data.negative.join("、")}`);
  return `${parts.join("。")}${state.promptMode === "short" ? "" : "。"}`;
}

function compilePrompt() {
  const subject = elements.subjectInput.value.trim();
  const selections = [...state.selected.values()];
  if (!subject && selections.length === 0) return "";

  const groups = getPromptGroups(selections);
  const data = buildPromptData(subject, groups);

  if (state.promptFormat === "yaml") return formatYaml(data);
  if (state.promptFormat === "json") return JSON.stringify(data, null, 2);
  return formatTextPrompt(data, groups);
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
  elements.promptFormatLabel.textContent = promptFormatLabels[state.promptFormat];
  elements.copyButton.disabled = !prompt;
  elements.stepPill.textContent = count || elements.subjectInput.value.trim() ? "STEP 3 / 3" : "STEP 2 / 3";
  elements.selectedOnlyToggle.disabled = !count;
  elements.selectedOnlyToggle.classList.toggle("active", state.showSelectedOnly);
  elements.selectedOnlyToggle.textContent = state.showSelectedOnly ? "通常表示に戻る" : "選択済みだけ表示";

  renderSelectedChips(elements.mainSelectedChips, "まだ選択されていません");
  renderSelectedChips(elements.selectedChips, "選択したイメージがここに表示されます");
}

function renderSelectedChips(container, emptyMessage) {
  const count = state.selected.size;
  if (!count) {
    container.innerHTML = `<span class="empty-selection">${emptyMessage}</span>`;
    return;
  }

  container.innerHTML = [...state.selected.values()].map((item) => `
    <button type="button" class="selected-chip" data-remove="${item.id}" title="選択解除">
      ${item.label}<span>×</span>
    </button>
  `).join("");

  container.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => toggleItem(button.dataset.remove));
  });
}

function resetSelections() {
  state.selected.clear();
  elements.subjectInput.value = "";
  state.searchQuery = "";
  state.showSelectedOnly = false;
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
elements.promptMode.addEventListener("change", () => {
  state.promptMode = elements.promptMode.value;
  updatePrompt();
});
elements.promptFormat.addEventListener("change", () => {
  state.promptFormat = elements.promptFormat.value;
  updatePrompt();
});
elements.itemSearch.addEventListener("input", () => {
  state.searchQuery = elements.itemSearch.value.trim();
  state.showSelectedOnly = false;
  renderGallery();
  updatePrompt();
});
elements.categorySelect.addEventListener("change", () => chooseCategory(elements.categorySelect.value));
elements.selectedOnlyToggle.addEventListener("click", () => {
  if (!state.selected.size) return;
  state.searchQuery = "";
  elements.itemSearch.value = "";
  state.showSelectedOnly = !state.showSelectedOnly;
  renderGallery();
  updatePrompt();
});
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
