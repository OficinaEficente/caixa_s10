'use strict';
const modal = document.querySelector('#enrollment');
let opener;
document.querySelectorAll('[data-enroll]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    modal.showModal();
    document.body.classList.add('modal-open');
  });
});
modal.querySelectorAll('.modal-close, [data-close]').forEach(button => button.addEventListener('click', () => modal.close()));
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const r = modal.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close();
});
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  opener?.focus();
});
