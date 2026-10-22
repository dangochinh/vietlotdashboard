import {test,expect} from '@playwright/test';
test('ticket builder loads and enforces user seed validation',async({page},testInfo)=>{
 await page.goto('/predict');
 await expect(page.getByRole('heading',{name:/Dự Đoán|Tạo bộ vé/i})).toBeVisible();
 await page.getByPlaceholder(/Nhập hạt giống/).fill('0101');
 await page.getByRole('button',{name:'Tạo 5 Vé'}).click();
 await expect(page.getByText(/trùng nhau/)).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('invalid-seed.png'),fullPage:true});
});
test('switching lottery mode updates the number grid',async({page},testInfo)=>{
 await page.goto('/predict');
 await page.getByRole('button',{name:'6/55'}).click();
 await expect(page.getByRole('button',{name:'55',exact:true})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('power-655.png'),fullPage:true});
});
