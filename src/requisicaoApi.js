const express = require('express');
const axios = require('axios');
const url = "https://random-data-api.com/api/v2/users?size=10"
const fs= require( 'fs' ); 
const { createObjectCsvWriter } = require('csv-writer');

let dados
let modelo = []

async function request (req, res) {
    try{
        const response = await axios.get(url)
        res.status(200).json(response.data)
        dados = response.data;
        dadosFiltrados(dados)
    } catch(error){
        console.log(error)
    }
}

function dadosFiltrados (teste){
    teste.map((result) => {
        let dado = {"id":result.id,
                    "nome":result.first_name,
                    "sobrenome": result.last_name,
                    "email":result.email,
                    "numero":result.phone_number,
                    "avatar":result.avatar
                    }
        modelo.push(dado);
    })
    salvarDadosJson()
    salvarDadosCsv()
    return modelo
}

function salvarDadosJson(){
    dadosJson = JSON.stringify(dados);
    fs.writeFileSync("./arquivoDadosTemp.json",dadosJson)
}

function espelharDadosCsv(){
    const dadosCSV = fs.readFileSync('./arquivo.csv', 'utf8');
    const linhas = dadosCSV.trim().split('\n');

    
    const dadosJSON = linhas.map(linha => {
        const [id, firstName, lastName, email, phone, avatar] = linha.split(',');
        return {
            id: id.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            avatar: avatar.trim()
        };
    });

    fs.writeFileSync('./arquivoEspelhoCsv.json', JSON.stringify(dadosJSON, null, 2));
}

async function salvarDadosCsv() {
    try {
        const rawData = fs.readFileSync('./arquivoDadosTemp.json');
        const dados = JSON.parse(rawData);

        const csvWriter = createObjectCsvWriter({
            path: './arquivo.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'nome', title: 'Nome' },
                { id: 'sobrenome', title: 'Sobrenome' },
                { id: 'email', title: 'Email' },
                { id: 'numero', title: 'Número' },
                { id: 'avatar', title: 'Avatar' }
            ],
            append: true
        });

        const dadosFormatados = dados.map(item => ({
            id: item.id || '',
            nome: item.first_name || '',
            sobrenome: item.last_name || '',
            email: item.email || '',
            numero: item.phone_number || '',
            avatar: item.avatar || ''
        }));

        await csvWriter.writeRecords(dadosFormatados)
            .then(() => {
                console.log('Dados salvos no arquivo CSV com sucesso.');
            })
            .catch((error) => {
                console.error('Erro ao salvar dados no arquivo CSV:', error);
            });
            espelharDadosCsv()
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
    }
}

console.log("olá")
module.exports =  {request};
