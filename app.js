/* Cypher Hub — Student Learning Platform
   Accessible, dependency-free interactions. Data stays in this browser. */
(function () {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem("cypherHub:" + key)) ?? fallback; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem("cypherHub:" + key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const today = () => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };
  const tasks = () => read("tasks", []);
  const resources = [
    {title:"HTML foundations",category:"HTML",level:"Beginner",description:"Build page structure with headings, links, images, lists and semantic elements.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"},
    {title:"HTML forms",category:"HTML",level:"Beginner",description:"Learn labels, input types, validation and accessible form structure.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms"},
    {title:"CSS styling",category:"CSS",level:"Beginner",description:"Practice selectors, colors, typography, spacing, borders and backgrounds.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics"},
    {title:"CSS layout",category:"CSS",level:"Beginner",description:"Arrange responsive pages using Flexbox, Grid and modern layout tools.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"},
    {title:"JavaScript basics",category:"JavaScript",level:"Beginner",description:"Start with variables, conditions, functions, events and DOM updates.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting"},
    {title:"Web accessibility",category:"Study skills",level:"All levels",description:"Make websites easier to navigate with a keyboard and assistive technology.",url:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility"}
  ];
  const quiz = [
    {q:"Which language defines the structure of a web page?",options:["CSS","HTML","SQL"],answer:1,why:"HTML describes page structure and content."},
    {q:"What does CSS mainly control?",options:["Visual presentation","Database storage","Internet connection"],answer:0,why:"CSS styles the presentation and layout of web content."},
    {q:"Which JavaScript keyword declares a block-scoped variable that can change?",options:["const","let","style"],answer:1,why:"Use let when a variable needs reassignment."},
    {q:"What is active recall?",options:["Rereading without pausing","Retrieving information from memory","Highlighting every line"],answer:1,why:"Active recall means trying to remember information before checking notes."},
    {q:"Which HTML element creates a link?",options:["<link>","<a>","<href>"],answer:1,why:"The anchor element <a> creates clickable hyperlinks."}
  ];
  let currentQuiz = 0, score = 0, answered = false, flashIndex = 0, showingBack = false;
  function renderDashboard() {
    const list = $("#dashboard-tasks");
    if (!list) return;
    const all = tasks(), done = all.filter(t => t.done).length;
    $("#stat-total").textContent = all.length;
    $("#stat-done").textContent = done;
    $("#stat-goal").textContent = read("goal", 5);
    $("#progress-value").textContent = all.length ? Math.round(done / all.length * 100) + "%" : "0%";
    const progress = all.length ? Math.round(done / all.length * 100) : 0;
    $("#progress-bar").style.width = progress + "%";
    const progressTrack = $(".progress-track");
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(progress));
    list.replaceChildren();
    const todays = all.filter(t => t.date === today());
    if (!todays.length) {
      const empty = document.createElement("li"); empty.className = "empty-state"; empty.textContent = "No tasks for today yet. Add one in your study planner."; list.append(empty);
    } else todays.forEach(task => {
      const li = document.createElement("li"); li.className = "task-row";
      const label = document.createElement("label"), box = document.createElement("input");
      box.type = "checkbox"; box.checked = task.done; box.addEventListener("change", () => { const next = tasks(); const item = next.find(t => t.id === task.id); if(item) item.done = box.checked; write("tasks",next); renderDashboard(); renderTasks(); });
      const span = document.createElement("span"); span.textContent = task.title + (task.subject ? " · " + task.subject : "");
      if(task.done) span.className = "task-done";
      label.append(box,span); li.append(label); list.append(li);
    });
  }
  function renderTasks() {
    const list = $("#planner-task-list"); if(!list) return;
    list.replaceChildren();
    const all = tasks().sort((a,b) => a.date.localeCompare(b.date));
    if(!all.length){const li=document.createElement("li");li.className="empty-state";li.textContent="Your plan is empty. Add your first task above.";list.append(li);return;}
    all.forEach(task => {
      const li=document.createElement("li");li.className="planner-task";
      const label=document.createElement("label"), box=document.createElement("input");box.type="checkbox";box.checked=task.done;
      box.addEventListener("change",()=>{const next=tasks();const item=next.find(t=>t.id===task.id);if(item)item.done=box.checked;write("tasks",next);renderTasks();renderDashboard();});
      const detail=document.createElement("span");detail.className="planner-task-detail";
      const title=document.createElement("strong");title.textContent=task.title;
      const meta=document.createElement("small");meta.textContent=[task.subject||"General",task.date,task.minutes+" min"].join(" · ");
      if(task.done)title.className="task-done";detail.append(title,meta);label.append(box,detail);
      const remove=document.createElement("button");remove.type="button";remove.className="button button-small button-quiet";remove.textContent="Remove";remove.setAttribute("aria-label","Remove task: "+task.title);
      remove.addEventListener("click",()=>{write("tasks",tasks().filter(t=>t.id!==task.id));renderTasks();renderDashboard();});
      li.append(label,remove);list.append(li);
    });
  }
  function initPlanner(){
    const form=$("#planner-form"); if(!form)return;
    const date=$("#task-date"); if(date)date.value=today();
    const goal=read("goal",5); if($("#weekly-goal"))$("#weekly-goal").value=goal;
    form.addEventListener("submit",e=>{e.preventDefault();const title=$("#task-title").value.trim();if(!title)return;
      const all=tasks();all.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),title,subject:$("#task-subject").value.trim(),date:date.value||today(),minutes:Number($("#task-minutes").value)||25,done:false});
      write("tasks",all);form.reset();date.value=today();renderTasks();renderDashboard();const notice=$("#planner-notice");if(notice)notice.textContent="Study task added and saved in this browser.";
    });
    $("#weekly-goal")?.addEventListener("change",e=>{write("goal",Math.max(1,Math.min(50,Number(e.target.value)||5)));renderDashboard();});
    $("#clear-completed")?.addEventListener("click",()=>{write("tasks",tasks().filter(t=>!t.done));renderTasks();renderDashboard();});
    renderTasks();renderDashboard();
  }
  function initResources(){
    const grid=$("#resource-library"); if(!grid)return;
    function draw(){
      const q=($("#resource-search").value||"").trim().toLowerCase(), cat=$("#resource-category").value;
      const filtered=resources.filter(r=>(cat==="all"||r.category===cat)&&[r.title,r.description,r.category,r.level].join(" ").toLowerCase().includes(q));
      grid.replaceChildren();
      if(!filtered.length){const p=document.createElement("p");p.className="empty-state";p.textContent="No resources match your search. Try another word or category.";grid.append(p);$("#resource-count").textContent="0 resources shown";return;}
      filtered.forEach(r=>{const article=document.createElement("article");article.className="glass-panel info-panel resource-card";
        const tag=document.createElement("span");tag.className="resource-tag";tag.textContent=r.category+" · "+r.level;
        const h=document.createElement("h3");h.textContent=r.title;const p=document.createElement("p");p.textContent=r.description;
        const a=document.createElement("a");a.className="text-link";a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open learning guide ↗";
        article.append(tag,h,p,a);grid.append(article);});
      $("#resource-count").textContent=filtered.length+" resource"+(filtered.length===1?"":"s")+" shown";
    }
    $("#resource-search").addEventListener("input",draw);$("#resource-category").addEventListener("change",draw);draw();
  }
  function renderQuiz(){
    const box=$("#quiz-box");if(!box)return;
    const item=quiz[currentQuiz];box.replaceChildren();
    const count=document.createElement("p");count.className="eyebrow";count.textContent="Question "+(currentQuiz+1)+" of "+quiz.length;
    const h=document.createElement("h3");h.textContent=item.q;box.append(count,h);
    const options=document.createElement("div");options.className="quiz-options";
    item.options.forEach((opt,i)=>{const b=document.createElement("button");b.type="button";b.className="quiz-option";b.textContent=opt;b.addEventListener("click",()=>{
      if(answered)return;answered=true;const correct=i===item.answer;if(correct)score++;b.classList.add(correct?"answer-correct":"answer-wrong");
      $$(".quiz-option",options).forEach((other,j)=>{other.disabled=true;if(j===item.answer)other.classList.add("answer-correct");});
      $("#quiz-feedback").textContent=(correct?"Correct! ":"Not quite. ")+item.why;$("#quiz-score").textContent="Score: "+score+"/"+(currentQuiz+1);
      $("#quiz-next").textContent=currentQuiz===quiz.length-1?"Try again":"Next question";$("#quiz-next").hidden=false;
    });options.append(b);});
    box.append(options);$("#quiz-feedback").textContent="Choose the best answer.";$("#quiz-score").textContent="Score: "+score;$("#quiz-next").hidden=true;
  }
  function initQuiz(){if(!$("#quiz-box"))return;renderQuiz();$("#quiz-next").addEventListener("click",()=>{if(currentQuiz===quiz.length-1){currentQuiz=0;score=0;}else currentQuiz++;answered=false;renderQuiz();});}
  const cards=[
    ["What does HTML stand for?","HyperText Markup Language."],
    ["What is CSS used for?","Styling and laying out web pages."],
    ["What does JavaScript add to a web page?","Interactivity and dynamic behaviour."],
    ["What is semantic HTML?","Elements whose names describe the meaning of their content."],
    ["What is active recall?","Trying to retrieve information from memory before checking notes."],
    ["Why use a label with a form input?","It gives the field an accessible name and larger click target."],
    ["What is responsive design?","Layouts that adapt to different screen sizes and devices."],
    ["What does localStorage do?","Stores small key-value data in the browser across visits."],
    ["What is a CSS media query?","A rule that applies styles when conditions such as viewport width match."],
    ["What is a JavaScript event listener?","Code that responds when an event such as a click occurs."]
  ];
  function renderFlash(){const front=$("#flashcard-front");if(!front)return;front.textContent=showingBack?cards[flashIndex][1]:cards[flashIndex][0];$("#flashcard-count").textContent="Card "+(flashIndex+1)+" of "+cards.length;$("#flashcard-flip").textContent=showingBack?"Show question":"Reveal answer";const seen=read("flashSeen",[]);const progress=$("#flashcard-progress");if(progress)progress.textContent=seen.length+" of "+cards.length+" cards marked known."; }
  function initFlash(){if(!$("#flashcard-front"))return;renderFlash();$("#flashcard-flip").addEventListener("click",()=>{showingBack=!showingBack;renderFlash();});$("#flashcard-next").addEventListener("click",()=>{flashIndex=(flashIndex+1)%cards.length;showingBack=false;renderFlash();});$("#flashcard-known").addEventListener("click",()=>{const seen=read("flashSeen",[]);if(!seen.includes(flashIndex))seen.push(flashIndex);write("flashSeen",seen);flashIndex=(flashIndex+1)%cards.length;showingBack=false;renderFlash();});$("#flashcard-reset").addEventListener("click",()=>{write("flashSeen",[]);renderFlash();});}
  function initContact(){const form=$("#contact-form");if(!form)return;form.addEventListener("submit",e=>{e.preventDefault();const n=$("#contact-notice");if(n)n.textContent="Form checked successfully. This demo does not send or save your information.";});}
  document.addEventListener("DOMContentLoaded",()=>{initPlanner();initResources();initQuiz();initFlash();initContact();});
})();