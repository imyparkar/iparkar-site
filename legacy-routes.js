// Preserve bookmarks from the former hash-tab site.
(() => {
  const routes={home:'/',about:'/about/',certifications:'/certification-pathways/',courses:'/certificate-courses/',quiz:'/live-quiz/',practice:'/practice-exams/',resources:'/resources/'};
  if (location.pathname==='/' || location.pathname==='/index.html') {
    const next=routes[location.hash.slice(1)];
    if(next && next!=='/') location.replace(next);
  }
  const categories={asp:'safety/asp',csp:'safety/csp',cfps:'safety/cfps',cih:'industrial-hygiene/cih',qep:'environmental/qep',epi:'environmental/epi'};
  if(location.pathname==='/certification-pathways/' && categories[location.hash.slice(1)]) location.replace('/certification-pathways/'+categories[location.hash.slice(1)]+'/'+location.hash);
  const courseGroups={'nebosh-igc':'nebosh','nebosh-diploma':'nebosh','nebosh-env-diploma':'nebosh','iosh-diploma':'iosh','iosh-certificate':'iosh'};
  if(location.pathname==='/certificate-courses/' && courseGroups[location.hash.slice(1)]) location.replace('/certificate-courses/'+courseGroups[location.hash.slice(1)]+'/'+location.hash);
  // Expand a specific credential when linked from the finder or another page.
  const reveal=()=> {const el=document.getElementById(location.hash.slice(1)); if(el?.tagName==='DETAILS') el.open=true;};
  reveal(); window.addEventListener('hashchange',reveal);
})();
