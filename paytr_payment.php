<?php
$merchant_id = "545707";
$merchant_key = "oKcT1rxT7usncA4K";
$merchant_salt = "zBWb4eAD4BCf9Pcr";

$user_ip = $_SERVER['REMOTE_ADDR'];
$email = "kullanici@mail.com"; // Kullanıcının e-posta adresi
$payment_amount = 10000; // 100.00 TL için (kuruş cinsinden)
$merchant_oid = rand(100000,999999); // Rastgele sipariş numarası
$success_url = "basarili.php";
$fail_url = "hata.php";

// Hash oluştur
$hash_str = $merchant_id . $user_ip . $merchant_oid . $email . $payment_amount . $success_url . $fail_url . $merchant_salt;
$paytr_token = base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));

$post_values = array(
    "merchant_id" => $merchant_id,
    "user_ip" => $user_ip,
    "merchant_oid" => $merchant_oid,
    "email" => $email,
    "payment_amount" => $payment_amount,
    "success_url" => $success_url,
    "fail_url" => $fail_url,
    "paytr_token" => $paytr_token,
);

// PayTR'a yönlendir
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/api");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_values));
$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>
