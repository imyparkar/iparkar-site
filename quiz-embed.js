(() => {
  const button = document.getElementById('load-live-quiz');
  const area = document.getElementById('live-quiz-area');
  if (!button || !area) return;
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Live HSE quiz';
    frame.src = 'https://quiz.iparkar.com/';
    frame.loading = 'lazy';
    area.replaceChildren(frame);
    area.hidden = false;
    button.disabled = true;
    button.textContent = 'Quiz player opened below';
    area.scrollIntoView({block:'start'});
  }, {once:true});
})();
