"use strict";
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const horas = Math.floor(mil / 3600000);
        const minutos = Math.floor(mil / 60000) % 60;
        const segundos = Math.floor(mil / 1000) % 60;
        return { horas, minutos, segundos };
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos)); // Aqui está a correção
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${veiculo.nome}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.entrada}</td>
          <td>
              <button class="delete" data-placa="${veiculo.placa}">X</button>
          </td>
        `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
                const placa = event.target.getAttribute("data-placa");
                remover(placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                const veiculos = [...ler(), veiculo]; // Lê os veículos existentes e adiciona o novo veículo
                salvar(veiculos); // Salva a lista atualizada no localStorage
            }
        }
        function remover(placa) {
            const veiculo = ler().find((veiculo) => veiculo.placa === placa);
            if (veiculo) {
                // Verificar se 'entrada' é uma string e convertê-la para 'Date' se necessário
                const entrada = typeof veiculo.entrada === 'string' ? new Date(veiculo.entrada) : veiculo.entrada;
                const nome = veiculo.nome;
                // Calcular o tempo de permanência
                const tempo = calcTempo(new Date().getTime() - entrada.getTime());
                if (!confirm(`O veículo ${nome} permaneceu por ${tempo.horas} horas, ${tempo.minutos} minutos e ${tempo.segundos} segundos.`)) {
                    return;
                }
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                renderizar();
            }
            else {
                console.error('Veículo não encontrado.');
            }
        }
        function renderizar() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, renderizar, salvar };
    }
    patio().renderizar();
    const btn = (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true); // Chama adicionar e salva
    });
})();
