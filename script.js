let formComplete = false;
const inputQuestion = document.getElementById("inputQuestion"); //TextArea de Baixo ou Area da pergunta
const result = document.getElementById("result"); //TextArea de Cima ou Area dos Resultados
const unlockButton = document.getElementById("unlock-button");
const usernameInput = document.getElementById("username");
const botnameInput = document.getElementById("botname");
const speechButton = document.getElementById("btn-mic");

inputQuestion.disabled = true;

usernameInput.addEventListener("input", validateForm);
botnameInput.addEventListener("input", validateForm);

function validateForm() {
  const usernameValue = usernameInput.value.trim();
  const botnameValue = botnameInput.value.trim();

  if (usernameValue !== "" && botnameValue !== "") {
    formComplete = true;
  } else {
    formComplete = false;
  }
}
unlockButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (formComplete) {
    inputQuestion.disabled = false;
    document.getElementById("login-form").style.display = "none";
  }
});

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
}); // Função verificar valor e tecla selecinada(Enter) e por fim chamar função

const OPENAI_API_KEY = "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";

speechButton.addEventListener("click", () => {
  const recognition = new window.webkitSpeechRecognition(); // criar uma instância do reconhecimento de fala
  recognition.lang = "pt-BR"; // definir o idioma para Português do Brasil
  recognition.start(); // iniciar o reconhecimento de fala

  recognition.onresult = (event) => {
    const resulte = event.results[0][0].transcript; // obter o resultado da fala reconhecida
    inputQuestion.value = resulte; // preencher a pergunta com o resultado
    SendQuestion(); // chamar a função SendQuestion para enviar a pergunta
  };

  recognition.onerror = (event) => {
    console.error("Error:", event.error);
  };
});
// Desativar botão de limpar a tela enquanto o formulário não estiver completo
const eraseButton = document.getElementById("erase-button");
eraseButton.disabled = !formComplete;
//Funçao limpar tela de resultados
function eraseText() {
  window.speechSynthesis.cancel(); // cancela a fala
  document.getElementById("result").value = "";
}

// Função Enviar Perguntar
function SendQuestion() {
  if (!formComplete) {
    return; // Bloquear o envio se o formulário não estiver completo
  }
  var sQuestion = inputQuestion.value;

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: sQuestion,
      max_tokens: 2048, // tamanho da resposta
      temperature: 0.5, // criatividade na resposta
    }),
  })
  .then((response) => response.json())
  .then((json) => {
    if (result.value) result.value += "\n";

    if (json.error?.message) {
      result.value += `${botname.value}: Error: ${json.error.message}`;
    } else if (json.choices?.[0].text) {
      var text = json.choices[0].text || "Sem resposta";
  
      result.value += `${botname.value}: ${text}`;
      readResult(text); // Chama a função readResult para ler o resultado em voz alta
   }
    result.scrollTop = result.scrollHeight;
  })
  .catch((error) => console.error("Error:", error))
  .finally(() => {
    inputQuestion.value = "";
    inputQuestion.disabled = false;
    inputQuestion.focus();
  });

if (result.value) result.value += "\n\n\n";

result.value += `${username.value}: ${sQuestion}`;
inputQuestion.value = "Carregando...";
inputQuestion.disabled= true;

result.scrollTop = result.scrollHeight;
}

// Função de ler o resultado em voz alta
function readResult(text) {
const msg = new SpeechSynthesisUtterance();
msg.text = text;
msg.volume = 1;
msg.rate = 1;
msg.pitch = 1;
window.speechSynthesis.speak(msg);
}
