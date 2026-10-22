import { test, expect } from '@playwright/test';

test('create 5 tickets with optional seeds and capture visual evidence', async ({page},testInfo) => {
  await page.goto('/predict');
  await expect(page.getByRole('heading', {name:/Tạo bộ vé/})).toBeVisible();
  await page.getByPlaceholder(/Nhập hạt giống/).fill('0812');
  await page.getByRole('button',{name:'Tạo 5 Vé'}).click();
  for(let i=0;i<5;i++){
    const ticket=page.getByTestId('ticket-'+i);
    await expect(ticket.locator('[aria-label^="Số "]')).toHaveCount(6);
    await expect(ticket.getByLabel('Số 08')).toBeVisible();
    await expect(ticket.getByLabel('Số 12')).toBeVisible();
  }
  await expect(page.getByText('22/45 số')).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('mega-645-generated.png'),fullPage:true});
  await page.getByRole('button',{name:'Tạo lại vé A'}).click();
  await expect(page.getByTestId('ticket-0').locator('[aria-label^="Số "]')).toHaveCount(6);
});

test('invalid favorites are rejected before ticket generation', async({page},testInfo)=>{
  await page.goto('/predict');
  await page.getByPlaceholder(/Nhập hạt giống/).fill('0101');
  await page.getByRole('button',{name:'Tạo 5 Vé'}).click();
  await expect(page.getByText('Vui lòng không nhập các số trùng nhau')).toBeVisible();
  await expect(page.getByTestId('ticket-0').locator('[aria-label="Ô trống"]')).toHaveCount(6);
  await page.screenshot({path:testInfo.outputPath('duplicate-validation.png'),fullPage:true});
});

test('mobile Power 6/55 editing, responsive and evidence', async({page},testInfo)=>{
  await page.goto('/predict');
  await page.getByRole('button',{name:'6/55'}).click();
  await expect(page.getByRole('button',{name:'Yêu thích số 55'})).toBeVisible();
  await page.getByRole('button',{name:'Yêu thích số 55'}).click();
  await page.getByRole('button',{name:'Tạo 5 Vé'}).click();
  await expect(page.getByTestId('ticket-0').getByLabel('Số 55')).toBeVisible();
  await page.getByTestId('ticket-1').getByRole('button',{name:'Chọn để chỉnh sửa'}).click();
  await page.getByRole('button',{name:'Xóa vé B'}).click();
  await expect(page.getByTestId('ticket-1').locator('[aria-label="Ô trống"]')).toHaveCount(6);
  await page.screenshot({path:testInfo.outputPath('power-655-edited.png'),fullPage:true});
  const overflow=await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});

test('dashboard navigation remains accessible',async({page},testInfo)=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/VIETLOTT|Vietlott/i}).first()).toBeVisible();
  await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:/Tạo Bộ Vé/i}).click();
  await expect(page).toHaveURL(/\/predict/);
  await page.screenshot({path:testInfo.outputPath('navigation.png'),fullPage:true});
});
