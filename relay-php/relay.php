<?php
// Ретранслятор заявок на почту. Лежит на российском хостинге (REG.RU), потому что сервер сайта не достаёт до Telegram.
// Принимает POST JSON {name, phone, email, message} с заголовком X-Relay-Secret и отправляет письмо.

// === НАСТРОЙКИ ===
$SECRET = 'ВСТАВЬТЕ_СЕКРЕТ';                 // тот же, что RELAY_SECRET на хостинге сайта
$TO     = 'innovaesg@mail.ru';               // получатели; можно несколько через запятую
$FROM   = 'noreply@innovadar.ru';            // адрес отправителя (домен сайта)
// =================

header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method Not Allowed'); }

$given = isset($_SERVER['HTTP_X_RELAY_SECRET']) ? $_SERVER['HTTP_X_RELAY_SECRET'] : '';
if ($SECRET === 'ВСТАВЬТЕ_СЕКРЕТ' || !hash_equals($SECRET, $given)) { http_response_code(403); exit('Forbidden'); }

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { http_response_code(400); exit('Bad Request'); }

// Убираем переводы строк из полей, попадающих в заголовки письма
$clean = function ($v, $max) { $v = is_string($v) ? $v : ''; return mb_substr(trim(preg_replace('/[\r\n]+/', ' ', $v)), 0, $max); };
$name  = $clean(isset($data['name']) ? $data['name'] : '', 100);
$phone = $clean(isset($data['phone']) ? $data['phone'] : '', 30);
$email = $clean(isset($data['email']) ? $data['email'] : '', 120);
$msg   = is_string(isset($data['message']) ? $data['message'] : '') ? mb_substr(trim($data['message']), 0, 1500) : '';
if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(400); exit('Bad Request'); }

$subject = '=?UTF-8?B?' . base64_encode('Новая заявка резидента с сайта') . '?=';
$body = "Новая заявка резидента\r\n\r\nИмя: $name\r\nТелефон: $phone\r\nПочта: $email\r\n" . ($msg !== '' ? "О проекте: $msg\r\n" : '');
$headers = "From: $FROM\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\nMIME-Version: 1.0";

if (mail($TO, $subject, $body, $headers)) { echo 'ok'; } else { http_response_code(502); echo 'mail error'; }
