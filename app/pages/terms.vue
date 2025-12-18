<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-16 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Terms of Service
        </h1>
        <p class="text-slate-500">Last updated: December 2024</p>
      </div>
    </section>

    <section class="py-16 px-6">
      <div class="container mx-auto max-w-4xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate lg:prose-lg hover:prose-a:text-primary">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using MyWaterCloset, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

        <h3>2. Description of Service</h3>
        <p>MyWaterCloset is a marketplace platform that connects individuals and businesses ("Providers") who have restroom facilities to share with individuals ("Users") seeking to use such facilities.</p>

        <h3>3. User Responsibilities</h3>
        <p>Users agree to use facilities respectfully, maintain cleanliness, and adhere to any specific house rules set by the Provider. Users are liable for any damage caused during their visit.</p>

        <h3>4. Provider Responsibilities</h3>
        <p>Providers must ensure their facilities meet our Quality Standards, including cleanliness, safety, and functionality. Providers must accurately represent their facilities in their listings.</p>

        <h3>5. Payments and Fees</h3>
        <p>We use Stripe to process payments. Users are charged at the time of booking. MyWaterCloset collects a platform fee from each transaction to support the service.</p>

        <h3>6. Limitation of Liability</h3>
        <p>MyWaterCloset is not a party to the rental agreement between Users and Providers. We are not responsible for the conduct of any user or the condition of any facility.</p>
        
        <h3>7. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
      </div>
    </section>
  </div>
</template>
