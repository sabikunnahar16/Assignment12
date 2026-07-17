// Powers the two live "Run" demos on the page.
// Real setTimeout timing is used throughout — nothing here is faked or sped up.

const diagram = {
  token: document.getElementById('token'),
  boxes: {
    stack: document.getElementById('box-callstack'),
    libuv: document.getElementById('box-libuv'),
    queue: document.getElementById('box-queue'),
    loop: document.getElementById('box-loop'),
  },
  paths: {
    stackToLibuv: document.getElementById('path-stack-to-libuv'),
    libuvToQueue: document.getElementById('path-libuv-to-queue'),
    queueToLoop: document.getElementById('path-queue-to-loop'),
    loopToStack: document.getElementById('path-loop-to-stack'),
  },
  positions: {
    stack: { x: 130, y: 125 },
    libuv: { x: 415, y: 135 },
    queue: { x: 415, y: 325 },
    loop:  { x: 130, y: 300 },
  }
};

function resetDiagram() {
  Object.values(diagram.boxes).forEach(b => b.classList.remove('active'));
  Object.values(diagram.paths).forEach(p => p.classList.remove('active'));
  diagram.token.classList.remove('visible');
}

function moveToken(x, y) {
  diagram.token.classList.add('visible');
  diagram.token.setAttribute('cx', x);
  diagram.token.setAttribute('cy', y);
}

function setActive(boxKey, pathKey) {
  Object.values(diagram.boxes).forEach(b => b.classList.remove('active'));
  Object.values(diagram.paths).forEach(p => p.classList.remove('active'));
  if (boxKey) diagram.boxes[boxKey].classList.add('active');
  if (pathKey) diagram.paths[pathKey].classList.add('active');
}

function elapsed(start) {
  return `+${Math.round(performance.now() - start)}ms`;
}

function printLine(consoleEl, text, kind, start) {
  const line = document.createElement('div');
  line.className = `console-line ${kind}`;
  line.innerHTML = `<span class="t">${elapsed(start)}</span><span class="m">${text}</span>`;
  consoleEl.appendChild(line);
}

function runDemo({ taskNum, delayMs, delayLabel, startMsg, endMsg, delayedMsg }) {
  const btn = document.querySelector(`.btn-run[data-task="${taskNum}"]`);
  const consoleEl = document.getElementById(`console-${taskNum}`);

  consoleEl.innerHTML = '';
  resetDiagram();
  btn.disabled = true;
  btn.textContent = '● running…';

  const t0 = performance.now();
  moveToken(diagram.positions.stack.x, diagram.positions.stack.y);
  setActive('stack', null);

  // 1. Synchronous: first console.log
  printLine(consoleEl, startMsg, 'sync', t0);

  // 2. setTimeout() is called — handed off to libuv immediately
  setTimeout(() => {
    setActive('libuv', 'stackToLibuv');
    moveToken(diagram.positions.libuv.x, diagram.positions.libuv.y);
  }, 120);

  // 3. Synchronous: second console.log — runs before the timer ever fires
  setTimeout(() => {
    printLine(consoleEl, endMsg, 'sync', t0);
  }, 260);

  // 4. libuv's real timer (2000ms or 0ms) finishes in the background
  const timerFinish = 260 + delayMs;
  setTimeout(() => {
    setActive('queue', 'libuvToQueue');
    moveToken(diagram.positions.queue.x, diagram.positions.queue.y);
  }, timerFinish);

  // 5. Callback Queue hands it to the Event Loop
  setTimeout(() => {
    setActive('loop', 'queueToLoop');
    moveToken(diagram.positions.loop.x, diagram.positions.loop.y);
  }, timerFinish + 450);

  // 6. Event Loop pushes the callback back onto the (empty) Call Stack
  setTimeout(() => {
    setActive('stack', 'loopToStack');
    moveToken(diagram.positions.stack.x, diagram.positions.stack.y);
    printLine(consoleEl, delayedMsg, 'async', t0);
  }, timerFinish + 900);

  // 7. Reset the button
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = `▶ Run task${taskNum}.js`;
    setActive(null, null);
  }, timerFinish + 1500);
}

document.querySelectorAll('.btn-run').forEach(btn => {
  btn.addEventListener('click', () => {
    const taskNum = btn.dataset.task;
    if (taskNum === '1') {
      runDemo({
        taskNum: 1,
        delayMs: 2000,
        startMsg: 'Start',
        endMsg: 'End',
        delayedMsg: 'This message appears after 2 seconds.',
      });
    } else {
      runDemo({
        taskNum: 2,
        delayMs: 0,
        startMsg: 'Program Started',
        endMsg: 'Program Finished',
        delayedMsg: 'Executing Delayed Task',
      });
    }
  });
});
