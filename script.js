document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTOS
    // =========================

    const missionForm = document.getElementById("missionForm");
    const missionId = document.getElementById("missionId");
    const missionName = document.getElementById("missionName");
    const missionDescription = document.getElementById("missionDescription");
    const missionResponsible = document.getElementById("missionResponsible");
    const missionStatus = document.getElementById("missionStatus");
    const missionsList = document.getElementById("missionsList");
    const saveMission = document.getElementById("saveMission");
    const cancelEdit = document.getElementById("cancelEdit");

    if (!missionForm || !missionsList) {
        console.error("Elementos das missões não encontrados.");
        return;
    }

    // =========================
    // DADOS INICIAIS
    // =========================

    const missoesPadrao = [
        {
            id: 1,
            nome: "MISSÃO 001",
            descricao: "Localizar o primeiro Kaiju.",
            responsavel: "ISABELLI",
            status: "encerrada"
        },
        {
            id: 2,
            nome: "MISSÃO 002",
            descricao: "Neutralizar o Kaiju Alpha.",
            responsavel: "ISABELLI",
            status: "encerrada"
        },
        {
            id: 3,
            nome: "MISSÃO 003",
            descricao: "Investigar a nova área de contenção.",
            responsavel: "JULIA",
            status: "encerrada"
        },
        {
            id: 4,
            nome: "MISSÃO 004",
            descricao: "Localizar os rastros do Kaiju Beta.",
            responsavel: "MARINA",
            status: "encerrada"
        },
        {
            id: 5,
            nome: "MISSÃO 005",
            descricao: "Proteger a zona de evacuação.",
            responsavel: "ISABELLI",
            status: "encerrada"
        },
        {
            id: 6,
            nome: "MISSÃO 006",
            descricao: "Recuperar os dados do laboratório.",
            responsavel: "JULIA",
            status: "encerrada"
        },
        {
            id: 7,
            nome: "MISSÃO 007",
            descricao: "Derrotar o segundo Kaiju.",
            responsavel: "ISABELLI",
            status: "encerrada"
        },
        {
            id: 8,
            nome: "MISSÃO 008",
            descricao: "Investigar o próximo sinal de Kaiju.",
            responsavel: "ISABELLI",
            status: "andamento"
        }
    ];

    let missoes = JSON.parse(localStorage.getItem("missoes")) || missoesPadrao;

    // =========================
    // SALVAR
    // =========================

    function salvarMissoes() {
        localStorage.setItem("missoes", JSON.stringify(missoes));
    }

    // =========================
    // STATUS
    // =========================

    function classeStatus(status) {
        if (status === "encerrada") return "completed";
        if (status === "andamento") return "progress";
        if (status === "bloqueada") return "waiting";
        return "pending";
    }

    function textoStatus(status) {
        if (status === "encerrada") return "ENCERRADA";
        if (status === "andamento") return "EM ANDAMENTO";
        if (status === "bloqueada") return "BLOQUEADA";
        if (status === "concluida") return "CONCLUÍDA";
        return "PENDENTE";
    }

    // =========================
    // MOSTRAR MISSÕES
    // =========================

    function mostrarMissoes() {

        missionsList.innerHTML = "";

        missoes.forEach(missao => {

            const linha = document.createElement("div");
            linha.className = "mission";

            linha.innerHTML = `
                <div>
                    <strong>${missao.nome}</strong>
                    <p>${missao.descricao}</p>
                </div>

                <div class="operator">
                    ${missao.responsavel}
                </div>

                <div>
                    <span class="mission-status ${classeStatus(missao.status)}">
                        ${textoStatus(missao.status)}
                    </span>
                </div>

                <div class="mission-actions">
                    <button class="edit-mission">EDITAR</button>
                    <button class="delete-mission">EXCLUIR</button>
                </div>
            `;

            // EDITAR

            linha.querySelector(".edit-mission").addEventListener("click", () => {

                missionId.value = missao.id;
                missionName.value = missao.nome;
                missionDescription.value = missao.descricao;
                missionResponsible.value = missao.responsavel;
                missionStatus.value = missao.status;

                saveMission.textContent = "SALVAR ALTERAÇÕES";
                cancelEdit.hidden = false;

                document.querySelector(".mission-control").scrollIntoView({
                    behavior: "smooth"
                });
            });

            // EXCLUIR

            linha.querySelector(".delete-mission").addEventListener("click", () => {

                if (confirm(`Excluir ${missao.nome}?`)) {

                    missoes = missoes.filter(m => m.id !== missao.id);

                    salvarMissoes();
                    mostrarMissoes();
                }
            });

            missionsList.appendChild(linha);
        });
    }

    // =========================
    // CADASTRAR / EDITAR
    // =========================

    missionForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const dados = {
            nome: missionName.value.trim(),
            descricao: missionDescription.value.trim(),
            responsavel: missionResponsible.value.trim(),
            status: missionStatus.value
        };

        // EDITAR

        if (missionId.value) {

            const indice = missoes.findIndex(
                m => m.id === Number(missionId.value)
            );

            missoes[indice] = {
                id: Number(missionId.value),
                ...dados
            };

        } else {

            // CADASTRAR

            missoes.push({
                id: Date.now(),
                ...dados
            });
        }

        salvarMissoes();
        mostrarMissoes();

        missionForm.reset();
        missionId.value = "";

        saveMission.textContent = "+ CADASTRAR MISSÃO";
        cancelEdit.hidden = true;
    });

    // =========================
    // CANCELAR EDIÇÃO
    // =========================

    cancelEdit.addEventListener("click", () => {

        missionForm.reset();
        missionId.value = "";

        saveMission.textContent = "+ CADASTRAR MISSÃO";
        cancelEdit.hidden = true;
    });

    // =========================
    // INICIAR
    // =========================

    mostrarMissoes();

});

// =========================
// SISTEMA DE IMAGENS
// =========================

function configurarImagem(inputId, previewId, storageKey) {

    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) {
        return;
    }


    // Carregar imagem salva

    const imagemSalva =
        localStorage.getItem(storageKey);

    if (imagemSalva) {

        preview.src = imagemSalva;

        preview.style.display = "block";
    }


    // Escolher nova imagem

    input.addEventListener("change", function () {

        const arquivo = this.files[0];

        if (!arquivo) {
            return;
        }


        const leitor = new FileReader();


        leitor.onload = function (evento) {

            const imagem =
                evento.target.result;


            preview.src = imagem;

            preview.style.display = "block";


            // Salvar no navegador

            localStorage.setItem(
                storageKey,
                imagem
            );

        };


        leitor.readAsDataURL(arquivo);

    });

}


// PERSONAGEM

configurarImagem(
    "personagemImagem",
    "personagemPreview",
    "imagemPersonagem"
);


// MECHA ANTIGO

configurarImagem(
    "mechaAntigoImagem",
    "mechaAntigoPreview",
    "imagemMechaAntigo"
);


// MECHA ATUAL

configurarImagem(
    "mechaAtualImagem",
    "mechaAtualPreview",
    "imagemMechaAtual"
);

// =====================================================
// GERENCIADOR DE VITÓRIAS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------
    // ELEMENTOS
    // -------------------------------------------------

    const form = document.getElementById("victoryForm");

    const idInput = document.getElementById("victoryId");

    const kaijuInput = document.getElementById("victoryKaiju");

    const dateInput = document.getElementById("victoryDate");

    const typeInput = document.getElementById("victoryType");

    const responsibleInput =
        document.getElementById("victoryResponsible");

    const descriptionInput =
        document.getElementById("victoryDescription");

    const list =
        document.getElementById("victoriesList");

    const saveButton =
        document.getElementById("saveVictory");

    const cancelButton =
        document.getElementById("cancelVictoryEdit");


    // -------------------------------------------------
    // VERIFICAR SE O HTML EXISTE
    // -------------------------------------------------

    if (!form || !list) {

        console.error(
            "ERRO: O gerenciador de vitórias não foi encontrado."
        );

        return;
    }


    // -------------------------------------------------
    // CARREGAR DADOS
    // -------------------------------------------------

    let listaVitorias = [];

    try {

        listaVitorias =
            JSON.parse(
                localStorage.getItem("historicoVitorias")
            ) || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar vitórias:",
            erro
        );

        listaVitorias = [];

    }


    // -------------------------------------------------
    // SALVAR
    // -------------------------------------------------

    function salvarDados() {

        localStorage.setItem(
            "historicoVitorias",
            JSON.stringify(listaVitorias)
        );

    }


    // -------------------------------------------------
    // MOSTRAR VITÓRIAS
    // -------------------------------------------------

    function mostrarVitorias() {

        list.innerHTML = "";


        if (listaVitorias.length === 0) {

            list.innerHTML = `
                <div class="victory">

                    <div>
                        <strong>
                            NENHUMA VITÓRIA CADASTRADA
                        </strong>
                    </div>

                </div>
            `;

            return;
        }


        listaVitorias.forEach(function (vitoria) {

            const linha =
                document.createElement("div");

            linha.className = "victory";


            let statusTexto = "";

            if (vitoria.tipo === "normal") {

                statusTexto = "VITÓRIA NORMAL";

            } else if (vitoria.tipo === "especial") {

                statusTexto = "VITÓRIA ESPECIAL";

            } else if (vitoria.tipo === "absoluta") {

                statusTexto = "VITÓRIA ABSOLUTA";

            }


            let dataFormatada = "-";


            if (vitoria.data) {

                const partes =
                    vitoria.data.split("-");

                if (partes.length === 3) {

                    dataFormatada =
                        `${partes[2]}/${partes[1]}/${partes[0]}`;

                }

            }


            linha.innerHTML = `

                <div>

                    <strong>
                        ${vitoria.kaiju}
                    </strong>

                </div>


                <div>

                    <span class="victory-date">
                        ${dataFormatada}
                    </span>

                </div>


                <div>

                    <span class="victory-responsible">
                        ${vitoria.responsavel}
                    </span>

                </div>


                <div>

                    <span class="
                        victory-status
                        ${vitoria.tipo}
                    ">
                        ${statusTexto}
                    </span>

                </div>


                <div>

                    <p>
                        ${vitoria.observacao || "-"}
                    </p>

                </div>


                <div class="victory-actions">

                    <button
                        type="button"
                        class="edit-victory"
                        data-id="${vitoria.id}"
                    >
                        EDITAR
                    </button>

                    <button
                        type="button"
                        class="delete-victory"
                        data-id="${vitoria.id}"
                    >
                        EXCLUIR
                    </button>

                </div>

            `;


            list.appendChild(linha);

        });


        // -------------------------------------------------
        // BOTÕES EDITAR
        // -------------------------------------------------

        document
            .querySelectorAll(".edit-victory")
            .forEach(function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        editarVitoria(
                            this.dataset.id
                        );

                    }
                );

            });


        // -------------------------------------------------
        // BOTÕES EXCLUIR
        // -------------------------------------------------

        document
            .querySelectorAll(".delete-victory")
            .forEach(function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        excluirVitoria(
                            this.dataset.id
                        );

                    }
                );

            });

    }


    // -------------------------------------------------
    // CADASTRAR
    // -------------------------------------------------

    form.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const kaiju =
                kaijuInput.value.trim();

            const data =
                dateInput.value;

            const tipo =
                typeInput.value;

            const responsavel =
                responsibleInput.value.trim();

            const observacao =
                descriptionInput.value.trim();


            // Verificação

            if (
                !kaiju ||
                !data ||
                !tipo ||
                !responsavel
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;
            }


            // -------------------------------------------------
            // EDITAR
            // -------------------------------------------------

            if (idInput.value) {

                const indice =
                    listaVitorias.findIndex(
                        function (vitoria) {

                            return String(vitoria.id) ===
                                String(idInput.value);

                        }
                    );


                if (indice !== -1) {

                    listaVitorias[indice] = {

                        id:
                            listaVitorias[indice].id,

                        kaiju:
                            kaiju,

                        data:
                            data,

                        tipo:
                            tipo,

                        responsavel:
                            responsavel,

                        observacao:
                            observacao

                    };

                }

            }

            // -------------------------------------------------
            // NOVA VITÓRIA
            // -------------------------------------------------

            else {

                listaVitorias.push({

                    id:
                        Date.now().toString(),

                    kaiju:
                        kaiju,

                    data:
                        data,

                    tipo:
                        tipo,

                    responsavel:
                        responsavel,

                    observacao:
                        observacao

                });

            }


            // Salvar

            salvarDados();

            // Atualizar tabela

            mostrarVitorias();

            // Limpar

            limparFormulario();

        }
    );


    // -------------------------------------------------
    // EDITAR VITÓRIA
    // -------------------------------------------------

    function editarVitoria(id) {

        const vitoria =
            listaVitorias.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (!vitoria) {

            return;

        }


        idInput.value =
            vitoria.id;

        kaijuInput.value =
            vitoria.kaiju;

        dateInput.value =
            vitoria.data;

        typeInput.value =
            vitoria.tipo;

        responsibleInput.value =
            vitoria.responsavel;

        descriptionInput.value =
            vitoria.observacao || "";


        saveButton.textContent =
            "SALVAR ALTERAÇÕES";


        cancelButton.hidden =
            false;


        form.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    // -------------------------------------------------
    // EXCLUIR
    // -------------------------------------------------

    function excluirVitoria(id) {

        const confirmar =
            confirm(
                "Deseja realmente excluir esta vitória?"
            );


        if (!confirmar) {

            return;

        }


        listaVitorias =
            listaVitorias.filter(
                function (vitoria) {

                    return String(vitoria.id) !==
                        String(id);

                }
            );


        salvarDados();

        mostrarVitorias();

    }


    // -------------------------------------------------
    // CANCELAR EDIÇÃO
    // -------------------------------------------------

    cancelButton.addEventListener(
        "click",
        function () {

            limparFormulario();

        }
    );


    // -------------------------------------------------
    // LIMPAR FORMULÁRIO
    // -------------------------------------------------

    function limparFormulario() {

        form.reset();

        idInput.value = "";

        saveButton.textContent =
            "+ CADASTRAR VITÓRIA";

        cancelButton.hidden =
            true;

    }


    // -------------------------------------------------
    // INICIAR
    // -------------------------------------------------

    mostrarVitorias();

});
// =====================================================
// SISTEMA DE IMAGENS - KAIJUS E PLANETAS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // FUNÇÃO PARA CONFIGURAR UMA IMAGEM
    // =================================================

    function configurarImagem(
        inputId,
        previewId,
        placeholderId,
        storageKey
    ) {

        const input =
            document.getElementById(inputId);

        const preview =
            document.getElementById(previewId);

        const placeholder =
            document.getElementById(placeholderId);


        // Verifica se os elementos existem

        if (
            !input ||
            !preview ||
            !placeholder
        ) {

            console.error(
                "Imagem não encontrada:",
                inputId
            );

            return;

        }


        // =============================================
        // CARREGAR IMAGEM SALVA
        // =============================================

        const imagemSalva =
            localStorage.getItem(storageKey);


        if (imagemSalva) {

            preview.src =
                imagemSalva;

            preview.style.display =
                "block";

            placeholder.style.display =
                "none";

        }


        // =============================================
        // ESCOLHER NOVA IMAGEM
        // =============================================

        input.addEventListener(
            "change",
            function () {

                const arquivo =
                    input.files[0];


                if (!arquivo) {

                    return;

                }


                // Verifica se é imagem

                if (
                    !arquivo.type.startsWith("image/")
                ) {

                    alert(
                        "Escolha um arquivo de imagem."
                    );

                    input.value = "";

                    return;

                }


                const leitor =
                    new FileReader();


                leitor.onload =
                    function (evento) {

                        const imagem =
                            evento.target.result;


                        // Mostrar imagem

                        preview.src =
                            imagem;

                        preview.style.display =
                            "block";


                        // Esconder placeholder

                        placeholder.style.display =
                            "none";


                        // Salvar no navegador

                        try {

                            localStorage.setItem(
                                storageKey,
                                imagem
                            );

                        } catch (erro) {

                            console.error(
                                "Não foi possível salvar a imagem:",
                                erro
                            );

                            alert(
                                "A imagem é muito grande. Tente usar uma imagem menor."
                            );

                        }

                    };


                leitor.readAsDataURL(arquivo);

            }
        );

    }



    // =================================================
    // KAIJUS
    // =================================================

    configurarImagem(
        "kaijuInput1",
        "kaijuPreview1",
        "kaijuPlaceholder1",
        "imagemKaiju1"
    );


    configurarImagem(
        "kaijuInput2",
        "kaijuPreview2",
        "kaijuPlaceholder2",
        "imagemKaiju2"
    );


    configurarImagem(
        "kaijuInput3",
        "kaijuPreview3",
        "kaijuPlaceholder3",
        "imagemKaiju3"
    );


    configurarImagem(
        "kaijuInput4",
        "kaijuPreview4",
        "kaijuPlaceholder4",
        "imagemKaiju4"
    );


    configurarImagem(
        "kaijuInput5",
        "kaijuPreview5",
        "kaijuPlaceholder5",
        "imagemKaiju5"
    );



    // =================================================
    // PLANETAS
    // =================================================

    configurarImagem(
        "planetInput1",
        "planetPreview1",
        "planetPlaceholder1",
        "imagemPlaneta1"
    );


    configurarImagem(
        "planetInput2",
        "planetPreview2",
        "planetPlaceholder2",
        "imagemPlaneta2"
    );


    configurarImagem(
        "planetInput3",
        "planetPreview3",
        "planetPlaceholder3",
        "imagemPlaneta3"
    );


    configurarImagem(
        "planetInput4",
        "planetPreview4",
        "planetPlaceholder4",
        "imagemPlaneta4"
    );


    configurarImagem(
        "planetInput5",
        "planetPreview5",
        "planetPlaceholder5",
        "imagemPlaneta5"
    );

});