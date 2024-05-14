const charactersDOM = document.querySelector(".characters");
const apiUrl = "https://rickandmortyapi.com/api";
const loadMoreDom = document.querySelector(".load-more");
const modalContentDom = document.querySelector(".modal-content-card")
const modalDom = document.querySelector(".modal")
const spanBtn = document.querySelector(".close");
const filtroEspecie = document.querySelector("#especie")
const filtroGenero = document.querySelector("#genero")
const filtroStatus = document.querySelector("#status")
const nameFilter = document.querySelector("#search")
const resetarBtn = document.querySelector(".resetar")

async function fetchCharacters({ name, species, gender, status, page = 1 }) {
  const response = await fetch(
    `${apiUrl}/character?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page}`
  );

  const data = await response.json();
  return data.results;
} 

const defaults = {
  name: "",
  species: "",
  gender: "",
  status: "",
  page: 1,
};

async function render({ data }) {
  try {
    const charactersHTML = await data.map(character => `
      <li class="card" data-id="${character.id}">
        <a href=""><h2>${character.name}</h2><img src="${character.image}" alt="${character.name}" /></a>
      </li>`
    ).join('');

    charactersDOM.innerHTML = charactersHTML;
  } catch (error) {
    console.error('Ocorreu um erro ao renderizar os personagens:', error);
  }
}

async function main() {
  try {
    const data = await fetchCharacters(defaults);
    return render({ data });
  } catch (error) {
    console.error('Ocorreu um erro durante a execução do main:', error);
  }
}

async function handleLoadMore() {
  try {
    defaults.page ++;
    const data = await fetchCharacters(defaults);
    console.log(data);
    render({ data });
  } catch (error) {
    console.error('Ocorreu um erro ao lidar com o carregamento de mais dados:', error);
  }
}

loadMoreDom.addEventListener("click", handleLoadMore);

resetarBtn.addEventListener("click", resetar);

function openModal(character){
  const createdDate = new Date(character.created);
  const formattedCreatedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`

  modalContentDom.innerHTML = ""
  const info = document.createElement("div")
  info.innerHTML = `<h2>${character.name}</h2><div class="content"><img src="${character.image}" alt="${character.name}" /><div class="content-info"><p><span>Criado(a) em:</p> </span>${formattedCreatedDate}<p><span>Espécie:</span></p>${character.species}</p><p><span>Genero:</p></span> ${character.gender}<p><span>Status:</p></span> ${character.status}<p><span>Localização:</p></span> ${character.location["name"]}</div></div>`;
  modalContentDom.appendChild(info)
  modalDom.style.display = "block"
}

async function resetar() {
  try {

    defaults.name = "";
    defaults.species = "";
    defaults.gender = "";
    defaults.status = "";
    defaults.page = 1;
    
    document.querySelector("#search").value = "";
    document.querySelector("#especie").value = "";
    document.querySelector("#genero").value = "";
    document.querySelector("#status").value = "";
    

    charactersDOM.innerHTML = "";
    
    const data = await fetchCharacters(defaults);
    
    render({ data });
    
    console.log(data);
  } catch (error) {
    console.error('Ocorreu um erro ao redefinir e recarregar os dados:', error);
  }
}

document.body.addEventListener("click", async function (event) {
  try {
    let card = event.target.closest(".card");
    if (card) {
      event.preventDefault();
      const characterId = card.dataset.id;
      const response = await fetch(`${apiUrl}/character/${characterId}`);
    
      if (!response.ok) {
        throw new Error(`Erro ao obter detalhes do personagem (status ${response.status})`);
      }
      
      const character = await response.json();
      openModal(character);
    }
  } catch (error) {
    console.error('Ocorreu um erro ao abrir o modal do personagem:', error);
  }
});

filtroEspecie.addEventListener("change", async (event) => {
  try{
  defaults.species = event.target.value;
  charactersDOM.innerHTML = "";
  const data = await fetchCharacters(defaults)
  render({ data });
  } catch (error) {
    console.error('Ocorreu um erro ao filtrar por espécie:', error);
  }
});


filtroGenero.addEventListener("change", async (event) => {
  try{
  defaults.gender = event.target.value;
  charactersDOM.innerHTML = "";
  const data = await fetchCharacters(defaults)
  console.log(data)
  render({ data });
  } catch (error) {
    console.error('Ocorreu um erro ao filtrar por genero:', error);
  }
})

filtroStatus.addEventListener("change", async (event) => {
  try{
  defaults.status = event.target.value;
  charactersDOM.innerHTML = "";
  const data = await fetchCharacters(defaults)
  render({ data });
  } catch (error) {
    console.error('Ocorreu um erro ao filtrar por status:', error);
  }
})

nameFilter.addEventListener("keyup", async (event) => {
  try{
  defaults.name = event.target.value;
  charactersDOM.innerHTML = "";
  const data = await fetchCharacters(defaults)
  render({ data });
  } catch (error) {
    console.error('Ocorreu um erro ao filtrar por nome:', error);
  }
})

document.addEventListener("DOMContentLoaded", function() {
  main();
});


spanBtn.onclick = function () {
  modalDom.style.display = "none";
};
