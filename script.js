const menu = document.getElementById('menu');
const gameDiv = document.getElementById('game');
const startBtn = document.getElementById('start-game');
const backMenuBtn = document.getElementById('back-menu');
const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const levelSelect = document.getElementById('level');
const themeSelect = document.getElementById('theme');
const viewScoresBtn = document.getElementById('view-scores');
const scoresDiv = document.getElementById('scores');
const scoreList = document.getElementById('score-list');
const backToMenuBtn = document.getElementById('back-to-menu');

let cards=[],firstCard=null,secondCard=null,lockBoard=false,score=0,moves=0,timer=0,interval;
const themes={emoji:["😀","😂","😍","🤔","🥳","😎","😭","😱","😡","😴","🤖","👻","🎃","🧸","🍕","🍎"],animal:["🐶","🐱","🦊","🐻","🐼","🐨","🐯","🦁","🐸","🐵","🐔","🐧","🐙","🦋","🦄","🐢"],color:["🟥","🟩","🟦","🟨","🟪","🟧","⬛","⬜","🟫","🔵","🔴","🟢","🟡","🟣","🟤","🟠"],minimal:["★","▲","●","■","◆","⬤","⬥","✦","✪","⬟","❖","⬢","⬡","⬧","✶","✹"]};

function shuffle(array){return array.sort(()=>Math.random()-0.5);}

let highScores=JSON.parse(localStorage.getItem('kartninja_scores')||'[]');
function saveScore(){highScores.push(score);highScores.sort((a,b)=>b-a);highScores=highScores.slice(0,5);localStorage.setItem('kartninja_scores',JSON.stringify(highScores));}
viewScoresBtn.addEventListener('click',()=>{menu.classList.add('hidden');scoresDiv.classList.remove('hidden');scoreList.innerHTML=highScores.map((s,i)=>`<li>${i+1}. ${s} Puan</li>`).join('');});
backToMenuBtn.addEventListener('click',()=>{scoresDiv.classList.add('hidden');menu.classList.remove('hidden');});

function startGame(level,theme){menu.classList.add('hidden');gameDiv.classList.remove('hidden');board.className='game-board '+level;score=0;moves=0;timer=0;scoreEl.textContent=`Puan: ${score}`;movesEl.textContent=`Hamle: ${moves}`;timerEl.textContent=`Süre: ${timer}s`;firstCard=secondCard=null;lockBoard=false;clearInterval(interval);interval=setInterval(()=>{timer++;timerEl.textContent=`Süre: ${timer}s`;},1000);let pairs=level==='easy'?8:level==='medium'?18:32;let selectedEmojis=shuffle(themes[theme]).slice(0,pairs);cards=shuffle([...selectedEmojis,...selectedEmojis]);board.innerHTML='';cards.forEach(e=>{const card=document.createElement('div');card.classList.add('card');card.dataset.emoji=e;card.addEventListener('click',flipCard);board.appendChild(card);});}

function flipCard(){if(lockBoard||this===firstCard)return;this.textContent=this.dataset.emoji;this.classList.add('flipped');if(!firstCard){firstCard=this;return;}secondCard=this;moves++;movesEl.textContent=`Hamle: ${moves}`;checkMatch();}

function checkMatch(){if(firstCard.dataset.emoji===secondCard.dataset.emoji){score+=10+(timer<15?5:0);scoreEl.textContent=`Puan: ${score}`;firstCard.classList.add('matched');secondCard.classList.add('matched');firstCard.removeEventListener('click',flipCard);secondCard.removeEventListener('click',flipCard);const pop=document.createElement('div');pop.className='pop-effect';pop.textContent='✨';document.body.appendChild(pop);setTimeout(()=>pop.remove(),500);if(document.querySelectorAll('.card:not(.matched)').length===0){clearInterval(interval);saveScore();setTimeout(()=>alert(`Tebrikler! Seviye tamamlandı! Puanın: ${score}`),200);}resetBoard();}else{lockBoard=true;setTimeout(()=>{firstCard.textContent='';secondCard.textContent='';firstCard.classList.remove('flipped');secondCard.classList.remove('flipped');resetBoard();},800);}}

function resetBoard(){[firstCard,secondCard]=[null,null];lockBoard=false;}
startBtn.addEventListener('click',()=>startGame(levelSelect.value,themeSelect.value));
restartBtn.addEventListener('click',()=>startGame(levelSelect.value,themeSelect.value));
backMenuBtn.addEventListener('click',()=>{gameDiv.classList.add('hidden');menu.classList.remove('hidden');clearInterval(interval);});