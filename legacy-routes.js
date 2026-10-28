// Preserve bookmarks from the former hash-tab site.
(() => {
  const routes={home:'/',about:'/about/',certifications:'/certification-pathways/',courses:'/certificate-courses/',quiz:'/live-quiz/',practice:'/practice-exams/',resources:'/resources/'};
  if (location.pathname==='/' || location.pathname==='/index.html') {
    const next=routes[location.hash.slice(1)];
    if(next && next!=='/') location.replace(next);
  }
  const categories={asp:'safety',csp:'safety',cfps:'safety',cih:'industrial-hygiene',qep:'environmental',epi:'environmental'};
  if(location.pathname==='/certification-pathways/' && categories[location.hash.slice(1)]) location.replace('/certification-pathways/'+categories[location.hash.slice(1)]+'/'+location.hash);
  // Expand a specific credential when linked from the finder or another page.
  const reveal=()=> {const el=document.getElementById(location.hash.slice(1)); if(el?.tagName==='DETAILS') el.open=true;};
  reveal(); window.addEventListener('hashchange',reveal);
})();
