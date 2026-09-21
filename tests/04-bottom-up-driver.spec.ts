import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';

// =====================================================
// DRIVER A
// ทำหน้าที่แทน Login Layer ด้านบน
// ไม่กรอก username/password ผ่านหน้า Login
// =====================================================
async function driverOpenCart(
  context: BrowserContext
): Promise<Page> {

  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/cart.html');

  await page.evaluate(() => {
    const studentDiv = document.createElement('div');
    studentDiv.setAttribute('data-test', 'student-info');
    studentDiv.style.fontSize = '18px';
    studentDiv.style.fontWeight = 'bold';
    studentDiv.style.color = 'green';
    studentDiv.style.padding = '10px';
    studentDiv.textContent = 'ผู้จัดทำ (Driver): วรรณวิลัย เรืองนาค';
    document.body.prepend(studentDiv);
  });
  return page;
}

test('Bottom-Up DRIVER: Driver -> Card HTML Integration', async ({ browser }) => {
  const context = await browser.newContext();

  try {
    // ===================================================
    // Driver A เรียก Layer ด้านล่าง
    // ===================================================
    const page = await driverOpenCart(context);

    // ===================================================
    // B = Inventory จริง
    // ===================================================
    await expect(page.locator('.cart_contents"]')).toBeVisible();

    // ===================================================
    // E = Add Cart จริง
    // ===================================================
    await expect(
      page.locator('[data-test="student-info"]')
    ).toContainText('วรรณวิลัย เรืองนาค');

  } finally {
    await context.close();
  }
});

// npx playwright test tests/04-bottom-up-driver.spec.ts --headed
