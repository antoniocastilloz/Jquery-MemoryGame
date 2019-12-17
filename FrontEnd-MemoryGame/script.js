var imagens = ['img/facebook.png', 'img/android.png', 'img/chrome.png', 'img/firefox.png', 'img/html5.png', 'img/googleplus.png', 'img/twitter.png', 'img/windows.png'];

var imagensDuplicadas = imagens.concat(imagens);

var tempoInicial = []
var idCartas = []
var pontosJogo = 0
var numeroClicksBotaoIniciarReiniciar = 0

embaralharImagens(imagensDuplicadas);
renderizarCartas()

$("#botaoIniciarReiniciarJogo").click(function () {
    numeroClicksBotaoIniciarReiniciar++
    tempoInicial = pegarTempoAtual();
    idCartas = []

    if (numeroClicksBotaoIniciarReiniciar >= 2) {
        desvirarCartas()
    }
    reiniciarVisualizacaoCartas()
    $('#botaoIniciarReiniciarJogo').addClass('disabled');
    alteraNomeBotaoIniciarReiniciarJogo();
    embaralharImagens(imagensDuplicadas);
    alterarImagemCarta()
    virarTodasCartas()
    if (numeroClicksBotaoIniciarReiniciar < 2) {
        jogo()
    }
});

function embaralharImagens(imagens) {
    imagens.sort(() => Math.random() - 0.5)
}

function desvirarCartas() {
    if ($("div[name='carta']").hasClass("virarPositivo")) {
        $("div[name='carta']").removeClass("virarPositivo")
        $("img[name='frente']").removeClass("virarNegativo").addClass("hide")
        $("img[name='verso']").removeClass("hide")
    }
}

function alteraNomeBotaoIniciarReiniciarJogo() {
    if (document.getElementById("botaoIniciarReiniciarJogo").textContent === "Iniciar") {
        document.getElementById("botaoIniciarReiniciarJogo").innerHTML = "Reiniciar";
    }
}

function pegarTempoAtual() {
    let dataAtual = new Date();
    let minutos = dataAtual.getMinutes();
    let segundos = dataAtual.getSeconds();
    return [minutos, segundos];
}

function renderizarCartas() {
    criarCartas(imagensDuplicadas.length);
    adicionarImagemCarta();
    adicionarVersoCarta();
}

function criarCartas(quantidadeCartas) {
    for (var i = 0; i < quantidadeCartas; i++) {
        $("#tabuleiro").append('<div id="carta' + Number(i + 1) + '" name="carta" class="col s3"></div>');
    }
}

function adicionarImagemCarta() {
    $("div.col.s3").append('<img name="frente" class="responsive-img valign-wrapper z-depth-2">')
    alterarImagemCarta()
}

function adicionarVersoCarta() {
    $("div.col.s3").append('<img name="verso" class="responsive-img valign-wrapper z-depth-2 hide" src="img/cross.png">')
}

function alterarImagemCarta() {
    $("img[name='frente']").each(function (i) {
        imagensDuplicadas[i] && this.setAttribute('src', imagensDuplicadas[i]);
    });
}

function virarTodasCartas() {
    $(".col.s3").addClass("virarPositivo")
    $("img[name='frente']").addClass("virarNegativo")
    setTimeout(function () {
        $(".col.s3.virarPositivo").removeClass("virarPositivo")
        $("img[name='frente']").removeClass("virarNegativo")
        $('#botaoIniciarReiniciarJogo').removeClass('disabled');
        exibirTodoVersos()
    }, 3500)
}

function exibirTodoVersos() {
    $("img[name='verso']").removeClass("hide")
    $("img[name='frente']").addClass("hide")
}

function reiniciarVisualizacaoCartas() {
    if ($("img[name='frente']").hasClass("hide") == true) {
        $("img[name='frente']").removeClass("hide")
    }
    if ($("img[name='verso']").hasClass("hide") == false) {
        $("img[name='verso']").addClass("hide")
    }
}

function jogo() {
    $("div[name='carta']").click(function () {
        $(this).addClass("virarPositivo")
        $(this).find($("img[name='frente']")).removeClass("hide")
        $(this).find($("img[name='frente']")).addClass("virarNegativo")
        $(this).find($("img[name='verso']")).addClass("hide")

        idCartas.push($(this).attr('id'))

        compararCartas()
        verificarVitoria()
    });
}

function compararCartas() {
    if (idCartas.length == 2) {
        if (idCartas[0] != idCartas[1]) {
            if ($("#" + idCartas[0]).find($("img[name='frente']")).attr('src') == $("#" + idCartas[1]).find($("img[name='frente']")).attr('src')) {
                idCartas = []
                pontosJogo++
            } else {
                $("div[name='carta']").addClass("click-off")
                setTimeout(function () {
                    $("#" + idCartas[0] + "," + "#" + idCartas[1]).removeClass("virarPositivo")
                    $("#" + idCartas[0] + "," + "#" + idCartas[1]).find($("img[name='frente']")).removeClass("virarNegativo")
                    $("#" + idCartas[0] + "," + "#" + idCartas[1]).find($("img[name='frente']")).addClass("hide")
                    $("#" + idCartas[0] + "," + "#" + idCartas[1]).find($("img[name='verso']")).removeClass("hide")
                    $("div[name='carta']").removeClass("click-off")
                    idCartas = []
                }, 1500)
            }
        } else {
            idCartas.pop();
        }
    } else if (idCartas.length == 3) {
        idCartas.pop();
    }
}

function verificarVitoria() {
    if (pontosJogo == 8) {
        var tempoFinal = pegarTempoAtual();
        var recordVitoria = []

        converterCalcularDiferencaTempo(tempoFinal, recordVitoria)

        var recordVitoriaString = recordVitoria[0] + ":" + recordVitoria[1]

        salvarRecordLocalmente(recordVitoria)

        exibirAlertVitoria(recordVitoriaString)
        pontosJogo = 0
    }
}

function exibirAlertVitoria(recordVitoriaString) {
    setTimeout(function () {
        alert("Parabéns você ganhou!\nTempo: " + recordVitoriaString)
    }, 500)
}

function converterCalcularDiferencaTempo(tempoFinal, recordVitoria) {
    if (Math.sign(tempoFinal[1] - tempoInicial[1]) == -1) {
        recordVitoria.push((tempoFinal[0] - tempoInicial[0]) - 1)
        recordVitoria.push(Math.abs((tempoFinal[1] + 60) - tempoInicial[1]))
    } else {
        recordVitoria.push(tempoFinal[0] - tempoInicial[0])
        recordVitoria.push(tempoFinal[1] - tempoInicial[1])
    }
}

function salvarRecordLocalmente(recordVitoria) {
    if (localStorage.getItem("recordMinuto") && localStorage.getItem("recordSegundo") === null) {
        localStorage.setItem("recordMinuto", recordVitoria[0].toString())
        localStorage.setItem("recordSegundo", recordVitoria[1].toString())
    } else if (localStorage.getItem('recordMinuto') >= recordVitoria[0] && localStorage.getItem('recordSegundo') >= recordVitoria[1]) {
        localStorage.setItem("recordMinuto", recordVitoria[0].toString())
        localStorage.setItem("recordSegundo", recordVitoria[1].toString())
    }
}