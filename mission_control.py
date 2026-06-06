# ==================================================
# MISSION CONTROL AI
# Equipe: Horizon
# ==================================================

NOME_MISSAO = "Orion Sentinel"
NOME_EQUIPE = "Horizon"

areas_monitoradas = [
    "Temperatura",
    "Comunicação",
    "Energia",
    "Oxigênio",
    "Estabilidade"
]

dados_missao = [
    [22, 95, 92, 98, 96],
    [25, 89, 85, 95, 91],
    [29, 76, 72, 93, 84],
    [33, 61, 57, 89, 73],
    [37, 45, 41, 84, 58],
    [35, 52, 48, 86, 63]
]


# ==================================================
# FUNÇÕES DE ANÁLISE
# ==================================================

def calcular_risco(ciclo):
    temperatura, comunicacao, energia, oxigenio, estabilidade = ciclo

    risco = 0

    if temperatura > 35:
        risco += 2
    elif temperatura > 30:
        risco += 1

    if comunicacao < 50:
        risco += 2
    elif comunicacao < 70:
        risco += 1

    if energia < 50:
        risco += 2
    elif energia < 70:
        risco += 1

    if oxigenio < 85:
        risco += 2
    elif oxigenio < 90:
        risco += 1

    if estabilidade < 60:
        risco += 2
    elif estabilidade < 80:
        risco += 1

    return risco


def classificar_ciclo(risco):
    if risco >= 7:
        return "MISSÃO CRÍTICA"
    elif risco >= 4:
        return "MISSÃO EM ATENÇÃO"
    else:
        return "MISSÃO ESTÁVEL"


def gerar_alertas(ciclo):
    temperatura, comunicacao, energia, oxigenio, estabilidade = ciclo

    alertas = []

    if temperatura > 35:
        alertas.append("Temperatura elevada")

    if comunicacao < 50:
        alertas.append("Falha de comunicação")

    if energia < 50:
        alertas.append("Energia crítica")

    if oxigenio < 85:
        alertas.append("Baixo nível de oxigênio")

    if estabilidade < 60:
        alertas.append("Instabilidade operacional")

    return alertas


def analisar_tendencia(lista_riscos):
    if lista_riscos[-1] > lista_riscos[0]:
        return "PIORANDO"

    if lista_riscos[-1] < lista_riscos[0]:
        return "MELHORANDO"

    return "ESTÁVEL"


def identificar_area_mais_afetada():
    problemas = [0, 0, 0, 0, 0]

    for ciclo in dados_missao:
        temperatura, comunicacao, energia, oxigenio, estabilidade = ciclo

        if temperatura > 30:
            problemas[0] += 1

        if comunicacao < 70:
            problemas[1] += 1

        if energia < 70:
            problemas[2] += 1

        if oxigenio < 90:
            problemas[3] += 1

        if estabilidade < 80:
            problemas[4] += 1

    indice = problemas.index(max(problemas))

    return areas_monitoradas[indice]


def calcular_medias():
    medias = []

    for coluna in range(len(areas_monitoradas)):
        soma = 0

        for ciclo in dados_missao:
            soma += ciclo[coluna]

        medias.append(round(soma / len(dados_missao), 2))

    return medias


# ==================================================
# RELATÓRIO PRINCIPAL
# ==================================================

def gerar_relatorio():
    print("=" * 60)
    print("MISSION CONTROL AI")
    print(f"Missão: {NOME_MISSAO}")
    print(f"Equipe: {NOME_EQUIPE}")
    print("=" * 60)

    riscos = []

    for numero_ciclo, ciclo in enumerate(dados_missao, start=1):

        risco = calcular_risco(ciclo)
        riscos.append(risco)

        status = classificar_ciclo(risco)
        alertas = gerar_alertas(ciclo)

        print(f"\nCICLO {numero_ciclo}")
        print(f"Dados: {ciclo}")
        print(f"Risco: {risco}")
        print(f"Status: {status}")

        if alertas:
            print("Alertas:")
            for alerta in alertas:
                print(f" - {alerta}")
        else:
            print("Nenhum alerta.")

    print("\n" + "=" * 60)
    print("RESUMO DA MISSÃO")
    print("=" * 60)

    medias = calcular_medias()

    for area, media in zip(areas_monitoradas, medias):
        print(f"{area}: {media}")

    print(f"\nTendência da missão: {analisar_tendencia(riscos)}")
    print(f"Área mais afetada: {identificar_area_mais_afetada()}")

    print("\nFim do relatório.")


# ==================================================
# EXECUÇÃO
# ==================================================

gerar_relatorio()
