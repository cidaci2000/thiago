<?php
// Inclui o arquivo de configuração (deve conter a variável $conexao)
// Ex: $conexao = mysqli_connect("localhost", "root", "senha", "nome_do_banco");
include_once('config.php');

// Define variáveis para armazenar mensagens de erro e de sucesso
$errors = [];
$success_message = '';

// Inicializa variáveis para preencher o formulário (manter dados após erro)
$nome = '';
$email = '';
$dataNascimento = '';
$cpf = '';
$telefone = '';
$celular = '';
$endereco = '';

// Variável global para a conexão
global $conexao; 

// --- Lógica de Processamento do Formulário ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Obter os Dados do Formulário (Sem sanitização rigorosa para simplificar, conforme solicitado)
    $nome              = trim($_POST['name'] ?? '');
    $email             = trim($_POST['email'] ?? '');
    $dataNascimento    = trim($_POST['dataNascimento'] ?? '');
    $cpf               = trim($_POST['cpf'] ?? '');
    $telefone          = trim($_POST['phone'] ?? '');
    $celular           = trim($_POST['celular'] ?? '');
    $endereco          = trim($_POST['endereco'] ?? '');
    $password          = $_POST['password'] ?? '';
    $confirmPassword   = $_POST['confirm-password'] ?? '';

    // --- Bloco de Validação Mínima (Apenas para garantir que o insert será tentado) ---
    if (empty($nome) || empty($email) || empty($password)) {
        $errors['geral'] = "Preencha pelo menos Nome, E-mail e Senha para continuar.";
    } elseif ($password !== $confirmPassword) {
        $errors['confirm-password'] = "As senhas não coincidem.";
    }

    // 4. Processamento Final (Apenas se não houver erros mínimos)
    if (empty($errors)) {
        // Criptografia da Senha (MANTIDA por segurança mínima e boa prática)
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Tenta a inserção no banco de dados
        $insercao_ok = inserirUsuarioSimples($nome, $email, $dataNascimento, $cpf, $telefone, $celular, $endereco, $hashed_password);

        if ($insercao_ok) {
            $success_message = "🥳 Dados Inseridos com sucesso!";
            // Limpa as variáveis após sucesso
            $nome = $email = $dataNascimento = $cpf = $telefone = $celular = $endereco = '';
        } else {
            // Captura o erro do MySQL para debug. ESSENCIAL para saber porque falhou.
            $erro_db = mysqli_error($conexao);
            error_log("Erro no MySQL: " . $erro_db);
            $errors['db'] = "Erro na Inserção SQL. Detalhes: " . htmlspecialchars($erro_db);
        }
    }
}

// --- Função de Insert Simplificada e Corrigida ---

function inserirUsuarioSimples($nome, $email, $dataNascimento, $cpf, $telefone, $celular, $endereco, $senha) {
    global $conexao;
    
    // ATENÇÃO: Remoção de mysqli_real_escape_string para simplicidade acadêmica.
    // Isso torna o código vulnerável, mas atende ao pedido de 'sem análise dos dados'.

    // Garantindo que a data seja formatada corretamente para o SQL
    $data_sql = empty($dataNascimento) ? NULL : $dataNascimento;
    
    // A query corrigida e direta:
    $sql = "INSERT INTO usuarios (nome, email, data_nascimento, cpf, telefone, celular, endereco, senha) 
            VALUES ('$nome', '$email', '$data_sql', '$cpf', '$telefone', '$celular', '$endereco', '$senha')";
    
    return mysqli_query($conexao, $sql);
}


// As funções validarCPF, validarTelefone, emailExiste foram removidas para atender ao pedido de 'sem análise dos dados'.

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Usuário (Acadêmico)</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        .error-message { color: red; margin-top: 5px; font-size: 0.9em; padding: 5px; border: 1px solid red; }
        .success-message { color: green; padding: 10px; border: 1px solid green; background-color: #e6ffe6; margin-bottom: 20px; text-align: center; }
        .form-group.error .form-input { border: 1px solid red; }
        .full-width { grid-column: 1 / -1; }
        .auth-form { max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #ccc; border-radius: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-input { width: 90%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn-primary { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>

    <?php if ($success_message): ?>
        <div class="success-message"><?php echo htmlspecialchars($success_message); ?></div>
    <?php endif; ?>

    <?php if (isset($errors['db']) || isset($errors['geral'])): ?>
        <div class="error-message full-width">❌ <?php echo htmlspecialchars($errors['db'] ?? $errors['geral']); ?></div>
    <?php endif; ?>

    <form class="auth-form" method="POST" novalidate>
        <h2>Cadastro Simples (Demonstração Acadêmica)</h2>
        <div class="form-grid">

            <div class="form-group <?php echo isset($errors['name']) ? 'error' : ''; ?>">
                <label for="name" class="form-label">Nome Completo *</label>
                <input type="text" id="name" name="name" required class="form-input" 
                        value="<?php echo htmlspecialchars($nome); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['email']) ? 'error' : ''; ?>">
                <label for="email" class="form-label">E-mail *</label>
                <input type="email" id="email" name="email" required class="form-input"
                        value="<?php echo htmlspecialchars($email); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['dataNascimento']) ? 'error' : ''; ?>">
                <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                <input type="date" id="dataNascimento" name="dataNascimento" class="form-input"
                        value="<?php echo htmlspecialchars($dataNascimento); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['cpf']) ? 'error' : ''; ?>">
                <label for="cpf" class="form-label">CPF</label>
                <input type="text" id="cpf" name="cpf" class="form-input" maxlength="14"
                        value="<?php echo htmlspecialchars($cpf); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['phone']) ? 'error' : ''; ?>">
                <label for="phone" class="form-label">Telefone</label>
                <input type="tel" id="phone" name="phone" class="form-input"
                        value="<?php echo htmlspecialchars($telefone); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['celular']) ? 'error' : ''; ?>">
                <label for="celular" class="form-label">Celular</label>
                <input type="tel" id="celular" name="celular" class="form-input"
                        value="<?php echo htmlspecialchars($celular); ?>">
            </div>

            <div class="form-group <?php echo isset($errors['password']) ? 'error' : ''; ?>">
                <label for="password" class="form-label">Senha *</label>
                <input type="password" id="password" name="password" required class="form-input">
            </div>

            <div class="form-group <?php echo isset($errors['confirm-password']) ? 'error' : ''; ?>">
                <label for="confirm-password" class="form-label">Confirmar Senha *</label>
                <input type="password" id="confirm-password" name="confirm-password" required class="form-input">
                <?php if (isset($errors['confirm-password'])): ?>
                    <p class="error-message"><?php echo htmlspecialchars($errors['confirm-password']); ?></p>
                <?php endif; ?>
            </div>

            <div class="form-group full-width <?php echo isset($errors['endereco']) ? 'error' : ''; ?>">
                <label for="endereco" class="form-label">Endereço Completo</label>
                <input type="text" id="endereco" name="endereco" class="form-input"
                        value="<?php echo htmlspecialchars($endereco); ?>">
            </div>
        </div>

        <div class="form-actions" style="margin-top: 20px;">
            <button type="submit" class="btn-primary large full-width">
                Criar Conta
            </button>
        </div>

        <div class="auth-footer" style="text-align: center; margin-top: 15px;">
            <p>Já tem uma conta? <a href="login.php" class="auth-link">Faça login</a></p>
        </div>
    </form>

    <script>
    // Máscaras JS mantidas para melhor usabilidade, mas não afetam a lógica PHP
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        e.target.value = value;
    });

    function mascaraTelefone(elemento) {
        elemento.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) { 
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                if (value.length > 13) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                } else { 
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                }
            }
            e.target.value = value;
        });
    }

    mascaraTelefone(document.getElementById('phone'));
    mascaraTelefone(document.getElementById('celular'));
    </script>
</body>
</html>