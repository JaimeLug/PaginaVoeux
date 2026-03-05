// ============================================================
//  VOEUX MEDIA — Datos de Proyectos
//  Cada proyecto está indexado por su slug (ID de URL).
//  heroVideo: ruta al video hero (prioridad sobre heroImg cuando existe).
// ============================================================

const PROJECTS_DATA = {

    'ool-wellness': {
        id: 'ool-wellness',
        brand: 'OOL WELLNESS FOR ALL',
        title: 'RETREAT OOL WELLNESS',
        description: [
            'Estuvimos presentes en el primer retiro wellness de OOL Wellness For All, una experiencia de tres días realizada en Hotel Xcaret Arte, diseñada para conectar movimiento, bienestar y comunidad.',
            'Desarrollamos cobertura fotográfica y audiovisual completa, incluyendo tomas aéreas con dron, para capturar la diversidad de actividades: cycling, entrenamiento funcional, dinámicas acuáticas, gastronomía y talleres. El enfoque fue transmitir equilibrio entre energía y contemplación, mostrando la experiencia desde dentro.',
            'La cobertura se realizó en tiempo real, con entrega inmediata de fotografías y video listos para redes sociales, además del manejo activo de las plataformas durante el evento. Esto permitió generar interacción orgánica, mantener conversación constante y fortalecer el sentido de comunidad mientras el retiro seguía en curso.'
        ],
        highlight: 'Más que documentar un evento, amplificamos una experiencia.',
        mediaSlug: 'retreat_ool_wellness'
    },

    'red-bull': {
        id: 'red-bull',
        brand: 'RED BULL',
        title: 'RUTAS',
        description: [
            'Para Red Bull desarrollamos rutas de cobertura fotográfica y audiovisual en puntos de venta estratégicos en Ciudad de México y la Península.',
            'El objetivo fue documentar la presencia activa de la marca en territorio, capturando su energía en eventos, activaciones y espacios comerciales. Más allá de registrar, construimos una narrativa visual que proyecta dinamismo, impacto y conexión directa con el consumidor.',
            'A través de fotografía y video, mostramos cómo la marca vive en cada punto, adaptándose al entorno y manteniendo su fuerza visual en cualquier escenario.'
        ],
        highlight: null,
        mediaSlug: 'ruta_redbull'
    },

    'circulo-dorado': {
        id: 'circulo-dorado',
        brand: 'TOLKA',
        title: 'CÍRCULO DORADO',
        description: [
            'En Ciudad de México realizamos la cobertura audiovisual del Festival Círculo de Oro 2026, un encuentro que reconoce a lo mejor del mundo de la producción y las agencias de marketing en México.',
            'Con nuestro equipo en campo desarrollamos fotografía y video recap, documentando premiaciones, intervenciones en escenario, networking y la energía de una industria que celebra creatividad, estrategia e innovación.'
        ],
        highlight: null,
        mediaSlug: 'circulo_dorado'
    },

    'att': {
        id: 'att',
        brand: 'TOLKA',
        title: 'AT&T',
        description: [
            'Para TOLKA, agencia especializada en experiencias BTL, realizamos la cobertura audiovisual integral del evento de AT&T en la Riviera Maya, un encuentro que reunió a los 700 mejores vendedores de México.',
            'Durante tres días documentamos tanto el proceso de montaje como la ejecución completa del evento, capturando desde la transformación del espacio hasta la experiencia en vivo. Registramos logística, producción, reconocimiento, interacción y momentos clave que definieron la magnitud del encuentro.',
            'Desarrollamos fotografía y video recap con un enfoque dinámico y preciso, condensando la energía, la escala y la relevancia corporativa del evento en una narrativa clara y estratégica.'
        ],
        highlight: null,
        mediaSlug: 'att'
    },

    'multimedios': {
        id: 'multimedios',
        brand: 'TOLKA',
        title: 'MULTIMEDIOS',
        description: [
            'En Ciudad de México realizamos la cobertura audiovisual del aniversario de Multimedios, producido por TOLKA bajo el concepto "Oasis", un multiverso físico y digital que fusionaba distintas dimensiones representando cada unidad de negocio de la marca.',
            'Desarrollamos fotografía y video recap documentando los mundos creados para el evento, desde la experiencia inmersiva de acceso hasta los shows, escenarios y activaciones que transformaron el espacio en una narrativa tridimensional.'
        ],
        highlight: null,
        mediaSlug: 'multimedios_tolka'
    },

    'power-flow': {
        id: 'power-flow',
        brand: 'POWER&FLOW',
        title: 'THE COLLECTIVE',
        description: [
            'Desde Phoenix, Arizona, documentamos el quinto aniversario de Power & Flow, el estudio fundado por Kristina Girod, reconocida por crear experiencias de alta energía que fortalecen cuerpo y comunidad.',
            'Durante cinco días realizamos cobertura fotográfica y audiovisual en vivo, capturando clases, dinámicas, coaches invitados y la conexión real entre asistentes. El enfoque fue transmitir intensidad, movimiento y la fuerza colectiva que define al estudio.',
            'La entrega de fotografía y video se realizó en tiempo real, generando contenido listo para redes sociales mientras el evento seguía en curso. Más que documentar, construimos una narrativa inmediata que amplificó el impacto del aniversario en el momento exacto en que estaba sucediendo.'
        ],
        highlight: null,
        mediaSlug: 'the_collective'
    },

    'byd-club': {
        id: 'byd-club',
        brand: 'BYD',
        title: 'BYD CLUB',
        description: [
            'Voeux Media estuvo presente en la cobertura de BYD Club Quintana Roo, un encuentro que reunió a entusiastas de la tecnología, la movilidad eléctrica y la adrenalina en un fin de semana de experiencias y conexión.',
            'Realizamos cobertura fotográfica y audiovisual integral, incluyendo tomas aéreas con dron y entrevistas en sitio. Documentamos pruebas de manejo, interacción con la marca, comunidad activa y momentos clave de venta, capturando tanto la emoción como el impacto comercial del evento.',
            'El enfoque fue mostrar cómo la innovación se vive en territorio: movimiento, conversación y decisión en tiempo real. Más que registrar actividades, construimos una narrativa que proyecta energía, avance y comunidad alrededor de la marca.'
        ],
        highlight: null,
        mediaSlug: 'byd_club'
    },

    'xcaret-xtar': {
        id: 'xcaret-xtar',
        brand: 'XCARET XTAR',
        title: 'XTAR AWARDS',
        description: [
            'Los XTAR Awards son el reconocimiento más importante dentro del ecosistema de Grupo Xcaret, una ceremonia que celebra la excelencia, el compromiso y la identidad de quienes hacen posible cada experiencia dentro de sus destinos.',
            'Fuimos convocados para desarrollar la cobertura audiovisual completa del evento: desde los momentos previos al escenario hasta las premiaciones y la celebración. El enfoque fue documentar no solo el acto formal del reconocimiento, sino la emoción humana que lo rodea: el orgullo, la comunidad y el sentido de pertenencia.',
            'El resultado fue una narrativa visual que refleja los valores de la marca y honra a sus protagonistas con la precisión y la energía que un evento de esta magnitud merece.'
        ],
        highlight: 'Cada galardón tiene una historia. Nosotros la contamos.',
        heroVideo: 'videos/xcaret_xtar.mp4',
        mediaSlug: 'xcaret_xtar',
        brandLogo: 'imagenes/Logo_Xcaret_Xtar.png'
    },

    'xcaret-lealtad': {
        id: 'xcaret-lealtad',
        brand: 'XCARET',
        title: 'XCARET LEALTAD',
        description: [
            'Para Grupo Xcaret desarrollamos la cobertura audiovisual de su programa de lealtad, una estrategia diseñada para fortalecer el vínculo entre la marca y sus visitantes más comprometidos.',
            'Documentamos las activaciones, experiencias exclusivas y momentos de reconocimiento que forman parte del programa, capturando la autenticidad de cada interacción. El objetivo fue mostrar cómo la fidelidad se convierte en experiencia tangible dentro de los destinos de Xcaret.',
            'Con una narrativa visual limpia y una paleta cercana a la identidad de la marca, entregamos contenido listo para comunicar valor, pertenencia y continuidad en cada plataforma.'
        ],
        highlight: null,
        heroVideo: 'videos/xcaret_lealtad.mp4',
        mediaSlug: 'xcaret_lealtad',
        brandLogo: 'imagenes/Logo_Xcaret.png'
    },

    'xaak': {
        id: 'xaak',
        brand: 'XAAK',
        title: 'REAPERTURA',
        description: [
            'Xaak Hotels es una marca que nació para redefinir la hospitalidad de lujo en el Caribe mexicano. Fuimos parte de su reapertura: un momento clave que marcó el regreso de una experiencia diseñada para quienes buscan algo más que un resort.',
            'Desarrollamos la cobertura audiovisual del evento de reapertura, documentando la puesta en escena, los espacios, las interacciones y la energía de un relanzamiento que mezcló elegancia, identidad y destino.',
            'Más que registrar un evento, construimos la primera narrativa visual del Xaak en su nueva etapa: una historia de apertura, movimiento y hospitalidad que se proyecta hacia el futuro.'
        ],
        highlight: 'El inicio de una nueva historia, contado en imágenes.',
        heroVideo: 'videos/xaak_reapertura.mp4',
        mediaSlug: 'xaak',
        brandLogo: 'imagenes/Logo__Xaak.png'
    },

    'power-mas-flow': {
        id: 'power-mas-flow',
        brand: 'POWER+FLOW',
        title: 'POWER MAS FLOW',
        description: [
            'Power+Flow es más que un estudio de fitness: es una comunidad construida sobre intensidad, movimiento y conexión real. Realizamos la cobertura audiovisual de una de sus temporadas de clases, capturando la energía que define a la marca en cada sesión.',
            'Documentamos coaches, asistentes y dinámicas grupales desde adentro, con un enfoque que prioriza la autenticidad por encima del formato. El resultado es contenido que transmite lo que se siente estar ahí: ritmo, sudor, comunidad.',
            'La entrega fue diseñada para redes sociales, con piezas de corta duración que mantienen la intensidad del estudio en cada segundo de reproducción.'
        ],
        highlight: null,
        heroVideo: 'videos/powermasflow.mp4',
        mediaSlug: 'power_mas_flow',
        brandLogo: 'imagenes/Logo__Power.png'
    }

};

