import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import "./ai-saude-landing.scss";
import aiLogo from "./img/ai-logo.svg";
import aiSaudeSymbol from "./img/ai-saude-symbol.svg";
import doctorArt from "./img/doctor.svg";
import dashboardArt from "./img/dashboard.svg";

const navItems = [
  { id: "ai-saude-home", label: "Home" },
  { id: "ai-saude-about", label: "Sobre" },
  { id: "ai-saude-services", label: "Servicos" },
  { id: "ai-saude-plans", label: "Planos" },
  { id: "ai-saude-faq", label: "FAQ" },
];

const features = [
  {
    title: "Eficiencia",
    text: "Fluxos de estudo, revisao e tomada de decisao organizados em poucos cliques.",
    icon: Zap,
  },
  {
    title: "Praticidade",
    text: "Ferramentas inteligentes reunidas em uma unica plataforma para a rotina da saude.",
    icon: CheckCircle2,
  },
  {
    title: "Velocidade",
    text: "Respostas, simulacoes e direcionamentos mais rapidos para avancar com seguranca.",
    icon: Sparkles,
  },
];

const testimonials = [
  {
    name: "Evelin Matos",
    role: "Enfermeira",
    text: "O AISAUDE deixou meus estudos muito mais claros. Consigo revisar casos e organizar minhas duvidas antes dos plantoes.",
  },
  {
    name: "Thiago Cloves",
    role: "Estudante de medicina",
    text: "As respostas sao objetivas e a plataforma me ajuda a transformar conteudo dificil em uma rotina de estudo real.",
  },
  {
    name: "Artur Oliveira",
    role: "Fisioterapeuta",
    text: "Uso para criar resumos, revisar protocolos e ganhar tempo na preparacao dos atendimentos.",
  },
  {
    name: "Vanessa Lopes",
    role: "Nutricionista",
    text: "A experiencia e simples, bonita e direta. Parece feita para profissionais que precisam de apoio pratico.",
  },
];

const plans = [
  {
    name: "Plano Free",
    monthly: "0,00",
    yearly: "0,00",
    text: "Para conhecer a plataforma e testar os recursos essenciais.",
    features: ["Acesso inicial", "Consultas limitadas", "Resumo de estudos", "Suporte comunitario"],
  },
  {
    name: "Plano Premium",
    monthly: "29,90",
    yearly: "299,00",
    text: "Para estudantes e profissionais que querem produtividade diaria.",
    features: ["Consultas ilimitadas", "Historico inteligente", "Modelos de estudo", "Suporte prioritario"],
    highlighted: true,
  },
  {
    name: "Premium Pro",
    monthly: "89,90",
    yearly: "899,00",
    text: "Para equipes que precisam de ferramentas avancadas e colaboracao.",
    features: ["Espaco de equipe", "Relatorios avancados", "Biblioteca privada", "Onboarding assistido"],
  },
];

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const faqs = [
  {
    question: "O AISAUDE substitui um profissional de saude?",
    answer:
      "Nao. A plataforma apoia estudos, organizacao e produtividade, mas nao substitui avaliacao, diagnostico ou conduta profissional.",
  },
  {
    question: "Posso usar a plataforma no celular?",
    answer: "Sim. O layout foi pensado para desktop, tablet e celular, mantendo as principais acoes sempre acessiveis.",
  },
  {
    question: "Os planos podem ser alterados depois?",
    answer:
      "Sim. Voce pode iniciar no plano gratuito e migrar para Premium ou Premium Pro quando fizer sentido para a sua rotina.",
  },
  {
    question: "Quais recursos usam inteligencia artificial?",
    answer:
      "Resumos, organizacao de perguntas, orientacao de estudo, simulacoes de casos e analises de conteudo usam recursos inteligentes.",
  },
];

const authCopy = {
  signup: {
    eyebrow: "Comece agora",
    title: "Crie sua conta AISAUDE",
    text: "Organize seus estudos e tenha respostas mais claras em uma rotina inteligente.",
    submit: "Criar conta",
    alternate: "Ja tenho conta",
  },
  login: {
    eyebrow: "Bem-vindo de volta",
    title: "Entre na sua area",
    text: "Acesse seus resumos, planos e historico de estudo sem perder o ritmo.",
    submit: "Entrar",
    alternate: "Criar conta",
  },
};

function scrollToAiSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AiSaudeButton({ children, variant = "primary", onClick, type = "button" }) {
  return (
    <button className={`ai-saude-btn ai-saude-btn--${variant}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function priceToNumber(price) {
  return Number(String(price).replace(/\./g, "").replace(",", "."));
}

function AnimatedPlanPrice({ period, value }) {
  const targetValue = priceToNumber(value);
  const [displayValue, setDisplayValue] = useState(targetValue);
  const currentValueRef = useRef(targetValue);

  useEffect(() => {
    const startValue = currentValueRef.current;
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || Math.abs(startValue - targetValue) < 0.01) {
      currentValueRef.current = targetValue;
      setDisplayValue(targetValue);
      return undefined;
    }

    let frameId;
    const duration = 760;
    const startedAt = performance.now();
    const difference = targetValue - startValue;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * eased;

      currentValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      currentValueRef.current = targetValue;
      setDisplayValue(targetValue);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [targetValue]);

  return (
    <strong className="ai-saude-price" aria-live="polite">
      <span className="ai-saude-price__currency">$</span>
      <span className="ai-saude-price__amount" key={`${period}-${value}`}>
        {priceFormatter.format(displayValue)}
      </span>
      <span className="ai-saude-price__period">/{period === "month" ? "mes" : "ano"}</span>
    </strong>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return <span className="ai-saude-avatar">{initials}</span>;
}

function AiSaudeAuthModal({ mode, onClose, onSwitch, onSubmit }) {
  const [visibleMode, setVisibleMode] = useState(mode ?? "login");

  useEffect(() => {
    if (mode) {
      setVisibleMode(mode);
    }
  }, [mode]);

  const copy = authCopy[visibleMode];
  const isSignup = visibleMode === "signup";

  return (
    <div
      aria-hidden={!mode}
      className={`ai-saude-auth ${mode ? "is-open" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="ai-saude-auth-title"
        aria-modal="true"
        className={`ai-saude-auth__dialog ${isSignup ? "is-signup" : "is-login"}`}
        role="dialog"
      >
        <button className="ai-saude-auth__close" type="button" aria-label="Fechar formulario" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="ai-saude-auth__brand" aria-hidden="true">
          <img src={aiLogo} alt="" />
        </div>

        <span className="ai-saude-auth__eyebrow">{copy.eyebrow}</span>
        <h2 id="ai-saude-auth-title">{copy.title}</h2>
        <p>{copy.text}</p>

        <form className="ai-saude-auth__form" onSubmit={onSubmit}>
          {isSignup && (
            <label>
              <span>Nome</span>
              <div className="ai-saude-auth__field">
                <UserRound size={19} />
                <input type="text" placeholder="Seu nome" required />
              </div>
            </label>
          )}

          <label>
            <span>Email</span>
            <div className="ai-saude-auth__field">
              <Mail size={19} />
              <input type="email" placeholder="voce@email.com" required />
            </div>
          </label>

          <label>
            <span>Senha</span>
            <div className="ai-saude-auth__field">
              <LockKeyhole size={19} />
              <input type="password" placeholder="Digite sua senha" required minLength={6} />
              <Eye className="ai-saude-auth__field-eye" size={18} />
            </div>
          </label>

          {isSignup && (
            <label>
              <span>Perfil</span>
              <div className="ai-saude-auth__field">
                <ShieldCheck size={19} />
                <select defaultValue="" required>
                  <option value="" disabled>
                    Escolha seu perfil
                  </option>
                  <option>Estudante</option>
                  <option>Profissional de saude</option>
                  <option>Equipe</option>
                </select>
              </div>
            </label>
          )}

          <label className="ai-saude-auth__check">
            <input type="checkbox" required={isSignup} />
            <span aria-hidden="true" />
            <em>{isSignup ? "Aceito os termos da plataforma" : "Manter conectado"}</em>
          </label>

          <button className="ai-saude-auth__submit" type="submit">
            {copy.submit}
            <ArrowRight size={18} />
          </button>
        </form>

        <button className="ai-saude-auth__switch" type="button" onClick={() => onSwitch(isSignup ? "login" : "signup")}>
          {copy.alternate}
        </button>
      </section>
    </div>
  );
}

export default function AiSaudeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [billing, setBilling] = useState("month");
  const [activeFaq, setActiveFaq] = useState(0);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState(null);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const openAuth = (mode) => {
    setMenuOpen(false);
    setAuthMode(mode);
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    showNotice(authMode === "signup" ? "Cadastro criado para demonstracao." : "Login realizado para demonstracao.");
    setAuthMode(null);
  };

  const goTo = (id) => {
    setMenuOpen(false);
    scrollToAiSection(id);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && authMode) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        setAuthMode(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [authMode]);

  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showNotice("Insira um email valido.");
      return;
    }

    showNotice("Email cadastrado com sucesso.");
    setEmail("");
  };

  return (
    <main className="ai-saude-page" id="ai-saude-home">
      <header className="ai-saude-header">
        <div className="ai-saude-container ai-saude-header__inner">
          <button className="ai-saude-brand" type="button" onClick={() => goTo("ai-saude-home")}>
            <img src={aiLogo} alt="" />
            <span>AISAÚDE</span>
          </button>

          <button
            className="ai-saude-menu"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className={`ai-saude-nav-panel ${menuOpen ? "is-open" : ""}`}>
            <nav aria-label="AISAUDE navigation">
              {navItems.map((item) => (
                <button key={item.id} type="button" onClick={() => goTo(item.id)}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="ai-saude-header__actions">
              <button type="button" onClick={() => openAuth("signup")}>
                Sign up
              </button>
              <button type="button" onClick={() => openAuth("login")}>
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="ai-saude-hero" aria-labelledby="ai-saude-hero-title">
        <div className="ai-saude-container ai-saude-hero__grid">
          <div className="ai-saude-hero__copy">
            <span className="ai-saude-kicker">Inteligencia artificial para saude</span>
            <h1 id="ai-saude-hero-title">
              Desbloqueie seu potencial com <span>recursos especializados!</span>
            </h1>
            <p>
              Explore Ferramentas Inteligentes para o seu estudo, pratica e avanco profissional. Descubra o seu futuro
              na area da saude, agora ao seu alcance no AISAUDE.
            </p>
            <div className="ai-saude-hero__actions">
              <AiSaudeButton onClick={() => goTo("ai-saude-plans")}>
                Comecar agora
                <ArrowRight size={18} />
              </AiSaudeButton>
              <AiSaudeButton variant="ghost" onClick={() => goTo("ai-saude-about")}>
                Saiba mais
              </AiSaudeButton>
            </div>
          </div>

          <div className="ai-saude-hero__visual" aria-hidden="true">
            <div className="ai-saude-orbit ai-saude-orbit--one">+</div>
            <div className="ai-saude-orbit ai-saude-orbit--two">AI</div>
            <div className="ai-saude-orbit ai-saude-orbit--three">24h</div>
            <img src={doctorArt} alt="" />
          </div>
        </div>
      </section>

      <section className="ai-saude-features" id="ai-saude-services">
        <div className="ai-saude-container ai-saude-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="ai-saude-feature-card" key={feature.title}>
                <span className="ai-saude-feature-card__icon">
                  <Icon size={25} />
                </span>
                <h2>{feature.title}</h2>
                <p>{feature.text}</p>
                <button type="button" onClick={() => goTo("ai-saude-plans")}>
                  Comecar
                  <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ai-saude-about" id="ai-saude-about">
        <div className="ai-saude-container ai-saude-about__grid">
          <div className="ai-saude-about__symbol" aria-hidden="true">
            <img src={aiSaudeSymbol} alt="" />
          </div>
          <div className="ai-saude-section-copy">
            <span className="ai-saude-kicker">Sobre a plataforma</span>
            <h2>Uma plataforma inteligente que ira revolucionar sua jornada na saude</h2>
            <p>
              O AISAUDE combina organizacao, tecnologia e uma experiencia simples para apoiar quem estuda, atende,
              pesquisa ou precisa ganhar clareza na rotina profissional.
            </p>
            <AiSaudeButton variant="secondary" onClick={() => goTo("ai-saude-feedback")}>
              Saiba mais
              <ArrowRight size={18} />
            </AiSaudeButton>
          </div>
        </div>
      </section>

      <section className="ai-saude-feedback" id="ai-saude-feedback">
        <div className="ai-saude-container">
          <div className="ai-saude-section-head">
            <span className="ai-saude-kicker">Depoimentos</span>
            <h2>Saiba o que nossos usuarios estao achando</h2>
            <p>Leia os relatos de agradecimento dos nossos usuarios.</p>
          </div>

          <div className="ai-saude-testimonial-marquee" aria-label="Depoimentos de usuarios">
            <div className="ai-saude-testimonial-track">
              {[false, true].map((isCopy) => (
                <div aria-hidden={isCopy} className="ai-saude-testimonial-group" key={isCopy ? "copy" : "original"}>
                  {testimonials.map((item) => (
                    <article className="ai-saude-testimonial" key={`${item.name}-${isCopy ? "copy" : "original"}`}>
                      <div>
                        <Avatar name={item.name} />
                        <span>
                          <strong>{item.name}</strong>
                          <em>{item.role}</em>
                        </span>
                      </div>
                      <p>{item.text}</p>
                      <span className="ai-saude-stars" aria-label="5 estrelas">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={index} size={15} fill="currentColor" />
                        ))}
                      </span>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ai-saude-dashboard">
        <div className="ai-saude-container ai-saude-dashboard__grid">
          <div className="ai-saude-section-copy">
            <span className="ai-saude-kicker">Dashboard inteligente</span>
            <h2>Onde a Inteligencia Artificial desperta o potencial na saude!</h2>
            <p>
              Acompanhe progresso, organize atividades e mantenha seus principais fluxos de estudo em um painel visual
              e intuitivo.
            </p>
            <div className="ai-saude-hero__actions">
              <AiSaudeButton onClick={() => goTo("ai-saude-plans")}>
                Ver planos
                <ArrowRight size={18} />
              </AiSaudeButton>
              <AiSaudeButton variant="ghost" onClick={() => goTo("ai-saude-faq")}>
                FAQ
              </AiSaudeButton>
            </div>
          </div>
          <img src={dashboardArt} alt="" />
        </div>
      </section>

      <section className="ai-saude-plans" id="ai-saude-plans">
        <div className="ai-saude-container">
          <div className="ai-saude-section-head">
            <span className="ai-saude-kicker">Planos</span>
            <h2>Planos e Assinaturas</h2>
            <p>Escolha o plano que melhor combina com a sua rotina.</p>
          </div>

          <div className="ai-saude-billing" role="group" aria-label="Periodo de cobranca">
            <button className={billing === "month" ? "is-active" : ""} type="button" onClick={() => setBilling("month")}>
              Mes
            </button>
            <button className={billing === "year" ? "is-active" : ""} type="button" onClick={() => setBilling("year")}>
              Ano
            </button>
          </div>

          <div className="ai-saude-plan-grid">
            {plans.map((plan) => (
              <article className={`ai-saude-plan-card ${plan.highlighted ? "is-featured" : ""}`} key={plan.name}>
                <h3>{plan.name}</h3>
                <p>{plan.text}</p>
                <AnimatedPlanPrice period={billing} value={billing === "month" ? plan.monthly : plan.yearly} />
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => showNotice(`${plan.name} selecionado.`)}>
                  Adquirir
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-saude-faq" id="ai-saude-faq">
        <div className="ai-saude-container ai-saude-faq__grid">
          <div className="ai-saude-section-copy">
            <span className="ai-saude-kicker">FAQ</span>
            <h2>Perguntas Frequentes</h2>
            <p>Veja respostas rapidas sobre uso, planos e objetivos da plataforma.</p>
            <AiSaudeButton variant="secondary" onClick={() => showNotice("Mensagem enviada para suporte.")}>
              <MessageCircle size={18} />
              Falar com suporte
            </AiSaudeButton>
          </div>

          <div className="ai-saude-accordion">
            {faqs.map((item, index) => {
              const open = activeFaq === index;
              return (
                <article className={open ? "is-open" : ""} key={item.question}>
                  <button type="button" onClick={() => setActiveFaq(open ? -1 : index)} aria-expanded={open}>
                    <span>{item.question}</span>
                    {open ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  <p>{item.answer}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="ai-saude-footer">
        <div className="ai-saude-container ai-saude-footer__grid">
          <div>
            <button className="ai-saude-brand" type="button" onClick={() => goTo("ai-saude-home")}>
              <img src={aiLogo} alt="" />
              <span>AISAÚDE</span>
            </button>
            <p>Ferramentas inteligentes para estudo, pratica e avanco profissional na area da saude.</p>
          </div>

          <form onSubmit={handleNewsletter}>
            <label htmlFor="ai-saude-email">Newsletter</label>
            <div>
              <input
                id="ai-saude-email"
                type="email"
                value={email}
                placeholder="Insira o seu Email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" aria-label="Enviar email">
                <ChevronDown size={18} />
              </button>
            </div>
          </form>

          <nav aria-label="Footer navigation">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => goTo(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="ai-saude-container ai-saude-footer__bottom">
          <span>© 2024 Danielle Fragas. Todos Os Direitos Reservados.</span>
          <span>Privacidade · Termos · Suporte</span>
        </div>
      </footer>

      <div className={`ai-saude-notice ${notice ? "is-visible" : ""}`} role="status">
        {notice}
      </div>

      <AiSaudeAuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSubmit={handleAuthSubmit}
        onSwitch={setAuthMode}
      />
    </main>
  );
}
