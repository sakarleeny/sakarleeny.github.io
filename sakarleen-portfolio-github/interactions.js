const viewer = document.querySelector('.poster-viewer');
const poster = viewer.querySelector('img');

if (typeof viewer.showModal === 'function') {
  document.querySelectorAll('[data-open-poster]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      if (!poster.hasAttribute('src')) poster.src = link.href;
      viewer.showModal();
    });
  });

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
}

const intro = document.querySelector('.game-intro');
const replay = document.querySelector('.replay-intro');
const board = intro.querySelector('.intro-board');
const cells = [...board.children];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (typeof intro.showModal === 'function') {
  const moves = [0, 4, 8, 2, 6, 3, 7];
  const sessionKey = 'sakarleen-tic-tac-toe-intro';
  let timers = [];

  function playIntro() {
    if (intro.open) return;

    for (const cell of cells) {
      cell.textContent = '';
      delete cell.dataset.mark;
    }
    board.classList.remove('has-winner');
    intro.showModal();

    const step = reducedMotion.matches ? 0 : 205;
    timers = moves.map((position, index) => setTimeout(() => {
      const mark = index % 2 === 0 ? 'X' : 'O';
      cells[position].textContent = mark;
      cells[position].dataset.mark = mark;
      if (index === moves.length - 1) board.classList.add('has-winner');
    }, 160 + index * step));

    timers.push(setTimeout(() => {
      intro.classList.add('is-leaving');
      timers.push(setTimeout(() => intro.close(), reducedMotion.matches ? 0 : 220));
    }, 650 + (moves.length - 1) * step));
  }

  intro.addEventListener('close', () => {
    timers.forEach(clearTimeout);
    timers = [];
    intro.classList.remove('is-leaving');
  });
  replay.addEventListener('click', playIntro);
  replay.hidden = false;

  let seen = false;
  try {
    seen = sessionStorage.getItem(sessionKey) === 'seen';
    sessionStorage.setItem(sessionKey, 'seen');
  } catch {
    // Playback is still available when browser storage is restricted.
  }
  if (!seen && !reducedMotion.matches) playIntro();
}
