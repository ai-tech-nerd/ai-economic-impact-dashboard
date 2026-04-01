// Source Archive — Filter & Search Logic
(function () {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const eventRows = document.querySelectorAll('.event-row');
  const resultCount = document.getElementById('result-count');
  const noResults = document.getElementById('no-results');

  let activeTab = 'all';

  function updateCount() {
    let visible = 0;
    eventRows.forEach(row => {
      if (!row.classList.contains('hidden')) visible++;
    });
    resultCount.innerHTML = `<strong>${visible}</strong> of ${eventRows.length} events`;
    if (noResults) {
      noResults.classList.toggle('hidden', visible > 0);
    }
  }

  function filterEntries() {
    const query = searchInput.value.trim().toLowerCase();

    eventRows.forEach(row => {
      const company = (row.dataset.company || '').toLowerCase();
      const tab = row.dataset.tab || 'main';

      const matchesTab = activeTab === 'all' || tab === activeTab;
      const matchesSearch = !query || company.includes(query);

      row.classList.toggle('hidden', !(matchesTab && matchesSearch));
    });

    updateCount();
  }

  // Bind search
  searchInput.addEventListener('input', filterEntries);

  // Bind filter tabs
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      filterEntries();
    });
  });

  // Initial count
  updateCount();
})();
