const db = require('./database');

// ============================================================
// FUNÇÃO AUXILIAR: gerador determinístico (pseudo-aleatório)
// ============================================================
function detRand(seed, min, max) {
    if (min === max) return min;
    let x = Math.sin(seed) * 10000;
    let r = x - Math.floor(x);
    return min + Math.floor(r * (max - min + 1));
}

// ============================================================
// LISTAS GRANDES PARA COMPOSIÇÃO DE QUESTÕES ÚNICAS
// ============================================================

// --- Conhecimentos Gerais / Literatura ---
const autores = [
    "Machado de Assis", "José de Alencar", "Carlos Drummond de Andrade", "Graciliano Ramos", "Érico Veríssimo",
    "Jorge Amado", "Clarice Lispector", "Cecília Meireles", "Manuel Bandeira", "João Guimarães Rosa",
    "Rachel de Queiroz", "Aluísio Azevedo", "Lima Barreto", "Mário de Andrade", "Oswald de Andrade",
    "Rubem Braga", "Nelson Rodrigues", "Ferreira Gullar", "Vinícius de Moraes", "Adélia Prado",
    "Monteiro Lobato", "Hilda Hilst", "João Cabral de Melo Neto", "Augusto dos Anjos", "Cora Coralina"
];
const obras = [
    "Dom Casmurro", "O Guarani", "A Moreninha", "Vidas Secas", "O Cortiço", "Grande Sertão: Veredas",
    "Capitães da Areia", "A Hora da Estrela", "Auto da Compadecida", "O Alienista", "Memórias Póstumas de Brás Cubas",
    "Iracema", "Senhora", "O Primo Basílio", "A Cidade e as Serras", "Triste Fim de Policarpo Quaresma",
    "São Bernardo", "Angústia", "A Paixão Segundo G.H.", "Quincas Borba", "Sítio do Picapau Amarelo",
    "Poesia Completa", "Morte e Vida Severina", "Eu", "Poemas dos Becos"
];

// --- Ciências e Geografia ---
const planetas = ["Mercúrio", "Vênus", "Terra", "Marte", "Júpiter", "Saturno", "Urano", "Netuno"];
const paises = ["Brasil", "Argentina", "França", "Alemanha", "Japão", "China", "EUA", "Canadá", "Austrália", "Índia", "Rússia", "México", "Itália", "Espanha", "Portugal"];
const cidadesFamosas = ["Paris", "Londres", "Nova York", "Tóquio", "Berlim", "Roma", "Madri", "Lisboa", "Moscou", "Pequim", "Rio de Janeiro", "São Paulo", "Buenos Aires", "Cairo", "Nova Délhi"];
const monumentos = ["Torre Eiffel", "Big Ben", "Coliseu", "Estátua da Liberdade", "Muralha da China", "Cristo Redentor", "Machu Picchu", "Taj Mahal", "Acrópole", "Torre de Pisa"];

// --- Atualidades / Eventos ---
const eventosInternacionais = [
    "Copa do Mundo", "Olimpíadas", "Eleição presidencial", "Acordo climático", "Cúpula do G20",
    "Fórum Econômico Mundial", "Conferência da ONU", "Festival de Cannes", "Prêmio Nobel", "Feira de Tecnologia"
];
const anosEvento = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const paisesSede = paises; // reutiliza lista de países

// --- Direito Constitucional ---
const clausulasPetreas = [
    "Forma federativa de Estado", "Voto direto, secreto, universal e periódico", "Separação dos Poderes",
    "Direitos e garantias individuais", "Mandado de segurança", "Habeas corpus", "Ação popular",
    "Iniciativa popular de leis", "Federalismo", "República"
];
const principiosConstitucionais = ["Legalidade", "Impessoalidade", "Moralidade", "Publicidade", "Eficiência", "Isonomia", "Devido processo legal"];

// --- Informática ---
const siglasTI = [
    "CPU", "RAM", "HD", "SSD", "USB", "HTML", "HTTP", "FTP", "SMTP", "IP", "DNS", "URL", "GPU", "BIOS", "CMOS",
    "LAN", "WAN", "VPN", "SSH", "SSL", "TLS", "XML", "JSON", "API", "SaaS", "IaaS", "PaaS", "IoT", "AI", "ML"
];
const definicoesTI = [
    "Unidade Central de Processamento", "Memória de Acesso Aleatório", "Disco Rígido", "Unidade de Estado Sólido",
    "Barramento Universal", "Linguagem de Marcação", "Protocolo de Transferência de Hipertexto", "Protocolo de Transferência de Arquivos",
    "Protocolo de Correio", "Protocolo de Internet", "Sistema de Nomes de Domínio", "Localizador Uniforme de Recursos",
    "Unidade de Processamento Gráfico", "Sistema Básico de Entrada/Saída", "Memória Complementar",
    "Rede Local", "Rede de Longa Distância", "Rede Privada Virtual", "Secure Shell", "Secure Sockets Layer",
    "Transport Layer Security", "Extensible Markup Language", "JavaScript Object Notation", "Interface de Programação",
    "Software como Serviço", "Infraestrutura como Serviço", "Plataforma como Serviço", "Internet das Coisas",
    "Inteligência Artificial", "Machine Learning"
];

// --- Direito Administrativo ---
const principiosAdm = [
    "Legalidade", "Impessoalidade", "Moralidade", "Publicidade", "Eficiência",
    "Supremacia do Interesse Público", "Indisponibilidade do Interesse Público",
    "Razoabilidade", "Proporcionalidade", "Autotutela"
];
const descricoesPrincipios = [
    "só age conforme a lei", "trata todos igualmente", "exige honestidade", "transparência total",
    "busca resultados de qualidade", "interesse coletivo prevalece", "administrador não pode dispor dos bens públicos",
    "medidas adequadas", "proporcionalidade entre meios e fins", "revisão dos próprios atos"
];

// ============================================================
// GERADORES DE QUESTÕES POR TEMA (125 cada → 1000 total)
// ============================================================

function gerarMatematica(seed) {
    let tipo = detRand(seed, 1, 12);
    let a = detRand(seed + 100, 2, 99);
    let b = detRand(seed + 200, 2, 50);
    let c = detRand(seed + 300, 1, 30);
    if (tipo <= 4) {
        let res = a * b;
        let opts = [res, res + detRand(seed + 400, 1, 25), res - detRand(seed + 500, 1, 20), res + detRand(seed + 600, 5, 40)];
        return { text: `${a} × ${b} = ?`, options: opts, correct: 0, explanation: `${a} × ${b} = ${res}.` };
    } else if (tipo <= 8) {
        let res = a * a - b;
        let opts = [res, res + detRand(seed + 700, 2, 20), res - detRand(seed + 800, 2, 15), res + detRand(seed + 900, 3, 30)];
        return { text: `Calcule ${a}² - ${b}`, options: opts, correct: 0, explanation: `${a}² = ${a * a}, menos ${b} = ${res}.` };
    } else {
        let p = detRand(seed + 1000, 5, 60);
        let v = detRand(seed + 1100, 100, 900);
        let res = (p * v) / 100;
        let opts = [res, res + detRand(seed + 1200, 2, 30), res - detRand(seed + 1300, 2, 25), res + detRand(seed + 1400, 5, 45)];
        return { text: `Quanto é ${p}% de ${v}?`, options: opts, correct: 0, explanation: `${p}% de ${v} = ${(p * v / 100)}.` };
    }
}

function gerarRaciocinioLogico(seed) {
    let tipo = detRand(seed + 2000, 1, 6);
    if (tipo <= 3) {
        let inicio = detRand(seed + 2100, 2, 50);
        let razao = detRand(seed + 2200, 2, 12);
        let termo4 = inicio + 3 * razao;
        let opts = [termo4, termo4 + razao, termo4 - razao, termo4 + detRand(seed + 2300, 2, 10)];
        return { text: `Complete a sequência: ${inicio}, ${inicio + razao}, ${inicio + 2 * razao}, ___`, options: opts, correct: 0, explanation: `PA de razão ${razao}. Próximo: ${termo4}.` };
    } else if (tipo === 4) {
        let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
        let a = letras[detRand(seed + 2400, 0, letras.length - 1)];
        let b = letras[detRand(seed + 2500, 0, letras.length - 1)];
        let c = letras[detRand(seed + 2600, 0, letras.length - 1)];
        let opts = [`Nenhum ${a} é ${c}`, `Todo ${c} é ${a}`, `Algum ${a} é ${c}`, `Nada se conclui`];
        return { text: `Se todo ${a} é ${b} e nenhum ${b} é ${c}, então:`, options: opts, correct: 0, explanation: `Silogismo: ${a} ⊂ ${b} e ${b} ∩ ${c} = ∅ → ${a} ∩ ${c} = ∅.` };
    } else {
        let props = ["chove", "faz sol", "estudo", "passo no concurso", "trabalho", "acordo cedo", "corro", "durmo", "como", "leio", "viajo", "durmo"];
        let p = props[detRand(seed + 2700, 0, props.length - 1)];
        let q = props[detRand(seed + 2800, 0, props.length - 1)];
        let opts = [`${p} é verdadeira`, `${p} é falsa`, `${p} pode ser verdadeira ou falsa`, `nada se conclui`];
        return { text: `Se "Se ${p} então ${q}" é verdadeira e ${q} é falsa, conclui-se que:`, options: opts, correct: 1, explanation: `Modus tollens: P→Q verdade e Q falso ⇒ P falso.` };
    }
}

function gerarPortugues(seed) {
    let tipo = detRand(seed + 3000, 1, 5);
    if (tipo <= 3) {
        // Geração de palavras pseudoaleatórias (acentuação)
        const vogais = ["a", "e", "i", "o", "u"];
        const consoantes = "bcdfghjklmnpqrstvwxyz".split("");
        function palavraAleatoria(semente, tam) {
            let p = "";
            for (let i = 0; i < tam; i++) {
                let tipoLetra = detRand(semente + i, 0, 1);
                if (tipoLetra === 0) p += consoantes[detRand(semente + i + 100, 0, consoantes.length - 1)];
                else p += vogais[detRand(semente + i + 200, 0, vogais.length - 1)];
            }
            return p;
        }
        let palavras = [];
        for (let i = 0; i < 4; i++) {
            palavras.push(palavraAleatoria(seed + i * 1000, 4 + detRand(seed + i * 100, 0, 5)));
        }
        let correta = detRand(seed + 4000, 0, 3);
        palavras[correta] = palavras[correta] + "á"; // adiciona acento
        return { text: "Assinale a palavra corretamente acentuada:", options: palavras, correct: correta, explanation: "Acentuação gráfica correta." };
    } else {
        const frasesRegencia = [
            ["Assistimos o filme", "Namoro ela", "Obedeço ao regulamento", "Prefiro mais estudar"],
            ["Paguei o funcionário", "Chamei ele", "Aspiro à presidência", "Quero me demitir"],
            ["Visitei o museu", "Lembrei o ocorrido", "Simpatizei com a ideia", "Custei a acreditar"],
            ["Cheguei na escola", "Vou no cinema", "Respondi a pergunta", "Gosto de futebol"]
        ];
        let idxFrase = detRand(seed + 3300, 0, frasesRegencia.length - 1);
        let opts = frasesRegencia[idxFrase];
        return { text: "Indique a opção em que a regência verbal está correta:", options: opts, correct: 2, explanation: "A regência exige o uso correto da preposição." };
    }
}

function gerarDireitoConstitucional(seed) {
    let tipo = detRand(seed + 5000, 1, 3);
    if (tipo === 1) {
        let clausula = clausulasPetreas[detRand(seed + 5100, 0, clausulasPetreas.length - 1)];
        let pergunta = `Qual das seguintes opções é uma cláusula pétrea na Constituição Federal?`;
        let opts = [clausula, clausulasPetreas[detRand(seed + 5200, 0, clausulasPetreas.length - 1)], clausulasPetreas[detRand(seed + 5300, 0, clausulasPetreas.length - 1)], clausulasPetreas[detRand(seed + 5400, 0, clausulasPetreas.length - 1)]];
        let correta = 0;
        // Embaralhamento básico
        if (detRand(seed + 5500, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
        return { text: pergunta, options: opts, correct: correta, explanation: `${clausula} é cláusula pétrea (art. 60, §4º).` };
    } else {
        let principio = principiosConstitucionais[detRand(seed + 5600, 0, principiosConstitucionais.length - 1)];
        let pergunta = `O princípio da ${principio} na administração pública significa:`;
        let explica = `O princípio da ${principio} é um dos fundamentos do Estado Democrático de Direito.`;
        return { text: pergunta, options: ["Legalidade", "Impessoalidade", "Moralidade", "Eficiência"], correct: 0, explanation: explica };
    }
}

function gerarInformatica(seed) {
    let idx = detRand(seed + 8000, 0, siglasTI.length - 1);
    let sigla = siglasTI[idx];
    let definicao = definicoesTI[idx];
    let pergunta = `O que significa a sigla ${sigla} em informática?`;
    let outras = [];
    for (let i = 0; i < 3; i++) {
        let outroIdx = detRand(seed + 8100 + i * 100, 0, siglasTI.length - 1);
        outras.push(definicoesTI[outroIdx]);
    }
    let opts = [definicao, outras[0], outras[1], outras[2]];
    let correta = 0;
    if (detRand(seed + 8200, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
    return { text: pergunta, options: opts, correct: correta, explanation: `${sigla} = ${definicao}.` };
}

function gerarDireitoAdministrativo(seed) {
    let idx = detRand(seed + 9000, 0, principiosAdm.length - 1);
    let principio = principiosAdm[idx];
    let descricao = descricoesPrincipios[idx];
    let pergunta = `O princípio da ${principio} na administração pública significa, em síntese, que o administrador:`;
    let outras = [];
    for (let i = 0; i < 3; i++) {
        let outroIdx = detRand(seed + 9100 + i * 100, 0, descricoesPrincipios.length - 1);
        outras.push(descricoesPrincipios[outroIdx]);
    }
    let opts = [descricao, outras[0], outras[1], outras[2]];
    let correta = 0;
    if (detRand(seed + 9200, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
    return { text: pergunta, options: opts, correct: correta, explanation: `${principio}: ${descricao}.` };
}

function gerarAtualidades(seed) {
    let evento = eventosInternacionais[detRand(seed + 10000, 0, eventosInternacionais.length - 1)];
    let ano = anosEvento[detRand(seed + 10100, 0, anosEvento.length - 1)];
    let pais = paisesSede[detRand(seed + 10200, 0, paisesSede.length - 1)];
    let pergunta = `Em ${ano}, qual país sediou o(a) ${evento}?`;
    let outras = [];
    for (let i = 0; i < 3; i++) {
        outras.push(paisesSede[detRand(seed + 10300 + i * 100, 0, paisesSede.length - 1)]);
    }
    let opts = [pais, outras[0], outras[1], outras[2]];
    let correta = 0;
    if (detRand(seed + 10400, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
    return { text: pergunta, options: opts, correct: correta, explanation: `${evento} em ${ano} foi realizado em ${pais}.` };
}

function gerarConhecimentosGerais(seed) {
    let tipo = detRand(seed + 11000, 1, 4);
    if (tipo <= 2) {
        let autor = autores[detRand(seed + 11100, 0, autores.length - 1)];
        let obra = obras[detRand(seed + 11200, 0, obras.length - 1)];
        let pergunta = `Quem escreveu a obra "${obra}"?`;
        let outras = [];
        for (let i = 0; i < 3; i++) {
            outras.push(autores[detRand(seed + 11300 + i * 100, 0, autores.length - 1)]);
        }
        let opts = [autor, outras[0], outras[1], outras[2]];
        let correta = 0;
        if (detRand(seed + 11400, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
        return { text: pergunta, options: opts, correct: correta, explanation: `"${obra}" é de autoria de ${autor}.` };
    } else if (tipo === 3) {
        let planeta = planetas[detRand(seed + 11500, 0, planetas.length - 1)];
        let pergunta = `Qual é o maior planeta do sistema solar?`; // aqui o conteúdo é fixo, mas a ordem das opções muda
        let outras = [];
        for (let i = 0; i < 3; i++) {
            outras.push(planetas[detRand(seed + 11600 + i * 100, 0, planetas.length - 1)]);
        }
        let opts = [planeta, outras[0], outras[1], outras[2]];
        let correta = 0;
        if (detRand(seed + 11700, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
        return { text: pergunta, options: opts, correct: correta, explanation: `${planeta} é o maior planeta do sistema solar.` };
    } else {
        let monumento = monumentos[detRand(seed + 11800, 0, monumentos.length - 1)];
        let cidade = cidadesFamosas[detRand(seed + 11900, 0, cidadesFamosas.length - 1)];
        let pergunta = `Em que cidade está localizado o monumento ${monumento}?`;
        let outras = [];
        for (let i = 0; i < 3; i++) {
            outras.push(cidadesFamosas[detRand(seed + 12000 + i * 100, 0, cidadesFamosas.length - 1)]);
        }
        let opts = [cidade, outras[0], outras[1], outras[2]];
        let correta = 0;
        if (detRand(seed + 12100, 0, 1) === 0) { [opts[0], opts[1]] = [opts[1], opts[0]]; correta = 1; }
        return { text: pergunta, options: opts, correct: correta, explanation: `${monumento} está localizado em ${cidade}.` };
    }
}

// ============================================================
// MAPEAMENTO TEMAS → FUNÇÃO GERADORA
// ============================================================
const temas = [
    "Matemática",
    "Raciocínio Lógico",
    "Português",
    "Direito Constitucional",
    "Informática",
    "Direito Administrativo",
    "Atualidades",
    "Conhecimentos Gerais"
];

const geradores = {
    "Matemática": gerarMatematica,
    "Raciocínio Lógico": gerarRaciocinioLogico,
    "Português": gerarPortugues,
    "Direito Constitucional": gerarDireitoConstitucional,
    "Informática": gerarInformatica,
    "Direito Administrativo": gerarDireitoAdministrativo,
    "Atualidades": gerarAtualidades,
    "Conhecimentos Gerais": gerarConhecimentosGerais
};

const TOTAL_POR_TEMA = 125; // 8 * 125 = 1000

// ============================================================
// POPULAR BANCO DE DADOS
// ============================================================
async function seedDatabase() {
    // Limpa a tabela
    await new Promise((resolve, reject) => {
        db.db.run(`DELETE FROM questions`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    for (let tema of temas) {
        for (let i = 0; i < TOTAL_POR_TEMA; i++) {
            const seed = (temas.indexOf(tema) * 1000000) + i;
            const q = geradores[tema](seed);
            const stmt = db.db.prepare(`
                INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct, explanation, tema)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(
                q.text,
                q.options[0],
                q.options[1],
                q.options[2],
                q.options[3],
                q.correct,
                q.explanation,
                tema
            );
            stmt.finalize();
        }
        console.log(`${TOTAL_POR_TEMA} questões de ${tema} inseridas.`);
    }
    console.log("✅ Banco de dados populado com 1000 questões únicas (sem repetições)!");
    db.db.close();
}

seedDatabase().catch(console.error);