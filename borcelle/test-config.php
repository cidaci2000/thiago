<?php
/**
 * Arquivo para testar a configuração do banco de dados
 * Acesse via: http://localhost/borcelle/test-config.php
 */

// Tentar carregar a configuração principal
try {
    require_once 'php/config.php';
    echo "<h1>✅ Configuração Carregada com Sucesso</h1>";
    
    // Testar conexão
    $pdo = getDBConnection();
    echo "<p>✅ Conexão com o banco estabelecida!</p>";
    
    // Mostrar informações do banco
    $stmt = $pdo->query("SELECT DATABASE() as db, USER() as user");
    $info = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<h2>Informações da Conexão:</h2>";
    echo "<ul>";
    echo "<li>Banco de Dados: " . $info['db'] . "</li>";
    echo "<li>Usuário: " . $info['user'] . "</li>";
    echo "<li>Host: " . DB_HOST . "</li>";
    echo "</ul>";
    
    // Listar tabelas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h2>Tabelas no Banco:</h2>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>" . $table . "</li>";
    }
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<h1>❌ Erro na Configuração</h1>";
    echo "<p><strong>Erro:</strong> " . $e->getMessage() . "</p>";
    
    echo "<h2>Configuração Atual:</h2>";
    echo "<ul>";
    echo "<li>DB_HOST: " . DB_HOST . "</li>";
    echo "<li>DB_NAME: " . DB_NAME . "</li>";
    echo "<li>DB_USER: " . DB_USER . "</li>";
    echo "<li>DB_PASS: " . (DB_PASS ? '***' : 'vazio') . "</li>";
    echo "</ul>";
    
    echo "<h2>Solução de Problemas:</h2>";
    echo "<ol>";
    echo "<li>Verifique se o MySQL está rodando</li>";
    echo "<li>Confirme o nome do banco de dados</li>";
    echo "<li>Verifique usuário e senha do MySQL</li>";
    echo "<li>Execute o script SQL para criar as tabelas</li>";
    echo "</ol>";
}

// Testar se os diretórios existem
echo "<h2>Verificação de Diretórios:</h2>";
echo "<ul>";
$dirs = ['php', 'css', 'js', 'database'];
foreach ($dirs as $dir) {
    if (is_dir($dir)) {
        echo "<li>✅ $dir/ - Existe</li>";
    } else {
        echo "<li>❌ $dir/ - Não encontrado</li>";
    }
}
echo "</ul>";

// Testar se os arquivos principais existem
echo "<h2>Verificação de Arquivos:</h2>";
echo "<ul>";
$files = [
    'php/config.php',
    'php/auth.php', 
    'php/products.php',
    'php/cart.php',
    'js/main.js',
    'js/auth.js',
    'js/products.js',
    'js/cart.js',
    'css/style.css',
    'database/borcelle.sql'
];

foreach ($files as $file) {
    if (file_exists($file)) {
        echo "<li>✅ $file - Existe</li>";
    } else {
        echo "<li>❌ $file - Não encontrado</li>";
    }
}
echo "</ul>";
?>