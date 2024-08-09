verificaAutenticado()

document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side")
    if (event.target.checked) {
        mainSide.classList.remove("off")
    }
    else {
        mainSide.classList.add("off")
    }
})

document.getElementById("btn_voltar_atd").addEventListener("click", () => {
    window.location.href = '../calendario/calendario.html';
});

// Selecionando elementos do DOM
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const formContent = document.getElementById('formContent');
const nomePacienteInput = document.getElementById('nomePaciente');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const limparButton = document.getElementById('limparButton');

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

const id_agendamento = params.get('id');
const id_paciente = params.get('id_paciente');
const nome_paciente = params.get('nome');
nomePacienteInput.value = nome_paciente;

let timerInterval;
let timerSeconds = 0;
let timerPaused = false;
let atendimentos = [];

let conteudoAtestado = ""
let conteudoProntuario = ""
let conteudoAnamineseI = ""
let conteudoAnamineseA = ""
let conteudoNeuroI = ""
let conteudoNeuroA = ""

// Função para atualizar o tempo do timer
function updateTimer() {
    if (!timerPaused) {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Evento de clique no botão de iniciar
startButton.addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Evento de clique no botão de pausar
pauseButton.addEventListener('click', () => {
    timerPaused = !timerPaused;
});

// Evento de clique no botão de finalizar atendimento
stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const nomePaciente = nomePacienteInput.value;
    if (nomePaciente) {
        const now = new Date();
        const dataHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const tempoAtendimento = timerSeconds; // Tempo de atendimento em segundos

        // Criando um objeto para representar o paciente
        const paciente = {
            nome: nomePaciente,
            atendimentos: []
        };

        // Criando um objeto para representar o atendimento
        const atendimento = {
            tipo: formTitle.textContent,
            id_atendimento: "",
            id_agendamento: id_agendamento,
            id_paciente: id_paciente,
            conteudoAtestado,
            conteudoProntuario,
            conteudoAnamineseI,
            conteudoAnamineseA,
            conteudoNeuroI,
            conteudoNeuroA,
            dataHora: dataHora,
            tempo: tempoAtendimento,
            paciente: paciente // Referência para o paciente
        };



        fetch("/atendimento", {
            method: "POST",
            body: JSON.stringify({
                id_agendamento: atendimento.id_agendamento,
                id_paciente: atendimento.id_paciente,
                conteudoAtestado: atendimento.conteudoAtestado,
                conteudoProntuario: atendimento.conteudoProntuario,
                conteudoAnamineseI: atendimento.conteudoAnamineseI,  
                conteudoAnamineseA: atendimento.conteudoAnamineseA,               
                conteudoNeuroI: atendimento.conteudoNeuroI,
                conteudoNeuroA: atendimento.conteudoNeuroA,
                
                tempo: atendimento.tempo + "",
                dataHora: atendimento.dataHora
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            atendimento.id_atendimento = data.id;
            alert("Atendimento Registrado com sucesso!")
        }).catch(() => alert("Erro ao registrar atendimento"))

        // Adicionando o atendimento à lista de atendimentos do paciente
        paciente.atendimentos.push(atendimento);



        console.log(atendimento)

        // Adicionando o atendimento à lista geral de atendimentos
        atendimentos.push(atendimento);

        // const listItem = document.createElement('li');
        // listItem.textContent = `${dataHora} - ${nomePaciente}`;
        // listItem.addEventListener('click', () => openAtendimentoDetails(atendimento));
        // historyList.appendChild(listItem);
        //getAllAtendimentos();
    }
    // Limpa campos
    formTitle.textContent = '';
    nomePacienteInput.value = '';
    formContent.value = '';
    fileInput.value = '';
    timerSeconds = 0; // Zera o contador do timer
    updateTimer(); // Atualiza o timer
});

// Função para exibir os detalhes do atendimento
function openAtendimentoDetails(atendimento) {
    // console.log(atendimento)
   
    conteudoProntuario = atendimento.conteudoProntuario
    conteudoAtestado = atendimento.conteudoAtestado
    conteudoAnamineseI = atendimento.conteudoAnamineseI
    conteudoAnamineseA = atendimento.conteudoAnamineseA
    conteudoNeuroI = atendimento.conteudoNeuroI
    conteudoNeuroA = atendimento.conteudoNeuroA
    // nomePacienteInput.value = atendimento.paciente.nome; // Usamos o nome do paciente associado ao atendimento
    nomePacienteInput.value = nome_paciente; // Usamos o nome do paciente associado ao atendimento

    const tempoAtendimento = atendimento.tempo;
    const hours = Math.floor(tempoAtendimento / 3600);
    const minutes = Math.floor((tempoAtendimento % 3600) / 60);
    const seconds = tempoAtendimento % 60;
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para abrir o formulário correspondente
function openForm(title) {
    formTitle.textContent = title;

    if (title === "Atestado") {
        formContent.value = conteudoAtestado;
    }

    if (title === "Prontuário") {
        formContent.value = conteudoProntuario;
    }

    if (title === "Anamnese Infanto-Juvenil") {
        formContent.value = conteudoAnamineseI;
    }

    if (title === "Anamnese Adulto") {
        formContent.value = conteudoAnamineseA;
    }

    if (title === "Neuropsicológica Infanto-Juvenil") {
        formContent.value = conteudoNeuroI;
    }

    if (title === "Neuropsicológica Adulto") {
        formContent.value = conteudoNeuroA;
    }

}



// Evento de limpar o formulário
// limparButton.addEventListener('click', () => {
//     formTitle.textContent = '';
//     nomePacienteInput.value = '';
//     formContent.value = '';
//     fileInput.value = '';
// });

formContent.addEventListener("change", e => {
    const title = formTitle.textContent;
    const content = e.target.value

    
    if (title === "Atestado") {
        conteudoAtestado = content;
    }

    if (title === "Prontuário") {
        conteudoProntuario = content;
    }

    if (title === "Anamnese Infanto-Juvenil") {
        conteudoAnamineseI = content;
    }

    if (title === "Anamnese Adulto") {
        conteudoAnamineseA = content;
    }

    if (title === "Neuropsicológica Infanto-Juvenil") {
        conteudoNeuroI = content;
    }

    if (title === "Neuropsicológica Adulto") {
        conteudoNeuroA = content;
    }
})

async function getAtendimentos() {
    const response_atendimentos = await fetch(`/atendimento/${id_paciente}`)
    return response_atendimentos;
}

function getAllAtendimentos() {
    getAtendimentos().then(response => response.json()).then(data => {
        for (let index = 0; index < data.paciente.length; index++) {

            const listItemUpdated = document.createElement('li');
            listItemUpdated.textContent = `${data.paciente[index].dataHora} - ${nome_paciente}`;

            // Cria o botão "Visualizar"
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Visualizar';
            viewButton.classList.add('visual-button');
            viewButton.addEventListener('click', () => openAtendimentoDetails(data.paciente[index]));

            // Adiciona o botão ao elemento <li>
            listItemUpdated.appendChild(viewButton);

            // Adiciona o elemento <li> à lista de histórico (historyList)
            historyList.appendChild(listItemUpdated);
        }

    })
}

let Usuario = ''

    ; (async () => {
        const token = localStorage.getItem(CHAVE)

        const response = await fetch('/verify', {
            body: JSON.stringify({ token }),
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()
        Usuario = data.Usuario;
        const userGreeting = document.getElementById('userGreeting');
        userGreeting.textContent = `Olá, ${Usuario}!`;

        // data = USUARIO DO BANCO LOGADO

        // -----------------------------------

        const response2 = await fetch('/users')
        const consultores = await response2.json()


        if (data.Secretaria) {
            consultores.filter(arq => !arq.Secretaria && arq.Nome !== "ADM").forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
            })
        } else {
            [data].forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`

            })
        }
    })().catch(console.error)

    let fixedText = ''; // Variável global para armazenar o texto fixo
    let selectedFormType = '';
    
    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            } else {
                console.error("Failed to load image: " + url);
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    
    function openForm(formType) {
        selectedFormType = formType; // Atualiza a variável global com o tipo de formulário selecionado
        document.getElementById('formTitle').textContent = formType;
        const nomePaciente = document.getElementById('nomePaciente').value.trim();
    
        if (formType === 'Atestado') {
            fixedText = `
                 compareceu para:
                (  ) atendimento em Psicoterapia
                (  ) atendimento em Psicopedagogia
                (  ) sessão de orientação em Avaliação Neuropsicológica
                (  ) sessão em Avaliação Neuropsicológica
                (  ) sessão de Devolutiva de Avaliação Neuropsicológica
                (  ) acompanha o menor ________________\n\n
                Nesta data, no período das ________ às ________ horas.\n\n
                Paulínia, _____ de _______________ de ________\n\n
                Atenciosamente,\n\n\n\n
                __________________________________
                Assinatura da psicóloga responsável
            `;
        } else if (formType === 'Prontuário') {
            fixedText = `Texto fixo para Prontuário com ${nomePaciente}...`;
        } else if (formType === 'Anamnese Infanto-Juvenil') {
            fixedText = `Texto fixo para Anamnese Infanto-Juvenil com ${nomePaciente}...`;
        } else if (formType === 'Anamnese Adulto') {
            fixedText = `Texto fixo para Anamnese Adulto com ${nomePaciente}...`;
        } else if (formType === 'Neuropsicológica Infanto-Juvenil') {
            fixedText = `Texto fixo para Avaliação Neuropsicológica Infanto-Juvenil com ${nomePaciente}...`;
        } else if (formType === 'Neuropsicológica Adulto') {
            fixedText = `Texto fixo para Avaliação Neuropsicológica Adulto com ${nomePaciente}...`;
        }
    
        // Define o conteúdo da div
        document.getElementById('formContent').innerText = fixedText;
    }
    
    function generatePDF() {
        const title = document.getElementById('formTitle').textContent;
        const nomePaciente = document.getElementById('nomePaciente').value.trim() || 'documento';
        const fileName = `${title}_${nomePaciente}.pdf`;
    
        if (selectedFormType) {
            toDataURL('/sistema/Logo/logo_lufcam.png', function(headerImage) {
                toDataURL('/sistema/Logo/logo_lufcam.png', function(footerImage) {
                    const docDefinition = {
                        header: {
                            image: headerImage,
                            width: 100,
                            height: 100,
                            margin: [10, 20, 0, 0]
                        },
                        footer: function(currentPage, pageCount) {
                            return {
                                columns: [
                                    { image: footerImage, width: 70, height: 70 },
                                    {
                                        text: [
                                            "LUFCAM – CLÍNICA DE SAÚDE E BEM-ESTAR\n",
                                            "Av. Presidente Getúlio Vargas, nº 497 – Nova Paulínia - Paulínia/SP\n",
                                            { text: "@lufcamclinicadesaudeebemestar - Contato: +55 19 99910.0383", link: "mailto:lufcamclinicadesaudeebemestar@example.com", color: 'blue', decoration: 'underline' }
                                        ],
                                        alignment: 'center',
                                        margin: [0, 10, 0, 0]
                                    }
                                ],
                                margin: [20, -70, 0, 0]
                            };
                        },
                        content: []
                    };
    
                    if (selectedFormType === 'Atestado') {
                        docDefinition.content = [
                            { text: "DECLARAÇÃO DE COMPARECIMENTO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Declaro, para os devidos fins, que `, margin: [85, 0, 0, 20] },
                            { text: nomePaciente, bold: true, decoration: 'underline', margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    }  else if (selectedFormType === 'Prontuário') {
                        docDefinition.content = [
                            { text: "Prontuário\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Conteúdo adicional para Prontuário: `, margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    } else if (selectedFormType === 'Anamnese Infanto-Juvenil') {
                        docDefinition.content = [
                            { text: "Anamnese\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Conteúdo adicional para Anamnese: `, margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    } else if (selectedFormType === 'Anamnese Adulto') {
                        docDefinition.content = [
                            { text: "Anamnese\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Conteúdo adicional para Anamnese: `, margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    }  else if (selectedFormType === 'Neuropsicológica Infanto-Juvenil') {
                        docDefinition.content = [
                            { text: "AVALIAÇÃO PSICOLÓGICA COM ENFOQUE NEUROPSICOLÓGICO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Conteúdo adicional para Avaliação Neuropsicológica: `, margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    } else if (selectedFormType === 'Neuropsicológica Adulto') {
                        docDefinition.content = [
                            { text: "AVALIAÇÃO PSICOLÓGICA COM ENFOQUE NEUROPSICOLÓGICO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                            { text: `Conteúdo adicional para Avaliação Neuropsicológica: `, margin: [85, 0, 0, 20] },
                            { text: document.getElementById('formContent').innerText, margin: [85, 0, 0, 20] }
                        ];
                    }
    
                    console.log(selectedFormType);
                    pdfMake.createPdf(docDefinition).download(fileName);
                });
            });
        } else {
            alert('O campo de texto está vazio!');
        }
    }
    