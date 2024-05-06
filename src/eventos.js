document.addEventListener('DOMContentLoaded', async () => {
    const usersList = document.getElementById('users-list');
    const saveBtn = document.getElementById('save-btn');
    const deleteBtn = document.getElementById('deletar-btn')
    const editarBtn = document.getElementById('editar-btn')
    const usersListCsv = document.getElementById('users-list-csv');
    const pesquisar = document.getElementById('pesquisar');
    let dados = [];
    let dadosCsv = [];

    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados da API');
            }
            const data = await response.json();
            renderUsers(data);
            dados = data;
        } catch (error) {
            console.error(error);
            alert('Erro ao buscar os dados da API');
        }
    }

    function renderUsers(users) {
        usersList.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <h3>${user.id}</h3>
                <span>${user.first_name} ${user.last_name}</span>
                <p>Email: ${user.email}</p>
                <p>Telefone: ${user.phone_number}</p>
                <hr><br>
            `;
            usersList.appendChild(userCard);
        });
    }

    async function fetchUsersCsv() {
        try {
            const response = await fetch('./arquivo2.json');
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados do arquivo JSON');
            }
            const data = await response.json();
            dadosCsv = data;
            renderUsersCsv();
        } catch (error) {
            console.error(error);
        }
    }

    function renderUsersCsv() {
        usersListCsv.innerHTML = '';
        dadosCsv.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card-csv');
            
            userCard.innerHTML = `
                <h3>${user.id}</h3>
                <span>${user.first_name} ${user.last_name}</span>
                <p>Email: ${user.email}</p>
                <p>Telefone: ${user.phone_number}</p>
                <hr><br>
            `;
            usersListCsv.appendChild(userCard);
        });
    }
    
    saveBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            if (!response.ok) {
                throw new Error('Erro ao salvar os dados');
            }
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar os dados');
        }
    });

    deleteBtn.addEventListener('click', async () => {
        try {
            const idParaDeletar = prompt("Informe o ID do usuário que deseja deletar:");
            
            if (idParaDeletar) {
                const ids = await fetchIDs();
    
                if (ids) {
                    console.log('IDs lidos:', ids);
                    
                    if (ids.includes(parseInt(idParaDeletar))) {
                        const response = await fetch(`http://localhost:3000/api/delete/${idParaDeletar}`, {
                            method: 'DELETE'
                        });
    
                        if (response.ok) {
                            console.log(`Usuário com ID ${idParaDeletar} deletado com sucesso.`);
                        } else {
                            throw new Error(`Erro ao deletar usuário com ID ${idParaDeletar}`);
                        }
                    } else {
                        console.log(`O ID ${idParaDeletar} não foi encontrado.`);
                    }
                } else {
                    console.log('Não foi possível ler os IDs.');
                }
            } else {
                console.log('Nenhum ID fornecido.');
            }
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            alert("Não foi possível deletar o usuário.");
        }
    });
    
    async function fetchIDs() {
        try {
            const response = await fetch('./arquivo2.json');
            
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            
            const data = await response.json();
            const ids = [];
            
            data.forEach(item => {
                ids.push(item.id);
            });
            
            return ids;
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            return null;
        }
    }
    // editarBtn.addEventListener('click', async () => {
    //     try {
    //         const idParaEditar = prompt("Informe o ID do usuário que deseja editar:");
    
    //         if (!idParaEditar) {
    //             console.log('Nenhum ID fornecido.');
    //             return;
    //         }
    
    //         const response = await fetch(`http://localhost:3000/api/edit/${idParaEditar}`);
    //         if (!response.ok) {
    //             console.log(`O ID ${idParaEditar} não foi encontrado.`);
    //             return;
    //         }
    
    //         const personToEdit = await response.json();
    
    //         document.getElementById('firstNameInput').value = personToEdit.first_name;
    //         document.getElementById('emailInput').value = personToEdit.email;
    
    //         document.getElementById('editForm').style.display = 'block';
    //     } catch (error) {
    //         console.error('Ocorreu um erro:', error);
    //         alert("Não foi possível editar o usuário.");
    //     }
    // });
    pesquisar.addEventListener('click', async () => {
        location.reload()
    });    

    fetchUsers();
    fetchUsersCsv();
});
