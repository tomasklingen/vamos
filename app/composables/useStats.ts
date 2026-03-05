import { db } from "~/utils/db"

export function useStats() {
	const totalCards = ref(0)
	const totalReviews = ref(0)
	const accuracy = ref(0)
	const streak = ref(0)

	onMounted(async () => {
		const [cards, allReviews] = await Promise.all([
			$fetch<{ id: number }[]>("/api/cards"),
			db.reviews.toArray(),
		])

		totalCards.value = cards.length
		totalReviews.value = allReviews.length

		const correct = allReviews.filter((r) => r.rating >= 3).length
		accuracy.value = allReviews.length > 0 ? Math.round((correct / allReviews.length) * 100) : 0

		const today = new Date()
		const days = [...new Set(allReviews.map((r) => r.reviewed_at.slice(0, 10)))].sort().reverse()
		let s = 0
		for (let i = 0; i < days.length; i++) {
			const expected = new Date(today)
			expected.setDate(today.getDate() - i)
			const expectedStr = expected.toISOString().slice(0, 10)
			if (days[i] === expectedStr) {
				s++
			} else {
				break
			}
		}
		streak.value = s
	})

	return { totalCards, totalReviews, accuracy, streak }
}
