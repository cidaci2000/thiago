<?php
require_once 'config.php';

session_start();

$action = $_POST['action'] ?? '';

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
        exit;
    }
    
    try {
        $pdo = getDBConnection();
        
        // Buscar usuário
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro no servidor']);
    }
    
} elseif ($action === 'register') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
        exit;
    }
    
    try {
        $pdo = getDBConnection();
        
        // Verificar se email já existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email já cadastrado']);
            exit;
        }
        
        // Criar usuário
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hashedPassword]);
        
        $userId = $pdo->lastInsertId();
        $_SESSION['user_id'] = $userId;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email
            ]
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
    }
    
} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ação inválida']);
}
?>