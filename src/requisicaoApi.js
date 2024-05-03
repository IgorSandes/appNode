const express = require('express');
const axios = require('axios');
const url = "https://random-data-api.com/api/v2/users?size=10"
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
    return modelo
}

function criarTabelaApi (){
    let tabela = document.getElementById("corpo-tabela")
    modelo.map((linha)=>{

    tabela.innerHTML += `
    <td>${linha.id}</td>
    <td>${linha.nome}</td>
    <td>${linha.sobrenome}</td>
    <td>${linha.email}</td>
    <td>${linha.numero}</td>
    <td>${linha.avatar}</td>
    `
    })
}
console.log("olá")
module.exports =  {request};
