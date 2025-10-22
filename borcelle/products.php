<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'get_all') {
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->query("SELECT * FROM cars WHERE available = 1");
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'cars' => $cars]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao buscar carros']);
    }
    
} elseif ($action === 'get_by_category') {
    $category = $_GET['category'] ?? '';
    
    if (empty($category)) {
        echo json_encode(['success' => false, 'message' => 'Categoria não especificada']);
        exit;
    }
    
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("SELECT * FROM cars WHERE category = ? AND available = 1");
        $stmt->execute([$category]);
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'cars' => $cars]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao buscar carros']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Ação inválida']);
}
?>