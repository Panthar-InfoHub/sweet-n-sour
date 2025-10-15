import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Shipping Policy</h1>
      <section>
        <h2>Processing Time</h2>
        <p>Orders are typically processed within 1-2 business days.</p>
      </section>

      <section>
        <h2>Shipping Methods</h2>
        <p>We offer standard and express shipping options:</p>
        <ul>
          <li>Standard Shipping: 5-7 business days</li>
          <li>Express Shipping: 2-3 business days</li>
        </ul>
      </section>

      <section>
        <h2>Shipping Costs</h2>
        <p>Shipping costs are calculated based on:</p>
        <ul>
          <li>Package weight</li>
          <li>Delivery destination</li>
          <li>Selected shipping method</li>
        </ul>
      </section>

      <section>
        <h2>Order Tracking</h2>
        <p>A tracking number will be provided via email once your order ships.</p>
      </section>
    </div>
  )
}

export default page