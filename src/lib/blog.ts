export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    category: string;
    publishedAt: string;
    readingTime: number; // minutos
    content: string; // HTML string
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'ideas-romanticas-san-valentin',
        title: 'Ideas románticas para San Valentín que nunca olvidará',
        description:
            'Descubre 15 ideas originales para sorprender a tu pareja en San Valentín, desde detalles sencillos hasta gestos que recordará toda la vida.',
        category: 'San Valentín',
        publishedAt: '2025-01-15',
        readingTime: 6,
        content: `
<p>San Valentín es una oportunidad única para demostrarle a esa persona especial cuánto la quieres. Pero con tanta presión por "hacer algo especial", muchas veces terminamos en el mismo restaurante de siempre o con el mismo ramo de flores de costumbre. Este año, te proponemos ideas que realmente van a sorprender.</p>

<h2>1. Crea una página web personalizada</h2>
<p>Una de las ideas más originales y modernas es crear una página web dedicada a esa persona. Imagina que abren el link y ven su nombre, un mensaje de amor escrito por ti, animaciones de corazones cayendo y hasta música de fondo. Plataformas como <a href="/create">Love Pages</a> te permiten hacerlo en minutos, sin saber programar, y de forma completamente gratis. El efecto sorpresa está garantizado.</p>

<h2>2. El desayuno en la cama perfecto</h2>
<p>No subestimes el poder de un desayuno bien preparado. No tiene que ser elaborado: con café o té, fruta fresca, tostadas y una nota escrita a mano ya tienes algo mucho más significativo que cualquier regalo caro. Lo importante es el detalle de prepararlo tú mismo y servirlo antes de que se despierte.</p>

<h2>3. Recrear su primera cita</h2>
<p>¿Recuerdas dónde se conocieron o cuál fue su primera cita? Volver a ese lugar, o recrear la experiencia en casa (con los mismos platos, la misma música, incluso la misma ropa si es posible), es un gesto increíblemente romántico que demuestra que esos momentos siguen siendo importantes para ti.</p>

<h2>4. Una caja de recuerdos</h2>
<p>Reúne pequeños objetos que representen momentos importantes de su relación: entradas de cine, fotos impresas, notas, souvenirs de viajes. Colócalos en una caja bonita con una carta explicando qué significa cada cosa. Es un regalo que se puede guardar para siempre.</p>

<h2>5. Noche de estrellas en casa</h2>
<p>Si tienes una terraza o jardín, monta una cena bajo las estrellas. Con mantas, velas y música suave ya tienes una experiencia memorable. Si no tienes espacio exterior, puedes proyectar estrellas en el techo con una lámpara de proyección estelar y crear la misma atmósfera.</p>

<h2>6. Una lista de "50 razones por las que te amo"</h2>
<p>Siéntate y escribe 50 razones por las que amas a esa persona. No tienen que ser grandes cosas: puede ser "porque siempre pones el tapón del dentífrico" o "porque te ríes con toda la boca". Lo importante es que sean genuinas y específicas. Puedes imprimirla o incorporarla en una página de Love Pages con un diseño especial.</p>

<h2>7. Una sesión de fotos improvisada</h2>
<p>No necesitas contratar un fotógrafo profesional. Con un buen teléfono y buena luz natural, pueden tomarse fotos juntos en un lugar especial. Las fotos son recuerdos que duran para siempre, y el proceso de tomarlas es divertido en sí mismo.</p>

<h2>8. Clases de algo que siempre quisieron aprender</h2>
<p>Regala la experiencia de aprender algo juntos: cerámica, cocina de sushi, tango, pintura, mezcla de cócteles. Las experiencias compartidas fortalecen el vínculo y crean recuerdos duraderos. Muchas plataformas online ofrecen estas clases, por lo que ni siquiera necesitas salir de casa.</p>

<h2>9. El reto del "no-teléfono"</h2>
<p>Dedica todo un día sin teléfonos. Suena simple, pero en la práctica es un regalo enorme. Cuando no hay distracciones digitales, la conexión que se crea es mucho más profunda. Decidan juntos cómo quieren pasar ese día: un paseo, cocinar juntos, jugar juegos de mesa, conversar.</p>

<h2>10. Una playlist personalizada</h2>
<p>Crea una playlist de Spotify o YouTube con canciones que tienen significado especial para la relación. Agrega canciones de su primera cita, canciones que escuchan cuando manejan juntos, canciones que los recuerdan el uno al otro. Es un regalo que pueden escuchar durante meses.</p>

<h2>11. Desafío de recetas en pareja</h2>
<p>Elijan una receta complicada que nunca hayan intentado hacer juntos y pásense la tarde tratando de hacerla. No importa si el resultado no es perfecto: el proceso de reír juntos, cometer errores y al final comer lo que cocinaron es la experiencia.</p>

<h2>12. Una declaración pública creativa</h2>
<p>Si a tu pareja le gustan las sorpresas públicas, considera algo que involucre a amigos o familia. Puede ser tan sencillo como organizar que amigos les esperen con carteles en un lugar específico, o algo más elaborado como un pequeño flash mob. Solo asegúrate de conocer bien a tu pareja antes de hacer esto; a algunas personas no les gustan las sorpresas masivas.</p>

<h2>13. El "jar" de aventuras</h2>
<p>Llena un frasco con papelitos de actividades que quisieran hacer juntos durante el año: restaurantes nuevos, películas pendientes, excursiones, actividades en casa. Cada semana o cada mes sacan un papel y lo cumplen. Es un regalo que dura todo el año.</p>

<h2>14. Una noche de películas curada</h2>
<p>Elige 2-3 películas que tengan significado especial: la primera que vieron juntos, una que ella/él mencionó que quería ver, una de su infancia favorita. Prepara las palomitas, pon mantas cómodas y haz de esa noche algo especial con pequeños detalles como luz tenue y snacks favoritos.</p>

<h2>15. Una carta de amor escrita a mano</h2>
<p>En un mundo de mensajes de texto, una carta escrita a mano es algo extraordinario. No tiene que ser larga ni perfecta. Lo que importa es que sea honesta y venga del corazón. Guárdala en un sobre bonito y dásela en el momento indicado. Es el regalo más económico y el más valioso.</p>

<h2>El secreto de un San Valentín perfecto</h2>
<p>El denominador común de todas estas ideas es la <strong>intención</strong>. El dinero que gastes importa mucho menos que el tiempo y el pensamiento que pongas. Lo que las personas recuerdan no es el precio del regalo, sino cómo las hiciste sentir. Este San Valentín, enfócate en eso: en hacer que esa persona especial sepa, sin lugar a dudas, que es importante para ti.</p>

<p>¿Ya tienes tu idea? Si quieres sorprender con algo diferente y moderno, <a href="/create">crea tu página personalizada en Love Pages</a> — es gratis y solo toma unos minutos.</p>
        `,
    },
    {
        slug: 'como-escribir-mensaje-de-amor-perfecto',
        title: 'Cómo escribir el mensaje de amor perfecto: guía paso a paso',
        description:
            'Aprende a escribir mensajes de amor genuinos y emotivos que lleguen al corazón. Con ejemplos, consejos y errores comunes que debes evitar.',
        category: 'Consejos',
        publishedAt: '2025-01-22',
        readingTime: 7,
        content: `
<p>Escribir un mensaje de amor puede ser intimidante, especialmente si no te consideras una persona muy expresiva. Pero la realidad es que los mejores mensajes de amor no vienen de poetas ni escritores: vienen de personas que simplemente dicen lo que sienten con honestidad. Esta guía te ayudará a hacerlo.</p>

<h2>Por qué los mensajes escritos son poderosos</h2>
<p>A diferencia de las palabras dichas en voz alta, un mensaje escrito se puede releer. Se puede guardar. Se puede volver a él en momentos difíciles o tristes. Cuando alguien recibe un mensaje de amor escrito, tiene la posibilidad de absorberlo con calma, en privado, sin la presión de tener que responder de inmediato. Esto hace que el impacto emocional sea mucho mayor.</p>

<h2>El mayor error: ser demasiado genérico</h2>
<p>El error más común es escribir frases que podrían aplicarse a cualquier persona: "eres lo mejor de mi vida", "sin ti no sería nada", "eres mi todo". Estas frases, aunque bonitas, suenan vacías porque no dicen nada específico. La persona que las lee no siente que el mensaje fue escrito <em>para ella</em>.</p>
<p>La solución es simple: <strong>sé específico</strong>. En lugar de "me haces feliz", escribe "me haces feliz cuando te río de tus propios chistes antes de terminarlos de contar". La especificidad es lo que convierte un mensaje genérico en algo que llegará al corazón.</p>

<h2>Paso 1: Empieza con una anécdota o un momento específico</h2>
<p>Los mejores mensajes de amor comienzan con un recuerdo concreto. Piensa en un momento reciente o memorable que hayan compartido y empieza desde ahí. Ejemplos:</p>
<ul>
<li>"El otro día, cuando estabas cocinando y cantabas esa canción que no recuerdas bien la letra, me di cuenta de que soy la persona más afortunada del mundo."</li>
<li>"Cuando te vi reír así en la cena del viernes, se me paró el corazón por un segundo."</li>
<li>"Aún pienso en ese viaje que hicimos el año pasado, específicamente en la tarde que nos perdimos y terminamos en ese café tan pequeño."</li>
</ul>

<h2>Paso 2: Di qué te gusta de esa persona (con detalles)</h2>
<p>No hables en abstracto. Nombra cosas concretas: sus hábitos, su forma de reír, algo que hace cuando está nerviosa, cómo trata a los demás, su ética de trabajo, su sentido del humor. Cuanto más específico seas, más auténtico suena el mensaje y más la persona sentirá que realmente la ves y la conoces.</p>

<h2>Paso 3: Habla del impacto que ha tenido en tu vida</h2>
<p>¿Cómo eres diferente gracias a esa persona? ¿Qué has aprendido de ella? ¿En qué te ha hecho crecer? Esta parte del mensaje es poderosa porque muestra que la relación tiene profundidad y significado más allá de los sentimientos superficiales.</p>

<h2>Paso 4: Mira hacia el futuro</h2>
<p>Termina con algo que quieras que suceda: un lugar al que quieras ir juntos, algo que quieras vivir con esa persona, una promesa pequeña y real. No tiene que ser una propuesta de matrimonio; puede ser algo tan simple como "quiero seguir despertando escuchando tu alarm de las 6:30 para siempre".</p>

<h2>La estructura ideal</h2>
<ol>
<li><strong>Apertura con un momento específico</strong> — engancha emocionalmente desde el principio.</li>
<li><strong>Lo que admiras o amas de esa persona</strong> — con detalles concretos.</li>
<li><strong>El impacto en tu vida</strong> — cómo te ha cambiado o mejorado.</li>
<li><strong>Una mirada al futuro</strong> — algo que deseas compartir con esa persona.</li>
<li><strong>El cierre</strong> — una declaración directa y sincera. Sin floreos.</li>
</ol>

<h2>Ejemplo de mensaje completo</h2>
<blockquote>
<p>"Hace unos días, mientras estabas leyendo en el sofá con esa concentración tuya que bloquea todo lo demás, pensé en lo raro y bonito que es que dos personas tan diferentes terminaran compartiendo la vida. Admiro mucho la forma en que defiendes lo que crees, incluso cuando es incómodo. Me has enseñado a no dejar las conversaciones difíciles para después. Gracias a ti soy un poco más valiente. Quiero seguir aprendiendo de ti por mucho tiempo más. Te quiero más de lo que puedo decir, así que voy a seguir intentándolo."</p>
</blockquote>

<h2>Errores que debes evitar</h2>
<ul>
<li><strong>Copiar mensajes de internet literalmente</strong> — si la persona los busca y los encuentra, el efecto es devastador.</li>
<li><strong>Exagerar</strong> — las hipérboles extremas ("sin ti me moriría") suenan dramáticas y poco auténticas.</li>
<li><strong>Hablar solo de tus sentimientos</strong> — el mensaje debe centrarse también en la otra persona, no solo en cómo te sientes tú.</li>
<li><strong>Escribir demasiado largo</strong> — un mensaje bien editado de 200 palabras supera a uno de 1000 palabras lleno de relleno.</li>
<li><strong>Escribir con errores de ortografía</strong> — tómate el tiempo de revisar. Los errores distraen del mensaje.</li>
</ul>

<h2>¿En papel o en digital?</h2>
<p>Ambos tienen su lugar. Una carta escrita a mano tiene un valor sentimental enorme porque requiere esfuerzo físico. Pero un mensaje digital bien presentado puede ser igual de impactante, especialmente si usas una plataforma que le dé el contexto visual adecuado. Con <a href="/create">Love Pages</a>, puedes convertir tu mensaje en una página web interactiva con animaciones, música y un diseño personalizado, lo que lo hace aún más especial y memorable.</p>

<h2>El consejo más importante</h2>
<p>No esperes la ocasión perfecta. Los mensajes de amor más poderosos son los que llegan sin previo aviso, en un martes cualquiera, sin ninguna razón especial más que "pensé en ti y quería que lo supieras". Ese es el tipo de mensaje que la gente guarda para siempre.</p>
        `,
    },
    {
        slug: 'juegos-para-parejas-en-linea',
        title: 'Los mejores juegos para parejas que pueden jugar juntos en línea',
        description:
            'Una lista de juegos divertidos e interactivos para parejas, ya sea que estén juntos o a distancia. Perfectos para noches en casa o videollamadas.',
        category: 'Juegos',
        publishedAt: '2025-02-01',
        readingTime: 5,
        content: `
<p>Los juegos son una de las formas más efectivas de conectar con tu pareja, conocerse mejor y simplemente divertirse juntos. Ya sea que estén en la misma habitación o a miles de kilómetros de distancia, estos juegos funcionan perfectamente.</p>

<h2>¿Por qué jugar en pareja?</h2>
<p>Los estudios sobre relaciones muestran que las parejas que juegan juntas reportan mayor satisfacción en la relación. Y no es sorprendente: los juegos crean situaciones de complicidad, risas compartidas y, a veces, revelan aspectos de la personalidad del otro que no conocíamos. Además, rompen la rutina de la forma más natural posible.</p>

<h2>Quiz de Compatibilidad</h2>
<p>Este es uno de los juegos más reveladores. Cada persona responde las mismas preguntas por separado y luego comparan respuestas. Las preguntas pueden ser sobre preferencias simples ("¿playa o montaña?") o más profundas ("¿qué harías si pudieras vivir en cualquier parte del mundo?"). Lo fascinante es descubrir en qué coinciden y en qué difieren, y hablar de por qué.</p>
<p>En <a href="/games">Love Pages Juegos</a> encontrarás un Quiz de Compatibilidad prediseñado con preguntas pensadas especialmente para parejas.</p>

<h2>¿Qué Prefieres? (Would You Rather)</h2>
<p>Uno de los juegos más simples y adictivos. Se turnan haciendo preguntas tipo "¿Qué preferirías: viajar al pasado o al futuro?", "¿qué preferirías: no poder escuchar música nunca más o no poder ver películas?". Las respuestas abren conversaciones inesperadas y revelan mucho de la personalidad de cada uno.</p>

<h2>Pictionary en pareja</h2>
<p>El clásico juego de dibujar y adivinar, adaptado para dos personas. Una persona dibuja en papel o en una app como skribbl.io y la otra adivina. Es especialmente divertido porque revela qué tan bien se conocen: ¿puede ella adivinar tu terrible dibujo de un elefante en 5 segundos?</p>

<h2>Tutti Frutti temático</h2>
<p>El juego de siempre, pero con una vuelta de tuerca: usen categorías relacionadas con su relación. Por ejemplo: "nombres de lugares que queremos visitar", "películas que vimos juntos", "comidas que cocinamos juntos". Es un ejercicio nostálgico y divertido.</p>

<h2>20 preguntas</h2>
<p>Un clásico intemporal. Una persona piensa en algo (puede ser un objeto, un lugar, una persona famosa, o incluso un recuerdo de la pareja) y la otra tiene 20 preguntas de sí/no para adivinarlo. Limitar las preguntas crea tensión y diversión.</p>

<h2>El juego de las verdades</h2>
<p>Hagan una lista de preguntas profundas y respondan con total honestidad. No se trata de preguntas incómodas, sino de preguntas que profundizan el conocimiento mutuo: "¿cuál es el momento en que te sentiste más orgulloso de mí?", "¿qué es algo que nunca me has dicho pero quisieras decirme?", "¿qué es lo más te da miedo de nuestra relación?".</p>

<h2>Trivial personalizado</h2>
<p>Creen preguntas de trivia sobre su propia relación: "¿en qué mes nos conocimos?", "¿cuál fue la primera película que vimos juntos?", "¿cuánto tiempo duró nuestro primer viaje?". Ver cuánto recuerda cada uno es siempre revelador (y a veces sorprendente).</p>

<h2>Juegos de videojuegos cooperativos</h2>
<p>Si ambos son gamer o están dispuestos a probar, los juegos cooperativos son perfectos para parejas. Titles como <em>It Takes Two</em>, <em>Stardew Valley</em>, <em>Unravel Two</em> o <em>Overcooked</em> están diseñados para dos jugadores y crean experiencias compartidas memorables. Advertencia: Overcooked puede poner a prueba la paciencia.</p>

<h2>Adivina la canción</h2>
<p>Uno toca los primeros 5 segundos de una canción desde el teléfono y el otro debe adivinar el título y el artista. Pueden usar su propia playlist de pareja, lo que hace el juego más personal y nostálgico.</p>

<h2>Consejos para que los juegos funcionen</h2>
<ul>
<li><strong>Desconéctense de las redes sociales</strong> durante el tiempo de juego. La presencia completa hace la diferencia.</li>
<li><strong>No compitan de forma agresiva</strong>. El objetivo es conectar, no ganar.</li>
<li><strong>Ríanse de los errores</strong>. Los momentos más memorables suelen venir de los fallos épicos.</li>
<li><strong>Alternen quién elige el juego</strong> para que ambos disfruten de sus favoritos.</li>
</ul>

<p>Si quieren una experiencia de juego diseñada especialmente para parejas, visiten la sección de <a href="/games">Juegos de Love Pages</a>, donde encontrarán varias opciones listas para usar, sin descargar nada.</p>
        `,
    },
    {
        slug: 'sorprender-pareja-cumpleanos-a-distancia',
        title: 'Cómo sorprender a tu pareja en su cumpleaños cuando están lejos',
        description:
            'Ideas creativas y emotivas para celebrar el cumpleaños de tu pareja a distancia. Desde regalos digitales hasta sorpresas coordinadas con amigos y familia.',
        category: 'Relación a Distancia',
        publishedAt: '2025-02-10',
        readingTime: 6,
        content: `
<p>La distancia es difícil en muchos momentos, pero los cumpleaños son especialmente complicados. Quieres que esa persona sienta que está acompañada, que el día es especial, que piensas en ella. La buena noticia es que la distancia no tiene que arruinar la celebración. Con creatividad y organización, puedes hacer que su cumpleaños sea inolvidable aunque estés a kilómetros de distancia.</p>

<h2>1. La página de amor personalizada</h2>
<p>Crea una página web dedicada a su cumpleaños con <a href="/create">Love Pages</a>. Puedes incluir un mensaje de amor, fotos de sus momentos juntos, su canción favorita de fondo y animaciones festivas. Envíale el link a la medianoche del día de su cumpleaños para que sea lo primero que vea. Es un regalo digital que se puede ver cuantas veces quiera.</p>

<h2>2. Coordina una sorpresa con sus amigos o familia</h2>
<p>Ponte en contacto con las personas cercanas a tu pareja en su ciudad y organiza algo juntos. Puede ser tan simple como pedirles que le envíen mensajes de cumpleaños a la misma hora, o más elaborado como organizar una reunión sorpresa. Saber que coordinaste todo desde lejos hará que el gesto sea doblemente especial.</p>

<h2>3. Envía un regalo de madrugada</h2>
<p>Muchos servicios de delivery permiten programar entregas. Ordena su desayuno favorito, flores, o un regalo especial para que llegue a primera hora de la mañana de su cumpleaños. Si sabes cuál es su cafetería favorita, a veces puedes pagar por adelantado para que alguien vaya a buscarlo.</p>

<h2>4. Una videollamada con producción especial</h2>
<p>No te conformes con una videollamada normal. Decora tu espacio, pon música de fondo, prepara algo especial para cenar al mismo tiempo que ellos y hagan una "cena virtual" juntos. Pueden encender velas, brindar al mismo tiempo y hacer que la llamada se sienta como una cita real.</p>

<h2>5. Una caja de sorpresas enviada por anticipado</h2>
<p>Con suficiente anticipación, puedes enviar una caja llena de pequeños regalos: su snack favorito, una carta escrita a mano, fotos impresas, un objeto con significado. Pídele que no la abra hasta el día de su cumpleaños. La anticipación hace que el momento de apertura sea aún más especial.</p>

<h2>6. Un video mensaje colaborativo</h2>
<p>Contáctate con amigos, familia e incluso colegas y pídeles que graben un mensaje de 10-15 segundos de cumpleaños. Edita todos los videos juntos y envíale el video compilado. Plataformas como Canva o iMovie hacen esto relativamente sencillo. Ver las caras de todas las personas que la quieren en un solo video es algo que nunca olvidará.</p>

<h2>7. Una lista de reproducción de cumpleaños</h2>
<p>Crea una playlist en Spotify con canciones que tengan significado para su relación, mezcladas con las canciones favoritas de tu pareja. Escribe una pequeña nota explicando por qué elegiste cada canción. Es un regalo que puede escuchar todo el año.</p>

<h2>8. Libro de mensajes digital</h2>
<p>Crea un documento o usa una app de álbum digital donde escribas 365 razones por las que la amas (una por cada día del año) o 30 razones (una por cada año de su vida). Es un regalo que requiere tiempo y reflexión, lo cual hace que sea aún más valioso.</p>

<h2>9. Suscripción a algo que le encante</h2>
<p>¿Le encantan los libros? Regala una suscripción a una plataforma de audiolibros. ¿Le gustan las series? Una suscripción a una plataforma de streaming. ¿Disfruta el bienestar? Una aplicación de meditación. Los regalos digitales tienen la ventaja de llegar al instante, sin importar la distancia.</p>

<h2>10. La promesa de una celebración pendiente</h2>
<p>A veces lo más honesto es reconocer que el cumpleaños "real" llegará cuando puedan estar juntos. Crea un sobre virtual o físico con la "promesa de celebración": qué van a hacer, a dónde van a ir, qué van a comer. Darle algo que esperar con ansias es en sí mismo un regalo.</p>

<h2>Lo que más importa</h2>
<p>En los cumpleaños a distancia, lo que más valora la pareja no es el regalo más caro ni el gesto más elaborado: es sentir que pensaste en ella, que dedicaste tiempo, que hiciste el esfuerzo a pesar de la distancia. A veces una carta larga y honesta escrita desde el corazón vale más que cualquier entrega de flores a domicilio.</p>

<p>Si quieres combinar varias de estas ideas en un solo gesto, <a href="/create">crea una página personalizada en Love Pages</a> donde puedas incluir un mensaje, fotos, música y hasta juegos interactivos. Es gratis y tarda menos de 10 minutos.</p>
        `,
    },
    {
        slug: 'como-celebrar-aniversario-especial',
        title: 'Cómo celebrar un aniversario especial: ideas para cada año',
        description:
            'Desde el primer aniversario hasta el décimo, ideas únicas para celebrar cada año de relación de una forma que ambos recordarán para siempre.',
        category: 'Aniversario',
        publishedAt: '2025-02-20',
        readingTime: 6,
        content: `
<p>Cada aniversario marca un capítulo de una historia que construyeron juntos. Con el tiempo, es fácil caer en la rutina y hacer siempre lo mismo. Este año, te proponemos celebrar de una manera que honre verdaderamente el tiempo que llevan juntos.</p>

<h2>La regla de oro de los aniversarios</h2>
<p>Un buen aniversario no se mide por cuánto se gastó, sino por cuánto se pensó. El detalle que demuestra que recuerdas momentos específicos, que prestaste atención, que conoces a tu pareja, vale mil veces más que una cena cara en un restaurante genérico.</p>

<h2>Primer aniversario: vuelvan a empezar</h2>
<p>El primer aniversario merece recrear el comienzo. Vayan al lugar donde se conocieron, al restaurante de su primera cita, o al sitio donde se dieron su primer beso. Si eso no es posible físicamente, recreen la experiencia en casa con los mismos platos, la misma música, incluso la ropa similar. Hablen de lo que pensaba cada uno en ese primer encuentro. Fue hace apenas un año, pero probablemente hay detalles que no saben el uno del otro.</p>

<h2>Segundo aniversario: el álbum del año</h2>
<p>Hagan un álbum (físico o digital) con los mejores momentos de los dos últimos años. No tiene que ser elaborado: fotos impresas en una tienda, puestas en orden cronológico en un álbum simple, con notas escritas a mano en los márgenes. Es un regalo que van a guardar durante décadas.</p>

<h2>Tercer aniversario: una nueva aventura</h2>
<p>Hagan algo que nunca hayan hecho juntos. Puede ser una actividad extrema si les gustan las emociones fuertes (escalada, salto en paracaídas, kayak), o algo más tranquilo pero igualmente nuevo (cerámica, clases de cocina de una gastronomía que nunca probaron, astronomía). Lo importante es que sea una "primera vez" compartida.</p>

<h2>Quinto aniversario: el viaje soñado</h2>
<p>El quinto aniversario es una buena excusa para hacer ese viaje que llevan tiempo planeando. No tiene que ser internacional ni caro: puede ser un destino cercano que siempre quisieron conocer. El proceso de planear el viaje juntos ya es parte de la celebración.</p>

<h2>Ideas que funcionan para cualquier aniversario</h2>

<h3>La cápsula del tiempo</h3>
<p>Creen juntos una cápsula del tiempo: escriban cartas para leer en el próximo aniversario, incluyan objetos pequeños que representen el año que pasó, una foto reciente, una lista de sus planes para el próximo año. Guárdenla en un lugar seguro y ábrala exactamente un año después. Es una tradición que se vuelve más bonita con cada año.</p>

<h3>La carta del futuro</h3>
<p>Cada uno escribe una carta dirigida a la pareja para que la lea en el próximo aniversario. Hablen de cómo se sienten hoy, qué esperan del próximo año juntos, qué quieren mejorar, qué promesas quieren cumplir. Intercámbienlas, guárdenlas sin leer, y ábranas el año siguiente.</p>

<h3>La página de aniversario</h3>
<p>Crea una página web personalizada con <a href="/create">Love Pages</a> dedicada a su aniversario. Puedes incluir fotos de sus momentos juntos, un mensaje largo y emotivo, su canción favorita de fondo y un diseño especial. Envíala como sorpresa la noche anterior al aniversario. Es un regalo moderno y memorable que pueden volver a ver en cualquier momento.</p>

<h3>El "libro de nosotros"</h3>
<p>Crea un libro personalizado (servicios como Blurb o Photobook lo hacen fácil) con fotos y texto de su relación. Organízalo como una narrativa: cómo se conocieron, sus primeras aventuras, los momentos difíciles que superaron, los viajes, las celebraciones. Es uno de los regalos más valiosos que pueden darse.</p>

<h3>Recrear la primera foto juntos</h3>
<p>Busca la primera foto que se tomaron juntos y recréenla exactamente: misma pose, mismo lugar si es posible, misma ropa si aún la tienen. Pongan las dos fotos juntas, en el mismo cuadro. El contraste del tiempo es visualmente poderoso y emocionalmente significativo.</p>

<h2>Lo que no debería faltar en ningún aniversario</h2>
<ul>
<li><strong>Tiempo de calidad sin distracciones</strong> — desconéctense del teléfono por al menos unas horas.</li>
<li><strong>Una conversación real sobre la relación</strong> — qué valoran, qué quieren mejorar, qué sueños comparten.</li>
<li><strong>Gratitud expresada en palabras</strong> — díganle al otro qué es lo que más agradecen de la relación.</li>
<li><strong>Un gesto personalizado</strong> — algo que demuestre que lo pensaste específicamente para esta persona.</li>
</ul>

<p>El aniversario es un recordatorio de que eligieron estar juntos, y de que siguen eligiéndolo. Celébralo como merece: con intención, con presencia y con amor.</p>
        `,
    },
    {
        slug: 'declarar-amor-de-forma-creativa',
        title: 'Cómo declarar tu amor de forma creativa y memorable',
        description:
            'Guía completa para hacer una declaración de amor que sea auténtica, original y difícil de olvidar. Ideas para todos los estilos y personalidades.',
        category: 'Consejos',
        publishedAt: '2025-03-01',
        readingTime: 7,
        content: `
<p>Declarar el amor es uno de los momentos más vulnerables de la vida. Y esa vulnerabilidad es precisamente lo que lo hace tan poderoso. Pero más allá del valor que requiere, la forma en que lo haces puede marcar la diferencia entre un momento que se olvida y uno que se recuerda para siempre.</p>

<h2>Antes de declararte: lo que necesitas saber</h2>
<p>Una declaración de amor no es una estrategia para obtener una respuesta específica. Es un regalo que le haces a la otra persona: el regalo de saber que la ves, que la valoras, que algo en ti quiere estar cerca de ella. Cuando lo enfocas desde ese lugar, la presión desaparece y la autenticidad toma su lugar.</p>

<h2>Conoce el estilo de la persona</h2>
<p>Algunas personas son intensamente privadas y se sentirían incómodas con una declaración pública. Otras son extrovertidas y adorarían el elemento espectáculo. Antes de planear cualquier cosa, piensa en quién es <em>esa persona específica</em>. Una declaración perfecta no es la más elaborada: es la que está diseñada para esa persona en particular.</p>

<h2>Ideas para declaraciones íntimas y privadas</h2>

<h3>La carta en papel</h3>
<p>Simple, clásica, poderosa. Una carta escrita a mano tiene un peso emocional que los mensajes digitales raramente logran igualar. Escribe sin apresurarte. Sé específico sobre lo que sientes y por qué. No te esfuerces por ser poético: esfuérzate por ser honesto. La honestidad siempre es más conmovedora que la perfección literaria.</p>

<h3>La página personalizada</h3>
<p>Si quieres algo moderno y sorprendente, crea una página web dedicada a esa persona con <a href="/create">Love Pages</a>. Puedes escribir tu mensaje, elegir un tema visual que le guste, agregar música de fondo, stickers y hasta el famoso botón que escapa. Envíale el link por mensaje sin contexto: cuando lo abra, vivirá una experiencia inmersiva y completamente personal. Es el equivalente digital de la carta, con un factor sorpresa mucho mayor.</p>

<h3>Una cena en casa</h3>
<p>Invítale a cenar a tu casa (o cocinen juntos) y al final de la noche, cuando el ambiente esté relajado y cómodo, díselo. La cotidianidad del contexto hace que la declaración sea más real, más arraigada en la vida de todos los días, que una producción elaborada.</p>

<h3>Durante un paseo</h3>
<p>Hay algo que facilita las conversaciones difíciles cuando se está en movimiento: caminar lado a lado, sin mirarse directamente a los ojos todo el tiempo, reduce la tensión. Una caminata tranquila puede ser el escenario perfecto para una declaración natural y sin presión.</p>

<h2>Ideas para declaraciones más memorables</h2>

<h3>En un lugar significativo</h3>
<p>¿Hay un lugar que tenga significado especial para los dos? El café donde se conocieron, el parque donde pasaron su primera tarde juntos, la calle donde vive. Declararte en ese lugar añade una capa de significado que convierte el momento en algo genuinamente memorable.</p>

<h3>A través de una experiencia</h3>
<p>En lugar de declararte con palabras directas, crea una experiencia: una búsqueda del tesoro con pistas que lleven a lugares con significado para los dos, y al final una carta o un mensaje. El proceso de la búsqueda crea anticipación y hace que el momento final tenga mucho más impacto.</p>

<h3>Con la ayuda de sus personas cercanas</h3>
<p>Si conoces a sus amigos o familia y tienes confianza con ellos, puedes pedirles que participen. Puede ser algo tan simple como que sus amigos estén esperando en un lugar y que todos griten "¡dile que sí!" en el momento indicado, o algo más elaborado como un video con mensajes de apoyo de todas las personas que la quieren.</p>

<h2>Lo que debes decir (y lo que no)</h2>

<h3>Sé específico sobre tus sentimientos</h3>
<p>En lugar de "me gustas mucho", di "cuando estamos juntos, me siento de una forma que no había sentido antes y que no quiero perder". La especificidad convierte una declaración genérica en algo que solo tú podrías decir.</p>

<h3>No pongas presión en la respuesta</h3>
<p>Una de las partes más importantes de una declaración auténtica es dejar claro que no hay una respuesta "correcta". Di lo que sientes porque quieres que lo sepa, no para manipularla hacia una respuesta específica. "No necesito que respondas ahora mismo, solo quería que lo supieras."</p>

<h3>No exageres ni dramatices</h3>
<p>Frases como "sin ti no puedo vivir" o "nunca he sentido algo así en mi vida" (especialmente si tienen poco tiempo de conocerse) pueden sonar alarmantes en lugar de románticas. Sé honesto sobre lo que realmente sientes, no sobre lo que crees que deberías sentir.</p>

<h2>Si la respuesta no es la que esperabas</h2>
<p>Las declaraciones de amor requieren valentía precisamente porque no siempre el resultado es el que deseamos. Si la respuesta es un rechazo o un "necesito tiempo", responde con dignidad y sin rencor. El hecho de haberte declarado con honestidad dice mucho de ti, independientemente del resultado. Y a veces, las respuestas cambian con el tiempo.</p>

<h2>El mejor momento</h2>
<p>No hay un momento perfecto. Esperar el momento perfecto es a menudo una forma disfrazada de miedo. El mejor momento es cuando el sentimiento es genuino y cuando sientes que esa persona merece saberlo. Eso es todo lo que necesitas.</p>

<p>¿Listo para declararte? Si quieres hacerlo de una forma original y moderna, <a href="/create">crea tu página personalizada en Love Pages</a>. En minutos tendrás algo que esa persona nunca olvidará.</p>
        `,
    },
    {
        slug: 'carta-de-amor-para-mi-novia',
        title: 'Carta de amor para mi novia: cómo escribirla (y 12 ejemplos reales)',
        description:
            'Guía para escribir una carta de amor a tu novia que no suene a plantilla: estructura, ejemplos según el momento de la relación y los errores que la arruinan.',
        category: 'Consejos',
        publishedAt: '2026-02-20',
        readingTime: 9,
        content: `
<p>Escribir una carta de amor da vértigo por una razón concreta: sabes lo que sientes, pero en cuanto lo pones por escrito suena a canción de radio. Este artículo va de resolver justo eso.</p>

<h2>Por qué la mayoría de las cartas suenan igual</h2>
<p>Porque empiezan por el final. Arrancan con la conclusión ("eres el amor de mi vida", "no puedo vivir sin ti") en lugar de con la evidencia. Y las conclusiones sin evidencia suenan huecas, por muy verdaderas que sean.</p>
<p>La prueba está en que si cambias el nombre de tu novia por cualquier otro, la carta sigue funcionando igual. Si eso pasa, la carta no es sobre ella: es sobre el concepto de estar enamorado.</p>

<h2>La regla que lo cambia todo: concreto gana a bonito</h2>
<p>Compara estas dos frases:</p>
<ul>
<li><em>"Me encanta tu sonrisa."</em></li>
<li><em>"Me encanta que cuando algo te da mucha risa te tapas la boca con las dos manos, como si te diera vergüenza que se te oiga."</em></li>
</ul>
<p>La segunda no es más poética. Es más específica. Y por eso funciona: demuestra que has estado mirando. Una carta de amor no tiene que demostrar que sabes escribir, tiene que demostrar que sabes mirar.</p>
<p>Antes de escribir nada, haz esto: apunta cinco cosas concretas que hace ella y que nadie más hace igual. No cinco virtudes: cinco gestos, manías, frases que repite. Esa lista es tu carta.</p>

<h2>Una estructura que funciona</h2>
<p>No hace falta que sea larga. Cuatro párrafos bastan:</p>
<ol>
<li><strong>Un detalle concreto.</strong> Empieza por una escena real, no por una declaración. "El martes, cuando te quedaste dormida a mitad de la película otra vez..."</li>
<li><strong>Qué te hace sentir eso.</strong> Aquí sí puedes ponerte sentimental, porque ya te has ganado el derecho.</li>
<li><strong>Algo que sólo tú sabes.</strong> Un miedo, una cosa que no le has dicho, algo que pensaste y te callaste.</li>
<li><strong>Lo que quieres.</strong> Cierra con futuro, no con resumen. "Quiero seguir viendo películas que no vas a terminar."</li>
</ol>

<h2>12 ejemplos según el momento de la relación</h2>

<h3>Si llevan poco tiempo</h3>
<p><em>"No sé todavía qué somos y no tengo prisa por ponerle nombre. Sólo sé que llevo tres semanas contándote cosas que no le cuento a nadie, y que eso no me había pasado antes."</em></p>
<p><em>"Me gusta que no intentes caerme bien. Que digas lo que piensas aunque sea incómodo. Fue lo primero que noté y sigue siendo lo que más me gusta."</em></p>
<p><em>"Tengo miedo de escribirte esto y que sea demasiado pronto. Lo escribo igual."</em></p>

<h3>Si llevan años</h3>
<p><em>"La gente dice que después de unos años se apaga. A mí lo que me pasa es distinto: ya no me sorprendes, y resulta que eso me gusta más que la sorpresa."</em></p>
<p><em>"Hemos discutido por cosas ridículas cientos de veces. Y ninguna de esas veces se me pasó por la cabeza irme."</em></p>
<p><em>"Sé cómo suena tu respiración cuando estás a punto de dormirte. No hay nadie más en el mundo del que sepa eso."</em></p>

<h3>Si están a distancia</h3>
<p><em>"Lo peor no es no verte. Es que me pasan cosas pequeñas durante el día y tengo que esperar para contártelas."</em></p>
<p><em>"Cuento los días como si fueran una cuenta atrás, y creo que eso también es una forma de estar contigo."</em></p>

<h3>Si te cuesta expresarte</h3>
<p><em>"No se me da bien esto. Lo he empezado cuatro veces. Te lo mando igual porque me parece peor no decírtelo."</em></p>
<p><em>"Soy mejor haciendo cosas que diciéndolas. Así que ahí va la lista de cosas que he hecho pensando en ti este mes."</em></p>

<h3>Para pedir algo importante</h3>
<p><em>"Llevo semanas dándole vueltas a cómo preguntártelo sin que suene solemne. No lo he conseguido. ¿Quieres que hagamos esto en serio?"</em></p>
<p><em>"Te quiero pedir una cosa y prefiero hacerlo por escrito, porque en persona me voy a poner nervioso y lo voy a estropear."</em></p>

<h2>Cuatro errores que la arruinan</h2>
<ul>
<li><strong>Citar a otros.</strong> Una frase de Neruda es de Neruda. Ella quiere leerte a ti.</li>
<li><strong>Disculparte por escribir.</strong> "Perdón por ser cursi" le quita valor a todo lo que viene después.</li>
<li><strong>Hacerla demasiado larga.</strong> Media página leída dos veces vale más que tres páginas leídas por encima.</li>
<li><strong>Corregirla hasta que no quede nada tuyo.</strong> Las faltas se arreglan; el tono se pierde.</li>
</ul>

<h2>Dónde escribirla</h2>
<p>El papel sigue siendo insuperable si vas a entregarla en mano. Pero si están a distancia, o si quieres que sea una sorpresa que se abra en el momento exacto, una página web personalizada funciona mejor: le mandas un enlace y ves en tiempo real cuándo la abre y qué contesta.</p>
<p>En <a href="/create">Love Pages puedes crear la tuya gratis</a>, sin saber diseñar ni programar. Si quieres más ideas sobre el texto, mira también <a href="/blog/como-escribir-mensaje-de-amor-perfecto">cómo escribir el mensaje de amor perfecto</a>.</p>

<h2>Lo único que importa</h2>
<p>Una carta de amor no se juzga por lo bien escrita que esté, sino por si quien la lee se reconoce en ella. Si tu novia lee la tuya y piensa "esto sólo lo podía haber escrito él, y sólo sobre mí", ya has terminado.</p>
        `,
    },
    {
        slug: 'como-pedirle-que-sea-mi-novia',
        title: 'Cómo pedirle que sea tu novia: qué decir exactamente y cuándo',
        description:
            'Cómo saber si es el momento de pedirle que sea tu novia, qué decir palabra por palabra, siete formas de hacerlo y qué hacer si dice que no.',
        category: 'Consejos',
        publishedAt: '2026-02-21',
        readingTime: 8,
        content: `
<p>Pedirle a alguien que sea tu novia da miedo por algo simple: estás pidiendo ponerle nombre a algo que ahora mismo funciona sin nombre, y existe la posibilidad de que al nombrarlo se rompa. Esa parte es incómoda y no hay manera de saltársela. Lo que sí se puede hacer es llegar preparado.</p>

<h2>Tres señales de que es el momento</h2>
<p>No hay un número de citas correcto, pero sí indicadores razonablemente fiables:</p>
<ul>
<li><strong>Ya actúan como pareja sin serlo.</strong> Se cuentan el día, aparecen en los planes del otro, existe una rutina.</li>
<li><strong>Te ha presentado a alguien de su vida.</strong> Amigos, hermanos, compañeros de trabajo. Señal de que no te mantiene en un compartimento aparte.</li>
<li><strong>La pregunta te da miedo por lo que puedes perder, no por lo que puedes ganar.</strong> Eso significa que ya hay algo que perder.</li>
</ul>
<p>Si ninguna se cumple, probablemente sea pronto, y no pasa nada.</p>

<h2>Qué decir, palabra por palabra</h2>
<p>El error más común es convertirlo en un discurso. Cuanto más largo, más solemne; y cuanta más solemnidad, más presión para quien tiene que contestar.</p>
<p>Una estructura que funciona, en tres frases:</p>
<ol>
<li><strong>Nombra lo que ya pasa.</strong> "Llevamos dos meses viéndonos casi cada semana y me lo paso mejor contigo que con nadie."</li>
<li><strong>Di lo que quieres, claro.</strong> "Quiero que seas mi novia."</li>
<li><strong>Quítale presión.</strong> "No hace falta que me contestes ahora."</li>
</ol>
<p>Eso es todo. Diez segundos. Lo que sobre de ahí es para tranquilizarte a ti, no para ayudarla a ella.</p>

<h2>Siete formas de hacerlo</h2>
<h3>1. Directamente, en persona</h3>
<p>Sigue siendo la mejor si la relación ya es sólida. Sin escenario, sin público, sin anillo: un momento tranquilo en el que estéis solos.</p>
<h3>2. Escrito, y luego en persona</h3>
<p>Ideal si te bloqueas hablando. Le mandas algo escrito y quedas después. Le das tiempo para procesarlo sin tenerte delante esperando respuesta.</p>
<h3>3. Con una página personalizada</h3>
<p>Le mandas un enlace, lo abre y encuentra una página hecha para ella con la pregunta y dos botones. Funciona especialmente bien a distancia o si vuestra relación ha vivido mucho por el móvil. Puedes <a href="/create">crear una gratis aquí</a>.</p>
<h3>4. Recreando el sitio donde os conocisteis</h3>
<p>Volver al lugar de la primera cita y preguntárselo ahí. El contexto hace la mitad del trabajo.</p>
<h3>5. Con una fecha marcada</h3>
<p>El día que hizo tres meses desde la primera cita, por ejemplo. Que ella caiga en la fecha antes de que preguntes ya crea la expectativa.</p>
<h3>6. Después de algo que hicisteis juntos</h3>
<p>Al final de un viaje, de una cena que salió bien, de un día largo. El buen momento compartido es el mejor preámbulo.</p>
<h3>7. Por sorpresa, sin ocasión</h3>
<p>Un martes cualquiera. Contraintuitivamente es de las que mejor funcionan: demuestra que no lo hiciste porque tocaba.</p>

<h2>Lo que no hay que hacer</h2>
<ul>
<li><strong>Delante de gente.</strong> Un público convierte un "no" en una humillación, y eso la obliga a decir que sí. Nadie quiere un sí obligado.</li>
<li><strong>Después de una discusión.</strong> No arregla nada y confunde el gesto con una disculpa.</li>
<li><strong>Con ultimátum.</strong> "O somos algo o lo dejamos" no es una pregunta, es una amenaza.</li>
<li><strong>Borracho.</strong> Le quita todo el peso, aunque lo sientas igual.</li>
</ul>

<h2>Si dice que no</h2>
<p>Puede pasar, y no siempre significa lo mismo: a veces es "no" y a veces "todavía no", que son cosas distintas. La respuesta correcta en ambos casos es la misma: no discutir, no negociar y no pedir explicaciones en ese momento.</p>
<p>Di algo como "vale, gracias por ser sincera" y déjalo estar unos días. Si era "todavía no", volverá el tema. Si era "no", te habrás ahorrado meses.</p>
<p>Lo que no funciona es fingir que no pasó nada. Preguntarlo cambia la relación, diga lo que diga, y aceptar eso forma parte de preguntarlo.</p>

<h2>El resumen</h2>
<p>Sé claro, sé breve, hazlo en privado y quítale presión a la respuesta. Si además quieres que sea memorable, dale una forma que se pueda guardar. Los diez segundos se olvidan; lo que se puede releer, no.</p>
<p><a href="/create">Crea tu página gratis</a> y tendrás el enlace listo para enviárselo cuando quieras.</p>
        `,
    },
    {
        slug: 'mensajes-de-aniversario',
        title: 'Mensajes de aniversario: 40 ideas según los años que llevéis',
        description:
            'Mensajes de aniversario para novios, novias y parejas de años, ordenados por tiempo juntos, más una fórmula para escribir el tuyo en cinco minutos.',
        category: 'Aniversario',
        publishedAt: '2026-02-22',
        readingTime: 8,
        content: `
<p>El problema de los mensajes de aniversario es que hay que escribir uno cada año, y a partir del tercero se acaban las formas de decir "te quiero, qué rápido pasa el tiempo". Aquí van ideas ordenadas por momento de la relación, y una fórmula para que el año que viene no tengas que buscar otra vez.</p>

<h2>La fórmula, por si tienes prisa</h2>
<p>Un buen mensaje de aniversario tiene tres piezas: <strong>una referencia a este año en concreto</strong>, <strong>algo que hayas aprendido de la otra persona</strong> y <strong>algo que quieras del siguiente</strong>. Con eso ya no se parece al del año pasado, porque cada año es distinto.</p>
<p>Ejemplo: <em>"Este año nos mudamos, discutimos por las estanterías y sobrevivimos. Aprendí que tienes más paciencia que yo. El año que viene quiero que discutamos por cosas más caras."</em></p>

<h2>Primeros meses</h2>
<ul>
<li><em>"Un mes. Que conste que los estoy contando."</em></li>
<li><em>"Tres meses y todavía me pongo nervioso antes de verte. Espero que eso no se pase."</em></li>
<li><em>"Seis meses. Ya no me acuerdo de qué hacía los domingos antes."</em></li>
<li><em>"Llevamos poco y ya te has vuelto costumbre. De las buenas."</em></li>
</ul>

<h2>Primer año</h2>
<ul>
<li><em>"Un año. Trescientos sesenta y cinco días de los cuales no cambiaría casi ninguno."</em></li>
<li><em>"Hace un año no sabía nada de ti. Hoy sé cómo te tomas el café y qué cara pones cuando algo no te gusta pero no lo vas a decir."</em></li>
<li><em>"Feliz primer año. Que sea el que menos llevemos juntos."</em></li>
<li><em>"Un año contigo y todavía me sorprende que dijeras que sí."</em></li>
</ul>

<h2>De dos a cinco años</h2>
<ul>
<li><em>"Tres años. Ya hemos pasado la fase en la que todo era perfecto y resulta que esto me gusta más."</em></li>
<li><em>"Cuatro años. Nos hemos visto en nuestras peores versiones y seguimos aquí. Eso vale más que cualquier aniversario bonito."</em></li>
<li><em>"Cinco años. Media década aguantándome. Te has ganado algo mejor que un mensaje, pero de momento toma esto."</em></li>
<li><em>"Ya llevamos suficiente tiempo como para tener chistes que nadie más entiende. Creo que eso es lo que más me gusta."</em></li>
</ul>

<h2>Diez años o más</h2>
<ul>
<li><em>"Diez años. La mitad de las cosas que soy ahora las aprendí contigo delante."</em></li>
<li><em>"Llevamos tanto que ya no sé dónde acabo yo y dónde empiezas tú. Y no tengo ningún interés en averiguarlo."</em></li>
<li><em>"Hemos cambiado los dos bastante desde que empezamos. Lo raro y lo bonito es que cambiamos en la misma dirección."</em></li>
</ul>

<h2>Si estáis a distancia</h2>
<ul>
<li><em>"Un año más de aniversarios por videollamada. El próximo lo celebramos en la misma habitación."</em></li>
<li><em>"La distancia hace que cada vez que nos vemos parezca la primera. No la recomiendo, pero tiene eso."</em></li>
<li><em>"Kilómetros: muchos. Ganas de dejarlo: cero."</em></li>
</ul>

<h2>Si el año ha sido difícil</h2>
<p>No todos los aniversarios llegan en un buen momento, y fingir que sí suena falso. Estos funcionan mejor:</p>
<ul>
<li><em>"Este año ha sido duro y no voy a fingir que no. Gracias por no soltarme."</em></li>
<li><em>"No ha sido nuestro mejor año. Ha sido el año que más me ha demostrado que quiero estar aquí."</em></li>
<li><em>"Celebrar esto hoy me parece casi un acto de terquedad. Vamos a celebrarlo igual."</em></li>
</ul>

<h2>Cortos, para acompañar un regalo</h2>
<ul>
<li><em>"Otro año. Otra vez tú."</em></li>
<li><em>"Sigo eligiéndote."</em></li>
<li><em>"Contigo hasta que te canses. Y luego un poco más."</em></li>
<li><em>"Feliz aniversario a la mejor decisión que he tomado."</em></li>
</ul>

<h2>Cómo hacer que no sea sólo un mensaje</h2>
<p>Un mensaje de WhatsApp se lee y queda enterrado bajo cincuenta más. Si quieres que dure, dale un sitio propio: algo que se pueda volver a abrir dentro de un año.</p>
<p>En <a href="/create">Love Pages puedes crear una página de aniversario gratis</a>: escribes el mensaje, eliges el diseño y le mandas un enlace único. Sabrás cuándo la abre y qué contesta. Si buscas ideas para el día en sí, mira también <a href="/blog/como-celebrar-aniversario-especial">cómo celebrar un aniversario especial</a>.</p>

<h2>Un consejo final</h2>
<p>El mejor mensaje de aniversario no es el más bonito: es el que sólo tiene sentido entre vosotros dos. Si alguien de fuera lo lee y no lo entiende del todo, vas por buen camino.</p>
        `,
    },
    {
        slug: 'como-pedir-perdon-a-tu-pareja',
        title: 'Cómo pedir perdón a tu pareja (y que sirva de algo)',
        description:
            'Qué hace que una disculpa funcione, los cinco errores que la convierten en otra discusión, ejemplos según lo que pasó y qué hacer si no te perdona.',
        category: 'Consejos',
        publishedAt: '2026-02-23',
        readingTime: 7,
        content: `
<p>Casi todas las disculpas fallan por la misma razón: quien pide perdón está intentando dejar de sentirse mal, no que la otra persona deje de sentirse mal. Y se nota. Este artículo va de la diferencia entre las dos cosas.</p>

<h2>Las cuatro partes de una disculpa que funciona</h2>
<ol>
<li><strong>Nombrar lo que hiciste, concretamente.</strong> No "siento lo de ayer" sino "siento haberte quitado la razón delante de tus amigos".</li>
<li><strong>Demostrar que entiendes el daño.</strong> "Te dejé en ridículo justo delante de la gente cuya opinión te importa."</li>
<li><strong>No añadir un "pero".</strong> Todo lo que va después de un "pero" borra lo que iba antes.</li>
<li><strong>Decir qué vas a hacer distinto.</strong> Sin esto, la disculpa es una promesa vacía y ambos lo sabéis.</li>
</ol>
<p>Fíjate en que en ninguna de las cuatro aparece la palabra "perdóname". Pedir perdón explícitamente es opcional; las cuatro partes no.</p>

<h2>Los cinco errores que la arruinan</h2>
<ul>
<li><strong>"Siento que te hayas sentido así."</strong> No es una disculpa: es culpar a la otra persona por su reacción.</li>
<li><strong>"Perdón, pero es que tú..."</strong> Convierte la disculpa en el siguiente asalto de la discusión.</li>
<li><strong>Disculparse demasiado rápido.</strong> Si contestas "vale, perdón" a los diez segundos, comunicas que quieres cerrar el tema, no entenderlo.</li>
<li><strong>Compensar en vez de reparar.</strong> Las flores no sustituyen a la conversación. Sirven después, no en lugar de.</li>
<li><strong>Pedir perdón muchas veces.</strong> Repetirlo traslada el peso a la otra persona, que acaba teniendo que consolarte.</li>
</ul>

<h2>Ejemplos según lo que pasó</h2>
<h3>Si dijiste algo hiriente en una discusión</h3>
<p><em>"Lo que te dije ayer sobre tu trabajo lo dije para hacerte daño y funcionó. No lo pienso, y aunque lo pensara no tenía por qué decirlo así. Sé que llevas meses inseguro con ese tema y usé justo eso."</em></p>
<h3>Si se te olvidó algo importante</h3>
<p><em>"Se me olvidó y no tengo excusa. Lo peor no es el día en sí, es que te haya hecho sentir que no eres una prioridad. Voy a apuntar las fechas que importan, que es lo mínimo."</em></p>
<h3>Si no estuviste cuando te necesitaba</h3>
<p><em>"Estabas mal y yo estaba con mis cosas. Me di cuenta y aun así no cambié de plan. Siento haberte dejado sola justo el día que no tocaba."</em></p>
<h3>Si fue un patrón, no un hecho aislado</h3>
<p><em>"No es la primera vez y por eso una disculpa suelta no vale de mucho. Llevo tiempo haciendo lo mismo. Lo que te puedo ofrecer no es una promesa sino un cambio que puedas ir comprobando."</em></p>

<h2>Por escrito o en persona</h2>
<p>En persona es mejor casi siempre, con una excepción: cuando la conversación en directo termina siempre en discusión. Escribirlo tiene tres ventajas concretas: puedes pensar antes de hablar, ella puede leerlo sin la presión de responder al momento, y queda constancia de lo que dijiste.</p>
<p>Si eliges escribirlo, evita el mensaje largo de WhatsApp: se lee entre otras cosas y se pierde. Una carta o una <a href="/create">página hecha para ella</a> tiene otro peso, porque el esfuerzo se nota antes incluso de leer el contenido.</p>

<h2>Después de disculparte</h2>
<p>Aquí es donde casi todo el mundo la estropea. Pedir perdón no da derecho a que te perdonen inmediatamente. Si respondes al silencio con impaciencia — "ya te pedí perdón, ¿qué más quieres?" — acabas de deshacerlo todo.</p>
<p>Lo correcto es dar espacio y demostrar el cambio en los días siguientes, no en el mensaje. Una disculpa se juzga a dos semanas vista, no en el momento.</p>

<h2>Si no te perdona</h2>
<p>Puede pasar: a veces porque el daño fue grande, a veces porque fue la gota que colmó algo más largo. Hay dos cosas que sí puedes controlar: no insistir hasta agotarla, y no convertir tu culpa en un problema que ella tenga que gestionar.</p>
<p>Y si te perdona, la única forma de que la disculpa haya valido algo es que dentro de seis meses ella pueda decir que cambiaste. Todo lo demás son palabras bien ordenadas.</p>

<p>¿Quieres decírselo de una forma que no se pierda entre mensajes? <a href="/create">Crea una página con tu disculpa</a>: es gratis y sabrás cuándo la abre.</p>
        `,
    },
];

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
    return blogPosts.map((p) => p.slug);
}
