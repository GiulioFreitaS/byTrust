// ═══════════════════════════════════════════════════════════════════
// pages/privacidade.tsx — com i18n (cabeçalho e botão voltar)
// ═══════════════════════════════════════════════════════════════════
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

export default function Privacidade() {
  const { t } = useI18n();
  const tx = t("legal");

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{tx.privacyEyebrow}</p>
          <h1 className="font-serif font-bold text-4xl md:text-6xl leading-tight mb-4">
            {tx.privacyTitle.split("byTrust")[0]}
            <span className="text-gold-500">byTrust</span>
          </h1>
          <p className="text-sm text-ink-600 font-mono">{tx.privacyUpdated}</p>
        </div>

        <div className="space-y-8 text-base leading-relaxed">
          <LegalSection title="1. Controlador dos Dados">
            <p>
              A byTrust Tecnologia Ltda., inscrita sob o CNPJ nº 00.000.000/0001-00, com sede na
              cidade de São Paulo, Estado de São Paulo, é a controladora responsável pelo tratamento
              dos dados pessoais dos Usuários, nos termos da Lei Geral de Proteção de Dados Pessoais
              (LGPD - Lei nº 13.709/2018).
            </p>
            <p>
              Para exercer seus direitos como titular de dados, entre em contato conosco pelo e-mail:
              <strong> privacidade@bytrust.com</strong>.
            </p>
          </LegalSection>

          <LegalSection title="2. Definições">
            <p>Para os fins desta Política, aplicam-se as seguintes definições, em conformidade com a LGPD:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dado pessoal:</strong> informação relacionada a pessoa natural identificada ou identificável (art. 5º, I, LGPD);</li>
              <li><strong>Dado pessoal sensível:</strong> dado sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, dado genético, biométrico ou referente à saúde (art. 5º, II, LGPD);</li>
              <li><strong>Tratamento:</strong> toda operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração (art. 5º, X, LGPD);</li>
              <li><strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais que são objeto de tratamento (art. 5º, V, LGPD);</li>
              <li><strong>Controlador:</strong> pessoa natural ou jurídica a quem competem as decisões referentes ao tratamento de dados pessoais (art. 5º, VI, LGPD);</li>
              <li><strong>Operador:</strong> pessoa natural ou jurídica que realiza o tratamento de dados pessoais em nome do controlador (art. 5º, VII, LGPD);</li>
              <li><strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados (art. 5º, XIX, LGPD).</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Dados Coletados">
            <p>A byTrust coleta os seguintes dados pessoais dos Usuários, conforme a finalidade e o contexto de uso da plataforma:</p>
            <h3 className="font-serif font-bold text-lg mt-4 mb-2">3.1. Dados fornecidos voluntariamente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo;</li>
              <li>Endereço de e-mail;</li>
              <li>Perfil (consumidor, varejista ou marca);</li>
              <li>Empresa (quando aplicável);</li>
              <li>Mensagens enviadas por meio do formulário de contato.</li>
            </ul>
            <h3 className="font-serif font-bold text-lg mt-4 mb-2">3.2. Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Endereço IP;</li>
              <li>Tipo e versão do navegador;</li>
              <li>Páginas acessadas e data/hora do acesso;</li>
              <li>Dispositivo utilizado (sistema operacional, resolução de tela);</li>
              <li>Cookies e tecnologias similares, conforme detalhado na Seção 7.</li>
            </ul>
            <p className="mt-3">A byTrust <strong>não coleta dados pessoais sensíveis</strong> (art. 5º, II, LGPD) em suas operações regulares.</p>
          </LegalSection>

          <LegalSection title="4. Finalidades do Tratamento">
            <p>Os dados pessoais coletados são tratados pela byTrust para as seguintes finalidades legítimas (art. 7º, LGPD):</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li><strong>Prestação dos serviços:</strong> permitir a verificação de autenticidade de produtos e disponibilizar as funcionalidades da plataforma;</li>
              <li><strong>Comunicação:</strong> responder a solicitações de contato, suporte e enviar comunicações relacionadas à prestação dos serviços;</li>
              <li><strong>Segurança:</strong> proteger a integridade da plataforma, prevenir fraudes e garantir a segurança dos Usuários;</li>
              <li><strong>Melhoria contínua:</strong> analisar o uso da plataforma para aprimorar a experiência do Usuário e desenvolver novos recursos;</li>
              <li><strong>Cumprimento legal:</strong> atender a obrigações legais e regulatórias aplicáveis (art. 7º, II, LGPD);</li>
              <li><strong>Exercício regular de direitos:</strong> proteger os interesses da byTrust em processos judiciais, administrativos ou arbitrais (art. 7º, VI, LGPD).</li>
            </ol>
          </LegalSection>

          <LegalSection title="5. Bases Legais para o Tratamento">
            <p>A byTrust realiza o tratamento de dados pessoais com base nas seguintes hipóteses legais previstas no art. 7º da LGPD:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consentimento do titular (art. 7º, I):</strong> para envio de comunicações promocionais e marketing direto, quando aplicável;</li>
              <li><strong>Cumprimento de obrigação legal ou regulatória (art. 7º, II):</strong> para atender a exigências fiscais, contábeis e legais;</li>
              <li><strong>Execução de contrato (art. 7º, V):</strong> para a prestação dos serviços contratados pelo Usuário;</li>
              <li><strong>Exercício regular de direitos (art. 7º, VI):</strong> para defesa da byTrust em processos judiciais ou administrativos;</li>
              <li><strong>Legítimo interesse (art. 7º, IX):</strong> para segurança da plataforma, prevenção a fraudes e melhoria dos serviços, sempre respeitando as expectativas legítimas dos titulares e seus direitos e liberdades fundamentais.</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Compartilhamento de Dados">
            <p>A byTrust não vende, aluga ou compartilha seus dados pessoais com terceiros para fins comerciais ou de marketing. Os dados poderão ser compartilhados apenas nas seguintes situações:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Com prestadores de serviços que atuam como operadores em nome da byTrust (hospedagem, infraestrutura, analytics), sujeitos a obrigações contratuais de confidencialidade;</li>
              <li>Com autoridades públicas, quando exigido por lei, ordem judicial ou regulamento aplicável;</li>
              <li>Em caso de reorganização societária (fusão, aquisição ou venda de ativos), desde que mantidas as condições desta Política.</li>
            </ul>
          </LegalSection>

          <LegalSection title="7. Cookies e Tecnologias de Rastreamento">
            <p>A byTrust utiliza cookies e tecnologias similares para melhorar a experiência do Usuário. Os tipos de cookies utilizados incluem:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico da plataforma;</li>
              <li><strong>Cookies analíticos:</strong> para coleta de dados agregados de navegação (Google Analytics);</li>
              <li><strong>Cookies de funcionalidade:</strong> para lembrar preferências do Usuário.</li>
            </ul>
            <p>O Usuário pode gerenciar ou desabilitar os cookies por meio das configurações de seu navegador. A desabilitação de cookies essenciais pode comprometer o funcionamento de determinadas funcionalidades da plataforma.</p>
          </LegalSection>

          <LegalSection title="8. Direitos do Titular dos Dados">
            <p>Nos termos do art. 18 da LGPD, o titular dos dados pessoais possui os seguintes direitos, que poderão ser exercidos a qualquer momento mediante solicitação ao controlador:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Confirmação da existência de tratamento de dados pessoais;</li>
              <li>Acesso aos dados pessoais tratados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa;</li>
              <li>Eliminação dos dados pessoais tratados com consentimento do titular;</li>
              <li>Informação sobre a possibilidade de não fornecer consentimento e as consequências da negativa;</li>
              <li>Revogação do consentimento a qualquer tempo, mediante manifestação expressa;</li>
              <li>Oposição ao tratamento realizado com base em legítimo interesse;</li>
              <li>Revisão de decisões automatizadas, quando aplicável.</li>
            </ol>
            <p className="mt-3">Para exercer seus direitos, entre em contato pelo e-mail: <strong>privacidade@bytrust.com</strong>. A byTrust responderá à sua solicitação em até 15 (quinze) dias, conforme o art. 18, §3º da LGPD.</p>
          </LegalSection>

          <LegalSection title="9. Prazo de Armazenamento e Eliminação">
            <p>A byTrust armazena os dados pessoais dos Usuários pelo período necessário ao cumprimento das finalidades descritas nesta Política, observados os seguintes critérios:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de conta:</strong> enquanto o Usuário mantiver sua conta ativa na plataforma;</li>
              <li><strong>Dados de contato:</strong> pelo prazo de 5 (cinco) anos após o último contato, para fins de relacionamento comercial e cumprimento de obrigações legais;</li>
              <li><strong>Dados de navegação:</strong> pelo prazo máximo de 12 (doze) meses, salvo obrigação legal em contrário;</li>
              <li><strong>Dados para cumprimento legal:</strong> conforme o prazo previsto na legislação aplicável (ex.: 5 anos para dados fiscais e contábeis, nos termos do art. 195 do CTN).</li>
            </ul>
            <p>Após o término do prazo de armazenamento, os dados pessoais serão eliminados ou anonimizados, salvo se a byTrust for obrigada a mantê-los por força de lei ou regulamento.</p>
          </LegalSection>

          <LegalSection title="10. Medidas de Segurança">
            <p>A byTrust emprega medidas técnicas e organizacionais para proteger os dados pessoais dos Usuários contra acessos não autorizados, destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito (art. 46, LGPD).</p>
            <p>As medidas incluem, mas não se limitam a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Criptografia de dados em trânsito (TLS 1.3);</li>
              <li>Criptografia de dados em repouso (AES-256);</li>
              <li>Controles de acesso baseados em princípio do menor privilégio;</li>
              <li>Monitoramento contínuo de segurança e detecção de intrusões;</li>
              <li>Realização periódica de backups e testes de segurança;</li>
              <li>Treinamento de equipe em boas práticas de proteção de dados.</li>
            </ul>
          </LegalSection>

          <LegalSection title="11. Transferência Internacional de Dados">
            <p>A byTrust poderá transferir dados pessoais para prestadores de serviços localizados em outros países, sempre em conformidade com o art. 33 da LGPD. Nesses casos, a byTrust adota salvaguardas contratuais e técnicas para garantir o mesmo nível de proteção concedido pela legislação brasileira.</p>
          </LegalSection>

          <LegalSection title="12. Encarregado de Proteção de Dados (DPO)">
            <p>Nos termos do art. 41 da LGPD, a byTrust nomeou um Encarregado de Proteção de Dados (Data Protection Officer - DPO) para atuar como canal de comunicação entre a empresa, os titulares de dados e a ANPD:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>E-mail:</strong> dpo@bytrust.com</li>
              <li><strong>Endereço:</strong> [Inserir endereço comercial], São Paulo - SP, Brasil</li>
            </ul>
          </LegalSection>

          <LegalSection title="13. Disposições Finais">
            <p>A byTrust poderá alterar esta Política de Privacidade a qualquer momento. As alterações serão comunicadas aos Usuários por meio da plataforma ou por e-mail, com no mínimo 15 (quinze) dias de antecedência.</p>
            <p>Esta Política de Privacidade é regida pelas leis da República Federativa do Brasil, em especial pela Lei nº 13.709/2018 (LGPD), pelo Marco Civil da Internet (Lei nº 12.965/2014) e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).</p>
            <p>Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer controvérsias decorrentes desta Política, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
          </LegalSection>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="btn-outline inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" /> {tx.backBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2 className="font-serif font-bold text-2xl mb-4">{title}</h2>
      <div className="space-y-3 text-ink-700">{children}</div>
    </div>
  );
}