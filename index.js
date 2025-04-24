function abrirModal() {
  overlay.classList.add("active");
  criarTarefa.classList.add("active");
}

function fecharModal() {
  overlay.classList.remove("active");
  criarTarefa.classList.remove("active");
}

function buscarTarefas() {
  fetch("http://localhost:3000/tarefas")
    .then((res) => res.json())
    .then((res) => {
      inserirTarefas(res);
    });
}
buscarTarefas();

function inserirTarefas(listaDeTarefas) {
  if (listaDeTarefas.length > 0) {
    lista.innerHTML = "";
    listaDeTarefas.forEach((tarefa) => {
      if (
        tarefa.id &&
        (typeof tarefa.id === "number" || typeof tarefa.id === "string")
      ) {
        lista.innerHTML += `<li>
          <h5>${tarefa.titulo}</h5>
          <p>${tarefa.descricao}</p>
          <div class="actions">
            <box-icon name="trash" size="sm" onclick="deletarTarefa('${tarefa.id}')"></box-icon>
          </div>
        </li>`;
      } else {
        console.error("Tarefa com ID inválido:", tarefa);
      }
    });
  }
}

function novaTarefa() {
  event.preventDefault();
  event.stopPropagation();
  let tarefa = {
    titulo: titulo.value,
    descricao: descricao.value,
  };
  fetch("http://localhost:3000/tarefas", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(tarefa),
  })
    .then((res) => res.json())
    .then((res) => {
      fecharModal();
      buscarTarefas();
    });
}

function deletarTarefa(id) {
  fetch(`http://localhost:3000/tarefas/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      alert("Tarefa deletada com sucesso!");
      buscarTarefas();
    })
    .catch((err) => console.error("Erro ao deletar tarefa:", err));
}

function pesquisarTarefaapi(descricao) {
  fetch(`http://localhost:3000/tarefas?descricao=${encodeURIComponent(descricao)}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.length > 0) {
        inserirTarefas(res);
      } else {
        alert("Nenhuma tarefa encontrada com esse descrição.");
        buscarTarefas();
      }
    })
    .catch((err) => console.error("Erro ao buscar tarefa:", err));
}

let timeoutId; 

function pesquisarTarefa() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (busca.value.length > 0) {
      pesquisarTarefaapi(busca.value);
    } else {
      buscarTarefas();
    }
  }, 500);
}
