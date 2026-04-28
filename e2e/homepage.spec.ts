import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('renders nav links', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="loader"]', { state: 'detached', timeout: 8000 })
    await expect(page.getByText('Michael Truong')).toBeVisible({ timeout: 4000 })
    await expect(page.getByText('Work')).toBeVisible()
    await expect(page.getByText('Creative')).toBeVisible()
  })

  test('renders project cards from project data', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="loader"]', { state: 'detached', timeout: 8000 })
    await expect(page.getByText('Product Design')).toBeVisible({ timeout: 4000 })
    await expect(page.getByText('Redesigning the checkout flow')).toBeVisible()
  })
})
