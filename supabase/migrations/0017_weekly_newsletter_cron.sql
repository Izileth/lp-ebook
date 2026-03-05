-- supabase/migrations/0017_weekly_newsletter_cron.sql

-- 1. Habilita as extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Função que percorre a lista e envia e-mails individuais
CREATE OR REPLACE FUNCTION public.run_weekly_newsletter_job()
RETURNS VOID AS $$
DECLARE
  resend_api_key TEXT := 'SUA_CHAVE_DO_RESEND_AQUI'; -- Substitua pela sua chave no SQL Editor
  sub RECORD;
  email_html TEXT;
  -- Altere para a URL de produção do seu site (ex: https://meusite.vercel.app)
  base_url TEXT := 'http://localhost:5173'; 
BEGIN
  -- Percorre todos os inscritos
  FOR sub IN SELECT email FROM public.newsletter_subscriptions LOOP
    
    -- Template HTML com link de cancelamento
    email_html := '
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
        <div style="border: 1px solid #eee; padding: 30px; border-radius: 10px; background-color: #fff;">
          <h1 style="font-size: 22px; color: #000; margin-bottom: 20px;">Sua dose semanal de conhecimento 📚</h1>
          <p style="font-size: 16px; line-height: 1.6;">Olá!</p>
          <p style="font-size: 16px; line-height: 1.6;">Aqui estão as novidades e conteúdos exclusivos que preparamos para você esta semana.</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">Destaque da Semana:</p>
            <p style="margin: 10px 0 0 0; color: #444;">Como os novos hábitos de leitura estão transformando a retenção de conhecimento no meio digital.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Para ler o conteúdo completo e conferir nossas novas ofertas, acesse nosso portal clicando no botão abaixo:</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="' || base_url || '" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">ACESSAR CONTEÚDO</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; font-size: 12px; color: #999; line-height: 1.5;">
            <p>Você recebeu este e-mail porque faz parte da nossa newsletter.</p>
            <p>
              Deseja parar de receber? 
              <br>
              <a href="' || base_url || '/unsubscribe?email=' || sub.email || '" 
                 style="color: #666; font-weight: bold; text-decoration: underline;">
                 Clique aqui para cancelar sua inscrição
              </a>
            </p>
          </div>
        </div>
      </div>';

    -- Dispara para o Resend de forma assíncrona (via pg_net)
    PERFORM net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || resend_api_key
      ),
      body := jsonb_build_object(
        'from', 'Newsletter <onboarding@resend.dev>',
        'to', ARRAY[sub.email],
        'subject', 'Novidades da Semana! 🚀',
        'html', email_html
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Agenda a tarefa (Cron)
-- '0 12 * * 1' -> Toda segunda-feira às 12:00 UTC (aprox. 09:00 no Brasil)
-- Remova o agendamento anterior se existir para evitar duplicidade
SELECT cron.unschedule('weekly-newsletter-job') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-newsletter-job');

SELECT cron.schedule(
  'weekly-newsletter-job',
  '0 12 * * 1',
  'SELECT public.run_weekly_newsletter_job()'
);
