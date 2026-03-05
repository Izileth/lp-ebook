-- supabase/migrations/0016_direct_newsletter_email.sql

-- 1. Habilita a extensão pg_net (permite requisições HTTP dentro do Postgres)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Cria a função que será disparada pelo Trigger
-- Esta função faz o POST direto para a API do Resend
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  resend_api_key TEXT := 're_QT3i4w4D_Nic1kvdQ9Pxzg2HrSzamKQyX'; -- Coloque sua chave do Resend aqui (em breve te mostro como proteger)
  response_id BIGINT;
BEGIN
  -- Chamada HTTP via pg_net
  SELECT net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || resend_api_key
    ),
    body := jsonb_build_object(
      'from', 'Newsletter <onboarding@resend.dev>', -- Troque pelo seu domínio verificado
      'to', ARRAY[NEW.email],
      'subject', 'Bem-vindo à nossa Newsletter! 📚',
      'html', '<h1>Obrigado por se inscrever!</h1><p>Em breve você receberá nossos conteúdos exclusivos diretamente no seu e-mail: ' || NEW.email || '</p>'
    )
  ) INTO response_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Cria o Trigger que dispara a função no INSERT
DROP TRIGGER IF EXISTS on_newsletter_subscription_email ON public.newsletter_subscriptions;
CREATE TRIGGER on_newsletter_subscription_email
AFTER INSERT ON public.newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.send_welcome_email();
