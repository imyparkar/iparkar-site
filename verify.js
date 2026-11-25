// Certificate verification: reads ?id= (the QR code on each certificate links here), asks the iParkar LMS
// whether the certificate was issued, and shows only what is printed on it.
(function () {
  var API = 'https://app.iparkar.com/api/certificates/verify/';
  var PATTERN = /^IPL-[A-Z]{2,8}-[0-9A-Z]{4}-[0-9A-Z]{4}$/;
  var form = document.querySelector('[data-verify-form]');
  var out = document.querySelector('[data-verify-result]');
  if (!form || !out) return;
  var input = form.querySelector('input');

  function tidy(raw) {
    var s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (s.indexOf('IPL') === 0 && s.length >= 13) {
      var mid = s.slice(3, s.length - 8);
      return 'IPL-' + mid + '-' + s.slice(-8, -4) + '-' + s.slice(-4);
    }
    return String(raw || '').trim().toUpperCase();
  }
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : String(t); return d.innerHTML; }
  function date(iso) {
    if (!iso) return '';
    var p = iso.split('-'); var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function hours(h) { var n = Number(h); return (n % 1 ? n.toFixed(1) : String(n)) + ' hours'; }
  function show(kind, html) { out.className = 'verify__result verify__result--' + kind; out.innerHTML = html; }

  function render(code, d) {
    if (!d || !d.found) {
      show('none', '<span class="ip-pill ip-pill--alert">Not found</span><h3>No certificate with this number</h3><p>We have no record of certificate <strong>' + esc(code) + '</strong>. Check the number and try again; if it still isn’t found, the certificate was not issued by iParkar Learning.</p>');
      return;
    }
    var rows = [['Name', d.name], ['Course', d.course_title], ['Designed study', hours(d.hours)], ['Date of issue', date(d.issued_on)], ['Certificate number', d.certificate_code], ['Issued by', d.issuer]];
    var table = '<dl class="verify__details">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
    if (d.valid) show('valid', '<span class="ip-pill ip-pill--done">Valid</span><h3>This certificate is genuine</h3><p>iParkar Learning issued this certificate. Check that the details below match the certificate in front of you.</p>' + table);
    else show('invalid', '<span class="ip-pill ip-pill--alert">No longer valid</span><h3>This certificate has been withdrawn</h3><p>iParkar Learning issued this certificate, but it is no longer valid. Contact <a href="mailto:support@iparkar.com">support@iparkar.com</a> if you need more information.</p>' + table);
  }

  function check(raw, push) {
    var code = tidy(raw);
    input.value = code;
    if (!PATTERN.test(code)) {
      show('none', '<p>Enter a certificate number in the form <strong>IPL-XXXX-XXXX-XXXX</strong>, as printed on the certificate.</p>');
      input.focus();
      return;
    }
    if (push) history.replaceState(null, '', '?id=' + encodeURIComponent(code));
    show('loading', '<p>Checking certificate ' + esc(code) + '…</p>');
    fetch(API + encodeURIComponent(code), { headers: { accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (d) { render(code, d); })
      .catch(function () { show('none', '<p>We couldn’t reach the verification service just now. Please try again in a minute, or email <a href="mailto:support@iparkar.com">support@iparkar.com</a> with the certificate number.</p>'); });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); check(input.value, true); });
  var id = new URLSearchParams(location.search).get('id');
  if (id) check(id, false);
})();
