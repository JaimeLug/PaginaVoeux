// ============================================================
//  VOEUX MEDIA — Datos de Proyectos
//  Cada proyecto está indexado por su slug (ID de URL).
//  heroVideo: ruta al video hero (prioridad sobre heroImg cuando existe).
// ============================================================

const PROJECTS_DATA = {

    'ool-wellness': {
        id: 'ool-wellness',
        order: 1,
        coverPositionY: '30%', // <-- Ajusta el encuadre vertical (e.g., 'top', 'bottom', '20%', 'center')
        brand: 'Ool wellness for',
        client: 'Ool Wellness For All',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL, GESTIÓN DE REDES SOCIALES, VUELO DE DRONE, REDACCIÓN DE COPYS',
        year: '2025',
        title: 'RETREAT OOL WELLNESS',
        gridSpan: 2,
        description: [
            'Estuvimos presentes en el primer Retiro OOL Wellness For All, una experiencia de tres días realizada en Hotel Xcaret Arte, diseñada para conectar movimiento, bienestar y comunidad.',
            'Nuestro equipo desarrolló cobertura fotográfica y audiovisual completa, incluyendo tomas aéreas, capturando la energía de sesiones de cycling, entrenamiento funcional, actividades acuáticas, talleres y experiencias gastronómicas.',
            'El contenido fue producido y entregado en tiempo real, permitiendo ampliar la experiencia en plataformas digitales mientras el retiro se desarrollaba. En Voeux Media no solo documentamos eventos; transformamos experiencias en narrativas visuales.'
        ],
        highlight: 'Más que documentar un evento, amplificamos una experiencia.',
        mediaSlug: 'retreat_ool_wellness',
        content_blocks: [
            {
                type: 'vertical-video-carousel',
                videos: ['1171853513', '1171853478', '1171853297', '1171853546', '1171852659', '1171852676', '1171852612']
            },
            {
                type: 'photo-grid',
                images: [
                    'imagenes/retreat_ool_wellness/Voeux-Ool-13.jpg',
                    'imagenes/retreat_ool_wellness/Voeux-Ool-15.jpg',
                    'imagenes/retreat_ool_wellness/Voeux-Ool-50.jpg',
                    'imagenes/retreat_ool_wellness/Voeux-Ool-61.jpg',
                    'imagenes/retreat_ool_wellness/Voeux-Ool-86.jpg',
                    'imagenes/retreat_ool_wellness/VoeuxM-Ool-10.jpg',
                    'imagenes/retreat_ool_wellness/VoeuxM-Ool-33.jpg',
                    'imagenes/retreat_ool_wellness/VoeuxM-Ool-36.jpg',
                    'imagenes/retreat_ool_wellness/VoeuxM-Ool-5.jpg',
                    'imagenes/retreat_ool_wellness/VoeuxMedia_Ool-42.jpg'
                ]
            }
        ]
    },

    'red-bull': {
        id: 'red-bull',
        order: 2,
        brand: 'Red Bull',
        client: 'Red Bull CDMX y Red Bull Península',
        services: 'Fotografía, Video',
        year: '2025-2026',
        title: 'RUTAS',
        description: [
            'Desarrollamos rutas de cobertura fotográfica y audiovisual en puntos de venta estratégicos en Ciudad de México y la Península.',
            'El objetivo fue documentar la presencia activa de la marca en territorio, capturando su energía en eventos, activaciones y espacios comerciales. Más allá de registrar, construimos una narrativa visual que proyecta dinamismo, impacto y conexión directa con el consumidor.',
            'A través de fotografía y video, mostramos cómo la marca vive en cada punto, adaptándose al entorno y manteniendo su fuerza visual en cualquier escenario.'
        ],
        highlight: null,
        mediaSlug: 'ruta_redbull',
        content_blocks: [
            {
                type: 'photo-grid',
                images: [
                    'imagenes/ruta_redbull/RedBull_CDMX_DIC2025_4-3.jpg',
                    'imagenes/ruta_redbull/VœuxMedia_RedBullOct-89.jpg',
                    'imagenes/ruta_redbull/VœuxMedia_RedBullSorryPapi-39.jpg'
                ]
            }
        ]
    },

    'circulo-dorado': {
        id: 'circulo-dorado',
        order: 3,
        brand: 'Tolka',
        client: 'Tolka',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL',
        year: '2026',
        title: 'CÍRCULO DORADO',
        description: [
            'En Ciudad de México realizamos la cobertura audiovisual del Festival Círculo de Oro 2026, un encuentro que reconoce a lo mejor del mundo de la producción y las agencias de marketing en México.',
            'Con nuestro equipo en campo desarrollamos fotografía y video recap, documentando premiaciones, intervenciones en escenario, networking y la energía de una industria que celebra creatividad, estrategia e innovación.'
        ],
        highlight: null,
        mediaSlug: 'circulo_dorado',
        content_blocks: [
            {
                type: 'photo-grid',
                images: [
                    'imagenes/circulo_dorado/FestivalCirculoDeOro.jpg',
                    'imagenes/circulo_dorado/FestivalCirculoDeOro2026-50.jpg',
                    'imagenes/circulo_dorado/FestivalCirculoDeOro2026_2-3.jpg',
                    'imagenes/circulo_dorado/FestivalCirculoDeOro2026_3-19.jpg',
                    'imagenes/circulo_dorado/FestivalCirculoDeOro2026_3-4.jpg',
                    'imagenes/circulo_dorado/FestivalCirculoDeOro2026_3-78.jpg'
                ]
            }
        ]
    },

    'att': {
        id: 'att',
        order: 4,
        brand: 'Tolka',
        client: 'Tolka',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL',
        year: '2025',
        title: 'AT&T',
        gridSpan: 2,
        description: [
            'Para TOLKA, agencia especializada en experiencias BTL, realizamos la cobertura audiovisual integral del evento de AT&T en la Riviera Maya, un encuentro que reunió a los 700 mejores vendedores de México.',
            'Durante tres días documentamos tanto el proceso de montaje como la ejecución completa del evento, capturando desde la transformación del espacio hasta la experiencia en vivo. Registramos logística, producción, reconocimiento, interacción y momentos clave que definieron la magnitud del encuentro.',
            'Desarrollamos fotografía y video recap con un enfoque dinámico y preciso, condensando la energía, la escala y la relevancia corporativa del evento en una narrativa clara y estratégica.'
        ],
        highlight: null,
        mediaSlug: 'att',
        content_blocks: []
    },

    'multimedios': {
        id: 'multimedios',
        order: 5,
        brand: 'Tolka',
        client: 'Tolka',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL',
        year: '2025',
        title: 'MULTIMEDIOS',
        description: [
            'Cobertura audiovisual del aniversario de Multimedios, producido por TOLKA bajo el concepto "Oasis", un multiverso físico y digital que fusionaba distintas dimensiones representando cada unidad de negocio de la marca.',
            'Desarrollamos fotografía y video recap documentando los mundos creados para el evento, desde la experiencia inmersiva de acceso hasta los shows, escenarios y activaciones que transformaron el espacio en una narrativa tridimensional.'
        ],
        highlight: null,
        mediaSlug: 'multimedios_tolka',
        content_blocks: [
            {
                type: 'photo-grid',
                images: [
                    'imagenes/multimedios_tolka/Multimedios_-29.jpg'
                ]
            }
        ]
    },

    'power-flow': {
        id: 'power-flow',
        order: 6,
        brand: 'Power&Flow',
        client: 'Power&Flow',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL, VUELO DE DRONE',
        year: '2025',
        title: 'THE COLLECTIVE',
        description: [
            'Desde Phoenix, Arizona, documentamos el quinto aniversario de Power & Flow, el estudio fundado por Kristina Girod, reconocida por crear experiencias de alta energía que fortalecen cuerpo y comunidad.',
            'Durante cinco días realizamos cobertura fotográfica y audiovisual en vivo, capturando clases, dinámicas, coaches invitados y la conexión real entre asistentes. El enfoque fue transmitir intensidad, movimiento y la fuerza colectiva que define al estudio.',
            'La entrega de fotografía y video se realizó en tiempo real, generando contenido listo para redes sociales mientras el evento seguía en curso. Más que documentar, construimos una narrativa inmediata que amplificó el impacto del aniversario en el momento exacto en que estaba sucediendo.'
        ],
        highlight: null,
        mediaSlug: 'the_collective',
        content_blocks: []
    },

    'byd-club': {
        id: 'byd-club',
        order: 7,
        brand: 'BYD',
        client: 'BYD',
        services: 'FOTOGRAFÍA, VIDEO, EDICIÓN EN TIEMPO REAL, VUELO DE DRONE',
        year: '2025',
        title: 'BYD CLUB',
        description: [
            'Voeux Media estuvo presente en la cobertura de BYD Club Quintana Roo, un encuentro que reunió a entusiastas de la tecnología, la movilidad eléctrica y la adrenalina en un fin de semana de experiencias y conexión.',
            'Realizamos cobertura fotográfica y audiovisual integral, incluyendo tomas aéreas con dron y entrevistas en sitio. Documentamos pruebas de manejo, interacción con la marca, comunidad activa y momentos clave de venta, capturando tanto la emoción como el impacto comercial del evento.',
            'El enfoque fue mostrar cómo la innovación se vive en territorio: movimiento, conversación y decisión en tiempo real. Más que registrar actividades, construimos una narrativa que proyecta energía, avance y comunidad alrededor de la marca.'
        ],
        highlight: null,
        mediaSlug: 'byd_club',
        content_blocks: [
            {
                type: 'photo-grid',
                images: [
                    'imagenes/byd_club/BYDTestDrive2025-PDC-2-11.jpg',
                    'imagenes/byd_club/BYDTestDrive2025-PDC-2-27.jpg',
                    'imagenes/byd_club/BYDTestDrive2025-PDC-2-30.jpg',
                    'imagenes/byd_club/BYDTestDrive2025-PDC-3.jpg',
                    'imagenes/byd_club/BYDTestDrive2025-PDC-8.jpg',
                    'imagenes/byd_club/C8888T01.JPG'
                ]
            }
        ]
    },

    'xaak': {
        id: 'xaak',
        order: 8,
        brand: 'Xcaret',
        client: 'Hotel Xcaret Arte',
        services: 'Fotografía, Video',
        year: '2026',
        title: 'REAPERTURA',
        gridSpan: 2,
        description: [
            'Estuvimos presentes en la reapertura de Xaak, el restaurante de Hotel Xcaret Arte, donde la Chef Karime López presentó un nuevo menú degustación que parte del origen y del ingrediente como esencia de la experiencia culinaria.',
            'Nuestro equipo realizó cobertura fotográfica y audiovisual de la inauguración, capturando la atmósfera del evento y los detalles que definen esta propuesta gastronómica.'
        ],
        highlight: 'El inicio de una nueva historia, contado en imágenes.',
        heroVimeoId: '1170836491',
        mediaSlug: 'xaak',
        brandLogo: 'imagenes/Logo__Xaak.png',
        content_blocks: [
            {
                type: 'vertical-video-carousel',
                videos: ['1170836491']
            },
            {
                type: 'photo-grid',
                images: [
                    'imagenes/xaak/poster.png',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-18.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-2.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-32.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-42.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-53.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-68.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-79.jpg',
                    'imagenes/xaak/VœuxMedia_ReaperturaXaakHXA-97.jpg'
                ]
            }
        ]
    },

    'xcaret-xtar': {
        id: 'xcaret-xtar',
        order: 9,
        brand: 'XCARET XTAR',
        title: 'XTAR AWARDS',
        description: [
            'Los XTAR Awards son el reconocimiento más importante dentro del ecosistema de Grupo Xcaret, una ceremonia que celebra la excelencia, el compromiso y la identidad de quienes hacen posible cada experiencia dentro de sus destinos.',
            'Fuimos convocados para desarrollar la cobertura audiovisual completa del evento: desde los momentos previos al escenario hasta las premiaciones y la celebración. El enfoque fue documentar no solo el acto formal del reconocimiento, sino la emoción humana que lo rodea: el orgullo, la comunidad y el sentido de pertenencia.',
            'El resultado fue una narrativa visual que refleja los valores de la marca y honra a sus protagonistas con la precisión y la energía que un evento de esta magnitud merece.'
        ],
        highlight: 'Cada galardón tiene una historia. Nosotros la contamos.',
        heroVimeoId: '1170429174',
        mediaSlug: 'xcaret_xtar',
        brandLogo: 'imagenes/Logo_Xcaret_Xtar.png',
        content_blocks: [
            { type: 'horizontal-video', vimeoId: '1170429174' },
            {
                type: 'photo-grid',
                images: ['imagenes/xcaret_xtar/poster.png']
            }
        ]
    },

    'xcaret-lealtad': {
        id: 'xcaret-lealtad',
        order: 10,
        brand: 'XCARET',
        title: 'XCARET LEALTAD',
        gridSpan: 2,
        description: [
            'Para Grupo Xcaret desarrollamos la cobertura audiovisual de su programa de lealtad, una estrategia diseñada para fortalecer el vínculo entre la marca y sus visitantes más comprometidos.',
            'Documentamos las activaciones, experiencias exclusivas y momentos de reconocimiento que forman parte del programa, capturando la autenticidad de cada interacción. El objetivo fue mostrar cómo la fidelidad se convierte en experiencia tangible dentro de los destinos de Xcaret.',
            'Con una narrativa visual limpia y una paleta cercana a la identidad de la marca, entregamos contenido listo para comunicar valor, pertenencia y continuidad en cada plataforma.'
        ],
        highlight: null,
        heroVimeoId: '1170429044',
        mediaSlug: 'xcaret_lealtad',
        brandLogo: 'imagenes/Logo_Xcaret.png',
        content_blocks: [
            { type: 'horizontal-video', vimeoId: '1170429044' },
            {
                type: 'photo-grid',
                images: ['imagenes/xcaret_lealtad/poster.png']
            }
        ]
    },

    'power-mas-flow': {
        id: 'power-mas-flow',
        order: 11,
        brand: 'POWER&FLOW',
        title: 'POWER AND FLOW',
        description: [
            'Power&Flow es más que un estudio de fitness: es una comunidad construida sobre intensidad, movimiento y conexión real. Realizamos la cobertura audiovisual de una de sus temporadas de clases, capturando la energía que define a la marca en cada sesión.',
            'Documentamos coaches, asistentes y dinámicas grupales desde adentro, con un enfoque que prioriza la autenticidad por encima del formato. El resultado es contenido que transmite lo que se siente estar ahí: ritmo, sudor, comunidad.',
            'La entrega fue diseñada para redes sociales, con piezas de corta duración que mantienen la intensidad del estudio en cada segundo de reproducción.'
        ],
        highlight: null,
        heroVimeoId: '1170428872',
        mediaSlug: 'power_mas_flow',
        brandLogo: 'imagenes/Logo__Power.png',
        content_blocks: [
            { type: 'horizontal-video', vimeoId: '1170428872' },
            {
                type: 'vertical-video-carousel',
                videos: ['1170845935']
            },
            {
                type: 'photo-grid',
                images: ['imagenes/power_mas_flow/poster.png']
            }
        ]
    }

};
