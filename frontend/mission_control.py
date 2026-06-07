#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mission Control AI - Motor Analítico do Orion Sentinel
Protótipo acadêmico em Python com equações de Risco Sistêmico e Subsistema SERS.
"""

import math

# Parâmetros de Projeto do Subsistema de Energia Renovável e Sustentável (SERS)
POTENCIA_MAXIMA = 500  # W
TENSAO_OPERACIONAL = 28  # V
CAPACIDADE_BATERIA = 2000  # Wh

# Faixas de classificação de risco e status
THRESHOLDS = {
    "temperature": {"normal_max": 28, "atencao_max": 34},
    "communication": {"atencao_min": 60, "normal_min": 80},
    "battery": {"atencao_min": 45, "normal_min": 70},
    "oxygen": {"atencao_min": 85, "normal_min": 90},
    "stability": {"atencao_min": 60, "normal_min": 75}
}

# Dados de Telemetria Oficial (Ciclos Iniciais do Orion Sentinel)
# Sintaxe por ciclo: [Temperatura (°C), Comunicação (%), Bateria (%), Oxigênio (%), Estabilidade (%)]
INITIAL_CYCLES = [
    [22, 95, 92, 98, 96],
    [25, 89, 85, 95, 91],
    [29, 76, 72, 93, 84],
    [33, 61, 57, 89, 73],
    [37, 45, 41, 84, 58],
    [35, 52, 48, 86, 63]
]

def obter_status_componente(tipo, valor):
    """Retorna o status Normal, Atenção ou Crítico com base nas regras academicas."""
    if tipo == "temperature":
        if valor <= THRESHOLDS["temperature"]["normal_max"]:
            return "Normal"
        elif valor <= THRESHOLDS["temperature"]["atencao_max"]:
            return "Atenção"
        return "Crítico"
    
    elif tipo == "communication":
        if valor >= THRESHOLDS["communication"]["normal_min"]:
            return "Normal"
        elif valor >= THRESHOLDS["communication"]["atencao_min"]:
            return "Atenção"
        return "Crítico"
        
    elif tipo == "battery":
        if valor >= THRESHOLDS["battery"]["normal_min"]:
            return "Normal"
        elif valor >= THRESHOLDS["battery"]["atencao_min"]:
            return "Atenção"
        return "Crítico"
        
    elif tipo == "oxygen":
        if valor >= THRESHOLDS["oxygen"]["normal_min"]:
            return "Normal"
        elif valor >= THRESHOLDS["oxygen"]["atencao_min"]:
            return "Atenção"
        return "Crítico"
        
    elif tipo == "stability":
        if valor >= THRESHOLDS["stability"]["normal_min"]:
            return "Normal"
        elif valor >= THRESHOLDS["stability"]["atencao_min"]:
            return "Atenção"
        return "Crítico"
        
    return "Normal"

def calcular_risco_termico(temp):
    """
    Calcula risco baseado em temperatura. 
    Começa acima de 20°C e alcança 100% de estresse térmico a 37°C.
    """
    if temp <= 20:
        return 0.0
    return min(100.0, round((temp - 20) * 5.88, 1))

def analisar_ciclo(ciclo, index):
    """Executa a análise de riscos e os cálculos elétricos de SERS."""
    temp, comm, batt, oxy, stab = ciclo
    
    # 1. Cálculo de riscos individuais (%)
    temp_risk = calcular_risco_termico(temp)
    comm_risk = 100.0 - comm
    batt_risk = 100.0 - batt
    oxy_risk = 100.0 - oxy
    stab_risk = 100.0 - stab
    
    # Risco agregado (Média simples)
    score_risco = round((temp_risk + comm_risk + batt_risk + oxy_risk + stab_risk) / 5.0, 1)
    
    # 2. Cálculos do Subsistema SERS
    # Capacidade útil armazenada (Wh)
    energia_armazenada_wh = round(CAPACIDADE_BATERIA * (batt / 100.0))
    
    # Potência solar gerada (W) baseada na potência máxima multiplicada pela eficiência (Bateria / 100)
    potencia_gerada_w = round(POTENCIA_MAXIMA * (batt / 100.0), 1)
    
    # Corrente elétrica gerada (A)
    corrente_estimada_a = round(potencia_gerada_w / TENSAO_OPERACIONAL, 2)
    
    # Status de Sustentabilidade Operacional
    sustainability_status = "Recuperação Emergencial"
    if batt >= 75 and potencia_gerada_w >= 375:
        sustainability_status = "Sustentabilidade Forte"
    elif batt >= 50 and potencia_gerada_w >= 250:
        sustainability_status = "Sustentabilidade Estável"
    elif batt >= 35 and potencia_gerada_w >= 175:
        sustainability_status = "Atenção Operacional"
        
    return {
        "index": index,
        "temperature": temp,
        "communication": comm,
        "battery": batt,
        "oxygen": oxy,
        "stability": stab,
        "risk_score": score_risco,
        "stored_energy_wh": energia_armazenada_wh,
        "generated_power_w": potencia_gerada_w,
        "current_a": corrente_estimada_a,
        "sustainability_status": sustainability_status
    }

def executar_analise_completa():
    print("=" * 80)
    print("                MISSION CONTROL AI - BACKBONE DE CÁLCULO PYTHON            ")
    print("                     SISTEMA TELEMÉTRICO ORION SENTINEL                     ")
    print("=" * 80)
    print(f"Parâmetros Elétricos SERS: Potência Max Solar = {POTENCIA_MAXIMA}W | Tensão Nominal = {TENSAO_OPERACIONAL}V | Bateria = {CAPACIDADE_BATERIA}Wh\n")
    
    print(f"{'Ciclo':<6} | {'Temp':<4} | {'Comm':<4} | {'Batt':<4} | {'Oxy':<4} | {'Stab':<4} | {'Risco %':<7} | {'SERS W':<7} | {'SERS A':<6} | {'Status SERS'}")
    print("-" * 80)
    
    somas_risco = 0
    max_risco = -1
    ciclo_critico = 1
    
    for idx, ciclo in enumerate(INITIAL_CYCLES, 1):
        res = analisar_ciclo(ciclo, idx)
        somas_risco += res["risk_score"]
        
        if res["risk_score"] > max_risco:
            max_risco = res["risk_score"]
            ciclo_critico = idx
            
        print(f"#{res['index']:<4} | {res['temperature']:>2}°C | {res['communication']:>3}% | {res['battery']:>3}% | {res['oxygen']:>3}% | {res['stability']:>3}% | {res['risk_score']:>6}% | {res['generated_power_w']:>6}W | {res['current_a']:>5}A | {res['sustainability_status']}")
        
    media_risco = round(somas_risco / len(INITIAL_CYCLES), 1)
    
    # Classificação Operacional da Missão
    status_missao = "Missão Estável"
    if media_risco > 45:
        status_missao = "Alerta Crítico"
    elif media_risco >= 20:
        status_missao = "Monitoramento Intensivo"
        
    print("-" * 80)
    print(f"Métricas Agregadas Consolidadas:")
    print(f"  -> Risco Médio da Missão: {media_risco}% ({status_missao})")
    print(f"  -> Ciclo Mais Crítico: #{ciclo_critico} com {max_risco}% de estresse operacional")
    print("=" * 80)

if __name__ == "__main__":
    executar_analise_completa()
