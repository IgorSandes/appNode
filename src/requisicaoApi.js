const express = require('express');
const axios = require('axios');
const url = "https://random-data-api.com/api/v2/users?size=10"
const fs= require( 'fs' ); 
const { createObjectCsvWriter } = require('csv-writer');

let dados

async function request (req, res) {
    try{
        const response = await axios.get(url)
        res.status(200).json(response.data)
    } catch(error){
        console.log(error)
    }
}

// function salvarDadosJson(){
//     dadosJson = JSON.stringify(dados);
//     fs.writeFileSync("./arquivoDadosTemp.json",dadosJson)
// }

// function espelharDadosCsv(){
//     const dadosCSV = fs.readFileSync('./arquivo.csv', 'utf8');
//     const linhas = dadosCSV.trim().split('\n');

    
//     const dadosJSON = linhas.map(linha => {
//         const [id, firstName, lastName, email, phone, avatar] = linha.split(',');
//         return {
//             id: id.trim(),
//             firstName: firstName.trim(),
//             lastName: lastName.trim(),
//             email: email.trim(),
//             phone: phone.trim(),
//             avatar: avatar.trim()
//         };
//     });

//     fs.writeFileSync('./arquivoEspelhoCsv.json', JSON.stringify(dadosJSON, null, 2));
// }

// let reader = new FileReader();
// reader.readAsText(input.files[0])

module.exports =  {request};
