import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('renders nav with name and social links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Michael Truong')).toBeVisible()
    await expect(page.getByRole('link', { name: /linkedin/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
  })

  test('center cell is visible on load', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/intro/i)).toBeVisible()
  })

  test('scroll sections exist in the DOM', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('About')).toBeAttached()
    await expect(page.getByText('Skills')).toBeAttached()
    await expect(page.getByText('Contact')).toBeAttached()
  })
})
