let currentPage = 1;
let pageSize = 10;
let selectedTema = '';
let totalPages = 1;

// Elementos DOM
const temaFilter = document.getElementById('temaFilter');
const pageSizeSelect = document.getElementById('pageSize');
const loadBtn = document.getElementById('loadBtn');
const resetProgressBtn = document.getElementById('resetProgressBtn');
const questionListDiv = document.getElementById('questionList');
const paginationDiv = document.getElementById('pagination');

// Carregar lista de temas para o filtro
async function loadTemas() {
    const res = await fetch('/api/temas');
    const temas = await res.json();
    temas.forEach(tema => {
        const option = document.createElement('option');
        option.value = tema;
        option.textContent = tema;
        temaFilter.appendChild(option);
    });
}

// Buscar questões da API
async function fetchQuestions() {
    const url = `/api/questions?page=${currentPage}&limit=${pageSize}&tema=${selectedTema}`;
    const res = await fetch(url);
    const data = await res.json();
    totalPages = data.totalPages;
    renderQuestions(data.data);
    renderPagination();
}

// Renderizar questões na tela
function renderQuestions(questions) {
    questionListDiv.innerHTML = '';
    for (const q of questions) {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.id = q.id;

        const saved = localStorage.getItem(`q_${q.id}`);
        let selectedIdx = -1;
        if (saved) {
            const savedObj = JSON.parse(saved);
            selectedIdx = savedObj.selected;
        }

        card.innerHTML = `
            <div class="question-header">
                <span>${q.tema}</span>
                <span>Questão ${q.id}</span>
            </div>
            <div class="question-text">${q.text}</div>
            <div class="options">
                ${['A', 'B', 'C', 'D'].map((letra, idx) => `
                    <div class="option" data-idx="${idx}">
                        <input type="radio" name="q_${q.id}" value="${idx}" id="q_${q.id}_${idx}" ${selectedIdx === idx ? 'checked' : ''}>
                        <label for="q_${q.id}_${idx}"><strong>${letra})</strong> ${q[`option_${String.fromCharCode(97+idx)}`]}</label>
                    </div>
                `).join('')}
            </div>
            <div class="feedback" style="display: none;"></div>
        `;

        // Se já respondida, mostrar feedback e desabilitar
        if (selectedIdx !== -1) {
            const isCorrect = (selectedIdx === q.correct);
            const feedbackDiv = card.querySelector('.feedback');
            feedbackDiv.style.display = 'block';
            feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
            feedbackDiv.innerHTML = isCorrect ? `✅ Correta! ${q.explanation}` : `❌ Incorreta. Resposta certa: ${String.fromCharCode(65+q.correct)}. ${q.explanation}`;
            card.querySelectorAll('.option input').forEach(inp => inp.disabled = true);
            card.classList.add('answered');
        }

        // Eventos de clique para salvar resposta
        const radios = card.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', async (e) => {
                if (card.classList.contains('answered')) return;
                const selected = parseInt(e.target.value);
                const isCorrect = (selected === q.correct);
                // Salvar localmente
                localStorage.setItem(`q_${q.id}`, JSON.stringify({ selected, isCorrect }));
                // Mostrar feedback
                const feedbackDiv = card.querySelector('.feedback');
                feedbackDiv.style.display = 'block';
                feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
                feedbackDiv.innerHTML = isCorrect ? `✅ Correta! ${q.explanation}` : `❌ Incorreta. Resposta certa: ${String.fromCharCode(65+q.correct)}. ${q.explanation}`;
                // Desabilitar opções
                card.querySelectorAll('.option input').forEach(inp => inp.disabled = true);
                card.classList.add('answered');

                // Enviar para o backend (opcional)
                await fetch('/api/answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: 'default',
                        questionId: q.id,
                        selectedOption: selected,
                        isCorrect
                    })
                });
            });
        });

        questionListDiv.appendChild(card);
    }
}

function renderPagination() {
    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', i === currentPage);
        btn.addEventListener('click', () => {
            currentPage = i;
            fetchQuestions();
        });
        paginationDiv.appendChild(btn);
    }
}

// Resetar progresso local e do backend
async function resetProgress() {
    if (confirm('Resetar todo o seu progresso? Isso limpará todas as respostas.')) {
        localStorage.clear();
        // Opcional: chamar endpoint para limpar no backend
        await fetch('/api/progress/default', { method: 'DELETE' }).catch(e => console.log);
        currentPage = 1;
        fetchQuestions();
    }
}

// Eventos
loadBtn.addEventListener('click', () => {
    currentPage = 1;
    fetchQuestions();
});
pageSizeSelect.addEventListener('change', (e) => {
    pageSize = parseInt(e.target.value);
    currentPage = 1;
    fetchQuestions();
});
temaFilter.addEventListener('change', (e) => {
    selectedTema = e.target.value;
    currentPage = 1;
    fetchQuestions();
});
resetProgressBtn.addEventListener('click', resetProgress);

// Inicialização
loadTemas();
fetchQuestions();