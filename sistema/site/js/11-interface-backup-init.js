function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mesa-rpg-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}
function openModal(title, body, actions) {
  byId("modal-title").textContent = title;
  byId("modal-body").innerHTML = body;
  byId("modal-actions").innerHTML = actions.map(([label, cls], idx) => `<button class="btn ${cls}" data-action="${idx}">${label}</button>`).join("");
  actions.forEach(([, , fn], idx) => byId("modal-actions").querySelector(`[data-action="${idx}"]`).onclick = fn);
  byId("modal").classList.add("open");
}
function closeModal() {
  byId("modal").classList.remove("open");
}
byId("modal").addEventListener("click", event => {
  if (event.target.id === "modal") closeModal();
});
function toast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

renderAll();
initCloudFromConfig();
