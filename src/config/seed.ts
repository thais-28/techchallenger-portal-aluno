import bcrypt from "bcrypt";
import { TeacherModel } from "../models/teacherModel";
import { StudentModel } from "../models/studentModel";
import { PostModel } from "../models/postModel";

export async function seedDatabase() {
  try {
    console.log("🌱 Verificando dados de exemplo...");

    // Verificar se já existem dados
    const teacherCount = await TeacherModel.countDocuments();
    const studentCount = await StudentModel.countDocuments();
    const postCount = await PostModel.countDocuments();

    if (teacherCount > 0 && studentCount > 0 && postCount > 0) {
      console.log("✅ Banco já possui dados de exemplo.");
      return;
    }

    console.log("🌱 Semeando banco de dados com dados de exemplo...");

    // Hash da senha padrão: "senha123"
    const hashedPassword = await bcrypt.hash("senha123", 10);

    // Criar professores de exemplo
    if (teacherCount === 0) {
      await TeacherModel.create([
        {
          nome: "Prof. João Silva",
          cpf: "12345678901",
          nascimento: new Date("1980-05-15"),
          telefone: "(11) 98765-4321",
          disciplina: "Matemática",
          email: "joao.silva@escola.com",
          matricula: "PROF001",
          senha: hashedPassword,
        },
        {
          nome: "Profa. Maria Santos",
          cpf: "98765432100",
          nascimento: new Date("1985-08-22"),
          telefone: "(11) 97654-3210",
          disciplina: "História",
          email: "maria.santos@escola.com",
          matricula: "PROF002",
          senha: hashedPassword,
        },
        {
          nome: "Prof. Carlos Oliveira",
          cpf: "11122233344",
          nascimento: new Date("1978-03-10"),
          telefone: "(11) 96543-2109",
          disciplina: "Ciências",
          email: "carlos.oliveira@escola.com",
          matricula: "PROF003",
          senha: hashedPassword,
        },
      ]);
      console.log("✅ 3 professores criados");
    }

    // Criar alunos de exemplo
    if (studentCount === 0) {
      await StudentModel.create([
        {
          nome: "Ana Paula Costa",
          cpf: "55566677788",
          nascimento: new Date("2005-03-20"),
          telefone: "(11) 91234-5678",
          turma: "3A",
          email: "ana.costa@escola.com",
          matricula: "ALU001",
          senha: hashedPassword,
        },
        {
          nome: "Pedro Henrique Souza",
          cpf: "44455566677",
          nascimento: new Date("2006-07-15"),
          telefone: "(11) 92345-6789",
          turma: "2B",
          email: "pedro.souza@escola.com",
          matricula: "ALU002",
          senha: hashedPassword,
        },
        {
          nome: "Juliana Ferreira",
          cpf: "33344455566",
          nascimento: new Date("2005-11-30"),
          telefone: "(11) 93456-7890",
          turma: "3A",
          email: "juliana.ferreira@escola.com",
          matricula: "ALU003",
          senha: hashedPassword,
        },
        {
          nome: "Lucas Almeida",
          cpf: "22233344455",
          nascimento: new Date("2006-01-25"),
          telefone: "(11) 94567-8901",
          turma: "2B",
          email: "lucas.almeida@escola.com",
          matricula: "ALU004",
          senha: hashedPassword,
        },
      ]);
      console.log("✅ 4 alunos criados");
    }

    // Criar posts de exemplo
    if (postCount === 0) {
      await PostModel.create([
        {
          title: "Introdução à Álgebra Linear",
          content:
            "Nesta aula, vamos explorar os conceitos básicos da álgebra linear, incluindo vetores, matrizes e sistemas lineares. A álgebra linear é fundamental para diversas áreas da matemática e suas aplicações práticas.",
          author: "Prof. João Silva",
          subject: "Matemática",
        },
        {
          title: "A Revolução Francesa e seus Impactos",
          content:
            "A Revolução Francesa (1789-1799) foi um dos eventos mais importantes da história moderna. Neste post, discutiremos suas causas, desenvolvimento e consequências para o mundo contemporâneo.",
          author: "Profa. Maria Santos",
          subject: "História",
        },
        {
          title: "O Ciclo da Água na Natureza",
          content:
            "O ciclo da água é um processo contínuo de circulação da água na Terra. Compreender esse ciclo é essencial para entender diversos fenômenos naturais e a importância da preservação dos recursos hídricos.",
          author: "Prof. Carlos Oliveira",
          subject: "Ciências",
        },
        {
          title: "Teorema de Pitágoras: Aplicações Práticas",
          content:
            "O Teorema de Pitágoras é uma das ferramentas mais úteis da geometria. Vamos ver como ele pode ser aplicado em situações do dia a dia, desde construção civil até navegação.",
          author: "Prof. João Silva",
          subject: "Matemática",
        },
        {
          title: "O Brasil Colonial: Economia e Sociedade",
          content:
            "Durante o período colonial brasileiro, a economia era baseada principalmente na exploração de recursos naturais. Vamos analisar a estrutura social e econômica desse período histórico.",
          author: "Profa. Maria Santos",
          subject: "História",
        },
        {
          title: "Fotossíntese: Como as Plantas Produzem Energia",
          content:
            "A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química. Este mecanismo é essencial para a vida na Terra e será detalhado neste conteúdo educativo.",
          author: "Prof. Carlos Oliveira",
          subject: "Ciências",
        },
      ]);
      console.log("✅ 6 posts criados");
    }

    console.log("\n📋 CREDENCIAIS DE ACESSO PARA TESTES:");
    console.log("=====================================");
    console.log("\n👨‍🏫 PROFESSORES:");
    console.log("  Email: joao.silva@escola.com | Senha: senha123");
    console.log("  Email: maria.santos@escola.com | Senha: senha123");
    console.log("  Email: carlos.oliveira@escola.com | Senha: senha123");
    console.log("\n👨‍🎓 ALUNOS:");
    console.log("  Email: ana.costa@escola.com | Senha: senha123");
    console.log("  Email: pedro.souza@escola.com | Senha: senha123");
    console.log("  Email: juliana.ferreira@escola.com | Senha: senha123");
    console.log("  Email: lucas.almeida@escola.com | Senha: senha123");
    console.log("=====================================\n");

    console.log("✅ Dados de exemplo criados com sucesso!\n");
  } catch (error) {
    console.error("❌ Erro ao semear banco de dados:", error);
  }
}
