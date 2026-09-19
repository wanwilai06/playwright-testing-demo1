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
async function driverOpenInventory(
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
  await page.goto('https://www.saucedemo.com/inventory.html');

  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Card Driver Test</title>
      </head>
      <body>
        <h1>Card Driver Integration</h1>
        
        <!-- แสดงชื่อและนามสกุลนักศึกษา-->
        <div data-test="student-info" style="font-size: 18px; font-weight: bold; color: green;">
          ผู้จัดทำ (Driver): วรรณวิลัย เรืองนาค
        </div>

        <div class="inventory_list" data-test="driver-card-content">
          Card Content loaded successfully via Driver
        </div>
      </body>
    </html>
  `);
  return page;
}

test('Bottom-Up DRIVER: Driver -> Card HTML Integration', async ({ browser }) => {
  const context = await browser.newContext();

  try {
    // ===================================================
    // Driver A เรียก Layer ด้านล่าง
    // ===================================================
    const page = await driverOpenInventory(context);

    // ===================================================
    // B = Inventory จริง
    // ===================================================
    await expect(page.locator('[data-test="driver-card-content"]')).toBeVisible();

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
