// Dados Iniciais de Teste
const moradoresPadrao = [
    { id: '1', nome: 'Maria Silva', cpf: '111.222.333-44', telefone: '(11) 98765-4321', bairro: 'Centro', endereco: 'Rua Flores, 123' },
    { id: '2', nome: 'João Santos', cpf: '555.666.777-88', telefone: '(11) 91234-5678', bairro: 'Vila Verde', endereco: 'Av. Principal, 45' }
];

const solicitacoesPadrao = [
    { id: '101', moradorId: '1', moradorNome: 'Maria Silva', categoria: 'Manutenção Urbana', descricao: 'Reparo na iluminação da rua', data: '10/05/2024', status: 'Pendente' },
    { id: '102', moradorId: '2', moradorNome: 'João Santos', categoria: 'Apoio Social', descricao: 'Solicitação de cesta básica', data: '08/05/2024', status: 'Concluído' }
];

// Carregar Dados do LocalStorage
let moradores = JSON.parse(localStorage.getItem('assoc_moradores')) || moradoresPadrao;
let solicitacoes = JSON.parse(localStorage.getItem('assoc_solicitacoes')) || solicitacoesPadrao;

// Executar ao carregar a página
window.onload = function() {
    salvarDados();
    renderizarMoradores();
    renderizarSolicitacoes();
    atualizarDashboard();
};

function salvarDados() {
    localStorage.setItem('assoc_moradores', JSON.stringify(moradores));
    localStorage.setItem('assoc_solicitacoes', JSON.stringify(solicitacoes));
}

// Troca de Abas
function switchTab(tabId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const btnAtivo = Array.from(navButtons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (btnAtivo) btnAtivo.classList.add('active');

    const abaAtiva = document.getElementById(tabId);
    if (abaAtiva) abaAtiva.classList.add('active');
}

// Dashboard
function atualizarDashboard() {
    document.getElementById('dash-total-moradores').innerText = moradores.length;
    
    const pendentes = solicitacoes.filter(s => s.status === 'Pendente').length;
    const concluidas = solicitacoes.filter(s => s.status === 'Concluído').length;
    
    document.getElementById('dash-solicitacoes-pendentes').innerText = pendentes;
    document.getElementById('dash-solicitacoes-concluidas').innerText = concluidas;
}

// CRUD Moradores
function renderizarMoradores(lista = moradores) {
    const tbody = document.getElementById('tbody-moradores');
    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum morador encontrado.</td></tr>';
        return;
    }

    lista.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${m.nome}</strong></td>
            <td>${m.cpf}</td>
            <td>${m.telefone}</td>
            <td>${m.bairro}</td>
            <td>
                <button class="btn btn-action btn-edit" onclick="editarMorador('${m.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-action btn-delete" onclick="deletarMorador('${m.id}')" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarMoradores() {
    const termo = document.getElementById('search-moradores').value.toLowerCase().trim();
    const filtrados = moradores.filter(m => 
        m.nome.toLowerCase().includes(termo) ||
        m.cpf.toLowerCase().includes(termo) ||
        m.bairro.toLowerCase().includes(termo)
    );
    renderizarMoradores(filtrados);
}

function abrirModalMorador() {
    document.getElementById('form-morador').reset();
    document.getElementById('morador-id').value = '';
    document.getElementById('modal-morador-titulo').innerText = 'Cadastrar Morador';
    document.getElementById('modal-morador').classList.add('active');
}

function fecharModalMorador() {
    document.getElementById('modal-morador').classList.remove('active');
}

function salvarMorador(event) {
    event.preventDefault();
    
    const id = document.getElementById('morador-id').value;
    const nome = document.getElementById('morador-nome').value.trim();
    const cpf = document.getElementById('morador-cpf').value.trim();
    const telefone = document.getElementById('morador-telefone').value.trim();
    const bairro = document.getElementById('morador-bairro').value.trim();
    const endereco = document.getElementById('morador-endereco').value.trim();

    if (id) {
        const index = moradores.findIndex(m => m.id === id);
        if (index !== -1) {
            moradores[index] = { id, nome, cpf, telefone, bairro, endereco };
        }
    } else {
        const novoMorador = {
            id: Date.now().toString(),
            nome, cpf, telefone, bairro, endereco
        };
        moradores.push(novoMorador);
    }

    salvarDados();
    renderizarMoradores();
    atualizarDashboard();
    fecharModalMorador();
}

function editarMorador(id) {
    const m = moradores.find(item => item.id === id);
    if (!m) return;

    document.getElementById('morador-id').value = m.id;
    document.getElementById('morador-nome').value = m.nome;
    document.getElementById('morador-cpf').value = m.cpf;
    document.getElementById('morador-telefone').value = m.telefone;
    document.getElementById('morador-bairro').value = m.bairro;
    document.getElementById('morador-endereco').value = m.endereco || '';

    document.getElementById('modal-morador-titulo').innerText = 'Editar Morador';
    document.getElementById('modal-morador').classList.add('active');
}

function deletarMorador(id) {
    if (confirm('Tem certeza que deseja excluir este morador?')) {
        moradores = moradores.filter(m => m.id !== id);
        salvarDados();
        renderizarMoradores();
        atualizarDashboard();
    }
}

// CRUD Solicitações
function renderizarSolicitacoes() {
    const tbody = document.getElementById('tbody-solicitacoes');
    tbody.innerHTML = '';

    if (solicitacoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma solicitação encontrada.</td></tr>';
        return;
    }

    solicitacoes.forEach(s => {
        const tr = document.createElement('tr');
        const isPendente = s.status === 'Pendente';
        const badgeClass = isPendente ? 'badge-pendente' : 'badge-concluido';

        tr.innerHTML = `
            <td><strong>${s.moradorNome}</strong></td>
            <td><strong>${s.categoria}</strong><br><small>${s.descricao}</small></td>
            <td>${s.data}</td>
            <td><span class="badge ${badgeClass}">${s.status}</span></td>
            <td>
                <button class="btn btn-action btn-gray" onclick="alternarStatusSolicitacao('${s.id}')">
                    ${isPendente ? 'Concluir' : 'Reabrir'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalSolicitacao() {
    const select = document.getElementById('solicitacao-morador');
    select.innerHTML = '';

    if (moradores.length === 0) {
        alert('Cadastre ao menos um morador antes de registrar uma solicitação.');
        return;
    }

    moradores.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.innerText = m.nome;
        select.appendChild(option);
    });

    document.getElementById('form-solicitacao').reset();
    document.getElementById('modal-solicitacao').classList.add('active');
}

function fecharModalSolicitacao() {
    document.getElementById('modal-solicitacao').classList.remove('active');
}

function salvarSolicitacao(event) {
    event.preventDefault();

    const moradorId = document.getElementById('solicitacao-morador').value;
    const morador = moradores.find(m => m.id === moradorId);
    const categoria = document.getElementById('solicitacao-categoria').value;
    const descricao = document.getElementById('solicitacao-descricao').value.trim();

    const novaSolicitacao = {
        id: Date.now().toString(),
        moradorId,
        moradorNome: morador ? morador.nome : 'Desconhecido',
        categoria,
        descricao,
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente'
    };

    solicitacoes.push(novaSolicitacao);
    salvarDados();
    renderizarSolicitacoes();
    atualizarDashboard();
    fecharModalSolicitacao();
}

function alternarStatusSolicitacao(id) {
    const s = solicitacoes.find(item => item.id === id);
    if (s) {
        s.status = s.status === 'Pendente' ? 'Concluido' : 'Pendente';
        salvarDados();
        renderizarSolicitacoes();
        atualizarDashboard();
    }
}