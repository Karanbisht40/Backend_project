const searchBox = document.getElementById("searchBox");
const suggestionsBox = document.getElementById("suggestions");

searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();
  suggestionsBox.innerHTML = "";

  if (query.length < 2) return; // wait until 2+ letters typed

  const res = await fetch(`/listings/search/suggestions?q=${query}`);
  const data = await res.json();

  if (data.length === 0) return;

  // Create suggestion items
  data.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("list-group-item", "list-group-item-action");
    div.textContent = `${item.title} (${item.location})`;
    div.addEventListener("click", () => {
      searchBox.value = item.title;
      suggestionsBox.innerHTML = "";
      document.getElementById("searchForm").submit();
    //   searchBox.value=" ";
    });
    suggestionsBox.appendChild(div);
  });
});

// Hide suggestions when clicking outside
document.addEventListener("click", e => {
  if (!searchBox.contains(e.target)) suggestionsBox.innerHTML = "";
});