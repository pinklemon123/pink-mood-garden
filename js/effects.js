export function enableClickHearts({ emoji = '❤' } = {}) {
  const duration = 1200;
  document.addEventListener('click', (e) => {
    const span = document.createElement('span');
    span.className = emoji === '❤' ? 'heart' : 'petal';
    span.textContent = emoji;
    span.style.left = `${e.clientX}px`;
    span.style.top = `${e.clientY}px`;
    span.style.fontSize = `${Math.random() * 10 + 16}px`;
    span.style.opacity = '1';
    span.style.transform = 'translateY(0)';
    span.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    document.body.appendChild(span);
    requestAnimationFrame(() => {
      span.style.transform = 'translateY(-80px)';
      span.style.opacity = '0';
    });
    setTimeout(() => span.remove(), duration);
  });
}