'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : '#source-records'; } catch { return '#source-records'; } };
  const sourceLink = (url, title = '查看原文') => `<a href="${esc(safeURL(url))}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>`;
  const pressed = (selector, active, key) => $$(selector).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[key] === String(active))));
  const menu = $('.menu-toggle'), nav = $('#chapter-nav');
  function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','打开章节目录'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open',open); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'关闭章节目录':'打开章节目录'); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {closeMenu(); menu.focus();} });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
  const chapters = $$('[data-chapter]');
  let framePending = false;
  function updateReading() {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('.reading-progress i').style.transform = `scaleX(${max > 0 ? Math.min(1,scrollY/max) : 0})`;
    document.body.classList.toggle('has-scrolled',scrollY > 100);
    const current = [...chapters].reverse().find(x => x.getBoundingClientRect().top < innerHeight * .4) || chapters[0];
    $$('#chapter-nav a').forEach(a => {const active = a.hash === '#'+current.id; a.classList.toggle('active',active); if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');});
    framePending=false;
  }
  const requestReading = () => { if (!framePending) {framePending=true;requestAnimationFrame(updateReading);} };
  addEventListener('scroll',requestReading,{passive:true});addEventListener('resize',requestReading);updateReading();
  const nightScenes = [{day:'周三 · 22:00',angle:300},{day:'周五 · 02:30',angle:75},{day:'周六 · 08:00',angle:240},{day:'周日 · 深夜',angle:345},{day:'周一 · 08:00',angle:240}];
  function selectNight(index) { const scene=nightScenes[index]; $$('.night-line').forEach((n,i)=>n.classList.toggle('is-active',i===index)); $('.clock-day').textContent=scene.day; $('.clock-hand').style.setProperty('--clock-angle',`${scene.angle}deg`); }
  selectNight(0);
  if ('IntersectionObserver' in window) { const nightObserver = new IntersectionObserver(entries=> { for(const e of entries) if(e.isIntersecting) selectNight(Number(e.target.dataset.night)); },{rootMargin:'-32% 0px -40% 0px',threshold:0}); $$('.night-line').forEach(n=>nightObserver.observe(n)); }
  $$('[data-year]').forEach(b => b.addEventListener('click',()=> {pressed('[data-year]',b.dataset.year,'year'); $$('.program').forEach(p=> {p.hidden=b.dataset.year!=='all'&&!p.dataset.years.includes(b.dataset.year);});}));
  const people = [
    {name:'沈若宁',role:'北大外院乌尔都语 · FLIC项目',hours:14,phases:[
      {label:'周一至周四',title:'白天，守住第一张课表',text:'背诵乌尔都语字母、研读南亚文学史，跨过专业成绩前50%的报名门槛后，继续应对主修的学业要求。',quote:'外语人现在特别焦虑，如果不修FLIC，毕业简历上除了专四专八几乎啥也没有。'},
      {label:'周五至周六',title:'从傍晚到全天，切换到采编现场',text:'完成《中国文化走出去实践课》要求的5个采编视频作品：扛着三脚架满校园找留学生采访，回来自己写英文脚本、配音、剪辑。',quote:'好几个周五晚上为了赶周六早上的作业截止时间，在宿舍导出4K成片到凌晨两点半，笔记本风扇转得像拖拉机，吵得室友直翻身，心里特别愧疚。'}]},
    {name:'叶书桓',role:'北师大传播学＋人工智能双学士',hours:20,phases:[
      {label:'周二 · 08:00',title:'上午，在传播学的语境里',text:'在文科楼听传播学老师讲拉扎斯菲尔德和媒介环境学，沉浸在阅读量与论文思辨里。',quote:'刚进入文科的哲学语境，脑子还没转过来。'},
      {label:'周二 · 13:30',title:'下午至晚间，走进另一套逻辑',text:'冲去机房对着高等数学、线性代数和Python数据结构发呆，屏幕上一整片红色报错。',quote:'学校等于用502胶水把两张课表硬焊死在一起。我们班有好几个高考偏文科的同学，大一上学期就被微积分和Python虐哭了好几次。'}]},
    {name:'陈思琪',role:'人大新闻学 · 跨向互联网数据分析',hours:18,phases:[
      {label:'周一至周五',title:'白天主修，晚间自学',text:'应付新闻主修课，推掉已经联系好的央媒日常实习，每天晚上在明德楼图书馆坐到闭馆。',quote:'带教老师问我怎么不来了，我只能撒谎说家里有事，其实心里虚得要命。'},
      {label:'周末至深夜',title:'到经院、统计学院，补课',text:'去经院和统计学院蹭计量经济学，在图书馆刷LeetCode SQL窗口函数与A/B测试归因题。',quote:'高数期中只考了38分，最后挂科重修，那阵子焦虑到枕头上全是头发。'}]}
  ];
  let personIndex=0,phaseIndex=0;
  function renderPhase(){ const phase=people[personIndex].phases[phaseIndex]; pressed('[data-phase]',phaseIndex,'phase'); $('#schedule-content').innerHTML=`<h4>${esc(phase.title)}</h4><p>${esc(phase.text)}</p><blockquote>“${esc(phase.quote)}”</blockquote>`; }
  function renderPerson(){ const p=people[personIndex]; pressed('[data-person]',personIndex,'person'); $('#person-name').textContent=p.name; $('#person-role').textContent=p.role; $('#person-hours').textContent=p.hours; $('#day-tabs').innerHTML=p.phases.map((x,i)=>`<button data-phase="${i}" aria-pressed="${i===phaseIndex}">${esc(x.label)}</button>`).join(''); $$('[data-phase]').forEach(b=>b.addEventListener('click',()=>{phaseIndex=Number(b.dataset.phase);renderPhase();}));renderPhase(); }
  $$('[data-person]').forEach(b=>b.addEventListener('click',()=>{personIndex=Number(b.dataset.person);phaseIndex=0;renderPerson();}));renderPerson();
  let story;
  const employerColumns=[{name:'中央媒体',n:15,key:'中央媒体(n=15)',color:'var(--blue)'},{name:'市场化媒体',n:18,key:'市场化媒体(n=18)',color:'var(--gold)'},{name:'互联网大厂',n:20,key:'互联网大厂(n=20)',color:'var(--salmon)'}];
  const internetColumns=[{name:'内容岗位',n:10,key:'互联网·内容岗(n=10)',color:'var(--blue)'},{name:'数据分析岗位',n:10,key:'互联网·数据分析岗(n=10)',color:'var(--salmon)'}];
  const keySkills=['新闻采编与判断','视频与视听制作','外语','财经与商业知识','数据分析与指标','AI工具与大模型'];
  let skillMode='employers';
  function skillDetails(d,c){ $('#skill-detail').textContent=`${c.name}的${c.n}条招聘启事中，${d[c.key]}条提到“${d['技能类别']}”，占比${(Number(d[c.key])/c.n*100).toFixed(1).replace('.0','')}%。`; }
  function renderSkills(){
    const columns=skillMode==='employers'?employerColumns:internetColumns;
    const rows=$('#all-skills').checked?story.skills:story.skills.filter(d=>keySkills.includes(d['技能类别']));
    const root=d3.select('#skills-chart'); root.selectAll('p').remove();
    root.selectAll('.skill-heading').data([columns]).join('div').attr('class','skill-heading').style('--columns',columns.length).html('<span>技能</span>'+columns.map(c=>`<div><b>${c.name}</b><small>${c.n}条岗位</small></div>`).join(''));
    const row=root.selectAll('.skill-row').data(rows,d=>d['技能类别']).join(enter=>{const r=enter.append('div').attr('class','skill-row');r.append('strong');return r;}).style('--columns',columns.length);
    row.select('strong').text(d=>d['技能类别']);
    row.each(function(d){const cells=d3.select(this).selectAll('.skill-cell').data(columns,c=>c.key).join(enter=>{const b=enter.append('button').attr('class','skill-cell').attr('type','button');b.append('span').attr('class','skill-value');b.append('span').attr('class','skill-track').append('i').attr('class','skill-bar').style('width','0%');return b;}).style('--skill-color',c=>c.color).attr('aria-label',c=>`${d['技能类别']}，${c.name}：${d[c.key]}/${c.n}条，${Math.round(Number(d[c.key])/c.n*100)}%`).on('click',(_,c)=>skillDetails(d,c)).on('focus',(_,c)=>skillDetails(d,c));
      cells.select('.skill-value').text(c=>`${Math.round(Number(d[c.key])/c.n*100)}%`);
      const bars=cells.select('.skill-bar').interrupt();
      if(reducedMotion.matches) bars.style('width',c=>`${Number(d[c.key])/c.n*100}%`); else bars.transition().duration(650).ease(d3.easeCubicOut).style('width',c=>`${Number(d[c.key])/c.n*100}%`);
    });
  }
  function renderJobs(){ const group=$('#job-group').value, query=$('#job-search').value.trim().toLocaleLowerCase(); const jobs=story.jobs.filter(j=>(group==='all'||j.group===group)&&[j.employer,j.title,j.majors_text,j.requirements,j.responsibilities,j.preferred].join(' ').toLocaleLowerCase().includes(query)); $('#job-count').textContent=`共 ${jobs.length} 条岗位`; $('#job-list').innerHTML=jobs.length?jobs.map(j=>`<details class="job-record"><summary><span><small>${esc(j.employer)}</small><strong>${esc(j.title)}</strong></span><span class="expand-icon" aria-hidden="true"></span></summary><div class="job-body"><p class="record-meta">${esc([j.group,j.recruit_type,j.grad_year&&j.grad_year+'届',j.publish_date&&'发布于 '+j.publish_date].filter(Boolean).join(' · '))}</p>${[['专业要求',j.majors_text],['岗位职责',j.responsibilities],['任职要求',j.requirements],['优先条件',j.preferred]].filter(([,v])=>v).map(([k,v])=>`<h4>${k}</h4><p>${esc(v).replace(/\n/g,'<br>')}</p>`).join('')}${sourceLink(j.url,'打开招聘原文')}</div></details>`).join(''):'<p class="empty-state">没有符合条件的岗位。试试其他关键词，或选择全部雇主。</p>'; }
  const categoryNames={'史论':['中国新闻传播史','新闻理论','外国新闻传播史'],'采写编':['新闻采访','新闻写作','全媒体新闻编辑'],'数字':['数据新闻报道概论','数字新闻学原理']};
  function renderCategory(category){pressed('[data-course-category]',category,'courseCategory');const rows=story.courses.filter(c=>c.program_id==='cuc-news-2025'&&categoryNames[category].includes(c.name)); const names={'史论':'新闻史论','采写编':'新闻采写编','数字':'数据与数字新闻'}; $('#course-detail').innerHTML=`<h4>${names[category]} · ${rows.reduce((a,c)=>a+c.credits,0)}学分</h4><p>${rows.map(c=>`${esc(c.name)} · ${c.credits}学分 / ${c.hours}学时`).join('<br>')}</p>`;}
  function renderCourses(){const program=$('#course-program').value;const rows=story.courses.filter(c=>program==='all'||c.program_id===program);$('#course-list').innerHTML=rows.map(c=>`<div class="course-item"><div><strong>${esc(c.name)}</strong><small>${c.program_id.startsWith('pku')?'北大 FLIC':'中传新闻学辅修'} · ${esc(c.category)}${c.semester?' · '+esc(c.semester):''}</small></div><span>${c.credits}学分<small>${c.hours?c.hours+'学时':c.weekly_hours?c.weekly_hours+'周学时':''}</small></span></div>`).join('');}
  const costNumbers=[['5,200','元','40学分 × 130元 / 学分'],['28 / 30','学分','分项合计 / 简章正文要求'],['不另收学费','','食宿、交通费用由学生自理']];
  const costSources=['cuc-minor25','pku-flic25','pku-finance25'];
  function renderCost(index){pressed('[data-cost]',index,'cost'); const row=story.costs[index],big=costNumbers[index],source=story.sources.find(s=>s.id===costSources[index]); $('#cost-receipt').innerHTML=`<h4>${esc(row[0])}</h4><p class="receipt-total">${big[0]} <small>${big[1]}</small></p><p class="receipt-caption">${big[2]}</p><dl>${['学分与模块','学费','时间与地点','修读条件'].map((k,i)=>`<div class="receipt-row"><dt>${k}</dt><dd>${esc(row[i+1])}</dd></div>`).join('')}</dl>${sourceLink(source.url,'查阅项目简章')}`; }
  function renderSources(){const query=$('#source-search').value.trim().toLocaleLowerCase();const rows=story.sources.filter(s=>[s.school,s.title,s.summary].join(' ').toLocaleLowerCase().includes(query));$('#source-list').innerHTML=rows.length?rows.map(s=>`<article class="source-record"><p class="record-meta">${esc(s.school)} · ${esc(s.date)}</p><h4>${sourceLink(s.url,s.title)}</h4><p>${esc(s.summary)}</p></article>`).join(''):'<p class="empty-state">没有找到这份资料。试试学校全称或“招生简章”。</p>';}
  async function loadStory(){
    try {
      const response=await fetch('story-data.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);story=await response.json();if(!window.d3)throw new Error('Chart library unavailable');
      renderSkills();renderJobs();renderCourses();renderCategory('数字');renderCost(0);renderSources();
      $$('[data-skill-mode]').forEach(b=>b.addEventListener('click',()=>{skillMode=b.dataset.skillMode;pressed('[data-skill-mode]',skillMode,'skillMode');renderSkills();$('#skill-detail').textContent=skillMode==='internet'?'内容与数据分析岗位各10条；点击技能格查看条数。':'三类雇主共53条岗位；点击技能格查看条数。';}));
      $('#all-skills').addEventListener('change',renderSkills);$('#job-group').addEventListener('change',renderJobs);$('#job-search').addEventListener('input',renderJobs);$('#course-program').addEventListener('change',renderCourses);$('#source-search').addEventListener('input',renderSources);
      $$('[data-course-category]').forEach(b=>b.addEventListener('click',()=>renderCategory(b.dataset.courseCategory)));$$('[data-cost]').forEach(b=>b.addEventListener('click',()=>renderCost(Number(b.dataset.cost))));
      $('.load-error')?.remove();requestReading();
    } catch(error) {
      if(!$('.load-error')) {const panel=document.createElement('div');panel.className='load-error';panel.setAttribute('role','alert');panel.innerHTML='<p>交互数据加载失败，请重新加载。</p><button type="button">重新加载数据</button>';$('#skills-chart').after(panel);panel.querySelector('button').addEventListener('click',async e=>{e.target.disabled=true;await loadStory();e.target.disabled=false;});}
      console.error('交互数据加载失败',error);
    }
  }
  loadStory();
})();
