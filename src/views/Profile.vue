<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface ProfileUser {
	id?: number | string | null
	first_name?: string
	last_name?: string
	name?: string
	email?: string | null
	role?: string
	is_guest?: boolean
}

const user = ref<ProfileUser | null>(null)

onMounted(() => {
	try {
		const savedUser = localStorage.getItem('user')
		user.value = savedUser ? (JSON.parse(savedUser) as ProfileUser) : null
	} catch {
		user.value = null
	}
})

const displayName = computed(() => {
	const fullName = [user.value?.first_name, user.value?.last_name]
		.filter(Boolean)
		.join(' ')

	return user.value?.name?.trim() || fullName || 'User'
})

const initials = computed(() =>
	displayName.value
		.split(/\s+/)
		.slice(0, 2)
		.map(part => part.charAt(0).toUpperCase())
		.join(''),
)

const accountType = computed(() =>
	user.value?.is_guest ? 'Guest' : user.value?.role || 'User',
)
</script>

<template>
	<main class="profile-page">
		<section v-if="user" class="profile-panel">
			<header class="profile-header">
				<div class="avatar" aria-hidden="true">{{ initials }}</div>
				<div>
					<p class="eyebrow">Account profile</p>
					<h1>{{ displayName }}</h1>
					<p class="account-type">{{ accountType }} account</p>
				</div>
			</header>

			<div class="profile-details">
				<div class="detail-row">
					<span class="detail-label">Full name</span>
					<span class="detail-value">{{ displayName }}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Email</span>
					<span class="detail-value">{{ user.email || 'Not provided' }}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Role</span>
					<span class="detail-value">{{ accountType }}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Account ID</span>
					<span class="detail-value">{{ user.id ?? 'Not available' }}</span>
				</div>
			</div>
		</section>

		<section v-else class="empty-profile">
			<i class="pi pi-user" aria-hidden="true"></i>
			<h1>Profile unavailable</h1>
			<p>No user information is saved in this browser.</p>
		</section>
	</main>
</template>

<style scoped>
.profile-page {
	min-height: calc(100vh - 138px);
	padding: 48px 24px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background: #f8fffb;
}

.profile-panel {
	width: min(100%, 720px);
	overflow: hidden;
	background: #fff;
	border: 1px solid #e4eee8;
	border-radius: 12px;
	box-shadow: 0 12px 32px rgba(16, 64, 43, 0.07);
}

.profile-header {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 32px;
	border-bottom: 1px solid #e8eee9;
}

.avatar {
	width: 72px;
	height: 72px;
	flex: 0 0 72px;
	display: grid;
	place-items: center;
	border-radius: 50%;
	background: #e4f7ec;
	color: #067647;
	font-size: 24px;
	font-weight: 700;
}

.eyebrow {
	margin: 0 0 5px;
	color: #07804e;
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
}

.profile-header h1,
.empty-profile h1 {
	margin: 0;
	color: #101828;
	font-size: 28px;
}

.account-type {
	margin: 6px 0 0;
	color: #667085;
}

.profile-details {
	padding: 8px 32px 20px;
}

.detail-row {
	min-height: 58px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 24px;
	border-bottom: 1px solid #edf1ee;
}

.detail-row:last-child {
	border-bottom: 0;
}

.detail-label {
	color: #667085;
}

.detail-value {
	color: #101828;
	font-weight: 600;
	text-align: right;
	overflow-wrap: anywhere;
}

.empty-profile {
	width: min(100%, 520px);
	padding: 48px 24px;
	text-align: center;
	background: #fff;
	border: 1px solid #e4eee8;
	border-radius: 12px;
}

.empty-profile > i {
	margin-bottom: 16px;
	color: #07804e;
	font-size: 32px;
}

.empty-profile p {
	margin: 10px 0 0;
	color: #667085;
}

@media (max-width: 560px) {
	.profile-page {
		padding: 24px 16px;
	}

	.profile-header {
		padding: 24px;
		gap: 14px;
	}

	.avatar {
		width: 58px;
		height: 58px;
		flex-basis: 58px;
		font-size: 20px;
	}

	.profile-header h1 {
		font-size: 23px;
	}

	.profile-details {
		padding: 8px 24px 16px;
	}
}
</style>