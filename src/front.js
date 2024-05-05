import { lerDadosTemp } from "./manipudacaoDados.js"; 
const dadosTemp = lerDadosTemp();

async function criarTabelaApi() {
    console.log(dadosTemp)
    let tabela = document.getElementById("tabela");
    // if (!dadosTemp) {
    //     console.error('Os dados temporários não foram carregados.');
    //     return;
    // }

    dadosTemp.forEach((linha) => {
        tabela.innerHTML += `
            <tr>
                <td>${linha.id}</td>
                <td>${linha.first_name}</td>
                <td>${linha.last_name}</td>
                <td>${linha.email}</td>
                <td>${linha.phone_number}</td>
                <td>${linha.avatar}</td>
            </tr>`; // Adicionando o caractere de quebra de linha
    });
}

async function lerDadosEspelhoCsv() {
    try {
        const response = await fetch('./arquivoEspelhoCsv.json');
        if (!response.ok) {
            throw new Error('Erro ao ler o arquivo');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
        return null;
    }
}

async function criarTabelaEspelhoCsv() {
    let tabela = document.getElementById("tabela2");
    const dadosTempEspelhoCsv = await lerDadosEspelhoCsv();

    if (!dadosTempEspelhoCsv) {
        console.error('Os dados temporários do espelho CSV não foram carregados.');
        return;
    }

    tabela.innerHTML = '';

    dadosTempEspelhoCsv.forEach((linha) => {
        tabela.innerHTML += `
            <tr>
                <td>${linha.id}</td>
                <td>${linha.firstName}</td>
                <td>${linha.lastName}</td>
                <td>${linha.email}</td>
                <td>${linha.phone}</td>
                <td>${linha.avatar}</td>
            </tr>`;
    });
}

lerDadosTemp()
    .then(criarTabelaApi)
//     .then(lerDadosEspelhoCsv)
//     .then(criarTabelaEspelhoCsv)
//     .catch((err) => console.error('Erro:', err));
