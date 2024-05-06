const express = require('express');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const bodyParser = require('body-parser');
const json2csv = require('json2csv').parse;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get('https://random-data-api.com/api/v2/users?size=10');
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
        res.status(500).json({ error: 'Erro ao buscar os dados da API' });
    }
});

app.post('/api/save', (req, res) => {
    const newData = req.body.slice(0, 10);

    fs.exists('arquivo2.json', (exists) => {
        if (!exists) {
            fs.writeFile('arquivo2.json', '[]', (err) => {
                if (err) {
                    console.error('Erro ao criar o arquivo JSON:', err);
                    res.status(500).json({ error: 'Erro ao criar o arquivo JSON' });
                    return;
                }
                addToJSON(newData, res);
            });
        } else {
            addToJSON(newData, res);
        }
    });

    function addToJSON(newData, res) {
        fs.readFile('arquivo2.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo JSON:', err);
                res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
                return;
            }

            let jsonData = [];
            try {
                if (data.length > 0) {
                    jsonData = JSON.parse(data);
                }
            } catch (parseError) {
                console.error('Erro ao analisar o conteúdo do arquivo JSON:', parseError);
                res.status(500).json({ error: 'Erro ao analisar o conteúdo do arquivo JSON' });
                return;
            }

            jsonData.push(...newData);

            fs.writeFile('arquivo2.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Erro ao salvar dados no arquivo JSON:', writeErr);
                    res.status(500).json({ error: 'Erro ao salvar dados no arquivo JSON' });
                    return;
                }
                console.log('Dados adicionados ao arquivo JSON com sucesso.');
                res.status(200).json({ message: 'Dados salvos em arquivo JSON com sucesso' });
            });
        });
    }

    const csvData = json2csv(newData, { header: false });

    fs.appendFile('arquivo.csv', csvData, (err) => {
        if (err) {
            console.error('Erro ao salvar dados no arquivo CSV:', err);
            res.status(500).json({ error: 'Erro ao salvar dados no arquivo CSV' });
            return;
        }
        console.log('Dados adicionados ao arquivo CSV com sucesso.');
    });
});

app.get('/api/getData', (req, res) => {
    let users = [];
    let headers = [];
    let lineNumber = 0;

    const rl = readline.createInterface({
        input: fs.createReadStream('arquivo.csv'),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if (lineNumber === 0) {
            headers = line.split(',');
        } else {
            const userData = {};
            const values = line.split(',');
            headers.forEach((header, index) => {
                userData[header] = values[index];
            });
            users.push(userData);
        }
        lineNumber++;
    });

    rl.on('close', () => {
        res.json(users);
    });

    rl.on('error', (err) => {
        console.error('Erro ao ler o arquivo CSV:', err);
        res.status(500).json({ error: 'Erro ao ler o arquivo CSV' });
    });
});

app.delete('/api/delete/:id', (req, res) => {
    const idToDelete = req.params.id;

    fs.readFile('./arquivo2.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
            return;
        }

        let dadosJson = JSON.parse(data);

        const indexToDelete = dadosJson.findIndex(item => item.id === parseInt(idToDelete));

        if (indexToDelete === -1) {
            console.error('Registro não encontrado.');
            res.status(404).json({ error: 'Registro não encontrado' });
            return;
        }

        dadosJson.splice(indexToDelete, 1);

        fs.writeFile('./arquivo2.json', JSON.stringify(dadosJson, null, 2), err => {
            if (err) {
                console.error('Erro ao escrever o arquivo JSON:', err);
                res.status(500).json({ error: 'Erro ao escrever o arquivo JSON' });
                return;
            }
            console.log('Registro excluído com sucesso.');
            res.status(200).json({ message: 'Registro excluído com sucesso' });
        });
    });
});

// app.post('/api/edit', (req, res) => {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     rl.question('Digite o ID da pessoa que deseja editar: ', (idToEdit) => {
//         fs.readFile('arquivo2.json', 'utf8', (err, data) => {
//             if (err) {
//                 console.error('Erro ao ler o arquivo JSON:', err);
//                 res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
//                 rl.close();
//                 return;
//             }

//             let jsonData = [];
//             try {
//                 jsonData = JSON.parse(data);
//             } catch (parseError) {
//                 console.error('Erro ao analisar o conteúdo do arquivo JSON:', parseError);
//                 res.status(500).json({ error: 'Erro ao analisar o conteúdo do arquivo JSON' });
//                 rl.close();
//                 return;
//             }

//             const personIndex = jsonData.findIndex(person => person.id === parseInt(idToEdit));
//             if (personIndex === -1) {
//                 res.status(404).json({ error: 'Pessoa não encontrada' });
//                 rl.close();
//                 return;
//             }

//             rl.question('Digite o número do atributo que deseja editar:\n1. Nome\n2. Email\n', (attribute) => {
//                 let attributeName;
//                 switch (attribute) {
//                     case '1':
//                         attributeName = 'first_name';
//                         break;
//                     case '2':
//                         attributeName = 'email';
//                         break;
//                     default:
//                         res.status(400).json({ error: 'Atributo inválido' });
//                         rl.close();
//                         return;
//                 }

//                 rl.question(`Digite o novo valor para ${attributeName}: `, (newValue) => {
//                     jsonData[personIndex][attributeName] = newValue;

//                     fs.writeFile('arquivo2.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
//                         if (writeErr) {
//                             console.error('Erro ao salvar dados no arquivo JSON:', writeErr);
//                             res.status(500).json({ error: 'Erro ao salvar dados no arquivo JSON' });
//                             rl.close();
//                             return;
//                         }
//                         console.log('Pessoa editada com sucesso.');
//                         res.status(200).json({ message: 'Pessoa editada com sucesso' });
//                         rl.close();
//                     });
//                 });
//             });
//         });
//     });
// });

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
