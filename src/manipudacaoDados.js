const url = "https://random-data-api.com/api/v2/users?size=10"
let dados
let modelo = []
let dadosTemp;

export async function lerDadosTemp() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao ler o arquivo');
        }
        dadosTemp = await response.json();
        return dadosTemp;
    } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }
}

async function dadosFiltrados (){
    await lerDadosTemp()
    dadosTemp.map((result) => {
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

async function salvarDadosCsv() {
    try {
        // const rawData = fs.readFileSync('./arquivoDadosTemp.json')
        // const dados = JSON.parse(modelo);

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

        const dadosFormatados = modelo.map(item => ({
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
