<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuração do banco de dados (usando as mesmas do config.php)
define('DB_HOST', 'localhost');
define('DB_NAME', 'borcelle');
define('DB_USER', 'root');
define('DB_PASS', '');

function testDatabaseConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        return [
            'success' => true,
            'message' => 'Conexão com MySQL estabelecida com sucesso!',
            'details' => [
                'host' => DB_HOST,
                'database' => DB_NAME,
                'user' => DB_USER,
                'version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
            ]
        ];
    } catch(PDOException $e) {
        return [
            'success' => false,
            'message' => 'Erro na conexão com o banco de dados',
            'error' => $e->getMessage(),
            'details' => [
                'host' => DB_HOST,
                'database' => DB_NAME,
                'user' => DB_USER
            ]
        ];
    }
}

function testDatabaseStructure() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Listar todas as tabelas
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $tablesInfo = [];
        foreach ($tables as $table) {
            // Contar registros
            $countStmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $count = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Obter estrutura
            $structureStmt = $pdo->query("DESCRIBE $table");
            $structure = $structureStmt->fetchAll(PDO::FETCH_ASSOC);
            
            $tablesInfo[] = [
                'name' => $table,
                'rows' => $count,
                'columns' => $structure
            ];
        }
        
        return [
            'success' => true,
            'message' => 'Estrutura do banco verificada com sucesso!',
            'tables' => $tablesInfo
        ];
    } catch(PDOException $e) {
        return [
            'success' => false,
            'message' => 'Erro ao verificar estrutura do banco',
            'error' => $e->getMessage()
        ];
    }
}

// Executar teste baseado no parâmetro action
$action = $_GET['action'] ?? 'connection';

if ($action === 'structure') {
    $result = testDatabaseStructure();
} else {
    $result = testDatabaseConnection();
}

echo json_encode($result);
?>