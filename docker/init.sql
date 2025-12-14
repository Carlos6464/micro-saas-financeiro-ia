CREATE DATABASE IF NOT EXISTS despesas_auth;
CREATE DATABASE IF NOT EXISTS despesas_finance;

-- Garante permissões (opcional, mas evita dor de cabeça)
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;