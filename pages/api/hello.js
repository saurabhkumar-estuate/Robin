// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  console.log('Got a trigger event from zendesk.')

  res.status(200).json({ name: 'John Doe' })
}

// Scenarios

// 1. User is active, in that case we will assign other user.
// 2. What if all the users are inactive? The ticket will go back to bucket.
// 3. Schedule cron-jobs to automatically trigger for bucket jobs.
