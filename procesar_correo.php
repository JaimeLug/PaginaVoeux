<?php
/**
 * procesar_correo.php
 * Backend para procesar el formulario de contacto de Voeux Media.
 * Recibe datos vía POST, sanitiza, construye el correo y lo envía.
 * Responde siempre con JSON estricto: { "status": "...", "message": "..." }
 */

// ── Cabeceras de seguridad y CORS ─────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Solo permitir peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

// ── Helpers de sanitización ───────────────────────────────────────────────

/**
 * Limpia una cadena de texto plano (sin HTML).
 */
function limpiar_texto(string $valor): string
{
    $valor = trim($valor);
    $valor = stripslashes($valor);
    $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
    return $valor;
}

/**
 * Valida y limpia un correo electrónico.
 * Devuelve false si no es válido.
 */
function limpiar_correo(string $valor): string|false
{
    $valor = trim($valor);
    $valor = filter_var($valor, FILTER_SANITIZE_EMAIL);
    if (!filter_var($valor, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    return $valor;
}

// ── Leer y sanitizar los datos del formulario ─────────────────────────────
$nombre = limpiar_texto($_POST['nombre'] ?? '');
$correo = limpiar_correo($_POST['correo'] ?? '');
$asunto = limpiar_texto($_POST['asunto'] ?? '');
$mensaje = limpiar_texto($_POST['mensaje'] ?? '');

// ── Validaciones básicas ──────────────────────────────────────────────────
if (empty($nombre)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'El nombre es requerido.']);
    exit;
}

if ($correo === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'El correo electrónico no es válido.']);
    exit;
}

if (empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'El mensaje es requerido.']);
    exit;
}

// ── Configuración del correo ──────────────────────────────────────────────
$destinatario = 'contacto@voeuxmedia.com';
$remitente = 'noreply@voeuxmedia.com';

$asunto_email = !empty($asunto)
    ? "[Contacto Voeux] " . $asunto . " — " . $nombre
    : "[Contacto Voeux] Nuevo mensaje de " . $nombre;

// ── Cuerpo del correo (texto plano) ──────────────────────────────────────
$cuerpo = "Nuevo mensaje desde el formulario de contacto de VoeuxMedia.com\n";
$cuerpo .= str_repeat("─", 60) . "\n\n";
$cuerpo .= "NOMBRE:  " . $nombre . "\n";
$cuerpo .= "CORREO:  " . $correo . "\n";
if (!empty($asunto)) {
    $cuerpo .= "ASUNTO:  " . $asunto . "\n";
}
$cuerpo .= "\nMENSAJE:\n" . $mensaje . "\n\n";
$cuerpo .= str_repeat("─", 60) . "\n";
$cuerpo .= "Este correo fue generado automáticamente desde voeuxmedia.com\n";

// ── Cabeceras del correo ──────────────────────────────────────────────────
$cabeceras = "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
$cabeceras .= "Content-Transfer-Encoding: 8bit\r\n";
$cabeceras .= "From: Voeux Media <" . $remitente . ">\r\n";
$cabeceras .= "Reply-To: " . $nombre . " <" . $correo . ">\r\n";
$cabeceras .= "X-Mailer: PHP/" . phpversion();

// ── Envío del correo ──────────────────────────────────────────────────────
$enviado = mail($destinatario, $asunto_email, $cuerpo, $cabeceras);

if ($enviado) {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.'
    ]);
}
else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Hubo un problema al enviar el mensaje. Por favor intenta de nuevo o escríbenos directamente a contacto@voeuxmedia.com.'
    ]);
}
