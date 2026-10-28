/* Guidance, never an eligibility decision. Rules and sources reviewed 28 Oct 2026.
   Export the same pure function for the browser and the local checks. */
(function (root) {
  'use strict';
  const catalog={
    asp:{name:'Associate Safety Professional (ASP)',area:'safety',url:'https://www.bcsp.org/associate-safety-professional-asp'},
    csp:{name:'Certified Safety Professional (CSP)',area:'safety',url:'https://www.bcsp.org/certified-safety-professional-csp'},
    cih:{name:'Certified Industrial Hygienist (CIH)',area:'hygiene',url:'https://gobgc.org/cih/'},
    cfps:{name:'Certified Fire Protection Specialist (CFPS)',area:'fire',url:'https://www.nfpa.org/en/for-professionals/certification/cfps'},
    qep:{name:'Qualified Environmental Professional (QEP)',area:'environment',url:'https://gobgc.org/qep/'},
    epi:{name:'Environmental Professional In-training (EPI)',area:'environment',url:'https://gobgc.org/applicants_epi_eligibility/'},
  };
  function recommend(a) {
    const degree=['bachelor','postgraduate'].includes(a.education);
    const stem=degree && a.field==='stem';
    const sheAssociate=a.education==='diploma' && a.field==='she';
    const safety=Number(a.safety), hygiene=Number(a.hygiene), fire=Number(a.fire), environment=Number(a.environment);
    const professional=a.preventive==='yes';
    const results=[];
    const add=(id,fit,why,gaps)=>results.push({id,...catalog[id],fit,why,gaps});
    add('asp',(degree||sheAssociate)&&safety>=1&&professional,
      'A safety credential to explore as you build towards advanced professional practice.',
      [!degree&&!sheAssociate?'BCSP requires a bachelor’s degree or a qualifying safety, health or environmental associate degree. A diploma is not automatically equivalent.':null,
      sheAssociate?'Have BCSP confirm associate-degree equivalence and the required SH&E course credits.':null,
      safety<1?'Build at least one year of qualifying professional safety experience.':null,
      !professional?'Confirm that at least 50% of your role meets BCSP’s preventive, professional-level safety duties requirement.':null,
      'BCSP must review your degree, duties and application; passing the ASP examination is also required.'].filter(Boolean));
    add('csp',degree&&safety>=4&&professional&&a.qualifying==='yes',
      'An advanced safety credential for practitioners with qualifying education, experience and an accepted prior credential.',
      [!degree?'A bachelor’s degree is required; a diploma or professional credential alone does not replace it.':null,
      safety<4?'Build at least four years of qualifying professional safety experience.':null,
      !professional?'Confirm that at least 50% of your role meets the preventive, professional-level safety duties requirement.':null,
      a.qualifying!=='yes'?'Obtain or verify a current credential on BCSP’s qualifying list, such as ASP. Check the exact award and version.':null,
      'BCSP confirms degree equivalence, credential acceptance and eligibility; the CSP examination is required.'].filter(Boolean));
    add('cih',degree&&hygiene>=4,
      'A specialist route for professional industrial hygiene practice, rather than general safety experience alone.',
      [!degree?'Review the bachelor’s or higher degree requirement with BGC.':null,
      hygiene<4?'The standard route requires four years of professional industrial hygiene practice. Limited degree credits may apply; ask BGC.':null,
      'BGC must check your science, maths and engineering credits, IH coursework, ethics training, active practice and professional references.',
      'A science or engineering degree alone does not establish CIH eligibility. Review the handbook and examination requirements.'].filter(Boolean));
    add('cfps',false,
      fire>0?'Your fire-loss prevention experience makes CFPS worth exploring.':'Consider CFPS if your role will focus on reducing fire loss.',
      ['NFPA offers education-and-experience routes. Your degree subject and verifiable fire-loss work must match a route in the current CFPS Candidate Handbook.',
      fire===0?'Build relevant fire-loss prevention experience before pursuing this credential.':'Ask NFPA to confirm how your education and fire-loss experience fit its requirements.',
      'This finder does not determine the CFPS route from general HSE experience. Review the current exam and application requirements.']);
    const qepYears=stem?5:8;
    add('qep',degree&&environment>=qepYears,
      'An environmental credential for practitioners with broad professional environmental experience.',
      [!degree?'A qualifying bachelor’s degree or equivalent is required.':null,
      environment<qepYears?`The standard route needs ${qepYears} years of environmental experience for the degree category you selected.`:null,
      !stem&&degree?'BGC may accept five years for specified science, engineering or mathematics degrees; otherwise the any-discipline route requires eight years. Confirm how your degree is classified.':null,
      'BGC must confirm your degree, experience and references. GES and QEP examinations normally apply; EPI holders do not retake GES.',
      'An eligible EHAC-accredited environmental master’s can provide one year of experience credit; this finder does not apply that adjustment.'].filter(Boolean));
    const epiStudy=['stem'].includes(a.field) && (degree||a.education==='student');
    add('epi',epiStudy&&environment<5,
      'An interim designation for eligible final-year students and early-career environmental professionals progressing towards QEP.',
      [!epiStudy?'BGC must confirm an eligible science, engineering or mathematics degree, or final-year enrolment.':null,
      environment>=5?'EPI is for people with less than five years of professional environmental experience; review QEP instead.':null,
      'Professional or academic references and the GES examination are required. EPI is a designation, not a certification.'].filter(Boolean));
    const chosen=catalog[a.target];
    let area=chosen?.area || (['safety','hygiene','fire','environment'].includes(a.target)?a.target:null);
    // No career interest was supplied: show fields supported by actual experience.
    const areas=area?[area]:['safety','hygiene','fire','environment'].filter((x,i)=>[safety,hygiene,fire,environment][i]>0);
    let matches=results.filter(x=>areas.includes(x.area));
    matches.sort((x,y)=>Number(y.fit)-Number(x.fit));
    if(chosen) matches=[results.find(x=>x.id===a.target),...matches.filter(x=>x.id!==a.target)];
    if(a.target==='courses') matches=[];
    const courses=[];
    const foundation=a.foundation!=='yes';
    if(foundation||!matches.some(x=>x.fit)||a.target==='courses') {
      courses.push({id:'nebosh-igc',name:'NEBOSH International General Certificate',why:'A foundation for practical HSE knowledge, with no formal entry requirements. Study through an accredited Learning Partner.'});
      courses.push({id:'iosh-certificate',name:'IOSH Level 3 Certificate',why:'Explore a structured foundation in occupational safety and health. Confirm course suitability and assessment requirements with an approved study centre.'});
    }
    if(!foundation&&(safety>0||a.target==='courses')) {
      courses.push({id:'nebosh-diploma',name:'NEBOSH Level 6 International Diploma',why:'Build deeper occupational health and safety knowledge after foundation study. Review the workload and language expectations with a Learning Partner.'});
      courses.push({id:'iosh-diploma',name:'IOSH Level 6 Diploma',why:'Consider advanced OSH management study if you have foundation knowledge or relevant experience. Check IOSH membership and language requirements.'});
    }
    return {matches,courses,needsInterest:!area&&areas.length===0&&a.target!=='courses'};
  }
  if(typeof module!=='undefined'&&module.exports) module.exports={recommend};
  root.iParkarRecommend=recommend;
  if(typeof document==='undefined') return;
  const form=document.getElementById('pathway-form'), out=document.getElementById('finder-results');
  if(!form) return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity()) return;
    const a=Object.fromEntries(new FormData(form));
    const {matches,courses,needsInterest}=recommend(a);
    out.innerHTML=`<h2>Your suggested pathways</h2><p>Based on your answers, these are options to investigate. This is preliminary guidance, not an eligibility approval. The awarding body makes the final decision.</p>${needsInterest?'<p class="notice ip-card ip-card--tint">Start with foundation study, or select a field of interest above to explore a specialist route.</p>':''}<div class="result-grid">${matches.map(x=>`<article class="ip-card"><span class="ip-pill ${x.fit?'ip-pill--progress':'ip-pill--todo'}">${x.fit?'Potential fit — verify requirements':'Review requirements / build towards'}</span><h3>${esc(x.name)}</h3><p>${esc(x.why)}</p><h4>What to check next</h4><ul>${x.gaps.map(g=>`<li>${esc(g)}</li>`).join('')}</ul><div class="ip-btn-row"><a class="ip-btn ip-btn--text" href="#${x.id}">Read pathway →</a><a class="ip-btn ip-btn--text" href="${x.url}" target="_blank" rel="noopener">Official requirements →</a></div></article>`).join('')}</div>${courses.length?`<h3>Courses to consider</h3><div class="grid grid--2">${courses.map(x=>`<article class="ip-card ip-card--tint"><h4>${esc(x.name)}</h4><p>${esc(x.why)}</p><a class="ip-btn ip-btn--text" href="/certificate-courses/#${x.id}">View course →</a></article>`).join('')}</div>`:''}<p class="fineprint">Finder guidance reviewed 28 Oct 2026 against BCSP, BGC, NFPA and qualification-provider guidance. Requirements can change. No result guarantees admission, a job, membership or an exam pass.</p>`;
    out.focus(); out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
  form.addEventListener('reset',()=>{out.innerHTML='';});
})(typeof window==='undefined'?globalThis:window);
