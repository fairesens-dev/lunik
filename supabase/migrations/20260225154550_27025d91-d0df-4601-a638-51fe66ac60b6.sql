SELECT cron.schedule(
  'process-abandoned-carts-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://gejgtkgqyzdfbsbxujgl.supabase.co/functions/v1/process-abandoned-carts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlamd0a2dxeXpkZmJzYnh1amdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NzI0NzQsImV4cCI6MjA4NzU0ODQ3NH0.f8CjuMpWZZj8Drgo8GBzENwofDSPerDGXqwXAGDaXEc"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);