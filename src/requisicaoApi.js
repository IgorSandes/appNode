const express = require('express');
const axios = require('axios');
const url = "https://random-data-api.com/api/v2/users?size=10"

async function request (req, res) {
    try{
        const response = await axios.get(url)
        res.status(200).json(response.data)
        console.log(response.data)
    } catch(error){
        console.log(error)
    }
}

module.exports =  {request}; 