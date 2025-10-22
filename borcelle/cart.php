<?php
require_once 'config.php';

session_start();

$action = $_POST['action'] ?? '';

if ($action === 'checkout') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
        exit;
    }
    
    $cart = json_decode($_POST['cart'], true);
    $userId = $_SESSION['user_id'];
    
    if (empty($cart)) {
        echo json_encode(['success' => false, 'message' => 'Carrinho vazio']);
        exit;
    }
    
    try {
        $pdo = getDBConnection();
        $pdo->beginTransaction();
        
        // Calcular total
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        
        // Criar reserva
        $stmt = $pdo->prepare("INSERT INTO rentals (user_id, total_amount, status) VALUES (?, ?, 'pending')");
        $stmt->execute([$userId, $total]);
        $rentalId = $pdo->lastInsertId();
        
        // Adicionar itens da reserva
        foreach ($cart as $item) {
            $stmt = $pdo->prepare("INSERT INTO rental_items (rental_id, car_id, quantity, price) VALUES (?, ?, ?, ?)");
            $stmt->execute([$rentalId, $item['id'], $item['quantity'], $item['price']]);
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'rental_id' => $rentalId]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Erro ao processar reserva: ' . $e->getMessage()]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Ação inválida']);
}
?>