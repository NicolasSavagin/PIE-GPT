const inputQuestion = document.getElementById("inputQuestion"); //TextArea de Baixo ou Area da pergunta
const result = document.getElementById("result"); //TextArea de Cima ou Area dos Resultados

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
}); // Função verificar valor e tecla selecinada(Enter) e por fim chamar função

const OPENAI_API_KEY = "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";

//Funçao limpar tela de resultados
function eraseText() {
  document.getElementById("result").value = "";
}

// Função Enviar Perguntar
function SendQuestion() {
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
        result.value += `Error: ${json.error.message}`;
      } else if (json.choices?.[0].text) {
        var text = json.choices[0].text || "Sem resposta";

        result.value += "Chat GPT: " + text;
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

  result.value += `Eu: ${sQuestion}`;
  inputQuestion.value = "Carregando...";
  inputQuestion.disabled = true;

  result.scrollTop = result.scrollHeight;
}
