# 🚀 Mission Control AI — Orion Sentinel

Sistema inteligente de monitoramento de missão espacial experimental, desenvolvido como entrega da **Global Solution 2026.1** da FIAP para as disciplinas:

- **Pensamento Computacional e Automação com Python (PCP)**
- **Soluções em Energias Renováveis e Sustentáveis (SERS)**

---

## 👥 Equipe

**Equipe Horizon**

- Alan Souza
- Gustavo Zibini Belizario

---

## 🛰️ Sobre o projeto

O **Mission Control AI** simula o monitoramento inteligente de uma missão espacial experimental chamada **Orion Sentinel**. O sistema analisa dados operacionais de 6 ciclos de monitoramento, gera alertas automáticos, calcula o nível de risco de cada ciclo e apresenta um relatório final completo.

Como diferencial para a disciplina de SERS, o sistema também realiza uma **análise energética sustentável** do módulo espacial, cujo sistema de energia é alimentado por **painéis solares fotovoltaicos** e armazenado em baterias de íon-lítio. O painel energético calcula, para cada ciclo:

- Energia armazenada na bateria (Wh): `E = Capacidade × (nível / 100)`
- Potência gerada pelos painéis (W): `P = P_máx × η` (eficiência estimada)
- Corrente do sistema (A): `I = P / V` (Lei de Ohm)
- Classificação de sustentabilidade energética (Sustentável / Atenção / Crítico)

Ao final, o sistema exibe um resumo com eficiência fotovoltaica média, energia total consumida e impacto ambiental (zero emissões de CO₂).

---

## 📋 Estrutura dos dados monitorados

Cada ciclo da missão é representado por uma linha da matriz `dados_missao`, com 5 informações nesta ordem:

| Posição | Informação | Unidade |
|---------|-----------|---------|
| 0 | Temperatura interna | °C |
| 1 | Comunicação com a base | % |
| 2 | Sistema de energia (bateria) | % |
| 3 | Suporte de oxigênio | % |
| 4 | Estabilidade operacional | % |

---

## ⚠️ Regras de alerta e pontuação de risco

### Temperatura
| Condição | Classificação | Pontos |
|----------|--------------|--------|
| < 18 °C | ATENÇÃO | 1 |
| 18 °C a 30 °C | NORMAL | 0 |
| 30 °C a 35 °C | ATENÇÃO | 1 |
| > 35 °C | CRÍTICO | 2 |

### Comunicação
| Condição | Classificação | Pontos |
|----------|--------------|--------|
| ≥ 60% | NORMAL | 0 |
| 30% a 59% | ATENÇÃO | 1 |
| < 30% | CRÍTICO | 2 |

### Bateria (Sistema de energia)
| Condição | Classificação | Pontos |
|----------|--------------|--------|
| ≥ 50% | NORMAL | 0 |
| 20% a 49% | ATENÇÃO | 1 |
| < 20% | CRÍTICO | 2 |

### Oxigênio
| Condição | Classificação | Pontos |
|----------|--------------|--------|
| ≥ 90% | NORMAL | 0 |
| 80% a 89% | ATENÇÃO | 1 |
| < 80% | CRÍTICO | 2 |

### Estabilidade
| Condição | Classificação | Pontos |
|----------|--------------|--------|
| ≥ 70% | NORMAL | 0 |
| 40% a 69% | ATENÇÃO | 1 |
| < 40% | CRÍTICO | 2 |

---

## 🎯 Classificação do ciclo

| Pontuação total | Classificação |
|----------------|--------------|
| 0 a 2 pontos | MISSÃO ESTÁVEL |
| 3 a 5 pontos | MISSÃO EM ATENÇÃO |
| 6 a 10 pontos | MISSÃO CRÍTICA |

---

## 🔋 Parâmetros do sistema energético

| Parâmetro | Valor |
|-----------|-------|
| Potência máxima dos painéis solares | 500 W |
| Tensão nominal do sistema | 28 V |
| Capacidade da bateria | 2000 Wh |
| Fonte de energia | Solar fotovoltaica (renovável) |

---

## 🗂️ Estrutura do repositório

```
mission-control-ai/
│
├── README.md
└── mission_control.py
```

---

## ▶️ Como executar

Não são necessárias bibliotecas externas. Basta ter o Python 3 instalado:

```bash
python mission_control.py
```

---

## 📦 Saída do sistema

O programa exibe no terminal:

1. **Análise por ciclo** — dados de cada indicador com classificação (NORMAL / ATENÇÃO / CRÍTICO), pontuação de risco e recomendação automática
2. **Relatório final da missão** — médias dos indicadores, ciclo mais crítico, risco médio, tendência da missão, pontuação acumulada por área e classificação final
3. **Painel de energia renovável** — análise energética fotovoltaica com cálculos de energia, potência e corrente por ciclo, além do resumo de sustentabilidade energética da missão

---
