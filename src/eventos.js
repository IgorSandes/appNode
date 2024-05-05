document.getElementById('pesquisar').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:2000/users'); 
        if (!response.ok) {
            throw new Error('Erro ao solicitar dados da API');
        }
        const data = await response.json();
        console.log('Dados da API:', data);
        
    } catch (error) {
        console.error('Erro ao solicitar dados da API:', error);
    }
});
