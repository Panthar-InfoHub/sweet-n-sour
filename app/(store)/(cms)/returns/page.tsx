import React from 'react'

const page = () => {
  return (
    <div>
        <h1>Return Policy</h1>
        <section>
            <h2>General Guidelines</h2>
            <p>Items can be returned within 30 days of purchase with original receipt.</p>
            <ul>
                <li>Items must be unused and in original packaging</li>
                <li>Shipping costs are non-refundable</li>
                <li>Store credit or refund will be issued within 5-7 business days</li>
            </ul>
        </section>
        <section>
            <h2>Non-Returnable Items</h2>
            <ul>
                <li>Sale or clearance items</li>
                <li>Personal care products</li>
                <li>Gift cards</li>
            </ul>
        </section>
        <section>
            <h2>How to Return</h2>
            <ol>
                <li>Pack the item securely</li>
                <li>Include original receipt</li>
                <li>Ship to our returns department</li>
            </ol>
        </section>
    </div>
  )
}

export default page