-- Script para resetar a tabela de interações e o contador de IDs
-- Execute isso no SQL Editor do Supabase

TRUNCATE TABLE interactions RESTART IDENTITY;

-- Opcional: Se quiser deletar apenas os dados sem resetar o ID auto-incremental:
-- DELETE FROM interactions;
