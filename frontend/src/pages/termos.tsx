// ═══════════════════════════════════════════════════════════════════
// pages/termos.tsx — com i18n (cabeçalho e botão voltar)
// ═══════════════════════════════════════════════════════════════════
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

export default function Termos() {
  const { t } = useI18n();
  const tx = t("legal");

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">{tx.termsEyebrow}</p>
          <h1 className="font-serif font-bold text-4xl md:text-6xl leading-tight mb-4">
            {tx.termsTitle.split("byTrust")[0]}
            <span className="text-gold-500">byTrust</span>
          </h1>
          <p className="text-sm text-ink-600 font-mono">{tx.termsUpdated}</p>
        </div>

        <div className="space-y-8 text-base leading-relaxed">
          <LegalSection title="1. Aceitação dos Termos">
            <p>
              Ao acessar ou utilizar a plataforma byTrust (doravante denominada "byTrust", "plataforma",
              "nós" ou "nosso"), você ("Usuário", "você") declara ter lido, compreendido e aceitado
              integralmente os presentes Termos de Uso, bem como a Política de Privacidade da byTrust.
            </p>
            <p>
              Caso você não concorde com qualquer disposição destes Termos, deverá interromper
              imediatamente o uso da plataforma e de todos os serviços oferecidos.
            </p>
          </LegalSection>

          <LegalSection title="2. Objeto do Serviço">
            <p>
              A byTrust é uma plataforma de verificação de autenticidade de produtos que oferece
              tecnologia antipirataria, permitindo que consumidores, varejistas e fabricantes
              confirmem a originalidade de itens por meio de códigos de série, QR Codes, fotos ou
              integração via API.
            </p>
            <p>Os serviços da byTrust incluem, mas não se limitam a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verificação de autenticidade de produtos em tempo real;</li>
              <li>API de integração para sistemas de estoque, e-commerce e aplicativos;</li>
              <li>Conteúdo educativo (cartilhas, blog, quiz, glossário e trilhas de aprendizado);</li>
              <li>Certificação digital de marcas parceiras por meio do Selo byTrust.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Cadastro e Responsabilidades do Usuário">
            <p>
              Para acessar determinados recursos da plataforma, o Usuário deverá criar uma conta,
              fornecendo informações verdadeiras, precisas, atuais e completas. O Usuário é
              integralmente responsável pela guarda e confidencialidade de sua senha e dados de acesso.
            </p>
            <p>O Usuário compromete-se a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Não utilizar a plataforma para fins ilícitos ou fraudulentos;</li>
              <li>Não reproduzir, distribuir ou modificar conteúdo da byTrust sem autorização expressa;</li>
              <li>Não tentar acessar dados de outros Usuários ou sistemas da plataforma por meios indevidos;</li>
              <li>Notificar imediatamente a byTrust sobre qualquer uso não autorizado de sua conta.</li>
            </ul>
            <p>
              O cadastro de menores de 16 (dezesseis) anos depende de autorização expressa dos pais
              ou responsáveis legais, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </LegalSection>

          <LegalSection title="4. Resultados da Verificação">
            <p>
              A byTrust emprega os melhores esforços técnicos para garantir a precisão das informações
              de autenticidade fornecidas pela plataforma. No entanto, os resultados das verificações
              são baseados nos dados cadastrados pelos fabricantes e marcas parceiras.
            </p>
            <p>A byTrust <strong>não se responsabiliza</strong> por:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Decisões de compra ou venda tomadas com base nas verificações;</li>
              <li>Danos decorrentes de produtos falsificados que não tenham sido cadastrados na plataforma;</li>
              <li>Informações incompletas ou incorretas fornecidas por terceiros (fabricantes, marcas, varejistas).</li>
            </ul>
            <p>
              A verificação realizada pela byTrust constitui <strong>indício de autenticidade</strong>,
              e não substitui laudos técnicos ou perícias oficiais.
            </p>
          </LegalSection>

          <LegalSection title="5. Planos e Pagamentos">
            <p>
              A byTrust oferece diferentes planos de uso (Gratuito, Profissional e Enterprise), cada
              qual com limites de verificação e funcionalidades específicas, conforme descrito na
              plataforma no momento da contratação.
            </p>
            <p>
              A byTrust reserva-se o direito de alterar os valores e características dos planos,
              mediante comunicação prévia aos Usuários com no mínimo 30 (trinta) dias de antecedência.
            </p>
          </LegalSection>

          <LegalSection title="6. Propriedade Intelectual">
            <p>
              Todo o conteúdo disponível na plataforma byTrust — incluindo textos, imagens, logotipos,
              códigos, APIs, design, banco de dados e demais elementos — é de propriedade exclusiva da
              byTrust ou de seus licenciantes, estando protegido pela Lei de Direitos Autorais
              (Lei nº 9.610/1998) e pela Lei de Propriedade Industrial (Lei nº 9.279/1996).
            </p>
            <p>
              É vedada a reprodução, distribuição, exibição pública, modificação ou criação de obras
              derivadas sem autorização prévia e por escrito da byTrust.
            </p>
          </LegalSection>

          <LegalSection title="7. Proteção de Dados Pessoais">
            <p>
              A byTrust trata os dados pessoais dos Usuários em conformidade com a Lei Geral de
              Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018). Para informações detalhadas
              sobre como coletamos, utilizamos, armazenamos e protegemos seus dados, consulte nossa{" "}
              <Link to="/privacidade" className="underline text-ink-900 hover:text-gold-500 font-medium">
                Política de Privacidade
              </Link>.
            </p>
          </LegalSection>

          <LegalSection title="8. Limitação de Responsabilidade">
            <p>
              A byTrust não será responsabilizada por danos indiretos, lucros cessantes ou perda de
              oportunidades decorrentes do uso ou da impossibilidade de uso da plataforma, exceto
              nos casos previstos em lei.
            </p>
            <p>
              Nos termos do Código de Defesa do Consumidor (Lei nº 8.078/1990) e do Marco Civil da
              Internet (Lei nº 12.965/2014), a byTrust envidará os melhores esforços para garantir a
              disponibilidade, segurança e continuidade dos serviços, mas não garante que a plataforma
              funcione sem interrupções, erros ou falhas técnicas.
            </p>
          </LegalSection>

          <LegalSection title="9. Disposições Gerais">
            <p>
              Estes Termos regem-se pelas leis da República Federativa do Brasil. Fica eleito o foro
              da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer controvérsias
              oriundas destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
            <p>
              A byTrust poderá alterar estes Termos a qualquer momento. As alterações serão comunicadas
              aos Usuários por meio da plataforma ou por e-mail. O uso continuado após a alteração
              implica aceitação dos novos Termos.
            </p>
            <p>
              Caso qualquer disposição destes Termos seja considerada inválida ou inexequível, as
              demais disposições permanecerão em pleno vigor e efeito.
            </p>
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