const API_URL = "http://localhost:8080/tarefas";

const campoTitulo = document.getElementById("titulo");
const campoPrioridade = document.getElementById("prioridade");
const botaoCadastrar = document.getElementById("btnCadastrar");
const botaoAtualizar = document.getElementById("btnAtualizar");
const listaTarefas = document.getElementById("listaTarefas");
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "";
    if (tipo === "sucesso") mensagem.classList.add("mensagem-sucesso");
    if (tipo === "erro") mensagem.classList.add("mensagem-erro");
    setTimeout(() => {
        mensagem.textContent = "";
        mensagem.className = "";
    }, 3000);
}

async function carregarTarefas() {
    try {
        listaTarefas.innerHTML = "<p>Carregando tarefas...</p>";
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Não foi possível carregar as tarefas.");
        const tarefas = await resposta.json();
        exibirTarefas(tarefas);
    } catch (erro) {
        console.error(erro);
        listaTarefas.innerHTML = '<p class="sem-tarefas">Não foi possível carregar as tarefas.</p>';
        mostrarMensagem("Erro ao conectar com o backend.", "erro");
    }
}

function exibirTarefas(tarefas) {
    listaTarefas.innerHTML = "";
    if (tarefas.length === 0) {
        listaTarefas.innerHTML = '<p class="sem-tarefas">Nenhuma tarefa cadastrada.</p>';
        return;
    }

    tarefas.forEach(tarefa => {
        const divTarefa = document.createElement("div");
        divTarefa.classList.add("tarefa");
        if (tarefa.concluida) divTarefa.classList.add("concluida");

        const prioridade = tarefa.prioridade ?? "SEM PRIORIDADE";

        divTarefa.innerHTML = `
            <div class="tarefa-info">
                <p class="tarefa-titulo">${tarefa.titulo}</p>
                <p class="tarefa-detalhes">
                    ID: ${tarefa.id}
                    <span class="prioridade">Prioridade: ${prioridade}</span>
                </p>
            </div>
            <div class="tarefa-acoes">
                <button class="${tarefa.concluida ? "btn-desfazer" : "btn-concluir"}"
                    onclick="alterarTarefa(${tarefa.id}, ${!tarefa.concluida})">
                    ${tarefa.concluida ? "Desfazer" : "Concluir"}
                </button>
                <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
            </div>
        `;
        listaTarefas.appendChild(divTarefa);
    });
}

async function cadastrarTarefa() {
    const titulo = campoTitulo.value.trim();
    const prioridade = campoPrioridade.value;

    if (titulo === "") {
        mostrarMensagem("Digite uma tarefa.", "erro");
        campoTitulo.focus();
        return;
    }

    const novaTarefa = {
        titulo: titulo,
        concluida: false,
        prioridade: prioridade
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaTarefa)
        });

        if (!resposta.ok) throw new Error("Não foi possível cadastrar a tarefa.");
        await resposta.json();

        campoTitulo.value = "";
        campoPrioridade.value = "BAIXA";
        mostrarMensagem("Tarefa cadastrada com sucesso!", "sucesso");
        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao cadastrar a tarefa.", "erro");
    }
}

async function alterarTarefa(id, concluida) {
    try {
        const respostaBusca = await fetch(API_URL);
        if (!respostaBusca.ok) throw new Error("Não foi possível consultar as tarefas.");

        const tarefas = await respostaBusca.json();
        const tarefa = tarefas.find(t => t.id === id);
        if (!tarefa) throw new Error("Tarefa não encontrada.");

        const tarefaAtualizada = {
            titulo: tarefa.titulo,
            concluida: concluida,
            prioridade: tarefa.prioridade ?? "BAIXA"
        };

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarefaAtualizada)
        });

        if (!resposta.ok) throw new Error("Não foi possível atualizar a tarefa.");
        await resposta.json();

        mostrarMensagem(concluida ? "Tarefa concluída!" : "Tarefa reaberta!", "sucesso");
        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao atualizar a tarefa.", "erro");
    }
}

async function excluirTarefa(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Não foi possível excluir a tarefa.");

        mostrarMensagem("Tarefa excluída com sucesso!", "sucesso");
        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao excluir a tarefa.", "erro");
    }
}

botaoCadastrar.addEventListener("click", cadastrarTarefa);
botaoAtualizar.addEventListener("click", carregarTarefas);

campoTitulo.addEventListener("keydown", evento => {
    if (evento.key === "Enter") cadastrarTarefa();
});

carregarTarefas();
