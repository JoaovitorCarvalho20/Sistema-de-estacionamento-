interface veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
  }
  
  (function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
  
    function calcTempo(mil: number) {
      const horas = Math.floor(mil / 3600000);  
      const minutos = Math.floor(mil / 60000) % 60;
      const segundos = Math.floor(mil / 1000) % 60;
  
      return { horas, minutos, segundos };
    }


    function patio() {
      function ler(): veiculo[] {
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
      }
  
      function salvar(veiculos: veiculo[]) {
        localStorage.setItem("patio", JSON.stringify(veiculos)); // Aqui está a correção
      }
  
      function adicionar(veiculo: veiculo, salva?: boolean) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${veiculo.nome}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.entrada}</td>
          <td>
              <button class="delete" data-placa="${veiculo.placa}">X</button>
          </td>
        `;
        row.querySelector(".delete")?.addEventListener("click", (event) => {
            const placa = (event.target as HTMLElement).getAttribute("data-placa");
            remover( placa! );
        });
        
  
        $("#patio")?.appendChild(row);
  
        if (salva) {
          const veiculos = [...ler(), veiculo]; // Lê os veículos existentes e adiciona o novo veículo
          salvar(veiculos); // Salva a lista atualizada no localStorage
        }
      }
  
      function remover(placa: string) {
        const veiculo = ler().find((veiculo) => veiculo.placa === placa);
    
        if (veiculo) {
            // Verificar se 'entrada' é uma string e convertê-la para 'Date' se necessário
            const entrada = typeof veiculo.entrada === 'string' ? new Date(veiculo.entrada) : veiculo.entrada;
            const nome = veiculo.nome;
    
            // Calcular o tempo de permanência
            const tempo = calcTempo(new Date().getTime() - entrada.getTime()) ;
            if(!confirm(`O veículo ${nome} permaneceu por ${tempo.horas} horas, ${tempo.minutos} minutos e ${tempo.segundos} segundos.`)) {
                return;
            }
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            renderizar();
        } else {
            console.error('Veículo não encontrado.');
        }
    }
    
        
  
      function renderizar() {
        $("#patio")!.innerHTML = "";
        const patio = ler();
        if (patio.length) {
          patio.forEach((veiculo) => adicionar(veiculo));
        }
      }
  
      return { ler, adicionar, remover, renderizar, salvar };
    }
  
    patio().renderizar();
  
    const btn = $("#cadastrar")?.addEventListener("click", () => {
      const nome = $("#nome")?.value;
      const placa = $("#placa")?.value;
  
      if (!nome || !placa) {
        alert("Os campos nome e placa são obrigatórios");
        return;
      }
      patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true); // Chama adicionar e salva
    });
  })();
  