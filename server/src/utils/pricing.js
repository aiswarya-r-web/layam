export const FREE_DELIVERY_THRESHOLD = 999
export const DELIVERY_FEE = 49

export const deliveryChargeFor = (subtotal) =>
  subtotal >= FREE_DELIVERY_THRESHOLD || subtotal <= 0 ? 0 : DELIVERY_FEE

export const applyCoupon = (coupon, subtotal) => {
  if (!coupon) return 0
  let discount =
    coupon.discountType === 'percentage'
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue
  if (coupon.maximumDiscount) {
    discount = Math.min(discount, coupon.maximumDiscount)
  }
  return Math.min(Math.round(discount * 100) / 100, subtotal)
}
