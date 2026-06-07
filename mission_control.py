# ==================================================
# MISSION CONTROL AI
# Equipe Horizon
# ==================================================

MISSION_NAME = "Orion Sentinel"
TEAM_NAME = "Horizon"

# --------------------------------------------------
# CONTEXTO ENERGÉTICO DA MISSÃO
# O sistema de energia do módulo é alimentado por painéis solares fotovoltaicos.
# A bateria armazena a energia captada e a distribui para os subsistemas.
# Monitorar eficiência energética é essencial para a sustentabilidade da missão.
# --------------------------------------------------

MAX_POWER_W = 500           # Potência máxima dos painéis solares (W)
SYSTEM_VOLTAGE_V = 28       # Tensão nominal do sistema elétrico do módulo (V)
BATTERY_CAPACITY_WH = 2000  # Capacidade total da bateria (Wh)

# Ordem obrigatória: [temperatura, comunicação, bateria, oxigênio, estabilidade]
monitored_areas = [
    "Temperatura interna",
    "Comunicação com a base",
    "Sistema de energia",
    "Suporte de oxigênio",
    "Estabilidade operacional"
]

mission_data = [
    [22, 95, 92, 98, 96],   # Ciclo 1 - início da missão
    [25, 89, 85, 95, 91],   # Ciclo 2 - estabilização dos sistemas
    [29, 76, 72, 93, 84],   # Ciclo 3 - queda parcial de comunicação
    [33, 61, 57, 89, 73],   # Ciclo 4 - alerta de energia
    [37, 45, 41, 84, 58],   # Ciclo 5 - risco operacional
    [35, 52, 48, 86, 63]    # Ciclo 6 - tentativa de recuperação
]


# --------------------------------------------------
# FUNÇÕES DE ANÁLISE ENERGÉTICA SUSTENTÁVEL
# --------------------------------------------------

def calculate_stored_energy(battery_level_pct):
    """
    Calcula a energia armazenada na bateria em Wh.
    Aplica conceito de energia: E = capacidade × (nível / 100)
    """
    return round(BATTERY_CAPACITY_WH * (battery_level_pct / 100), 2)


def calculate_generated_power(battery_level_pct):
    """
    Estima a potência gerada pelos painéis solares com base no nível da bateria.
    Quanto mais carregada a bateria, maior a geração fotovoltaica estimada.
    Aplica conceito de potência: P = P_max × eficiência estimada
    """
    eficiencia = battery_level_pct / 100
    return round(MAX_POWER_W * eficiencia, 2)


def calculate_current(power_w):
    """
    Calcula a corrente elétrica do sistema.
    Aplica Lei de Ohm: I = P / V
    """
    return round(power_w / SYSTEM_VOLTAGE_V, 2)


def classify_energy_sustainability(battery_level_pct):
    """
    Classifica o nível de sustentabilidade energética da missão no ciclo.
    Retorna (classificação, descrição).
    """
    if battery_level_pct >= 70:
        return "SUSTENTÁVEL", "Geração solar suficiente para todos os subsistemas"
    elif battery_level_pct >= 40:
        return "ATENÇÃO ENERGÉTICA", "Geração solar abaixo do ideal — reduzir consumo não essencial"
    else:
        return "CRÍTICO ENERGÉTICO", "Risco de colapso do sistema de energia renovável"


def generate_energy_report():
    """
    Exibe um painel de análise energética sustentável da missão,
    com base nos conceitos de energia, potência e eficiência fotovoltaica.
    """
    print("\n" + "=" * 60)
    print("PAINEL DE ENERGIA RENOVÁVEL")
    print("Sistema: Painéis Solares Fotovoltaicos + Bateria de Íon-Lítio")
    print("=" * 60)

    total_consumed_energy = 0

    for cycle_number, cycle in enumerate(mission_data, start=1):
        battery_level = cycle[2]

        energy_wh   = calculate_stored_energy(battery_level)
        power_w   = calculate_generated_power(battery_level)
        current_a   = calculate_current(power_w)
        sust, desc   = classify_energy_sustainability(battery_level)

        total_consumed_energy += (BATTERY_CAPACITY_WH - energy_wh)

        print(f"\n  Ciclo {cycle_number}")
        print(f"    Nível da bateria      : {battery_level}%")
        print(f"    Energia armazenada    : {energy_wh} Wh  (E = C × nível%)")
        print(f"    Potência gerada (est.): {power_w} W   (P = P_max × η)")
        print(f"    Corrente do sistema   : {current_a} A   (I = P / V)")
        print(f"    Status energético     : {sust}")
        print(f"    {desc}")

    battery_average = round(
        sum(cycle[2] for cycle in mission_data) / len(mission_data), 2
    )
    average_efficiency = round(battery_average, 2)

    print("\n" + "-" * 60)
    print("  RESUMO ENERGÉTICO DA MISSÃO")
    print("-" * 60)
    print(f"  Nível médio de bateria        : {battery_average}%")
    print(f"  Eficiência fotovoltaica média : {average_efficiency}%")
    print(f"  Energia total consumida (est.): {round(total_consumed_energy, 2)} Wh")
    print(f"  Fonte de energia              : Solar fotovoltaica (renovável)")
    print(f"  Impacto ambiental             : Zero emissões de CO₂")

    if battery_average >= 70:
        print("\n  Conclusão energética: Missão operou com alta sustentabilidade.")
    elif battery_average >= 40:
        print("\n  Conclusão energética: Missão operou com sustentabilidade parcial.")
        print("  Recomenda-se otimizar o consumo dos subsistemas secundários.")
    else:
        print("\n  Conclusão energética: Missão operou em déficit energético.")
        print("  Revisar capacidade dos painéis e protocolo de economia de energia.")


# --------------------------------------------------
# FUNÇÕES DE ANÁLISE INDIVIDUAL
# --------------------------------------------------

def analyze_temperature(value):
    """Retorna (pontos, classificação, descrição) para a temperatura."""
    if value > 35:
        return 2, "CRÍTICO", "Risco de superaquecimento"
    elif value > 30:
        return 1, "ATENÇÃO", "Temperatura elevada"
    elif value < 18:
        return 1, "ATENÇÃO", "Temperatura abaixo do ideal"
    else:
        return 0, "NORMAL", "Temperatura estável"


def analyze_communication(value):
    """Retorna (pontos, classificação, descrição) para a comunicação."""
    if value < 30:
        return 2, "CRÍTICO", "Comunicação com a base em nível crítico"
    elif value < 60:
        return 1, "ATENÇÃO", "Comunicação instável"
    else:
        return 0, "NORMAL", "Comunicação estável"


def analyze_battery(value):
    """Retorna (pontos, classificação, descrição) para a bateria."""
    if value < 20:
        return 2, "CRÍTICO", "Bateria em nível crítico"
    elif value < 50:
        return 1, "ATENÇÃO", "Bateria abaixo do recomendado"
    else:
        return 0, "NORMAL", "Energia estável"


def analyze_oxygen(value):
    """Retorna (pontos, classificação, descrição) para o oxigênio."""
    if value < 80:
        return 2, "CRÍTICO", "Oxigênio em nível crítico"
    elif value < 90:
        return 1, "ATENÇÃO", "Oxigênio abaixo do ideal"
    else:
        return 0, "NORMAL", "Oxigênio adequado"


def analyze_stability(value):
    """Retorna (pontos, classificação, descrição) para a estabilidade."""
    if value < 40:
        return 2, "CRÍTICO", "Estabilidade operacional crítica"
    elif value < 70:
        return 1, "ATENÇÃO", "Estabilidade operacional reduzida"
    else:
        return 0, "NORMAL", "Estabilidade operacional adequada"


# --------------------------------------------------
# FUNÇÕES DE CÁLCULO E CLASSIFICAÇÃO
# --------------------------------------------------

def calculate_risk(cycle):
    """Calcula a pontuação de risco total de um ciclo."""
    temperature, communication, battery, oxygen, stability = cycle

    temp_points, _, _   = analyze_temperature(temperature)
    com_points,  _, _   = analyze_communication(communication)
    bat_points,  _, _   = analyze_battery(battery)
    oxy_points,  _, _   = analyze_oxygen(oxygen)
    stb_points,  _, _   = analyze_stability(stability)

    return temp_points + com_points + bat_points + oxy_points + stb_points


def classify_cycle(risk):
    """Classifica o ciclo com base na pontuação de risco."""
    if risk >= 6:
        return "MISSÃO CRÍTICA"
    elif risk >= 3:
        return "MISSÃO EM ATENÇÃO"
    else:
        return "MISSÃO ESTÁVEL"


def generate_recommendation(cycle):
    """Gera recomendação automática com base nos dados do ciclo."""
    temperature, communication, battery, oxygen, stability = cycle

    recommendations = []

    if temperature > 35:
        recommendations.append("verificar controle térmico da missão")
    if communication < 30:
        recommendations.append("tentar restabelecer contato com a base")
    if battery < 20:
        recommendations.append("ativar modo de economia de energia")
    if oxygen < 80:
        recommendations.append("acionar protocolo de suporte à vida")
    if stability < 40:
        recommendations.append("reduzir operações não essenciais")

    risco = calculate_risk(cycle)

    if risco >= 6:
        if recommendations:
            return "Ativar modo de segurança: " + ", ".join(recommendations) + "."
        return "Ativar modo de segurança e priorizar sistemas essenciais."
    elif risco >= 3:
        if recommendations:
            return "Monitoramento intensificado: " + ", ".join(recommendations) + "."
        return "Monitorar sistemas em atenção e preparar plano de contingência."
    else:
        return "Manter operação normal e continuar monitoramento."


# --------------------------------------------------
# FUNÇÕES DE ANÁLISE DA MISSÃO
# --------------------------------------------------

def calculate_averages():
    """Calcula a média de cada área ao longo de todos os ciclos."""
    averages = []

    for column in range(len(monitored_areas)):
        total = 0

        for cycle in mission_data:
            total += cycle[column]

        averages.append(round(total / len(mission_data), 2))

    return averages


def analyze_trend(risk_list):
    """Compara o risco do primeiro e último ciclo para indicar tendência."""
    if risk_list[-1] > risk_list[0]:
        return "A missão apresentou tendência de piora."
    elif risk_list[-1] < risk_list[0]:
        return "A missão apresentou tendência de melhora."
    else:
        return "A missão permaneceu estável em relação ao início."


def identify_most_affected_area():
    """
    Soma a pontuação de risco de cada área ao longo de todos os ciclos
    e retorna a(s) área(s) com maior pontuação acumulada.
    """
    analyzers = [
        analyze_temperature,
        analyze_communication,
        analyze_battery,
        analyze_oxygen,
        analyze_stability
    ]

    accumulated_score = [0, 0, 0, 0, 0]

    for cycle in mission_data:
        for index, analyze in enumerate(analyzers):
            points, _, _ = analyze(cycle[index])
            accumulated_score[index] += points

    highest = max(accumulated_score)

    areas = []

    for index, value in enumerate(accumulated_score):
        if value == highest:
            areas.append(monitored_areas[index])

    return areas, accumulated_score


def get_most_critical_cycle(risk_list):
    """Retorna o número e o risco do ciclo mais crítico."""
    highest_risk = max(risk_list)
    return risk_list.index(highest_risk) + 1, highest_risk


def count_critical_cycles(risk_list):
    """Conta quantos ciclos foram classificados como MISSÃO CRÍTICA."""
    total = 0

    for risk in risk_list:
        if risk >= 6:
            total += 1

    return total


# --------------------------------------------------
# GERAR RELATÓRIO
# --------------------------------------------------

def generate_report():
    risks = []

    print("=" * 60)
    print("MISSION CONTROL AI")
    print(f"Missão: {MISSION_NAME}")
    print(f"Equipe: {TEAM_NAME}")
    print(f"Quantidade de ciclos analisados: {len(mission_data)}")
    print("=" * 60)

    for cycle_number, cycle in enumerate(mission_data, start=1):
        temperature, communication, battery, oxygen, stability = cycle

        risk = calculate_risk(cycle)
        risks.append(risk)

        status       = classify_cycle(risk)
        recommendation = generate_recommendation(cycle)

        pt, ct, dt = analyze_temperature(temperature)
        pc, cc, dc = analyze_communication(communication)
        pb, cb, db = analyze_battery(battery)
        po, co, do_ = analyze_oxygen(oxygen)
        pe, ce, de_ = analyze_stability(stability)

        print(f"\nCICLO {cycle_number}")
        print("-" * 60)
        print(f"Temperatura : {temperature} °C  | {ct} | {dt}")
        print(f"Comunicação : {communication}%    | {cc} | {dc}")
        print(f"Bateria     : {battery}%    | {cb} | {db}")
        print(f"Oxigênio    : {oxygen}%    | {co} | {do_}")
        print(f"Estabilidade: {stability}%    | {ce} | {de_}")

        print(f"\nPontuação de risco do ciclo: {risk}")
        print(f"Classificação do ciclo: {status}")
        print(f"Recomendação: {recommendation}")

    # ---------- RELATÓRIO FINAL ----------
    averages                          = calculate_averages()
    critical_cycle, highest_risk      = get_most_critical_cycle(risks)
    affected_areas, accumulated_score  = identify_most_affected_area()
    average_risk                     = round(sum(risks) / len(risks), 2)
    trend                       = analyze_trend(risks)
    critical_cycles                 = count_critical_cycles(risks)
    final_classification             = classify_cycle(round(average_risk))

    print("\n" + "=" * 60)
    print("RELATÓRIO FINAL DA MISSÃO")
    print("=" * 60)

    print(f"\nMissão : {MISSION_NAME}")
    print(f"Equipe : {TEAM_NAME}")
    print(f"Quantidade de ciclos analisados: {len(mission_data)}")

    print("\nMÉDIAS DOS INDICADORES")
    units = ["°C", "%", "%", "%", "%"]

    for area, average, unit in zip(monitored_areas, averages, units):
        print(f"  {area}: {average}{unit}")

    print(f"\nCiclo mais crítico      : Ciclo {critical_cycle}")
    print(f"Maior pontuação de risco: {highest_risk}")
    print(f"Risco médio da missão   : {average_risk}")
    print(f"Ciclos críticos         : {critical_cycles}")

    print(f"\nTendência da missão:")
    print(f"  {trend}")

    print("\nPontuação acumulada por área:")

    for area, points in zip(monitored_areas, accumulated_score):
        print(f"  {area}: {points} pontos")

    print("\nÁrea(s) mais afetada(s):")

    for area in affected_areas:
        print(f"  - {area}")

    print(f"\nClassificação final da missão: {final_classification}")

    print("\nConclusão:")

    if final_classification == "MISSÃO CRÍTICA":
        print(
            "  A missão apresentou situações críticas que exigem\n"
            "  ações corretivas imediatas."
        )
    elif final_classification == "MISSÃO EM ATENÇÃO":
        print(
            "  A missão apresentou pontos de atenção que exigem\n"
            "  monitoramento contínuo."
        )
    else:
        print(
            "  A missão permaneceu estável durante\n"
            "  todos os ciclos analisados."
        )

    print("\nFim do relatório.")

    generate_energy_report()


# --------------------------------------------------
# FUNÇÃO PRINCIPAL
# --------------------------------------------------

def main():
    generate_report()


if __name__ == "__main__":
    main()
