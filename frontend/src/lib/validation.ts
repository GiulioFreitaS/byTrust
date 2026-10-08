// Validação de e-mail com lista de domínios permitidos — adaptado do projeto de referência

const DOMINIOS_EMAIL_VALIDOS = [
  "gmail.com",
  "googlemail.com",
  "proton.me",
  "protonmail.com",
  "tuta.com",
  "tutamail.com",
  "tutanota.com",
  "outlook.com",
  "outlook.com.br",
  "hotmail.com",
  "hotmail.com.br",
  "live.com",
  "live.com.br",
  "msn.com",
  "yahoo.com",
  "yahoo.com.br",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "zoho.com",
  "fastmail.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "protonmail.ch",
  "pm.me",
];

export function validarEmail(email: string): { valido: boolean; mensagem: string } {
  if (!email || !email.trim()) {
    return { valido: false, mensagem: "O e-mail é obrigatório." };
  }

  const regexBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexBasico.test(email.trim())) {
    return { valido: false, mensagem: "Insira um e-mail válido (ex.: nome@provedor.com)." };
  }

  const partes = email.trim().split("@");
  const dominio = partes[1].toLowerCase();

  const dominioPermitido = DOMINIOS_EMAIL_VALIDOS.some(
    (d) => dominio === d || dominio.endsWith(`.${d}`),
  );

  if (!dominioPermitido) {
    return {
      valido: false,
      mensagem:
        "E-mail não reconhecido. Use Gmail, Outlook, Proton, Tuta, Yahoo, iCloud ou outro provedor compatível.",
    };
  }

  return { valido: true, mensagem: "" };
}

export function validarSenha(senha: string): { valido: boolean; mensagem: string } {
  if (!senha) {
    return { valido: false, mensagem: "A senha é obrigatória." };
  }

  if (senha.length < 6) {
    return { valido: false, mensagem: "A senha deve ter no mínimo 6 caracteres." };
  }

  if (!/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha)) {
    return {
      valido: false,
      mensagem: "A senha deve conter letras e números.",
    };
  }

  return { valido: true, mensagem: "" };
}

export function requisitosSenha(): string[] {
  return [
    "Mínimo 6 caracteres",
    "Pelo menos uma letra",
    "Pelo menos um número",
  ];
}
