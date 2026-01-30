let nomeGrupoAtual = "";
let capituloSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
  //auth.js
  let usuarioLogado = localStorage.getItem("usuarioLogado");
  let logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn && usuarioLogado) {
    logoutBtn.style.display = "inline-block";
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.reload();
    });
  }

  //login.js
  let loginForm = document.getElementById("loginForm");
  let erroLogin = document.getElementById("loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let loginVal = document.getElementById("loginInput").value.trim();
      let senhaVal = document.getElementById("passwordInput").value;

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      let usuario = usuarios.find(
        (u) =>
          (u.email === loginVal || u.nomeUsuario === loginVal) &&
          u.senha === senhaVal
      );

      if (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        window.location.href = "index.html";
      } else {
        erroLogin.textContent =
          "Email ou nome de usuário e/ou senha incorretos.";
      }

      console.log("Usuário encontrado:", usuario);
      console.log("Redirecionando para index.html");
    });
  }

  //usuarios.js
  let usuarioTeste = {
    nomeUsuario: "sofia",
    email: "sofia@teste.com",
    senha: "123",
  };

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (!usuarios.some((u) => u.email === usuarioTeste.email)) {
    usuarios.push(usuarioTeste);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuário de teste criado!");
  } else {
    console.log("Usuário de teste já existe.");
  }

  //cadastro novos usuarios
  let cadastroForm = document.getElementById("cadastroForm");
  let erroCadastro = document.getElementById("cadastroError");
  let sucessoCadastro = document.getElementById("cadastroSucesso");

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let nomeUsuario = document.getElementById("cadastroUsuario").value.trim();
      let email = document.getElementById("cadastroEmail").value.trim();
      let senha = document.getElementById("cadastroSenha").value;

      if (!nomeUsuario || !email || !senha) {
        erroCadastro.textContent = "Todos os campos são obrigatórios.";
        sucessoCadastro.textContent = "";
        return;
      }

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      let existe = usuarios.some(
        (u) => u.email === email || u.nomeUsuario === nomeUsuario
      );

      if (existe) {
        erroCadastro.textContent = "Email ou nome de usuário já cadastrado.";
        sucessoCadastro.textContent = "";
        return;
      }

      let novoUsuario = { nomeUsuario, email, senha };
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      erroCadastro.textContent = "";
      sucessoCadastro.textContent = "Usuário cadastrado com sucesso!";
      cadastroForm.reset();

      console.log("Novo usuário cadastrado:", novoUsuario);
    });
  }

  //modal editar usuario
  let abrir = document.getElementById("abrirModal");
  let modal = document.getElementById("meuModal");
  let fechar = document.querySelector(".fechar");
  let fotoInput = document.getElementById("fotoInput");
  let fotoPreview = document.getElementById("fotoPreview");
  let nomeUsuarioModal = document.getElementById("nomeUsuarioModal");
  let editarUsuarioForm = document.getElementById("editarUsuarioForm");
  let emailEditar = document.getElementById("emailEditar");
  let senhaEditar = document.getElementById("senhaEditar");

  function carregarDadosUsuario() {
    let usuarioLogadoStr = localStorage.getItem("usuarioLogado");
    if (!usuarioLogadoStr) return;

    let usuarioLogado = JSON.parse(usuarioLogadoStr);

    nomeUsuarioModal.textContent = usuarioLogado.nomeUsuario || "Usuário";
    emailEditar.value = usuarioLogado.email || "";
    senhaEditar.value = usuarioLogado.senha || "";

    // carrega foto q ta no localStorage
    if (usuarioLogado.fotoBase64) {
      fotoPreview.src = usuarioLogado.fotoBase64;
    } else {
      fotoPreview.src = "../imagens/imagem-padrao.webp"; //sem foto carrega essa
    }
  }

  abrir.onclick = function (e) {
    e.preventDefault();
    carregarDadosUsuario();
    modal.style.display = "block";
  };

  fechar.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  fotoInput.addEventListener("change", function () {
    let file = this.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        fotoPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  editarUsuarioForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let usuarioLogadoStr = localStorage.getItem("usuarioLogado");
    if (!usuarioLogadoStr) return alert("Nenhum usuário logado.");

    let usuarioLogado = JSON.parse(usuarioLogadoStr);
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Atualiza os dados do usuario logado
    usuarioLogado.email = emailEditar.value.trim();
    usuarioLogado.senha = senhaEditar.value;

    // Atualiza foto se mudou
    if (fotoPreview.src && fotoPreview.src.startsWith("data:image")) {
      usuarioLogado.fotoBase64 = fotoPreview.src;
    }

    // Atualiza o array de usuarios no localStorage
    let indexUsuario = usuarios.findIndex(
      (u) => u.nomeUsuario === usuarioLogado.nomeUsuario
    );
    if (indexUsuario !== -1) {
      usuarios[indexUsuario] = usuarioLogado;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      alert("Dados atualizados com sucesso!");
      modal.style.display = "none";
    } else {
      alert("Erro ao atualizar usuário.");
    }
  });

  let explorarBtn = document.getElementById("testeBotao");
  
  let spoilerAtivado = false;

  let listaComentarios = document.querySelector("#comentariosGrupo ul");

  if (explorarBtn) {
    explorarBtn.addEventListener("click", () => {

      document.querySelector("main .hero").style.display = "none";
      document.querySelector("#grupos").style.display = "none";
      document.querySelector("#leitura").style.display = "none";
      document.querySelector("#sobre").style.display = "none";


      window.location.href = "grupo.html";
      
      carregarComentarios();
    });
  }


let books = {
  "O Alquimista": {
    titulo: "O Alquimista",
    autor: "Paulo Coelho", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "O Jogador": {
    titulo: "O Jogador",
    autor: "Fiódor Dostoiévski", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "O Lobo Das Estepes": {
    titulo: "O Lobo Das Estepes",
    autor: "Hermann Hesse", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "Memórias Póstumas de Brás Cubas": {
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "Harry Potter": {
    titulo: "Harry Potter e a Pedra Filosofal",
    autor: "J.K. Rowling", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "1984": {
    titulo: "1984",
    autor: "George Orwell", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "Duna": {
    titulo: "Duna",
    autor: "Frank Herbert", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "O Pequeno Príncipe": {
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "A Sombra do Vento": {
    titulo: "A Sombra do Vento",
    autor: "Carlos Ruiz Zafón", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "O Velho e o Mar": {
    titulo: "O Velho e o Mar",
    autor: "Ernest Hemingway", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  },
  "O Talismã": {
    titulo: "O Talismã",
    autor: "Stephen King e Peter Straub", 
    pdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=1peoVqJMDI9KK92tw5en-vvkO-Xxp1uxC&export=download"
  }
}

localStorage.setItem("livrosEstante", JSON.stringify(books));

let iframe = document.getElementById("iframePDF");


window.entrarGrupo = function(nomeGrupo) {
  nomeGrupoAtual = nomeGrupo; // guarda o grupo selecionado

  document.getElementById("juliaCasoUso").style.display = "block";
  document.getElementById("tituloGrupo").textContent = "Grupo: " + nomeGrupo;
  document.getElementById("nomeLivro").textContent = nomeGrupo;
  document.getElementById("tituloPDF").textContent = nomeGrupo;

  let livrosEst = JSON.parse(localStorage.getItem("livrosEstante")) || {};
  let livroSelecionado = livrosEst[nomeGrupo];

  if(livroSelecionado && livroSelecionado.pdf){
    iframe.src = livroSelecionado.pdf;
    document.getElementById("tituloPDF").innerText = livroSelecionado.titulo;
  } else{
    iframe.src = "";
    document.getElementById("tituloPDF").innerText = "Livro nao encontrado";
    alert("Livro nao encontrado na estante");
  }

  // Força seleção do Capítulo 1 ao entrar
  capituloSelecionado = 1;
  document.getElementById("capituloSelect").value = 1;

  // Mensagem fixa no Capítulo 1
  let chave = `forumCapitulo_${nomeGrupoAtual}_cap1`;
  let mensagensExistentes = JSON.parse(localStorage.getItem(chave)) || [];

  let jaTemMensagemDaVitoria = mensagensExistentes.some(
    (msg) => msg.autor === "Vitoria" && msg.texto.includes("Ótimo começo de livro")
  );

  if (!jaTemMensagemDaVitoria) {
    mensagensExistentes.push({
      autor: "Vitoria",
      texto: "Ótimo começo de livro, logo no primeiro capitulo já te prende na historia"
    });
    localStorage.setItem(chave, JSON.stringify(mensagensExistentes));
  }

  // Carrega as mensagens do Capítulo 1
  carregarMensagensCapitulo();


  let comentarioTextarea = document.querySelector("#forumGrupo textarea");
  let enviarComentarioBtn = document.querySelector("#forumGrupo button");

  // Remover event listener anterior para evitar duplicação
  enviarComentarioBtn.replaceWith(enviarComentarioBtn.cloneNode(true));
  enviarComentarioBtn = document.querySelector("#forumGrupo button");

  enviarComentarioBtn.addEventListener("click", () => {
    let texto = comentarioTextarea.value.trim();
    if (texto === "") return;

    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let autorComentario = usuarioLogado ? usuarioLogado.nomeUsuario : "Anônimo";

    let novoComentario = {
      autor: autorComentario,
      texto: texto,
    };

    let chaveComentarios = "comentarios" + nomeGrupo.replace(/\s+/g, "");
    let comentarios = JSON.parse(localStorage.getItem(chaveComentarios) || "[]");

    comentarios.push(novoComentario);
    localStorage.setItem(chaveComentarios, JSON.stringify(comentarios));
    comentarioTextarea.value = "";
    carregarComentarios();
  });

  carregarComentarios();

  capituloSelecionado = parseInt(document.getElementById("capituloSelect").value);
  carregarMensagensCapitulo();
};

document.getElementById("spoilerToggle")?.addEventListener("click", toggleSpoiler);

function toggleSpoiler(){
  spoilerAtivado = !spoilerAtivado;
  let btn = document.getElementById("spoilerToggle");
  btn.textContent = spoilerAtivado ? "🔒 Spoiler: Ativado" : "🔒 Spoiler: Desativado";
  carregarComentarios();
}

function carregarComentarios() {
  if (!nomeGrupoAtual) return;

  let chaveComentarios = "comentarios" + nomeGrupoAtual.replace(/\s+/g, "");
  let comentarios = JSON.parse(localStorage.getItem(chaveComentarios) || "[]");
  listaComentarios.innerHTML = "";

  if (spoilerAtivado) {
    let aviso = document.createElement("li");
    aviso.textContent = "🛑 Comentários ocultos devido ao modo spoiler ativado.";
    aviso.style.fontStyle = "italic";
    aviso.style.color = "gray";
    listaComentarios.appendChild(aviso);
    return;
  }

  comentarios.forEach((com) => {
    let li = document.createElement("li");
    li.innerHTML = `<strong>${com.autor}:</strong> ${com.texto}`;
    listaComentarios.appendChild(li);
  });
}

  let dados = JSON.parse(localStorage.getItem("grupoDados"));

  if (dados) {
    document.getElementById("tituloGrupo").innerText = `Grupo: ${dados.nomeGrupo}`;
    document.getElementById("nomeLivro").innerText = dados.nomeLivro;

    let genero = document.getElementById("generoLivro").querySelector("h4");
    genero.innerText = `Gênero: ${dados.genero}`;

    let descricao = document.getElementById("descricaoLivro").querySelector("h4");
    descricao.innerText = `Descrição: ${dados.descricao}`;

    let tituloPDF = document.getElementById("tituloPDF");
    tituloPDF.innerText = dados.nomeLivro;

    let iframe = document.getElementById("iframePDF");
    iframe.src = "../pdfs/" + dados.nomeLivro + ".pdf"; // ajuste conforme sua estrutura

    // Mostra a seção do grupo
    document.getElementById("juliaCasoUso").style.display = "block";
  }
});

function mostrarCategoria(categoria) {
  let estante = JSON.parse(localStorage.getItem("estanteLivros")) || {};
  let todosLivros = document.querySelectorAll('#quero-ler .card-livro, #lendo .card-livro, #lidos .card-livro, .categoria-livros .card-livro');

  todosLivros.forEach((livro) => {
    let livroId = livro.dataset.id;
    let categoriaLivro = estante[livroId] || "todos";

    if (categoriaLivro === categoria) {
      livro.style.display = "flex";
    } else {
      livro.style.display = "none";
    }
  });

}

function mostrarTodos() {
  let todosLivros = document.querySelectorAll('.card-livro');
  todosLivros.forEach((livro) => livro.style.display = "flex");
}

let modoEdicao = false;

let btnEditarEstante = document.getElementById("editarEstanteBtn");

if(btnEditarEstante) {
  btnEditarEstante.addEventListener("click", () => {
    modoEdicao = !modoEdicao;

    let livros = document.querySelectorAll(".card-livro");
    let btn = document.getElementById("editarEstanteBtn");

    livros.forEach((livro) => {
      let overlay = livro.querySelector(".overlay-sinopse");

      // Ativar modo edição
      if (modoEdicao) {
        if (overlay) overlay.style.pointerEvents = "none"; // impede hover
        livro.classList.add("modo-edicao");

        // Evita duplicar select
        if (!livro.querySelector(".categoriaSelect")) {
          let select = document.createElement("select");
          select.className = "categoriaSelect";
          select.innerHTML = `
            <option value="todos">Todos</option>
            <option value="quero-ler">Quero Ler</option>
            <option value="lendo">Lendo</option>
            <option value="lidos">Lidos</option>
          `;

          // Carrega categoria salva
          let estante = JSON.parse(localStorage.getItem("estanteLivros")) || {};
          let livroId = livro.dataset.id;
          if (estante[livroId]) select.value = estante[livroId];

          select.addEventListener("change", () => {
            let novaCategoria = select.value;
            estante[livroId] = novaCategoria;
            localStorage.setItem("estanteLivros", JSON.stringify(estante));
          });

          livro.appendChild(select);
        }
      } else {
        // Salvar estante
        if (overlay) overlay.style.pointerEvents = "auto";
        livro.classList.remove("modo-edicao");

        let select = livro.querySelector(".categoriaSelect");
        if (select) select.remove();

      }
    });

    btn.textContent = modoEdicao ? "Salvar Estante" : "Editar Estante";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let livroSelect = document.getElementById("livroSelecionado");
  let form = document.getElementById("form");

  // Carrega livros do localStorage
  let livrosEstante = JSON.parse(localStorage.getItem("livrosEstante")) || {};

  // Preenche o select com os livros
  for (let id in livrosEstante) {
    let opt = document.createElement("option");
    opt.value = id;
      if(livrosEstante[id].titulo != "Duna" && livrosEstante[id].titulo != "1984" && livrosEstante[id].titulo != "Harry Potter e a Pedra Filosofal"){
        opt.textContent = livrosEstante[id].titulo + " — " + livrosEstante[id].autor;
        livroSelect.appendChild(opt);
      }
  }

  // Submete o formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let grupoNome = document.getElementById("nomeGrupo").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let genero = document.getElementById("genero").value;
    let visibilidade = document.getElementById("visibilidade").value;
    let livroId = livroSelect.value;

    if (!grupoNome || !livroId || !descricao || !genero || !visibilidade) {
      alert("Preencha todos os campos!");
      return;
    }

    let livroSelecionado = livrosEstante[livroId];

    let grupo = {
      nomeGrupo: grupoNome,
      nomeLivro: livroSelecionado.titulo,
      autor: livroSelecionado.autor,
      pdf: livroSelecionado.pdf,
      descricao,
      genero,
      visibilidade
    };

    let grupos = JSON.parse(localStorage.getItem("gruposCriados")) || [];
    grupos.push(grupo);
    localStorage.setItem("gruposCriados", JSON.stringify(grupos));

    alert("Grupo criado com sucesso!");
    form.reset();
    window.location.href = "grupo.html";
  });
});

document.getElementById("botaoForumToggle").addEventListener("click", () => {
  let aside = document.getElementById("forumCapitulos");
  aside.classList.toggle("ativo");
});

// Preencher o select de capítulos
let capituloSelect = document.getElementById("capituloSelect");
for (let i = 1; i <= 20; i++) {
  let opt = document.createElement("option");
  opt.value = i;
  opt.textContent = "Capítulo " + i;
  capituloSelect.appendChild(opt);
}

// Atualiza capítulo selecionado
capituloSelect.addEventListener("change", () => {
  capituloSelecionado = parseInt(capituloSelect.value);
  carregarMensagensCapitulo();
});

// Enviar nova mensagem
document.getElementById("enviarMensagemCapitulo").addEventListener("click", () => {
  let texto = document.getElementById("mensagemCapitulo").value.trim();

  console.log("Clicado. Texto:", texto);
  console.log("Capítulo selecionado:", capituloSelecionado);
  console.log("Grupo atual:", nomeGrupoAtual);

  if (!texto || !capituloSelecionado || !nomeGrupoAtual) {
    alert("Preencha todos os campos antes de enviar a mensagem.");
    return;
  }

  let usuario = JSON.parse(localStorage.getItem("usuarioLogado"))?.nomeUsuario || "Anônimo";
  let chave = `forumCapitulo_${nomeGrupoAtual}_cap${capituloSelecionado}`;
  let mensagens = JSON.parse(localStorage.getItem(chave)) || [];

  mensagens.push({ autor: usuario, texto });
  localStorage.setItem(chave, JSON.stringify(mensagens));

  document.getElementById("mensagemCapitulo").value = "";
  carregarMensagensCapitulo();
});


// Carrega mensagens do capítulo atual
function carregarMensagensCapitulo() {
  if (!capituloSelecionado || !nomeGrupoAtual) return;

  let chave = `forumCapitulo_${nomeGrupoAtual}_cap${capituloSelecionado}`;
  let mensagens = JSON.parse(localStorage.getItem(chave)) || [];

  let ul = document.querySelector("#mensagensCapitulo ul");
  ul.innerHTML = "";

  mensagens.forEach(msg => {
    let li = document.createElement("li");
    li.innerHTML = `<strong>${msg.autor}:</strong> ${msg.texto}`;
    ul.appendChild(li);
  });
}

