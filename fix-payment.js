// Quick script to manually mark user as paid
// Run with: node fix-payment.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixPayment() {
  // Get the most recent user
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, stripe_customer_id, has_paid')
    .order('created_at', { ascending: false })
    .limit(5)

  if (userError) {
    console.error('Error fetching users:', userError)
    return
  }

  console.log('Recent users:')
  users.forEach(user => {
    console.log(`- ID: ${user.id}, Stripe Customer: ${user.stripe_customer_id || 'none'}, Paid: ${user.has_paid}`)
  })

  // Find user with this customer ID
  const userWithCustomer = users.find(u => u.stripe_customer_id === 'cus_TcHGH5SgFykidl')

  if (userWithCustomer) {
    console.log(`\nUpdating payment status for user: ${userWithCustomer.id}`)

    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({
        has_paid: true,
        payment_date: new Date().toISOString()
      })
      .eq('id', userWithCustomer.id)
      .select()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return
    }

    console.log('✓ Payment status updated successfully!')
    console.log('You can now access /home')
  } else {
    console.log('\nNo user found with stripe_customer_id: cus_TcHGH5SgFykidl')
  }
}

fixPayment().catch(console.error)
