<?php
/**
 * procesar_correo.php
 * Backend para procesar el formulario de contacto de Voeux Media.
 * Recibe datos vía POST, sanitiza, construye el correo y lo envía vía SMTP (Titan).
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Importar PHPMailer (Asegúrate de haber subido la carpeta PHPMailer a public_html)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Importar credenciales seguras
if (file_exists('env.php')) {
    $env = require 'env.php';
}
else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno: Falta archivo de configuración.']);
    exit;
}

// ── Cabeceras de seguridad y CORS ─────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

// ── Helpers de sanitización ───────────────────────────────────────────────
function limpiar_texto(string $valor): string
{
    $valor = trim($valor);
    $valor = stripslashes($valor);
    $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
    return $valor;
}

function limpiar_correo(string $valor)
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
if (empty($nombre) || $correo === false || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Por favor, completa todos los campos correctamente.']);
    exit;
}

// ── Cuerpo del correo (Tu diseño original) ───────────────────────────────
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

$asunto_email = !empty($asunto)
    ? "[Contacto Voeux] " . $asunto . " — " . $nombre
    : "[Contacto Voeux] Nuevo mensaje de " . $nombre;

// ── Instanciar y configurar PHPMailer (El Motor SMTP) ─────────────────────
$mail = new PHPMailer(true);

try {
    // Configuración del servidor (Titan)
    $mail->isSMTP();
    $mail->Host = 'smtp.titan.email';
    $mail->SMTPAuth = true;
    $mail->Username = 'contacto@voeuxmedia.com';
    $mail->Password = $env['SMTP_PASS']; // <-- Contraseña segura importada de env.php
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    // Remitente y Destinatario
    // IMPORTANTE: El 'From' debe ser el mismo correo autenticado para evitar Spam
    $mail->setFrom('contacto@voeuxmedia.com', 'Sitio Web Voeux Media');
    $mail->addAddress('contacto@voeuxmedia.com', 'Voeux Media Contacto');

    // El 'Reply-To' permite que el cliente le responda directo al visitante
    $mail->addReplyTo($correo, $nombre);

    // Contenido
    $mail->isHTML(true); // Lo mandamos como HTML para que los saltos de línea se vean bien
    $mail->Subject = $asunto_email;
    $mail->Body = nl2br($cuerpo); // Convierte los \n a <br>
    $mail->AltBody = $cuerpo; // Versión en texto plano para clientes de correo antiguos

    // Enviar
    $mail->send();

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.'
    ]);

}
catch (Exception $e) {
    http_response_code(500);
    // Registramos el error en el log del servidor para depurar, pero no lo mostramos al usuario por seguridad
    error_log("Error de PHPMailer al enviar correo: " . $mail->ErrorInfo);
    echo json_encode([
        'status' => 'error',
        'message' => 'Hubo un problema técnico al enviar el mensaje. Por favor, intenta de nuevo más tarde.'
    ]);
}
