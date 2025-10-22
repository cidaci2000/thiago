<?php
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo "=== TESTE DO PHP ===\n\n";

// Informações básicas do PHP
echo "✅ PHP Version: " . PHP_VERSION . "\n";
echo "✅ Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A') . "\n";
echo "✅ Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "\n\n";

// Extensões necessárias
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'session'];
echo "=== EXTENSÕES PHP ===\n";
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✅ $ext: CARREGADA\n";
    } else {
        echo "❌ $ext: NÃO CARREGADA\n";
    }
}

// Configurações importantes
echo "\n=== CONFIGURAÇÕES PHP ===\n";
$settings = [
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'display_errors' => ini_get('display_errors')
];

foreach ($settings as $key => $value) {
    echo "🔧 $key: $value\n";
}

// Teste de escrita em diretórios
echo "\n=== PERMISSÕES DE ARQUIVO ===\n";
$directories = ['.', 'php', 'css', 'js'];
foreach ($directories as $dir) {
    if (is_writable($dir)) {
        echo "✅ $dir: GRAVÁVEL\n";
    } else {
        echo "⚠️ $dir: NÃO GRAVÁVEL\n";
    }
}

// Teste de funções importantes
echo "\n=== FUNÇÕES PHP ===\n";
$functions = ['json_encode', 'json_decode', 'session_start', 'password_hash'];
foreach ($functions as $func) {
    if (function_exists($func)) {
        echo "✅ $func: DISPONÍVEL\n";
    } else {
        echo "❌ $func: NÃO DISPONÍVEL\n";
    }
}

echo "\n=== TESTE COMPLETO DO PHP ===\n";
echo "✅ Se você está vendo esta mensagem, o PHP está funcionando!\n";
?>