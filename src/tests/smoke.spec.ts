import { test, expect } from '@playwright/test';

test('Главная страница открывается без ошибок и содержит заголовок', async ({ page }) => {
  const consoleErrors: string[] = [];

  // Слушаем консоль браузера на предмет ошибок
  page.on('pageerror', (exception) => {
    consoleErrors.push(exception.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Открываем главную страницу (путь '/' относительно baseURL)
  await page.goto('/');

  // 1. Проверяем, что заголовок <h1> существует и его текст не пустой
  const h1 = page.locator('h1');
  await expect(h1).toBeVisible();
  
  const h1Text = await h1.innerText();
  expect(h1Text.trim().length).toBeGreaterThan(0);

  // 2. Проверяем, что во время загрузки страницы в консоли не было ошибок
  expect(consoleErrors).toEqual([]);
});