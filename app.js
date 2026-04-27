const STORAGE_KEY = "yespace.mvp.v10";

const choices = [
  { id: "want", label: "Want" },
  { id: "willing", label: "Willing" },
  { id: "no", label: "No Way" },
  { id: "learn", label: "Learn" },
];

const categories = [
  {
    id: "energetic",
    title: "Energetic",
    items: [
      "Eye Gazing",
      "Hands Hovering Over Body",
      "Hands Hovering Over Genitals",
      "Energetic Kissing",
      "Breathing Together",
      "Light Energetic Touch",
      "Teasing and Anticipation",
      "Tantric/Sacred Sex",
      "Tantric Practice",
      "Sex Transmutation",
      "Sexual Partner Yoga",
      "Erotic Hypnosis/Sex Meditation",
      "Crystal/Jade Eggs",
      "Chakra Toning/Chanting",
      "Light Feathers",
      "Tickling",
      "Energy Sex",
      "Goddess Worship",
      "Other",
    ],
  },
  {
    id: "sensual",
    title: "Sensual",
    items: [
      "Cuddling",
      "Spooning",
      "Blindfold",
      "Sensual/Erotic Massage",
      "Scalp Massage",
      "Nipple Play",
      "Temperature Play (Cold)",
      "Temperature Play (Hot)",
      "Fur Mitts",
      "Sensation Toys",
      "Kissing",
      "Nibbling",
      "Sensual Eating/Feasting",
      "Slow Dancing",
      "Full Body Contact",
      "Body Sling w/Oil",
      "Music During Sex",
      "Sensual Bathing/Showering",
      "Erotic Swimming/Watsu",
      "Erotic Photography",
      "Other",
    ],
  },
  {
    id: "sexual",
    title: "Sexual",
    items: [
      "Oral Sex",
      "Genital Massage/Touching",
      "Penetration",
      "Vibrators (External)",
      "Vibrators (Internal)",
      "Intercourse",
      "Anal Sex (External)",
      "Anal Sex (Internal)",
      "Anilingus",
      "Strip Tease",
      "Sex Games",
      "New Sexual Positions",
      "Quickies",
      "Dildos",
      "Butt Plugs",
      "Sex in Public",
      "Rough Sex",
      "Ravishment/Being Taken",
      "Pounding During Intercourse",
      "Sex During Period",
      "Other",
    ],
  },
  {
    id: "kinky-psychological",
    title: "Kinky: Psychological",
    items: [
      "Being Dominant",
      "Being Submissive",
      "Mind Sex",
      "Being a Sex Slave",
      "Explicit/Naughty Talk",
      "Humiliation",
      "Punishment/Rewards Play",
      "Ownership",
      "Owning Genitals",
      "Orgasm Control",
      "Cross-Dressing (Gender Play)",
      "Fantasy Play",
      "Role-Play",
      "Forced Pleasure",
      "Being Spit On",
      "Interrogation Scenes",
      "Financial Domination",
      "Foot or Boot Worship",
      "Dressing",
      "Other",
    ],
  },
  {
    id: "kinky-sensation",
    title: "Kinky: Sensation",
    items: [
      "Sensory Play with Restraint",
      "Wrist Restraint",
      "Ankle Restraint",
      "Spreader Bars",
      "Suspension",
      "Whole Body Constriction",
      "Shibari/Intense Rope Tie",
      "Predicament Restraint",
      "Genital Binding",
      "Intercourse combined with Restraint",
      "Oral Sex combined with Restraints",
      "Holding Hands Down",
      "Holding Legs Down",
      "Erotic Wrestling",
      "Choking",
      "Hair Pulling",
      "Silk Ties/Sashes",
      "Bound to Furniture",
      "Other Restraint",
      "Ball Gag",
      "Bit Gag",
      "Hand Over Mouth/Nose",
      "Open Mouth Gag",
      "Love Taps/Spanking",
      "Face Slaps",
      "Pounding with Hands",
      "Riding Crops",
      "Paddles",
      "Whipping",
      "Caning",
      "Flogging",
      "Pinching",
      "Biting Hard",
      "Drawing Blood",
      "Vaginal Fisting",
      "Anal Fisting",
      "Bondassage",
      "Breath Play",
      "Body Fluid Play (Ejaculate)",
      "Body Fluid Play (Urine)",
      "Body Fluid Play (Blood)",
      "Body Fluid Play (Scat)",
      "Strap-On Play",
      "Other",
    ],
  },
  {
    id: "shapeshifter",
    title: "Shapeshifter",
    items: [
      "3 hours or more of all Sensations",
      "Combinations of all of the above",
      "Stacking of all of the above",
      "Spending a whole day in pleasure",
      "Pleasure Waving",
      "4-6 Handed Massage",
      "Threesome",
      "Foursome",
      "Threesome with a Man",
      "Threesome with a Woman",
      "Double Penetration",
      "Other",
    ],
  },
];

const state = {
  activeProfile: "self",
  activeCategory: categories[0].id,
  view: "checklist",
  connectionMenuOpen: false,
  data: loadState(),
};

const categoryList = document.querySelector("#categoryList");
const checklistGrid = document.querySelector("#checklistGrid");
const compareView = document.querySelector("#compareView");
const viewTitle = document.querySelector("#viewTitle");
const modeLabel = document.querySelector("#modeLabel");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const introPanel = document.querySelector("#introPanel");
const bottomActions = document.querySelector("#bottomActions");
const exportButton = document.querySelector("#exportButton");
const resetButton = document.querySelector("#resetButton");
const profileTabs = document.querySelectorAll(".profile-tab");
const addConnectionButton = document.querySelector("#addConnectionButton");
const deleteConnectionButton = document.querySelector("#deleteConnectionButton");
const connectionNameInput = document.querySelector("#connectionNameInput");
const connectionMenu = document.querySelector("#connectionMenu");
const previousConnectionButton = document.querySelector("#previousConnectionButton");
const nextConnectionButton = document.querySelector("#nextConnectionButton");

function loadState() {
  const blank = createBlankState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return blank;
    if (saved.connections) return normalizeState(saved);
    return normalizeState({
      self: saved.self || {},
      activeConnectionId: "connection-1",
      connections: [{ id: "connection-1", name: "Connection 1", data: saved.partner || {} }],
    });
  } catch {
    return blank;
  }
}

function createBlankState() {
  return {
    self: {},
    activeConnectionId: "connection-1",
    nextConnectionNumber: 2,
    connections: [{ id: "connection-1", name: "Connection 1", data: {} }],
  };
}

function normalizeState(saved) {
  const fallback = createBlankState();
  const connections = Array.isArray(saved.connections) && saved.connections.length
    ? saved.connections.map((connection, index) => ({
        id: connection.id || `connection-${index + 1}`,
        name: connection.name || `Connection ${index + 1}`,
        data: connection.data || {},
      }))
    : fallback.connections;

  const activeConnectionId = connections.some(
    (connection) => connection.id === saved.activeConnectionId,
  )
    ? saved.activeConnectionId
    : connections[0].id;

  return {
    self: saved.self || {},
    activeConnectionId,
    nextConnectionNumber: Math.max(
      Number(saved.nextConnectionNumber) || 0,
      inferNextConnectionNumber(connections),
    ),
    connections,
  };
}

function inferNextConnectionNumber(connections) {
  const highest = connections.reduce((max, connection) => {
    const match = /^Connection\s+(\d+)$/i.exec(connection.name.trim());
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return highest + 1;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function itemKey(categoryId, item) {
  return `${categoryId}::${item}`;
}

function activeConnection() {
  return (
    state.data.connections.find((connection) => connection.id === state.data.activeConnectionId) ||
    state.data.connections[0]
  );
}

function profileStore(profile) {
  return profile === "self" ? state.data.self : activeConnection().data;
}

function getAnswer(profile, categoryId, item) {
  const key = itemKey(categoryId, item);
  return profileStore(profile)[key] || { give: "", receive: "", notes: "" };
}

function setAnswer(profile, categoryId, item, patch) {
  const key = itemKey(categoryId, item);
  profileStore(profile)[key] = { ...getAnswer(profile, categoryId, item), ...patch };
  saveState();
  render();
}

function countCategory(profile, category) {
  const possible = category.items.length * 2;
  const complete = category.items.reduce((total, item) => {
    const answer = getAnswer(profile, category.id, item);
    return total + Number(Boolean(answer.give)) + Number(Boolean(answer.receive));
  }, 0);
  return { complete, possible };
}

function countAll(profile) {
  return categories.reduce(
    (total, category) => {
      const count = countCategory(profile, category);
      return {
        complete: total.complete + count.complete,
        possible: total.possible + count.possible,
      };
    },
    { complete: 0, possible: 0 },
  );
}

function countAllForStore(store) {
  return categories.reduce(
    (total, category) => {
      const possible = category.items.length * 2;
      const complete = category.items.reduce((itemTotal, item) => {
        const answer = store[itemKey(category.id, item)] || {};
        return itemTotal + Number(Boolean(answer.give)) + Number(Boolean(answer.receive));
      }, 0);
      return {
        complete: total.complete + complete,
        possible: total.possible + possible,
      };
    },
    { complete: 0, possible: 0 },
  );
}

function renderCategoryList() {
  categoryList.innerHTML = categories
    .map((category) => {
      const count = countCategory(state.activeProfile, category);
      const active = category.id === state.activeCategory && state.view === "checklist";
      return `
        <button class="category-button ${active ? "active" : ""}" data-category="${category.id}">
          <span>${category.title}</span>
          <span class="category-count">${count.complete}/${count.possible}</span>
        </button>
      `;
    })
    .join("");
}

function renderConnectionPanel() {
  renderConnectionMenu();
  connectionNameInput.value = activeConnection().name;
}

function renderConnectionMenu() {
  connectionMenu.classList.toggle("hidden", !state.connectionMenuOpen);
  connectionMenu.innerHTML = state.data.connections
    .map(
      (connection) => `
        <button
          class="connection-menu-button ${
            connection.id === state.data.activeConnectionId ? "active" : ""
          }"
          data-connection-id="${connection.id}"
        >
          <span>${connection.name}</span>
          <small>${countAllForStore(connection.data).complete}/274</small>
        </button>
      `,
    )
    .join("");
}

function renderChecklist() {
  const category = categories.find((entry) => entry.id === state.activeCategory);
  viewTitle.textContent = category.title;
  modeLabel.textContent =
    state.activeProfile === "self"
      ? "My private checklist"
      : `${activeConnection().name} profile`;

  checklistGrid.innerHTML = category.items
    .map((item) => {
      const answer = getAnswer(state.activeProfile, category.id, item);
      return `
        <article class="item-card">
          <h3>${item}</h3>
          ${renderDirection(category.id, item, "give", "I want to give", answer.give)}
          ${renderDirection(category.id, item, "receive", "I want to receive", answer.receive)}
          <textarea class="notes-field" data-category="${category.id}" data-item="${item}" placeholder="Private notes, boundaries, conditions, questions...">${answer.notes || ""}</textarea>
        </article>
      `;
    })
    .join("");
}

function renderDirection(categoryId, item, direction, label, activeChoice) {
  return `
    <div class="direction-block">
      <div class="direction-label">${label}</div>
      <div class="choice-row">
        ${choices
          .map(
            (choice) => `
              <button
                class="choice-button ${activeChoice === choice.id ? "active" : ""}"
                data-category="${categoryId}"
                data-item="${item}"
                data-direction="${direction}"
                data-choice="${choice.id}"
              >${choice.label}</button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function getComparisonRows() {
  const connection = activeConnection();
  const rows = {
    mutualWant: [],
    explore: [],
    boundary: [],
    learn: [],
  };

  categories.forEach((category) => {
    category.items.forEach((item) => {
      const self = getAnswer("self", category.id, item);
      const partner = connection.data[itemKey(category.id, item)] || {
        give: "",
        receive: "",
        notes: "",
      };
      ["give", "receive"].forEach((direction) => {
        const counterpart = direction === "give" ? "receive" : "give";
        const mine = self[direction];
        const theirs = partner[counterpart];
        const label =
          direction === "give"
            ? `You give / Partner receives`
            : `You receive / Partner gives`;

        if (!mine && !theirs) return;
        const row = { item, category: category.title, label, mine, theirs };
        if (mine === "no" || theirs === "no") rows.boundary.push(row);
        else if (mine === "learn" || theirs === "learn") rows.learn.push(row);
        else if (mine === "want" && theirs === "want") rows.mutualWant.push(row);
        else if (
          ["want", "willing"].includes(mine) &&
          ["want", "willing"].includes(theirs)
        )
          rows.explore.push(row);
      });
    });
  });

  return rows;
}

function renderCompare() {
  const rows = getComparisonRows();
  viewTitle.textContent = `Compare with ${activeConnection().name}`;
  modeLabel.textContent = "Shared conversation map";
  compareView.innerHTML = `
    ${renderCompareSection("Green lights", rows.mutualWant, "Clear overlap for enthusiastic exploration.", "green")}
    ${renderCompareSection("Yellow lights", rows.explore, "One or both of you marked Willing. Open a relaxed conversation.", "yellow")}
    ${renderCompareSection("Boundaries", rows.boundary, "Any No is a stop sign. Honor it without persuasion.")}
    ${renderCompareSection("Learn first", rows.learn, "Pause for definitions, safety, or education before deciding.")}
  `;
}

function renderCompareSection(title, rows, emptyText, tone = "") {
  return `
    <article class="compare-section ${tone ? `compare-section-${tone}` : ""}">
      <h3>${title}</h3>
      ${
        rows.length
          ? `<ul class="compare-list">${rows
              .slice(0, 40)
              .map(
                (row) => `
                  <li>
                    <span>${row.item}</span>
                    <small>${row.category} · ${row.label} · ${formatChoice(row.mine)} / ${formatChoice(row.theirs)}</small>
                  </li>
                `,
              )
              .join("")}</ul>`
          : `<p class="empty-state">${emptyText}</p>`
      }
    </article>
  `;
}

function formatChoice(choice) {
  return choices.find((entry) => entry.id === choice)?.label || "Blank";
}

function updateProgress() {
  const count =
    state.view === "compare"
      ? countAll("self")
      : countCategory(
          state.activeProfile,
          categories.find((entry) => entry.id === state.activeCategory),
        );
  const percent = count.possible ? Math.round((count.complete / count.possible) * 100) : 0;
  if (state.view === "compare") {
    const partner = countAll("partner");
    progressText.textContent = `Me ${count.complete}/${count.possible} · ${activeConnection().name} ${partner.complete}/${partner.possible}`;
  } else {
    progressText.textContent = `${count.complete} of ${count.possible} complete`;
  }
  progressFill.style.width = `${percent}%`;
}

function render() {
  const isCompare = state.view === "compare";
  profileTabs.forEach((tab) => {
    const active =
      (tab.dataset.profile && tab.dataset.profile === state.activeProfile && !isCompare) ||
      (tab.dataset.view === "compare" && isCompare);
    tab.classList.toggle("active", active);
  });

  renderCategoryList();
  renderConnectionPanel();
  checklistGrid.classList.toggle("hidden", isCompare);
  compareView.classList.toggle("hidden", !isCompare);
  introPanel.classList.toggle("hidden", isCompare);
  bottomActions.classList.toggle("hidden", isCompare);

  if (isCompare) renderCompare();
  else renderChecklist();
  updateProgress();
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.activeCategory = button.dataset.category;
  state.view = "checklist";
  render();
});

profileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.view === "compare") {
      state.view = "compare";
    } else {
      state.activeProfile = tab.dataset.profile;
      state.view = "checklist";
    }
    render();
  });
});

checklistGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".choice-button");
  if (!button) return;
  const answer = getAnswer(state.activeProfile, button.dataset.category, button.dataset.item);
  const current = answer[button.dataset.direction];
  setAnswer(state.activeProfile, button.dataset.category, button.dataset.item, {
    [button.dataset.direction]: current === button.dataset.choice ? "" : button.dataset.choice,
  });
});

checklistGrid.addEventListener("input", (event) => {
  const field = event.target.closest(".notes-field");
  if (!field) return;
  const key = itemKey(field.dataset.category, field.dataset.item);
  profileStore(state.activeProfile)[key] = {
    ...getAnswer(state.activeProfile, field.dataset.category, field.dataset.item),
    notes: field.value,
  };
  saveState();
});

function commitConnectionName({ switchOnMatch = true } = {}) {
  const nextName = connectionNameInput.value.trim() || "Untitled connection";
  const matchingConnection = state.data.connections.find(
    (connection) => connection.name === nextName && connection.id !== state.data.activeConnectionId,
  );

  if (matchingConnection && switchOnMatch) {
    state.data.activeConnectionId = matchingConnection.id;
    saveState();
    render();
    return;
  }

  if (matchingConnection) return;

  const connection = activeConnection();
  connection.name = nextName;
  saveState();
  renderCategoryList();
  renderConnectionMenu();
  if (state.view === "compare") {
    renderCompare();
    updateProgress();
  } else if (state.activeProfile === "partner") {
    modeLabel.textContent = `${connection.name} profile`;
  }
}

connectionNameInput.addEventListener("click", () => {
  state.connectionMenuOpen = true;
  renderConnectionMenu();
});

connectionNameInput.addEventListener("input", () => {
  state.connectionMenuOpen = false;
  commitConnectionName({ switchOnMatch: false });
});

connectionNameInput.addEventListener("change", () => {
  commitConnectionName({ switchOnMatch: true });
});

connectionMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-connection-id]");
  if (!button) return;
  selectConnection(button.dataset.connectionId);
});

addConnectionButton.addEventListener("click", () => {
  commitConnectionName({ switchOnMatch: false });
  const id = `connection-${Date.now()}`;
  const connectionNumber = state.data.nextConnectionNumber;
  state.data.nextConnectionNumber += 1;
  state.data.connections.push({
    id,
    name: `Connection ${connectionNumber}`,
    data: {},
  });
  state.data.activeConnectionId = id;
  state.activeProfile = "partner";
  state.view = "checklist";
  state.connectionMenuOpen = false;
  saveState();
  render();
  connectionNameInput.focus();
  connectionNameInput.select();
});

deleteConnectionButton.addEventListener("click", () => {
  const connection = activeConnection();
  const confirmed = window.confirm(`Delete ${connection.name}? This removes this connection profile from this browser.`);
  if (!confirmed) return;

  if (state.data.connections.length === 1) {
    connection.name = "Connection 1";
    connection.data = {};
    state.data.nextConnectionNumber = 2;
  } else {
    const currentIndex = state.data.connections.findIndex((entry) => entry.id === connection.id);
    state.data.connections = state.data.connections.filter((entry) => entry.id !== connection.id);
    const nextConnection =
      state.data.connections[Math.max(0, currentIndex - 1)] || state.data.connections[0];
    state.data.activeConnectionId = nextConnection.id;
  }

  state.connectionMenuOpen = false;
  saveState();
  render();
});

previousConnectionButton.addEventListener("click", () => {
  moveConnection(-1);
});

nextConnectionButton.addEventListener("click", () => {
  moveConnection(1);
});

function moveConnection(direction) {
  commitConnectionName({ switchOnMatch: false });
  const currentIndex = state.data.connections.findIndex(
    (connection) => connection.id === state.data.activeConnectionId,
  );
  const nextIndex =
    (currentIndex + direction + state.data.connections.length) % state.data.connections.length;
  selectConnection(state.data.connections[nextIndex].id);
}

function selectConnection(connectionId) {
  state.data.activeConnectionId = connectionId;
  state.connectionMenuOpen = false;
  saveState();
  render();
}

document.querySelectorAll(".next-category-button").forEach((button) => {
  button.addEventListener("click", () => {
    goToCategory(1);
  });
});

document.querySelectorAll(".previous-category-button").forEach((button) => {
  button.addEventListener("click", () => {
    goToCategory(-1);
  });
});

function goToCategory(direction) {
  const currentIndex = categories.findIndex((category) => category.id === state.activeCategory);
  const nextIndex = (currentIndex + direction + categories.length) % categories.length;
  const next = categories[nextIndex];
  state.activeCategory = next.id;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

exportButton.addEventListener("click", () => {
  const payload = {
    app: "Yespace",
    exportedAt: new Date().toISOString(),
    activeConnection: activeConnection().name,
    data: state.data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `yespace-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

resetButton.addEventListener("click", () => {
  const confirmed = window.confirm("Clear your profile and all connection profiles from this browser?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  state.data = loadState();
  render();
});

render();
