import { db } from "~/utils/db"

export function useStats() {
	const { data: cards } = useCards()
	const totalCards = computed(() => cards.value.length)
	const totalReviews = ref(0)
	const accuracy = ref(0)
	const streak = ref(0)

	onMounted(async () => {
		const allReviews = await db.reviews.toArray()
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
