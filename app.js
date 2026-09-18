const SKEY='ielts-speaking-trainer-v2';
const levels=['5.0','6.0','7.0'];
const accents=[
 {id:'en-US',flag:'🇺🇸',name:'미국',short:'US'},
 {id:'en-GB',flag:'🇬🇧',name:'영국',short:'UK'},
 {id:'en-CA',flag:'🇨🇦',name:'캐나다',short:'CA'},
 {id:'en-AU',flag:'🇦🇺',name:'호주',short:'AU'}
];
let state=load(), view='home', topicId=null, session=null, path=null, level=state.target, qko=false, ako=false, trainer=null;
const flat=DATA.topics.flatMap(t=>t.questions.map(q=>({...q,topic:t})));
const qmap=new Map(flat.map(q=>[q.id,q]));
const app=document.getElementById('app');
function defaults(){return{target:'6.0',review:{},history:{},accent:'en-US',voiceURI:''}}
function load(){try{return Object.assign(defaults(),JSON.parse(localStorage.getItem(SKEY)||'{}'))}catch{return defaults()}}
function save(){localStorage.setItem(SKEY,JSON.stringify(state))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function day(){return new Date().toISOString().slice(0,10)}
function toast(s){const e=document.createElement('div');e.className='toast';e.textContent=s;document.body.appendChild(e);setTimeout(()=>e.remove(),1400)}
function voices(){return ('speechSynthesis' in window?speechSynthesis.getVoices():[]).filter(v=>/^en([-_]|$)/i.test(v.lang||''))}
function matchingVoices(){const wanted=(state.accent||'en-US').toLowerCase();return voices().filter(v=>(v.lang||'').toLowerCase()===wanted)}
function chosenVoice(){
 const all=voices();
 if(state.voiceURI){const exact=all.find(v=>v.voiceURI===state.voiceURI);if(exact)return exact}
 return matchingVoices()[0]||null
}
function speak(s,rate=.92){
 if(!('speechSynthesis' in window)){toast('이 브라우저는 음성 재생을 지원하지 않아요.');return}
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(s);
 u.lang=state.accent||'en-US';
 u.rate=rate;
 const v=chosenVoice();
 if(v){u.voice=v;u.lang=v.lang||u.lang}
 speechSynthesis.speak(u)
}
function nav(active){return '<nav class="bottom">'+[['home','🏠','홈'],['topics','📚','토픽'],['review','🔁','복습'],['history','📅','기록'],['settings','⚙️','설정']].map(x=>'<button class="nav '+(active===x[0]?'on':'')+'" data-nav="'+x[0]+'"><strong>'+x[1]+'</strong>'+x[2]+'</button>').join('')+'</nav>'}
function shell(body,active='home'){app.innerHTML='<header class="top"><div class="topin"><div class="brand"><b>IELTS Speaking Trainer</b><span>2026 Sep–Dec · Part 1</span></div></div></header><main>'+body+'</main>'+nav(active)}
function home(){
 const today=state.history[day()]||{studied:0,success:0,retry:0};
 shell('<section class="hero"><div class="eyebrow">PART 1 SPEAKING</div><h1>좋은 답변을 반복해서<br>말의 뼈대를 만들어요.</h1><p>질문을 듣고, 나와 가까운 답변 방향을 고른 뒤 읽기·듣기·타이핑으로 익혀보세요.</p><div class="levels">'+levels.map(l=>'<button class="level '+(state.target===l?'on':'')+'" data-target="'+l+'">Target '+l+'</button>').join('')+'</div><div class="stats"><div class="stat"><b>'+today.studied+'</b><span>오늘 학습</span></div><div class="stat"><b>'+today.success+'</b><span>성공</span></div><div class="stat"><b>'+Object.keys(state.review).length+'</b><span>복습 저장</span></div></div></section><div class="grid"><button class="quick" data-today><i>▶️</i><b>오늘 학습</b><span>시즌 문제 중 최대 5문항</span></button><button class="quick" data-nav="topics"><i>📚</i><b>토픽별 학습</b><span>'+DATA.topics.length+'개 토픽 · '+flat.length+'문항</span></button><button class="quick" data-nav="review"><i>🔁</i><b>맞춤 복습</b><span>다시 연습한 답변부터</span></button><button class="quick" data-nav="history"><i>📅</i><b>학습 기록</b><span>최근 학습량 확인</span></button></div>','home')
}
function topics(){
 shell('<div class="secHead"><h2>토픽</h2><span>'+DATA.topics.length+' topics</span></div><div class="list">'+DATA.topics.map(t=>'<button class="row" data-topic="'+t.id+'"><span><b>'+esc(t.topic.en)+'</b><small>'+esc(t.topic.ko)+'</small></span><small>'+t.questions.length+' questions ›</small></button>').join('')+'</div>','topics')
}
function topic(){
 const t=DATA.topics.find(x=>x.id===topicId); if(!t)return topics();
 shell('<div class="pageTitle"><button class="back" data-nav="topics">←</button><div><h1>'+esc(t.topic.en)+'</h1><p>'+esc(t.topic.ko)+' · '+t.questions.length+' questions</p></div></div><div class="list">'+t.questions.map((q,i)=>'<button class="row" data-q="'+q.id+'"><span><b>'+(i+1)+'. '+esc(q.question.en)+'</b><small>'+esc(q.question.ko)+'</small></span><span>›</span></button>').join('')+'</div>','topics')
}
function review(){
 const arr=Object.entries(state.review);
 shell('<div class="secHead"><h2>맞춤 복습</h2><span>'+arr.length+' saved</span></div>'+(arr.length?'<div class="list">'+arr.map(([k,v])=>{const [qid,pid]=k.split('::'),q=qmap.get(qid),p=q?.paths.find(x=>x.id===pid);return q&&p?'<button class="row" data-review="'+k+'"><span><b>'+esc(q.question.en)+'</b><small>'+esc(p.label.ko)+' · '+(v.status==='retry'?'다시 연습':'성공')+'</small></span><span>›</span></button>':''}).join('')+'</div>':'<div class="empty">아직 복습할 답변이 없어요.<br>학습 후 <b>다시 연습</b>을 눌러보세요.</div>'),'review')
}
function history(){
 const days=Object.keys(state.history).sort().reverse().slice(0,14);
 shell('<div class="secHead"><h2>학습 기록</h2><span>최근 14일</span></div>'+(days.length?'<div class="list">'+days.map(d=>{const h=state.history[d];return '<div class="row"><span><b>'+d+'</b><small>학습 '+h.studied+' · 성공 '+h.success+' · 다시 '+h.retry+'</small></span></div>'}).join('')+'</div>':'<div class="empty">아직 학습 기록이 없어요.</div>'),'history')
}
function settings(){
 const mv=matchingVoices();
 const voiceOptions='<option value="">자동 선택</option>'+mv.map(v=>'<option value="'+esc(v.voiceURI)+'" '+(state.voiceURI===v.voiceURI?'selected':'')+'>'+esc(v.name)+' ('+esc(v.lang)+')</option>').join('');
 const voiceStatus=mv.length?mv.length+'개 음성 사용 가능':'이 기기에서 해당 지역 음성을 찾지 못했어요';
 shell(
  '<div class="pageTitle"><div><h1>설정</h1><p>학습 레벨과 영어 발음을 설정해요.</p></div></div>'+
  '<section class="card settingCard"><div class="settingTitle"><b>목표 답변 레벨</b><span>학습할 기본 답변 난이도</span></div><div class="levels">'+levels.map(l=>'<button class="level '+(state.target===l?'on':'')+'" data-target="'+l+'">Target '+l+'</button>').join('')+'</div><p class="settingNote">이 레벨은 학습용 답변 난이도예요. 같은 문장을 말한다고 실제 시험 점수가 보장되는 것은 아니에요.</p></section>'+
  '<section class="card settingCard"><div class="settingTitle"><b>영어 발음</b><span>질문·답변·문장 학습의 TTS에 적용</span></div>'+
   '<div class="accentGrid">'+accents.map(a=>'<button class="accent '+(state.accent===a.id?'on':'')+'" data-accent="'+a.id+'"><strong>'+a.flag+'</strong><b>'+a.name+'</b><small>'+a.short+'</small></button>').join('')+'</div>'+
   '<label class="voiceLabel" for="voiceSelect">기기 음성</label><select class="voiceSelect" id="voiceSelect">'+voiceOptions+'</select>'+
   '<div class="voiceMeta">'+esc(voiceStatus)+'</div>'+
   '<button class="big secondary previewVoice" data-preview-voice>🔊 선택한 발음 미리 듣기</button>'+
   '<p class="settingNote">브라우저와 기기에 설치된 음성에 따라 실제 음색은 달라질 수 있어요. 해당 지역 음성이 없으면 브라우저가 가장 가까운 영어 음성을 사용합니다.</p>'+
  '</section>',
  'settings'
 )
}
function start(ids,origin='topics',reviewKey=null){session={ids,index:0,origin,reviewKey};path=null;level=state.target;qko=false;ako=false;trainer=null;view='study';study()}
function cur(){return qmap.get(session.ids[session.index])}
function study(){
 const q=cur(); if(!q){view='home';return home()}
 if(session.reviewKey&&!path){const pid=session.reviewKey.split('::')[1];path=q.paths.find(p=>p.id===pid)||null}
 const pct=Math.round((session.index/session.ids.length)*100);
 let ans='';
 if(path){const a=path.answers[level];ans='<section class="card answer"><div class="answerTop"><div class="mini">'+levels.map(l=>'<button class="'+(l===level?'on':'')+'" data-level="'+l+'">'+l+'</button>').join('')+'</div><small style="color:var(--green);font-weight:800">'+(level===state.target?'내 목표':'')+'</small></div><p class="aen">'+esc(a.en)+'</p>'+(ako?'<p class="ako">'+esc(a.ko)+'</p>':'')+'<div class="tools"><button class="tool" data-speak-a>🔊 듣기</button><button class="tool" data-slow-a>0.8× 천천히</button><button class="tool" data-ako>'+(ako?'뜻 숨기기':'뜻 보기')+'</button></div><div class="actions"><button class="big primary" data-trainer>문장 학습</button><button class="big secondary" data-change>답변 방향 변경</button></div><div class="actions"><button class="big retry" data-rate="retry">다시 연습</button><button class="big success" data-rate="success">성공</button></div></section>'}
 shell('<div class="progress"><div style="width:'+pct+'%"></div></div><section class="card qcard"><span class="chip">'+esc(q.topic.topic.en)+' · '+esc(q.topic.topic.ko)+'</span><p class="qen">'+esc(q.question.en)+'</p>'+(qko?'<p class="qko">'+esc(q.question.ko)+'</p>':'')+'<div class="tools"><button class="tool" data-speak-q>🔊 질문 듣기</button><button class="tool" data-qko>'+(qko?'뜻 숨기기':'뜻 보기')+'</button></div></section>'+(!path?'<section class="section"><div class="secHead"><h2>답변 방향</h2><span>나와 가까운 것을 선택</span></div><div class="paths">'+q.paths.map(p=>'<button class="path" data-path="'+p.id+'"><b>'+esc(p.label.en)+'</b><small>'+esc(p.label.ko)+'</small></button>').join('')+'</div></section>':'')+ans,session.origin==='review'?'review':'topics')
}
function trainerView(){
 const s=trainer.sentences[trainer.i], a=path.answers[level];
 shell('<div class="pageTitle"><button class="back" data-close-trainer>←</button><div><h1>문장 학습</h1><p>'+(trainer.i+1)+' / '+trainer.sentences.length+'</p></div></div><section class="card" style="padding:18px"><span class="chip">Sentence '+(trainer.i+1)+'</span><p class="qen" style="font-size:20px">'+(trainer.phase==='type'?'••••••••••':esc(s))+'</p><div class="tools"><button class="tool" data-speak-s>🔊 듣기</button><button class="tool" data-slow-s>0.8×</button></div><p class="qko">'+esc(a.ko)+'</p>'+(trainer.phase==='learn'?'<button class="big primary" style="width:100%;margin-top:12px" data-type>가리고 타이핑</button>':'<textarea class="typebox" id="typed" placeholder="영어 문장을 입력하세요.">'+esc(trainer.input||'')+'</textarea><button class="big primary" style="width:100%;margin-top:8px" data-check>정답 확인</button>'+(trainer.feedback?'<div class="feedback '+(trainer.feedback==='good'?'good':'bad')+'">'+(trainer.feedback==='good'?'정확해요!':'조금 달라요. 정답: '+esc(s))+'</div><button class="big secondary" style="width:100%;margin-top:8px" data-next-s>'+(trainer.i+1<trainer.sentences.length?'다음 문장':'답변으로 돌아가기')+'</button>':'') )+'</section>',session.origin==='review'?'review':'topics')
}
function mark(kind){const q=cur(),k=q.id+'::'+path.id;state.review[k]={status:kind,updated:day()};const d=day();state.history[d]??={studied:0,success:0,retry:0};state.history[d].studied++;state.history[d][kind]++;save();toast(kind==='success'?'성공으로 저장했어요.':'다시 연습에 넣었어요.');setTimeout(nextQ,250)}
function nextQ(){if(session.index<session.ids.length-1){session.index++;session.reviewKey=null;path=null;level=state.target;qko=false;ako=false;study()}else{const o=session.origin;session=null;view=o==='review'?'review':'home';o==='review'?review():home()}}
function render(){if(view==='home')home();else if(view==='topics')topics();else if(view==='topic')topic();else if(view==='review')review();else if(view==='history')history();else if(view==='settings')settings();else if(view==='study')study();else if(view==='trainer')trainerView()}
document.addEventListener('click',e=>{
 const n=e.target.closest('[data-nav]');if(n){view=n.dataset.nav;session=null;path=null;render();return}
 if(e.target.closest('[data-settings]')){view='settings';settings();return}
 const targ=e.target.closest('[data-target]');if(targ){state.target=targ.dataset.target;level=state.target;save();render();return}
 const ac=e.target.closest('[data-accent]');if(ac){state.accent=ac.dataset.accent;state.voiceURI='';save();settings();return}
 if(e.target.closest('[data-preview-voice]')){speak("I usually use English when I study or travel.");return}
 const t=e.target.closest('[data-topic]');if(t){topicId=t.dataset.topic;view='topic';topic();return}
 const q=e.target.closest('[data-q]');if(q){start([q.dataset.q],'topics');return}
 const rv=e.target.closest('[data-review]');if(rv){start([rv.dataset.review.split('::')[0]],'review',rv.dataset.review);return}
 if(e.target.closest('[data-today]')){const ids=[...flat].sort(()=>Math.random()-.5).slice(0,5).map(q=>q.id);start(ids,'today');return}
 const p=e.target.closest('[data-path]');if(p){path=cur().paths.find(x=>x.id===p.dataset.path);level=state.target;study();return}
 const l=e.target.closest('[data-level]');if(l){level=l.dataset.level;ako=false;study();return}
 if(e.target.closest('[data-qko]')){qko=!qko;study();return}
 if(e.target.closest('[data-ako]')){ako=!ako;study();return}
 if(e.target.closest('[data-speak-q]')){speak(cur().question.en);return}
 if(e.target.closest('[data-speak-a]')){speak(path.answers[level].en);return}
 if(e.target.closest('[data-slow-a]')){speak(path.answers[level].en,.72);return}
 if(e.target.closest('[data-change]')){path=null;ako=false;study();return}
 const r=e.target.closest('[data-rate]');if(r){mark(r.dataset.rate);return}
 if(e.target.closest('[data-trainer]')){const a=path.answers[level].en;trainer={sentences:(a.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[a]).map(x=>x.trim()),i:0,phase:'learn',input:'',feedback:null};view='trainer';trainerView();return}
 if(e.target.closest('[data-close-trainer]')){view='study';study();return}
 if(e.target.closest('[data-speak-s]')){speak(trainer.sentences[trainer.i]);return}
 if(e.target.closest('[data-slow-s]')){speak(trainer.sentences[trainer.i],.72);return}
 if(e.target.closest('[data-type]')){trainer.phase='type';trainer.feedback=null;trainer.input='';trainerView();setTimeout(()=>document.getElementById('typed')?.focus(),50);return}
 if(e.target.closest('[data-check]')){const v=document.getElementById('typed')?.value||'';trainer.input=v;const norm=x=>x.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();trainer.feedback=norm(v)===norm(trainer.sentences[trainer.i])?'good':'bad';trainerView();return}
 if(e.target.closest('[data-next-s]')){if(trainer.i+1<trainer.sentences.length){trainer.i++;trainer.phase='learn';trainer.feedback=null;trainer.input='';trainerView()}else{view='study';study()}return}
});
document.addEventListener('change',e=>{
 if(e.target.id==='voiceSelect'){state.voiceURI=e.target.value||'';save();toast(state.voiceURI?'음성을 저장했어요.':'자동 음성 선택으로 바꿨어요.')}
});
if('speechSynthesis' in window){
 const prev=speechSynthesis.onvoiceschanged;
 speechSynthesis.onvoiceschanged=()=>{if(typeof prev==='function')prev();if(view==='settings')settings()}
}
render();
