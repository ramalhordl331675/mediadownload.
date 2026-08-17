export type Lang = 'pt' | 'en' | 'es';

export const LANGS: Array<{ code: Lang; label: string; name: string }> = [
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
];

const LANG_KEY = 'lang';

export const LANG_EVENT = 'lang-changed';

type Dict = Record<string, string>;

const DICT: Record<Lang, Dict> = {
  pt: {
    'nav.home': 'Início',
    'nav.how': 'Como funciona',
    'nav.platforms': 'Plataformas',
    'nav.faq': 'FAQ',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.cta': 'Começar agora',
    'header.theme': 'Alternar tema claro e escuro',
    'header.menu': 'Abrir menu',
    'header.lang': 'Escolher idioma',

    'hero.badge': 'Download simplificado',
    'hero.title': 'Cole. Processe.',
    'hero.titleAccent': 'Baixe.',
    'hero.sub':
      'Cole uma URL pública, processe o conteúdo e escolha uma opção disponível para download.',
    'hero.placeholder': 'Cole aqui a URL',
    'hero.paste': 'Colar',
    'hero.process': 'Processar URL',
    'hero.demoHint': 'O download real depende do conteúdo.',
    'hero.demoBtn': 'Ver demonstração visual do resultado',
    'hero.legal':
      'Use esta ferramenta somente para baixar conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da respectiva plataforma.',

    'platforms.eyebrow': 'Plataformas',
    'platforms.title': 'Plataformas compatíveis',
    'platforms.sub':
      'Processamos URLs públicas das principais plataformas, sempre de acordo com as permissões de cada conteúdo.',
    'platforms.public': 'URLs públicas',
    'platforms.disclaimer':
      'A disponibilidade pode variar conforme as características da plataforma e as permissões do conteúdo.',

    'how.eyebrow': 'Como funciona',
    'how.title': 'Três passos simples',
    'how.sub': 'Sem cadastro, sem instalação e sem complicação.',
    'how.step1': 'Cole a URL',
    'how.step1text': 'Copie a URL pública do conteúdo desejado.',
    'how.step2': 'Processe',
    'how.step2text': 'Cole no campo e clique em processar.',
    'how.step3': 'Escolha',
    'how.step3text': 'Selecione uma opção disponível e faça o download.',

    'benefits.eyebrow': 'Vantagens',
    'benefits.title': 'Pensado para você',
    'benefits.sub': 'Simplicidade e performance em primeiro lugar.',
    'benefit.fast': 'Rápido',
    'benefit.fastText': 'Processamento otimizado para entregar opções o quanto antes.',
    'benefit.simple': 'Simples',
    'benefit.simpleText': 'Interface sem complicação: cole, processe e escolha.',
    'benefit.responsive': 'Responsivo',
    'benefit.responsiveText': 'Funciona em celular, tablet e computador.',
    'benefit.privacy': 'Privacidade',
    'benefit.privacyText': 'Não solicitamos informações pessoais desnecessárias.',
    'benefit.accessible': 'Acessível',
    'benefit.accessibleText': 'Ferramenta básica disponível sem barreiras de cadastro.',
    'benefit.secure': 'Seguro',
    'benefit.secureText':
      'Validação no servidor e proteção contra abuso e acesso indevido.',

    'trust.1': 'Sem cadastro',
    'trust.1label': 'use direto da Home',
    'trust.2': 'Sem instalação',
    'trust.2label': '100% no navegador',
    'trust.3': 'Sem dados pessoais',
    'trust.3label': 'privacidade primeiro',
    'trust.4': 'Sempre do servidor',
    'trust.4label': 'sem proxy arbitrário',

    'faq.eyebrow': 'FAQ',
    'faq.title': 'Perguntas frequentes',
    'faq.sub': 'Respostas diretas para as dúvidas mais comuns.',
    'faq.q1': 'Como baixar um vídeo?',
    'faq.a1':
      'Cole a URL pública do vídeo no campo principal, clique em "Processar URL" e escolha uma das opções disponíveis apresentadas.',
    'faq.q2': 'Quais plataformas são compatíveis?',
    'faq.a2':
      'Trabalhamos com URLs públicas de plataformas como YouTube, Facebook, Instagram, TikTok, Kwai, Pinterest, X e Reddit. A disponibilidade real depende das permissões de cada conteúdo.',
    'faq.q3': 'Preciso instalar algum programa?',
    'faq.a3':
      'Não. Tudo acontece no navegador. Você cola a URL, processa e escolhe a opção disponível diretamente no site.',
    'faq.q4': 'Funciona no celular?',
    'faq.a4':
      'Sim. A interface é desenvolvida primeiro para celular e funciona em qualquer tamanho de tela, do smartphone ao desktop.',
    'faq.q5': 'Posso baixar imagens?',
    'faq.a5':
      'Em algumas plataformas, imagens disponíveis publicamente podem ser processadas. A disponibilidade varia conforme a plataforma e as permissões do conteúdo.',
    'faq.q6': 'O serviço é gratuito?',
    'faq.a6':
      'A ferramenta básica está disponível de forma gratuita, sem cadastro. Não prometemos funcionalidades pagas adicionais no momento.',
    'faq.q7': 'Por que algumas URLs não funcionam?',
    'faq.a7':
      'Vários motivos podem impedir o processamento: conteúdo privado, proteções técnicas, restrições da plataforma ou indisponibilidade temporária. Nesses casos mostramos uma mensagem amigável.',
    'faq.q8': 'Por que determinado formato não aparece?',
    'faq.a8':
      'Só exibimos formatos e qualidades reais do conteúdo. Se uma opção não aparece, significa que ela não está tecnicamente disponível para aquele item.',
    'faq.q9': 'O conteúdo fica armazenado no servidor?',
    'faq.a9':
      'Arquivos temporários são criados apenas durante o processamento e removidos automaticamente após o período necessário. Não mantemos downloads indefinidamente.',
    'faq.q10': 'Posso baixar qualquer conteúdo?',
    'faq.a10':
      'Não. Use a ferramenta somente para conteúdos que você possui, tem autorização para utilizar ou cujo download seja permitido pelos termos da plataforma.',
    'faq.q11': 'O que devo fazer se tenho direitos sobre o conteúdo?',
    'faq.a11':
      'Entre em contato pela página de Contato detalhando o caso. Tratamos questões de direitos com a responsabilidade adequada.',
    'faq.q12': 'Por quanto tempo os arquivos ficam disponíveis?',
    'faq.a12':
      'Arquivos temporários têm vida curta por segurança e são excluídos automaticamente. Baixe o que precisa enquanto a opção estiver disponível.',

    'cta.title': 'Pronto para começar?',
    'cta.sub': 'Cole sua primeira URL e veja o que está disponível em segundos.',
    'cta.btn': 'Cole sua URL agora',

    'footer.desc':
      'Ferramenta simples para processar URLs públicas e oferecer opções de download quando permitido.',
    'footer.tool': 'Ferramenta',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.link.privacy': 'Privacidade',
    'footer.link.terms': 'Termos de Uso',
    'footer.link.cookies': 'Cookies',
    'footer.disclaimer':
      'Este serviço não possui afiliação, associação ou endosso oficial pelas plataformas mencionadas.',

    'cookies.title': 'Nós utilizamos cookies',
    'cookies.desc':
      'Utilizamos cookies necessários para funcionamento e, quando autorizado, cookies de análise e publicidade para melhorar sua experiência.',
    'cookies.accept': 'Aceitar',
    'cookies.reject': 'Recusar',
    'cookies.config': 'Configurar',
    'cookies.modal.title': 'Preferências de cookies',
    'cookies.modal.desc':
      'Escolha quais cookies você autoriza. Os essenciais não podem ser desativados.',
    'cookies.modal.necessary': 'Essenciais',
    'cookies.modal.necessaryDesc': 'Necessário para o funcionamento do site.',
    'cookies.modal.analytics': 'Analíticos',
    'cookies.modal.advertising': 'Publicidade',
    'cookies.modal.cancel': 'Cancelar',
    'cookies.modal.save': 'Salvar preferências',

    'result.select': 'Selecione uma opção',
    'result.video': 'Vídeo',
    'result.audio': 'Áudio MP3',
    'result.image': 'Imagem',
    'result.best': 'Melhor qualidade',
    'result.audioMusic': 'Música (MP3)',
    'result.original': 'Original',
    'result.downloadVideo': 'Baixar vídeo',
    'result.downloadAudio': 'Baixar áudio',
    'result.downloadImage': 'Baixar imagem',
    'result.sizeUnknown': 'Tamanho não informado',
    'result.sizeApprox': 'aprox.',
    'demo.note': 'Demonstração visual — nenhum download real é gerado',
    'demo.done': 'Demonstração — sem download real',
    'loading.analyzing': 'Analisando URL…',
    'loading.preparing': 'Preparando opções…',

    'error.url-invalid': 'URL inválida. Verifique o link colado e tente novamente.',
    'error.content-private':
      'Conteúdo privado. Este vídeo ou mídia está marcado como privado e não pode ser processado.',
    'error.platform-unsupported':
      'Plataforma indisponível. Esta plataforma ainda não é suportada ou está temporariamente indisponível.',
    'error.process-failed':
      'Não foi possível processar o conteúdo. O formato não é suportado ou o conteúdo está protegido. Tente outra URL.',
    'error.busy':
      'Limite temporário atingido. Muitas solicitações ao mesmo tempo. Aguarde alguns segundos e tente novamente.',
    'error.too-large': 'Arquivo grande demais. Este conteúdo excede o tamanho máximo permitido.',
    'error.timeout': 'Tempo esgotado. O processamento demorou demais. Tente novamente em instantes.',
    'error.default': 'Não conseguimos processar esta URL. Tente novamente ou verifique se o conteúdo está disponível.',
    'error.retry': 'Tentar novamente',
  },

  en: {
    'nav.home': 'Home',
    'nav.how': 'How it works',
    'nav.platforms': 'Platforms',
    'nav.faq': 'FAQ',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Get started',
    'header.theme': 'Toggle light and dark theme',
    'header.menu': 'Open menu',
    'header.lang': 'Choose language',

    'hero.badge': 'Simple downloads',
    'hero.title': 'Paste. Process.',
    'hero.titleAccent': 'Download.',
    'hero.sub':
      'Paste a public URL, process the content and choose an available option to download.',
    'hero.placeholder': 'Paste the URL here',
    'hero.paste': 'Paste',
    'hero.process': 'Process URL',
    'hero.demoHint': 'The actual download depends on the content.',
    'hero.demoBtn': 'See a visual demo of the result',
    'hero.legal':
      'Only use this tool to download content you own, are authorized to use, or whose download is permitted by the respective platform terms.',

    'platforms.eyebrow': 'Platforms',
    'platforms.title': 'Supported platforms',
    'platforms.sub':
      'We process public URLs from the main platforms, always according to each content permissions.',
    'platforms.public': 'Public URLs',
    'platforms.disclaimer':
      'Availability may vary depending on the platform characteristics and the content permissions.',

    'how.eyebrow': 'How it works',
    'how.title': 'Three simple steps',
    'how.sub': 'No sign-up, no installation and no hassle.',
    'how.step1': 'Paste the URL',
    'how.step1text': 'Copy the public URL of the content you want.',
    'how.step2': 'Process',
    'how.step2text': 'Paste it into the field and click process.',
    'how.step3': 'Choose',
    'how.step3text': 'Select an available option and download.',

    'benefits.eyebrow': 'Benefits',
    'benefits.title': 'Made for you',
    'benefits.sub': 'Simplicity and performance first.',
    'benefit.fast': 'Fast',
    'benefit.fastText': 'Optimized processing to deliver options as fast as possible.',
    'benefit.simple': 'Simple',
    'benefit.simpleText': 'No-nonsense interface: paste, process and choose.',
    'benefit.responsive': 'Responsive',
    'benefit.responsiveText': 'Works on phone, tablet and computer.',
    'benefit.privacy': 'Privacy',
    'benefit.privacyText': 'We do not ask for unnecessary personal information.',
    'benefit.accessible': 'Accessible',
    'benefit.accessibleText': 'Basic tool available with no sign-up barriers.',
    'benefit.secure': 'Secure',
    'benefit.secureText': 'Server-side validation and protection against abuse and unauthorized access.',

    'trust.1': 'No sign-up',
    'trust.1label': 'use it straight from the Home',
    'trust.2': 'No installation',
    'trust.2label': '100% in the browser',
    'trust.3': 'No personal data',
    'trust.3label': 'privacy first',
    'trust.4': 'Always from the server',
    'trust.4label': 'no arbitrary proxy',

    'faq.eyebrow': 'FAQ',
    'faq.title': 'Frequently asked questions',
    'faq.sub': 'Straight answers to the most common questions.',
    'faq.q1': 'How do I download a video?',
    'faq.a1':
      'Paste the public video URL into the main field, click "Process URL" and choose one of the available options.',
    'faq.q2': 'Which platforms are supported?',
    'faq.a2':
      'We work with public URLs from platforms such as YouTube, Facebook, Instagram, TikTok, Kwai, Pinterest, X and Reddit. Actual availability depends on each content permissions.',
    'faq.q3': 'Do I need to install any program?',
    'faq.a3':
      'No. Everything happens in the browser. You paste the URL, process it and choose the available option right on the site.',
    'faq.q4': 'Does it work on mobile?',
    'faq.a4':
      'Yes. The interface is built mobile-first and works on any screen size, from smartphone to desktop.',
    'faq.q5': 'Can I download images?',
    'faq.a5':
      'On some platforms, publicly available images can be processed. Availability varies by platform and content permissions.',
    'faq.q6': 'Is the service free?',
    'faq.a6':
      'The basic tool is available for free, with no sign-up. We do not promise additional paid features at the moment.',
    'faq.q7': 'Why do some URLs not work?',
    'faq.a7':
      'Several reasons can prevent processing: private content, technical protections, platform restrictions or temporary unavailability. In these cases we show a friendly message.',
    'faq.q8': 'Why does a certain format not appear?',
    'faq.a8':
      'We only show real formats and qualities of the content. If an option does not appear, it is not technically available for that item.',
    'faq.q9': 'Is the content stored on the server?',
    'faq.a9':
      'Temporary files are created only during processing and are removed automatically after the required period. We do not keep downloads indefinitely.',
    'faq.q10': 'Can I download any content?',
    'faq.a10':
      'No. Use the tool only for content you own, are authorized to use, or whose download is permitted by the platform terms.',
    'faq.q11': 'What should I do if I hold rights to the content?',
    'faq.a11':
      'Contact us through the Contact page detailing the case. We handle rights issues with the proper responsibility.',
    'faq.q12': 'How long are the files available?',
    'faq.a12':
      'Temporary files have a short life for security and are deleted automatically. Download what you need while the option is available.',

    'cta.title': 'Ready to get started?',
    'cta.sub': 'Paste your first URL and see what is available in seconds.',
    'cta.btn': 'Paste your URL now',

    'footer.desc':
      'A simple tool to process public URLs and offer download options when allowed.',
    'footer.tool': 'Tool',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.rights': 'All rights reserved.',
    'footer.link.privacy': 'Privacy',
    'footer.link.terms': 'Terms of Use',
    'footer.link.cookies': 'Cookies',
    'footer.disclaimer':
      'This service has no affiliation, association or official endorsement by the mentioned platforms.',

    'cookies.title': 'We use cookies',
    'cookies.desc':
      'We use cookies required for operation and, when authorized, analytics and advertising cookies to improve your experience.',
    'cookies.accept': 'Accept',
    'cookies.reject': 'Decline',
    'cookies.config': 'Configure',
    'cookies.modal.title': 'Cookie preferences',
    'cookies.modal.desc': 'Choose which cookies you allow. Essential ones cannot be disabled.',
    'cookies.modal.necessary': 'Essential',
    'cookies.modal.necessaryDesc': 'Required for the site to work.',
    'cookies.modal.analytics': 'Analytics',
    'cookies.modal.advertising': 'Advertising',
    'cookies.modal.cancel': 'Cancel',
    'cookies.modal.save': 'Save preferences',

    'result.select': 'Select an option',
    'result.video': 'Video',
    'result.audio': 'MP3 Audio',
    'result.image': 'Image',
    'result.best': 'Best quality',
    'result.audioMusic': 'Music (MP3)',
    'result.original': 'Original',
    'result.downloadVideo': 'Download video',
    'result.downloadAudio': 'Download audio',
    'result.downloadImage': 'Download image',
    'result.sizeUnknown': 'Size not informed',
    'result.sizeApprox': 'approx.',
    'demo.note': 'Visual demo — no real download is generated',
    'demo.done': 'Demo — no real download',
    'loading.analyzing': 'Analyzing URL…',
    'loading.preparing': 'Preparing options…',

    'error.url-invalid': 'Invalid URL. Check the pasted link and try again.',
    'error.content-private':
      'Private content. This video or media is marked as private and cannot be processed.',
    'error.platform-unsupported':
      'Platform unavailable. This platform is not supported yet or is temporarily unavailable.',
    'error.process-failed':
      'Unable to process the content. The format is not supported or the content is protected. Try another URL.',
    'error.busy':
      'Temporary limit reached. Too many simultaneous requests. Wait a few seconds and try again.',
    'error.too-large': 'File too large. This content exceeds the maximum allowed size.',
    'error.timeout': 'Time out. The processing took too long. Try again in a moment.',
    'error.default': 'We could not process this URL. Try again or check if the content is available.',
    'error.retry': 'Try again',
  },

  es: {
    'nav.home': 'Inicio',
    'nav.how': 'Cómo funciona',
    'nav.platforms': 'Plataformas',
    'nav.faq': 'FAQ',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.cta': 'Empezar ahora',
    'header.theme': 'Cambiar tema claro y oscuro',
    'header.menu': 'Abrir menú',
    'header.lang': 'Elegir idioma',

    'hero.badge': 'Descargas simples',
    'hero.title': 'Pega. Procesa.',
    'hero.titleAccent': 'Descarga.',
    'hero.sub':
      'Pega una URL pública, procesa el contenido y elige una opción disponible para descargar.',
    'hero.placeholder': 'Pega aquí la URL',
    'hero.paste': 'Pegar',
    'hero.process': 'Procesar URL',
    'hero.demoHint': 'La descarga real depende del contenido.',
    'hero.demoBtn': 'Ver una demostración visual del resultado',
    'hero.legal':
      'Utiliza esta herramienta solo para descargar contenido que posees, tienes autorización para usar o cuya descarga esté permitida por los términos de la plataforma.',

    'platforms.eyebrow': 'Plataformas',
    'platforms.title': 'Plataformas compatibles',
    'platforms.sub':
      'Procesamos URLs públicas de las principales plataformas, siempre según los permisos de cada contenido.',
    'platforms.public': 'URLs públicas',
    'platforms.disclaimer':
      'La disponibilidad puede variar según las características de la plataforma y los permisos del contenido.',

    'how.eyebrow': 'Cómo funciona',
    'how.title': 'Tres pasos simples',
    'how.sub': 'Sin registro, sin instalación y sin complicaciones.',
    'how.step1': 'Pega la URL',
    'how.step1text': 'Copia la URL pública del contenido deseado.',
    'how.step2': 'Procesa',
    'how.step2text': 'Pégala en el campo y haz clic en procesar.',
    'how.step3': 'Elige',
    'how.step3text': 'Selecciona una opción disponible y descarga.',

    'benefits.eyebrow': 'Ventajas',
    'benefits.title': 'Pensado para ti',
    'benefits.sub': 'Simplicidad y rendimiento ante todo.',
    'benefit.fast': 'Rápido',
    'benefit.fastText': 'Procesamiento optimizado para entregar opciones lo antes posible.',
    'benefit.simple': 'Simple',
    'benefit.simpleText': 'Interfaz sin complicaciones: pega, procesa y elige.',
    'benefit.responsive': 'Adaptable',
    'benefit.responsiveText': 'Funciona en celular, tableta y computadora.',
    'benefit.privacy': 'Privacidad',
    'benefit.privacyText': 'No pedimos información personal innecesaria.',
    'benefit.accessible': 'Accesible',
    'benefit.accessibleText': 'Herramienta básica disponible sin barreras de registro.',
    'benefit.secure': 'Seguro',
    'benefit.secureText':
      'Validación en el servidor y protección contra abuso y accesos indebidos.',

    'trust.1': 'Sin registro',
    'trust.1label': 'úsala directo desde la portada',
    'trust.2': 'Sin instalación',
    'trust.2label': '100% en el navegador',
    'trust.3': 'Sin datos personales',
    'trust.3label': 'privacidad primero',
    'trust.4': 'Siempre desde el servidor',
    'trust.4label': 'sin proxy arbitrario',

    'faq.eyebrow': 'FAQ',
    'faq.title': 'Preguntas frecuentes',
    'faq.sub': 'Respuestas directas a las dudas más comunes.',
    'faq.q1': '¿Cómo descargo un video?',
    'faq.a1':
      'Pega la URL pública del video en el campo principal, haz clic en "Procesar URL" y elige una de las opciones disponibles.',
    'faq.q2': '¿Qué plataformas son compatibles?',
    'faq.a2':
      'Trabajamos con URLs públicas de plataformas como YouTube, Facebook, Instagram, TikTok, Kwai, Pinterest, X y Reddit. La disponibilidad real depende de los permisos de cada contenido.',
    'faq.q3': '¿Necesito instalar algún programa?',
    'faq.a3':
      'No. Todo ocurre en el navegador. Pegas la URL, procesas y eliges la opción disponible directamente en el sitio.',
    'faq.q4': '¿Funciona en el celular?',
    'faq.a4':
      'Sí. La interfaz está desarrollada primero para celular y funciona en cualquier tamaño de pantalla, del smartphone al escritorio.',
    'faq.q5': '¿Puedo descargar imágenes?',
    'faq.a5':
      'En algunas plataformas, las imágenes disponibles públicamente pueden procesarse. La disponibilidad varía según la plataforma y los permisos del contenido.',
    'faq.q6': '¿El servicio es gratuito?',
    'faq.a6':
      'La herramienta básica está disponible de forma gratuita, sin registro. No prometemos funciones de pago adicionales por el momento.',
    'faq.q7': '¿Por qué algunas URLs no funcionan?',
    'faq.a7':
      'Varios motivos pueden impedir el procesamiento: contenido privado, protecciones técnicas, restricciones de la plataforma o indisponibilidad temporal. En esos casos mostramos un mensaje amigable.',
    'faq.q8': '¿Por qué no aparece un formato determinado?',
    'faq.a8':
      'Solo mostramos formatos y calidades reales del contenido. Si una opción no aparece, significa que no está técnicamente disponible para ese elemento.',
    'faq.q9': '¿El contenido queda almacenado en el servidor?',
    'faq.a9':
      'Los archivos temporales se crean solo durante el procesamiento y se eliminan automáticamente tras el período necesario. No mantenemos descargas indefinidamente.',
    'faq.q10': '¿Puedo descargar cualquier contenido?',
    'faq.a10':
      'No. Usa la herramienta solo para contenidos que posees, tienes autorización para usar o cuya descarga esté permitida por los términos de la plataforma.',
    'faq.q11': '¿Qué debo hacer si tengo derechos sobre el contenido?',
    'faq.a11':
      'Contacta a través de la página de Contacto detallando el caso. Tratamos los asuntos de derechos con la responsabilidad adecuada.',
    'faq.q12': '¿Por cuánto tiempo están disponibles los archivos?',
    'faq.a12':
      'Los archivos temporales tienen una vida corta por seguridad y se eliminan automáticamente. Descarga lo que necesites mientras la opción esté disponible.',

    'cta.title': '¿Listo para empezar?',
    'cta.sub': 'Pega tu primera URL y ve lo que está disponible en segundos.',
    'cta.btn': 'Pega tu URL ahora',

    'footer.desc':
      'Una herramienta simple para procesar URLs públicas y ofrecer opciones de descarga cuando está permitido.',
    'footer.tool': 'Herramienta',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.link.privacy': 'Privacidad',
    'footer.link.terms': 'Términos de uso',
    'footer.link.cookies': 'Cookies',
    'footer.disclaimer':
      'Este servicio no tiene afiliación, asociación ni respaldo oficial de las plataformas mencionadas.',

    'cookies.title': 'Usamos cookies',
    'cookies.desc':
      'Usamos cookies necesarias para el funcionamiento y, cuando se autoriza, cookies de análisis y publicidad para mejorar tu experiencia.',
    'cookies.accept': 'Aceptar',
    'cookies.reject': 'Rechazar',
    'cookies.config': 'Configurar',
    'cookies.modal.title': 'Preferencias de cookies',
    'cookies.modal.desc': 'Elige qué cookies autorizas. Las esenciales no pueden desactivarse.',
    'cookies.modal.necessary': 'Esenciales',
    'cookies.modal.necessaryDesc': 'Necesarias para el funcionamiento del sitio.',
    'cookies.modal.analytics': 'Analíticas',
    'cookies.modal.advertising': 'Publicidad',
    'cookies.modal.cancel': 'Cancelar',
    'cookies.modal.save': 'Guardar preferencias',

    'result.select': 'Selecciona una opción',
    'result.video': 'Video',
    'result.audio': 'Audio MP3',
    'result.image': 'Imagen',
    'result.best': 'Mejor calidad',
    'result.audioMusic': 'Música (MP3)',
    'result.original': 'Original',
    'result.downloadVideo': 'Descargar video',
    'result.downloadAudio': 'Descargar audio',
    'result.downloadImage': 'Descargar imagen',
    'result.sizeUnknown': 'Tamaño no informado',
    'result.sizeApprox': 'aprox.',
    'demo.note': 'Demostración visual — no se genera ninguna descarga real',
    'demo.done': 'Demostración — sin descarga real',
    'loading.analyzing': 'Analizando URL…',
    'loading.preparing': 'Preparando opciones…',

    'error.url-invalid': 'URL no válida. Verifica el enlace pegado e inténtalo de nuevo.',
    'error.content-private':
      'Contenido privado. Este video o medio está marcado como privado y no puede procesarse.',
    'error.platform-unsupported':
      'Plataforma no disponible. Esta plataforma aún no es compatible o está temporalmente no disponible.',
    'error.process-failed':
      'No fue posible procesar el contenido. El formato no es compatible o el contenido está protegido. Prueba con otra URL.',
    'error.busy':
      'Límite temporal alcanzado. Demasiadas solicitudes a la vez. Espera unos segundos e inténtalo de nuevo.',
    'error.too-large': 'Archivo demasiado grande. Este contenido supera el tamaño máximo permitido.',
    'error.timeout': 'Tiempo agotado. El procesamiento tardó demasiado. Inténtalo de nuevo en unos momentos.',
    'error.default': 'No pudimos procesar esta URL. Inténtalo de nuevo o verifica si el contenido está disponible.',
    'error.retry': 'Intentar de nuevo',
  },
};

export function getLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved === 'pt' || saved === 'en' || saved === 'es') return saved;
  } catch {
    // storage indisponível — usa o padrão
  }
  return 'pt';
}

// Aplica o idioma salvo ao atributo lang do documento logo ao carregar.
document.documentElement.lang = getLang();

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // storage indisponível — segue sem persistir
  }
  document.documentElement.lang = lang;
  document.dispatchEvent(new Event(LANG_EVENT));
}

export function t(key: string): string {
  const lang = getLang();
  return DICT[lang][key] ?? DICT.pt[key] ?? key;
}

/** Aplica as traduções a todos os elementos marcados com data-i18n dentro de root. */
export function applyTranslations(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.setAttribute('placeholder', t(key));
  });
  root.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) el.setAttribute('aria-label', t(key));
  });
  root.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.setAttribute('title', t(key));
  });
}