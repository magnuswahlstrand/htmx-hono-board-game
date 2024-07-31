export const appliedDamage = (currentHealth: number, damage: number) => {
    return Math.min(damage, currentHealth)
}