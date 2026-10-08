<?php

require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load .env variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
header('Content-Type: application/json');

$response = new stdClass();

// Server validation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name      = filter_input(INPUT_POST, 'full_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email          = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone_number = filter_input(INPUT_POST, 'phone_number', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message        = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if (!$full_name || !$email || !$message) {

        http_response_code(400);
        $response->msg = "Polja ime i prezime, email, i poruka su obavezna i moraju biti ispravno popunjena.";
        $response->status = "fail";
        echo json_encode($response);
        exit;

    }

    $mail = new PHPMailer(true);

    try {

        // SMTP settings from .env file
        $mail->isSMTP();
        $mail->Host       = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USERNAME'];
        $mail->Password   = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $_ENV['MAIL_PORT'];

        $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
        $mail->addReplyTo($email, $full_name);
        $mail->addAddress($_ENV['MAIL_TO']);

        $mail->isHTML(false);
        $mail->Subject = "Upit sa kontakt forme";
        $mail->Body    = "Ime: $full_name\nEmail: $email\nBroj telefona:\n$phone_number\n\nPoruka:\n$message\n";

        $mail->send();

        $response->msg = "Hvala vam na poruci! Vaš upit je uspešno primljen. Možete očekivati odgovor u najkraćem mogućem roku.";
        $response->status = "success";
        echo json_encode($response);
        exit;

    } catch (Exception $e) {

        http_response_code(500);

        $response->msg = "Došlo je do greške pri slanju poruke. Molimo pokušajte ponovo.";
        $response->status = "fail";
        echo json_encode($response);
        exit;

    }
} else {
    http_response_code(405);
    $response->msg = "Nedozvoljena metoda zahteva.";
    $response->status = "fail";
    echo json_encode($response);
    exit;
}
