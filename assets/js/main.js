'use strict';
const isArabic = document.documentElement.lang === 'ar';
const localize = (en, ar) => isArabic ? ar : en;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded', String(open)); navLinks.classList.toggle('open', open); });
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); if (!searchPanel.hidden) closeSearch(true); } });
const track = document.querySelector('.service-cards');
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => { const direction = Number(button.dataset.direction); if (track.scrollWidth > track.clientWidth) { track.scrollBy({left: direction * (isArabic ? -1 : 1) * (track.firstElementChild.offsetWidth + 20), behavior: 'smooth'}); } else { const cards = [...track.children]; if (direction > 0) track.append(cards[0]); else track.prepend(cards[cards.length - 1]); } }));
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
searchToggle.addEventListener('click', () => { searchPanel.hidden = !searchPanel.hidden; searchToggle.setAttribute('aria-expanded', String(!searchPanel.hidden)); if (!searchPanel.hidden) { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); if (languageMenu) languageMenu.open = false; document.querySelector('.search-status').textContent = ''; document.querySelector('#site-search').focus(); } });
function normalizeSearch(value) {
  return value.normalize('NFKC').toLowerCase()
    .replace(/[\u0610-\u061a\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ').trim();
}
searchPanel.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#site-search');
  const status = document.querySelector('.search-status');
  const query = normalizeSearch(input.value);
  if (!query) {
    status.textContent = localize('Enter a keyword to search.', 'أدخل كلمة للبحث.');
    input.focus();
    return;
  }
  document.querySelectorAll('.search-hit').forEach(node => node.classList.remove('search-hit'));
  const match = [...document.querySelectorAll('main h2, main h3, main p')]
    .find(node => normalizeSearch(node.innerText).includes(query));
  status.textContent = match
    ? localize('Matching section found.', 'تم العثور على القسم المطلوب.')
    : localize('No matching section found.', 'لم يتم العثور على نتائج مطابقة.');
  if (match) {
    closeSearch();
    match.classList.add('search-hit');
    match.setAttribute('tabindex', '-1');
    match.focus({preventScroll: true});
    match.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
  }
});
const contactForm = document.querySelector('.contact-form');
function prepareEnquiryEmail(data) {
  const recipient = contactForm.dataset.recipient;
  const subject = encodeURIComponent(String(data.get('subject') || '').trim());
  const body = encodeURIComponent(
    localize('Name: ', 'الاسم: ') + String(data.get('name') || '').trim() +
    localize('\nEmail: ', '\nالبريد الإلكتروني: ') + String(data.get('email') || '').trim() +
    localize('\nPhone: ', '\nالهاتف: ') + String(data.get('phone') || '').trim() +
    '\n\n' + String(data.get('message') || '').trim()
  );
  return 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
}
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (contactForm.dataset.sending === 'true' || !contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const fallback = contactForm.querySelector('.form-email-fallback');
  const status = contactForm.querySelector('.form-status');
  const button = contactForm.querySelector('[type=submit]');
  const label = button.textContent;
  contactForm.dataset.sending = 'true';
  contactForm.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = localize('Sending…', 'جارٍ الإرسال…');
  fallback.hidden = true;
  status.textContent = localize('Sending your enquiry…', 'جارٍ إرسال استفسارك…');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST', body: data, headers: {Accept: 'application/json'}, signal: controller.signal
    });
    if (!response.ok) throw new Error('Enquiry delivery failed');
    status.textContent = localize('Your enquiry has been sent successfully. Thank you for contacting us.', 'تم إرسال استفسارك بنجاح. شكرًا لتواصلك معنا.');
    contactForm.reset();
  } catch {
    status.textContent = localize('We could not confirm delivery. Your details are still here. Try again, or use the email link below.', 'تعذّر تأكيد الإرسال. احتفظنا بالبيانات التي أدخلتها؛ حاول مجددًا أو استخدم رابط البريد أدناه.');
    fallback.href = prepareEnquiryEmail(data);
    fallback.hidden = false;
  } finally {
    clearTimeout(timeout);
    delete contactForm.dataset.sending;
    contactForm.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = label;
  }
});
const policyDialog = document.querySelector('.policy-dialog');
document.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click', () => { const privacy = button.dataset.policy === 'privacy'; policyDialog.querySelector('h2').textContent = privacy ? localize('Privacy Policy', 'سياسة الخصوصية') : localize('Terms & Conditions', 'الشروط والأحكام'); policyDialog.querySelector('p').textContent = privacy ? localize('The privacy policy will be published here once approved by the firm. For questions, contact ahmadshaw93@gmail.com.', 'ستُنشر سياسة الخصوصية هنا بعد اعتمادها من المكتب. للاستفسار، تواصل عبر ahmadshaw93@gmail.com.') : localize('The firm’s terms and conditions will be published here once approved. Please contact the office for information about legal services.', 'ستُنشر شروط وأحكام المكتب هنا بعد اعتمادها. يرجى التواصل مع المكتب للاستفسار عن الخدمات القانونية.'); policyDialog.showModal(); }));
document.querySelector('.dialog-close').addEventListener('click', () => policyDialog.close());

const languageMenu = document.querySelector('.language-menu');
document.querySelectorAll('[data-language-link]').forEach(link => link.addEventListener('click', () => { link.hash = window.location.hash; }));
document.addEventListener('click', event => { if (languageMenu && !languageMenu.contains(event.target)) languageMenu.open = false; });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && languageMenu && languageMenu.open) { languageMenu.open = false; languageMenu.querySelector('summary').focus(); } });

function closeSearch(returnFocus=false){searchPanel.hidden=true;searchToggle.setAttribute('aria-expanded','false');if(returnFocus)searchToggle.focus();}
document.querySelector('.search-close').addEventListener('click',()=>closeSearch(true));
document.querySelectorAll('.search-shortcuts a').forEach(link=>link.addEventListener('click',()=>closeSearch()));
document.addEventListener('click',event=>{if(!searchPanel.hidden&&!searchPanel.contains(event.target)&&!searchToggle.contains(event.target))closeSearch();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&searchPanel.contains(document.activeElement))closeSearch(true);});
