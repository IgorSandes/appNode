function buscar() {
    const termoBusca = document.getElementById("buscar").value.toLowerCase();
    let pessoas = [...document.getElementsByClassName("user-card-csv")];

    console.log(termoBusca);
    
    for (let i = 0; i < pessoas.length; i++) {
        const pessoa = pessoas[i];
        const textoPessoa = pessoa.textContent.toLowerCase();
        
        if (!textoPessoa.includes(termoBusca)) {
            pessoa.style.display = "none";
        } else {
            pessoa.style.display = "block";
        }
    }
}