import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('complete booking flow from login to zoom link', async ({ page }) => {
    // Login flow
    await page.click('[data-testid="login-button"]')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.click('[data-testid="magic-link-button"]')
    
    // Mock magic link verification
    await page.goto('/auth/callback?token=test-token')
    
    // Select role as learner
    await page.click('[data-testid="learner-role"]')
    await page.click('[data-testid="continue-button"]')
    
    // Browse experts
    await expect(page.locator('[data-testid="experts-list"]')).toBeVisible()
    await page.click('[data-testid="expert-card"]:first-child')
    
    // View expert profile
    await expect(page.locator('[data-testid="expert-profile"]')).toBeVisible()
    await page.click('[data-testid="book-session-button"]')
    
    // Select time slot
    await page.click('[data-testid="time-slot"]:first-child')
    await page.click('[data-testid="confirm-booking-button"]')
    
    // Payment flow
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible()
    await page.fill('[data-testid="card-number"]', '4242424242424242')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    await page.fill('[data-testid="card-cvc"]', '123')
    await page.click('[data-testid="pay-button"]')
    
    // Booking confirmation
    await expect(page.locator('[data-testid="booking-pending"]')).toBeVisible()
    
    // Mock expert acceptance (would normally be done by expert)
    await page.goto('/api/test/accept-booking?bookingId=test-booking-id')
    
    // Check for zoom link
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="zoom-link"]')).toBeVisible()
  })
  
  test('booking rejection flow', async ({ page }) => {
    // Similar setup as above...
    
    // Mock expert rejection
    await page.goto('/api/test/reject-booking?bookingId=test-booking-id')
    
    // Check for rejection notification
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="booking-rejected"]')).toBeVisible()
  })
  
  test('cancellation and refund flow', async ({ page }) => {
    // Test cancellation within 24h window
    await page.goto('/dashboard')
    await page.click('[data-testid="cancel-booking-button"]')
    await page.click('[data-testid="confirm-cancel-button"]')
    
    await expect(page.locator('[data-testid="cancellation-success"]')).toBeVisible()
  })
})